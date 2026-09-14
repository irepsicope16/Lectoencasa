import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/input'
import type { ActividadCatalogo, NivelActividad } from '@/types'

export const NIVEL_LABEL: Record<NivelActividad, string> = { 1: 'Nivel 1', 2: 'Nivel 2', 3: 'Nivel 3' }
export const NIVEL_BADGE_VARIANT: Record<NivelActividad, 'default' | 'primario' | 'acento'> = {
  1: 'default',
  2: 'primario',
  3: 'acento',
}

/** Ficha de actividad con selector de sesión y botón Asignar — reutilizada en ActividadesTab y RecorridoTab. */
export function CatalogoActividadCard({
  actividad,
  sesiones,
  onAsignar,
}: {
  actividad: ActividadCatalogo
  sesiones: { id: string; label: string }[]
  onAsignar: (sessionId: string) => void
}) {
  const [sessionId, setSessionId] = useState('')
  return (
    <div className="rounded-xl border bg-surface p-3.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[13.5px] font-medium">{actividad.titulo}</p>
          <p className="mt-1 text-[12.5px] text-muted-foreground">{actividad.descripcion}</p>
        </div>
        <Badge variant={NIVEL_BADGE_VARIANT[actividad.nivel]}>{NIVEL_LABEL[actividad.nivel]}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <NativeSelect className="w-52" value={sessionId} onChange={(e) => setSessionId(e.target.value)}>
          <option value="">Sin sesión asignada</option>
          {sesiones.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </NativeSelect>
        <Button size="sm" variant="outline" onClick={() => onAsignar(sessionId)}>
          Asignar
        </Button>
      </div>
    </div>
  )
}
