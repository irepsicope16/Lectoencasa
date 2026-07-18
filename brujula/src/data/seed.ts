import { db } from '@/services/storage/db'
import type {
  Activity,
  ActivityLogEntry,
  AssignedVideo,
  CalendarEvent,
  Consultant,
  Evaluation,
  ModuleProgress,
  Observation,
  Reflection,
  Session,
  StoredFile,
  User,
} from '@/types'

const SEED_KEY = 'mb:seed-version'
const SEED_VERSION = '1'

// Fechas relativas a hoy para que el demo siempre se vea "vivo".
const now = new Date()
function daysAgo(n: number, hour = 10): string {
  const d = new Date(now)
  d.setDate(d.getDate() - n)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}
function daysAhead(n: number, hour = 10): string {
  return daysAgo(-n, hour)
}
function dateOnly(iso: string): string {
  return iso.slice(0, 10)
}

const t = (n: number) => ({ createdAt: daysAgo(n), updatedAt: daysAgo(n) })

// ---------- IDs estables ----------
export const IDS = {
  pro: 'u-pro-ire',
  userValen: 'u-cons-valen',
  valen: 'c-valentina',
  tomas: 'c-tomas',
  mora: 'c-mora',
}

const users: User[] = [
  {
    id: IDS.pro,
    role: 'profesional',
    nombre: 'Irene',
    apellido: 'M.',
    email: 'ire@psicopeconire.com',
    password: 'brujula',
    titulo: 'Lic. en Psicopedagogía · Esp. en Orientación Vocacional',
    ...t(120),
  },
  {
    id: IDS.userValen,
    role: 'consultante',
    nombre: 'Valentina',
    apellido: 'Suárez',
    email: 'valen@demo.com',
    password: 'brujula',
    consultantId: IDS.valen,
    ...t(60),
  },
]

const consultants: Consultant[] = [
  {
    id: IDS.valen,
    nombre: 'Valentina',
    apellido: 'Suárez',
    fechaNacimiento: '2008-09-14',
    escuela: 'Colegio San Martín',
    curso: '6.º año — Cs. Sociales',
    email: 'valen@demo.com',
    telefono: '+54 9 11 5555-1234',
    motivoConsulta:
      'Termina la secundaria y duda entre Psicología y algo artístico. Siente presión familiar hacia Abogacía.',
    fechaInicio: dateOnly(daysAgo(60)),
    estado: 'en_proceso',
    profesionalId: IDS.pro,
    notas: 'Muy buena alianza de trabajo. Trae material espontáneamente.',
    ...t(60),
  },
  {
    id: IDS.tomas,
    nombre: 'Tomás',
    apellido: 'Ferreyra',
    fechaNacimiento: '2007-03-02',
    escuela: 'ET N.º 3 — Electrónica',
    curso: '7.º año',
    email: 'tomas.f@demo.com',
    telefono: '+54 9 11 5555-8765',
    motivoConsulta:
      'Le gusta la tecnología pero no sabe si seguir Ingeniería o algo más corto. Miedo a “perder años”.',
    fechaInicio: dateOnly(daysAgo(25)),
    estado: 'en_proceso',
    profesionalId: IDS.pro,
    ...t(25),
  },
  {
    id: IDS.mora,
    nombre: 'Mora',
    apellido: 'Aguirre',
    fechaNacimiento: '2009-11-30',
    escuela: 'Instituto Belgrano',
    curso: '5.º año — Naturales',
    email: 'mora.a@demo.com',
    telefono: '+54 9 11 5555-4321',
    motivoConsulta: 'Consulta temprana: quiere empezar a pensar su futuro sin apuro.',
    fechaInicio: dateOnly(daysAgo(7)),
    estado: 'entrevista_inicial',
    profesionalId: IDS.pro,
    ...t(7),
  },
]

