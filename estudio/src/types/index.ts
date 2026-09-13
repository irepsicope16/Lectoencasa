// ============================================================
// Método Estudio — Modelo de dominio
// Basado en el Documento Maestro V1 (Lic. Irene Morbidelli, set. 2026).
// IDs uuid y timestamps ISO-8601, espejo de un futuro esquema Postgres.
// ============================================================

export type UserRole = 'profesional' | 'estudiante'

export interface User {
  id: string
  role: UserRole
  nombre: string
  apellido: string
  email: string
  password: string // demo/local
  titulo?: string // solo rol profesional
  /** Solo rol estudiante: vincula la cuenta con su ficha. */
  studentId?: string
  createdAt: string
  updatedAt: string
}

// ---------- Estudiantes ----------

/** Población inicial: adolescentes desde los 12, terciarios, universitarios, adultos. */
export type NivelEducativo = '12_15' | '16_18' | 'superior' | 'adulto'

export type StudentStatus = 'alta' | 'entrevista' | 'autoperfil' | 'en_proceso' | 'en_pausa' | 'finalizado'

export interface Student {
  id: string
  professionalId: string
  nombre: string
  apellido: string
  fechaNacimiento: string // ISO date
  nivel: NivelEducativo
  institucion?: string
  contacto: string
  motivoConsulta: string
  estado: StudentStatus
  /** Distingue consentimiento del adulto responsable de asentimiento del adolescente. */
  consentimiento: {
    otorgante: 'adulto_responsable' | 'propio'
    nombreOtorgante: string
    otorgado: boolean
    fecha?: string
  }
  archivedAt?: string
  createdAt: string
  updatedAt: string
}

// ---------- Entrevista inicial ----------

/** Respuesta al módulo de antecedentes e indicadores lectores (L1-L10). Sí/No/A veces salvo L10 (texto). */
export type IndicadorLectorRespuesta = 'si' | 'no' | 'a_veces' | 'no_sabe' | ''

export interface Intake {
  id: string
  studentId: string
  motivo: string
  historiaAcademica: string
  apoyosPrevios: string
  contexto: string
  /** Cuestionario breve de adulto referente (12-15 años). Nunca reemplaza la voz del adolescente. */
  referente?: {
    nombre: string
    vinculo: string
    respuestas: Record<string, IndicadorLectorRespuesta> // claves L1..L9
    l10Texto: string
  }
  notasPrivadas: string
  createdAt: string
  updatedAt: string
}

// ---------- Autoperfil (8 dimensiones / 56 ítems) ----------

export type DimensionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'

export type ItemKey = 'recurso' | 'dificultad'

export interface ItemDefinition {
  codigo: string // A1..H7
  dimension: DimensionId
  enunciado: string
  clave: ItemKey
}

/** Escala 0-3: 0 Nunca o casi nunca · 1 A veces · 2 Frecuentemente · 3 Casi siempre. null = No aplica. */
export interface QuestionnaireResponse {
  id: string
  studentId: string
  versionId: string // p. ej. 'v1'
  itemId: string // código del ítem
  valor: 0 | 1 | 2 | 3 | null
  comentario?: string
  fecha: string
  createdAt: string
  updatedAt: string
}

export interface OpenAnswer {
  id: string
  studentId: string
  preguntaId: string
  texto: string
  createdAt: string
  updatedAt: string
}

// ---------- Resultados por dimensión ----------

export type BandaNecesidad = 'baja' | 'leve' | 'moderada' | 'alta'
export type NivelConfianza = 'exploratorio' | 'convergente' | 'prioritario' | 'requiere_profundizacion'
export type FuenteResultado = 'autoinforme' | 'referente' | 'observacion_profesional'

/**
 * Snapshot versionado por dimensión: nunca se recalcula silenciosamente un
 * perfil histórico cuando cambian las reglas (regla de trazabilidad §14).
 */
