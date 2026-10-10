// ============================================================
// Método Estudio — Modelo de dominio (app de autoayuda, un solo usuario local)
// Basado en el Documento Maestro V1 (Lic. Irene Morbidelli, set. 2026),
// adaptado a uso individual: sin roles profesional/estudiante, sin cuentas.
// IDs uuid y timestamps ISO-8601.
// ============================================================

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
  versionId: string // p. ej. 'v1'
  itemId: string // código del ítem
  valor: 0 | 1 | 2 | 3 | null
  fecha: string
  createdAt: string
  updatedAt: string
}

export interface OpenAnswer {
  id: string
  preguntaId: string
  texto: string
  createdAt: string
  updatedAt: string
}

// ---------- Resultados por dimensión ----------

export type BandaNecesidad = 'baja' | 'leve' | 'moderada' | 'alta'

export interface DimensionSnapshot {
  id: string
  dimension: DimensionId
  versionId: string
  promedioNecesidad: number | null // null si completitud < 70%
  completitud: number // 0..1
  banda: BandaNecesidad | null
  generadoEl: string
  createdAt: string
  updatedAt: string
}

// ---------- Rutas y herramientas (biblioteca, tabla 18) ----------

export interface Ruta {
  id: string
  nombre: string
  dimensiones: DimensionId[]
  herramientas: string[]
}

// ---------- Actividades (catálogo por ruta/nivel + las que fue probando) ----------

export type NivelActividad = 1 | 2 | 3
export type EstadoActividad = 'pendiente' | 'en_curso' | 'completada'

/** Ficha del catálogo estático (`data/actividades.ts`), una por ruta/nivel. */
export interface ActividadCatalogo {
  id: string
  rutaId: string
  nivel: NivelActividad
  titulo: string
  descripcion: string
  fuente?: string // referencia interna de dónde se tomó la idea (no se muestra en la UI)
}

/**
 * Instancia que la persona eligió probar, nace de una ActividadCatalogo
 * (`actividadId`). Al completarla puede calificarla — esto arma su propio
 * "qué método le funcionó mejor".
 */
export interface ActividadProbada {
  id: string
  actividadId: string
  rutaId: string
  nivel: NivelActividad
  titulo: string
  descripcion: string
  estado: EstadoActividad
  fechaInicio: string
  fechaCompletada?: string
  calificacion?: 1 | 2 | 3 | 4 | 5
  nota?: string
  createdAt: string
  updatedAt: string
}

// ---------- Videos sugeridos por ruta (catálogo estático, `data/videos.ts`) ----------

export interface RecursoVideo {
  id: string
  rutaId: string
  titulo: string
  descripcion: string
  url: string
  duracion: string
}

// ---------- Cronómetro de estudio ----------

export type TecnicaCronometro = 'pomodoro' | 'libre'

export interface SesionEstudio {
  id: string
  tecnica: TecnicaCronometro
  duracionMin: number
  fecha: string
  createdAt: string
  updatedAt: string
}

// ---------- Mapas conceptuales ----------

export interface NodoMapa {
  id: string
  texto: string
  x: number
  y: number
  color?: string
}

export interface ConexionMapa {
  id: string
  desdeId: string
  hastaId: string
}

export interface MapaConceptual {
  id: string
  titulo: string
  nodos: NodoMapa[]
  conexiones: ConexionMapa[]
  createdAt: string
  updatedAt: string
}

// ---------- Fichas de repaso (flashcards, repetición espaciada tipo Leitner) ----------

/** Caja 1 (recién creada o fallada) a 5 (bien afianzada) — a más caja, más espacio entre repasos. */
export type CajaLeitner = 1 | 2 | 3 | 4 | 5

export interface Ficha {
  id: string
  tema: string
  pregunta: string
  respuesta: string
  vecesRepasada: number
  ultimoRepaso?: string
  caja: CajaLeitner
  proximoRepaso: string // ISO — hoy o antes = "para repasar hoy"
  createdAt: string
  updatedAt: string
}

// ---------- Diario de metacognición ----------

export interface EntradaMetacognicion {
  id: string
  fecha: string
  metodoUsado: string
  efectividad: 1 | 2 | 3 | 4 | 5
  queCambiaria?: string
  createdAt: string
  updatedAt: string
}
