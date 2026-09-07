import type { Activity, Consultant, ConsultantStatus, ModuleProgress, StageId } from '@/types'
import { MODULES } from '@/data/modules'
import { STAGES } from '@/lib/constants'

/**
 * Progreso global del proceso (0..100) para un consultante:
 * promedio del estado de los 12 módulos (completado=1, en progreso=0.5).
 * Es una guía visual del recorrido, no una medida psicométrica.
 */
export function overallProgress(progress: ModuleProgress[], consultantId: string): number {
  const own = progress.filter((p) => p.consultantId === consultantId)
  if (!MODULES.length) return 0
  let sum = 0
  for (const mod of MODULES) {
    const p = own.find((x) => x.moduleId === mod.id)
    if (!p) continue
    if (p.estado === 'completado') sum += 1
    else if (p.estado === 'en_progreso') sum += 0.5
  }
  return Math.round((sum / MODULES.length) * 100)
}

/**
 * Estado a mostrar para un consultante: "En pausa" y "Finalizado" son
 * siempre una decisión de la profesional y se respetan tal cual están
 * cargados en la ficha. "Entrevista inicial" y "En proceso" en cambio se
 * calculan solos a partir del avance real (% de módulos), para que no
 * queden fichas mostrando "Entrevista inicial" para siempre solo porque
 * nadie volvió a tocar ese campo.
 */
export function effectiveEstado(consultant: Consultant, progress: ModuleProgress[]): ConsultantStatus {
  if (consultant.estado === 'en_pausa' || consultant.estado === 'finalizado') return consultant.estado
  return overallProgress(progress, consultant.id) > 0 ? 'en_proceso' : 'entrevista_inicial'
}

export type StageProgressStatus = 'completado' | 'en_progreso' | 'pendiente'

/**
 * Estado de cada una de las 5 etapas del método para un consultante:
 * "completado" si terminó todos los módulos de esa etapa, "en_progreso"
 * si arrancó alguno sin terminarlos todos, "pendiente" si no tocó ninguno.
 * Es la base del indicador visual de recorrido (StageStepper).
 */
export function stageProgress(
  progress: ModuleProgress[],
  consultantId: string,
): Record<StageId, StageProgressStatus> {
  const own = progress.filter((p) => p.consultantId === consultantId)
  const result = {} as Record<StageId, StageProgressStatus>
  for (const stageId of Object.keys(STAGES) as StageId[]) {
    const estados = MODULES.filter((m) => m.etapa === stageId).map(
      (m) => own.find((p) => p.moduleId === m.id)?.estado ?? 'no_iniciado',
    )
    if (estados.length > 0 && estados.every((e) => e === 'completado')) result[stageId] = 'completado'
    else if (estados.some((e) => e === 'completado' || e === 'en_progreso')) result[stageId] = 'en_progreso'
    else result[stageId] = 'pendiente'
  }
  return result
}

export function moduleActivityStats(activities: Activity[], consultantId: string, moduleId: string) {
  const own = activities.filter((a) => a.consultantId === consultantId && a.moduleId === moduleId)
  const done = own.filter((a) => a.estado === 'completada' || a.estado === 'revisada')
  return { total: own.length, done: done.length }
}

export function pendingActivities(activities: Activity[], consultantId: string): Activity[] {
  return activities.filter(
    (a) => a.consultantId === consultantId && (a.estado === 'pendiente' || a.estado === 'en_progreso'),
  )
}
