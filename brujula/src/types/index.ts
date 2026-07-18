// ============================================================
// Método Brújula — Modelo de dominio
// Todas las entidades usan IDs uuid y timestamps ISO-8601,
// espejo del esquema Supabase objetivo (ver ARCHITECTURE.md §6).
// ============================================================

export type UserRole = 'profesional' | 'consultante'

export interface User {
  id: string
  role: UserRole
  nombre: string
  apellido: string
  email: string
  password: string // demo/local. En Supabase: auth.users
  titulo?: string // p. ej. "Lic. en Psicopedagogía"
  avatarUrl?: string
  consultantId?: string // solo rol consultante
  createdAt: string
  updatedAt: string
}

// ---------- Consultantes ----------

export type ConsultantStatus = 'entrevista_inicial' | 'en_proceso' | 'en_pausa' | 'finalizado'

export interface Consultant {
  id: string
  fotoUrl?: string
  nombre: string
  apellido: string
  fechaNacimiento: string // ISO date
  escuela: string
  curso: string
  email: string
  telefono: string
  motivoConsulta: string
  fechaInicio: string // ISO date
  estado: ConsultantStatus
  profesionalId: string
  notas?: string
  createdAt: string
  updatedAt: string
}

export interface Observation {
  id: string
  consultantId: string
  moduleId?: ModuleId
  fecha: string
  texto: string
  tipo: 'clinica' | 'familiar' | 'escolar' | 'proceso'
  createdAt: string
  updatedAt: string
}

// ---------- Sesiones ----------

export type SessionStatus = 'programada' | 'realizada' | 'cancelada'
export type SessionMode = 'presencial' | 'virtual'

export interface Session {
  id: string
  consultantId: string
  fecha: string // ISO datetime
  duracionMin: number
  modalidad: SessionMode
  estado: SessionStatus
  titulo: string
  temas: string[]
  notas: string
  moduleIds: ModuleId[]
  proximosPasos: string
  createdAt: string
  updatedAt: string
}

// ---------- Método: 12 módulos / 5 etapas ----------

export type StageId = 'conocerte' | 'valorarte' | 'explorar' | 'decidir' | 'actuar'

export type ModuleId =
  | 'historia'
  | 'identidad'
  | 'valores'
  | 'deseos'
  | 'mandatos'
  | 'fortalezas'
  | 'intereses'
  | 'aptitudes'
  | 'exploracion'
  | 'proyecto_vida'
  | 'carreras'
  | 'plan_accion'

export interface ModuleQuestion {
  id: string
  texto: string
  tipo: 'abierta' | 'lista' | 'seleccion' | 'escala'
  opciones?: string[] // para 'seleccion'
  ayuda?: string
}

export interface ModuleActivityTemplate {
  id: string
  titulo: string
  descripcion: string
  tipo: ActivityKind
  duracionMin: number
  preguntas: ModuleQuestion[]
  /** dimensiones del Motor Brújula que alimenta esta actividad */
  dimensiones: EngineDimension[]
}

export interface ModuleVideo {
  id: string
  titulo: string
  descripcion: string
  url: string
  duracion: string
}

export interface ModuleResource {
  id: string
  titulo: string
  descripcion: string
  tipo: 'pdf' | 'lectura' | 'plantilla' | 'enlace'
}

export interface ModuleDefinition {
  id: ModuleId
  numero: number
  etapa: StageId
  nombre: string
  esencia: string // frase corta
  introduccion: string
  paraElConsultante: string // introducción en 2.ª persona
  objetivos: string[]
  actividades: ModuleActivityTemplate[]
  videos: ModuleVideo[]
  materiales: ModuleResource[]
  preguntasGuia: string[] // para la sesión profesional
}

export type ModuleProgressStatus = 'no_iniciado' | 'en_progreso' | 'completado'

export interface ModuleProgress {
  id: string
  consultantId: string
  moduleId: ModuleId
  estado: ModuleProgressStatus
  notasProfesionales: string
  notasConsultante: string
  fechaInicio?: string
  fechaCompletado?: string
  createdAt: string
  updatedAt: string
}

// ---------- Actividades asignadas ----------

export type ActivityKind = 'ejercicio' | 'reflexion' | 'collage' | 'entrevista' | 'investigacion' | 'video' | 'lectura'
export type ActivityStatus = 'pendiente' | 'en_progreso' | 'completada' | 'revisada'

export interface ActivityAnswer {
  questionId: string
  texto: string
  fecha: string
}

export interface Activity {
  id: string
  consultantId: string
  moduleId: ModuleId
  templateId?: string // si nace de una plantilla del método
  titulo: string
  descripcion: string
  tipo: ActivityKind
  preguntas: ModuleQuestion[]
  respuestas: ActivityAnswer[]
  estado: ActivityStatus
  fechaAsignada: string
  fechaLimite?: string
  fechaCompletada?: string
  feedbackProfesional?: string
  createdAt: string
  updatedAt: string
}

