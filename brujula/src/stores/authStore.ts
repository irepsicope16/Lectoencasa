import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { db } from '@/services/storage/db'
import { isCloudEnabled } from '@/services/cloud/config'

type ProfileEditable = Pick<User, 'nombre' | 'apellido' | 'titulo' | 'matricula' | 'telefono'>

interface AuthState {
  user: User | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  updateProfile: (patch: Partial<ProfileEditable>) => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; error?: string }>
  confirmPasswordReset: (email: string, codeOrLink: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>
}

/**
 * La persona puede pegar el link completo del mail de recuperación (copiado
 * con el botón derecho, SIN hacer clic — clickear lo gasta), la URL a la
 * que terminó llegando si lo clickeó por error (con "?code=..." — ese
 * todavía no está gastado, solo se gasta cuando esta app lo usa), o el
 * código de 6 dígitos si el plan de Supabase tiene plantillas
 * personalizadas.
 */
function extractRecoveryToken(
  input: string,
): { code: string } | { token_hash: string } | { token: string } {
  const trimmed = input.trim()
  try {
    const url = new URL(trimmed)
    const code = url.searchParams.get('code')
    if (code) return { code }
    const hash = url.searchParams.get('token_hash') ?? url.searchParams.get('token')
    if (hash) return { token_hash: hash }
  } catch {
    /* no es una URL: se toma como código escrito a mano */
  }
  return { token: trimmed }
}

// Modo nube: autenticación real con Supabase Auth; el perfil (rol, nombre,
// consultantId) vive en la tabla `profiles`, creada por trigger al registrarse.
async function cloudLogin(email: string, password: string): Promise<{ ok: boolean; error?: string; user?: User }> {
  const { getSupabase } = await import('@/services/cloud/client')
  const sb = await getSupabase()
  const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password })
  if (error) {
    const msg = /confirm/i.test(error.message)
      ? 'La cuenta aún no está confirmada. En Supabase, desactivá «Confirm email» (ver guía).'
      : `Email o contraseña incorrectos. (${error.message})`
    return { ok: false, error: msg }
  }
  const uid = data.user.id
  const { data: profile, error: pErr } = await sb.from('profiles').select('data').eq('id', uid).maybeSingle()
  if (pErr || !profile) {
    await sb.auth.signOut()
    return { ok: false, error: 'La cuenta existe pero no tiene perfil. Revisá la guía de configuración.' }
  }
  const p = profile.data as Partial<User>
  const now = new Date().toISOString()
  return {
    ok: true,
    user: {
      id: uid,
      role: (p.role as User['role']) ?? 'consultante',
      nombre: p.nombre ?? '',
      apellido: p.apellido ?? '',
      email: email.trim(),
      password: '',
      titulo: p.titulo,
      consultantId: p.consultantId,
      membershipExpiresAt: p.membershipExpiresAt,
      createdAt: p.createdAt ?? now,
      updatedAt: now,
    },
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: async (email, password) => {
        if (isCloudEnabled()) {
          const res = await cloudLogin(email, password)
          if (res.ok && res.user) set({ user: res.user })
          return { ok: res.ok, error: res.error }
        }
        const users = await db.users.list()
        const found = users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        )
        if (!found) return { ok: false, error: 'No existe una cuenta con ese email.' }
        if (found.password !== password)
          return { ok: false, error: 'La contraseña no es correcta.' }
        set({ user: found })
        return { ok: true }
      },
      logout: () => {
        if (isCloudEnabled()) {
          import('@/services/cloud/client').then(({ getSupabase }) =>
            getSupabase().then((sb) => sb.auth.signOut()),
          )
        }
        set({ user: null })
      },
      requestPasswordReset: async (email) => {
        if (!isCloudEnabled()) {
          return { ok: false, error: 'La recuperación de contraseña solo está disponible con la nube activa.' }
        }
        const { getSupabase } = await import('@/services/cloud/client')
        const sb = await getSupabase()
        // Sin redirectTo a propósito: no navegamos nunca a ese link — la
        // persona lo copia (no lo clickea) y lo pega en confirmPasswordReset,
        // que extrae el token de la URL. Así da lo mismo a dónde "diría" que
        // redirige.
        const { error } = await sb.auth.resetPasswordForEmail(email.trim())
        if (error) return { ok: false, error: error.message }
        return { ok: true }
      },
      confirmPasswordReset: async (email, codeOrLink, newPassword) => {
        if (!isCloudEnabled()) {
          return { ok: false, error: 'La recuperación de contraseña solo está disponible con la nube activa.' }
        }
        const { getSupabase } = await import('@/services/cloud/client')
        const sb = await getSupabase()
        const extracted = extractRecoveryToken(codeOrLink)
        const { error: otpError } =
          'code' in extracted
            ? await sb.auth.exchangeCodeForSession(extracted.code)
            : 'token_hash' in extracted
              ? await sb.auth.verifyOtp({ token_hash: extracted.token_hash, type: 'recovery' })
              : await sb.auth.verifyOtp({ email: email.trim(), token: extracted.token, type: 'recovery' })
        if (otpError) return { ok: false, error: 'El código o link no es válido, o venció. Pedí uno nuevo.' }
        const { error } = await sb.auth.updateUser({ password: newPassword })
        if (error) return { ok: false, error: error.message }
        return { ok: true }
      },
      updateProfile: async (patch) => {
        const current = get().user
        if (!current) return
        if (isCloudEnabled()) {
          const { getSupabase } = await import('@/services/cloud/client')
          const sb = await getSupabase()
          // Función segura del lado del servidor: solo puede tocar estos 5
          // campos de la propia fila, nunca "role" ni "membershipExpiresAt".
          const { error } = await sb.rpc('mb_update_own_profile', {
            p_nombre: patch.nombre ?? null,
            p_apellido: patch.apellido ?? null,
            p_titulo: patch.titulo ?? null,
            p_matricula: patch.matricula ?? null,
            p_telefono: patch.telefono ?? null,
          })
          if (error) throw new Error(error.message)
        } else {
          await db.users.update(current.id, patch)
        }
        set({ user: { ...current, ...patch } })
      },
    }),
    { name: 'mb:auth' },
  ),
)
