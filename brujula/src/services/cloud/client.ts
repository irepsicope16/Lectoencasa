import type { SupabaseClient } from '@supabase/supabase-js'
import { getCloudConfig } from './config'

// Cliente Supabase con carga diferida: el SDK solo se descarga
// cuando el modo nube está activo (cero costo en modo local).

let client: SupabaseClient | null = null

export async function getSupabase(): Promise<SupabaseClient> {
  if (client) return client
  const { createClient } = await import('@supabase/supabase-js')
  const cfg = getCloudConfig()
  client = createClient(cfg.url, cfg.anonKey, {
    // flowType 'implicit': el link de recuperación de contraseña trae un
    // "?token=..." plano, verificable del lado del cliente con verifyOtp()
    // sin necesidad de visitar el link (alguien lo copia y lo pega en la
    // app). Con 'pkce' (el default del SDK) el token viene prefijado
    // "pkce_..." y solo es válido si el link se abre en el navegador —
    // eso rompe el flujo de "copiar el link, no hacer clic".
    auth: { persistSession: true, storageKey: 'mb:cloud-auth', flowType: 'implicit' },
  })
  return client
}

/**
 * Cliente aislado (sin persistir sesión): se usa para registrar la cuenta de un
 * consultante sin pisar la sesión activa de la profesional.
 */
export async function getIsolatedClient(): Promise<SupabaseClient> {
  const { createClient } = await import('@supabase/supabase-js')
  const cfg = getCloudConfig()
  return createClient(cfg.url, cfg.anonKey, { auth: { persistSession: false } })
}

/** Prueba la conexión con las credenciales dadas (sin guardarlas todavía). */
export async function testCloudConnection(url: string, anonKey: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/auth/v1/health`, {
      headers: { apikey: anonKey },
    })
    if (!res.ok) return { ok: false, error: `El servidor respondió ${res.status}. Revisá la URL y la clave.` }
    return { ok: true }
  } catch {
    return { ok: false, error: 'No se pudo conectar. Revisá la URL del proyecto.' }
  }
}
