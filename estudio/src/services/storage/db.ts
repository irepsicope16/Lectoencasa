import { LocalStorageDriver } from './driver'
import { Repository } from './repository'
import { SupabaseRepository } from './supabaseRepository'
import { isCloudEnabled } from '@/services/cloud/config'
import type {
  ActividadAsignada,
  Alert,
  CalendarEvent,
  DimensionSnapshot,
  Goal,
  Intake,
  OpenAnswer,
  PriorityDecision,
  QuestionnaireResponse,
  Session,
  StoredFile,
  Student,
  User,
} from '@/types'

// ------------------------------------------------------------
// Punto único de acceso a datos.
// Modo local  → LocalStorage (por defecto, sin configuración).
// Modo nube   → Supabase (activado desde Ajustes → Nube).
// Ambos repos implementan la MISMA API: la UI no distingue.
// ------------------------------------------------------------

interface BaseRow {
  id: string
  createdAt: string
  updatedAt: string
}

/** Contrato común de repositorio (local y remoto). */
export interface DataRepository<T extends BaseRow> {
  readonly collection: string
  list(): Promise<T[]>
  get(id: string): Promise<T | undefined>
  query(predicate: (row: T) => boolean): Promise<T[]>
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<BaseRow>): Promise<T>
  update(id: string, patch: Partial<T>): Promise<T>
  remove(id: string): Promise<void>
  bulkCreate(items: T[]): Promise<void>
}

const cloud = isCloudEnabled()
const driver = new LocalStorageDriver()

function repo<T extends BaseRow>(collection: string): DataRepository<T> {
  return cloud ? new SupabaseRepository<T>(collection) : new Repository<T>(driver, collection)
}

export const db = {
  users: repo<User>('users'),
  students: repo<Student>('students'),
  intakes: repo<Intake>('intakes'),
  responses: repo<QuestionnaireResponse>('questionnaire_responses'),
  openAnswers: repo<OpenAnswer>('open_answers'),
  snapshots: repo<DimensionSnapshot>('dimension_snapshots'),
  alerts: repo<Alert>('alerts'),
  priorities: repo<PriorityDecision>('priority_decisions'),
  goals: repo<Goal>('goals'),
  sessions: repo<Session>('sessions'),
  events: repo<CalendarEvent>('calendar_events'),
  files: repo<StoredFile>('files'),
  asignaciones: repo<ActividadAsignada>('asignaciones'),
  clearAll: () => driver.clearAll(),
}

/** Borrado en cascada: elimina al estudiante y todo su rastro (incluida su cuenta de acceso). */
export async function deleteStudentCascade(studentId: string): Promise<void> {
  const collections = [
    db.intakes,
    db.responses,
    db.openAnswers,
    db.snapshots,
    db.alerts,
    db.priorities,
    db.goals,
    db.sessions,
    db.events,
    db.files,
    db.asignaciones,
  ] as const
  for (const repo of collections) {
    const rows = (await repo.list()) as { id: string; studentId?: string }[]
    for (const row of rows) {
      if (row.studentId === studentId) await repo.remove(row.id)
    }
  }
  const users = await db.users.list()
  for (const u of users) {
    if (u.studentId === studentId) await db.users.remove(u.id)
  }
  await db.students.remove(studentId)
}
