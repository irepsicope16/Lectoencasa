import { useState } from 'react'
import { CheckCircle2, Circle, ListChecks, Star, Trash2 } from 'lucide-react'
import {
  useActividadesProbadas,
  useActualizarActividad,
  useEliminarActividadProbada,
  useProbarActividad,
} from '@/hooks/queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/input'
import { AvisoOrientativo, EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { fechaCorta } from '@/lib/utils'
import { moduleCardStyle, RUTA_COLOR } from '@/lib/moduleColors'
import { RUTAS } from '@/data/rutas'
import { ACTIVIDADES } from '@/data/actividades'
import type { ActividadCatalogo, ActividadProbada, NivelActividad } from '@/types'

const NIVEL_LABEL: Record<NivelActividad, string> = { 1: 'Principiante', 2: 'Medio', 3: 'Superior' }
const NIVEL_BADGE_VARIANT: Record<NivelActividad, 'default' | 'primario' | 'acento'> = { 1: 'default', 2: 'primario', 3: 'acento' }

type FiltroNivel = 'todos' | NivelActividad

export default function ActividadesPage() {
  const { data: probadas = [] } = useActividadesProbadas()
  const probar = useProbarActividad()
  const [filtro, setFiltro] = useState<FiltroNivel>('todos')
  const [calificando, setCalificando] = useState<ActividadProbada | null>(null)

  const idsEnCurso = new Set(probadas.filter((a) => a.estado !== 'completada').map((a) => a.actividadId))

  async function probarActividad(actividad: ActividadCatalogo) {
    await probar.mutateAsync(actividad)
    toast.success(`Empezaste «${actividad.titulo}»`)
  }

  return (
    <FadeIn className="space-y-5">
      <PageHeader title="Actividades" subtitle="Elegí qué probar y marcá tu progreso — así armás tu propio ranking de qué te funciona." />
      <AvisoOrientativo>
        No hay una técnica mejor que otra en abstracto — probá, calificá cómo te fue y quedate con lo que te sirve.
      </AvisoOrientativo>

      <MisActividades probadas={probadas} onCalificar={setCalificando} />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Catálogo</CardTitle>
            <div className="flex flex-wrap gap-1.5">
              {(['todos', 1, 2, 3] as FiltroNivel[]).map((n) => (
                <Button key={n} size="sm" variant={filtro === n ? 'default' : 'outline'} onClick={() => setFiltro(n)}>
                  {n === 'todos' ? 'Todos los niveles' : NIVEL_LABEL[n]}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          {RUTAS.map((ruta) => {
            const fichas = ACTIVIDADES.filter((a) => a.rutaId === ruta.id && (filtro === 'todos' || a.nivel === filtro))
            if (fichas.length === 0) return null
            return (
              <section key={ruta.id}>
                <h3 className="mb-2.5 text-[13.5px] font-semibold tracking-tight">{ruta.nombre}</h3>
                <div className="grid gap-2.5 lg:grid-cols-2">
                  {fichas.map((actividad) => (
                    <div
                      key={actividad.id}
                      className="rounded-xl border border-t-[3px] p-3.5"
                      style={moduleCardStyle(ruta.id)}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-[13.5px] font-medium">{actividad.titulo}</p>
                          <p className="mt-1 text-[12.5px] text-muted-foreground">{actividad.descripcion}</p>
                        </div>
                        <Badge variant={NIVEL_BADGE_VARIANT[actividad.nivel]}>{NIVEL_LABEL[actividad.nivel]}</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3"
                        disabled={idsEnCurso.has(actividad.id)}
                        onClick={() => probarActividad(actividad)}
                      >
                        {idsEnCurso.has(actividad.id) ? 'Ya la estás probando' : 'Probar'}
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </CardContent>
      </Card>

      <DialogoCalificar actividad={calificando} onClose={() => setCalificando(null)} />
    </FadeIn>
  )
}

function MisActividades({
  probadas,
  onCalificar,
}: {
  probadas: ActividadProbada[]
  onCalificar: (a: ActividadProbada) => void
}) {
  const actualizar = useActualizarActividad()
  const eliminar = useEliminarActividadProbada()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis actividades</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {probadas.length === 0 ? (
          <EmptyState icon={ListChecks} title="Todavía no probaste ninguna" description="Elegí una del catálogo, más abajo." />
        ) : (
          <div className="space-y-2">
            {probadas.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-xl border border-l-[3px] bg-surface p-3.5"
                style={{ borderLeftColor: RUTA_COLOR[a.rutaId]?.color }}
              >
                <button
                  onClick={() => (a.estado === 'completada' ? actualizar.mutate({ id: a.id, estado: 'en_curso', fechaCompletada: undefined }) : onCalificar(a))}
                  aria-label={a.estado === 'completada' ? 'Marcar en curso' : 'Marcar completada'}
                >
                  {a.estado === 'completada' ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-faint" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-[13.5px] font-medium ${a.estado === 'completada' ? 'text-faint line-through' : ''}`}>{a.titulo}</p>
                  <p className="text-[11.5px] text-faint">
                    Empezada {fechaCorta(a.fechaInicio)}
                    {a.calificacion && (
                      <span className="ml-1.5 inline-flex items-center gap-0.5 text-warning">
                        {Array.from({ length: a.calificacion }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </span>
                    )}
                  </p>
                  {a.nota && <p className="mt-0.5 text-[11.5px] text-muted-foreground">{a.nota}</p>}
                </div>
                <Button variant="ghost" size="iconSm" onClick={() => eliminar.mutate(a.id)} aria-label="Quitar">
                  <Trash2 className="text-danger" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DialogoCalificar({ actividad, onClose }: { actividad: ActividadProbada | null; onClose: () => void }) {
  const actualizar = useActualizarActividad()
  const [calificacion, setCalificacion] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [nota, setNota] = useState('')

  async function guardar() {
    if (!actividad) return
    await actualizar.mutateAsync({
      id: actividad.id,
      estado: 'completada',
      fechaCompletada: new Date().toISOString(),
      calificacion,
      nota: nota.trim() || undefined,
    })
    toast.success('¡Completada! Quedó guardada en tu progreso.')
    setCalificacion(3)
    setNota('')
    onClose()
  }

  return (
    <Dialog open={!!actividad} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Cómo te fue con «{actividad?.titulo}»?</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex gap-1.5">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button key={n} onClick={() => setCalificacion(n)} aria-label={`${n} estrellas`}>
                <Star className={`h-6 w-6 ${n <= calificacion ? 'fill-warning text-warning' : 'text-faint'}`} />
              </button>
            ))}
          </div>
          <Textarea placeholder="¿Qué te funcionó o no te funcionó? (opcional)" value={nota} onChange={(e) => setNota(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={actualizar.isPending}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
