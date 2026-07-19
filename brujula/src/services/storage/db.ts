import { LocalStorageDriver } from './driver'
import { Repository } from './repository'
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

// Punto único de acceso a datos. Migración a Supabase = cambiar el driver
// (y los repos por su variante remota) SOLO acá.
const driver = new LocalStorageDriver()

export const db = {
  users: new Repository<User>(driver, 'users'),
  consultants: new Repository<Consultant>(driver, 'consultants'),
  sessions: new Repository<Session>(driver, 'sessions'),
  observations: new Repository<Observation>(driver, 'observations'),
  moduleProgress: new Repository<ModuleProgress>(driver, 'module_progress'),
  activities: new Repository<Activity>(driver, 'activities'),
  videos: new Repository<AssignedVideo>(driver, 'assigned_videos'),
  files: new Repository<StoredFile>(driver, 'files'),
  reflections: new Repository<Reflection>(driver, 'reflections'),
  evaluations: new Repository<Evaluation>(driver, 'evaluations'),
  snapshots: new Repository<CompassSnapshot>(driver, 'compass_snapshots'),
  events: new Repository<CalendarEvent>(driver, 'calendar_events'),
  log: new Repository<ActivityLogEntry>(driver, 'activity_log'),
  clearAll: () => driver.clearAll(),
}

/**
 * Borrado en cascada: elimina al consultante y TODO su rastro
 * (sesiones, actividades, progreso, archivos, snapshots, cuenta de acceso…).
 * Equivalente local del ON DELETE CASCADE del esquema Supabase objetivo.
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
