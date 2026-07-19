import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { db } from '@/services/storage/db'
import { isCloudEnabled } from '@/services/cloud/config'

interface AuthState {
  user: User | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
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
      : 'Email o contraseña incorrectos.'
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
      createdAt: p.createdAt ?? now,
      updatedAt: now,
    },
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
    }),
    { name: 'mb:auth' },
  ),
)
