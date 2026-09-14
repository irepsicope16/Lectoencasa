import { useState } from 'react'
import { CheckCircle2, Circle, FileText, MessageSquare, Sparkles } from 'lucide-react'
import { useCreateAsignacion, useFiles, useIntake, useResponses, useSessions } from '@/hooks/queries'
import { AvisoOrientativo } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { fechaCorta } from '@/lib/utils'
import { RUTAS } from '@/data/rutas'
import { ACTIVIDADES } from '@/data/actividades'
import { FICHAS_POR_RUTA, type NivelHerramienta } from '@/data/biblioteca'
import { ITEMS } from '@/data/items'
import { CatalogoActividadCard } from '../shared/CatalogoActividadCard'
import { moduleCardStyle } from '@/lib/moduleColors'
import type { ActividadCatalogo, Student } from '@/types'

const NIVEL_INFO: Record<NivelHerramienta, { titulo: string; subtitulo: string }> = {
  1: { titulo: 'Nivel 1', subtitulo: 'Arranque: entrevista, ficha inicial y autoperfil' },
  2: { titulo: 'Nivel 2', subtitulo: 'Secundario: mayor complejidad' },
  3: { titulo: 'Nivel 3', subtitulo: 'Ingreso a la universidad: mayor exigencia cognitiva' },
}

export function RecorridoTab({ student, onNavigateTab }: { student: Student; onNavigateTab: (tab: string) => void }) {
  const [nivel, setNivel] = useState<NivelHerramienta>(1)
  const { data: intake } = useIntake(student.id)
  const { data: responses = [] } = useResponses(student.id)
  const { data: files = [] } = useFiles(student.id)
  const { data: sesionesRaw = [] } = useSessions(student.id)
  const createAsignacion = useCreateAsignacion()

  const respondidos = new Set(responses.map((r) => r.itemId)).size
  const autoperfilCompleto = respondidos >= ITEMS.length

  const sesiones = sesionesRaw.map((s) => ({ id: s.id, label: `${fechaCorta(s.fecha)} · ${s.titulo}` }))

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
        Un recorrido de menor a mayor complejidad: Nivel 1 es el punto de partida de cualquier estudiante, más allá
        de su edad o año escolar; los niveles 2 y 3 suman desafíos cognitivos alineados a la etapa educativa.
      </AvisoOrientativo>

      <div className="grid gap-3 sm:grid-cols-3">
        {([1, 2, 3] as NivelHerramienta[]).map((n) => (
          <button
            key={n}
            onClick={() => setNivel(n)}
            className={`rounded-xl border p-4 text-left transition-colors ${
              nivel === n ? 'border-primary bg-primary-soft/50' : 'bg-surface hover:bg-surface-2'
            }`}
          >
            <p className="font-display text-[19px] font-semibold tracking-tight">{NIVEL_INFO[n].titulo}</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{NIVEL_INFO[n].subtitulo}</p>
          </button>
        ))}
      </div>

      {nivel === 1 && (
        <div className="grid gap-2.5 sm:grid-cols-3">
          <button
            onClick={() => onNavigateTab('entrevista')}
            className="flex items-start gap-2.5 rounded-xl border bg-surface p-3.5 text-left hover:bg-surface-2"
          >
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <div>
              <p className="text-[13px] font-medium">Entrevista y ficha inicial</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-faint">
                {intake ? <CheckCircle2 className="h-3 w-3 text-primary" /> : <Circle className="h-3 w-3" />}
                {intake ? 'Completa' : 'Pendiente'}
              </p>
            </div>
          </button>
          <button
            onClick={() => onNavigateTab('autoperfil')}
            className="flex items-start gap-2.5 rounded-xl border bg-surface p-3.5 text-left hover:bg-surface-2"
          >
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <div>
              <p className="text-[13px] font-medium">Encuesta de autopercepción</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-faint">
                {autoperfilCompleto ? <CheckCircle2 className="h-3 w-3 text-primary" /> : <Circle className="h-3 w-3" />}
                {respondidos}/{ITEMS.length} respondidas
              </p>
            </div>
          </button>
          <button
            onClick={() => onNavigateTab('evaluacion')}
            className="flex items-start gap-2.5 rounded-xl border bg-surface p-3.5 text-left hover:bg-surface-2"
          >
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <div>
              <p className="text-[13px] font-medium">Screenings y tests</p>
              <p className="mt-0.5 text-[11.5px] text-faint">{files.length} subidos</p>
            </div>
          </button>
        </div>
      )}

      <div className="space-y-6">
        {RUTAS.map((ruta) => {
          const fichas = (FICHAS_POR_RUTA[ruta.id] ?? []).filter((f) => f.nivel === nivel)
          const actividades = ACTIVIDADES.filter((a) => a.rutaId === ruta.id && a.nivel === nivel)
          if (fichas.length === 0 && actividades.length === 0) return null
          return (
            <section key={ruta.id}>
              <h3 className="mb-2.5 text-[13.5px] font-semibold tracking-tight">{ruta.nombre}</h3>
              <div className="grid gap-2.5 lg:grid-cols-2">
                {fichas.map((ficha) => (
                  <div key={ficha.herramienta} className="rounded-xl border border-t-[3px] p-3.5" style={moduleCardStyle(ruta.id)}>
                    <div className="mb-1 flex items-center gap-1.5">
                      <Badge variant="outline">Ficha</Badge>
                      <p className="text-[13px] font-medium">{ficha.herramienta}</p>
                    </div>
                    <p className="text-[12px] text-muted-foreground">{ficha.paraQue}</p>
                  </div>
                ))}
                {actividades.map((actividad) => (
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

      <Button variant="outline" size="sm" asChild>
        <a href="#/pro/biblioteca" target="_blank" rel="noopener noreferrer">
          Ver Biblioteca completa
        </a>
      </Button>
    </div>
  )
}
