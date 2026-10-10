import { Flame, Menu, Moon, Sun } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { usePerfilStore } from '@/stores/perfilStore'
import { useActividadesProbadas, useDiario, useFichas, useSesionesEstudio } from '@/hooks/queries'
import { calcularRacha } from '@/lib/progreso'

export function Navbar() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen)
  const nombre = usePerfilStore((s) => s.nombre)

  const { data: actividades = [] } = useActividadesProbadas()
  const { data: sesiones = [] } = useSesionesEstudio()
  const { data: diario = [] } = useDiario()
  const { data: fichas = [] } = useFichas()

  const fechasActividad = [
    ...actividades.filter((a) => a.fechaCompletada).map((a) => a.fechaCompletada!),
    ...sesiones.map((s) => s.fecha),
    ...diario.map((d) => d.fecha),
    ...fichas.filter((f) => f.ultimoRepaso).map((f) => f.ultimoRepaso!),
  ]
  const racha = calcularRacha(fechasActividad)

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-surface px-4 lg:px-6">
      <button
        onClick={() => setMobileNavOpen(true)}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        {racha > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent-strong">
            <Flame className="h-3.5 w-3.5" />
            {racha} {racha === 1 ? 'día' : 'días'}
          </span>
        )}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          aria-label="Cambiar tema"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        {nombre && <span className="hidden text-[13px] font-medium sm:block">{nombre}</span>}
      </div>
    </header>
  )
}
