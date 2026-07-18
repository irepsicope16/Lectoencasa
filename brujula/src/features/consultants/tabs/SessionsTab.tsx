import { useState } from 'react'
import { CalendarPlus, Clock, MapPin, Video } from 'lucide-react'
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
import { useCreate, useSessions, useUpdate } from '@/hooks/queries'
import { fechaHora, nombreCompleto } from '@/lib/utils'
import { MODULES } from '@/data/modules'
import { SESSION_STATUS } from '@/lib/constants'
import type { Consultant, ModuleId, Session } from '@/types'
import { CalendarDays } from 'lucide-react'

const emptyForm = {
  titulo: '',
  fecha: '',
  hora: '15:00',
  duracionMin: 60,
  modalidad: 'presencial' as Session['modalidad'],
  estado: 'programada' as Session['estado'],
  temas: '',
  notas: '',
  proximosPasos: '',
  moduleIds: [] as ModuleId[],
}

export function SessionsTab({ consultant }: { consultant: Consultant }) {
  const { data: sessions = [] } = useSessions()
  const createSession = useCreate<Session>('sessions', (s) => ({
    actor: 'profesional',
    consultantId: s.consultantId,
    tipo: 'sesion_registrada',
    descripcion: `Sesión «${s.titulo}» de ${nombreCompleto(consultant)} registrada`,
  }))
  const updateSession = useUpdate<Session>('sessions')

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Session | null>(null)
  const [form, setForm] = useState(emptyForm)

  const own = sessions
    .filter((s) => s.consultantId === consultant.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))

  const openNew = () => {
    setEditing(null)
    setForm({ ...emptyForm, fecha: new Date().toISOString().slice(0, 10) })
    setOpen(true)
  }

  const openEdit = (s: Session) => {
    setEditing(s)
    setForm({
      titulo: s.titulo,
      fecha: s.fecha.slice(0, 10),
      hora: s.fecha.slice(11, 16),
      duracionMin: s.duracionMin,
      modalidad: s.modalidad,
      estado: s.estado,
      temas: s.temas.join(', '),
      notas: s.notas,
      proximosPasos: s.proximosPasos,
      moduleIds: s.moduleIds,
    })
    setOpen(true)
  }

  const save = async () => {
    const fechaISO = new Date(`${form.fecha}T${form.hora}:00`).toISOString()
    const payload = {
      consultantId: consultant.id,
      titulo: form.titulo.trim() || 'Sesión',
      fecha: fechaISO,
      duracionMin: Number(form.duracionMin) || 60,
      modalidad: form.modalidad,
      estado: form.estado,
      temas: form.temas.split(',').map((t) => t.trim()).filter(Boolean),
      notas: form.notas,
      proximosPasos: form.proximosPasos,
      moduleIds: form.moduleIds,
    }
    if (editing) await updateSession.mutateAsync({ id: editing.id, patch: payload })
    else await createSession.mutateAsync(payload)
    setOpen(false)
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={openNew}>
          <CalendarPlus /> Registrar sesión
        </Button>
      </div>

      {own.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Sin sesiones"
          description="Registrá la primera sesión del proceso."
          action={
            <Button size="sm" onClick={openNew}>
              <CalendarPlus /> Registrar sesión
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {own.map((s) => (
            <button
              key={s.id}
              onClick={() => openEdit(s)}
              className="block w-full cursor-pointer rounded-xl border bg-surface p-4 text-left transition-all hover:border-border-strong hover:shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[14px] font-semibold">{s.titulo}</p>
                <Badge variant={s.estado === 'realizada' ? 'aqua' : s.estado === 'programada' ? 'lavanda' : 'gris'}>
                  {SESSION_STATUS[s.estado]}
                </Badge>
                <span className="ml-auto flex items-center gap-3 text-[12px] text-faint">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {fechaHora(s.fecha)} · {s.duracionMin} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    {s.modalidad === 'virtual' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                    {s.modalidad}
                  </span>
                </span>
              </div>
              {s.temas.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.temas.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
              {s.notas && <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">{s.notas}</p>}
              {s.proximosPasos && (
                <p className="mt-2 text-[12.5px]">
                  <span className="font-medium text-primary">Próximos pasos:</span>{' '}
                  <span className="text-muted-foreground">{s.proximosPasos}</span>
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent wide>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar sesión' : 'Registrar sesión'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Actualizá el registro de la sesión.' : `Nueva sesión con ${nombreCompleto(consultant)}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Título</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="p. ej. Trabajo sobre mandatos" />
            </div>
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
            </div>
            <div>
              <Label>Hora</Label>
              <Input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} />
            </div>
            <div>
              <Label>Duración (min)</Label>
              <Input
                type="number"
                value={form.duracionMin}
                onChange={(e) => setForm({ ...form, duracionMin: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Modalidad</Label>
              <NativeSelect value={form.modalidad} onChange={(e) => setForm({ ...form, modalidad: e.target.value as never })}>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
              </NativeSelect>
            </div>
            <div>
              <Label>Estado</Label>
              <NativeSelect value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as never })}>
                {Object.entries(SESSION_STATUS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div>
              <Label>Temas (separados por coma)</Label>
              <Input value={form.temas} onChange={(e) => setForm({ ...form, temas: e.target.value })} placeholder="Encuadre, Historia familiar" />
            </div>
            <div className="col-span-2">
              <Label>Módulos trabajados</Label>
              <div className="flex flex-wrap gap-1.5">
                {MODULES.map((m) => {
                  const active = form.moduleIds.includes(m.id)
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          moduleIds: active ? form.moduleIds.filter((x) => x !== m.id) : [...form.moduleIds, m.id],
                        })
                      }
                      className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                        active
                          ? 'border-primary bg-primary-soft text-primary-strong'
                          : 'text-muted-foreground hover:bg-surface-2'
                      }`}
                    >
                      {m.numero}. {m.nombre}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="col-span-2">
              <Label>Notas de la sesión</Label>
              <Textarea value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} className="min-h-[110px]" />
            </div>
            <div className="col-span-2">
              <Label>Próximos pasos</Label>
              <Textarea value={form.proximosPasos} onChange={(e) => setForm({ ...form, proximosPasos: e.target.value })} className="min-h-[60px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save} disabled={!form.fecha}>
              {editing ? 'Guardar cambios' : 'Registrar sesión'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
