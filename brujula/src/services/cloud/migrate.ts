import { LocalStorageDriver } from '@/services/storage/driver'
import { SupabaseRepository } from '@/services/storage/supabaseRepository'
import { getSupabase } from '@/services/cloud/client'

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
  const sb = await getSupabase()
  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) {
    return {
      ok: false,
      subidos: 0,
      error: 'No hay una sesión profesional activa en la nube. Cerrá sesión e ingresá con tu cuenta profesional de la nube (no la local) antes de migrar.',
    }
  }

  const driver = new LocalStorageDriver()
  let subidos = 0
  try {
    for (const name of COLLECTIONS) {
      const rows = await driver.read<{ id: string; createdAt: string; updatedAt: string; profesionalId?: string }>(name)
      if (!rows.length) continue
      // Los consultantes migrados pasan a ser dueños de la cuenta que está
      // migrando (su profesionalId local no significa nada en la nube).
      const toUpload = name === 'consultants' ? rows.map((r) => ({ ...r, profesionalId: user.id })) : rows
      onProgress?.(`Subiendo ${name} (${toUpload.length})…`)
      const repo = new SupabaseRepository<{ id: string; createdAt: string; updatedAt: string }>(name)
      await repo.bulkCreate(toUpload)
      subidos += toUpload.length
    }
    return { ok: true, subidos }
  } catch (e) {
    return { ok: false, subidos, error: e instanceof Error ? e.message : 'Error desconocido' }
  }
}
