// Configuración del modo nube (Supabase).
// Si no hay configuración activa, la plataforma funciona 100% local
// (LocalStorage), exactamente igual que antes.

export interface CloudConfig {
  url: string
  anonKey: string
  enabled: boolean
}

const KEY = 'mb:cloud'

// Credenciales de build (opcional): si el proyecto se compila con estas
// variables de entorno (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY), la
// nube queda activa por defecto para cualquier visitante — necesario para
// que una profesional nueva pueda registrarse sola desde /registro sin
// tener que tocar Ajustes primero. Si en algún navegador se guardó una
// configuración manual (aunque sea para desactivarla), esa tiene prioridad.
const ENV_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const ENV_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export function getCloudConfig(): CloudConfig {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* noop */
  }
  if (ENV_URL && ENV_ANON_KEY) {
    return { url: ENV_URL, anonKey: ENV_ANON_KEY, enabled: true }
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
