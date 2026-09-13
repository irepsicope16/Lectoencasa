import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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
  subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarClock, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAllSessions, useCreateEvent, useEvents, useStudents } from '@/hooks/queries'
import { PageHeader, EmptyState, FadeIn } from '@/components/shared'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input, Label, NativeSelect } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/toast'
import type { CalendarEvent } from '@/types'

const TIPO_LABEL: Record<CalendarEvent['tipo'], string> = {
  sesion: 'Sesión',
  tarea: 'Tarea',
  recordatorio: 'Recordatorio',
}

export default function AgendaPage() {
  const user = useAuthStore((s) => s.user)
  const { data: students = [] } = useStudents(user?.id)
  const { data: sessions = [] } = useAllSessions(user?.id)
  const { data: events = [] } = useEvents(user?.id)
  const createEvent = useCreateEvent()

  const [mes, setMes] = useState(() => new Date())
  const [diaSeleccionado, setDiaSeleccionado] = useState(() => new Date())
  const [formOpen, setFormOpen] = useState(false)

  const nombreDe = (studentId?: string) => students.find((s) => s.id === studentId)?.nombre ?? ''
  const apellidoDe = (studentId?: string) => students.find((s) => s.id === studentId)?.apellido ?? ''

  const dias = useMemo(() => {
    const inicio = startOfWeek(startOfMonth(mes), { weekStartsOn: 1 })
    const fin = endOfWeek(endOfMonth(mes), { weekStartsOn: 1 })
    return eachDayOfInterval({ start: inicio, end: fin })
  }, [mes])

  function eventosDelDia(dia: Date) {
    const sesionesDelDia = sessions
      .filter((s) => isSameDay(parseISO(s.fecha), dia))
      .map((s) => ({ id: s.id, titulo: s.titulo, fecha: s.fecha, tipo: 'sesion' as const, studentId: s.studentId }))
    const eventosDelDia = events
      .filter((e) => isSameDay(parseISO(e.fecha), dia))
      .map((e) => ({ id: e.id, titulo: e.titulo, fecha: e.fecha, tipo: e.tipo, studentId: e.studentId }))
    return [...sesionesDelDia, ...eventosDelDia].sort((a, b) => a.fecha.localeCompare(b.fecha))
  }

  const itemsDelDiaSeleccionado = eventosDelDia(diaSeleccionado)

  return (
    <FadeIn>
      <PageHeader
        title="Agenda"
        subtitle="Sesiones y recordatorios"
        actions={
          <Button onClick={() => setFormOpen((v) => !v)}>
            <Plus /> Nuevo recordatorio
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardContent className="pt-5">
            <div className="mb-4 flex items-center justify-between">
              <Button variant="ghost" size="iconSm" onClick={() => setMes((m) => subMonths(m, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <p className="text-[14px] font-semibold capitalize">{format(mes, 'MMMM yyyy', { locale: es })}</p>
              <Button variant="ghost" size="iconSm" onClick={() => setMes((m) => addMonths(m, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-faint">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {dias.map((dia) => {
                const items = eventosDelDia(dia)
                const enMes = isSameMonth(dia, mes)
                const seleccionado = isSameDay(dia, diaSeleccionado)
                return (
                  <button
                    key={dia.toISOString()}
                    onClick={() => setDiaSeleccionado(dia)}
                    className={cn(
                      'flex h-16 flex-col items-center justify-start rounded-lg border p-1 text-[12px] transition-colors',
                      !enMes && 'text-faint opacity-40',
                      seleccionado ? 'border-primary bg-primary-soft' : 'border-transparent hover:bg-surface-2',
                    )}
                  >
                    <span className={cn('mb-0.5', isToday(dia) && 'font-semibold text-primary')}>{format(dia, 'd')}</span>
                    {items.length > 0 && (
                      <span className="flex gap-0.5">
                        {items.slice(0, 3).map((it) => (
                          <span
                            key={it.id}
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              it.tipo === 'sesion' ? 'bg-primary' : it.tipo === 'tarea' ? 'bg-secondary' : 'bg-accent',
                            )}
                          />
                        ))}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-5">
            <p className="text-[13px] font-semibold capitalize">{format(diaSeleccionado, "EEEE d 'de' MMMM", { locale: es })}</p>
            {formOpen && (
              <NuevoRecordatorioForm
                fecha={diaSeleccionado}
                students={students}
                createEvent={createEvent}
                onCreated={() => setFormOpen(false)}
              />
            )}
            {itemsDelDiaSeleccionado.length === 0 ? (
              <EmptyState icon={CalendarClock} title="Sin nada agendado" description="Elegí otro día o creá un recordatorio." />
            ) : (
              itemsDelDiaSeleccionado.map((it) => (
                <div key={it.id} className="rounded-lg border p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium">{it.titulo}</p>
                    <Badge variant={it.tipo === 'sesion' ? 'primario' : it.tipo === 'tarea' ? 'secundario' : 'acento'}>
                      {TIPO_LABEL[it.tipo]}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-faint">{format(parseISO(it.fecha), 'HH:mm')} h</p>
                  {it.studentId && (
                    <Link to={`/pro/estudiantes/${it.studentId}`} className="text-[12.5px] text-accent hover:underline">
                      {nombreDe(it.studentId)} {apellidoDe(it.studentId)}
                    </Link>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  )
}

function NuevoRecordatorioForm({
  fecha,
  students,
  createEvent,
  onCreated,
}: {
  fecha: Date
  students: { id: string; nombre: string; apellido: string }[]
  createEvent: ReturnType<typeof useCreateEvent>
  onCreated: () => void
}) {
  const [titulo, setTitulo] = useState('')
  const [hora, setHora] = useState('09:00')
  const [tipo, setTipo] = useState<CalendarEvent['tipo']>('recordatorio')
  const [studentId, setStudentId] = useState('')

  async function crear() {
    if (!titulo) return
    const [h, m] = hora.split(':').map(Number)
    const dt = new Date(fecha)
    dt.setHours(h, m, 0, 0)
    await createEvent.mutateAsync({
      fecha: dt.toISOString(),
      titulo,
      tipo,
      studentId: studentId || undefined,
    })
    toast.success('Recordatorio creado')
    setTitulo('')
    onCreated()
  }

  return (
    <div className="space-y-2 rounded-lg border border-dashed p-3">
      <div>
        <Label>Título</Label>
        <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Llamar a la familia" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Hora</Label>
          <Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        </div>
        <div>
          <Label>Tipo</Label>
          <NativeSelect value={tipo} onChange={(e) => setTipo(e.target.value as CalendarEvent['tipo'])}>
            <option value="recordatorio">Recordatorio</option>
            <option value="tarea">Tarea</option>
          </NativeSelect>
        </div>
      </div>
      <div>
        <Label>Estudiante (opcional)</Label>
        <NativeSelect value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          <option value="">Sin vincular</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre} {s.apellido}
            </option>
          ))}
        </NativeSelect>
      </div>
      <Button size="sm" onClick={crear} disabled={createEvent.isPending || !titulo}>
        Crear
      </Button>
    </div>
  )
}