const moduleProgress: ModuleProgress[] = [
  // Valentina: avanzada (módulos 1-5 completados, 6-7 en progreso)
  ...(
    [
      ['historia', 'completado', 58, 50],
      ['identidad', 'completado', 50, 43],
      ['valores', 'completado', 43, 36],
      ['deseos', 'completado', 36, 29],
      ['mandatos', 'completado', 29, 15],
      ['fortalezas', 'en_progreso', 15, undefined],
      ['intereses', 'en_progreso', 8, undefined],
    ] as const
  ).map(([mod, estado, ini, fin], i) => ({
    id: `mp-valen-${mod}`,
    consultantId: IDS.valen,
    moduleId: mod,
    estado,
    notasProfesionales:
      mod === 'mandatos'
        ? 'Módulo clave: apareció con fuerza el mandato paterno hacia Abogacía. Trabajado en sesión, buena elaboración.'
        : mod === 'valores'
          ? 'Jerarquizó creatividad y ayudar a otros por encima de seguridad económica. Muy consistente.'
          : '',
    notasConsultante: mod === 'valores' ? 'Me sorprendió lo claro que me quedó lo que no negocio.' : '',
    fechaInicio: daysAgo(ini),
    fechaCompletado: fin !== undefined ? daysAgo(fin) : undefined,
    ...t(fin ?? ini),
  })),
  // Tomás: comenzando
  {
    id: 'mp-tomas-historia',
    consultantId: IDS.tomas,
    moduleId: 'historia',
    estado: 'completado',
    notasProfesionales: 'Historia marcada por el taller del padre. Vínculo positivo con lo técnico desde chico.',
    notasConsultante: '',
    fechaInicio: daysAgo(22),
    fechaCompletado: daysAgo(12),
    ...t(12),
  },
  {
    id: 'mp-tomas-identidad',
    consultantId: IDS.tomas,
    moduleId: 'identidad',
    estado: 'en_progreso',
    notasProfesionales: '',
    notasConsultante: '',
    fechaInicio: daysAgo(10),
    ...t(10),
  },
]

const sessions: Session[] = [
  {
    id: 's-valen-1',
    consultantId: IDS.valen,
    fecha: daysAgo(58, 15),
    duracionMin: 60,
    modalidad: 'presencial',
    estado: 'realizada',
    titulo: 'Entrevista inicial',
    temas: ['Encuadre', 'Motivo de consulta', 'Historia familiar'],
    notas:
      'Llega por decisión propia aunque la madre gestionó el turno. Verbaliza presión del padre (abogado) hacia Abogacía. Buen insight inicial. Se acuerda encuadre semanal.',
    moduleIds: ['historia'],
    proximosPasos: 'Asignar Línea de vida. Entrevista con padres en 2 semanas.',
    ...t(58),
  },
  {
    id: 's-valen-2',
    consultantId: IDS.valen,
    fecha: daysAgo(44, 15),
    duracionMin: 60,
    modalidad: 'presencial',
    estado: 'realizada',
    titulo: 'Trabajo sobre identidad',
    temas: ['Espejos', 'Autopercepción'],
    notas:
      'Trabajamos “los espejos”: los amigos la describen como creativa y sensible; ella se describía solo como “buena alumna”. Se abre la pregunta por la identidad más allá del rendimiento.',
    moduleIds: ['identidad'],
    proximosPasos: 'Actividad Mis valores.',
    ...t(44),
  },
  {
    id: 's-valen-3',
    consultantId: IDS.valen,
    fecha: daysAgo(30, 15),
    duracionMin: 60,
    modalidad: 'virtual',
    estado: 'realizada',
    titulo: 'Mandatos familiares',
    temas: ['Mandato paterno', 'Genograma profesional'],
    notas:
      'Sesión intensa. El árbol de profesiones muestra 3 generaciones de abogados por línea paterna. Valentina llora al decir “no quiero estudiar Derecho”. Primera vez que lo dice en voz alta. Se trabaja la diferencia entre decepcionar y diferenciarse.',
    moduleIds: ['mandatos'],
    proximosPasos: 'Sostener. Iniciar inventario de fortalezas.',
    ...t(30),
  },
  {
    id: 's-valen-4',
    consultantId: IDS.valen,
    fecha: daysAgo(9, 15),
    duracionMin: 60,
    modalidad: 'presencial',
    estado: 'realizada',
    titulo: 'Fortalezas e intereses',
    temas: ['Inventario de fortalezas', 'Mapa de intereses'],
    notas:
      'Fortalezas: creatividad, empatía, escucha. En el mapa de intereses aparecen con fuerza: psicología, ilustración, contenidos audiovisuales. Se le propone empezar exploración con una diseñadora UX y una psicóloga.',
    moduleIds: ['fortalezas', 'intereses'],
    proximosPasos: 'Coordinar entrevistas de exploración.',
    ...t(9),
  },
  {
    id: 's-valen-5',
    consultantId: IDS.valen,
    fecha: daysAhead(2, 15),
    duracionMin: 60,
    modalidad: 'presencial',
    estado: 'programada',
    titulo: 'Revisión de exploración',
    temas: ['Entrevista a profesional', 'Aptitudes'],
    notas: '',
    moduleIds: ['exploracion', 'aptitudes'],
    proximosPasos: '',
    ...t(4),
  },
  {
    id: 's-tomas-1',
    consultantId: IDS.tomas,
    fecha: daysAgo(23, 17),
    duracionMin: 60,
    modalidad: 'presencial',
    estado: 'realizada',
    titulo: 'Entrevista inicial',
    temas: ['Encuadre', 'Motivo de consulta'],
    notas:
      'Claridad de área (tecnología) pero angustia por la duración de Ingeniería. Aparece la frase familiar “una carrera corta y a trabajar”. A explorar: ¿deseo o mandato de rapidez?',
    moduleIds: ['historia'],
    proximosPasos: 'Línea de vida + recorrido escolar.',
    ...t(23),
  },
  {
    id: 's-tomas-2',
    consultantId: IDS.tomas,
    fecha: daysAhead(1, 17),
    duracionMin: 60,
    modalidad: 'virtual',
    estado: 'programada',
    titulo: 'Identidad y espejos',
    temas: ['Quién soy', 'Espejos'],
    notas: '',
    moduleIds: ['identidad'],
    proximosPasos: '',
    ...t(3),
  },
  {
    id: 's-mora-1',
    consultantId: IDS.mora,
    fecha: daysAhead(5, 16),
    duracionMin: 60,
    modalidad: 'presencial',
    estado: 'programada',
    titulo: 'Entrevista inicial',
    temas: ['Encuadre', 'Motivo de consulta'],
    notas: '',
    moduleIds: [],
    proximosPasos: '',
    ...t(6),
  },
]

