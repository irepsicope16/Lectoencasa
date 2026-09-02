import type { Activity, Consultant, EngineDimension, NavigationChart, ProfileDimension } from '@/types'
import { DIMENSION_LABELS } from '@/lib/constants'

// ============================================================
// Informe profesional — redacción narrativa completa.
// Sigue la estructura de un informe clínico de Orientación
// Vocacional Ocupacional (encuadre → contexto → autoconocimiento →
// perfil → orientación → síntesis → recomendaciones → cierre),
// amalgamando en prosa lo que aportan las actividades del método
// y el Motor Brújula (perfil + carta de navegación). Nunca inventa
// datos: cada sección sin evidencia real se omite.
// ============================================================

function joinNatural(items: string[], conj = 'y'): string {
  const clean = items.map((s) => s.trim()).filter(Boolean)
  if (clean.length === 0) return ''
  if (clean.length === 1) return clean[0]
  if (clean.length === 2) return `${clean[0]} ${conj} ${clean[1]}`
  return `${clean.slice(0, -1).join(', ')} ${conj} ${clean[clean.length - 1]}`
}

/** Los "motivos" y "tensiones" de la Carta de Navegación están redactados
 * en 2ª persona (pensados para el consultante: "Tu interés por..."). Este
 * informe habla SOBRE el consultante, no con él/ella: se pasan a 3ª persona. */
function tercerizar(texto: string): string {
  return texto
    .replace(/\bTus\b/g, 'Sus')
    .replace(/\btus\b/g, 'sus')
    .replace(/\bTu\b/g, 'Su')
    .replace(/\btu\b/g, 'su')
    .replace(/\belegiste\b/g, 'eligió')
    .replace(/\bcargaste\b/g, 'cargó')
}

function dim(perfil: ProfileDimension[], id: EngineDimension) {
  return perfil.find((p) => p.dimension === id)
}

/** Actividad de una plantilla del método que ya tiene alguna respuesta o
 * devolución cargada — si no, no hay nada real que citar. */
function porPlantilla(activities: Activity[], templateId: string): Activity | undefined {
  return activities.find(
    (a) => a.templateId === templateId && (a.respuestas.some((r) => r.texto.trim()) || a.feedbackProfesional?.trim()),
  )
}

function resp(a: Activity | undefined, questionId: string): string | undefined {
  const t = a?.respuestas.find((r) => r.questionId === questionId)?.texto?.trim()
  return t || undefined
}

export interface SeccionInforme {
  titulo: string
  parrafos: string[]
}

export interface InformeCompleto {
  secciones: SeccionInforme[]
  cartaCierre: string
}

