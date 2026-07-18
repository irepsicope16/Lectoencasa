import { useState } from 'react'
import { BookmarkPlus, Copy, Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/input'
import {
  useActivities,
  useCreate,
  useEvaluations,
  useModuleProgress,
  useObservations,
  useReflections,
  useSessions,
} from '@/hooks/queries'
import type { Observation } from '@/types'
import { AI_TASK_LABELS, getAIProvider, getAISettings, type AITask } from '@/services/ai'
import { fechaHora } from '@/lib/utils'
import type { AIDraft, Consultant } from '@/types'
import { Link } from 'react-router-dom'

export function AITab({ consultant }: { consultant: Consultant }) {
  const { data: activities = [] } = useActivities()
  const { data: evaluations = [] } = useEvaluations()
  const { data: reflections = [] } = useReflections()
  const { data: observations = [] } = useObservations()
  const { data: sessions = [] } = useSessions()
  const { data: progress = [] } = useModuleProgress()

  const [draft, setDraft] = useState<AIDraft | null>(null)
  const [running, setRunning] = useState<AITask | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const settings = getAISettings()
  const createObs = useCreate<Observation>('observations')

  const saveToRecord = async () => {
    if (!draft) return
    await createObs.mutateAsync({
      consultantId: consultant.id,
      fecha: new Date().toISOString(),
      tipo: 'proceso',
      texto: `[Borrador IA · ${draft.titulo}]\n\n${draft.contenido}`,
    })
    toast.success('Borrador guardado como observación en el Resumen')
  }

  const run = async (task: AITask) => {
    setRunning(task)
    setError('')
    try {
      const provider = getAIProvider()
      const result = await provider.run(task, {
        consultant,
        activities: activities.filter((a) => a.consultantId === consultant.id),
        evaluations: evaluations.filter((e) => e.consultantId === consultant.id),
        reflections: reflections.filter((r) => r.consultantId === consultant.id),
        observations: observations.filter((o) => o.consultantId === consultant.id),
        sessions: sessions.filter((s) => s.consultantId === consultant.id),
        progress,
      })
      setDraft(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al generar el borrador.')
    } finally {
      setRunning(null)
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      <div className="space-y-3">
        <div className="rounded-xl border border-dashed p-4">
          <p className="flex items-center gap-2 text-[13px] font-semibold">
            <Sparkles className="h-4 w-4 text-accent-strong" /> Asistente IA
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
            Genera <strong>borradores</strong> a partir de los datos reales del proceso. Nunca reemplaza el
            criterio profesional: todo se revisa y se edita.
          </p>
          <p className="mt-2 text-[11.5px] text-faint">
            Proveedor actual:{' '}
            <Badge variant={settings.proveedor === 'openai' && settings.apiKey ? 'lavanda' : 'gris'}>
              {settings.proveedor === 'openai' && settings.apiKey ? `OpenAI · ${settings.modelo}` : 'Asistente local'}
            </Badge>
            {' · '}
            <Link to="/pro/ajustes" className="text-primary underline">
              configurar
            </Link>
          </p>
        </div>
        {(Object.keys(AI_TASK_LABELS) as AITask[]).map((task) => (
          <button
            key={task}
            onClick={() => run(task)}
            disabled={running !== null}
            className="block w-full cursor-pointer rounded-xl border bg-surface p-3.5 text-left transition-all hover:border-border-strong hover:shadow-sm disabled:opacity-50"
          >
            <p className="text-[13px] font-medium">{AI_TASK_LABELS[task].titulo}</p>
            <p className="text-[12px] text-faint">{AI_TASK_LABELS[task].descripcion}</p>
            {running === task && <p className="mt-1 text-[11.5px] text-accent-strong">Generando…</p>}
          </button>
        ))}
      </div>

      <Card className="min-h-[400px]">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{draft ? draft.titulo : 'Borrador'}</CardTitle>
          {draft && (
            <div className="flex items-center gap-2">
              <span className="text-[11.5px] text-faint">
                {draft.proveedor === 'openai' ? 'OpenAI' : 'Asistente local'} · {fechaHora(draft.generadoEl)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(draft.contenido)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1500)
                }}
              >
                <Copy /> {copied ? 'Copiado' : 'Copiar'}
              </Button>
              <Button variant="soft" size="sm" onClick={saveToRecord}>
                <BookmarkPlus /> Guardar en la ficha
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {error && <p className="mb-3 rounded-lg bg-danger-soft px-3 py-2 text-[12.5px] text-danger">{error}</p>}
          {draft ? (
            <>
              <Textarea
                value={draft.contenido}
                onChange={(e) => setDraft({ ...draft, contenido: e.target.value })}
                className="min-h-[420px] font-mono text-[12.5px] leading-relaxed"
              />
              <p className="mt-2 text-[11.5px] text-faint">
                Este texto es un borrador editable. Revisalo con criterio clínico antes de usarlo.
              </p>
            </>
          ) : (
            <p className="py-16 text-center text-[13px] text-faint">
              Elegí una tarea a la izquierda para generar un borrador con los datos del proceso.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
