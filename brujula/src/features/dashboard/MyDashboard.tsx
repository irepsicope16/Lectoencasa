import { Link } from 'react-router-dom'
import { ArrowRight, CalendarClock, ListChecks, MonitorPlay, NotebookPen, Sparkles } from 'lucide-react'
import { FadeIn, ProgressRing } from '@/components/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  useActivities,
  useModuleProgress,
  useReflections,
  useSessions,
  useVideos,
} from '@/hooks/queries'
import { useAuthStore } from '@/stores/authStore'
import { MODULES, MODULE_MAP } from '@/data/modules'
import { STAGES } from '@/lib/constants'
import { overallProgress, pendingActivities } from '@/lib/progress'
import { fechaHora } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function MyDashboard() {
  const user = useAuthStore((s) => s.user)
  const consultantId = user?.consultantId ?? ''
  const { data: progress = [] } = useModuleProgress()
  const { data: activities = [] } = useActivities()
  const { data: sessions = [] } = useSessions()
  const { data: videos = [] } = useVideos()
  const { data: reflections = [] } = useReflections()

  const pct = overallProgress(progress, consultantId)
  const pendientes = pendingActivities(activities, consultantId)
  const videosPendientes = videos.filter((v) => v.consultantId === consultantId && !v.visto)
  const proximaSesion = sessions
    .filter((s) => s.consultantId === consultantId && s.estado === 'programada')
    .sort((a, b) => a.fecha.localeCompare(b.fecha))[0]

  const progressOf = (moduleId: string) =>
    progress.find((p) => p.consultantId === consultantId && p.moduleId === moduleId)

  // módulo actual: el primero en progreso, o el primero no iniciado
  const actual =
    MODULES.find((m) => progressOf(m.id)?.estado === 'en_progreso') ??
    MODULES.find((m) => !progressOf(m.id) || progressOf(m.id)?.estado === 'no_iniciado')

  return (
    <FadeIn>
      {/* héroe */}
      <div className="mb-6 flex flex-wrap items-center gap-6 rounded-2xl border bg-surface p-6">
        <ProgressRing value={pct} size={72} stroke={5} />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight">Hola, {user?.nombre} 👋</h1>
          <p className="mt-1 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
            Este es tu camino en el Método Brújula. No hay apuro ni respuestas correctas: cada módulo te acerca un
            poco más a tu norte.
          </p>
        </div>
        {actual && (
          <Button asChild>
            <Link to={`/mi/modulos/${actual.id}`}>
              Continuar: {actual.nombre} <ArrowRight />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* recorrido */}
          <Card>
            <CardHeader>
              <CardTitle>Tu recorrido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {(Object.keys(STAGES) as (keyof typeof STAGES)[]).map((stage) => (
                <div key={stage}>
                  <p className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-faint">
                    {STAGES[stage].nombre}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {MODULES.filter((m) => m.etapa === stage).map((m) => {
                      const p = progressOf(m.id)
                      const estado = p?.estado ?? 'no_iniciado'
                      return (
                        <Link
                          key={m.id}
                          to={`/mi/modulos/${m.id}`}
                          className={cn(
                            'flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors hover:bg-surface-2',
                            estado === 'completado' && 'border-primary/40 bg-primary-soft/40',
                            estado === 'en_progreso' && 'border-accent/50 bg-accent-soft/40',
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                              estado === 'completado'
                                ? 'bg-primary text-primary-foreground'
                                : estado === 'en_progreso'
                                  ? 'bg-accent text-accent-foreground'
                                  : 'bg-surface-2 text-faint',
                            )}
                          >
                            {m.numero}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-medium">{m.nombre}</span>
                            <span className="block text-[11px] text-faint">
                              {estado === 'completado'
                                ? 'Completado ✓'
                                : estado === 'en_progreso'
                                  ? 'En progreso'
                                  : 'Por comenzar'}
                            </span>
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          {/* próxima sesión */}
          {proximaSesion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" /> Tu próxima sesión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[14px] font-medium">{proximaSesion.titulo}</p>
                <p className="mt-1 text-[12.5px] text-muted-foreground">
                  {fechaHora(proximaSesion.fecha)} · {proximaSesion.modalidad}
                </p>
              </CardContent>
            </Card>
          )}

          {/* pendientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" /> Para hacer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendientes.slice(0, 4).map((a) => (
                <Link
                  key={a.id}
                  to={`/mi/actividades/${a.id}`}
                  className="block rounded-lg border p-3 transition-colors hover:bg-surface-2"
                >
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-[13px] font-medium">{a.titulo}</p>
                    <Badge variant={a.estado === 'en_progreso' ? 'lavanda' : 'amber'}>
                      {a.estado === 'en_progreso' ? 'En progreso' : 'Pendiente'}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-faint">{MODULE_MAP[a.moduleId].nombre}</p>
                </Link>
              ))}
              {videosPendientes.slice(0, 2).map((v) => (
                <Link
                  key={v.id}
                  to={`/mi/modulos/${v.moduleId}`}
                  className="flex items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-surface-2"
                >
                  <MonitorPlay className="h-4 w-4 shrink-0 text-accent-strong" />
                  <span className="min-w-0 flex-1 truncate text-[13px]">{v.titulo}</span>
                  <Badge variant="lavanda">Video</Badge>
                </Link>
              ))}
              {pendientes.length === 0 && videosPendientes.length === 0 && (
                <p className="text-[13px] text-faint">¡Estás al día! 🎉</p>
              )}
            </CardContent>
          </Card>

          {/* reflexión */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-accent-strong" /> Tu bitácora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                {reflections.filter((r) => r.consultantId === consultantId).length} reflexiones escritas. Escribir lo
                que te pasa durante el proceso ayuda a encontrarle sentido.
              </p>
              <Button variant="soft" size="sm" className="mt-3" asChild>
                <Link to="/mi/reflexiones">
                  <Sparkles /> Escribir una reflexión
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  )
}
