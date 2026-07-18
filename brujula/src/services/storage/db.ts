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

export async function logActivity(
  entry: Omit<ActivityLogEntry, 'id' | 'createdAt' | 'updatedAt' | 'fecha'> & { fecha?: string },
) {
  await db.log.create({ ...entry, fecha: entry.fecha ?? new Date().toISOString() })
}
