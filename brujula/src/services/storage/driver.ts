// StorageDriver: contrato mínimo de persistencia por colección.
// Hoy LocalStorage; mañana Supabase (mismo contrato, otra implementación).

export interface StorageDriver {
  read<T>(collection: string): Promise<T[]>
  write<T>(collection: string, rows: T[]): Promise<void>
  clearAll(): Promise<void>
}

const PREFIX = 'mb:data:'

export class LocalStorageDriver implements StorageDriver {
  async read<T>(collection: string): Promise<T[]> {
    try {
      const raw = localStorage.getItem(PREFIX + collection)
      return raw ? (JSON.parse(raw) as T[]) : []
    } catch {
      return []
    }
  }

  async write<T>(collection: string, rows: T[]): Promise<void> {
    localStorage.setItem(PREFIX + collection, JSON.stringify(rows))
  }

  async clearAll(): Promise<void> {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('mb:')) keys.push(k)
    }
    keys.forEach((k) => localStorage.removeItem(k))
  }
}
