import type {
  Activity,
  CareerSuggestion,
  CompassSnapshot,
  Consultant,
  EngineDimension,
  Evaluation,
  EvidenceRef,
  ModuleProgress,
  NavigationChart,
  Observation,
  ProfileDimension,
  Reflection,
  Session,
} from '@/types'
import { CAREER_AREAS } from '@/data/careers'
import { DIMENSION_LABELS } from '@/lib/constants'
import { MODULE_MAP } from '@/data/modules'

// ============================================================
// Motor Brújula
// Cruza TODA la evidencia del proceso (actividades, evaluaciones,
// reflexiones, observaciones, sesiones, progreso) y produce:
//   · Perfil Brújula   (síntesis por dimensión, con evidencias)
//   · Mapa Brújula     (radar cualitativo interno)
//   · Carta de Navegación (áreas sugeridas en niveles, SIEMPRE
//     con motivos explicados; nunca porcentajes)
// Funciones puras: sin React, sin storage → testeables/portables.
// ============================================================

export interface EngineInput {
  consultant: Consultant
  activities: Activity[]
  evaluations: Evaluation[]
  reflections: Reflection[]
  observations: Observation[]
  sessions: Session[]
  progress: ModuleProgress[]
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "")
    .trim()

interface Signal {
  texto: string // etiqueta legible ("Creatividad")
  evidencia: EvidenceRef
}

interface Signals {
  valores: Signal[]
  fortalezas: Signal[]
  intereses: Signal[]
  aptitudes: Signal[]
  deseos: Signal[]
  mandatos: Signal[]
}

