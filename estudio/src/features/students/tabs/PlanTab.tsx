import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { useCreateGoal, useGoals, usePriorities, useUpdateGoal } from '@/hooks/queries'
import { DIMENSIONES } from '@/data/items'
import { RUTAS } from '@/data/rutas'
import { MENSAJES } from '@/data/mensajes'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input, Label, NativeSelect, Textarea } from '@/components/ui/input'
import { AvisoOrientativo, EmptyState } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { fechaCorta } from '@/lib/utils'
import type { DimensionId, EstadoObjetivo, Student } from '@/types'

const ESTADO_LABEL: Record<EstadoObjetivo, string> = {
  activo: 'Activo',
  mantener: 'Mantener',
  graduar: 'Graduar',
  reemplazar: 'Reemplazar',
  cerrado: 'Cerrado',
}

export function PlanTab({ student }: { student: Student }) {
  const { data: priorities = [] } = usePriorities(student.id)
  const { data: goals = [] } = useGoals(student.id)
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const [formOpen, setFormOpen] = useState(false)

  const confirmadas = priorities.filter((p) => p.estado === 'confirmada')
  const activos = goals.filter((g) => g.estado !== 'cerrado')

  return (
    <div className="space-y-4">
      <AvisoOrientativo>El plan trabaja pocas metas por ciclo: dos objetivos principales y, como máximo, uno complementario.</AvisoOrientativo>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Objetivos del ciclo</CardTitle>
            {confirmadas.length > 0 && (
              <Button size="sm" onClick={() => setFormOpen((v) => !v)}>
                <Plus /> Nuevo objetivo
              </Button>
            )}
          </div>
          <CardDescription>{MENSAJES.revision}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {confirmadas.length === 0 ? (
            <EmptyState icon={Target} title="Sin prioridades confirmadas" description="Confirmá al menos una dimensión en la pestaña Prioridades para crear un objetivo." />
          ) : (
            <>
              {formOpen && (
                <NuevoObjetivoForm
                  studentId={student.id}
                  dimensiones={confirmadas.map((p) => p.dimension)}
                  onCreated={() => setFormOpen(false)}
                  createGoal={createGoal}
                />
              )}
              {activos.length === 0 ? (
                <p className="text-[13px] text-muted-foreground">Todavía no se creó ningún objetivo.</p>
              ) : (
                activos.map((g) => (
                  <div key={g.id} className="rounded-lg border p-3">
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <Badge variant="outline">
                        {g.dimension} · {DIMENSIONES[g.dimension].nombre}
                      </Badge>
                      <NativeSelect
                        className="w-36"
                        value={g.estado}
                        onChange={(e) => updateGoal.mutateAsync({ id: g.id, patch: { estado: e.target.value as EstadoObjetivo } })}
                      >
                        {(Object.keys(ESTADO_LABEL) as EstadoObjetivo[]).map((e) => (
                          <option key={e} value={e}>
                            {ESTADO_LABEL[e]}
                          </option>
                        ))}
                      </NativeSelect>
                    </div>
                    <p className="text-[13px] font-medium">{g.objetivoObservable}</p>
                    <p className="mt-1 text-[12.5px] text-muted-foreground">Necesidad: {g.necesidadPriorizada}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {g.herramientas.map((h) => (
                        <Badge key={h} variant="verde">
                          {h}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[12px] text-faint sm:grid-cols-4">
                      <span>Frecuencia: {g.frecuencia}</span>
                      <span>Evidencia: {g.evidencia}</span>
                      <span>Inicio: {fechaCorta(g.fechaInicio)}</span>
                      <span>Revisión: {fechaCorta(g.fechaRevision)}</span>
                    </div>
                    {g.vozEstudiante && <p className="mt-2 text-[12.5px] italic text-muted-foreground">"{g.vozEstudiante}"</p>}
                  </div>
                ))
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function NuevoObjetivoForm({
  studentId,
  dimensiones,
  onCreated,
  createGoal,
}: {
  studentId: string
  dimensiones: DimensionId[]
  onCreated: () => void
  createGoal: ReturnType<typeof useCreateGoal>
}) {
  const [dimension, setDimension] = useState<DimensionId>(dimensiones[0])
  const rutasDisponibles = RUTAS.filter((r) => r.dimensiones.includes(dimension))
  const [herramientasSel, setHerramientasSel] = useState<string[]>([])
  const [necesidadPriorizada, setNecesidadPriorizada] = useState('')
  const [objetivoObservable, setObjetivoObservable] = useState('')
  const [frecuencia, setFrecuencia] = useState('')
  const [apoyoNecesario, setApoyoNecesario] = useState('')
  const [evidencia, setEvidencia] = useState('')
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().slice(0, 10))
  const [fechaRevision, setFechaRevision] = useState('')
  const [vozEstudiante, setVozEstudiante] = useState('')

  function toggleHerramienta(h: string) {
    setHerramientasSel((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]))
  }

  async function crear() {
    await createGoal.mutateAsync({
      studentId,
      dimension,
      necesidadPriorizada,
      objetivoObservable,
      herramientas: herramientasSel,
      frecuencia,
      apoyoNecesario: apoyoNecesario || undefined,
      evidencia,
      fechaInicio,
      fechaRevision,
      estado: 'activo',
      vozEstudiante: vozEstudiante || undefined,
    })
    toast.success('Objetivo creado')
    onCreated()
  }

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Dimensión</Label>
          <NativeSelect value={dimension} onChange={(e) => setDimension(e.target.value as DimensionId)}>
            {dimensiones.map((d) => (
              <option key={d} value={d}>
                {d} · {DIMENSIONES[d].nombre}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div>
          <Label>Fecha de inicio</Label>
          <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Necesidad priorizada</Label>
        <Textarea value={necesidadPriorizada} onChange={(e) => setNecesidadPriorizada(e.target.value)} />
      </div>
      <div>
        <Label>Objetivo observable</Label>
        <Textarea value={objetivoObservable} onChange={(e) => setObjetivoObservable(e.target.value)} />
      </div>
      <div>
        <Label>Herramientas (de las rutas de la dimensión)</Label>
        <div className="flex flex-wrap gap-1.5">
          {rutasDisponibles.flatMap((r) => r.herramientas).map((h) => (
            <button
              type="button"
              key={h}
              onClick={() => toggleHerramienta(h)}
              className={`rounded-full border px-2.5 py-0.5 text-[12px] ${herramientasSel.includes(h) ? 'border-primary bg-primary-soft text-primary-strong' : 'hover:bg-surface-2'}`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Frecuencia</Label>
          <Input value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)} placeholder="Ej: 3 veces por semana" />
        </div>
        <div>
          <Label>Fecha de revisión</Label>
          <Input type="date" value={fechaRevision} onChange={(e) => setFechaRevision(e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Apoyo necesario (opcional)</Label>
        <Input value={apoyoNecesario} onChange={(e) => setApoyoNecesario(e.target.value)} />
      </div>
      <div>
        <Label>Evidencia</Label>
        <Input value={evidencia} onChange={(e) => setEvidencia(e.target.value)} placeholder="Qué producto o conducta mostrará avance" />
      </div>
      <div>
        <Label>Voz del estudiante (opcional)</Label>
        <Input value={vozEstudiante} onChange={(e) => setVozEstudiante(e.target.value)} />
      </div>
      <Button onClick={crear} disabled={createGoal.isPending || !objetivoObservable || !fechaRevision}>
        Crear objetivo
      </Button>
    </div>
  )
}
