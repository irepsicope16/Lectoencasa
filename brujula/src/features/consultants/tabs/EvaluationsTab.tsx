import { useState } from 'react'
import { ClipboardList, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input, Label, NativeSelect, Textarea } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmptyState } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { useCreate, useEvaluations } from '@/hooks/queries'
import { fechaCorta } from '@/lib/utils'
import { DIMENSION_LABELS } from '@/lib/constants'
import type { Consultant, EngineDimension, Evaluation, EvaluationItem } from '@/types'

const TIPOS = {
  inicial: 'Inicial',
  intereses: 'Intereses',
  aptitudes: 'Aptitudes',
  proceso: 'De proceso',
  cierre: 'De cierre',
} as const

interface DraftItem {
  dimension: EngineDimension
  etiqueta: string
  valor: number
  notas: string
}

export function EvaluationsTab({ consultant }: { consultant: Consultant }) {
  const { data: evaluations = [] } = useEvaluations()
  const createEvaluation = useCreate<Evaluation>('evaluations', (e) => ({
    actor: 'profesional',
    consultantId: e.consultantId,
    tipo: 'evaluacion_creada',
    descripcion: `Evaluación «${e.titulo}» registrada`,
  }))

  const [open, setOpen] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState<Evaluation['tipo']>('proceso')
  const [conclusiones, setConclusiones] = useState('')
  const [items, setItems] = useState<DraftItem[]>([
    { dimension: 'intereses', etiqueta: '', valor: 3, notas: '' },
  ])

  const own = evaluations
    .filter((e) => e.consultantId === consultant.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))

  const save = async () => {
    const finalItems: EvaluationItem[] = items
      .filter((i) => i.etiqueta.trim())
      .map((i, idx) => ({ id: `i${idx + 1}`, dimension: i.dimension, etiqueta: i.etiqueta.trim(), valor: i.valor, notas: i.notas || undefined }))
    await createEvaluation.mutateAsync({
      consultantId: consultant.id,
      titulo: titulo.trim() || 'Evaluación',
      tipo,
      fecha: new Date().toISOString(),
      items: finalItems,
      conclusiones,
    })
    toast.success('Evaluación guardada')
    setOpen(false)
    setTitulo('')
    setConclusiones('')
    setItems([{ dimension: 'intereses', etiqueta: '', valor: 3, notas: '' }])
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[12.5px] text-faint">
          Los valores 1–5 son de uso clínico interno: nunca se muestran como porcentaje al consultante.
        </p>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus /> Nueva evaluación
        </Button>
      </div>

      {own.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Sin evaluaciones"
          description="Registrá evaluaciones dimensionales para alimentar el Motor Brújula."
        />
      ) : (
        <div className="space-y-3">
          {own.map((e) => (
            <div key={e.id} className="rounded-xl border bg-surface p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[14px] font-semibold">{e.titulo}</p>
                <Badge variant="lavanda">{TIPOS[e.tipo]}</Badge>
                <span className="ml-auto text-[11.5px] text-faint">{fechaCorta(e.fecha)}</span>
              </div>
              <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                {e.items.map((i) => (
                  <div key={i.id} className="flex items-center gap-2 text-[12.5px]">
                    <span className="w-28 shrink-0 text-faint">{DIMENSION_LABELS[i.dimension]}</span>
                    <span className="flex-1 truncate">{i.etiqueta}</span>
                    <span className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={`h-1.5 w-3 rounded-full ${n <= i.valor ? 'bg-primary' : 'bg-surface-2'}`}
                        />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
              {e.conclusiones && (
                <p className="mt-3 border-t pt-3 text-[13px] leading-relaxed text-muted-foreground">
                  {e.conclusiones}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent wide>
          <DialogHeader>
            <DialogTitle>Nueva evaluación</DialogTitle>
            <DialogDescription>
              Registrá ítems dimensionales (Likert 1–5) con etiquetas descriptivas. Alimentan el Motor Brújula.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Título</Label>
                <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="p. ej. Evaluación de intereses" />
              </div>
              <div>
                <Label>Tipo</Label>
                <NativeSelect value={tipo} onChange={(e) => setTipo(e.target.value as never)}>
                  {Object.entries(TIPOS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ítems</Label>
              {items.map((item, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-2 rounded-lg border p-2.5">
                  <NativeSelect
                    className="w-36"
                    value={item.dimension}
                    onChange={(e) => {
                      const next = [...items]
                      next[idx] = { ...item, dimension: e.target.value as EngineDimension }
                      setItems(next)
                    }}
                  >
                    {Object.entries(DIMENSION_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </NativeSelect>
                  <Input
                    className="min-w-[180px] flex-1"
                    placeholder="Etiqueta (p. ej. Interés por el diseño)"
                    value={item.etiqueta}
                    onChange={(e) => {
                      const next = [...items]
                      next[idx] = { ...item, etiqueta: e.target.value }
                      setItems(next)
                    }}
                  />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          const next = [...items]
                          next[idx] = { ...item, valor: n }
                          setItems(next)
                        }}
                        className={`h-7 w-7 cursor-pointer rounded-md text-[12px] font-medium transition-colors ${
                          item.valor === n
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-surface-2 text-muted-foreground hover:bg-border'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="cursor-pointer p-1 text-faint hover:text-danger"
                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                    aria-label="Quitar ítem"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItems([...items, { dimension: 'intereses', etiqueta: '', valor: 3, notas: '' }])}
              >
                <Plus /> Agregar ítem
              </Button>
            </div>

            <div>
              <Label>Conclusiones</Label>
              <Textarea value={conclusiones} onChange={(e) => setConclusiones(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={!items.some((i) => i.etiqueta.trim())}>
              Guardar evaluación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
