import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, MessageCircleHeart, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import { FadeIn } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { useActivities, useCreate, useModuleProgress, useUpdate } from '@/hooks/queries'
import type { ModuleProgress } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { MODULE_MAP } from '@/data/modules'
import { cn } from '@/lib/utils'
import type { Activity, ActivityAnswer } from '@/types'

export default function ActivityRunnerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { data: activities = [] } = useActivities()
  const { data: progress = [] } = useModuleProgress()
  const createProgress = useCreate<ModuleProgress>('moduleProgress')
  const updateProgress = useUpdate<ModuleProgress>('moduleProgress')
  const activity = activities.find((a) => a.id === id)

  const updateActivity = useUpdate<Activity>('activities', (a) =>
    a.estado === 'completada'
      ? {
          actor: 'consultante' as const,
          consultantId: a.consultantId,
          tipo: 'actividad_completada' as const,
          descripcion: `${user?.nombre ?? 'Consultante'} completó «${a.titulo}»`,
        }
      : null,
  )

  const initial = useMemo(() => {
    const map: Record<string, string> = {}
    activity?.respuestas.forEach((r) => (map[r.questionId] = r.texto))
    return map
  }, [activity])

  const [answers, setAnswers] = useState<Record<string, string> | null>(null)
  const values = answers ?? initial
  const [saved, setSaved] = useState(false)

  if (!activity) {
    return (
      <div className="py-20 text-center text-sm text-faint">
        Actividad no encontrada.{' '}
        <Link to="/mi/actividades" className="text-primary underline">
          Volver
        </Link>
      </div>
    )
  }

  const readOnly = activity.estado === 'revisada'
  const answered = activity.preguntas.filter((q) => (values[q.id] ?? '').trim().length > 0).length
  const allAnswered = answered === activity.preguntas.length

  const buildRespuestas = (): ActivityAnswer[] =>
    activity.preguntas
      .filter((q) => (values[q.id] ?? '').trim())
      .map((q) => ({ questionId: q.id, texto: values[q.id].trim(), fecha: new Date().toISOString() }))

  const save = async (complete: boolean) => {
    // Automatización: empezar a responder pone el módulo «en progreso» automáticamente.
    const mp = progress.find(
      (p) => p.consultantId === activity.consultantId && p.moduleId === activity.moduleId,
    )
    if (!mp) {
      await createProgress.mutateAsync({
        consultantId: activity.consultantId,
        moduleId: activity.moduleId,
        estado: 'en_progreso',
        notasProfesionales: '',
        notasConsultante: '',
        fechaInicio: new Date().toISOString(),
      })
    } else if (mp.estado === 'no_iniciado') {
      await updateProgress.mutateAsync({
        id: mp.id,
        patch: { estado: 'en_progreso', fechaInicio: mp.fechaInicio ?? new Date().toISOString() },
      })
    }

    await updateActivity.mutateAsync({
      id: activity.id,
      patch: {
        respuestas: buildRespuestas(),
        estado: complete ? 'completada' : 'en_progreso',
        fechaCompletada: complete ? new Date().toISOString() : undefined,
      },
    })
    if (complete) {
      toast.success('¡Actividad entregada! Tu profesional la va a revisar.')
      navigate('/mi/actividades')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }
  }

  const setValue = (qid: string, v: string) => setAnswers({ ...values, [qid]: v })

  const toggleOption = (qid: string, opt: string) => {
    const current = (values[qid] ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    const next = current.includes(opt) ? current.filter((x) => x !== opt) : [...current, opt]
    setValue(qid, next.join(', '))
  }

  return (
    <FadeIn className="mx-auto max-w-2xl">
      <Link
        to="/mi/actividades"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Mis actividades
      </Link>

      <div className="mb-6">
        <Badge variant="outline">{MODULE_MAP[activity.moduleId].nombre}</Badge>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">{activity.titulo}</h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{activity.descripcion}</p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-2">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${(answered / activity.preguntas.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="mt-1 text-[11.5px] text-faint">
          {answered} de {activity.preguntas.length} consignas respondidas
        </p>
      </div>

      <div className="space-y-4">
        {activity.preguntas.map((q, i) => (
          <Card key={q.id}>
            <CardContent className="p-5">
              <p className="text-[13.5px] font-medium">
                <span className="mr-2 text-faint">{i + 1}.</span>
                {q.texto}
              </p>
              {q.ayuda && <p className="mt-1 text-[12px] italic text-faint">{q.ayuda}</p>}
              {q.tipo === 'seleccion' && q.opciones ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {q.opciones.map((opt) => {
                    const active = (values[q.id] ?? '').includes(opt)
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={readOnly}
                        onClick={() => toggleOption(q.id, opt)}
                        className={cn(
                          'cursor-pointer rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-all',
                          active
                            ? 'border-primary bg-primary-soft text-primary-strong'
                            : 'text-muted-foreground hover:bg-surface-2',
                          readOnly && 'cursor-default opacity-70',
                        )}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <Textarea
                  value={values[q.id] ?? ''}
                  onChange={(e) => setValue(q.id, e.target.value)}
                  disabled={readOnly}
                  placeholder="Escribí tu respuesta con tus palabras…"
                  className="mt-3 min-h-[110px]"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {activity.feedbackProfesional && (
        <div className="mt-5 rounded-xl border border-accent/40 bg-accent-soft/50 p-4">
          <p className="flex items-center gap-2 text-[12.5px] font-semibold text-accent-strong">
            <MessageCircleHeart className="h-4 w-4" /> Devolución de tu profesional
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed">{activity.feedbackProfesional}</p>
        </div>
      )}

      {!readOnly && (
        <div className="sticky bottom-4 mt-6 flex items-center justify-end gap-2 rounded-xl border bg-surface/95 p-3 shadow-sm backdrop-blur">
          {saved && <span className="text-[12px] text-primary">Guardado ✓</span>}
          <Button variant="outline" onClick={() => save(false)}>
            <Save /> Guardar borrador
          </Button>
          <Button onClick={() => save(true)} disabled={!allAnswered}>
            <CheckCircle2 /> Entregar actividad
          </Button>
        </div>
      )}
    </FadeIn>
  )
}
