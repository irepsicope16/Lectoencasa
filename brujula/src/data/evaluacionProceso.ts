import type { ModuleActivityTemplate, ModuleQuestion } from '@/types'

// ============================================================
// Evaluación de cierre del proceso de Orientación Vocacional.
// Se ofrece al consultante como última actividad del método (Módulo
// 12, Plan de Acción). Es un cuestionario de satisfacción/proceso,
// no un test del Motor Brújula: no tiene categorías ni alimenta la
// Carta de Navegación — solo sirve para que la profesional conozca
// cómo vivió el recorrido el consultante.
// ============================================================

export const EVALUACION_PROCESO_ID = 'evaluacion-proceso'

const seleccion = (id: string, texto: string, opciones: string[]): ModuleQuestion => ({
  id,
  texto,
  tipo: 'seleccion',
  opciones,
})

export const EVALUACION_PROCESO: ModuleActivityTemplate = {
  id: EVALUACION_PROCESO_ID,
  titulo: 'Evaluación del proceso de Orientación Vocacional',
  descripcion:
    'Gracias por haber sido parte de este proceso. Tu opinión es muy importante para conocer cómo viviste los ' +
    'encuentros y seguir mejorando la propuesta. No hay respuestas correctas o incorrectas: respondé con sinceridad.',
  tipo: 'reflexion',
  duracionMin: 10,
  dimensiones: [],
  preguntas: [
    seleccion('ep-general', '¿Cómo te resultó, en general, el proceso de Orientación Vocacional?', [
      'Interesante',
      'Útil',
      'Entretenido',
      'Reflexivo',
      'Dinámico',
      'Aburrido',
      'Largo',
      'Corto',
      'Repetitivo',
      'Otro',
    ]),
    seleccion('ep-gusto', '¿Qué fue lo que más te gustó del proceso?', [
      'Las actividades para conocerme mejor',
      'Descubrir mis intereses',
      'Reconocer mis habilidades y fortalezas',
      'Explorar diferentes carreras y ocupaciones',
      'Investigar universidades o instituciones',
      'Comparar distintas carreras',
      'Poder hablar sobre mis dudas',
      'Las actividades realizadas durante los encuentros',
      'Llegar a una decisión o tener mayor claridad',
      'Otro',
    ]),
    seleccion('ep-ayudo', '¿Qué actividades o momentos sentís que te ayudaron más?', [
      'Actividades de autoconocimiento',
      'Actividades sobre intereses',
      'Actividades sobre habilidades y fortalezas',
      'Exploración de carreras',
      'Investigación de universidades',
      'Comparador de carreras',
      'Conversaciones durante los encuentros',
      'Materiales y actividades realizadas entre encuentros',
      'Otro',
    ]),
    seleccion('ep-conoces', 'Después de realizar este proceso, ¿sentís que te conocés mejor?', [
      'Mucho más',
      'Un poco más',
      'Más o menos igual',
      'No demasiado',
      'No',
    ]),
    seleccion(
      'ep-claridad',
      '¿Sentís que el proceso te ayudó a tener mayor claridad sobre qué querés estudiar o hacer?',
      ['Sí, mucho', 'Sí, bastante', 'Un poco', 'Todavía tengo algunas dudas', 'No', 'Otro'],
    ),
    seleccion('ep-sentir', 'Al finalizar el proceso, ¿cómo te sentís frente a tu elección?', [
      'Más seguro/a',
      'Más tranquilo/a',
      'Entusiasmado/a',
      'Con más información',
      'Con algunas opciones claras',
      'Todavía con dudas',
      'Necesito seguir investigando',
      'Otro',
    ]),
    seleccion('ep-nogusto', '¿Hubo algo que no te gustara o que te resultara poco útil?', [
      'Algunas actividades fueron largas',
      'Algunas actividades fueron repetitivas',
      'Me hubiera gustado investigar más carreras',
      'Me hubiera gustado tener más encuentros',
      'Me hubiera gustado que el proceso fuera más corto',
      'Algunas consignas me resultaron difíciles',
      'No cambiaría nada',
      'Otro',
    ]),
    {
      id: 'ep-cambiarias',
      texto: 'Si pudieras cambiar algo del proceso, ¿qué cambiarías?',
      tipo: 'abierta',
    },
    seleccion(
      'ep-recomienda',
      '¿Recomendarías este proceso de Orientación Vocacional a otro/a adolescente que tenga dudas sobre qué estudiar?',
      ['Sí', 'Probablemente sí', 'No estoy seguro/a', 'Probablemente no', 'No'],
    ),
    {
      id: 'ep-comentario',
      texto: 'Si querés, podés dejarme un comentario sobre tu experiencia',
      tipo: 'abierta',
      ayuda: 'Podés contar qué te llevás de este proceso, qué fue importante para vos o cualquier otra cosa que quieras compartir.',
    },
  ],
}

/**
 * Arma una pequeña devolución en prosa a partir de las respuestas de esta
 * evaluación, para precargar el campo "Devolución profesional" (que la
 * profesional siempre puede editar antes de guardar). Devuelve null si la
 * actividad no es esta evaluación o todavía no tiene respuestas.
 */
export function resumenEvaluacionProceso(activity: {
  templateId?: string
  respuestas: { questionId: string; texto: string }[]
}): string | null {
  if (activity.templateId !== EVALUACION_PROCESO_ID) return null
  const get = (id: string) => activity.respuestas.find((r) => r.questionId === id)?.texto.trim()

  const general = get('ep-general')
  const gusto = get('ep-gusto')
  const ayudo = get('ep-ayudo')
  const conoces = get('ep-conoces')
  const claridad = get('ep-claridad')
  const sentir = get('ep-sentir')
  const nogusto = get('ep-nogusto')
  const cambiarias = get('ep-cambiarias')
  const recomienda = get('ep-recomienda')
  const comentario = get('ep-comentario')

  const lineas: string[] = []
  if (general) lineas.push(`Vivió el proceso, en general, como: ${general}.`)
  if (gusto) lineas.push(`Lo que más le gustó: ${gusto}.`)
  if (ayudo) lineas.push(`Lo que más le ayudó: ${ayudo}.`)
  if (conoces) lineas.push(`Después del proceso siente que se conoce a sí mismo/a: "${conoces}".`)
  if (claridad) lineas.push(`Claridad sobre qué estudiar: "${claridad}".`)
  if (sentir) lineas.push(`Frente a su elección se siente: ${sentir}.`)
  if (nogusto && nogusto !== 'No cambiaría nada') lineas.push(`Señaló como menos útil: ${nogusto}.`)
  if (cambiarias) lineas.push(`Qué cambiaría: "${cambiarias}".`)
  if (recomienda) lineas.push(`¿Lo recomendaría a otro/a adolescente?: ${recomienda}.`)
  if (comentario) lineas.push(`Comentario final: "${comentario}".`)

  return lineas.length ? lineas.join(' ') : null
}