export interface AssignedVideo {
  id: string
  consultantId: string
  moduleId: ModuleId
  titulo: string
  descripcion: string
  url: string
  visto: boolean
  comentarioConsultante?: string
  createdAt: string
  updatedAt: string
}

// ---------- Archivos ----------

export interface StoredFile {
  id: string
  consultantId?: string // sin consultante = material general del estudio
  moduleId?: ModuleId
  nombre: string
  mimeType: string
  tamano: number // bytes
  dataUrl?: string // contenido (limitado en LocalStorage); en Supabase → Storage
  descripcion?: string
  subidoPor: UserRole
  createdAt: string
  updatedAt: string
}

// ---------- Reflexiones (bitácora del consultante) ----------

export type Mood = 'entusiasmo' | 'calma' | 'duda' | 'ansiedad' | 'confusion'

export interface Reflection {
  id: string
  consultantId: string
  moduleId?: ModuleId
  titulo: string
  contenido: string
  animo?: Mood
  createdAt: string
  updatedAt: string
}

// ---------- Evaluaciones ----------

export type EngineDimension =
  | 'historia'
  | 'identidad'
  | 'valores'
  | 'deseos'
  | 'mandatos'
  | 'fortalezas'
  | 'intereses'
  | 'aptitudes'
  | 'exploracion'

export interface EvaluationItem {
  id: string
  dimension: EngineDimension
  etiqueta: string // p. ej. "Interés por el cuidado de otros"
  valor: number // 1..5 Likert — uso interno profesional
  notas?: string
}

export interface Evaluation {
  id: string
  consultantId: string
  titulo: string
  tipo: 'inicial' | 'intereses' | 'aptitudes' | 'proceso' | 'cierre'
  fecha: string
  items: EvaluationItem[]
  conclusiones: string
  createdAt: string
  updatedAt: string
}

// ---------- Motor Brújula ----------

export type AffinityTier = 'brujula_firme' | 'rumbo_posible' | 'para_explorar'

export interface EvidenceRef {
  fuente:
    | 'actividad'
    | 'evaluacion'
    | 'reflexion'
    | 'observacion'
    | 'sesion'
    | 'entrevista'
  detalle: string // texto citable: "En la actividad ‘Mis valores’ elegiste…"
}

export interface ProfileDimension {
  dimension: EngineDimension
  titulo: string
  sintesis: string
  destacados: string[] // palabras/temas clave detectados
  evidencias: EvidenceRef[]
  intensidad: 'alta' | 'media' | 'incipiente' // cualitativa, nunca %
}

export interface CareerSuggestion {
  areaId: string
  area: string
  carreras: string[]
  nivel: AffinityTier
  motivos: string[] // SIEMPRE explicados
  evidencias: EvidenceRef[]
  tensiones?: string[] // p. ej. deseo vs. mandato detectado
  pasosExploracion: string[]
}

export interface NavigationChart {
  rumbo: string // síntesis del norte detectado
  brujulaInterior: string[] // valores/deseos rectores
  vientosAFavor: string[]
  vientosEnContra: string[]
  escalas: string[] // próximos pasos concretos
  sugerencias: CareerSuggestion[]
}

export interface CompassSnapshot {
  id: string
  consultantId: string
  generadoEl: string
  perfil: ProfileDimension[]
  mapa: { dimension: EngineDimension; titulo: string; nivel: number }[] // 0..5 solo para el radar interno
  carta: NavigationChart
  notaMetodologica: string
  createdAt: string
  updatedAt: string
}

// ---------- Calendario / tareas ----------

export interface CalendarEvent {
  id: string
  fecha: string // ISO datetime
  titulo: string
  tipo: 'sesion' | 'tarea' | 'recordatorio'
  consultantId?: string
  sessionId?: string
  notas?: string
  completado?: boolean
  createdAt: string
  updatedAt: string
}

// ---------- IA ----------

export interface AISettings {
  proveedor: 'local' | 'openai'
  apiKey?: string
  modelo: string
}

export interface AIDraft {
  titulo: string
  contenido: string
  proveedor: 'local' | 'openai'
  generadoEl: string
}

// ---------- Actividad reciente (feed del dashboard) ----------

export interface ActivityLogEntry {
  id: string
  fecha: string
  actor: UserRole
  consultantId?: string
  tipo:
    | 'consultante_creado'
    | 'sesion_registrada'
    | 'actividad_asignada'
    | 'actividad_completada'
    | 'reflexion_creada'
    | 'evaluacion_creada'
    | 'informe_generado'
    | 'archivo_subido'
    | 'video_visto'
    | 'modulo_completado'
  descripcion: string
  createdAt: string
  updatedAt: string
}
