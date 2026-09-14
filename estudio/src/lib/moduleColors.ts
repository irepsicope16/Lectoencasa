import type { CSSProperties } from 'react'

// Color por módulo (ruta): un tono distinto por cada una de las 8 rutas,
// para diferenciarlas visualmente en Biblioteca, Recorrido y Actividades.
// Independiente del color de Nivel (que ya usa primario/secundario/acento) —
// por eso 3 rutas reusan esos mismos tokens y las otras 5 usan tonos nuevos.

export interface ModuleColor {
  color: string
  soft: string
}

export const RUTA_COLOR: Record<string, ModuleColor> = {
  organizar: { color: 'var(--color-mod-organizar)', soft: 'var(--color-mod-organizar-soft)' },
  sostener_atencion: { color: 'var(--color-mod-atencion)', soft: 'var(--color-mod-atencion-soft)' },
  comprender: { color: 'var(--color-secondary)', soft: 'var(--color-secondary-soft)' },
  escribir: { color: 'var(--color-mod-escribir)', soft: 'var(--color-mod-escribir-soft)' },
  aprender_recordar: { color: 'var(--color-mod-aprender)', soft: 'var(--color-mod-aprender-soft)' },
  prepararse_evaluar: { color: 'var(--color-accent)', soft: 'var(--color-accent-soft)' },
  regular_persistir: { color: 'var(--color-mod-regular)', soft: 'var(--color-mod-regular-soft)' },
  construir_autonomia: { color: 'var(--color-primary)', soft: 'var(--color-primary-soft)' },
}

/** Estilo listo para aplicar a una ficha/tarjeta: franja superior de color + sombra + fondo tintado. */
export function moduleCardStyle(rutaId: string): CSSProperties {
  const c = RUTA_COLOR[rutaId]
  if (!c) return {}
  return {
    borderTopColor: c.color,
    borderTopWidth: 3,
    backgroundColor: c.soft,
    boxShadow: `0 10px 20px -14px ${c.color}`,
  }
}
