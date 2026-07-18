import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { db, logActivity } from '@/services/storage/db'
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
} from '@/types'

// ------------------------------------------------------------
// Hooks de datos: única puerta de la UI hacia los repositorios.
// Claves de query por colección → invalidación simple y total
// por colección (suficiente para el volumen de un estudio).
// ------------------------------------------------------------

export const keys = {
  consultants: ['consultants'] as const,
  sessions: ['sessions'] as const,
  observations: ['observations'] as const,
  moduleProgress: ['moduleProgress'] as const,
  activities: ['activities'] as const,
  videos: ['videos'] as const,
  files: ['files'] as const,
  reflections: ['reflections'] as const,
  evaluations: ['evaluations'] as const,
  snapshots: ['snapshots'] as const,
  events: ['events'] as const,
  log: ['log'] as const,
}

function useCollection<T>(key: readonly string[], fetcher: () => Promise<T[]>) {
  return useQuery({ queryKey: key, queryFn: fetcher })
}

export const useConsultants = () => useCollection<Consultant>(keys.consultants, () => db.consultants.list())
export const useSessions = () => useCollection<Session>(keys.sessions, () => db.sessions.list())
export const useObservations = () => useCollection<Observation>(keys.observations, () => db.observations.list())
export const useModuleProgress = () => useCollection<ModuleProgress>(keys.moduleProgress, () => db.moduleProgress.list())
export const useActivities = () => useCollection<Activity>(keys.activities, () => db.activities.list())
export const useVideos = () => useCollection<AssignedVideo>(keys.videos, () => db.videos.list())
export const useFiles = () => useCollection<StoredFile>(keys.files, () => db.files.list())
export const useReflections = () => useCollection<Reflection>(keys.reflections, () => db.reflections.list())
export const useEvaluations = () => useCollection<Evaluation>(keys.evaluations, () => db.evaluations.list())
export const useSnapshots = () => useCollection<CompassSnapshot>(keys.snapshots, () => db.snapshots.list())
export const useEvents = () => useCollection<CalendarEvent>(keys.events, () => db.events.list())
export const useActivityLog = () => useCollection<ActivityLogEntry>(keys.log, () => db.log.list())

export function useConsultant(id: string | undefined) {
  return useQuery({
    queryKey: [...keys.consultants, id],
    queryFn: () => db.consultants.get(id!),
    enabled: !!id,
  })
}

// ---------- mutaciones genéricas ----------

type RepoName = keyof typeof keys

const repoByName = {
  consultants: db.consultants,
  sessions: db.sessions,
  observations: db.observations,
  moduleProgress: db.moduleProgress,
  activities: db.activities,
  videos: db.videos,
  files: db.files,
  reflections: db.reflections,
  evaluations: db.evaluations,
  snapshots: db.snapshots,
  events: db.events,
  log: db.log,
} as const

export function useCreate<T extends { id: string }>(repo: RepoName, log?: (row: T) => Omit<ActivityLogEntry, 'id' | 'createdAt' | 'updatedAt' | 'fecha'>) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<T>) => {
      const row = (await (repoByName[repo] as any).create(data)) as T
      if (log) await logActivity(log(row))
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys[repo] })
      if (log) qc.invalidateQueries({ queryKey: keys.log })
    },
  })
}

export function useUpdate<T extends { id: string }>(repo: RepoName, log?: (row: T) => Omit<ActivityLogEntry, 'id' | 'createdAt' | 'updatedAt' | 'fecha'> | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<T> }) => {
      const row = (await (repoByName[repo] as any).update(id, patch)) as T
      if (log) {
        const entry = log(row)
        if (entry) await logActivity(entry)
      }
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys[repo] })
      if (log) qc.invalidateQueries({ queryKey: keys.log })
    },
  })
}

export function useRemove(repo: RepoName) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => repoByName[repo].remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys[repo] }),
  })
}
