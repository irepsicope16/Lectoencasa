import { useState } from 'react'
import { CheckCircle2, Circle, ListChecks, Trash2 } from 'lucide-react'
import { useAsignaciones, useCreateAsignacion, useDeleteAsignacion, useSessions, useUpdateAsignacion } from '@/hooks/queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AvisoOrientativo, EmptyState } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { fechaCorta } from '@/lib/utils'
import { RUTAS } from '@/data/rutas'
import { ACTIVIDADES } from '@/data/actividades'
import { CatalogoActividadCard, NIVEL_BADGE_VARIANT, NIVEL_LABEL } from '../shared/CatalogoActividadCard'
import { moduleCardStyle, RUTA_COLOR } from '@/lib/moduleColors'
import type { ActividadCatalogo, NivelActividad, Student } from '@/types'

type FiltroNivel = 'todos' | NivelActividad

export function ActividadesTab({ student }: { student: Student }) {
  const { data: sesionesRaw = [] } = useSessions(student.id)
  const { data: asignadas = [] } = useAsignaciones(student.id)
  const createAsignacion = useCreateAsignacion()
  const updateAsignacion = useUpdateAsignacion()
  const removeAsignacion = useDeleteAsignacion()
  const [filtro, setFiltro] = useState<FiltroNivel>('todos')

  const sesiones = sesionesRaw.map((s) => ({ id: s.id, label: `${fechaCorta(s.fecha)} · ${s.titulo}` }))
  const sesionLabel = (sessionId?: string) => sesiones.find((s) => s.id === sessionId)?.label

  async function asignar(actividad: ActividadCatalogo, sessionId: string) {
    await createAsignacion.mutateAsync({
      studentId: student.id,
      sessionId: sessionId || undefined,
      actividadId: actividad.id,
      rutaId: actividad.rutaId,
      nivel: actividad.nivel,
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      estado: 'pendiente',
      fechaAsignada: new Date().toISOString(),
    })
    toast.success(`«${actividad.titulo}» asignada`)
  }

  return (
    <div className="space-y-5">
      <AvisoOrientativo>
        Elegí actividades de la Biblioteca para trabajar en una sesión puntual o para llevarse de tarea — el nivel
        indica la complejidad, no una edad; podés arrancar por Nivel 1 aunque el estudiante sea de nivel superior.
      </AvisoOrientativo>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Asignadas</CardTitle>
            <div className="flex flex-wrap gap-1.5">
              {(['todos', 1, 2, 3] as FiltroNivel[]).map((n) => (
                <Button key={n} size="sm" variant={filtro === n ? 'default' : 'outline'} onClick={() => setFiltro(n)}>
                  {n === 'todos' ? 'Todos los niveles' : NIVEL_LABEL[n]}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {asignadas.length === 0 ? (
            <EmptyState icon={ListChecks} title="Todavía no asignaste actividades" description="Elegilas de la Biblioteca, más abajo." />
          ) : (
            <div className="space-y-2">
              {asignadas
                .filter((a) => filtro === 'todos' || a.nivel === filtro)
                .map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-xl border border-l-[3px] bg-surface p-3.5"
                    style={{ borderLeftColor: a.rutaId ? RUTA_COLOR[a.rutaId]?.color : undefined }}
                  >
                    <button
                      onClick={() =>
                        updateAsignacion.mutate({
                          id: a.id,
                          estado: a.estado === 'completada' ? 'pendiente' : 'completada',
                          fechaCompletada: a.estado === 'completada' ? undefined : new Date().toISOString(),
                        })
                      }
                      aria-label={a.estado === 'completada' ? 'Marcar pendiente' : 'Marcar completada'}
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
                        {sesionLabel(a.sessionId) ?? 'Sin sesión asignada'} · asignada {fechaCorta(a.fechaAsignada)}
                      </p>
                    </div>
                    {a.nivel && <Badge variant={NIVEL_BADGE_VARIANT[a.nivel]}>{NIVEL_LABEL[a.nivel]}</Badge>}
                    <Button variant="ghost" size="iconSm" onClick={() => removeAsignacion.mutate(a.id)} aria-label="Quitar">
                      <Trash2 className="text-danger" />
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        {RUTAS.map((ruta) => {
          const fichas = ACTIVIDADES.filter((a) => a.rutaId === ruta.id && (filtro === 'todos' || a.nivel === filtro))
          if (fichas.length === 0) return null
          return (
            <section key={ruta.id}>
              <h3 className="mb-2.5 text-[13.5px] font-semibold tracking-tight">{ruta.nombre}</h3>
              <div className="grid gap-2.5 lg:grid-cols-2">
                {fichas.map((actividad) => (
                  <CatalogoActividadCard
                    key={actividad.id}
                    actividad={actividad}
                    sesiones={sesiones}
                    onAsignar={(sessionId) => asignar(actividad, sessionId)}
                    moduleStyle={moduleCardStyle(ruta.id)}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
