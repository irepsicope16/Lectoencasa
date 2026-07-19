import { LocalStorageDriver } from './driver'
import { Repository } from './repository'
import { SupabaseRepository } from './supabaseRepository'
import { isCloudEnabled } from '@/services/cloud/config'
import type {
  Activity,
  ActivityLogEntry,
  AssignedVideo,
  CalendarEvent,
  CompassSnapshot,
  Consultant,
  Evaluation,
  ModuleProgress,
  Observation,
  Reflection,
  Session,
  StoredFile,
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
  consultants: repo<Consultant>('consultants'),
  sessions: repo<Session>('sessions'),
  observations: repo<Observation>('observations'),
  moduleProgress: repo<ModuleProgress>('module_progress'),
  activities: repo<Activity>('activities'),
  videos: repo<AssignedVideo>('assigned_videos'),
  files: repo<StoredFile>('files'),
  reflections: repo<Reflection>('reflections'),
  evaluations: repo<Evaluation>('evaluations'),
  snapshots: repo<CompassSnapshot>('compass_snapshots'),
  events: repo<CalendarEvent>('calendar_events'),
  log: repo<ActivityLogEntry>('activity_log'),
  clearAll: () => driver.clearAll(),
}

/**
 * Borrado en cascada: elimina al consultante y TODO su rastro
 * (sesiones, actividades, progreso, archivos, snapshots, cuenta de acceso…).
 * Equivalente del ON DELETE CASCADE del esquema Supabase objetivo.
 */
export async function deleteConsultantCascade(consultantId: string): Promise<void> {
  const collections = [
    db.sessions,
    db.observations,
    db.moduleProgress,
    db.activities,
    db.videos,
    db.files,
    db.reflections,
    db.evaluations,
    db.snapshots,
    db.events,
    db.log,
  ] as const
  for (const repo of collections) {
    const rows = (await repo.list()) as { id: string; consultantId?: string }[]
    for (const row of rows) {
      if (row.consultantId === consultantId) await repo.remove(row.id)
    }
  }
  const users = await db.users.list()
  for (const u of users) {
    if (u.consultantId === consultantId) await db.users.remove(u.id)
  }
  await db.consultants.remove(consultantId)
}

export async function logActivity(
  entry: Omit<ActivityLogEntry, 'id' | 'createdAt' | 'updatedAt' | 'fecha'> & { fecha?: string },
) {
  await db.log.create({ ...entry, fecha: entry.fecha ?? new Date().toISOString() })
}
