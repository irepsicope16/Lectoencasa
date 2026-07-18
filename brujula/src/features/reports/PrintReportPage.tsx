import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Isotipo } from '@/branding/Logo'
import {
  useActivities,
  useConsultant,
  useEvaluations,
  useModuleProgress,
  useObservations,
  useReflections,
  useSessions,
} from '@/hooks/queries'
import { generateSnapshot } from '@/features/engine/compassEngine'
import { AFFINITY_TIER, DIMENSION_LABELS, STAGES } from '@/lib/constants'
import { MODULES } from '@/data/modules'
import { edad, fechaLarga, nombreCompleto } from '@/lib/utils'
import { overallProgress } from '@/lib/progress'

const TITULOS: Record<string, string> = {
  profesional: 'Informe profesional de orientación vocacional',
  carta: 'Carta de Navegación',
  familia: 'Resumen del proceso — para la familia',
  consultante: 'Tu resumen del proceso',
}

export default function PrintReportPage() {
  const { consultantId, tipo = 'profesional' } = useParams<{ consultantId: string; tipo: string }>()
  const user = useAuthStore((s) => s.user)
  const { data: consultant } = useConsultant(consultantId)
  const { data: activities = [] } = useActivities()
  const { data: evaluations = [] } = useEvaluations()
  const { data: reflections = [] } = useReflections()
  const { data: observations = [] } = useObservations()
  const { data: sessions = [] } = useSessions()
  const { data: progress = [] } = useModuleProgress()

  const snap = useMemo(() => {
    if (!consultant) return null
    return generateSnapshot({
      consultant,
      activities: activities.filter((a) => a.consultantId === consultant.id),
      evaluations: evaluations.filter((e) => e.consultantId === consultant.id),
      reflections: reflections.filter((r) => r.consultantId === consultant.id),
      observations: observations.filter((o) => o.consultantId === consultant.id),
      sessions: sessions.filter((s) => s.consultantId === consultant.id),
      progress,
    })
  }, [consultant, activities, evaluations, reflections, observations, sessions, progress])

  // Autorización fina: el consultante solo ve SU resumen (y su carta); el resto es del profesional.
  const esConsultante = user?.role === 'consultante'
  if (esConsultante && (user?.consultantId !== consultantId || !['consultante', 'carta'].includes(tipo))) {
    return <Navigate to="/mi" replace />
  }

  if (!consultant || !snap) return null

  const volverA = esConsultante ? '/mi/avances' : `/pro/consultantes/${consultant.id}`

  const pct = overallProgress(progress, consultant.id)
  const sesionesRealizadas = sessions.filter((s) => s.consultantId === consultant.id && s.estado === 'realizada')
  const actividadesHechas = activities.filter(
    (a) => a.consultantId === consultant.id && (a.estado === 'completada' || a.estado === 'revisada'),
  )
  const completados = MODULES.filter(
    (m) => progress.find((p) => p.consultantId === consultant.id && p.moduleId === m.id)?.estado === 'completado',
  )

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
        <header className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-5">
          <div className="flex items-center gap-3">
            <Isotipo size={44} />
            <div>
              <p className="text-[15px] font-semibold tracking-tight">Método Brújula</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Psicope con Ire</p>
            </div>
          </div>
          <div className="text-right text-[11.5px] text-neutral-500">
            <p>Orientación vocacional y reorientación profesional</p>
            <p>{fechaLarga(new Date().toISOString())}</p>
          </div>
        </header>

        <h1 className="text-xl font-semibold tracking-tight">{TITULOS[tipo] ?? TITULOS.profesional}</h1>
        <p className="mt-1 text-neutral-600">
          {tipo === 'consultante' ? (
            <>Para {consultant.nombre}, con todo lo que descubriste hasta acá.</>
          ) : (
            <>
              {nombreCompleto(consultant)} · {edad(consultant.fechaNacimiento)} años · {consultant.escuela} ·{' '}
              {consultant.curso}
            </>
          )}
        </p>

        {/* ================= INFORME PROFESIONAL ================= */}
        {tipo === 'profesional' && (
          <>
            <H>1. Datos del proceso</H>
            <table className="w-full text-[12.5px]">
              <tbody>
                {[
                  ['Consultante', `${nombreCompleto(consultant)} (${edad(consultant.fechaNacimiento)} años)`],
                  ['Institución', `${consultant.escuela} — ${consultant.curso}`],
                  ['Inicio del proceso', fechaLarga(consultant.fechaInicio)],
                  ['Sesiones realizadas', String(sesionesRealizadas.length)],
                  ['Actividades completadas', String(actividadesHechas.length)],
                  ['Módulos completados', `${completados.length} de 12 (${pct}% del recorrido)`],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-neutral-100">
                    <td className="w-48 py-1.5 pr-4 font-medium text-neutral-500">{k}</td>
                    <td className="py-1.5">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <H>2. Motivo de consulta</H>
            <p>{consultant.motivoConsulta}</p>

            <H>3. Síntesis por dimensión</H>
            {snap.perfil
              .filter((p) => p.intensidad !== 'incipiente' || p.evidencias.length > 0)
              .map((p) => (
                <div key={p.dimension} className="mb-3">
                  <p className="font-semibold">
                    {p.titulo} <span className="font-normal text-neutral-500">· intensidad {p.intensidad}</span>
                  </p>
                  <p className="text-neutral-700">{p.sintesis}</p>
                  {p.evidencias.length > 0 && (
                    <ul className="mt-1 list-disc pl-5 text-[12px] text-neutral-500">
                      {p.evidencias.slice(0, 3).map((e, i) => (
                        <li key={i}>
                          [{e.fuente}] {e.detalle}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

            <H>4. Rumbo y áreas sugeridas</H>
            <p className="mb-3">{snap.carta.rumbo}</p>
            {snap.carta.sugerencias.map((s) => (
              <div key={s.areaId} className="mb-3">
                <p className="font-semibold">
                  {s.area} <span className="font-normal text-neutral-500">· {AFFINITY_TIER[s.nivel].label}</span>
                </p>
                <ul className="list-disc pl-5 text-neutral-700">
                  {s.motivos.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
                {s.tensiones && <p className="mt-1 text-[12px] italic text-neutral-500">{s.tensiones[0]}</p>}
              </div>
            ))}

            <H>5. Recomendaciones y próximos pasos</H>
            <ul className="list-disc pl-5">
              {snap.carta.escalas.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
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
