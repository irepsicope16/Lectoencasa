import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, Moon, Search, Settings, Sun } from 'lucide-react'
import type { UserRole } from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { iniciales, nombreCompleto } from '@/lib/utils'

export function Navbar({ role }: { role: UserRole }) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const setCommandOpen = useUIStore((s) => s.setCommandOpen)
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen)
  const navigate = useNavigate()

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-surface px-4 lg:px-6">
      {/* menú móvil */}
      <button
        onClick={() => setMobileNavOpen(true)}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* buscador */}
      <button
        onClick={() => setCommandOpen(true)}
        className="flex h-8 w-full max-w-[320px] cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 text-[13px] text-faint transition-colors hover:border-border-strong"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Buscar…</span>
        <kbd className="rounded border bg-surface px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
      </button>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          aria-label="Cambiar tema"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex cursor-pointer items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-surface-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback>{user ? iniciales(user.nombre, user.apellido) : '·'}</AvatarFallback>
              </Avatar>
              <span className="hidden text-[13px] font-medium sm:block">{user?.nombre}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="normal-case tracking-normal">
              <span className="block text-[13px] font-semibold text-foreground">
                {user ? nombreCompleto(user) : ''}
              </span>
              <span className="block text-[11.5px] font-normal text-faint">
                {user?.titulo ?? (role === 'consultante' ? 'Consultante' : '')}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {role === 'profesional' && (
              <DropdownMenuItem onClick={() => navigate('/pro/ajustes')}>
                <Settings /> Ajustes
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              danger
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              <LogOut /> Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
