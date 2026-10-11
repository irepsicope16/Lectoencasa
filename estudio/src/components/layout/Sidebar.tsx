import { NavLink, useNavigate } from 'react-router-dom'
import { BarChart3, BookOpen, CalendarDays, Home, ListChecks, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Isotipo } from '@/branding/Logo'

const nav = [
  { to: '/', icon: Home, label: 'Inicio', end: true },
  { to: '/autoperfil', icon: Sparkles, label: 'Mi autoperfil' },
  { to: '/biblioteca', icon: BookOpen, label: 'Biblioteca' },
  { to: '/actividades', icon: ListChecks, label: 'Actividades' },
  { to: '/agenda', icon: CalendarDays, label: 'Agenda' },
  { to: '/herramientas', icon: Sparkles, label: 'Herramientas' },
  { to: '/progreso', icon: BarChart3, label: 'Mi progreso' },
]

export function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="flex h-full w-[228px] shrink-0 flex-col border-r bg-surface">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <button onClick={() => navigate('/')} className="flex cursor-pointer items-center gap-2" aria-label="Ir al inicio">
          <Isotipo size={28} />
          <span className="font-display text-[14.5px] font-semibold tracking-tight">Método Estudio</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-1.5">
          {nav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-medium transition-all',
                    isActive
                      ? 'border-transparent bg-accent text-accent-foreground shadow-[0_6px_14px_-6px_var(--accent)]'
                      : 'border-transparent text-muted-foreground shadow-[0_1px_2px_rgba(16,24,32,0.03)] hover:bg-surface-2 hover:text-foreground',
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-2">
        <NavLink
          to="/ajustes"
          className={({ isActive }) =>
            cn(
              'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors',
              isActive ? 'bg-surface-2 text-foreground' : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground',
            )
          }
        >
          Ajustes
        </NavLink>
      </div>
    </aside>
  )
}
