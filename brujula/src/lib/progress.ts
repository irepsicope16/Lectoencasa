import type { Activity, ModuleProgress } from '@/types'
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
