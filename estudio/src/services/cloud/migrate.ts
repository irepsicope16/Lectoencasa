import { LocalStorageDriver } from '@/services/storage/driver'
import { SupabaseRepository } from '@/services/storage/supabaseRepository'
import { getSupabase } from '@/services/cloud/client'

// Migración de datos: sube TODO lo guardado localmente a la nube (upsert por id,
// re-ejecutable sin duplicar). Se usa una única vez al activar el modo nube.

const COLLECTIONS = [
  'students',
  'intakes',
  'questionnaire_responses',
  'open_answers',
  'dimension_snapshots',
  'alerts',
  'priority_decisions',
  'goals',
  'sessions',
  'calendar_events',
  'files',
  'asignaciones',
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
      const rows = await driver.read<{ id: string; createdAt: string; updatedAt: string; professionalId?: string }>(name)
      if (!rows.length) continue
      // Los estudiantes migrados pasan a ser dueños de la cuenta que está
      // migrando (su professionalId local no significa nada en la nube).
      const toUpload = name === 'students' ? rows.map((r) => ({ ...r, professionalId: user.id })) : rows
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