const observations: Observation[] = [
  {
    id: 'o-valen-1',
    consultantId: IDS.valen,
    moduleId: 'mandatos',
    fecha: daysAgo(30),
    tipo: 'clinica',
    texto:
      'Al nombrar el mandato paterno se observa alivio corporal inmediato. Hipótesis: gran parte de la “indecisión” era conflicto de lealtad, no falta de intereses.',
    ...t(30),
  },
  {
    id: 'o-valen-2',
    consultantId: IDS.valen,
    moduleId: 'intereses',
    fecha: daysAgo(9),
    tipo: 'proceso',
    texto:
      'Sus intereses convergen en la intersección personas + creación: le entusiasma tanto entender a la gente como producir cosas visuales. Explorar carreras puente (UX, psicología, comunicación audiovisual).',
    ...t(9),
  },
  {
    id: 'o-valen-3',
    consultantId: IDS.valen,
    fecha: daysAgo(44),
    tipo: 'familiar',
    texto:
      'Entrevista con padres: la madre acompaña con apertura; el padre repite “que estudie lo que quiera, pero Derecho abre puertas”. Se trabaja psicoeducación sobre el proceso.',
    ...t(44),
  },
  {
    id: 'o-tomas-1',
    consultantId: IDS.tomas,
    moduleId: 'historia',
    fecha: daysAgo(15),
    tipo: 'clinica',
    texto:
      'El “miedo a perder años” aparece ligado a la historia económica familiar. La urgencia es heredada; su curiosidad técnica es genuina y de larga data (arma circuitos desde los 10).',
    ...t(15),
  },
]

