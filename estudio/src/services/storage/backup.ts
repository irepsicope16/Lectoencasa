import { db } from './db'

// Export/import de todos los datos como JSON versionado. Mientras la
// persistencia sea LocalStorage, esta es la copia de seguridad del estudio.

const BACKUP_VERSION = 1

const COLLECTIONS = [
  'users',
  'students',
  'intakes',
  'responses',
  'openAnswers',
  'snapshots',
  'alerts',
  'priorities',
  'goals',
  'sessions',
  'events',
  'files',
] as const

type CollectionName = (typeof COLLECTIONS)[number]

interface BackupFile {
  app: 'metodo-estudio'
  version: number
  exportadoEl: string
  data: Record<CollectionName, unknown[]>
}

export interface PreparedBackup {
  url: string
  filename: string
}

export async function prepareBackup(): Promise<PreparedBackup> {
  const data = {} as BackupFile['data']
  for (const name of COLLECTIONS) {
    data[name] = await db[name].list()
  }
  const payload: BackupFile = {
    app: 'metodo-estudio',
    version: BACKUP_VERSION,
    exportadoEl: new Date().toISOString(),
    data,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  return {
    url: URL.createObjectURL(blob),
    filename: `metodo-estudio-backup-${new Date().toISOString().slice(0, 10)}.json`,
  }
}

export async function importBackup(file: File): Promise<{ ok: boolean; error?: string }> {
  try {
    const parsed = JSON.parse(await file.text()) as BackupFile
    if (parsed.app !== 'metodo-estudio' || !parsed.data) {
      return { ok: false, error: 'El archivo no es una copia de seguridad de Método Estudio.' }
    }
    if (parsed.version > BACKUP_VERSION) {
      return { ok: false, error: 'La copia fue creada con una versión más nueva de la plataforma.' }
    }
    for (const name of COLLECTIONS) {
      const rows = parsed.data[name]
      if (Array.isArray(rows)) {
        localStorage.setItem(`me:data:${db[name].collection}`, JSON.stringify(rows))
      }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'No se pudo leer el archivo. ¿Es un JSON válido?' }
  }
}
