import { useState } from 'react'
import { Plus, Video, Users as UsersIcon } from 'lucide-react'
import { useCreateSession, useSessions } from '@/hooks/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input, Label, NativeSelect, Textarea } from '@/components/ui/input'
import { EmptyState } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { fechaHora } from '@/lib/utils'
import type { SessionMode, SessionStatus, Student } from '@/types'

const ESTADO_LABEL: Record<SessionStatus, string> = {
  programada: 'Programada',
  realizada: 'Realizada',
  cancelada: 'Cancelada',
}

export function SessionsTab({ student }: { student: Student }) {
  const { data: sessions = [] } = useSessions(student.id)
  const createSession = useCreateSession()
  const [formOpen, setFormOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sesiones</CardTitle>
            <Button size="sm" onClick={() => setFormOpen((v) => !v)}>
              <Plus /> Registrar sesión
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {formOpen && <NuevaSesionForm studentId={student.id} createSession={createSession} onCreated={() => setFormOpen(false)} />}

          {sessions.length === 0 ? (
            <EmptyState icon={UsersIcon} title="Sin sesiones registradas" description="Registrá la primera sesión para empezar el historial." />
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="rounded-lg border p-3">
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-medium">{s.titulo}</p>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline">{ESTADO_LABEL[s.estado]}</Badge>
                    <Badge variant={s.modalidad === 'virtual' ? 'secundario' : 'outline'}>
                      {s.modalidad === 'virtual' ? <Video className="h-3 w-3" /> : <UsersIcon className="h-3 w-3" />}
                      {s.modalidad === 'virtual' ? 'Virtual' : 'Presencial'}
                    </Badge>
                  </div>
                </div>
                <p className="text-[12px] text-faint">
                  {fechaHora(s.fecha)} · {s.duracionMin} min
                  {s.monto !== undefined && ` · ${s.cobrado ? 'Cobrada' : 'Pendiente de cobro'}`}
                </p>
                {s.notas && <p className="mt-2 text-[13px] text-muted-foreground">{s.notas}</p>}
                {s.proximosPasos && <p className="mt-1 text-[12.5px] text-faint">Próximos pasos: {s.proximosPasos}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function NuevaSesionForm({
  studentId,
  createSession,
  onCreated,
}: {
  studentId: string
  createSession: ReturnType<typeof useCreateSession>
  onCreated: () => void
}) {
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 16))
  const [duracionMin, setDuracionMin] = useState(45)
  const [modalidad, setModalidad] = useState<SessionMode>('presencial')
  const [estado, setEstado] = useState<SessionStatus>('realizada')
  const [titulo, setTitulo] = useState('')
  const [notas, setNotas] = useState('')
  const [proximosPasos, setProximosPasos] = useState('')
  const [monto, setMonto] = useState('')
  const [cobrado, setCobrado] = useState(false)

  async function crear() {
    await createSession.mutateAsync({
      studentId,
      fecha: new Date(fecha).toISOString(),
      duracionMin,
      modalidad,
      estado,
      titulo: titulo || 'Sesión',
      notas,
      proximosPasos: proximosPasos || undefined,
      monto: monto ? Number(monto) : undefined,
      cobrado: monto ? cobrado : undefined,
    })
    toast.success('Sesión registrada')
    onCreated()
  }

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Título</Label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Seguimiento de plan" />
        </div>
        <div>
          <Label>Fecha y hora</Label>
          <Input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Duración (min)</Label>
          <Input type="number" value={duracionMin} onChange={(e) => setDuracionMin(Number(e.target.value))} />
        </div>
        <div>
          <Label>Modalidad</Label>
          <NativeSelect value={modalidad} onChange={(e) => setModalidad(e.target.value as SessionMode)}>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
          </NativeSelect>
        </div>
        <div>
          <Label>Estado</Label>
          <NativeSelect value={estado} onChange={(e) => setEstado(e.target.value as SessionStatus)}>
            <option value="programada">Programada</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </NativeSelect>
        </div>
      </div>
      <div>
        <Label>Notas</Label>
        <Textarea value={notas} onChange={(e) => setNotas(e.target.value)} />
      </div>
      <div>
        <Label>Próximos pasos (opcional)</Label>
        <Input value={proximosPasos} onChange={(e) => setProximosPasos(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Honorario (opcional)</Label>
          <Input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="Monto" />
        </div>
        {monto && (
          <label className="flex items-center gap-2 self-end pb-2 text-[13px]">
            <input type="checkbox" checked={cobrado} onChange={(e) => setCobrado(e.target.checked)} />
            Ya cobrada
          </label>
        )}
      </div>
      <Button onClick={crear} disabled={createSession.isPending}>
        Guardar sesión
      </Button>
    </div>
  )
}
