import { Link } from 'react-router-dom'
import { ArrowRight, ListChecks } from 'lucide-react'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { useActivities } from '@/hooks/queries'
import { useAuthStore } from '@/stores/authStore'
import { MODULE_MAP } from '@/data/modules'
import { ACTIVITY_STATUS } from '@/lib/constants'
import { fechaCorta } from '@/lib/utils'

const ORDER = { pendiente: 0, en_progreso: 1, completada: 2, revisada: 3 } as const

export default function MyActivitiesPage() {
  const user = useAuthStore((s) => s.user)
  const consultantId = user?.consultantId ?? ''
  const { data: activities = [] } = useActivities()

  const own = activities
    .filter((a) => a.consultantId === consultantId)
    .sort((a, b) => ORDER[a.estado] - ORDER[b.estado] || b.fechaAsignada.localeCompare(a.fechaAsignada))

  return (
    <FadeIn>
      <PageHeader
        title="Mis actividades"
        subtitle="Los ejercicios de tu proceso. Respondé con honestidad: no hay respuestas correctas."
      />
      {own.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Sin actividades por ahora"
          description="Tu profesional te irá asignando actividades a medida que avance el proceso."
        />
      ) : (
        <div className="space-y-2.5">
          {own.map((a) => (
            <Link
              key={a.id}
              to={`/mi/actividades/${a.id}`}
              className="flex items-center gap-3 rounded-xl border bg-surface p-4 transition-all hover:border-border-strong hover:shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] font-medium">{a.titulo}</p>
                  <Badge variant="outline">{MODULE_MAP[a.moduleId].nombre}</Badge>
                </div>
                <p className="mt-0.5 line-clamp-1 text-[12.5px] text-muted-foreground">{a.descripcion}</p>
                <p className="mt-1 text-[11.5px] text-faint">
                  Asignada {fechaCorta(a.fechaAsignada)}
                  {a.fechaLimite && ` · para el ${fechaCorta(a.fechaLimite)}`}
                </p>
              </div>
              <Badge
                variant={
                  a.estado === 'completada' || a.estado === 'revisada'
                    ? 'aqua'
                    : a.estado === 'en_progreso'
                      ? 'lavanda'
                      : 'amber'
                }
              >
                {ACTIVITY_STATUS[a.estado]}
              </Badge>
              <ArrowRight className="h-4 w-4 shrink-0 text-faint" />
            </Link>
          ))}
        </div>
      )}
    </FadeIn>
  )
}
