import { LocalStorageDriver } from './driver'
import { Repository } from './repository'
import type {
  Alert,
  DimensionSnapshot,
  Goal,
  Intake,
  OpenAnswer,
  PriorityDecision,
  Professional,
  QuestionnaireResponse,
  Student,
} from '@/types'

// ------------------------------------------------------------
// Punto único de acceso a datos (LocalStorage hoy; misma API que
// tendría un repositorio remoto — ver services/storage/repository.ts).
// ------------------------------------------------------------

const driver = new LocalStorageDriver()

export const db = {
  professionals: new Repository<Professional>(driver, 'professionals'),
  students: new Repository<Student>(driver, 'students'),
  intakes: new Repository<Intake>(driver, 'intakes'),
  responses: new Repository<QuestionnaireResponse>(driver, 'questionnaire_responses'),
  openAnswers: new Repository<OpenAnswer>(driver, 'open_answers'),
  snapshots: new Repository<DimensionSnapshot>(driver, 'dimension_snapshots'),
  alerts: new Repository<Alert>(driver, 'alerts'),
  priorities: new Repository<PriorityDecision>(driver, 'priority_decisions'),
  goals: new Repository<Goal>(driver, 'goals'),
  clearAll: () => driver.clearAll(),
}

/** Borrado en cascada: elimina al estudiante y todo su rastro. */
export async function deleteStudentCascade(studentId: string): Promise<void> {
  const collections = [db.intakes, db.responses, db.openAnswers, db.snapshots, db.alerts, db.priorities, db.goals] as const
  for (const repo of collections) {
    const rows = (await repo.list()) as { id: string; studentId?: string }[]
    for (const row of rows) {
      if (row.studentId === studentId) await repo.remove(row.id)
    }
  }
  await db.students.remove(studentId)
}