export function buildInformeCompleto(
  consultant: Consultant,
  activities: Activity[],
  perfil: ProfileDimension[],
  carta: NavigationChart,
  meta: { sesiones: number; modulosCompletados: number; modulosTotales: number },
): InformeCompleto {
  const nombre = consultant.nombre
  const secciones: SeccionInforme[] = []

  const firmes = carta.sugerencias.filter((s) => s.nivel === 'brujula_firme')
  const posibles = carta.sugerencias.filter((s) => s.nivel === 'rumbo_posible')
  const explorar = carta.sugerencias.filter((s) => s.nivel === 'para_explorar' && !s.areaId.startsWith('propia-'))
  const propias = carta.sugerencias.filter((s) => s.areaId.startsWith('propia-'))

  // ---------- 1. Motivo de consulta y encuadre ----------
  const parrafos1: string[] = [
    `${nombre} inicia el proceso de Orientación Vocacional Ocupacional. Motivo de consulta: ${consultant.motivoConsulta}`,
  ]
  if (consultant.notas?.trim()) parrafos1.push(consultant.notas.trim())
  secciones.push({ titulo: 'Motivo de consulta y encuadre', parrafos: parrafos1 })

  // ---------- 2. Entrevista inicial y contexto personal ----------
  const arbol = porPlantilla(activities, 'mandatos-arbol')
  const familiaTxt = resp(arbol, 'q1')
  const escolar = porPlantilla(activities, 'historia-escolar')
  const disfrutadas = resp(escolar, 'q1')
  const costosas = resp(escolar, 'q2')
  const docente = resp(escolar, 'q3')
  const interesesMapa = porPlantilla(activities, 'intereses-mapa')
  const tiempoLibre = resp(interesesMapa, 'q3') ?? resp(interesesMapa, 'q1')
  const sinLimites = porPlantilla(activities, 'deseos-sin-limites')
  const ideaInicial = resp(sinLimites, 'q1')
  const freno = resp(sinLimites, 'q3')

  const parrafos2: string[] = []
  if (familiaTxt) parrafos2.push(`Sobre su entorno familiar, cuenta: «${familiaTxt}».`)
  const escolarClauses: string[] = []
  if (disfrutadas) escolarClauses.push(`disfrutó especialmente «${disfrutadas}»`)
  if (costosas) escolarClauses.push(`reconoce mayor dificultad con «${costosas}»`)
  if (escolarClauses.length) {
    parrafos2.push(
      `En su recorrido escolar, ${joinNatural(escolarClauses)}${docente ? `. Recuerda especialmente: «${docente}»` : ''}.`,
    )
  }
  if (tiempoLibre) parrafos2.push(`Fuera del estudio, menciona: «${tiempoLibre}».`)
  if (ideaInicial) {
    parrafos2.push(
      `Al pensar en el futuro, menciona inicialmente: «${ideaInicial}»${freno ? `, aunque reconoce como freno: «${freno}»` : ''}.`,
    )
  }
  if (parrafos2.length) secciones.push({ titulo: 'Entrevista inicial y contexto personal', parrafos: parrafos2 })

  // ---------- 3. Autoconocimiento e identidad ----------
  const quienSoy = porPlantilla(activities, 'identidad-quien-soy')
  const quienSoyLista = resp(quienSoy, 'q1')
  const quienSoyRepresenta = resp(quienSoy, 'q2')
  const queVes = porPlantilla(activities, 'identidad-que-ves')
  const queHaceBien = resp(queVes, 'q3')
  const entrevista10 = porPlantilla(activities, 'identidad-entrevista-10')
  const palabrasRepetidas = resp(entrevista10, 'q2')
  const sorpresaEntrevista = resp(entrevista10, 'q3')

  const parrafos3: string[] = []
  if (quienSoyLista) {
    parrafos3.push(
      `En las actividades de autoconocimiento, ${nombre} se define, en sus propias palabras, como: «${quienSoyLista}»${
        quienSoyRepresenta ? `. Lo que más lo/la representa: «${quienSoyRepresenta}»` : ''
      }.`,
    )
  }
  if (queHaceBien) parrafos3.push(`Reconoce que hace bien: «${queHaceBien}».`)
  if (palabrasRepetidas) {
    parrafos3.push(
      `La mirada de familiares y amigos aporta un contraste valioso: se repiten palabras como «${palabrasRepetidas}»${
        sorpresaEntrevista ? `, y lo/la sorprendió: «${sorpresaEntrevista}»` : ''
      }. Este cruce permite trabajar no solo la identificación de recursos, sino también la confianza necesaria para asumir una decisión propia.`,
    )
  }
  if (parrafos3.length) secciones.push({ titulo: 'Autoconocimiento e identidad', parrafos: parrafos3 })

  // ---------- 4. Técnica gráfica: Dibujo de la Figura Humana ----------
  const dibujo = porPlantilla(activities, 'historia-dibujo')
  if (dibujo) {
    const q1 = resp(dibujo, 'q1')
    const q2 = resp(dibujo, 'q2')
    const fb = dibujo.feedbackProfesional?.trim()
    const parrafos4: string[] = [
      'En el marco del proceso se administra, como recurso complementario, la técnica gráfica de Figura Humana a partir de la consigna «dibujate haciendo algo». Estos elementos no se interpretan de manera aislada ni diagnóstica: se consideran cualitativamente y en integración con el resto del proceso.',
    ]
    if (q1 || q2) {
      parrafos4.push(`Al relatar la escena, ${nombre} la vincula con: «${q1 ?? q2}»${q1 && q2 ? ` «${q2}»` : ''}.`)
    }
    if (fb) parrafos4.push(fb)
    secciones.push({ titulo: 'Técnica gráfica: Dibujo de la Figura Humana', parrafos: parrafos4 })
  }

  // ---------- 5. Valores, deseos y expectativas ----------
  const valores = dim(perfil, 'valores')
  const vidaIdeal = porPlantilla(activities, 'valores-vida-ideal')
  const diaIdeal = resp(vidaIdeal, 'q1')
  const irrenunciable = resp(vidaIdeal, 'q2')
  const frases = porPlantilla(activities, 'mandatos-frases')
  const seEspera = resp(frases, 'q2')
  const carrerasVistas = resp(frases, 'q3')

  const parrafos5: string[] = []
  if (valores?.destacados.length) {
    parrafos5.push(
      `${nombre} otorga especial importancia a ${joinNatural(valores.destacados.slice(0, 5))}, valores que funcionan como criterio central a la hora de decidir.`,
    )
  }
  if (diaIdeal) {
    parrafos5.push(
      `Al imaginar su vida ideal, describe: «${diaIdeal}»${irrenunciable ? ` Identifica como irrenunciable: «${irrenunciable}»` : ''}.`,
    )
  }
  if (seEspera || carrerasVistas) {
    parrafos5.push(
      `En relación con las expectativas familiares, ${seEspera ? `refiere: «${seEspera}»` : ''}${
        carrerasVistas ? ` Reconoce además: «${carrerasVistas}»` : ''
      } El proceso permite ir diferenciando progresivamente el acompañamiento y las expectativas familiares de los deseos propios, favoreciendo una elección cada vez más autónoma.`,
    )
  }
  if (parrafos5.length) secciones.push({ titulo: 'Valores, deseos y expectativas', parrafos: parrafos5 })

  // ---------- 6. Fortalezas, intereses y aptitudes ----------
  const fortalezas = dim(perfil, 'fortalezas')
  const intereses = dim(perfil, 'intereses')
  const aptitudes = dim(perfil, 'aptitudes')
  const flow = porPlantilla(activities, 'fortalezas-flow')
  const flowTxt = resp(flow, 'q1')
  const autoobs = porPlantilla(activities, 'aptitudes-autoobservacion')
  const resuelveRapido = resp(autoobs, 'q1')
  const lePiden = resp(autoobs, 'q2')

  const parrafos6: string[] = []
  const nucleo: string[] = []
  if (fortalezas?.destacados.length)
    nucleo.push(`se consolidan como fortalezas ${joinNatural(fortalezas.destacados.slice(0, 5))}`)
  if (intereses?.destacados.length)
    nucleo.push(`los intereses se sostienen con fuerza en ${joinNatural(intereses.destacados.slice(0, 5))}`)
  if (aptitudes?.destacados.length)
    nucleo.push(`se destacan aptitudes como ${joinNatural(aptitudes.destacados.slice(0, 5))}`)
  if (nucleo.length) {
    const frase = joinNatural(nucleo)
    parrafos6.push(`${frase.charAt(0).toUpperCase()}${frase.slice(1)}.`)
  }
  if (flowTxt) parrafos6.push(`Pierde la noción del tiempo haciendo: «${flowTxt}».`)
  if (resuelveRapido || lePiden) {
    parrafos6.push(
      `Reconoce además que resuelve con facilidad «${resuelveRapido ?? lePiden}»${
        resuelveRapido && lePiden ? `, y que suele encargarse de «${lePiden}» porque "le sale"` : ''
      }.`,
    )
  }
  if (parrafos6.length) secciones.push({ titulo: 'Fortalezas, intereses y aptitudes', parrafos: parrafos6 })

  // ---------- 7. Mapa Brújula y exploración de carreras ----------
  const parrafos7: string[] = [carta.rumbo]
  if (explorar.length) {
    parrafos7.push(
      `La exploración incorpora además, en un nivel más incipiente, campos como ${joinNatural(
        explorar.slice(0, 4).map((s) => s.area),
      )} — rumbos para profundizar, no resultados cerrados.`,
    )
  }
  if (propias.length) {
    parrafos7.push(
      `A medida que avanzó el proceso, ${nombre} seleccionó por cuenta propia, en el Comparador de Carreras, como carreras finalistas ${joinNatural(
        propias.map((s) => s.area),
      )}. La revisión de planes de estudio, instituciones y características del ejercicio profesional permitió pasar de ideas generales a alternativas más concretas.`,
    )
  }
  const entrevistaProf = porPlantilla(activities, 'exploracion-entrevista')
  const aQuienEntrevisto = resp(entrevistaProf, 'q1')
  const trasCharla = resp(entrevistaProf, 'q4')
  const visita = porPlantilla(activities, 'exploracion-visita')
  const queVisito = resp(visita, 'q1')
  if (aQuienEntrevisto || queVisito) {
    const contactos: string[] = []
    if (aQuienEntrevisto) contactos.push(`entrevistó a ${aQuienEntrevisto}${trasCharla ? ` — tras la charla, ${trasCharla}` : ''}`)
    if (queVisito) contactos.push(`visitó ${queVisito}`)
    parrafos7.push(`Concretó además contacto directo con el campo profesional: ${joinNatural(contactos)}.`)
  }
  secciones.push({ titulo: 'Mapa Brújula y exploración de carreras', parrafos: parrafos7 })

  // ---------- 8. Integración de las alternativas vocacionales ----------
  const APERTURAS_ALTERNATIVA = [
    (area: string) => `«${area}» aparece, hasta el momento, como una alternativa de especial consistencia`,
    (area: string) => `«${area}» continúa siendo una alternativa significativa`,
    (area: string) => `Por su parte, «${area}» conserva también una presencia importante`,
    (area: string) => `Se suma «${area}», con una presencia que vale la pena seguir mirando`,
  ]
  const parrafos8: string[] = []
  ;[...firmes, ...propias].slice(0, 4).forEach((s, i) => {
    const dimensionesTxt = s.dimensiones?.length
      ? `articula ${joinNatural(s.dimensiones.map((d) => DIMENSION_LABELS[d].toLowerCase()))} ya descriptos`
      : tercerizar(s.motivos[0] ?? '')
    parrafos8.push(
      `${APERTURAS_ALTERNATIVA[i](s.area)}: ${dimensionesTxt}, con salidas concretas en ${joinNatural(
        s.carreras.slice(0, 3),
      )}.${s.tensiones ? ` ${tercerizar(s.tensiones[0])}` : ''}`,
    )
  })
  if (posibles.length) {
    parrafos8.push(
      `Con una firmeza algo menor, pero también sostenida en evidencia, se mantienen presentes ${joinNatural(
        posibles.slice(0, 3).map((s) => `«${s.area}» (${joinNatural(s.carreras.slice(0, 2), 'o')})`),
      )}.`,
    )
  }
  if (firmes.length > 1 || (firmes.length && propias.length)) {
    parrafos8.push(
      `${nombre} no se encuentra ante una ausencia de intereses, sino frente a la tarea de jerarquizar intereses diversos que presentan puntos de encuentro entre sí.`,
    )
  }
  if (parrafos8.length) secciones.push({ titulo: 'Integración de las alternativas vocacionales', parrafos: parrafos8 })

  // ---------- 9. Síntesis y orientación ----------
  const parrafos9: string[] = [
    `El proceso realizado permite observar un avance desde una inquietud inicial amplia hacia la construcción de un conjunto reducido y fundamentado de alternativas. A lo largo de ${meta.sesiones} sesiones y ${meta.modulosCompletados} de ${meta.modulosTotales} módulos trabajados, ${nombre} pudo reconocer características personales, identificar fortalezas y aptitudes, y explicitar condiciones que considera importantes para su futura vida laboral${
      propias.length || firmes.length ? ' e investigar carreras concretas' : ''
    }.`,
  ]
  if (firmes.length || propias.length) {
    const top = [...firmes, ...propias].slice(0, 2)
    parrafos9.push(
      `En el momento actual, ${joinNatural(top.map((s) => `«${s.area}»`))} presenta${
        top.length > 1 ? 'n' : ''
      } una convergencia especialmente significativa entre sus intereses, recursos personales y expectativas ocupacionales. Estas orientaciones no deben entenderse como una prescripción ni como una elección definitiva, sino como alternativas consistentes sobre las cuales continuar construyendo una decisión personal e informada.`,
    )
  }
  const cierreEstado: string[] = []
  if (carta.vientosAFavor.length) cierreEstado.push(`Sostienen este momento del proceso: ${carta.vientosAFavor.join(' ')}`)
  if (carta.vientosEnContra.length) cierreEstado.push(`Quedan por seguir trabajando: ${carta.vientosEnContra.join(' ')}`)
  if (cierreEstado.length) parrafos9.push(cierreEstado.join(' '))
  secciones.push({ titulo: 'Síntesis y orientación', parrafos: parrafos9 })

  // ---------- 10. Recomendaciones y próximos pasos ----------
  const parrafos10: string[] = [carta.escalas.join(' ')]
  parrafos10.push(
    'Se sugiere especialmente contrastar la representación actual de cada alternativa con experiencias reales — conversar con estudiantes avanzados o profesionales, visitar instituciones, profundizar en tareas cotidianas y ambientes de trabajo — de modo que la decisión no se apoye únicamente en los planes de estudio o las expectativas económicas, sino también en el estilo de vida en el que pueda imaginarse genuinamente.',
  )
  secciones.push({ titulo: 'Recomendaciones y próximos pasos', parrafos: parrafos10 })

  // ---------- Carta de cierre ----------
  const top = [...firmes, ...propias]
  const detalleCierre = top.length
    ? ` y en tu recorrido hacia ${joinNatural(top.slice(0, 2).map((s) => s.area.toLowerCase()))}`
    : ''
  const cartaCierre = `Gracias, ${nombre}, por animarte a explorar, preguntar y conocerte un poco más${detalleCierre}. Que este camino que empezaste te encuentre tomando decisiones cada vez más tuyas, confiando en tus capacidades y recordando que elegir no es tener todo resuelto, sino animarse a construir el propio camino.`

  return { secciones, cartaCierre }
}
