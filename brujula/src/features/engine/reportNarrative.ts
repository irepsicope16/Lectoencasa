import type { Consultant, EngineDimension, NavigationChart, ProfileDimension } from '@/types'

// ============================================================
// Redacción narrativa del informe profesional: toma el Perfil y la
// Carta de Navegación que ya arma compassEngine.ts (siempre con
// evidencia, nunca puntajes) y los amalgama en prosa cualitativa —
// en lugar del listado de tarjetas por dimensión/área que se usaba
// antes. El detalle actividad por actividad (para revisar "qué
// contestó" con precisión) queda en el informe del propio consultante,
// no en este, que es el que lee un tercero.
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

export interface InformeNarrativo {
  /** Párrafos en prosa para "Perfil vocacional" — sin un apartado por dimensión. */
  perfilVocacional: string[]
  /** Párrafos en prosa para "Orientación vocacional" — sin una tarjeta por área. */
  orientacionVocacional: string[]
}

export function buildInformeNarrativo(
  consultant: Consultant,
  perfil: ProfileDimension[],
  carta: NavigationChart,
): InformeNarrativo {
  const nombre = consultant.nombre
  const historia = dim(perfil, 'historia')
  const identidad = dim(perfil, 'identidad')
  const valores = dim(perfil, 'valores')
  const deseos = dim(perfil, 'deseos')
  const mandatos = dim(perfil, 'mandatos')
  const fortalezas = dim(perfil, 'fortalezas')
  const intereses = dim(perfil, 'intereses')
  const aptitudes = dim(perfil, 'aptitudes')
  const exploracion = dim(perfil, 'exploracion')

  const perfilVocacional: string[] = []

  // Historia e identidad.
  const trabajoBiografico = (historia?.evidencias.length ?? 0) + (identidad?.evidencias.length ?? 0) > 0
  perfilVocacional.push(
    trabajoBiografico
      ? `A lo largo del proceso, ${nombre} fue revisando su historia personal y escenas que anticipan modos propios de vincularse con el aprender y con las decisiones. En paralelo trabajó su identidad en construcción — la diferencia entre cómo se ve y cómo lo/la ven —, un ejercicio que sostiene la base desde la que hoy puede empezar a pensar su futuro.`
      : `El trabajo sobre la historia personal y la identidad recién está comenzando: todavía no hay evidencia registrada en estas dos dimensiones, un buen punto de partida para las próximas sesiones.`,
  )

  // Motor interno: valores, deseos, mandatos.
  const valoresTxt = valores?.destacados.length
    ? `Sus valores rectores —${joinNatural(valores.destacados.slice(0, 4))}— funcionan hoy como criterio a la hora de decidir.`
    : 'Todavía no hay valores explicitados con claridad en las actividades trabajadas.'
  const deseoTxt = (deseos?.evidencias.length ?? 0) > 0
    ? 'El deseo propio empieza a tener palabras propias, con material genuino para sostener una elección.'
    : 'El deseo propio todavía aparece poco nombrado; conviene seguir habilitándolo, sin el filtro de "lo posible".'
  const mandatoTxt = (mandatos?.evidencias.length ?? 0) > 0
    ? 'Se registran, además, mandatos familiares que fueron apareciendo en el proceso: nombrarlos y trabajarlos es lo que permite que dejen de decidir en silencio.'
    : 'No se registran mandatos familiares explícitos por el momento; conviene mantener una escucha atenta a este punto.'
  perfilVocacional.push(`${valoresTxt} ${deseoTxt} ${mandatoTxt}`)

  // Núcleo vocacional: fortalezas, intereses, aptitudes + exploración.
  const fortalezasTxt = fortalezas?.destacados.length
    ? `se identificaron fortalezas consistentes como ${joinNatural(fortalezas.destacados.slice(0, 4))}, que respaldan la confianza para elegir`
    : 'las fortalezas todavía están por relevarse con evidencia concreta'
  const interesesTxt = intereses?.destacados.length
    ? `sus intereses se sostienen con fuerza en ${joinNatural(intereses.destacados.slice(0, 4))}`
    : 'los intereses siguen en exploración, sin un núcleo claramente sostenido todavía'
  const aptitudesTxt = aptitudes?.destacados.length
    ? `Además, aparecen facilidades naturales para ${joinNatural(aptitudes.destacados.slice(0, 4))}.`
    : 'Las aptitudes, en cambio, están pendientes de relevar, cruzadas con evidencia escolar.'
  const exploro = (exploracion?.evidencias.length ?? 0) > 0
  perfilVocacional.push(
    `En el núcleo vocacional, ${fortalezasTxt}, mientras que ${interesesTxt}. ${aptitudesTxt} ${
      exploro
        ? 'A esto se suma un trabajo de exploración activa del mundo formativo y laboral, que va desarmando fantasías y aportando datos propios.'
        : 'Todavía falta contacto directo con el mundo real de estudio y trabajo (entrevistas, visitas, charlas) para contrastar todo esto con la realidad.'
    }`,
  )

  // El "rumbo" ya integra en una sola frase los intereses/valores/fortalezas
  // que sostienen la convergencia — no se repiten acá. Este párrafo suma
  // información nueva: qué caminos concretos abre cada área y qué tensiones
  // conviene seguir mirando.
  const orientacionVocacional: string[] = [carta.rumbo]

  const firmes = carta.sugerencias.filter((s) => s.nivel === 'brujula_firme')
  const posibles = carta.sugerencias.filter((s) => s.nivel === 'rumbo_posible')
  const explorar = carta.sugerencias.filter((s) => s.nivel === 'para_explorar')

  if (firmes.length) {
    const nombres = joinNatural(firmes.map((s) => `«${s.area}»`))
    const carreras = joinNatural([...new Set(firmes.flatMap((s) => s.carreras.slice(0, 2)))].slice(0, 5))
    const tensionesTxt = firmes
      .map((s) => s.tensiones?.[0])
      .filter((t): t is string => Boolean(t))
      .map(tercerizar)
      .join(' ')
    orientacionVocacional.push(
      `${firmes.length > 1 ? 'Sus brújulas firmes son' : 'Su brújula firme es'} ${nombres}, con caminos concretos para empezar a explorar como ${carreras}.${
        tensionesTxt ? ` ${tensionesTxt}` : ''
      }`,
    )
  }
  if (posibles.length) {
    const frases = posibles.slice(0, 3).map((s) => `«${s.area}» (${joinNatural(s.carreras.slice(0, 2), 'o')})`)
    orientacionVocacional.push(
      `Con una firmeza algo menor, pero también sostenida en evidencia, aparecen ${joinNatural(frases)}.`,
    )
  }
  if (explorar.length) {
    orientacionVocacional.push(
      `También surgieron, todavía en un nivel más incipiente, señales hacia ${joinNatural(
        explorar.slice(0, 3).map((s) => s.area),
      )}, que vale la pena seguir observando en las próximas sesiones.`,
    )
  }

  const cierre: string[] = []
  if (carta.vientosAFavor.length) cierre.push(`Sostienen este momento del proceso: ${carta.vientosAFavor.join(' ')}`)
  if (carta.vientosEnContra.length) cierre.push(`Quedan por seguir trabajando: ${carta.vientosEnContra.join(' ')}`)
  if (cierre.length) orientacionVocacional.push(cierre.join(' '))

  return { perfilVocacional, orientacionVocacional }
}