// Actividades de Valentina con respuestas reales (alimentan el Motor Brújula)
const activities: Activity[] = [
  {
    id: 'a-valen-valores',
    consultantId: IDS.valen,
    moduleId: 'valores',
    templateId: 'valores-eleccion',
    titulo: 'Mis valores',
    descripcion: 'Elegí tus 5 valores fundamentales y contá una escena donde se noten.',
    tipo: 'ejercicio',
    preguntas: [
      { id: 'q1', texto: 'Elegí tus 5 valores fundamentales', tipo: 'seleccion', opciones: ['Libertad', 'Ayudar a otros', 'Creatividad', 'Seguridad económica', 'Familia', 'Conocimiento', 'Justicia', 'Independencia', 'Reconocimiento', 'Naturaleza', 'Salud', 'Amistad', 'Aventura', 'Orden', 'Espiritualidad', 'Belleza', 'Liderazgo', 'Solidaridad'] },
      { id: 'q2', texto: 'Ordenalos del más al menos importante y explicá el primero.', tipo: 'abierta' },
      { id: 'q3', texto: 'Contá una escena real donde uno de esos valores haya guiado una decisión tuya.', tipo: 'abierta' },
    ],
    respuestas: [
      { questionId: 'q1', texto: 'Creatividad, Ayudar a otros, Libertad, Amistad, Conocimiento', fecha: daysAgo(38) },
      {
        questionId: 'q2',
        texto:
          'Primero creatividad: cuando no puedo crear algo (dibujar, editar videos, escribir) siento que me apago. Después ayudar: me pasa con mis amigas, siempre termino siendo la que escucha.',
        fecha: daysAgo(38),
      },
      {
        questionId: 'q3',
        texto:
          'El año pasado elegí hacer el mural del colegio en vez de ir al viaje de fin de semana. Nadie lo entendió pero fue mi mejor decisión del año.',
        fecha: daysAgo(38),
      },
    ],
    estado: 'revisada',
    fechaAsignada: daysAgo(43),
    fechaCompletada: daysAgo(38),
    feedbackProfesional:
      'Hermosa la escena del mural: creatividad + compromiso sostenido. Lo retomamos en sesión.',
    ...t(38),
  },
  {
    id: 'a-valen-mandatos',
    consultantId: IDS.valen,
    moduleId: 'mandatos',
    templateId: 'mandatos-frases',
    titulo: 'Frases de mi casa',
    descripcion: 'Registrá las frases familiares sobre estudio, trabajo y éxito.',
    tipo: 'ejercicio',
    preguntas: [
      { id: 'q1', texto: '¿Qué frases sobre estudio/trabajo se repiten en tu familia?', tipo: 'lista' },
      { id: 'q2', texto: '¿Qué se espera de vos en tu casa? ¿Quién lo espera?', tipo: 'abierta' },
      { id: 'q3', texto: '¿Hay carreras “bien vistas” y “mal vistas” en tu familia? ¿Cuáles?', tipo: 'abierta' },
    ],
    respuestas: [
      {
        questionId: 'q1',
        texto:
          '“Derecho abre puertas.” “Del arte no se vive.” “Los Suárez siempre fuimos gente de leyes.”',
        fecha: daysAgo(32),
      },
      {
        questionId: 'q2',
        texto:
          'Mi papá espera que siga Abogacía y entre a su estudio. No lo dice como orden, pero está en cada comida familiar.',
        fecha: daysAgo(32),
      },
      {
        questionId: 'q3',
        texto:
          'Bien vistas: Derecho, Medicina, Economía. Mal vistas: todo lo artístico (“hobby”) y Psicología (“para qué, si estás bien”).',
        fecha: daysAgo(32),
      },
    ],
    estado: 'revisada',
    fechaAsignada: daysAgo(36),
    fechaCompletada: daysAgo(32),
    feedbackProfesional: 'Material valiosísimo. Lo trabajamos en la próxima sesión con el árbol de profesiones.',
    ...t(32),
  },
  {
    id: 'a-valen-fortalezas',
    consultantId: IDS.valen,
    moduleId: 'fortalezas',
    templateId: 'fortalezas-inventario',
    titulo: 'Inventario de fortalezas',
    descripcion: 'Elegí tus 5 fortalezas y respaldalas con ejemplos.',
    tipo: 'ejercicio',
    preguntas: [
      { id: 'q1', texto: 'Elegí tus 5 fortalezas principales', tipo: 'seleccion', opciones: ['Creatividad', 'Curiosidad', 'Pensamiento crítico', 'Perseverancia', 'Honestidad', 'Empatía', 'Trabajo en equipo', 'Liderazgo', 'Organización', 'Comunicación', 'Paciencia', 'Humor', 'Adaptabilidad', 'Detallismo', 'Iniciativa', 'Escucha'] },
      { id: 'q2', texto: 'Elegí una y contá un logro concreto donde se haya notado.', tipo: 'abierta' },
      { id: 'q3', texto: '¿Qué te dicen los demás que hacés bien?', tipo: 'abierta' },
    ],
    respuestas: [
      { questionId: 'q1', texto: 'Creatividad, Empatía, Escucha, Curiosidad, Detallismo', fecha: daysAgo(11) },
      {
        questionId: 'q2',
        texto:
          'Empatía: cuando mi mejor amiga la pasó mal, armé un fanzine con dibujos y frases para acompañarla. Me dijo que fue lo que más la ayudó.',
        fecha: daysAgo(11),
      },
      { questionId: 'q3', texto: 'Que escucho de verdad, que dibujo “distinto”, y que explico bien las cosas.', fecha: daysAgo(11) },
    ],
    estado: 'completada',
    fechaAsignada: daysAgo(15),
    fechaCompletada: daysAgo(11),
    ...t(11),
  },
  {
    id: 'a-valen-intereses',
    consultantId: IDS.valen,
    moduleId: 'intereses',
    templateId: 'intereses-areas',
    titulo: 'Áreas que me llaman',
    descripcion: 'Señalá las áreas que te despiertan curiosidad real.',
    tipo: 'ejercicio',
    preguntas: [
      { id: 'q1', texto: '¿Qué áreas te atraen?', tipo: 'seleccion', opciones: ['Salud y cuidado de personas', 'Arte y diseño', 'Tecnología y programación', 'Ciencias naturales', 'Ciencias sociales', 'Comunicación y medios', 'Negocios y economía', 'Educación', 'Derecho y justicia', 'Ingeniería y construcción', 'Ambiente y naturaleza', 'Deporte y movimiento'] },
      { id: 'q2', texto: 'De las que elegiste, ¿cuál te intriga más ahora mismo y por qué?', tipo: 'abierta' },
    ],
    respuestas: [
      { questionId: 'q1', texto: 'Arte y diseño, Salud y cuidado de personas, Comunicación y medios, Ciencias sociales', fecha: daysAgo(6) },
      {
        questionId: 'q2',
        texto:
          'Arte y diseño, pero me di cuenta de que lo que más me gusta es diseñar PARA personas: entender qué necesitan y crear algo que les sirva o los emocione.',
        fecha: daysAgo(6),
      },
    ],
    estado: 'completada',
    fechaAsignada: daysAgo(8),
    fechaCompletada: daysAgo(6),
    ...t(6),
  },
  {
    id: 'a-valen-entrevista',
    consultantId: IDS.valen,
    moduleId: 'exploracion',
    templateId: 'exploracion-entrevista',
    titulo: 'Entrevista a un profesional',
    descripcion: 'Entrevistá a la diseñadora UX que te contacté y registrá la charla.',
    tipo: 'entrevista',
    preguntas: [
      { id: 'q1', texto: '¿A quién entrevistaste y a qué se dedica?', tipo: 'abierta' },
      { id: 'q2', texto: '¿Cómo es un día normal de su trabajo? ¿Qué te sorprendió?', tipo: 'abierta' },
      { id: 'q3', texto: '¿Qué es lo mejor y lo peor de su profesión, según sus palabras?', tipo: 'abierta' },
      { id: 'q4', texto: 'Después de la charla, ¿el área te interesa más o menos que antes? ¿Por qué?', tipo: 'abierta' },
    ],
    respuestas: [],
    estado: 'pendiente',
    fechaAsignada: daysAgo(8),
    fechaLimite: daysAhead(4),
    ...t(8),
  },
  {
    id: 'a-tomas-linea',
    consultantId: IDS.tomas,
    moduleId: 'historia',
    templateId: 'historia-linea-vida',
    titulo: 'Mi línea de vida',
    descripcion: 'Línea del tiempo con tus momentos importantes.',
    tipo: 'ejercicio',
    preguntas: [
      { id: 'q1', texto: '¿Cuáles fueron los 5 momentos más importantes de tu vida hasta hoy?', tipo: 'lista' },
      { id: 'q2', texto: '¿Qué momento recordás como el más feliz? ¿Qué estabas haciendo?', tipo: 'abierta' },
      { id: 'q3', texto: '¿Hubo algún cambio grande (mudanza, escuela, familia) que te haya marcado?', tipo: 'abierta' },
    ],
    respuestas: [
      {
        questionId: 'q1',
        texto:
          '1) Cuando armé mi primera compu a los 12. 2) Entrar a la técnica. 3) El torneo de robótica. 4) Cuando cerró el taller de papá. 5) Mi primer arreglo pago (una notebook).',
        fecha: daysAgo(16),
      },
      {
        questionId: 'q2',
        texto: 'El torneo de robótica: no dormimos en toda la noche y el robot anduvo. Nunca me sentí tan despierto.',
        fecha: daysAgo(16),
      },
      {
        questionId: 'q3',
        texto: 'El cierre del taller de papá. Desde ahí en casa todo es “trabajo seguro” y “rápido”.',
        fecha: daysAgo(16),
      },
    ],
    estado: 'revisada',
    fechaAsignada: daysAgo(22),
    fechaCompletada: daysAgo(16),
    feedbackProfesional: 'La escena del torneo es oro puro. La retomamos en sesión.',
    ...t(16),
  },
  {
    id: 'a-tomas-quien-soy',
    consultantId: IDS.tomas,
    moduleId: 'identidad',
    templateId: 'identidad-quien-soy',
    titulo: '¿Quién soy? Diez respuestas',
    descripcion: 'Diez respuestas a la pregunta ¿quién soy?',
    tipo: 'ejercicio',
    preguntas: [
      { id: 'q1', texto: 'Escribí tus diez respuestas a “¿quién soy?”', tipo: 'lista' },
      { id: 'q2', texto: '¿Cuál de todas te representa más? ¿Por qué?', tipo: 'abierta' },
      { id: 'q3', texto: '¿Cuál pusiste porque “había que ponerla”?', tipo: 'abierta' },
    ],
    respuestas: [],
    estado: 'en_progreso',
    fechaAsignada: daysAgo(10),
    fechaLimite: daysAhead(1),
    ...t(10),
  },
]

