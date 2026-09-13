import { Target } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useStudent, useGoals, useResponses } from '@/hooks/queries'
import { PageHeader, AvisoOrientativo, FadeIn, EmptyState } from '@/components/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MENSAJES } from '@/data/mensajes'
import { ITEMS } from '@/data/items'
import { AutoperfilTab } from '@/features/students/tabs/AutoperfilTab'

export default function MyDashboard() {
  const user = useAuthStore((s) => s.user)
  const { data: student, isLoading } = useStudent(user?.studentId)
  const { data: responses = [] } = useResponses(student?.id)
  const { data: goals = [] } = useGoals(student?.id)

  if (isLoading) return <div className="p-6 text-sm text-faint">Cargando…</div>
  if (!student) return <div className="p-6 text-sm text-faint">Todavía no vinculamos tu cuenta a una ficha. Consultá con tu profesional.</div>

  const respondidos = new Set(responses.map((r) => r.itemId)).size
  const autoperfilCompleto = respondidos >= ITEMS.length
  const objetivosActivos = goals.filter((g) => g.estado !== 'cerrado')

  return (
    <FadeIn>
      <PageHeader title={`Hola, ${student.nombre}`} subtitle="Tu camino en Método Estudio" />

      <div className="space-y-4">
        <AvisoOrientativo>{MENSAJES.resultadoEstudiante}</AvisoOrientativo>

        {!autoperfilCompleto && (
          <Card>
            <CardHeader>
              <CardTitle>Terminemos tu autoperfil</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <AutoperfilTab student={student} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Lo que vamos a entrenar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {objetivosActivos.length === 0 ? (
              <EmptyState
                icon={Target}
                title="Todavía no hay un objetivo cargado"
                description="Tu profesional lo va a definir con vos en la próxima sesión."
              />
            ) : (
              objetivosActivos.map((g) => (
                <div key={g.id} className="rounded-lg border p-3">
                  <p className="text-[13px] font-medium">{g.objetivoObservable}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {g.herramientas.map((h) => (
                      <Badge key={h} variant="secundario">
                        {h}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-2 text-[12.5px] text-muted-foreground">Frecuencia: {g.frecuencia}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  )
}
