import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface UIState {
  theme: Theme
  mobileNavOpen: boolean
  setTheme: (t: Theme) => void
  setMobileNavOpen: (open: boolean) => void
}

export function applyTheme(theme: Theme) {
  const resolved =
    theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      mobileNavOpen: false,
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
    }),
    { name: 'me:ui', partialize: (s) => ({ theme: s.theme }) },
  ),
)
