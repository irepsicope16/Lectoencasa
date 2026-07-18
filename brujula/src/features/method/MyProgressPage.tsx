import { CheckCircle2, Sparkles } from 'lucide-react'
import { FadeIn, PageHeader, ProgressRing } from '@/components/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  useActivities,
  useModuleProgress,
  useReflections,
  useSessions,
  useVideos,
} from '@/hooks/queries'
import { useAuthStore } from '@/stores/authStore'
import { MODULES } from '@/data/modules'
import { STAGES } from '@/lib/constants'
import { overallProgress } from '@/lib/progress'
import { fechaCorta } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function MyProgressPage() {
  const user = useAuthStore((s) => s.user)
  const consultantId = user?.consultantId ?? ''
  const { data: progress = [] } = useModuleProgress()
  const { data: activities = [] } = useActivities()
  const { data: sessions = [] } = useSessions()
  const { data: reflections = [] } = useReflections()
  const { data: videos = [] } = useVideos()

  const pct = overallProgress(progress, consultantId)

  const completadas = activities.filter(
    (a) => a.consultantId === consultantId && (a.estado === 'completada' || a.estado === 'revisada'),
  ).length
  const misReflexiones = reflections.filter((r) => r.consultantId === consultantId).length
  const sesionesHechas = sessions.filter((s) => s.consultantId === consultantId && s.estado === 'realizada').length
  const vistos = videos.filter((v) => v.consultantId === consultantId && v.visto).length

  const progressOf = (moduleId: string) =>
    progress.find((p) => p.consultantId === consultantId && p.moduleId === moduleId)

  return (
    <FadeIn>
      <PageHeader title="Mis avances" subtitle="Todo lo que ya recorriste. Cada paso cuenta." />

      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-4 rounded-xl border bg-surface p-4 sm:col-span-1">
          <ProgressRing value={pct} size={56} />
          <div>
            <p className="text-[13px] font-semibold">Recorrido total</p>
            <p className="text-[11.5px] text-faint">de los 12 módulos</p>
          </div>
        </div>
        {[
          { label: 'Actividades completadas', value: completadas },
          { label: 'Sesiones realizadas', value: sesionesHechas },
          { label: 'Videos vistos · reflexiones', value: `${vistos} · ${misReflexiones}` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-surface p-4">
            <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Línea de recorrido</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-0 border-l-2 border-border pl-6">
            {MODULES.map((m) => {
              const p = progressOf(m.id)
              const estado = p?.estado ?? 'no_iniciado'
              return (
                <li key={m.id} className="relative pb-6 last:pb-0">
                  <span
                    className={cn(
                      'absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 bg-surface',
                      estado === 'completado'
                        ? 'border-primary text-primary'
                        : estado === 'en_progreso'
                          ? 'border-accent text-accent-strong'
                          : 'border-border text-faint',
                    )}
                  >
                    {estado === 'completado' ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <span className="text-[9px] font-bold">{m.numero}</span>
                    )}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={cn('text-[13.5px] font-medium', estado === 'no_iniciado' && 'text-faint')}>
                      {m.nombre}
                    </p>
                    <Badge variant="outline">{STAGES[m.etapa].nombre}</Badge>
                    {estado === 'completado' && p?.fechaCompletado && (
                      <span className="text-[11px] text-faint">completado el {fechaCorta(p.fechaCompletado)}</span>
                    )}
                    {estado === 'en_progreso' && <Badge variant="lavanda">estás acá</Badge>}
                  </div>
                  {p?.notasConsultante && (
                    <p className="mt-1 flex items-start gap-1.5 text-[12.5px] italic text-muted-foreground">
                      <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-accent-strong" />
                      “{p.notasConsultante}”
                    </p>
                  )}
                </li>
              )
            })}
          </ol>
        </CardContent>
      </Card>
    </FadeIn>
  )
}
