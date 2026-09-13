// ============================================================
// Motor de cálculo de Método Estudio — funciones puras, sin React.
// Implementa §7 (sistema de puntuación e interpretación) y §8 (motor de
// recomendaciones) del Documento Maestro V1. No decide por sí solo: cada
// salida es orientativa y requiere confirmación profesional (§14).
// ============================================================

import { itemsDeDimension } from '@/data/items'
import type {
  BandaNecesidad,
  DimensionId,
  FuenteResultado,
  NivelConfianza,
  QuestionnaireResponse,
} from '@/types'

const COMPLETITUD_MINIMA = 0.7

/**
 * Cálculo del autoperfil por dimensión (§7):
 * - Ítems de recurso se invierten: necesidad = 3 - respuesta.
 * - Ítems de dificultad conservan su valor.
 * - "No aplica" (valor null) queda fuera del denominador.
 * - Solo se calcula el promedio si se respondió al menos el 70% de la dimensión.
 */
export function calcularNecesidadDimension(
  dimension: DimensionId,
  respuestas: QuestionnaireResponse[],
): { promedio: number | null; completitud: number; banda: BandaNecesidad | null } {
  const items = itemsDeDimension(dimension)
  const porItem = new Map(respuestas.map((r) => [r.itemId, r]))

  let respondidos = 0
  let suma = 0
  let contados = 0

  for (const item of items) {
    const r = porItem.get(item.codigo)
    if (!r) continue
    respondidos += 1
    if (r.valor === null) continue // No aplica: fuera del denominador
    const necesidad = item.clave === 'recurso' ? 3 - r.valor : r.valor
    suma += necesidad
    contados += 1
  }

  const completitud = items.length > 0 ? respondidos / items.length : 0
  if (completitud < COMPLETITUD_MINIMA || contados === 0) {
    return { promedio: null, completitud, banda: null }
  }
  const promedio = suma / contados
  return { promedio, completitud, banda: bandaDeNecesidad(promedio) }
}

/** Tabla 15: rangos funcionales iniciales (no baremos), editables tras piloto. */
export function bandaDeNecesidad(promedio: number): BandaNecesidad {
  if (promedio <= 0.74) return 'baja'
  if (promedio <= 1.49) return 'leve'
  if (promedio <= 2.24) return 'moderada'
  return 'alta'
}

export const ETIQUETA_BANDA: Record<BandaNecesidad, string> = {
  baja: 'Necesidad baja — recurso disponible o sin dificultad frecuente declarada',
  leve: 'Necesidad leve — conviene observar y ofrecer una herramienta puntual',
  moderada: 'Necesidad moderada — área a fortalecer y posible objetivo de intervención',
  alta: 'Necesidad alta — prioridad potencial; requiere corroboración contextual',
}

/**
 * Tabla 16 — nivel de confianza de la conclusión, por convergencia de
 * fuentes. Sin tareas breves de desempeño en esta versión: las fuentes
 * disponibles son autoinforme, cuestionario de referente (12-15 años) y la
 * observación profesional (marcada explícitamente en la vista de integración).
 */
export function calcularConfianza(
  fuentesConvergentes: FuenteResultado[],
  bandaNecesidad: BandaNecesidad | null,
  estudianteReconoceInteres: boolean,
): NivelConfianza {
  const coinciden = fuentesConvergentes.length >= 2
  if (!coinciden) return 'exploratorio'
  const impactoActual = bandaNecesidad === 'moderada' || bandaNecesidad === 'alta'
  if (impactoActual && estudianteReconoceInteres) return 'prioritario'
  return 'convergente'
}

/**
 * Tabla 17 — puntaje de prioridad orientativo. Solo ordena opciones: el
 * profesional siempre confirma, reordena o descarta (§8, regla general de
 * prioridad). "Evidencia en tarea breve" queda en 0 en esta versión (no hay
 * batería de tareas todavía — ver backlog).
 */
export function calcularPuntajePrioridad(input: {
  necesidadDeclarada: number // 0-3
  impactoActual: number // 0-3
  frecuenciaMultiContexto: number // 0-2
  interesEstudiante: number // 0-2
  urgenciaEvaluacion: number // 0-1
}): number {
  return (
    input.necesidadDeclarada +
    input.impactoActual +
    input.frecuenciaMultiContexto +
    input.interesEstudiante +
    input.urgenciaEvaluacion
  )
}

export function necesidadDeclaradaDeBanda(banda: BandaNecesidad | null): number {
  if (banda === 'alta') return 3
  if (banda === 'moderada') return 2
  if (banda === 'leve') return 1
  return 0
}
