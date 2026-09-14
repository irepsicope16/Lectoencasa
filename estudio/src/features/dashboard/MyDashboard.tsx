import { useState } from 'react'
import { CheckCircle2, Circle, ListChecks, Sparkles, Target } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAsignaciones, useStudent, useGoals, useResponses } from '@/hooks/queries'
import { PageHeader, AvisoOrientativo, FadeIn, EmptyState } from '@/components/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fechaCorta } from '@/lib/utils'
import { MENSAJES } from '@/data/mensajes'
import { ITEMS } from '@/data/items'
import type { NivelActividad } from '@/types'
import { AutoperfilTab } from '@/features/students/tabs/AutoperfilTab'

const NIVEL_INFO: Record<NivelActividad, { titulo: string; subtitulo: string }> = {
  1: { titulo: 'Nivel 1', subtitulo: 'Arranque' },
  2: { titulo: 'Nivel 2', subtitulo: 'Secundario' },
  3: { titulo: 'Nivel 3', subtitulo: 'Ingreso a la universidad' },
}

export default function MyDashboard() {
  const user = useAuthStore((s) => s.user)
  const { data: student, isLoading } = useStudent(user?.studentId)
  const { data: responses = [] } = useResponses(student?.id)
  const { data: goals = [] } = useGoals(student?.id)
  const { data: asignaciones = [] } = useAsignaciones(student?.id)
  const [nivel, setNivel] = useState<NivelActividad>(1)

  if (isLoading) return <div className="p-6 text-sm text-faint">Cargando…</div>
  if (!student) return <div className="p-6 text-sm text-faint">Todavía no vinculamos tu cuenta a una ficha. Consultá con tu profesional.</div>

  const respondidos = new Set(responses.map((r) => r.itemId)).size
  const autoperfilCompleto = respondidos >= ITEMS.length
  const objetivosActivos = goals.filter((g) => g.estado !== 'cerrado')
  const asignacionesNivel = asignaciones.filter((a) => a.nivel === nivel)

  return (
    <FadeIn>
      <PageHeader title={`Hola, ${student.nombre}`} subtitle="Tu camino en Método Estudio" />

      <div className="space-y-4">
        <AvisoOrientativo>{MENSAJES.resultadoEstudiante}</AvisoOrientativo>

        <Card>
          <CardHeader>
            <CardTitle>Tu recorrido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid gap-2.5 sm:grid-cols-3">
              {([1, 2, 3] as NivelActividad[]).map((n) => (
                <button
                  key={n}
                  onClick={() => setNivel(n)}
                  className={`rounded-xl border p-3.5 text-left transition-colors ${
                    nivel === n ? 'border-primary bg-primary-soft/50' : 'bg-surface hover:bg-surface-2'
                  }`}
                >
                  <p className="font-display text-[16px] font-semibold tracking-tight">{NIVEL_INFO[n].titulo}</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">{NIVEL_INFO[n].subtitulo}</p>
                </button>
              ))}
            </div>

            {nivel === 1 && (
              <div className="flex items-center gap-2.5 rounded-xl border bg-surface-2 p-3.5">
                <Sparkles className="h-4 w-4 shrink-0 text-secondary" />
                <div>
                  <p className="text-[13px] font-medium">Tu autoperfil</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-faint">
                    {autoperfilCompleto ? <CheckCircle2 className="h-3 w-3 text-primary" /> : <Circle className="h-3 w-3" />}
                    {respondidos}/{ITEMS.length} respondidas
                  </p>
                </div>
              </div>
            )}

            {asignacionesNivel.length === 0 ? (
              <EmptyState icon={ListChecks} title="Todavía no hay actividades de este nivel" description="Tu profesional las va a ir sumando." />
            ) : (
              <div className="space-y-2">
                {asignacionesNivel.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl border bg-surface p-3">
                    {a.estado === 'completada' ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-faint" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={`text-[13px] font-medium ${a.estado === 'completada' ? 'text-faint line-through' : ''}`}>{a.titulo}</p>
                      <p className="text-[11.5px] text-faint">{a.descripcion}</p>
                    </div>
                    <Badge variant="outline">{fechaCorta(a.fechaAsignada)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