const videos: AssignedVideo[] = [
  {
    id: 'v-valen-1',
    consultantId: IDS.valen,
    moduleId: 'mandatos',
    titulo: 'Mandatos: elegir con las voces en la mesa',
    descripcion: 'Qué es un mandato, cómo opera y cómo se desactiva.',
    url: 'https://www.youtube.com/watch?v=metodo-brujula-mandatos',
    visto: true,
    comentarioConsultante: 'Me vi reflejada en TODO el video. Sobre todo en la parte de la lealtad invisible.',
    ...t(31),
  },
  {
    id: 'v-valen-2',
    consultantId: IDS.valen,
    moduleId: 'exploracion',
    titulo: 'Cómo entrevistar a un profesional',
    descripcion: 'Guía práctica para conducir tu entrevista de exploración.',
    url: 'https://www.youtube.com/watch?v=metodo-brujula-exploracion',
    visto: false,
    ...t(8),
  },
  {
    id: 'v-tomas-1',
    consultantId: IDS.tomas,
    moduleId: 'identidad',
    titulo: 'Identidad vocacional: quién sos cuando elegís',
    descripcion: 'La elección vocacional como capítulo de tu identidad.',
    url: 'https://www.youtube.com/watch?v=metodo-brujula-identidad',
    visto: false,
    ...t(10),
  },
]

