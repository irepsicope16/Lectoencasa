import { useEffect, useState } from 'react'
import { ListOrdered } from 'lucide-react'
import { useSnapshots, usePriorities, useSavePriority } from '@/hooks/queries'
import { calcularPuntajePrioridad, necesidadDeclaradaDeBanda } from '@/features/engine/estudioEngine'
import { DIMENSIONES } from '@/data/items'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NativeSelect, Textarea, Label } from '@/components/ui/input'
import { EmptyState } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import type { DimensionId, EstadoPrioridad, Student } from '@/types'

const ESTADO_LABEL: Record<EstadoPrioridad, string> = {
  sugerida: 'Sugerida',
  confirmada: 'Confirmada',
  descartada: 'Descartada',
}

export function PrioridadesTab({ student }: { student: Student }) {
  const { data: snapshots = [] } = useSnapshots(student.id)
  const { data: priorities = [] } = usePriorities(student.id)
  const savePriority = useSavePriority()

  const dimensionesConDatos = snapshots.filter((s) => s.banda !== null)

  if (dimensionesConDatos.length === 0) {
    return (
      <EmptyState
        icon={ListOrdered}
        title="Todavía no hay resultados para priorizar"
        description="Calculá la integración en la pestaña anterior primero."
      />
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Prioridades</CardTitle>
          <CardDescription>
            El total ordena opciones; cualquier alerta de bienestar o dificultad específica requiere decisión profesional aparte.
            Confirmá, reordená o descartá — la ruta nunca se asigna sola.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {dimensionesConDatos
            .sort((a, b) => (b.promedioNecesidad ?? 0) - (a.promedioNecesidad ?? 0))
            .map((snap) => {
              const existing = priorities.find((p) => p.dimension === snap.dimension)
              return (
                <FilaPrioridad
                  key={snap.dimension}
                  studentId={student.id}
                  dimension={snap.dimension}
                  necesidadDeclarada={necesidadDeclaradaDeBanda(snap.banda)}
                  existing={existing}
                  onSave={savePriority.mutateAsync}
                />
              )
            })}
        </CardContent>
      </Card>
    </div>
  )
}

function FilaPrioridad({
  studentId,
  dimension,
  necesidadDeclarada,
  existing,
  onSave,
}: {
  studentId: string
  dimension: DimensionId
  necesidadDeclarada: number
  existing?: ReturnType<typeof usePriorities>['data'] extends (infer T)[] | undefined ? T : never
  onSave: ReturnType<typeof useSavePriority>['mutateAsync']
}) {
  const [impacto, setImpacto] = useState(existing?.impactoActual ?? 0)
  const [frecuencia, setFrecuencia] = useState(existing?.frecuenciaMultiContexto ?? 0)
  const [interes, setInteres] = useState(existing?.interesEstudiante ?? 0)
  const [urgencia, setUrgencia] = useState(existing?.urgenciaEvaluacion ?? 0)
  const [justificacion, setJustificacion] = useState(existing?.justificacion ?? '')
  const [estado, setEstado] = useState<EstadoPrioridad>(existing?.estado ?? 'sugerida')

  // `existing` puede llegar después del primer render (la consulta todavía
  // está cargando cuando este componente se monta); sincronizamos el estado
  // local apenas está disponible, en vez de depender solo del valor inicial.
  useEffect(() => {
    if (!existing) return
    setImpacto(existing.impactoActual)
    setFrecuencia(existing.frecuenciaMultiContexto)
    setInteres(existing.interesEstudiante)
    setUrgencia(existing.urgenciaEvaluacion)
    setJustificacion(existing.justificacion ?? '')
    setEstado(existing.estado)
  }, [existing])

  const puntaje = calcularPuntajePrioridad({
    necesidadDeclarada,
    impactoActual: impacto,
    frecuenciaMultiContexto: frecuencia,
    interesEstudiante: interes,
    urgenciaEvaluacion: urgencia,
  })

  async function guardar() {
    await onSave({
      studentId,
      dimension,
      necesidadDeclarada,
      impactoActual: impacto,
      frecuenciaMultiContexto: frecuencia,
      interesEstudiante: interes,
      urgenciaEvaluacion: urgencia,
      puntaje,
      estado,
      justificacion,
      existingId: existing?.id,
    })
    toast.success('Prioridad guardada')
  }

  return (
    <div className="rounded-lg border p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] font-medium">
          {dimension} · {DIMENSIONES[dimension].nombre}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Puntaje: {puntaje} / 11</Badge>
          <NativeSelect className="w-36" value={estado} onChange={(e) => setEstado(e.target.value as EstadoPrioridad)}>
            <option value="sugerida">Sugerida</option>
            <option value="confirmada">Confirmada</option>
            <option value="descartada">Descartada</option>
          </NativeSelect>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Campo label="Impacto actual (0-3)" value={impacto} max={3} onChange={setImpacto} />
        <Campo label="Frecuencia multi-contexto (0-2)" value={frecuencia} max={2} onChange={setFrecuencia} />
        <Campo label="Interés del estudiante (0-2)" value={interes} max={2} onChange={setInteres} />
        <Campo label="Urgencia por evaluación (0-1)" value={urgencia} max={1} onChange={setUrgencia} />
      </div>
      <div className="mt-3">
        <Label>Justificación</Label>
        <Textarea value={justificacion} onChange={(e) => setJustificacion(e.target.value)} />
      </div>
      <div className="mt-2 flex justify-end">
        <Button size="sm" onClick={guardar}>
          Guardar
        </Button>
      </div>
    </div>
  )
}

function Campo({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (v: number) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <NativeSelect value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {Array.from({ length: max + 1 }, (_, i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}
