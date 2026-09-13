// Semilla de datos demo: una profesional y un caso ficticio completo
// (entrevista + autoperfil respondido + integración + prioridades + plan),
// para poder navegar el flujo core sin cargar nada a mano.

import { db } from '@/services/storage/db'
import { VERSION_CUESTIONARIO } from '@/data/items'
import { activaAlertaLectora } from '@/data/indicadoresLectores'
import { calcularConfianza, calcularNecesidadDimension, calcularPuntajePrioridad, necesidadDeclaradaDeBanda } from '@/features/engine/estudioEngine'
import type { DimensionId, QuestionnaireResponse } from '@/types'

const SEED_VERSION = '1'
const SEED_FLAG = 'me:seed:version'

export async function seedIfNeeded() {
  if (localStorage.getItem(SEED_FLAG) === SEED_VERSION) return
  const existentes = await db.professionals.list()
  if (existentes.length > 0) {
    localStorage.setItem(SEED_FLAG, SEED_VERSION)
    return
  }
  await sembrar()
  localStorage.setItem(SEED_FLAG, SEED_VERSION)
}

async function sembrar() {
  const profesional = await db.professionals.create({
    nombre: 'Irene',
    apellido: 'Morbidelli',
    email: 'irene@metodoestudio.demo',
    password: 'estudio',
    titulo: 'Lic. en Psicopedagogía',
  })

  const student = await db.students.create({
    professionalId: profesional.id,
    nombre: 'Camila',
    apellido: 'Sosa',
    fechaNacimiento: '2012-04-18',
    nivel: '12_15',
    institucion: 'Secundaria N.º 4',
    contacto: 'camila.tutor@demo.com',
    motivoConsulta: 'Le cuesta organizarse para estudiar y la lectura le demanda mucho esfuerzo; la familia consulta antes de que empiece el próximo trimestre.',
    estado: 'en_proceso',
    consentimiento: {
      otorgante: 'adulto_responsable',
      nombreOtorgante: 'Marina Sosa (madre)',
      otorgado: true,
      fecha: '2026-08-10',
    },
  })

  await db.intakes.create({
    studentId: student.id,
    motivo: 'Bajo rendimiento en materias con mucha lectura; dice que "se cansa" enseguida y deja todo para último momento.',
    historiaAcademica: 'Repitió contenidos de lectoescritura en 2.º grado. Nunca tuvo evaluación psicopedagógica formal. Buen vínculo con docentes.',
    apoyosPrevios: 'Apoyo escolar particular en 5.º y 6.º grado, discontinuado.',
    contexto: 'Vive con madre y hermano menor. Rutina de horarios variable por trabajo de la madre.',
    referente: {
      nombre: 'Marina Sosa',
      vinculo: 'Madre',
      respuestas: {
        L1: 'si',
        L2: 'no',
        L3: 'a_veces',
        L4: 'a_veces',
        L5: 'a_veces',
        L6: 'si',
        L7: 'si',
        L8: 'a_veces',
        L9: 'si',
      },
      l10Texto: 'No recibió evaluación formal. La maestra de 2.º grado sugirió "reforzar lectura en casa".',
    },
    notasPrivadas: 'Buen momento para trabajar: motivada, sin indicadores de riesgo emocional agudo.',
  })

  // ---------- Autoperfil: 56 respuestas ----------
  const valores: Record<string, number> = {
    A1: 2, A2: 2, A3: 2, A4: 1, A5: 2, A6: 2, A7: 3,
    B1: 1, B2: 3, B3: 1, B4: 2, B5: 1, B6: 2, B7: 1,
    C1: 2, C2: 2, C3: 1, C4: 1, C5: 2, C6: 1, C7: 2,
    D1: 1, D2: 3, D3: 2, D4: 1, D5: 2, D6: 3, D7: 1,
    E1: 2, E2: 1, E3: 1, E4: 2, E5: 1, E6: 2, E7: 2,
    F1: 2, F2: 1, F3: 0, F4: 1, F5: 1, F6: 2, F7: 1,
    G1: 2, G2: 1, G3: 2, G4: 1, G5: 2, G6: 1, G7: 2,
    H1: 2, H2: 2, H3: 1, H4: 2, H5: 1, H6: 2, H7: 3,
  }
  const respuestas: QuestionnaireResponse[] = Object.entries(valores).map(([itemId, valor]) => ({
    id: crypto.randomUUID(),
    studentId: student.id,
    versionId: VERSION_CUESTIONARIO,
    itemId,
    valor: valor as 0 | 1 | 2 | 3,
    fecha: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
  await db.responses.bulkCreate(respuestas)

  const preguntas: [string, string][] = [
    ['q1', 'Que dejar de discutir en casa por las tareas.'],
    ['q2', 'Historia y Lengua, cuando hay que leer textos largos.'],
    ['q3', 'Probé subrayar todo el texto, pero después no sé qué es importante.'],
    ['q4', 'Cuando alguien me explica antes de leer, o cuando escucho el tema.'],
    ['q5', 'Que me ayude a organizarme y a no sentir que "no puedo".'],
    ['q6', 'Empezar antes y no pelear cada noche por la tarea.'],
  ]
  for (const [preguntaId, texto] of preguntas) {
    await db.openAnswers.create({ studentId: student.id, preguntaId, texto })
  }

  // ---------- Integración: snapshot por dimensión ----------
  const dimensiones: DimensionId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const snapshots = new Map<DimensionId, Awaited<ReturnType<typeof db.snapshots.create>>>()
  for (const dimension of dimensiones) {
    const { promedio, completitud, banda } = calcularNecesidadDimension(dimension, respuestas)
    const observacionCoincide = dimension === 'D' || dimension === 'B'
    const fuentes = observacionCoincide
      ? (['autoinforme', 'referente', 'observacion_profesional'] as const)
      : (['autoinforme'] as const)
    const confianza = calcularConfianza([...fuentes], banda, dimension === 'D' || dimension === 'B')
    const snap = await db.snapshots.create({
      studentId: student.id,
      dimension,
      versionId: VERSION_CUESTIONARIO,
      promedioNecesidad: promedio,
      completitud,
      banda,
      confianza,
      fuentesConvergentes: [...fuentes],
      observacionProfesionalCoincide: observacionCoincide,
      generadoEl: new Date().toISOString(),
    })
    snapshots.set(dimension, snap)
  }

  // ---------- Alerta lectora ----------
  const { activa, evidencia } = activaAlertaLectora({
    L1: 'si', L3: 'a_veces', L7: 'si', L8: 'a_veces', L9: 'si',
  })
  if (activa) {
    await db.alerts.create({
      studentId: student.id,
      tipo: 'indicadores_lectores',
      evidencia,
      estado: 'abierta',
    })
  }

  // ---------- Prioridades ----------
  const prioridadD = snapshots.get('D')!
  const prioridadB = snapshots.get('B')!
  await db.priorities.create({
    studentId: student.id,
    dimension: 'D',
    necesidadDeclarada: necesidadDeclaradaDeBanda(prioridadD.banda),
    impactoActual: 3,
    frecuenciaMultiContexto: 2,
    interesEstudiante: 2,
    urgenciaEvaluacion: 1,
    puntaje: calcularPuntajePrioridad({
      necesidadDeclarada: necesidadDeclaradaDeBanda(prioridadD.banda),
      impactoActual: 3,
      frecuenciaMultiContexto: 2,
      interesEstudiante: 2,
      urgenciaEvaluacion: 1,
    }),
    estado: 'confirmada',
    orden: 1,
    justificacion: 'Convergencia autoinforme + referente + observación; alerta lectora asociada.',
  })
  await db.priorities.create({
    studentId: student.id,
    dimension: 'B',
    necesidadDeclarada: necesidadDeclaradaDeBanda(prioridadB.banda),
    impactoActual: 2,
    frecuenciaMultiContexto: 2,
    interesEstudiante: 2,
    urgenciaEvaluacion: 0,
    puntaje: calcularPuntajePrioridad({
      necesidadDeclarada: necesidadDeclaradaDeBanda(prioridadB.banda),
      impactoActual: 2,
      frecuenciaMultiContexto: 2,
      interesEstudiante: 2,
      urgenciaEvaluacion: 0,
    }),
    estado: 'confirmada',
    orden: 2,
    justificacion: 'Empieza tarde y calcula mal el tiempo; buen recurso de autonomía en otras áreas.',
  })

  // ---------- Plan ----------
  await db.goals.create({
    studentId: student.id,
    dimension: 'D',
    necesidadPriorizada: 'Los textos largos le demandan un esfuerzo desproporcionado y necesita releer muchas veces para entender.',
    objetivoObservable: 'Identificará la idea principal de un texto breve en 4 de 5 intentos, usando lectura por capas.',
    herramientas: ['Lectura por capas', 'Idea principal', 'Preguntas al texto'],
    frecuencia: 'Tres prácticas semanales durante cuatro semanas.',
    apoyoNecesario: 'Guía con preguntas antes y después de leer.',
    evidencia: 'Registro de idea principal identificada por sesión.',
    fechaInicio: '2026-09-08',
    fechaRevision: '2026-10-06',
    estado: 'activo',
    vozEstudiante: 'Quiero entender sin tener que leer todo tres veces.',
  })
  await db.goals.create({
    studentId: student.id,
    dimension: 'B',
    necesidadPriorizada: 'Comienza a estudiar cuando falta muy poco tiempo y calcula mal cuánto le llevará una tarea.',
    objetivoObservable: 'Registrará en la agenda única fechas y tiempo estimado de cada tarea, con contraste real, en 4 de 5 semanas.',
    herramientas: ['Agenda única', 'Estimación real de tiempos'],
    frecuencia: 'Registro semanal, revisado en cada sesión.',
    evidencia: 'Comparación de tiempo previsto y tiempo real durante dos semanas.',
    fechaInicio: '2026-09-08',
    fechaRevision: '2026-10-06',
    estado: 'activo',
  })
}
