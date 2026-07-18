import { useMemo, useState } from 'react'
import { ClipboardPlus, Eye, ListChecks, MonitorPlay, Plus } from 'lucide-react'
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
import { useActivities, useCreate, useUpdate, useVideos } from '@/hooks/queries'
import { fechaCorta, nombreCompleto } from '@/lib/utils'
import { MODULES, MODULE_MAP } from '@/data/modules'
import { ACTIVITY_STATUS } from '@/lib/constants'
import type { Activity, AssignedVideo, CalendarEvent, Consultant, ModuleId } from '@/types'

const statusTone: Record<Activity['estado'], 'gris' | 'lavanda' | 'aqua' | 'amber'> = {
  pendiente: 'amber',
  en_progreso: 'lavanda',
  completada: 'aqua',
  revisada: 'gris',
}

export function ActivitiesTab({ consultant }: { consultant: Consultant }) {
  const { data: activities = [] } = useActivities()
  const { data: videos = [] } = useVideos()
  const createActivity = useCreate<Activity>('activities', (a) => ({
    actor: 'profesional',
    consultantId: a.consultantId,
    tipo: 'actividad_asignada',
    descripcion: `Se asignó «${a.titulo}» a ${nombreCompleto(consultant)}`,
  }))
  const updateActivity = useUpdate<Activity>('activities')
  const createVideo = useCreate<AssignedVideo>('videos')
  const createEvent = useCreate<CalendarEvent>('events')

  const [assignOpen, setAssignOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [viewing, setViewing] = useState<Activity | null>(null)
  const [feedback, setFeedback] = useState('')

  const [modId, setModId] = useState<ModuleId>('historia')
  const [templateId, setTemplateId] = useState('')
  const [custom, setCustom] = useState({ titulo: '', descripcion: '', preguntas: '', fechaLimite: '' })
  const [videoForm, setVideoForm] = useState({ moduleId: 'historia' as ModuleId, titulo: '', url: '', descripcion: '' })

  const own = activities
    .filter((a) => a.consultantId === consultant.id)
    .sort((a, b) => b.fechaAsignada.localeCompare(a.fechaAsignada))
  const ownVideos = videos.filter((v) => v.consultantId === consultant.id)

  const templates = useMemo(() => MODULE_MAP[modId].actividades, [modId])

  const assign = async () => {
    const tituloAsignado = templateId
      ? templates.find((t) => t.id === templateId)!.titulo
      : custom.titulo.trim()
    if (templateId) {
      const tpl = templates.find((t) => t.id === templateId)!
      await createActivity.mutateAsync({
        consultantId: consultant.id,
        moduleId: modId,
        templateId: tpl.id,
        titulo: tpl.titulo,
        descripcion: tpl.descripcion,
        tipo: tpl.tipo,
        preguntas: tpl.preguntas,
        respuestas: [],
        estado: 'pendiente',
        fechaAsignada: new Date().toISOString(),
        fechaLimite: custom.fechaLimite || undefined,
      })
    } else {
      await createActivity.mutateAsync({
        consultantId: consultant.id,
        moduleId: modId,
        titulo: custom.titulo.trim(),
        descripcion: custom.descripcion.trim(),
        tipo: 'ejercicio',
        preguntas: custom.preguntas
          .split('\n')
          .map((t) => t.trim())
          .filter(Boolean)
          .map((texto, i) => ({ id: `q${i + 1}`, texto, tipo: 'abierta' as const })),
        respuestas: [],
        estado: 'pendiente',
        fechaAsignada: new Date().toISOString(),
        fechaLimite: custom.fechaLimite || undefined,
      })
    }
    // Automatización: la fecha límite genera una tarea en la agenda del profesional.
    if (custom.fechaLimite) {
      await createEvent.mutateAsync({
        titulo: `Vence «${tituloAsignado}» de ${nombreCompleto(consultant)}`,
        tipo: 'tarea',
        fecha: new Date(`${custom.fechaLimite}T09:00:00`).toISOString(),
        consultantId: consultant.id,
        completado: false,
      })
    }
    toast.success(
      custom.fechaLimite
        ? 'Actividad asignada · se agendó el vencimiento como tarea'
        : 'Actividad asignada',
    )
    setAssignOpen(false)
    setTemplateId('')
    setCustom({ titulo: '', descripcion: '', preguntas: '', fechaLimite: '' })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => setVideoOpen(true)}>
          <MonitorPlay /> Asignar video
        </Button>
        <Button size="sm" onClick={() => setAssignOpen(true)}>
          <ClipboardPlus /> Asignar actividad
        </Button>
      </div>

      {own.length === 0 && ownVideos.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Sin actividades asignadas"
          description="Asigná actividades del método o creá una personalizada."
        />
      ) : (
        <div className="space-y-3">
          {own.map((a) => (
            <div key={a.id} className="rounded-xl border bg-surface p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[14px] font-semibold">{a.titulo}</p>
                <Badge variant="outline">{MODULE_MAP[a.moduleId].nombre}</Badge>
                <Badge variant={statusTone[a.estado]}>{ACTIVITY_STATUS[a.estado]}</Badge>
                <span className="ml-auto text-[11.5px] text-faint">
                  Asignada {fechaCorta(a.fechaAsignada)}
                  {a.fechaLimite && ` · límite ${fechaCorta(a.fechaLimite)}`}
                </span>
              </div>
              <p className="mt-1.5 text-[13px] text-muted-foreground">{a.descripcion}</p>
              <div className="mt-2.5 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setViewing(a)
                    setFeedback(a.feedbackProfesional ?? '')
                  }}
                >
                  <Eye /> Ver respuestas ({a.respuestas.length})
                </Button>
                {a.estado === 'completada' && (
                  <Button
                    size="sm"
                    variant="soft"
                    onClick={() => updateActivity.mutate({ id: a.id, patch: { estado: 'revisada' } })}
                  >
                    Marcar revisada
                  </Button>
                )}
              </div>
            </div>
          ))}

          {ownVideos.length > 0 && (
            <div className="rounded-xl border bg-surface p-4">
              <p className="mb-2 text-[13px] font-semibold">Videos asignados</p>
              <div className="space-y-2">
                {ownVideos.map((v) => (
                  <div key={v.id} className="flex items-center gap-2 text-[13px]">
                    <MonitorPlay className="h-4 w-4 shrink-0 text-accent-strong" />
                    <span className="font-medium">{v.titulo}</span>
                    <Badge variant="outline">{MODULE_MAP[v.moduleId].nombre}</Badge>
                    <Badge variant={v.visto ? 'aqua' : 'amber'}>{v.visto ? 'Visto' : 'Pendiente'}</Badge>
                    {v.comentarioConsultante && (
                      <span className="truncate text-[12px] text-muted-foreground">
                        “{v.comentarioConsultante}”
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* asignar actividad */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent wide>
          <DialogHeader>
            <DialogTitle>Asignar actividad</DialogTitle>
            <DialogDescription>
              Elegí una actividad del método o creá una personalizada para {nombreCompleto(consultant)}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Módulo</Label>
                <NativeSelect
                  value={modId}
                  onChange={(e) => {
                    setModId(e.target.value as ModuleId)
                    setTemplateId('')
                  }}
                >
                  {MODULES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.numero}. {m.nombre}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div>
                <Label>Fecha límite (opcional)</Label>
                <Input
                  type="date"
                  value={custom.fechaLimite}
                  onChange={(e) => setCustom({ ...custom, fechaLimite: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Actividad del método</Label>
              <div className="space-y-1.5">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplateId(templateId === t.id ? '' : t.id)}
                    className={`block w-full cursor-pointer rounded-lg border p-3 text-left transition-colors ${
                      templateId === t.id ? 'border-primary bg-primary-soft' : 'hover:bg-surface-2'
                    }`}
                  >
                    <p className="text-[13px] font-medium">{t.titulo}</p>
                    <p className="text-[12px] text-muted-foreground">{t.descripcion}</p>
                    <p className="mt-0.5 text-[11px] text-faint">
                      {t.preguntas.length} consignas · ~{t.duracionMin} min
                    </p>
                  </button>
                ))}
              </div>
            </div>
            {!templateId && (
              <div className="space-y-3 rounded-lg border border-dashed p-3">
                <p className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
                  <Plus className="h-3.5 w-3.5" /> O creá una actividad personalizada
                </p>
                <div>
                  <Label>Título</Label>
                  <Input value={custom.titulo} onChange={(e) => setCustom({ ...custom, titulo: e.target.value })} />
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea
                    value={custom.descripcion}
                    onChange={(e) => setCustom({ ...custom, descripcion: e.target.value })}
                    className="min-h-[60px]"
                  />
                </div>
                <div>
                  <Label>Consignas (una por línea)</Label>
                  <Textarea
                    value={custom.preguntas}
                    onChange={(e) => setCustom({ ...custom, preguntas: e.target.value })}
                    placeholder={'¿Qué descubriste?\n¿Qué te sorprendió?'}
                    className="min-h-[70px]"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAssignOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={assign} disabled={!templateId && custom.titulo.trim().length < 3}>
              Asignar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* asignar video */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar video</DialogTitle>
            <DialogDescription>El consultante lo verá en su módulo correspondiente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Módulo</Label>
              <NativeSelect
                value={videoForm.moduleId}
                onChange={(e) => setVideoForm({ ...videoForm, moduleId: e.target.value as ModuleId })}
              >
                {MODULES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.numero}. {m.nombre}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div>
              <Label>Título</Label>
              <Input value={videoForm.titulo} onChange={(e) => setVideoForm({ ...videoForm, titulo: e.target.value })} />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={videoForm.url}
                onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                placeholder="https://youtube.com/…"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={videoForm.descripcion}
                onChange={(e) => setVideoForm({ ...videoForm, descripcion: e.target.value })}
                className="min-h-[60px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setVideoOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!videoForm.titulo.trim() || !videoForm.url.trim()}
              onClick={async () => {
                await createVideo.mutateAsync({ consultantId: consultant.id, ...videoForm, visto: false })
                toast.success('Video asignado')
                setVideoOpen(false)
                setVideoForm({ moduleId: 'historia', titulo: '', url: '', descripcion: '' })
              }}
            >
              Asignar video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ver respuestas + feedback */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent wide>
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.titulo}</DialogTitle>
                <DialogDescription>{viewing.descripcion}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {viewing.preguntas.map((q) => {
                  const r = viewing.respuestas.find((x) => x.questionId === q.id)
                  return (
                    <div key={q.id}>
                      <p className="text-[13px] font-medium">{q.texto}</p>
                      {r ? (
                        <p className="mt-1 whitespace-pre-wrap rounded-lg bg-surface-2 p-3 text-[13px] leading-relaxed">
                          {r.texto}
                        </p>
                      ) : (
                        <p className="mt-1 text-[12.5px] italic text-faint">Sin responder todavía.</p>
                      )}
                    </div>
                  )
                })}
                <div>
                  <Label>Devolución profesional</Label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="El consultante verá esta devolución junto a su actividad."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setViewing(null)}>
                  Cerrar
                </Button>
                <Button
                  onClick={async () => {
                    await updateActivity.mutateAsync({
                      id: viewing.id,
                      patch: {
                        feedbackProfesional: feedback,
                        estado: viewing.estado === 'completada' ? 'revisada' : viewing.estado,
                      },
                    })
                    setViewing(null)
                  }}
                >
                  Guardar devolución
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
