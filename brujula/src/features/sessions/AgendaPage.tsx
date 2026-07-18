import { useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarPlus, CheckCircle2, ChevronLeft, ChevronRight, Circle } from 'lucide-react'
import { FadeIn, PageHeader } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input, Label, NativeSelect, Textarea } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useConsultants, useCreate, useEvents, useSessions, useUpdate } from '@/hooks/queries'
import { cn, fechaHora, nombreCompleto } from '@/lib/utils'
import type { CalendarEvent, Consultant } from '@/types'

export default function AgendaPage() {
  const [month, setMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    titulo: '',
    tipo: 'tarea' as CalendarEvent['tipo'],
    fecha: format(new Date(), 'yyyy-MM-dd'),
    hora: '10:00',
    consultantId: '',
    notas: '',
  })

  const { data: events = [] } = useEvents()
  const { data: sessions = [] } = useSessions()
  const { data: consultants = [] } = useConsultants()
  const createEvent = useCreate<CalendarEvent>('events')
  const updateEvent = useUpdate<CalendarEvent>('events')

  // Sesiones que no tienen evento propio también aparecen en la agenda.
  const allItems = useMemo(() => {
    const sessionEventIds = new Set(events.filter((e) => e.sessionId).map((e) => e.sessionId))
    const extraSessions: CalendarEvent[] = sessions
      .filter((s) => !sessionEventIds.has(s.id) && s.estado === 'programada')
      .map((s) => ({
        id: `virtual-${s.id}`,
        fecha: s.fecha,
        titulo: s.titulo,
        tipo: 'sesion' as const,
        consultantId: s.consultantId,
        sessionId: s.id,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      }))
    return [...events, ...extraSessions]
  }, [events, sessions])

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [month])

  const itemsOf = (day: Date) => allItems.filter((e) => isSameDay(parseISO(e.fecha), day))
  const dayItems = itemsOf(selectedDay).sort((a, b) => a.fecha.localeCompare(b.fecha))

  const consultantName = (id?: string) => {
    const c = consultants.find((x: Consultant) => x.id === id)
    return c ? nombreCompleto(c) : null
  }

  return (
    <FadeIn>
      <PageHeader
        title="Agenda"
        subtitle="Sesiones, tareas y recordatorios del estudio."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <CalendarPlus /> Nuevo evento
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* calendario */}
        <div className="rounded-xl border bg-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold capitalize">
              {format(month, 'MMMM yyyy', { locale: es })}
            </h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="iconSm" onClick={() => setMonth(addMonths(month, -1))}>
                <ChevronLeft />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setMonth(new Date()); setSelectedDay(new Date()) }}>
                Hoy
              </Button>
              <Button variant="ghost" size="iconSm" onClick={() => setMonth(addMonths(month, 1))}>
                <ChevronRight />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase text-faint">
            {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const items = itemsOf(day)
              const selected = isSameDay(day, selectedDay)
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'flex h-[72px] cursor-pointer flex-col items-start gap-1 rounded-lg border border-transparent p-1.5 text-left transition-colors hover:bg-surface-2',
                    !isSameMonth(day, month) && 'opacity-35',
                    selected && 'border-primary bg-primary-soft/50',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full text-[11.5px]',
                      isToday(day) && 'bg-primary font-semibold text-primary-foreground',
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  <div className="flex w-full flex-col gap-0.5 overflow-hidden">
                    {items.slice(0, 2).map((e) => (
                      <span
                        key={e.id}
                        className={cn(
                          'truncate rounded px-1 py-px text-[9.5px] font-medium',
                          e.tipo === 'sesion'
                            ? 'bg-primary-soft text-primary-strong'
                            : e.tipo === 'tarea'
                              ? 'bg-accent-soft text-accent-strong'
                              : 'bg-warning-soft text-warning',
                        )}
                      >
                        {e.titulo}
                      </span>
                    ))}
                    {items.length > 2 && (
                      <span className="text-[9.5px] text-faint">+{items.length - 2} más</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* detalle del día */}
        <div className="rounded-xl border bg-surface p-4">
          <h3 className="mb-3 text-[13.5px] font-semibold capitalize">
            {format(selectedDay, "EEEE d 'de' MMMM", { locale: es })}
          </h3>
          <div className="space-y-2.5">
            {dayItems.map((e) => (
              <div key={e.id} className="rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={e.tipo === 'sesion' ? 'aqua' : e.tipo === 'tarea' ? 'lavanda' : 'amber'}
                  >
                    {e.tipo}
                  </Badge>
                  <span className="text-[11.5px] text-faint">{fechaHora(e.fecha)}</span>
                  {e.tipo !== 'sesion' && !e.id.startsWith('virtual-') && (
                    <button
                      className="ml-auto cursor-pointer text-faint transition-colors hover:text-primary"
                      onClick={() => updateEvent.mutate({ id: e.id, patch: { completado: !e.completado } })}
                      aria-label="Completar"
                    >
                      {e.completado ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                <p className={cn('mt-1.5 text-[13px] font-medium', e.completado && 'line-through opacity-60')}>
                  {e.titulo}
                </p>
                {consultantName(e.consultantId) && (
                  <p className="text-[12px] text-muted-foreground">{consultantName(e.consultantId)}</p>
                )}
                {e.notas && <p className="mt-1 text-[12px] text-faint">{e.notas}</p>}
              </div>
            ))}
            {dayItems.length === 0 && (
              <p className="py-8 text-center text-[13px] text-faint">Nada agendado este día.</p>
            )}
          </div>
        </div>
      </div>

      {/* nuevo evento */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo evento</DialogTitle>
            <DialogDescription>Agendá una tarea, recordatorio o sesión.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Título</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Tipo</Label>
                <NativeSelect value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as never })}>
                  <option value="tarea">Tarea</option>
                  <option value="recordatorio">Recordatorio</option>
                  <option value="sesion">Sesión</option>
                </NativeSelect>
              </div>
              <div>
                <Label>Fecha</Label>
                <Input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
              </div>
              <div>
                <Label>Hora</Label>
                <Input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Consultante (opcional)</Label>
              <NativeSelect
                value={form.consultantId}
                onChange={(e) => setForm({ ...form, consultantId: e.target.value })}
              >
                <option value="">Sin consultante</option>
                {consultants.map((c) => (
                  <option key={c.id} value={c.id}>
                    {nombreCompleto(c)}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div>
              <Label>Notas</Label>
              <Textarea value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} className="min-h-[60px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!form.titulo.trim() || !form.fecha}
              onClick={async () => {
                await createEvent.mutateAsync({
                  titulo: form.titulo.trim(),
                  tipo: form.tipo,
                  fecha: new Date(`${form.fecha}T${form.hora}:00`).toISOString(),
                  consultantId: form.consultantId || undefined,
                  notas: form.notas || undefined,
                  completado: false,
                })
                setSelectedDay(new Date(`${form.fecha}T${form.hora}:00`))
                setOpen(false)
                setForm({ ...form, titulo: '', notas: '' })
              }}
            >
              Agendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FadeIn>
  )
}
