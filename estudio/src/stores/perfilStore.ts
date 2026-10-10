import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// App de un solo usuario local: no hay cuentas, solo un nombre para
// personalizar los saludos. Vive en este dispositivo, nada más.

interface PerfilState {
  nombre: string
  setNombre: (nombre: string) => void
}

export const usePerfilStore = create<PerfilState>()(
  persist(
    (set) => ({
      nombre: '',
      setNombre: (nombre) => set({ nombre }),
    }),
    { name: 'me:perfil' },
  ),
)
