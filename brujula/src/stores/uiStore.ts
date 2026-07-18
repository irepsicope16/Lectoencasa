import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface UIState {
  theme: Theme
  sidebarCollapsed: boolean
  commandOpen: boolean
  setTheme: (t: Theme) => void
  toggleSidebar: () => void
  setCommandOpen: (open: boolean) => void
}

export function applyTheme(theme: Theme) {
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarCollapsed: false,
      commandOpen: false,
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
    }),
    { name: 'mb:ui', partialize: (s) => ({ theme: s.theme, sidebarCollapsed: s.sidebarCollapsed }) },
  ),
)