export interface DimensionSnapshot {
  id: string
  studentId: string
  dimension: DimensionId
  versionId: string
  promedioNecesidad: number | null // null si completitud < 70%
  completitud: number // 0..1
  banda: BandaNecesidad | null
  confianza: NivelConfianza
  fuentesConvergentes: FuenteResultado[]
  /** true si el profesional marcó que su observación coincide con el autoinforme. */
  observacionProfesionalCoincide: boolean
  generadoEl: string
  createdAt: string
  updatedAt: string
}

// ---------- Alertas (no se ocultan; se resuelven con decisión documentada) ----------

export type AlertTipo = 'indicadores_lectores' | 'bienestar' | 'contextual' | 'discrepancia'

export interface Alert {
  id: string
  studentId: string
  tipo: AlertTipo
  evidencia: string[]
  estado: 'abierta' | 'resuelta'
  decisionProfesional?: string
  createdAt: string
  updatedAt: string
}

// ---------- Prioridades (motor de recomendaciones) ----------

export type EstadoPrioridad = 'sugerida' | 'confirmada' | 'descartada'

/**
 * Puntaje orientativo (tabla 17 del documento): el total ordena opciones,
 * pero el profesional siempre confirma, reordena o descarta.
 */
export interface PriorityDecision {
  id: string
  studentId: string
  dimension: DimensionId
  necesidadDeclarada: number // 0-3, de la banda de necesidad
  impactoActual: number // 0-3, criterio profesional
  frecuenciaMultiContexto: number // 0-2, criterio profesional
  interesEstudiante: number // 0-2, criterio profesional
  urgenciaEvaluacion: number // 0-1, criterio profesional
  puntaje: number // suma orientativa
  estado: EstadoPrioridad
  orden?: number
  justificacion?: string
  createdAt: string
  updatedAt: string
}

// ---------- Plan de intervención ----------

export type EstadoObjetivo = 'activo' | 'mantener' | 'graduar' | 'reemplazar' | 'cerrado'

export interface Goal {
  id: string
  studentId: string
  dimension: DimensionId
  necesidadPriorizada: string
  objetivoObservable: string
  herramientas: string[]
  frecuencia: string
  apoyoNecesario?: string
  evidencia: string
  fechaInicio: string
  fechaRevision: string
  estado: EstadoObjetivo
  vozEstudiante?: string
  createdAt: string
  updatedAt: string
}

// ---------- Rutas y herramientas (biblioteca inicial, tabla 18) ----------

export interface Ruta {
  id: string
  nombre: string
  dimensiones: DimensionId[]
  herramientas: string[]
}

// ---------- Evaluación: screenings y tests subidos (previo al plan) ----------

export type StoredFileTipo = 'screening' | 'test' | 'otro'

export interface StoredFile {
  id: string
  studentId: string
  nombre: string
  mimeType: string
  tamano: number // bytes
  dataUrl?: string // sin valor = pesaba más del máximo local; se guarda solo la referencia
  descripcion?: string
  tipo: StoredFileTipo
  createdAt: string
  updatedAt: string
}

// ---------- Sesiones y agenda (gestión de consultorio, no forman parte
// del Documento Maestro clínico — se agregan para paridad de práctica con
// Método Brújula) ----------

export type SessionStatus = 'programada' | 'realizada' | 'cancelada'
export type SessionMode = 'presencial' | 'virtual'

export interface Session {
  id: string
  studentId: string
  fecha: string // ISO datetime
  duracionMin: number
  modalidad: SessionMode
  estado: SessionStatus
  titulo: string
  notas: string
  proximosPasos?: string
  /** Honorario de la sesión. Sin valor = no se registró monto. */
  monto?: number
  /** Sin valor = no se registró monto, tampoco aplica estado de cobro. */
  cobrado?: boolean
  createdAt: string
  updatedAt: string
}

export interface CalendarEvent {
  id: string
  fecha: string // ISO datetime
  titulo: string
  tipo: 'sesion' | 'tarea' | 'recordatorio'
  studentId?: string
  sessionId?: string
  notas?: string
  completado?: boolean
  createdAt: string
  updatedAt: string
}
