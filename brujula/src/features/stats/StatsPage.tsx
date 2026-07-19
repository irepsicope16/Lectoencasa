import { useMemo } from 'react'
import { format, parseISO, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CalendarCheck2, ListChecks, TrendingUp, Users } from 'lucide-react'
import { FadeIn, PageHeader, StatCard } from '@/components/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useActivities,
  useConsultants,
  useModuleProgress,
  useSessions,
} from '@/hooks/queries'
import { MODULES } from '@/data/modules'
import { CONSULTANT_STATUS } from '@/lib/constants'
import { overallProgress } from '@/lib/progress'
import { nombreCompleto } from '@/lib/utils'
import type { ConsultantStatus } from '@/types'

const PIE_COLORS = ['var(--primary)', 'var(--accent)', 'var(--warning)', 'var(--border-strong)']

export default function StatsPage() {
  const { data: consultants = [] } = useConsultants()
  const { data: sessions = [] } = useSessions()
  const { data: activities = [] } = useActivities()
  const { data: progress = [] } = useModuleProgress()

  const porEstado = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const c of consultants) counts[c.estado] = (counts[c.estado] ?? 0) + 1
    return (Object.keys(CONSULTANT_STATUS) as ConsultantStatus[])
      .filter((k) => counts[k])
      .map((k) => ({ name: CONSULTANT_STATUS[k].label, value: counts[k] }))
  }, [consultants])

  const sesionesPorMes = useMemo(() => {
    const months: { key: string; label: string; realizadas: number; programadas: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(new Date(), i)
      months.push({ key: format(d, 'yyyy-MM'), label: format(d, 'MMM', { locale: es }), realizadas: 0, programadas: 0 })
    }
    for (const s of sessions) {
      const key = s.fecha.slice(0, 7)
      const m = months.find((x) => x.key === key)
      if (!m) continue
      if (s.estado === 'realizada') m.realizadas++
      if (s.estado === 'programada') m.programadas++
    }
    return months
  }, [sessions])

  const modulosCompletados = useMemo(
    () =>
      MODULES.map((m) => ({
        name: `${m.numero}. ${m.nombre}`,
        completados: progress.filter((p) => p.moduleId === m.id && p.estado === 'completado').length,
      })),
    [progress],
  )

  const actividadesStats = useMemo(() => {
    const total = activities.length
    const completadas = activities.filter((a) => a.estado === 'completada' || a.estado === 'revisada').length
    return { total, completadas, tasa: total ? Math.round((completadas / total) * 100) : 0 }
  }, [activities])

  const avancePorConsultante = useMemo(
    () =>
      consultants
        .map((c) => ({ name: nombreCompleto(c), avance: overallProgress(progress, c.id) }))
        .sort((a, b) => b.avance - a.avance),
    [consultants, progress],
  )

  return (
    <FadeIn>
      <PageHeader title="Estadísticas" subtitle="Visión cuantitativa del estudio. Los procesos, siempre, se leen cualitativamente." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="Consultantes" value={consultants.length} />
        <StatCard
          icon={CalendarCheck2}
          label="Sesiones realizadas"
          value={sessions.filter((s) => s.estado === 'realizada').length}
          tone="lavanda"
        />
        <StatCard
          icon={ListChecks}
          label="Actividades completadas"
          value={`${actividadesStats.completadas}/${actividadesStats.total}`}
          hint={`${actividadesStats.tasa}% de finalización`}
        />
        <StatCard
          icon={TrendingUp}
          label="Módulos completados"
          value={progress.filter((p) => p.estado === 'completado').length}
          tone="neutro"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sesiones por mes</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sesionesPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  cursor={{ fill: 'var(--surface-2)' }}
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="realizadas" name="Realizadas" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="programadas" name="Programadas" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultantes por estado</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={porEstado} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {porEstado.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="var(--surface)" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="-mt-2 flex flex-wrap justify-center gap-3">
              {porEstado.map((e, i) => (
                <span key={e.name} className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {e.name} ({e.value})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Módulos completados (todos los procesos)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modulosCompletados} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 10.5 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'var(--surface-2)' }}
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="completados" name="Completados" fill="var(--primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avance por consultante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {avancePorConsultante.map((c) => (
              <div key={c.name}>
                <div className="mb-1 flex justify-between text-[12.5px]">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-faint">{c.avance}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${c.avance}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  )
}
