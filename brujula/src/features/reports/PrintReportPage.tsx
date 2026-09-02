import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, CalendarDays, Printer, UserRound } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Isotipo } from '@/branding/Logo'
import {
  useActivities,
  useConsultant,
  useModuleProgress,
  useObservations,
  useReflections,
  useSessions,
} from '@/hooks/queries'
import { generateSnapshot } from '@/features/engine/compassEngine'
import { buildInformeCompleto } from '@/features/engine/reportNarrative'
import { AFFINITY_TIER, DIMENSION_LABELS, STAGES } from '@/lib/constants'
import { MODULES } from '@/data/modules'
import { edad, fechaLarga, nombreCompleto } from '@/lib/utils'
import type { Activity } from '@/types'

const TITULOS: Record<string, string> = {
  profesional: 'Informe profesional de orientación vocacional',
  carta: 'Carta de Navegación',
  familia: 'Resumen del proceso — para la familia',
  consultante: 'Tu resumen del proceso',
}

/** Lectura cualitativa del promedio 1-5 de una categoría de un test interno
 * (Test de Intereses, Cuestionario de Aptitudes, Test de Inteligencias
 * Múltiples). Nunca se muestra el número, solo esta etiqueta. */
function tierLabel(avg: number): string {
  if (avg >= 4.5) return 'muy marcado'
  if (avg >= 3.5) return 'marcado'
  if (avg >= 2.5) return 'moderado'
  if (avg >= 1.5) return 'bajo'
  return 'muy bajo'
}

/** Promedio por categoría de los ítems tipo 'escala' de una actividad (los
 * cuestionarios/tests internos), ordenado de mayor a menor. */
function testCategoryAverages(a: Activity): { categoria: string; avg: number }[] {
  const porCategoria = new Map<string, number[]>()
  for (const q of a.preguntas) {
    if (q.tipo !== 'escala' || !q.categoria) continue
    const r = a.respuestas.find((x) => x.questionId === q.id)
    const v = r ? Number(r.texto) : NaN
    if (!Number.isFinite(v)) continue
    porCategoria.set(q.categoria, [...(porCategoria.get(q.categoria) ?? []), v])
  }
  return [...porCategoria.entries()]
    .map(([categoria, valores]) => ({ categoria, avg: valores.reduce((a, b) => a + b, 0) / valores.length }))
    .sort((x, y) => y.avg - x.avg)
}

