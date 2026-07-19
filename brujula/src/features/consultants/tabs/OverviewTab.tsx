import { useState } from 'react'
import { MessageSquarePlus, NotebookPen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label, NativeSelect, Textarea } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  useActivities,
  useCreate,
  useObservations,
  useReflections,
  useSessions,
  useUpdate,
} from '@/hooks/queries'
import { fechaCorta, haceCuanto } from '@/lib/utils'
import { MODULES } from '@/data/modules'
import type { Consultant, Observation } from '@/types'

const OBS_TYPES = { clinica: 'Clínica', familiar: 'Familiar', escolar: 'Escolar', proceso: 'Proceso' } as const

export function OverviewTab({ consultant }: { consultant: Consultant }) {
  const { data: observations = [] } = useObservations()
  const { data: sessions = [] } = useSessions()
  const { data: activities = [] } = useActivities()
  const { data: reflections = [] } = useReflections()
  const createObs = useCreate<Observation>('observations')
  const updateConsultant = useUpdate<Consultant>('consultants')

  const [obsOpen, setObsOpen] = useState(false)
  const [obsText, setObsText] = useState('')
  const [obsTipo, setObsTipo] = useState<keyof typeof OBS_TYPES>('clinica')
  const [obsModulo, setObsModulo] = useState<string>('')
  const [notas, setNotas] = useState(consultant.notas ?? '')

  const own = observations
    .filter((o) => o.consultantId === consultant.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
  const ownReflections = reflections
    .filter((r) => r.consultantId === consultant.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const historial = [
    ...sessions
      .filter((s) => s.consultantId === consultant.id && s.estado === 'realizada')
      .map((s) => ({ fecha: s.fecha, texto: `Sesión: ${s.titulo}` })),
    ...activities
      .filter((a) => a.consultantId === consultant.id && a.fechaCompletada)
      .map((a) => ({ fecha: a.fechaCompletada!, texto: `Actividad completada: ${a.titulo}` })),
    ...ownReflections.map((r) => ({ fecha: r.createdAt, texto: `Reflexión: «${r.titulo}»` })),
  ].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* observaciones profesionales */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Observaciones profesionales</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setObsOpen(true)}>
            <MessageSquarePlus /> Nueva
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {own.map((o) => (
            <div key={o.id} className="rounded-lg border p-3">
              <div className="mb-1 flex items-center gap-2">
                <Badge variant="aqua">{OBS_TYPES[o.tipo]}</Badge>
                {o.moduleId && (
                  <Badge variant="outline">{MODULES.find((m) => m.id === o.moduleId)?.nombre}</Badge>
                )}
                <span className="ml-auto text-[11px] text-faint">{fechaCorta(o.fecha)}</span>
              </div>
              <p className="text-[13px] leading-relaxed">{o.texto}</p>
            </div>
          ))}
          {own.length === 0 && <p className="text-[13px] text-faint">Sin observaciones registradas.</p>}
        </CardContent>
      </Card>

      <div className="space-y-5">
        {/* notas de la ficha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <NotebookPen className="h-4 w-4 text-primary" /> Notas de la ficha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              onBlur={() => {
                if (notas !== (consultant.notas ?? ''))
                  updateConsultant.mutate({ id: consultant.id, patch: { notas } })
              }}
              placeholder="Notas generales del proceso (se guardan solas)…"
              className="min-h-[110px]"
            />
          </CardContent>
        </Card>

        {/* historial */}
        <Card>
          <CardHeader>
            <CardTitle>Historial del proceso</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative max-h-[320px] space-y-3.5 overflow-y-auto border-l pl-4">
              {historial.map((h, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[21.5px] top-1.5 h-2 w-2 rounded-full bg-accent" />
                  <p className="text-[13px]">{h.texto}</p>
                  <p className="text-[11px] text-faint">{haceCuanto(h.fecha)}</p>
                </li>
              ))}
              {historial.length === 0 && <p className="text-[13px] text-faint">El proceso recién comienza.</p>}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* diálogo nueva observación */}
      <Dialog open={obsOpen} onOpenChange={setObsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva observación</DialogTitle>
            <DialogDescription>Registro clínico visible solo para la profesional.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tipo</Label>
                <NativeSelect value={obsTipo} onChange={(e) => setObsTipo(e.target.value as never)}>
                  {Object.entries(OBS_TYPES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div>
                <Label>Módulo (opcional)</Label>
                <NativeSelect value={obsModulo} onChange={(e) => setObsModulo(e.target.value)}>
                  <option value="">Sin módulo</option>
                  {MODULES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.numero}. {m.nombre}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>
            <div>
              <Label>Observación</Label>
              <Textarea value={obsText} onChange={(e) => setObsText(e.target.value)} placeholder="¿Qué observaste?" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setObsOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={obsText.trim().length < 3}
              onClick={async () => {
                await createObs.mutateAsync({
                  consultantId: consultant.id,
                  fecha: new Date().toISOString(),
                  texto: obsText.trim(),
                  tipo: obsTipo,
                  moduleId: (obsModulo || undefined) as never,
                })
                setObsText('')
                setObsOpen(false)
              }}
            >
              Guardar observación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
