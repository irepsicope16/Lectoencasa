import { useState } from 'react'
import { CheckCircle2, ChevronRight, Circle, CircleDot } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label, NativeSelect, Textarea } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useActivities, useCreate, useModuleProgress, useUpdate } from '@/hooks/queries'
import { MODULES } from '@/data/modules'
import { STAGES } from '@/lib/constants'
import { moduleActivityStats } from '@/lib/progress'
import type { Consultant, ModuleDefinition, ModuleProgress, ModuleProgressStatus } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_META: Record<ModuleProgressStatus, { label: string; icon: typeof Circle; cls: string }> = {
  no_iniciado: { label: 'No iniciado', icon: Circle, cls: 'text-faint' },
  en_progreso: { label: 'En progreso', icon: CircleDot, cls: 'text-accent-strong' },
  completado: { label: 'Completado', icon: CheckCircle2, cls: 'text-primary' },
}

export function ModulesTab({ consultant }: { consultant: Consultant }) {
  const { data: progress = [] } = useModuleProgress()
  const { data: activities = [] } = useActivities()
  const createProgress = useCreate<ModuleProgress>('moduleProgress')
  const updateProgress = useUpdate<ModuleProgress>('moduleProgress')
  const [selected, setSelected] = useState<ModuleDefinition | null>(null)
  const [notas, setNotas] = useState('')

  const progressOf = (moduleId: string) =>
    progress.find((p) => p.consultantId === consultant.id && p.moduleId === moduleId)

  const setEstado = async (mod: ModuleDefinition, estado: ModuleProgressStatus) => {
    const existing = progressOf(mod.id)
    const now = new Date().toISOString()
    if (existing) {
      await updateProgress.mutateAsync({
        id: existing.id,
        patch: {
          estado,
          fechaInicio: existing.fechaInicio ?? (estado !== 'no_iniciado' ? now : undefined),
          fechaCompletado: estado === 'completado' ? now : undefined,
        },
      })
    } else {
      await createProgress.mutateAsync({
        consultantId: consultant.id,
        moduleId: mod.id,
        estado,
        notasProfesionales: '',
        notasConsultante: '',
        fechaInicio: estado !== 'no_iniciado' ? now : undefined,
        fechaCompletado: estado === 'completado' ? now : undefined,
      })
    }
  }

  return (
    <div className="space-y-6">
      {(Object.keys(STAGES) as (keyof typeof STAGES)[]).map((stage) => (
        <div key={stage}>
          <div className="mb-2.5 flex items-baseline gap-2.5">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Etapa {STAGES[stage].orden} · {STAGES[stage].nombre}
            </h3>
            <span className="text-[12px] text-faint">{STAGES[stage].descripcion}</span>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {MODULES.filter((m) => m.etapa === stage).map((mod) => {
              const p = progressOf(mod.id)
              const estado = p?.estado ?? 'no_iniciado'
              const meta = STATUS_META[estado]
              const stats = moduleActivityStats(activities, consultant.id, mod.id)
              const Icon = meta.icon
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setSelected(mod)
                    setNotas(p?.notasProfesionales ?? '')
                  }}
                  className="group flex cursor-pointer items-center gap-3 rounded-xl border bg-surface p-3.5 text-left transition-all hover:border-border-strong hover:shadow-sm"
                >
                  <Icon className={cn('h-5 w-5 shrink-0', meta.cls)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium">
                      <span className="mr-1.5 text-[11px] font-semibold text-faint">{mod.numero}</span>
                      {mod.nombre}
                    </p>
                    <p className="text-[11.5px] text-faint">
                      {meta.label}
                      {stats.total > 0 && ` · ${stats.done}/${stats.total} actividades`}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent wide>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Módulo {selected.numero} · {selected.nombre}
                </DialogTitle>
                <DialogDescription>{selected.esencia}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="lavanda">{STAGES[selected.etapa].nombre}</Badge>
                  <div className="ml-auto flex items-center gap-2">
                    <Label className="mb-0">Estado</Label>
                    <NativeSelect
                      className="w-40"
                      value={progressOf(selected.id)?.estado ?? 'no_iniciado'}
                      onChange={(e) => setEstado(selected, e.target.value as ModuleProgressStatus)}
                    >
                      <option value="no_iniciado">No iniciado</option>
                      <option value="en_progreso">En progreso</option>
                      <option value="completado">Completado</option>
                    </NativeSelect>
                  </div>
                </div>

                <p className="text-[13px] leading-relaxed text-muted-foreground">{selected.introduccion}</p>

                <div>
                  <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wider text-faint">
                    Preguntas guía para la sesión
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-[13px] text-muted-foreground">
                    {selected.preguntasGuia.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label>Notas profesionales del módulo</Label>
                  <Textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Registro clínico de este módulo…"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setSelected(null)}>
                  Cerrar
                </Button>
                <Button
                  onClick={async () => {
                    const p = progressOf(selected.id)
                    if (p) {
                      await updateProgress.mutateAsync({ id: p.id, patch: { notasProfesionales: notas } })
                    } else {
                      await createProgress.mutateAsync({
                        consultantId: consultant.id,
                        moduleId: selected.id,
                        estado: 'no_iniciado',
                        notasProfesionales: notas,
                        notasConsultante: '',
                      })
                    }
                    setSelected(null)
                  }}
                >
                  Guardar notas
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