const reflections: Reflection[] = [
  {
    id: 'r-valen-1',
    consultantId: IDS.valen,
    moduleId: 'mandatos',
    titulo: 'Después de la sesión de hoy',
    contenido:
      'Dije en voz alta que no quiero estudiar Derecho. Pensé que me iba a sentir culpable y me sentí… liviana. Todavía no sé qué SÍ quiero, pero saber qué no, ya es un montón.',
    animo: 'calma',
    ...t(30),
  },
  {
    id: 'r-valen-2',
    consultantId: IDS.valen,
    moduleId: 'intereses',
    titulo: 'Descubrimiento',
    contenido:
      'Mirando mi registro de la semana: casi todo lo que consumo es gente explicando cómo hace cosas creativas, y videos de psicología. Quizás no tengo que elegir ENTRE las dos cosas.',
    animo: 'entusiasmo',
    ...t(7),
  },
  {
    id: 'r-tomas-1',
    consultantId: IDS.tomas,
    moduleId: 'historia',
    titulo: 'La línea de vida',
    contenido:
      'Me di cuenta de que todos mis mejores momentos tienen que ver con armar cosas. Y que el apuro por “algo corto” es más miedo de mi familia que mío.',
    animo: 'duda',
    ...t(16),
  },
]

const evaluations: Evaluation[] = [
  {
    id: 'e-valen-inicial',
    consultantId: IDS.valen,
    titulo: 'Evaluación inicial de proceso',
    tipo: 'inicial',
    fecha: daysAgo(55),
    items: [
      { id: 'i1', dimension: 'historia', etiqueta: 'Claridad sobre la propia historia', valor: 3 },
      { id: 'i2', dimension: 'identidad', etiqueta: 'Identidad diferenciada de expectativas', valor: 2 },
      { id: 'i3', dimension: 'valores', etiqueta: 'Conciencia de valores propios', valor: 2 },
      { id: 'i4', dimension: 'deseos', etiqueta: 'Registro del deseo propio', valor: 2 },
      { id: 'i5', dimension: 'mandatos', etiqueta: 'Mandatos identificados y elaborados', valor: 1 },
      { id: 'i6', dimension: 'exploracion', etiqueta: 'Información real sobre el mundo formativo', valor: 1 },
    ],
    conclusiones:
      'Proceso inicial típico de conflicto de lealtad: intereses presentes pero tapados por mandato. Excelente pronóstico por disposición al trabajo.',
    ...t(55),
  },
  {
    id: 'e-valen-intereses',
    consultantId: IDS.valen,
    titulo: 'Evaluación de intereses y aptitudes',
    tipo: 'intereses',
    fecha: daysAgo(9),
    items: [
      { id: 'i1', dimension: 'intereses', etiqueta: 'Interés artístico-visual', valor: 5, notas: 'Dibujo, edición, fanzines. Sostenido desde la infancia.' },
      { id: 'i2', dimension: 'intereses', etiqueta: 'Interés por comprender a las personas', valor: 5, notas: 'Psicología, escucha activa con pares.' },
      { id: 'i3', dimension: 'intereses', etiqueta: 'Interés por comunicación/medios', valor: 4 },
      { id: 'i4', dimension: 'intereses', etiqueta: 'Interés jurídico-normativo', valor: 1, notas: 'Confirmado: era mandato, no interés.' },
      { id: 'i5', dimension: 'aptitudes', etiqueta: 'Expresión visual y estética', valor: 5 },
      { id: 'i6', dimension: 'aptitudes', etiqueta: 'Comprensión empática', valor: 5 },
      { id: 'i7', dimension: 'aptitudes', etiqueta: 'Expresión verbal escrita', valor: 4 },
      { id: 'i8', dimension: 'aptitudes', etiqueta: 'Razonamiento lógico-matemático', valor: 3 },
      { id: 'i9', dimension: 'fortalezas', etiqueta: 'Creatividad aplicada', valor: 5 },
      { id: 'i10', dimension: 'fortalezas', etiqueta: 'Empatía y escucha', valor: 5 },
    ],
    conclusiones:
      'Perfil claro en la intersección creación visual + comprensión de personas. Sugerido explorar: Diseño UX, Psicología, Diseño Gráfico/Audiovisual, Comunicación.',
    ...t(9),
  },
]

