// Configuración del modo nube (Supabase).
// Si no hay configuración activa, la plataforma funciona 100% local
// (LocalStorage), exactamente igual que antes.

export interface CloudConfig {
  url: string
  anonKey: string
  enabled: boolean
}

const KEY = 'mb:cloud'

export function getCloudConfig(): CloudConfig {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* noop */
  }
  return { url: '', anonKey: '', enabled: false }
}

export function saveCloudConfig(cfg: CloudConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg))
}

export function isCloudEnabled(): boolean {
  const c = getCloudConfig()
  return c.enabled && !!c.url && !!c.anonKey
}
