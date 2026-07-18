import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { db } from '@/services/storage/db'

interface AuthState {
  user: User | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email, password) => {
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
      logout: () => set({ user: null }),
    }),
    { name: 'mb:auth' },
  ),
)
