import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { db } from '@/services/storage/db'

type ProfileEditable = Pick<User, 'nombre' | 'apellido' | 'titulo'>

interface AuthState {
  user: User | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  updateProfile: (patch: Partial<ProfileEditable>) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: async (email, password) => {
        const users = await db.users.list()
        const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
        if (!found) return { ok: false, error: 'No existe una cuenta con ese email.' }
        if (found.password !== password) return { ok: false, error: 'La contraseña no es correcta.' }
        set({ user: found })
        return { ok: true }
      },
      logout: () => set({ user: null }),
      updateProfile: async (patch) => {
        const current = get().user
        if (!current) return
        await db.users.update(current.id, patch)
        set({ user: { ...current, ...patch } })
      },
    }),
    { name: 'me:auth' },
  ),
)
