import { useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { useOpenAnswers, useResponses, useSaveOpenAnswer, useSaveResponse } from '@/hooks/queries'
import { DIMENSIONES, ITEMS, VERSION_CUESTIONARIO, itemsDeDimension } from '@/data/items'
import { PREGUNTAS_ABIERTAS } from '@/data/preguntasAbiertas'
import { MENSAJES } from '@/data/mensajes'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { AvisoOrientativo } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import type { DimensionId, Student } from '@/types'

const DIMENSION_IDS = Object.keys(DIMENSIONES) as DimensionId[]
const ESCALA = [
  { valor: 0 as const, label: 'Nunca o casi nunca' },
  { valor: 1 as const, label: 'A veces' },
  { valor: 2 as const, label: 'Frecuentemente' },
  { valor: 3 as const, label: 'Casi siempre' },
]

export function AutoperfilTab({ student }: { student: Student }) {
  const { data: responses = [] } = useResponses(student.id)
  const saveResponse = useSaveResponse()
  const { data: openAnswers = [] } = useOpenAnswers(student.id)
  const saveOpenAnswer = useSaveOpenAnswer()

  const [step, setStep] = useState(0) // 0..7 dimensiones, 8 = preguntas abiertas
  const totalSteps = DIMENSION_IDS.length + 1

  const respondidos = new Set(responses.map((r) => r.itemId)).size
  const progresoGlobal = Math.round((respondidos / ITEMS.length) * 100)

  function valorDe(itemId: string) {
    return responses.find((r) => r.itemId === itemId)
  }

  async function responder(itemId: string, valor: 0 | 1 | 2 | 3 | null) {
    const existing = valorDe(itemId)
    await saveResponse.mutateAsync({
      studentId: student.id,
      versionId: VERSION_CUESTIONARIO,
      itemId,
      valor,
      existingId: existing?.id,
    })
  }

  if (step < DIMENSION_IDS.length) {
    const dimension = DIMENSION_IDS[step]
    const items = itemsDeDimension(dimension)
    const completosEnDimension = items.filter((i) => valorDe(i.codigo)).length

    return (
      <div className="space-y-4">
        <AvisoOrientativo>{MENSAJES.antesDelPerfil}</AvisoOrientativo>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Dimensión {dimension} · {DIMENSIONES[dimension].nombre}
              </CardTitle>
              <span className="text-[12px] text-faint">{step + 1} / {totalSteps}</span>
            </div>
            <Progress value={(completosEnDimension / items.length) * 100} className="mt-2" />
            <CardDescription className="mt-1">
              Escala: 0 Nunca o casi nunca · 1 A veces · 2 Frecuentemente · 3 Casi siempre. Podés marcar "No aplica".
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {items.map((item) => {
              const r = valorDe(item.codigo)
              return (
                <div key={item.codigo} className="rounded-lg border p-3">
                  <p className="mb-2 text-[13px]">{item.enunciado}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ESCALA.map((op) => (
                      <button
                        key={op.valor}
                        type="button"
                        onClick={() => responder(item.codigo, op.valor)}
                        className={cn(
                          'rounded-full border px-3 py-1 text-[12px] font-medium transition-colors',
                          r?.valor === op.valor ? 'border-primary bg-primary-soft text-primary-strong' : 'hover:bg-surface-2',
                        )}
                      >
                        {op.valor} · {op.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => responder(item.codigo, null)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-[12px] font-medium transition-colors',
                        r && r.valor === null ? 'border-accent bg-accent-soft text-accent-strong' : 'hover:bg-surface-2',
                      )}
                    >
                      No aplica
                    </button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
        <div className="flex justify-between">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Anterior
          </Button>
          <Button onClick={() => setStep((s) => s + 1)}>{step === DIMENSION_IDS.length - 1 ? 'Ir a preguntas abiertas' : 'Siguiente dimensión'}</Button>
        </div>
        <p className="text-[12px] text-faint">Progreso global del autoperfil: {progresoGlobal}%. Se guarda automáticamente; podés pausar y retomar cuando quieras.</p>
      </div>
    )
  }

  return <PreguntasAbiertasStep studentId={student.id} openAnswers={openAnswers} saveOpenAnswer={saveOpenAnswer} onBack={() => setStep((s) => s - 1)} />
}

function PreguntasAbiertasStep({
  studentId,
  openAnswers,
  saveOpenAnswer,
  onBack,
}: {
  studentId: string
  openAnswers: ReturnType<typeof useOpenAnswers>['data']
  saveOpenAnswer: ReturnType<typeof useSaveOpenAnswer>
  onBack: () => void
}) {
  const respuestasIniciales = useMemo(() => {
    const map: Record<string, string> = {}
    for (const a of openAnswers ?? []) map[a.preguntaId] = a.texto
    return map
  }, [openAnswers])
  const [textos, setTextos] = useState<Record<string, string>>(respuestasIniciales)

  // openAnswers puede llegar después del primer render; sincronizamos apenas
  // esté disponible en vez de depender solo del valor inicial de useState.
  useEffect(() => {
    setTextos((prev) => ({ ...respuestasIniciales, ...prev }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAnswers])

  async function guardar() {
    for (const p of PREGUNTAS_ABIERTAS) {
      const existing = openAnswers?.find((a) => a.preguntaId === p.id)
      const texto = textos[p.id] ?? ''
      if (!texto && !existing) continue
      await saveOpenAnswer.mutateAsync({ studentId, preguntaId: p.id, texto, existingId: existing?.id })
    }
    toast.success('Autoperfil guardado')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" />
          <CardTitle>Preguntas abiertas</CardTitle>
        </div>
        <CardDescription>Últimas preguntas del autoperfil, en palabras del estudiante.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {PREGUNTAS_ABIERTAS.map((p) => (
          <div key={p.id}>
            <label className="mb-1.5 block text-[13px] font-medium">{p.texto}</label>
            <Textarea
              value={textos[p.id] ?? ''}
              onChange={(e) => setTextos((prev) => ({ ...prev, [p.id]: e.target.value }))}
            />
          </div>
        ))}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Volver a dimensiones
          </Button>
          <Button onClick={guardar} disabled={saveOpenAnswer.isPending}>
            {saveOpenAnswer.isPending ? 'Guardando…' : 'Guardar respuestas'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