const files: StoredFile[] = [
  {
    id: 'f-valen-1',
    consultantId: IDS.valen,
    moduleId: 'historia',
    nombre: 'linea-de-vida-valentina.pdf',
    mimeType: 'application/pdf',
    tamano: 245_000,
    descripcion: 'Línea de vida escaneada (trabajada en sesión 2).',
    subidoPor: 'profesional',
    ...t(50),
  },
  {
    id: 'f-valen-2',
    consultantId: IDS.valen,
    moduleId: 'mandatos',
    nombre: 'arbol-profesiones.jpg',
    mimeType: 'image/jpeg',
    tamano: 512_000,
    descripcion: 'Foto del árbol de profesiones familiar.',
    subidoPor: 'consultante',
    ...t(31),
  },
  {
    id: 'f-general-1',
    nombre: 'guia-familias-metodo-brujula.pdf',
    mimeType: 'application/pdf',
    tamano: 380_000,
    descripcion: 'Guía para familias: cómo acompañar el proceso.',
    subidoPor: 'profesional',
    ...t(90),
  },
]

const events: CalendarEvent[] = [
  ...sessions
    .filter((s) => s.estado === 'programada')
    .map((s) => ({
      id: `ev-${s.id}`,
      fecha: s.fecha,
      titulo: s.titulo,
      tipo: 'sesion' as const,
      consultantId: s.consultantId,
      sessionId: s.id,
      ...t(5),
    })),
  {
    id: 'ev-tarea-1',
    fecha: daysAhead(3, 9),
    titulo: 'Preparar informe de avance de Valentina',
    tipo: 'tarea',
    consultantId: IDS.valen,
    completado: false,
    ...t(5),
  },
  {
    id: 'ev-tarea-2',
    fecha: daysAhead(6, 9),
    titulo: 'Contactar universidad por charla abierta de Diseño',
    tipo: 'recordatorio',
    completado: false,
    ...t(2),
  },
]

