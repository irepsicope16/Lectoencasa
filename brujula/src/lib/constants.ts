import type {
  ActivityKind,
  ActivityStatus,
  AffinityTier,
  ConsultantStatus,
  EngineDimension,
  ModuleProgressStatus,
  Mood,
  SessionStatus,
  StageId,
} from '@/types'

export const APP_NAME = 'Método Brújula'
export const APP_TAGLINE = 'Encontrá tu norte. Construí tu camino.'
export const BRAND = 'Psicope con Ire'

export const STAGES: Record<StageId, { nombre: string; descripcion: string; orden: number }> = {
  conocerte: { nombre: 'Conocerte', descripcion: 'Tu historia, tu identidad', orden: 1 },
  valorarte: { nombre: 'Valorarte', descripcion: 'Valores, deseos y mandatos', orden: 2 },
  explorar: { nombre: 'Explorar', descripcion: 'Fortalezas, intereses y mundo', orden: 3 },
  decidir: { nombre: 'Decidir', descripcion: 'Proyecto de vida y carreras', orden: 4 },
  actuar: { nombre: 'Actuar', descripcion: 'Plan de acción concreto', orden: 5 },
}

export const CONSULTANT_STATUS: Record<ConsultantStatus, { label: string; tone: string }> = {
  entrevista_inicial: { label: 'Entrevista inicial', tone: 'lavanda' },
  en_proceso: { label: 'En proceso', tone: 'aqua' },
  en_pausa: { label: 'En pausa', tone: 'amber' },
  finalizado: { label: 'Finalizado', tone: 'gris' },
}

export const SESSION_STATUS: Record<SessionStatus, string> = {
  programada: 'Programada',
  realizada: 'Realizada',
  cancelada: 'Cancelada',
}

export const ACTIVITY_STATUS: Record<ActivityStatus, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
  revisada: 'Revisada',
}

export const ACTIVITY_KIND: Record<ActivityKind, string> = {
  ejercicio: 'Ejercicio',
  reflexion: 'Reflexión',
  collage: 'Collage / creativo',
  entrevista: 'Entrevista',
  investigacion: 'Investigación',
  video: 'Video',
  lectura: 'Lectura',
}

export const MODULE_PROGRESS_STATUS: Record<ModuleProgressStatus, string> = {
  no_iniciado: 'No iniciado',
  en_progreso: 'En progreso',
  completado: 'Completado',
}

export const MOODS: Record<Mood, { label: string; emoji: string }> = {
  entusiasmo: { label: 'Con entusiasmo', emoji: '✨' },
  calma: { label: 'En calma', emoji: '🌿' },
  duda: { label: 'Con dudas', emoji: '🤔' },
  ansiedad: { label: 'Con ansiedad', emoji: '🌀' },
  confusion: { label: 'Confusión', emoji: '🌫️' },
}

export const DIMENSION_LABELS: Record<EngineDimension, string> = {
  historia: 'Historia personal',
  identidad: 'Identidad',
  valores: 'Valores',
  deseos: 'Deseos propios',
  mandatos: 'Mandatos',
  fortalezas: 'Fortalezas',
  intereses: 'Intereses',
  aptitudes: 'Aptitudes',
  exploracion: 'Exploración',
}

export const AFFINITY_TIER: Record<AffinityTier, { label: string; descripcion: string }> = {
  brujula_firme: {
    label: 'Brújula firme',
    descripcion: 'La evidencia del proceso apunta con claridad hacia esta área.',
  },
  rumbo_posible: {
    label: 'Rumbo posible',
    descripcion: 'Hay señales consistentes que vale la pena profundizar.',
  },
  para_explorar: {
    label: 'Para explorar',
    descripcion: 'Aparecen indicios aislados: conviene explorar antes de decidir.',
  },
}
