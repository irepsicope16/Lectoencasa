import { db } from './db'

// Export/import de TODOS los datos como JSON versionado.
// Mientras la persistencia sea LocalStorage, esta es la copia de seguridad
// del estudio; con Supabase pasará a ser una exportación de cortesía.

const BACKUP_VERSION = 1

const COLLECTIONS = [
  'users',
  'consultants',
  'sessions',
  'observations',
  'moduleProgress',
  'activities',
  'videos',
  'files',
  'reflections',
  'evaluations',
  'snapshots',
  'events',
  'log',
] as const

type CollectionName = (typeof COLLECTIONS)[number]

interface BackupFile {
  app: 'metodo-brujula'
  version: number
  exportadoEl: string
  data: Record<CollectionName, unknown[]>
}

export async function exportBackup(): Promise<void> {
  const data = {} as BackupFile['data']
  for (const name of COLLECTIONS) {
    data[name] = await (db[name] as { list: () => Promise<unknown[]> }).list()
  }
  const payload: BackupFile = {
    app: 'metodo-brujula',
    version: BACKUP_VERSION,
    exportadoEl: new Date().toISOString(),
    data,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `metodo-brujula-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

export async function importBackup(file: File): Promise<{ ok: boolean; error?: string }> {
  try {
    const parsed = JSON.parse(await file.text()) as BackupFile
    if (parsed.app !== 'metodo-brujula' || !parsed.data) {
      return { ok: false, error: 'El archivo no es una copia de seguridad de Método Brújula.' }
    }
    if (parsed.version > BACKUP_VERSION) {
      return { ok: false, error: 'La copia fue creada con una versión más nueva de la plataforma.' }
    }
    for (const name of COLLECTIONS) {
      const rows = parsed.data[name]
      if (Array.isArray(rows)) {
        localStorage.setItem(`mb:data:${dbCollectionKey(name)}`, JSON.stringify(rows))
      }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'No se pudo leer el archivo. ¿Es un JSON válido?' }
  }
}

// nombre de repo (camelCase) → clave de colección en storage
function dbCollectionKey(name: CollectionName): string {
  return (db[name] as { collection: string }).collection
}