const log: ActivityLogEntry[] = [
  { id: 'l1', fecha: daysAgo(6), actor: 'consultante', consultantId: IDS.valen, tipo: 'actividad_completada', descripcion: 'Valentina completó «Áreas que me llaman»', ...t(6) },
  { id: 'l2', fecha: daysAgo(7), actor: 'consultante', consultantId: IDS.valen, tipo: 'reflexion_creada', descripcion: 'Valentina escribió la reflexión «Descubrimiento»', ...t(7) },
  { id: 'l3', fecha: daysAgo(9), actor: 'profesional', consultantId: IDS.valen, tipo: 'evaluacion_creada', descripcion: 'Evaluación de intereses y aptitudes registrada', ...t(9) },
  { id: 'l4', fecha: daysAgo(9), actor: 'profesional', consultantId: IDS.valen, tipo: 'sesion_registrada', descripcion: 'Sesión «Fortalezas e intereses» registrada', ...t(9) },
  { id: 'l5', fecha: daysAgo(10), actor: 'profesional', consultantId: IDS.tomas, tipo: 'actividad_asignada', descripcion: 'Se asignó «¿Quién soy? Diez respuestas» a Tomás', ...t(10) },
  { id: 'l6', fecha: daysAgo(16), actor: 'consultante', consultantId: IDS.tomas, tipo: 'actividad_completada', descripcion: 'Tomás completó «Mi línea de vida»', ...t(16) },
  { id: 'l7', fecha: daysAgo(7), actor: 'profesional', consultantId: IDS.mora, tipo: 'consultante_creado', descripcion: 'Se creó la ficha de Mora Aguirre', ...t(7) },
]

export async function seedIfNeeded(): Promise<void> {
  if (localStorage.getItem(SEED_KEY) === SEED_VERSION) return
  await db.clearAll()
  await db.users.bulkCreate(users)
  await db.consultants.bulkCreate(consultants)
  await db.moduleProgress.bulkCreate(moduleProgress)
  await db.sessions.bulkCreate(sessions)
  await db.observations.bulkCreate(observations)
  await db.activities.bulkCreate(activities)
  await db.videos.bulkCreate(videos)
  await db.reflections.bulkCreate(reflections)
  await db.evaluations.bulkCreate(evaluations)
  await db.files.bulkCreate(files)
  await db.events.bulkCreate(events)
  await db.log.bulkCreate(log)
  localStorage.setItem(SEED_KEY, SEED_VERSION)
}

export async function resetDemoData(): Promise<void> {
  localStorage.removeItem(SEED_KEY)
  await seedIfNeeded()
}