export default function PrintReportPage() {
  const { consultantId, tipo = 'profesional' } = useParams<{ consultantId: string; tipo: string }>()
  const user = useAuthStore((s) => s.user)
  const { data: consultant } = useConsultant(consultantId)
  const { data: activities = [] } = useActivities()
  const { data: reflections = [] } = useReflections()
  const { data: observations = [] } = useObservations()
  const { data: sessions = [] } = useSessions()
  const { data: progress = [] } = useModuleProgress()

  const snap = useMemo(() => {
    if (!consultant) return null
    return generateSnapshot({
      consultant,
      activities: activities.filter((a) => a.consultantId === consultant.id),
      reflections: reflections.filter((r) => r.consultantId === consultant.id),
      observations: observations.filter((o) => o.consultantId === consultant.id),
      sessions: sessions.filter((s) => s.consultantId === consultant.id),
      progress,
    })
  }, [consultant, activities, reflections, observations, sessions, progress])

  const narrativa = useMemo(() => {
    if (!consultant || !snap) return null
    const propias = activities.filter((a) => a.consultantId === consultant.id)
    const sesionesRealizadas = sessions.filter((s) => s.consultantId === consultant.id && s.estado === 'realizada')
    const completados = MODULES.filter(
      (m) => progress.find((p) => p.consultantId === consultant.id && p.moduleId === m.id)?.estado === 'completado',
    )
    return buildInformeCompleto(consultant, propias, snap.perfil, snap.carta, {
      sesiones: sesionesRealizadas.length,
      modulosCompletados: completados.length,
      modulosTotales: MODULES.length,
    })
  }, [consultant, snap, activities, sessions, progress])

  // Autorización fina: el consultante solo ve SU resumen (y su carta); el resto es del profesional.
  const esConsultante = user?.role === 'consultante'
  if (esConsultante && (user?.consultantId !== consultantId || !['consultante', 'carta'].includes(tipo))) {
    return <Navigate to="/mi" replace />
  }

  if (!consultant || !snap || !narrativa) return null

  const volverA = esConsultante ? '/mi/avances' : `/pro/consultantes/${consultant.id}`

  const sesionesRealizadas = sessions.filter((s) => s.consultantId === consultant.id && s.estado === 'realizada')
  const actividadesHechas = activities.filter(
    (a) => a.consultantId === consultant.id && (a.estado === 'completada' || a.estado === 'revisada'),
  )
  const completados = MODULES.filter(
    (m) => progress.find((p) => p.consultantId === consultant.id && p.moduleId === m.id)?.estado === 'completado',
  )
  const actividadesConsultante = activities.filter((a) => a.consultantId === consultant.id)
  const reflexionesConsultante = reflections.filter((r) => r.consultantId === consultant.id)

  const H = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-2 mt-8 border-b border-neutral-200 pb-1 text-[15px] font-semibold tracking-tight">
      {children}
    </h2>
  )

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* barra de acciones (no se imprime) */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b bg-surface px-6 py-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to={volverA}>
            <ArrowLeft /> {esConsultante ? 'Volver a mis avances' : 'Volver a la ficha'}
          </Link>
        </Button>
        <p className="text-[12.5px] text-muted-foreground">
          Para guardar como PDF: Imprimir → destino «Guardar como PDF»
        </p>
        <Button size="sm" onClick={() => window.print()}>
          <Printer /> Imprimir / PDF
        </Button>
      </div>

      <div className="mx-auto max-w-[760px] px-8 py-10 text-[13px] leading-relaxed">
        {/* membrete */}
        <header className="mb-8 overflow-hidden rounded-2xl border border-neutral-300">
          <div className="flex items-center gap-5 border-b border-neutral-200 px-7 py-6">
            <Isotipo size={72} className="shrink-0" />
            <div className="h-16 w-px shrink-0 bg-neutral-200" />
            <div className="flex-1 text-center">
              <h1 className="font-display text-[26px] font-medium tracking-tight text-primary-strong sm:text-[30px]">
                Método Brújula
              </h1>
              <p className="font-display mt-0.5 flex items-center justify-center gap-2.5 text-[12.5px] italic text-warning">
                <span className="h-px w-6 bg-warning/40" /> Encontrá tu norte. Construí tu camino.{' '}
                <span className="h-px w-6 bg-warning/40" />
              </p>
              <p className="font-display mt-1.5 text-[13.5px] font-semibold uppercase tracking-wide text-primary-strong">
                {TITULOS[tipo] ?? TITULOS.profesional}
              </p>
            </div>
          </div>

          {(tipo === 'profesional' || tipo === 'familia') && user && (
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 border-b border-neutral-200 px-6 py-2 text-[11.5px]">
              <span className="font-semibold text-warning">{nombreCompleto(user)}</span>
              {user.titulo && (
                <>
                  <span className="text-neutral-300">|</span>
                  <span className="text-neutral-600">{user.titulo}</span>
                </>
              )}
              {user.matricula && (
                <>
                  <span className="text-neutral-300">|</span>
                  <span className="text-neutral-600">{user.matricula}</span>
                </>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-6 py-3 text-[11.5px] text-neutral-700">
            <span className="flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} /> Consultante:{' '}
              <strong className="font-medium">{nombreCompleto(consultant)}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} /> Edad:{' '}
              <strong className="font-medium">{edad(consultant.fechaNacimiento)} años</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} /> Fecha:{' '}
              <strong className="font-medium">{fechaLarga(new Date().toISOString())}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} /> Institución:{' '}
              <strong className="font-medium">
                {consultant.escuela}
                {consultant.curso ? ` — ${consultant.curso}` : ''}
              </strong>
            </span>
          </div>
        </header>

        {tipo === 'consultante' && (
          <p className="mb-6 text-neutral-600">Para {consultant.nombre}, con todo lo que descubriste hasta acá.</p>
        )}

        {/* ================= INFORME PROFESIONAL ================= */}
        {tipo === 'profesional' && (
          <>
            {narrativa.secciones.map((seccion, idx) => (
              <div key={seccion.titulo}>
                <H>
                  {idx + 1}. {seccion.titulo}
                </H>
                {seccion.parrafos.map((parrafo, i) => (
                  <p key={i} className="mb-3 whitespace-pre-wrap text-neutral-700">
                    {parrafo}
                  </p>
                ))}
              </div>
            ))}

            <p className="mt-8 border-t border-neutral-200 pt-4 text-[13px] italic text-neutral-600">
              «{narrativa.cartaCierre}»
            </p>
          </>
        )}

        {/* ================= CARTA DE NAVEGACIÓN ================= */}
        {tipo === 'carta' && (
          <>
            <H>El rumbo</H>
            <p>{snap.carta.rumbo}</p>

            {snap.carta.brujulaInterior.length > 0 && (
              <>
                <H>Tu brújula interior</H>
                <p className="text-neutral-700">
                  Lo que te orienta cuando todo lo demás se mueve:{' '}
                  <strong>{snap.carta.brujulaInterior.join(' · ')}</strong>
                </p>
              </>
            )}

            <H>Vientos a favor</H>
            <ul className="list-disc pl-5">
              {snap.carta.vientosAFavor.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>

            <H>Vientos en contra</H>
            <ul className="list-disc pl-5">
              {snap.carta.vientosEnContra.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>

            <H>Territorios sugeridos</H>
            {snap.carta.sugerencias.map((s) => (
              <div key={s.areaId} className="mb-4">
                <p className="font-semibold">
                  {s.area} <span className="font-normal text-neutral-500">· {AFFINITY_TIER[s.nivel].label}</span>
                </p>
                <p className="text-[12px] text-neutral-500">{s.carreras.join(' · ')}</p>
                <p className="mt-1 font-medium text-neutral-600">¿Por qué aparece en tu carta?</p>
                <ul className="list-disc pl-5 text-neutral-700">
                  {s.motivos.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            ))}

            <H>Próximas escalas</H>
            <ol className="list-decimal pl-5">
              {snap.carta.escalas.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ol>
          </>
        )}

        {/* ================= FAMILIA ================= */}
        {tipo === 'familia' && (
          <>
            <p className="mt-4 text-neutral-700">
              Este resumen acerca a la familia el recorrido que {consultant.nombre} viene haciendo en su proceso de
              orientación vocacional. No es un veredicto ni un resultado: es una foto de un camino en construcción.
            </p>

            <H>Qué se trabajó hasta ahora</H>
            <p>
              {consultant.nombre} completó {completados.length} de los 12 módulos del método
              {completados.length > 0 && (
                <> ({completados.map((m) => m.nombre.toLowerCase()).join(', ')})</>
              )}
              , participó de {sesionesRealizadas.length} sesiones y realizó {actividadesHechas.length} actividades de
              autoconocimiento y exploración.
            </p>

            <H>Qué está apareciendo</H>
            <p>{snap.carta.rumbo}</p>
            {snap.carta.sugerencias.length > 0 && (
              <ul className="mt-2 list-disc pl-5">
                {snap.carta.sugerencias.slice(0, 3).map((s) => (
                  <li key={s.areaId}>
                    <strong>{s.area}</strong> ({AFFINITY_TIER[s.nivel].label.toLowerCase()}): {s.motivos[0]}
                  </li>
                ))}
              </ul>
            )}

            <H>Cómo acompañar desde casa</H>
            <ul className="list-disc pl-5">
              <li>Pregunten por el proceso, no por el resultado: «¿qué descubriste?» abre más que «¿ya sabés qué vas a estudiar?».</li>
              <li>Eviten opinar sobre carreras «buenas» o «malas»: cada comentario pesa más de lo que parece.</li>
              <li>Habiliten la exploración: acompañar a una charla, facilitar una visita, presentar a un conocido de un área de interés.</li>
              <li>Confíen en los tiempos: decidir bien lleva más tiempo que decidir rápido, y se decide mejor con apoyo que con presión.</li>
            </ul>

            <H>Próximos pasos del proceso</H>
            <ul className="list-disc pl-5">
              {snap.carta.escalas.slice(0, 3).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </>
        )}

        {/* ================= CONSULTANTE ================= */}
        {tipo === 'consultante' && (
          <>
            <p className="mt-4 text-neutral-700">
              {consultant.nombre}: este documento es tuyo. Junta lo más importante que fuiste descubriendo en el
              proceso. Leelo cuando dudes: acá está tu propia voz.
            </p>

            <H>Tu recorrido, paso a paso</H>
            <p className="mb-3 text-[11.5px] text-neutral-500">
              Todo lo que fuiste haciendo y descubriendo, módulo a módulo — en sesión o enviado durante la semana.
            </p>
            {MODULES.map((m) => {
              const acts = actividadesConsultante.filter(
                (a) => a.moduleId === m.id && (a.respuestas.some((r) => r.texto.trim()) || a.feedbackProfesional?.trim()),
              )
              const reflMod = reflexionesConsultante.filter((r) => r.moduleId === m.id)
              if (!acts.length && !reflMod.length) return null
              return (
                <div key={m.id} className="mb-4">
                  <p className="font-semibold">{m.nombre}</p>
                  {acts.map((a) => (
                    <div key={a.id} className="mt-2 rounded-lg border border-neutral-200 p-3">
                      <p className="font-medium">
                        {a.titulo}{' '}
                        <span className="font-normal text-[11px] text-neutral-400">
                          {a.fechaCompletada
                            ? `· completada ${fechaLarga(a.fechaCompletada)}`
                            : a.fechaAsignada
                              ? `· asignada ${fechaLarga(a.fechaAsignada)}`
                              : ''}
                        </span>
                      </p>
                      {(() => {
                        const preguntasAbiertas = a.preguntas.filter((q) => q.tipo !== 'escala')
                        const hayAbiertas = preguntasAbiertas.some((q) =>
                          a.respuestas.find((r) => r.questionId === q.id)?.texto.trim(),
                        )
                        const categorias = testCategoryAverages(a)
                        if (!hayAbiertas && categorias.length === 0) {
                          return <p className="mt-1 text-[12px] italic text-neutral-400">Todavía sin respuestas.</p>
                        }
                        return (
                          <>
                            {hayAbiertas && (
                              <dl className="mt-1.5 space-y-1.5">
                                {preguntasAbiertas.map((q) => {
                                  const r = a.respuestas.find((x) => x.questionId === q.id)
                                  if (!r || !r.texto.trim()) return null
                                  return (
                                    <div key={q.id}>
                                      <dt className="text-[11.5px] font-medium text-neutral-500">{q.texto}</dt>
                                      <dd className="whitespace-pre-wrap text-neutral-700">{r.texto}</dd>
                                    </div>
                                  )
                                })}
                              </dl>
                            )}
                            {categorias.length > 0 && (
                              <div className="mt-1.5">
                                <p className="text-[11.5px] font-medium text-neutral-500">
                                  Lectura por categoría (cualitativa, nunca un puntaje):
                                </p>
                                <ul className="mt-1 list-disc pl-5 text-neutral-700">
                                  {categorias.map((c) => (
                                    <li key={c.categoria}>
                                      <strong>{c.categoria}:</strong> {tierLabel(c.avg)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )
                      })()}
                      {a.feedbackProfesional?.trim() && (
                        <p className="mt-1.5 text-[12.5px]">
                          <span className="font-medium text-neutral-500">Devolución de tu profesional: </span>
                          {a.feedbackProfesional}
                        </p>
                      )}
                    </div>
                  ))}
                  {reflMod.map((r) => (
                    <p key={r.id} className="mt-1.5 whitespace-pre-wrap text-neutral-700">
                      <span className="font-medium text-neutral-500">Tu reflexión «{r.titulo}»: </span>
                      {r.contenido}
                    </p>
                  ))}
                </div>
              )
            })}

            <H>Lo que descubriste de vos</H>
            {snap.perfil
              .filter((p) => p.destacados.length > 0)
              .map((p) => (
                <p key={p.dimension} className="mb-1.5">
                  <strong>{DIMENSION_LABELS[p.dimension]}:</strong> {p.destacados.join(', ')}
                </p>
              ))}

            <H>Tu rumbo, hoy</H>
            <p>{snap.carta.rumbo}</p>

            <H>Tus próximos pasos</H>
            <ol className="list-decimal pl-5">
              {snap.carta.escalas.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ol>

            <H>Para recordar</H>
            <p className="italic text-neutral-700">
              Elegir no es encontrar «la respuesta correcta»: es construir un camino propio, con lo que sabés de vos
              y lo que vas a seguir descubriendo. Y siempre se puede recalcular: la brújula va con vos.
            </p>
          </>
        )}

        {/* firma profesional: solo en los documentos que redacta la profesional
            (nunca en 'consultante', que habla en segunda persona) */}
        {(tipo === 'profesional' || tipo === 'familia') && user && (
          <div className="mt-8 border-t border-neutral-200 pt-4">
            <p className="font-semibold">{nombreCompleto(user)}</p>
            {user?.titulo && <p className="text-neutral-600">{user.titulo}</p>}
            {user?.matricula && <p className="text-neutral-600">{user.matricula}</p>}
            {user?.telefono && <p className="text-neutral-600">{user.telefono}</p>}
          </div>
        )}

        {/* recorrido por etapas (todas las versiones) */}
        <H>{tipo === 'consultante' ? 'Tu recorrido por el método' : 'Recorrido por el método'}</H>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(STAGES) as (keyof typeof STAGES)[]).map((stage) => (
            <div key={stage} className="min-w-[130px] flex-1 rounded-lg border border-neutral-200 p-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                {STAGES[stage].nombre}
              </p>
              {MODULES.filter((m) => m.etapa === stage).map((m) => {
                const p = progress.find((x) => x.consultantId === consultant.id && x.moduleId === m.id)
                const done = p?.estado === 'completado'
                const doing = p?.estado === 'en_progreso'
                return (
                  <p key={m.id} className="mt-1 text-[11.5px]">
                    <span className={done ? 'text-teal-700' : doing ? 'text-violet-600' : 'text-neutral-400'}>
                      {done ? '● ' : doing ? '◐ ' : '○ '}
                    </span>
                    {m.nombre}
                  </p>
                )
              })}
            </div>
          ))}
        </div>

        <footer className="mt-10 border-t border-neutral-200 pt-4 text-[11px] leading-relaxed text-neutral-500">
          <p>{snap.notaMetodologica}</p>
          <p className="mt-2">
            Método Brújula · Psicope con Ire · Encontrá tu norte. Construí tu camino. — Documento generado el{' '}
            {fechaLarga(snap.generadoEl)}.
          </p>
        </footer>
      </div>
    </div>
  )
}
