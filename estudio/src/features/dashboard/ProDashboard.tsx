import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, GraduationCap, ListChecks, Users } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useStudents } from '@/hooks/queries'
import { db } from '@/services/storage/db'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, StatCard, EmptyState, FadeIn } from '@/components/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { nombreCompleto, edad, haceCuanto } from '@/lib/utils'
import type { Alert, Student } from '@/types'

const ESTADO_LABEL: Record<Student['estado'], string> = {
  alta: 'Alta',
  entrevista: 'Entrevista',
  autoperfil: 'Autoperfil',
  en_proceso: 'En proceso',
  en_pausa: 'En pausa',
  finalizado: 'Finalizado',
}

export default function ProDashboard() {
  const user = useAuthStore((s) => s.user)
  const { data: students = [] } = useStudents(user?.id)
  const { data: openAlerts = [] } = useQuery({
    queryKey: ['dashboard-alerts', user?.id],
    queryFn: async () => {
      const all = await db.alerts.list()
      const ids = new Set(students.map((s) => s.id))
      return all.filter((a: Alert) => a.estado === 'abierta' && ids.has(a.studentId))
    },
    enabled: students.length > 0,
  })

  const activos = students.filter((s) => !s.archivedAt)
  const enProceso = activos.filter((s) => s.estado === 'en_proceso').length

  return (
    <FadeIn>
      <PageHeader
        title={`Hola, ${user?.nombre ?? ''}`}
        subtitle="Panel profesional de Método Estudio"
        actions={
          <Button asChild>
            <Link to="/pro/estudiantes">
              <Users /> Ver estudiantes
            </Link>
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={Users} label="Estudiantes activos" value={activos.length} tone="verde" />
        <StatCard icon={GraduationCap} label="En proceso" value={enProceso} tone="terracota" />
        <StatCard icon={AlertTriangle} label="Alertas abiertas" value={openAlerts.length} tone="neutro" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estudiantes recientes</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {activos.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Todavía no hay estudiantes"
                description="Creá el primer estudiante para empezar el recorrido de evaluación inicial."
                action={
                  <Button asChild size="sm">
                    <Link to="/pro/estudiantes">Nuevo estudiante</Link>
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y">
                {activos.slice(0, 6).map((s) => (
                  <li key={s.id}>
                    <Link to={`/pro/estudiantes/${s.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:opacity-80">
                      <div>
                        <p className="text-[13px] font-medium">
                          {nombreCompleto(s)} <span className="text-faint">· {edad(s.fechaNacimiento)} años</span>
                        </p>
                        <p className="text-[12px] text-muted-foreground">Actualizado {haceCuanto(s.updatedAt)}</p>
                      </div>
                      <Badge variant="outline">{ESTADO_LABEL[s.estado]}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas abiertas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {openAlerts.length === 0 ? (
              <EmptyState icon={ListChecks} title="Sin alertas pendientes" description="Las alertas de indicadores lectores o bienestar aparecerán acá." />
            ) : (
              <ul className="divide-y">
                {openAlerts.map((a) => {
                  const s = activos.find((x) => x.id === a.studentId)
                  return (
                    <li key={a.id}>
                      <Link to={`/pro/estudiantes/${a.studentId}`} className="flex items-center justify-between gap-3 py-2.5 hover:opacity-80">
                        <div>
                          <p className="text-[13px] font-medium">{s ? nombreCompleto(s) : 'Estudiante'}</p>
                          <p className="text-[12px] text-muted-foreground">
                            {a.tipo === 'indicadores_lectores' ? 'Indicadores lectores para profundizar' : a.tipo}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-faint" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  )
}
