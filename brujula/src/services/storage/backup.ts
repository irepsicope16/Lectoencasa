import { db } from './db'
import { isCloudEnabled } from '@/services/cloud/config'

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

export interface PreparedBackup {
  url: string
  filename: string
}

// En modo nube, armar el backup implica varias consultas de red seguidas
// (una por colección). Si además disparáramos la descarga automáticamente
// al terminar, el navegador puede considerar que ya pasó demasiado tiempo
// desde el click original y bloquearla en silencio (sin error ni aviso).
// Por eso separamos "preparar" (async, puede tardar) de "descargar"
// (un <a href download> real que el usuario clickea, sin JS de por medio).
export async function prepareBackup(): Promise<PreparedBackup> {
  const data = {} as BackupFile['data']
  for (const name of COLLECTIONS) {
    // En modo nube el login lo maneja Supabase Auth: no existe una tabla
    // 'users' propia, así que esa colección no aplica (evita abortar todo
    // el export por una tabla que nunca debió consultarse).
    if (name === 'users' && isCloudEnabled()) {
      data[name] = []
      continue
    }
    data[name] = await (db[name] as { list: () => Promise<unknown[]> }).list()
  }
  const payload: BackupFile = {
    app: 'metodo-brujula',
    version: BACKUP_VERSION,
    exportadoEl: new Date().toISOString(),
    data,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  return {
    url: URL.createObjectURL(blob),
    filename: `metodo-brujula-backup-${new Date().toISOString().slice(0, 10)}.json`,
  }
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
