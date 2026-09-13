import { NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, Home, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/pro', icon: Home, label: 'Inicio', end: true },
  { to: '/pro/estudiantes', icon: Users, label: 'Estudiantes' },
]

export function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="flex h-full w-[228px] shrink-0 flex-col border-r bg-surface">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <button onClick={() => navigate('/pro')} className="flex cursor-pointer items-center gap-2" aria-label="Ir al inicio">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="text-[14px] font-semibold tracking-tight">Método Estudio</span>
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
                    'flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-medium shadow-[0_1px_2px_rgba(16,24,32,0.03)] transition-colors',
                    isActive
                      ? 'border-primary/25 bg-primary-soft text-primary-strong'
                      : 'border-transparent text-muted-foreground hover:bg-surface-2 hover:text-foreground',
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
    </aside>
  )
}
