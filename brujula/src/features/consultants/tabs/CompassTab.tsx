import { useMemo, useState } from 'react'
import { Compass, History, RefreshCw, TrendingUp, Wind } from 'lucide-react'
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared'
import {
  useActivities,
  useCreate,
  useEvaluations,
  useObservations,
  useReflections,
  useSessions,
  useModuleProgress,
  useSnapshots,
} from '@/hooks/queries'
import { generateSnapshot } from '@/features/engine/compassEngine'
import { AFFINITY_TIER } from '@/lib/constants'
import { fechaHora } from '@/lib/utils'
import { NativeSelect } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { db } from '@/services/storage/db'
import type { CompassSnapshot, Consultant } from '@/types'

/** cuántos análisis históricos se conservan por consultante */
const MAX_SNAPSHOTS = 10

const intensidadBadge = { alta: 'aqua', media: 'lavanda', incipiente: 'gris' } as const

export function CompassTab({ consultant }: { consultant: Consultant }) {
  const { data: activities = [] } = useActivities()
  const { data: evaluations = [] } = useEvaluations()
  const { data: reflections = [] } = useReflections()
  const { data: observations = [] } = useObservations()
  const { data: sessions = [] } = useSessions()
  const { data: progress = [] } = useModuleProgress()
  const { data: snapshots = [] } = useSnapshots()
  const createSnapshot = useCreate<CompassSnapshot>('snapshots', () => ({
    actor: 'profesional',
    consultantId: consultant.id,
    tipo: 'informe_generado',
    descripcion: `Motor Brújula ejecutado para ${consultant.nombre}`,
  }))

  const history = useMemo(
    () =>
      snapshots
        .filter((s) => s.consultantId === consultant.id)
        .sort((a, b) => b.generadoEl.localeCompare(a.generadoEl)),
    [snapshots, consultant.id],
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const latest = (selectedId && history.find((s) => s.id === selectedId)) || history[0]
  const previous = history[history.indexOf(latest) + 1]

  // Evolución respecto del análisis anterior: qué áreas entraron/salieron de «brújula firme»
  const evolucion = useMemo(() => {
    if (!latest || !previous) return null
    const firmes = (s: CompassSnapshot) =>
      new Set(s.carta.sugerencias.filter((x) => x.nivel === 'brujula_firme').map((x) => x.area))
    const ahora = firmes(latest)
    const antes = firmes(previous)
    const entraron = [...ahora].filter((a) => !antes.has(a))
    const salieron = [...antes].filter((a) => !ahora.has(a))
    if (!entraron.length && !salieron.length) return 'El rumbo se mantiene estable respecto del análisis anterior.'
    const partes: string[] = []
    if (entraron.length) partes.push(`se consolidó ${entraron.join(' y ')}`)
    if (salieron.length) partes.push(`dejó de ser brújula firme ${salieron.join(' y ')}`)
    return `Desde el análisis anterior (${fechaHora(previous.generadoEl)}): ${partes.join('; ')}.`
  }, [latest, previous])

  const run = async () => {
    const payload = generateSnapshot({
      consultant,
      activities: activities.filter((a) => a.consultantId === consultant.id),
      evaluations: evaluations.filter((e) => e.consultantId === consultant.id),
      reflections: reflections.filter((r) => r.consultantId === consultant.id),
      observations: observations.filter((o) => o.consultantId === consultant.id),
      sessions: sessions.filter((s) => s.consultantId === consultant.id),
      progress,
    })
    // poda: conserva los últimos MAX_SNAPSHOTS análisis
    const excedentes = history.slice(MAX_SNAPSHOTS - 1)
    for (const old of excedentes) await db.snapshots.remove(old.id)
    await createSnapshot.mutateAsync(payload as Partial<CompassSnapshot>)
    setSelectedId(null)
    toast.success('Análisis del Motor Brújula generado')
  }

  if (!latest) {
    return (
      <EmptyState
        icon={Compass}
        title="El Motor Brújula todavía no se ejecutó"
        description="Cruza actividades, evaluaciones, reflexiones, observaciones y sesiones para generar el Perfil, el Mapa y la Carta de Navegación. Sin porcentajes: cada sugerencia se explica con su evidencia."
        action={
          <Button onClick={run}>
            <Compass /> Generar análisis
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {history.length > 1 ? (
            <>
              <History className="h-3.5 w-3.5 text-faint" />
              <NativeSelect
                className="h-8 w-auto text-[12.5px]"
                value={latest.id}
                onChange={(e) => setSelectedId(e.target.value)}
                aria-label="Historial de análisis"
              >
                {history.map((s, i) => (
                  <option key={s.id} value={s.id}>
                    {i === 0 ? 'Último análisis' : 'Análisis'} · {fechaHora(s.generadoEl)}
                  </option>
                ))}
              </NativeSelect>
            </>
          ) : (
            <p className="text-[12.5px] text-faint">Último análisis: {fechaHora(latest.generadoEl)}</p>
          )}
          <p className="text-[12.5px] text-faint">· el análisis no reemplaza el criterio profesional</p>
        </div>
        <Button variant="outline" size="sm" onClick={run}>
          <RefreshCw /> Regenerar con datos actuales
        </Button>
      </div>

      {evolucion && (
        <p className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary-soft/40 px-3 py-2 text-[12.5px]">
          <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          {evolucion}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Mapa Brújula */}
        <Card>
          <CardHeader>
            <CardTitle>Mapa Brújula</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={latest.mapa} outerRadius="72%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis
                    dataKey="titulo"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  />
                  <Radar
                    dataKey="nivel"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.25}
                    animationDuration={600}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-[11.5px] text-faint">
              Lectura cualitativa de las dimensiones trabajadas (uso profesional).
            </p>
          </CardContent>
        </Card>

        {/* Rumbo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" /> Rumbo detectado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[13.5px] leading-relaxed">{latest.carta.rumbo}</p>
            {latest.carta.brujulaInterior.length > 0 && (
              <div>
                <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-faint">
                  Brújula interior
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {latest.carta.brujulaInterior.map((v) => (
                    <Badge key={v} variant="aqua">
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-primary-soft/60 p-3">
                <p className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold text-primary-strong">
                  <Wind className="h-3.5 w-3.5" /> Vientos a favor
                </p>
                <ul className="list-disc space-y-1 pl-4 text-[12.5px] text-foreground/80">
                  {latest.carta.vientosAFavor.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-accent-soft/60 p-3">
                <p className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold text-accent-strong">
                  <Wind className="h-3.5 w-3.5 rotate-180" /> Vientos en contra
                </p>
                <ul className="list-disc space-y-1 pl-4 text-[12.5px] text-foreground/80">
                  {latest.carta.vientosEnContra.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Perfil Brújula */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil Brújula</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {latest.perfil.map((p) => (
            <div key={p.dimension} className="rounded-lg border p-3.5">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[13px] font-semibold">{p.titulo}</p>
                <Badge variant={intensidadBadge[p.intensidad]}>{p.intensidad}</Badge>
              </div>
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">{p.sintesis}</p>
              {p.evidencias.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-[11.5px] font-medium text-primary">
                    Evidencias ({p.evidencias.length})
                  </summary>
                  <ul className="mt-1.5 space-y-1.5 border-l pl-3 text-[11.5px] text-muted-foreground">
                    {p.evidencias.map((e, i) => (
                      <li key={i}>
                        <span className="font-medium text-faint">[{e.fuente}]</span> {e.detalle}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Carta de Navegación */}
      <Card>
        <CardHeader>
          <CardTitle>Carta de Navegación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {latest.carta.sugerencias.map((s) => (
            <div key={s.areaId} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[14px] font-semibold">{s.area}</p>
                <Badge
                  variant={s.nivel === 'brujula_firme' ? 'aqua' : s.nivel === 'rumbo_posible' ? 'lavanda' : 'gris'}
                >
                  {AFFINITY_TIER[s.nivel].label}
                </Badge>
                <span className="ml-auto text-[11.5px] text-faint">{AFFINITY_TIER[s.nivel].descripcion}</span>
              </div>
              <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                Carreras del área: {s.carreras.join(' · ')}
              </p>
              <div className="mt-2.5">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-faint">Por qué aparece</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[13px]">
                  {s.motivos.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
              {s.tensiones && (
                <p className="mt-2.5 rounded-lg bg-warning-soft px-3 py-2 text-[12.5px] text-warning">
                  {s.tensiones[0]}
                </p>
              )}
              <details className="mt-2.5">
                <summary className="cursor-pointer text-[12px] font-medium text-primary">
                  Pasos de exploración sugeridos
                </summary>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[12.5px] text-muted-foreground">
                  {s.pasosExploracion.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </details>
            </div>
          ))}

          <div>
            <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-faint">
              Próximas escalas
            </p>
            <ul className="list-disc space-y-1 pl-4 text-[13px]">
              {latest.carta.escalas.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>

          <p className="rounded-lg bg-surface-2 p-3 text-[12px] leading-relaxed text-muted-foreground">
            {latest.notaMetodologica}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