/** extrae las opciones elegidas de una respuesta tipo selección ("A, B, C") */
function splitSelection(text: string): string[] {
  return text
    .split(/[,;·\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 60)
}

function collectSignals(input: EngineInput): Signals {
  const s: Signals = { valores: [], fortalezas: [], intereses: [], aptitudes: [], deseos: [], mandatos: [] }
  const done = input.activities.filter((a) => a.respuestas.length > 0)

  for (const act of done) {
    const evidencia = (detalle: string): EvidenceRef => ({
      fuente: 'actividad',
      detalle: `En la actividad «${act.titulo}»: ${detalle}`,
    })
    for (const r of act.respuestas) {
      const q = act.preguntas.find((p) => p.id === r.questionId)
      if (!q || !r.texto.trim()) continue
      if (q.tipo === 'seleccion') {
        const elegidos = splitSelection(r.texto)
        const target =
          act.moduleId === 'valores'
            ? s.valores
            : act.moduleId === 'fortalezas'
              ? s.fortalezas
              : act.moduleId === 'intereses'
                ? s.intereses
                : act.moduleId === 'aptitudes'
                  ? s.aptitudes
                  : null
        if (target) {
          for (const e of elegidos) {
            target.push({ texto: e, evidencia: evidencia(`eligió «${e}»`) })
          }
        }
      } else {
        // texto libre: guarda como evidencia de la dimensión del módulo
        const snippet = r.texto.length > 160 ? r.texto.slice(0, 157) + '…' : r.texto
        if (act.moduleId === 'deseos') s.deseos.push({ texto: snippet, evidencia: evidencia(`escribió: “${snippet}”`) })
        if (act.moduleId === 'mandatos') s.mandatos.push({ texto: snippet, evidencia: evidencia(`registró: “${snippet}”`) })
      }
    }
  }

  // tests internos (ítems escala con categoría): las categorías destacadas
  // (promedio >= 4) suman señal en la dimensión del módulo del test
  for (const act of done) {
    const porCategoria = new Map<string, number[]>()
    for (const q of act.preguntas) {
      if (q.tipo !== 'escala' || !q.categoria) continue
      const r = act.respuestas.find((x) => x.questionId === q.id)
      const v = r ? Number(r.texto) : NaN
      if (!Number.isFinite(v)) continue
      porCategoria.set(q.categoria, [...(porCategoria.get(q.categoria) ?? []), v])
    }
    for (const [categoria, valores] of porCategoria) {
      const prom = valores.reduce((a, b) => a + b, 0) / valores.length
      if (prom < 4) continue
      const señal: Signal = {
        texto: categoria,
        evidencia: {
          fuente: 'actividad',
          detalle: `En el test «${act.titulo}» se destacó «${categoria}»`,
        },
      }
      if (act.moduleId === 'intereses') s.intereses.push(señal)
      else if (act.moduleId === 'aptitudes') s.aptitudes.push(señal)
      else if (act.moduleId === 'fortalezas') s.fortalezas.push(señal)
      else if (act.moduleId === 'valores') s.valores.push(señal)
    }
  }

  // evaluaciones: ítems con valor alto suman señal con su etiqueta
  for (const ev of input.evaluations) {
    for (const item of ev.items) {
      if (item.valor < 4) continue
      const evidencia: EvidenceRef = {
        fuente: 'evaluacion',
        detalle: `En la evaluación «${ev.titulo}» se registró alto «${item.etiqueta}»${item.notas ? ` (${item.notas})` : ''}`,
      }
      if (item.dimension === 'intereses') s.intereses.push({ texto: item.etiqueta, evidencia })
      if (item.dimension === 'aptitudes') s.aptitudes.push({ texto: item.etiqueta, evidencia })
      if (item.dimension === 'fortalezas') s.fortalezas.push({ texto: item.etiqueta, evidencia })
      if (item.dimension === 'valores') s.valores.push({ texto: item.etiqueta, evidencia })
    }
  }

  return s
}

// ---------- Perfil ----------

function dimensionEvidence(input: EngineInput, dim: EngineDimension): EvidenceRef[] {
  const out: EvidenceRef[] = []
  for (const o of input.observations) {
    if (o.moduleId === dim || (!o.moduleId && dim === 'historia')) {
      out.push({ fuente: 'observacion', detalle: o.texto })
    }
  }
  for (const r of input.reflections) {
    if (r.moduleId === dim) {
      out.push({ fuente: 'reflexion', detalle: `Reflexión «${r.titulo}»: ${r.contenido.slice(0, 140)}${r.contenido.length > 140 ? '…' : ''}` })
    }
  }
  for (const ses of input.sessions) {
    if (ses.estado === 'realizada' && ses.moduleIds.includes(dim as never) && ses.notas) {
      out.push({ fuente: 'sesion', detalle: `Sesión «${ses.titulo}»: ${ses.notas.slice(0, 140)}${ses.notas.length > 140 ? '…' : ''}` })
    }
  }
  return out
}

const DIMS: EngineDimension[] = [
  'historia',
  'identidad',
  'valores',
  'deseos',
  'mandatos',
  'fortalezas',
  'intereses',
  'aptitudes',
  'exploracion',
]

function buildProfile(input: EngineInput, signals: Signals): ProfileDimension[] {
  return DIMS.map((dim) => {
    const sig = (signals as unknown as Record<string, Signal[]>)[dim] ?? []
    const destacados = [...new Set(sig.map((x) => x.texto))].slice(0, 6)
    const evidencias = [
      ...sig.map((x) => x.evidencia),
      ...dimensionEvidence(input, dim),
    ].slice(0, 6)
    const mp = input.progress.find((p) => p.consultantId === input.consultant.id && p.moduleId === dim)
    const trabajado = mp?.estado === 'completado' ? 2 : mp?.estado === 'en_progreso' ? 1 : 0
    const carga = evidencias.length + trabajado
    const intensidad = carga >= 5 ? 'alta' : carga >= 2 ? 'media' : 'incipiente'

    const sintesisPorDim: Record<EngineDimension, string> = {
      historia: 'Recorrido biográfico trabajado: la historia personal aporta escenas que anticipan intereses y modos de vincularse con el aprender.',
      identidad: 'Construcción de una imagen de sí en proceso: se trabaja la diferencia entre cómo se ve y cómo lo ven.',
      valores: destacados.length
        ? `Valores rectores identificados: ${destacados.slice(0, 3).join(', ')}. Funcionan como criterio de decisión.`
        : 'Los valores aún no fueron explicitados en actividades; profundizar en el módulo 3.',
      deseos: destacados.length
        ? 'El deseo propio empieza a tener palabras: hay material genuino para orientar la elección.'
        : 'El deseo aparece poco nombrado todavía; conviene habilitarlo sin filtro de “lo posible”.',
      mandatos: sig.length
        ? 'Se detectaron mandatos familiares explícitos. Nombrados y trabajados, dejan de decidir en silencio.'
        : 'No se registran mandatos explícitos por ahora; mantener escucha atenta.',
      fortalezas: destacados.length
        ? `Fortalezas consistentes: ${destacados.slice(0, 3).join(', ')}. Respaldan la confianza para elegir.`
        : 'Fortalezas aún por relevar con evidencia concreta.',
      intereses: destacados.length
        ? `Núcleos de interés sostenido: ${destacados.slice(0, 3).join(', ')}.`
        : 'Intereses en exploración; falta registro de vida cotidiana.',
      aptitudes: destacados.length
        ? `Facilidades naturales observadas: ${destacados.slice(0, 3).join(', ')}.`
        : 'Aptitudes por relevar; cruzar con evidencia escolar.',
      exploracion: 'Exploración del mundo formativo y laboral: cada contacto real desarma fantasías y aporta datos propios.',
    }

    return {
      dimension: dim,
      titulo: DIMENSION_LABELS[dim],
      sintesis: sintesisPorDim[dim],
      destacados,
      evidencias,
      intensidad,
    }
  })
}

// ---------- Mapa (radar interno 0..5) ----------

function buildMap(input: EngineInput, profile: ProfileDimension[]) {
  return profile.map((p) => {
    // promedio de ítems de evaluación de la dimensión, si existen
    const items = input.evaluations.flatMap((e) => e.items.filter((i) => i.dimension === p.dimension))
    let nivel: number
    if (items.length) {
      nivel = items.reduce((acc, i) => acc + i.valor, 0) / items.length
    } else {
      nivel = p.intensidad === 'alta' ? 4.2 : p.intensidad === 'media' ? 2.8 : 1.2
    }
    return { dimension: p.dimension, titulo: DIMENSION_LABELS[p.dimension], nivel: Math.round(nivel * 10) / 10 }
  })
}

// ---------- Carta de Navegación ----------

function buildSuggestions(signals: Signals): CareerSuggestion[] {
  const results: (CareerSuggestion & { peso: number })[] = []

  for (const area of CAREER_AREAS) {
    const motivos: string[] = []
    const evidencias: EvidenceRef[] = []
    let peso = 0

    const check = (
      señales: Signal[],
      tags: string[],
      plantilla: (etiqueta: string) => string,
      pesoUnitario: number,
    ) => {
      const vistas = new Set<string>()
      for (const sig of señales) {
        const n = norm(sig.texto)
        if (vistas.has(n)) continue
        if (tags.some((t) => n.includes(norm(t)) || norm(t).includes(n))) {
          vistas.add(n)
          peso += pesoUnitario
          motivos.push(plantilla(sig.texto))
          evidencias.push(sig.evidencia)
        }
      }
    }

    // El interés sostenido pesa más que cualquier otra señal; las fortalezas
    // acompañan pero no definen (suelen ser transversales a muchas áreas).
    check(signals.intereses, area.tags.intereses, (e) => `Tu interés por «${e}» conecta directamente con esta área.`, 2.5)
    check(signals.valores, area.tags.valores, (e) => `El valor «${e}», que elegiste como fundamental, suele realizarse en estas profesiones.`, 1.5)
    check(signals.fortalezas, area.tags.fortalezas, (e) => `Tu fortaleza «${e}» es una de las más valoradas en este campo.`, 0.75)
    check(signals.aptitudes, area.tags.aptitudes, (e) => `Tu facilidad para «${e}» acompaña bien las exigencias de estas carreras.`, 1)

    // tensiones: mandatos que empujan hacia (o en contra de) esta área
    const tensiones: string[] = []
    for (const m of signals.mandatos) {
      const n = norm(m.texto)
      const areaMencionada = area.carreras.some((c) => n.includes(norm(c).split(' ')[0])) || n.includes(norm(area.nombre).split(' ')[0])
      if (areaMencionada) {
        tensiones.push(
          'Atención: esta área aparece mencionada en los mandatos familiares registrados. Conviene revisar si el interés (o el rechazo) es propio o heredado.',
        )
        break
      }
    }

    if (peso <= 0) continue

    results.push({
      peso,
      areaId: area.id,
      area: area.nombre,
      carreras: area.carreras,
      nivel: 'para_explorar',
      motivos: [...new Set(motivos)].slice(0, 4),
      evidencias: evidencias.slice(0, 4),
      tensiones: tensiones.length ? tensiones : undefined,
      pasosExploracion: [
        `Entrevistar a un profesional de ${area.nombre.toLowerCase()}.`,
        'Revisar el plan de estudios de una carrera del área y marcar materias que entusiasman y que asustan.',
        'Buscar una charla abierta, feria o clase pública del área.',
      ],
    })
  }

  // Niveles RELATIVOS al máximo de evidencia acumulada:
  // «brújula firme» queda reservado a las 2 áreas más respaldadas
  // (y con peso mínimo absoluto), para que el rumbo sea legible.
  const ranked = results.sort((a, b) => b.peso - a.peso).slice(0, 6)
  const top = ranked[0]?.peso ?? 0
  let firmes = 0
  for (const r of ranked) {
    if (r.peso >= Math.max(4, top * 0.75) && firmes < 2) {
      r.nivel = 'brujula_firme'
      firmes++
    } else if (r.peso >= Math.max(2.5, top * 0.4)) {
      r.nivel = 'rumbo_posible'
    } else {
      r.nivel = 'para_explorar'
    }
  }
  return ranked.map(({ peso: _peso, ...rest }) => rest)
}

function buildChart(input: EngineInput, signals: Signals, profile: ProfileDimension[]): NavigationChart {
  const valores = [...new Set(signals.valores.map((s) => s.texto))].slice(0, 4)
  const intereses = [...new Set(signals.intereses.map((s) => s.texto))].slice(0, 4)
  const fortalezas = [...new Set(signals.fortalezas.map((s) => s.texto))].slice(0, 4)

  const sugerencias = buildSuggestions(signals)
  const firmes = sugerencias.filter((s) => s.nivel === 'brujula_firme')

  const rumbo = firmes.length
    ? `El proceso converge hacia ${firmes.map((f) => f.area.toLowerCase()).join(' y ')}: allí se cruzan ${
        intereses.length ? `los intereses (${intereses.slice(0, 2).join(', ')})` : 'los intereses detectados'
      }${valores.length ? `, los valores (${valores.slice(0, 2).join(', ')})` : ''}${
        fortalezas.length ? ` y las fortalezas (${fortalezas.slice(0, 2).join(', ')})` : ''
      }.`
    : 'El norte todavía se está definiendo: la evidencia actual sugiere seguir explorando antes de reducir opciones. Eso también es avanzar.'

  const completados = input.progress.filter(
    (p) => p.consultantId === input.consultant.id && p.estado === 'completado',
  ).length
  const pendientes = DIMS.filter((d) => {
    const mp = input.progress.find((p) => p.consultantId === input.consultant.id && p.moduleId === d)
    return !mp || mp.estado === 'no_iniciado'
  })

  const vientosAFavor: string[] = []
  if (fortalezas.length) vientosAFavor.push(`Fortalezas claras y con evidencia: ${fortalezas.join(', ')}.`)
  if (valores.length) vientosAFavor.push(`Valores explicitados que sirven de criterio: ${valores.join(', ')}.`)
  if (completados >= 4) vientosAFavor.push(`Compromiso sostenido con el proceso (${completados} módulos completados).`)
  const reflexionesRecientes = input.reflections.length
  if (reflexionesRecientes) vientosAFavor.push('Capacidad de reflexión escrita sobre el propio proceso.')

  const vientosEnContra: string[] = []
  if (signals.mandatos.length)
    vientosEnContra.push('Mandatos familiares activos que requieren seguir siendo elaborados para decidir con libertad.')
  if (!signals.intereses.length) vientosEnContra.push('Los intereses aún no están mapeados con suficiente detalle.')
  const exploro = input.activities.some((a) => a.moduleId === 'exploracion' && a.respuestas.length > 0)
  if (!exploro) vientosEnContra.push('Falta contacto directo con el mundo real de estudio/trabajo (entrevistas, visitas).')

  const escalas: string[] = []
  if (pendientes.length)
    escalas.push(`Continuar el método: próximos módulos ${pendientes.slice(0, 3).map((d) => `«${MODULE_MAP[d as keyof typeof MODULE_MAP]?.nombre ?? d}»`).join(', ')}.`)
  if (!exploro) escalas.push('Concretar al menos una entrevista de exploración con un profesional o estudiante.')
  if (firmes.length) escalas.push(`Investigar planes de estudio de: ${firmes.flatMap((f) => f.carreras.slice(0, 2)).join(', ')}.`)
  escalas.push('Revisar esta Carta en sesión y ajustar el rumbo con la profesional.')

  return {
    rumbo,
    brujulaInterior: [...valores, ...intereses.slice(0, 2)],
    vientosAFavor,
    vientosEnContra,
    escalas,
    sugerencias,
  }
}

// ---------- API pública ----------

export type SnapshotPayload = Omit<CompassSnapshot, 'id' | 'createdAt' | 'updatedAt'>

export function generateSnapshot(input: EngineInput): SnapshotPayload {
  const signals = collectSignals(input)
  const perfil = buildProfile(input, signals)
  const mapa = buildMap(input, perfil)
  const carta = buildChart(input, signals, perfil)
  return {
    consultantId: input.consultant.id,
    generadoEl: new Date().toISOString(),
    perfil,
    mapa,
    carta,
    notaMetodologica:
      'Este análisis cruza actividades, evaluaciones, reflexiones, observaciones y sesiones del proceso. No es un test ni un puntaje: cada sugerencia se explica con su evidencia y se valida en el encuentro clínico. La lectura final es siempre de la profesional junto al consultante.',
  }
}
