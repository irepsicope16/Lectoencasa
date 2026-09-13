// Módulo de antecedentes e indicadores lectores (Documento Maestro, tabla 12
// y sección 5). Recoge indicadores de riesgo y antecedentes — nunca un test
// de dislexia ni un porcentaje de probabilidad diagnóstica.

export interface IndicadorLector {
  codigo: string // L1..L10
  pregunta: string
  /** L10 es de texto libre; el resto usa Sí/No/A veces (L1-L2: Sí/No/No sabe). */
  tipo: 'si_no_no_sabe' | 'si_no_a_veces' | 'texto'
}

export const INDICADORES_LECTORES: IndicadorLector[] = [
  { codigo: 'L1', tipo: 'si_no_no_sabe', pregunta: '¿Las dificultades de lectura o escritura están presentes desde los primeros años escolares?' },
  { codigo: 'L2', tipo: 'si_no_no_sabe', pregunta: '¿Existen antecedentes familiares de dificultades persistentes de lectura o escritura?' },
  { codigo: 'L3', tipo: 'si_no_a_veces', pregunta: '¿La lectura continúa siendo lenta o esforzada en comparación con las demandas actuales?' },
  { codigo: 'L4', tipo: 'si_no_a_veces', pregunta: '¿Se observan omisiones, sustituciones, inversiones o pérdida de renglón de manera persistente?' },
  { codigo: 'L5', tipo: 'si_no_a_veces', pregunta: '¿La ortografía presenta errores persistentes aun en palabras conocidas y después de revisar?' },
  { codigo: 'L6', tipo: 'si_no_a_veces', pregunta: '¿Comprende mejor cuando otra persona lee o cuando escucha el contenido?' },
  { codigo: 'L7', tipo: 'si_no_a_veces', pregunta: '¿Evita tareas de lectura o escritura por el esfuerzo que le implican?' },
  { codigo: 'L8', tipo: 'si_no_a_veces', pregunta: '¿Necesita tiempo considerablemente mayor para leer, escribir o completar evaluaciones?' },
  { codigo: 'L9', tipo: 'si_no_a_veces', pregunta: '¿Las dificultades aparecen en más de una materia o contexto?' },
  { codigo: 'L10', tipo: 'texto', pregunta: '¿Recibió evaluación, tratamiento o adaptaciones previas? Describir.' },
]

/**
 * Regla clínica sugerida (§5): la presencia conjunta de persistencia
 * histórica (L1), impacto actual (L3, L7 u L8) y manifestación en más de un
 * contexto (L9) activa una alerta de profundización. Nunca concluye
 * diagnóstico — solo señala qué datos la originaron.
 */
export function activaAlertaLectora(respuestas: Record<string, string>): { activa: boolean; evidencia: string[] } {
  const afirma = (codigo: string) => respuestas[codigo] === 'si' || respuestas[codigo] === 'a_veces'
  const persistenciaHistorica = afirma('L1')
  const impactoActual = afirma('L3') || afirma('L7') || afirma('L8')
  const multiContexto = afirma('L9')
  const activa = persistenciaHistorica && impactoActual && multiContexto
  if (!activa) return { activa: false, evidencia: [] }
  const evidencia: string[] = []
  if (persistenciaHistorica) evidencia.push('L1 — persistencia histórica desde los primeros años escolares.')
  if (afirma('L3')) evidencia.push('L3 — la lectura continúa siendo lenta o esforzada.')
  if (afirma('L7')) evidencia.push('L7 — evita tareas de lectura o escritura por el esfuerzo que implican.')
  if (afirma('L8')) evidencia.push('L8 — necesita tiempo considerablemente mayor para leer, escribir o rendir.')
  if (multiContexto) evidencia.push('L9 — las dificultades aparecen en más de una materia o contexto.')
  return { activa, evidencia }
}
