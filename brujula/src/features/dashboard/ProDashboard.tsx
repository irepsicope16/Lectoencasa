import { Link, useNavigate } from 'react-router-dom'
import {
  Activity as ActivityIcon,
  ArrowRight,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  Circle,
  Compass,
  FilePlus2,
  ListChecks,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react'
import { FadeIn, PageHeader, StatCard } from '@/components/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  useActivities,
  useActivityLog,
  useConsultants,
  useEvents,
  useModuleProgress,
  useSessions,
  useUpdate,
} from '@/hooks/queries'
import { useAuthStore } from '@/stores/authStore'
import { fechaHora, haceCuanto, iniciales, nombreCompleto } from '@/lib/utils'
import { overallProgress } from '@/lib/progress'
import { CONSULTANT_STATUS } from '@/lib/constants'
import type { CalendarEvent } from '@/types'

export default function ProDashboard() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { data: consultants = [] } = useConsultants()
  const { data: sessions = [] } = useSessions()
  const { data: activities = [] } = useActivities()
  const { data: progress = [] } = useModuleProgress()
  const { data: events = [] } = useEvents()
  const { data: log = [] } = useActivityLog()
  const updateEvent = useUpdate<CalendarEvent>('events')

  const now = new Date().toISOString()
  const activos = consultants.filter((c) => c.estado === 'en_proceso' || c.estado === 'entrevista_inicial')
  const proximasSesiones = sessions
    .filter((s) => s.estado === 'programada' && s.fecha >= now)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 4)
  const paraRevisar = activities.filter((a) => a.estado === 'completada')
  const tareas = events
    .filter((e) => e.tipo !== 'sesion' && !e.completado)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 5)
  const feed = [...log].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 7)

  const consultantName = (id?: string) => {
    const c = consultants.find((x) => x.id === id)
    return c ? nombreCompleto(c) : ''
  }

  return (
    <FadeIn>
      <PageHeader
        title={`Hola, ${user?.nombre} 🧭`}
        subtitle="Este es el estado de tu estudio hoy."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/pro/agenda')}>
              <CalendarPlus /> Agendar
            </Button>
            <Button size="sm" onClick={() => navigate('/pro/consultantes?nuevo=1')}>
              <UserPlus /> Nuevo consultante
            </Button>
          </>
        }
      />

      {/* métricas */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="Procesos activos" value={activos.length} hint={`${consultants.length} consultantes en total`} />
        <StatCard icon={CalendarClock} label="Próximas sesiones" value={proximasSesiones.length} hint="agendadas" tone="lavanda" />
        <StatCard icon={ListChecks} label="Para revisar" value={paraRevisar.length} hint="actividades completadas" />
        <StatCard
          icon={ActivityIcon}
          label="Sesiones realizadas"
          value={sessions.filter((s) => s.estado === 'realizada').length}
          hint="históricas"
          tone="neutro"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* columna principal */}
        <div className="space-y-5 lg:col-span-2">
          {/* consultantes */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Consultantes en proceso</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/pro/consultantes">
                  Ver todos <ArrowRight />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-1">
              {consultants.slice(0, 5).map((c) => {
                const pct = overallProgress(progress, c.id)
                const st = CONSULTANT_STATUS[c.estado]
                return (
                  <Link
                    key={c.id}
                    to={`/pro/consultantes/${c.id}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2"
                  >
                    <Avatar>
                      <AvatarFallback>{iniciales(c.nombre, c.apellido)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[13.5px] font-medium">{nombreCompleto(c)}</span>
                        <Badge variant={st.tone as 'aqua'}>{st.label}</Badge>
                      </div>
                      <p className="truncate text-[12px] text-faint">
                        {c.escuela} · {c.curso}
                      </p>
                    </div>
                    <div className="w-28 shrink-0">
                      <div className="mb-1 flex justify-between text-[10.5px] text-faint">
                        <span>Recorrido</span>
                        <span>{pct}%</span>
                      </div>
                      <Progress value={pct} />
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          {/* actividad reciente */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-4 border-l pl-4">
                {feed.map((entry) => (
                  <li key={entry.id} className="relative">
                    <span className="absolute -left-[21.5px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                    <p className="text-[13px]">{entry.descripcion}</p>
                    <p className="text-[11.5px] text-faint">{haceCuanto(entry.fecha)}</p>
                  </li>
                ))}
                {feed.length === 0 && <p className="text-[13px] text-faint">Sin actividad todavía.</p>}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* columna lateral */}
        <div className="space-y-5">
          {/* próximas sesiones */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Próximas sesiones</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/pro/agenda">
                  Agenda <ArrowRight />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {proximasSesiones.map((s) => (
                <div key={s.id} className="rounded-lg border p-3">
                  <p className="text-[13px] font-medium">{s.titulo}</p>
                  <p className="text-[12px] text-muted-foreground">{consultantName(s.consultantId)}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-faint">
                    <CalendarClock className="h-3 w-3" /> {fechaHora(s.fecha)} · {s.modalidad}
                  </p>
                </div>
              ))}
              {proximasSesiones.length === 0 && (
                <p className="text-[13px] text-faint">No hay sesiones agendadas.</p>
              )}
            </CardContent>
          </Card>

          {/* próximas tareas */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas tareas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {tareas.map((t) => (
                <button
                  key={t.id}
                  onClick={() => updateEvent.mutate({ id: t.id, patch: { completado: true } })}
                  className="group flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface-2"
                  title="Marcar como hecha"
                >
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-faint group-hover:hidden" />
                  <CheckCircle2 className="mt-0.5 hidden h-4 w-4 shrink-0 text-primary group-hover:block" />
                  <span>
                    <span className="block text-[13px]">{t.titulo}</span>
                    <span className="block text-[11.5px] text-faint">{fechaHora(t.fecha)}</span>
                  </span>
                </button>
              ))}
              {tareas.length === 0 && <p className="text-[13px] text-faint">Nada pendiente. 🎉</p>}
            </CardContent>
          </Card>

          {/* accesos rápidos */}
          <Card>
            <CardHeader>
              <CardTitle>Accesos rápidos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { icon: Compass, label: 'El método', to: '/pro/metodo' },
                { icon: Users, label: 'Consultantes', to: '/pro/consultantes' },
                { icon: FilePlus2, label: 'Estadísticas', to: '/pro/estadisticas' },
                { icon: Sparkles, label: 'Asistente IA', to: '/pro/ajustes' },
              ].map((q) => (
                <Link
                  key={q.label}
                  to={q.to}
                  className="flex flex-col items-start gap-2 rounded-lg border p-3 transition-colors hover:border-border-strong hover:bg-surface-2"
                >
                  <q.icon className="h-4 w-4 text-primary" />
                  <span className="text-[12.5px] font-medium">{q.label}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  )
}
