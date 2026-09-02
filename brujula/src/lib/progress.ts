import type { Activity, Consultant, ConsultantStatus, ModuleProgress } from '@/types'
import { MODULES } from '@/data/modules'

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
