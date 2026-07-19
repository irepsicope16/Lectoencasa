import { LocalStorageDriver } from '@/services/storage/driver'
import { SupabaseRepository } from '@/services/storage/supabaseRepository'

// Migración de datos: sube TODO lo guardado localmente a la nube (upsert por id,
// re-ejecutable sin duplicar). Se usa una única vez al activar el modo nube.

const COLLECTIONS = [
  'consultants',
  'sessions',
  'observations',
  'module_progress',
  'activities',
  'assigned_videos',
  'files',
  'reflections',
  'evaluations',
  'compass_snapshots',
  'calendar_events',
  'activity_log',
]

export async function migrateLocalToCloud(
  onProgress?: (msg: string) => void,
): Promise<{ ok: boolean; subidos: number; error?: string }> {
  const driver = new LocalStorageDriver()
  let subidos = 0
  try {
    for (const name of COLLECTIONS) {
      const rows = await driver.read<{ id: string; createdAt: string; updatedAt: string }>(name)
      if (!rows.length) continue
      onProgress?.(`Subiendo ${name} (${rows.length})…`)
      const repo = new SupabaseRepository<{ id: string; createdAt: string; updatedAt: string }>(name)
      await repo.bulkCreate(rows)
      subidos += rows.length
    }
    return { ok: true, subidos }
  } catch (e) {
    return { ok: false, subidos, error: e instanceof Error ? e.message : 'Error desconocido' }
  }
}
