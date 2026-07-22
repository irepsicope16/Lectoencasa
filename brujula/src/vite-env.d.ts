/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Credenciales de Supabase horneadas en el build de producción (opcional). */
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
