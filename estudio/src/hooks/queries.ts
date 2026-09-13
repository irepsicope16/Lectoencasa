import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { db, deleteStudentCascade } from '@/services/storage/db'
import type {
  Alert,
  CalendarEvent,
  DimensionSnapshot,
  Goal,
  Intake,
  OpenAnswer,
  PriorityDecision,
  QuestionnaireResponse,
  Session,
  Student,
} from '@/types'

// ---------- Estudiantes ----------

export function useStudents(professionalId?: string) {
  return useQuery({
    queryKey: ['students', professionalId],
    queryFn: async () => {
      const all = await db.students.list()
      return all
        .filter((s) => !professionalId || s.professionalId === professionalId)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    },
  })
}

export function useStudent(id?: string) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => db.students.get(id!),
    enabled: !!id,
  })
}

export function useCreateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => db.students.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })
}

export function useUpdateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Student> }) => db.students.update(id, patch),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['students'] })
      qc.invalidateQueries({ queryKey: ['student', vars.id] })
    },
  })
}

export function useDeleteStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteStudentCascade(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })
}

// ---------- Entrevista ----------

export function useIntake(studentId?: string) {
  return useQuery({
    queryKey: ['intake', studentId],
    queryFn: async () => {
      const rows = await db.intakes.query((i) => i.studentId === studentId)
      return rows[0] as Intake | undefined
    },
    enabled: !!studentId,
  })
}

export function useSaveIntake() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ studentId, existingId, data }: { studentId: string; existingId?: string; data: Omit<Intake, 'id' | 'studentId' | 'createdAt' | 'updatedAt'> }) => {
      if (existingId) return db.intakes.update(existingId, data)
      return db.intakes.create({ studentId, ...data })
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ['intake', vars.studentId] }),
  })
}

// ---------- Autoperfil ----------

export function useResponses(studentId?: string) {
  return useQuery({
    queryKey: ['responses', studentId],
    queryFn: () => db.responses.query((r) => r.studentId === studentId),
    enabled: !!studentId,
  })
}

export function useSaveResponse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { studentId: string; versionId: string; itemId: string; valor: 0 | 1 | 2 | 3 | null; comentario?: string; existingId?: string }) => {
      const { existingId, ...data } = input
      if (existingId) return db.responses.update(existingId, { ...data, fecha: new Date().toISOString() })
      return db.responses.create({ ...data, fecha: new Date().toISOString() })
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ['responses', vars.studentId] }),
  })
}

export function useOpenAnswers(studentId?: string) {
  return useQuery({
    queryKey: ['openAnswers', studentId],
    queryFn: () => db.openAnswers.query((a) => a.studentId === studentId),
    enabled: !!studentId,
  })
}

export function useSaveOpenAnswer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { studentId: string; preguntaId: string; texto: string; existingId?: string }) => {
      const { existingId, ...data } = input
      if (existingId) return db.openAnswers.update(existingId, data)
      return db.openAnswers.create(data)
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ['openAnswers', vars.studentId] }),
  })
}

// ---------- Integración ----------

export function useSnapshots(studentId?: string) {
  return useQuery({
    queryKey: ['snapshots', studentId],
    queryFn: async () => {
      const rows = await db.snapshots.query((s) => s.studentId === studentId)
      return rows.sort((a, b) => a.dimension.localeCompare(b.dimension))
    },
    enabled: !!studentId,
  })
}

export function useSaveSnapshot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<DimensionSnapshot, 'id' | 'createdAt' | 'updatedAt'> & { existingId?: string }) => {
      const { existingId, ...data } = input
      if (existingId) return db.snapshots.update(existingId, data)
      return db.snapshots.create(data)
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ['snapshots', vars.studentId] }),
  })
}

export function useAlerts(studentId?: string) {
  return useQuery({
    queryKey: ['alerts', studentId],
    queryFn: () => db.alerts.query((a) => a.studentId === studentId),
    enabled: !!studentId,
  })
}

export function useCreateAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>) => db.alerts.create(data),
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ['alerts', vars.studentId] }),
  })
}

export function useResolveAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, decisionProfesional }: { id: string; decisionProfesional: string; studentId: string }) =>
      db.alerts.update(id, { estado: 'resuelta', decisionProfesional }),
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ['alerts', vars.studentId] }),
  })
}

// ---------- Prioridades ----------

export function usePriorities(studentId?: string) {
  return useQuery({
    queryKey: ['priorities', studentId],
    queryFn: async () => {
      const rows = await db.priorities.query((p) => p.studentId === studentId)
      return rows.sort((a, b) => b.puntaje - a.puntaje)
    },
    enabled: !!studentId,
  })
}

export function useSavePriority() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<PriorityDecision, 'id' | 'createdAt' | 'updatedAt'> & { existingId?: string }) => {
      const { existingId, ...data } = input
      if (existingId) return db.priorities.update(existingId, data)
      return db.priorities.create(data)
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ['priorities', vars.studentId] }),
  })
}

// ---------- Plan ----------

export function useGoals(studentId?: string) {
  return useQuery({
    queryKey: ['goals', studentId],
    queryFn: () => db.goals.query((g) => g.studentId === studentId),
    enabled: !!studentId,
  })
}

export function useCreateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => db.goals.create(data),
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ['goals', vars.studentId] }),
  })
}

export function useUpdateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Goal> }) => db.goals.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })
}

// ---------- Sesiones ----------

export function useSessions(studentId?: string) {
  return useQuery({
    queryKey: ['sessions', studentId],
    queryFn: async () => {
      const rows = await db.sessions.query((s) => s.studentId === studentId)
      return rows.sort((a, b) => b.fecha.localeCompare(a.fecha))
    },
    enabled: !!studentId,
  })
}

/** Todas las sesiones de los estudiantes de esta profesional (para la Agenda). */
export function useAllSessions(professionalId?: string) {
  return useQuery({
    queryKey: ['all-sessions', professionalId],
    queryFn: async () => {
      const students = await db.students.query((s) => s.professionalId === professionalId)
      const ids = new Set(students.map((s) => s.id))
      const rows = await db.sessions.list()
      return rows.filter((s) => ids.has(s.studentId))
    },
    enabled: !!professionalId,
  })
}

export function useCreateSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => db.sessions.create(data),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['sessions', vars.studentId] })
      qc.invalidateQueries({ queryKey: ['all-sessions'] })
    },
  })
}

export function useUpdateSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Session> }) => db.sessions.update(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions'] })
      qc.invalidateQueries({ queryKey: ['all-sessions'] })
    },
  })
}

// ---------- Agenda (eventos: sesión, tarea, recordatorio) ----------

export function useEvents(professionalId?: string) {
  return useQuery({
    queryKey: ['events', professionalId],
    queryFn: () => db.events.list(),
    enabled: !!professionalId,
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => db.events.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<CalendarEvent> }) => db.events.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => db.events.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })
}
