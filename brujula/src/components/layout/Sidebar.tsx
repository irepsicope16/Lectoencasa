import { NavLink, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  Calendar,
  Compass,
  FolderOpen,
  Home,
  ListChecks,
  NotebookPen,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import type { UserRole } from '@/types'
import { Isotipo, LogoHorizontal } from '@/branding/Logo'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'
import { STAGES } from '@/lib/constants'
import { MODULES } from '@/data/modules'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/misc'

const proNav = [
  { to: '/pro', icon: Home, label: 'Inicio', end: true },
  { to: '/pro/consultantes', icon: Users, label: 'Consultantes' },
  { to: '/pro/agenda', icon: Calendar, label: 'Agenda' },
  { to: '/pro/metodo', icon: Compass, label: 'Método Brújula' },
  { to: '/pro/estadisticas', icon: BarChart3, label: 'Estadísticas' },
  { to: '/pro/ajustes', icon: Settings, label: 'Ajustes' },
]

const misNav = [
  { to: '/mi', icon: Home, label: 'Mi camino', end: true },
  { to: '/mi/actividades', icon: ListChecks, label: 'Actividades' },
  { to: '/mi/reflexiones', icon: NotebookPen, label: 'Reflexiones' },
  { to: '/mi/materiales', icon: FolderOpen, label: 'Materiales' },
  { to: '/mi/avances', icon: TrendingUp, label: 'Avances' },
]

export function Sidebar({ role }: { role: UserRole }) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggle = useUIStore((s) => s.toggleSidebar)
  const navigate = useNavigate()
  const nav = role === 'profesional' ? proNav : misNav

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col border-r bg-surface transition-[width] duration-200',
        collapsed ? 'w-[60px]' : 'w-[248px]',
      )}
    >
      {/* logo */}
      <div className={cn('flex h-14 items-center border-b', collapsed ? 'justify-center px-0' : 'px-4')}>
        <button
          onClick={() => navigate(role === 'profesional' ? '/pro' : '/mi')}
          className="cursor-pointer"
          aria-label="Ir al inicio"
        >
          {collapsed ? <Isotipo size={28} /> : <LogoHorizontal size={28} />}
        </button>
      </div>

      {/* navegación */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {nav.map((item) => (
            <li key={item.to}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground',
                        isActive && 'bg-primary-soft text-primary-strong hover:bg-primary-soft hover:text-primary-strong',
                        collapsed && 'justify-center px-0 py-2',
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
              </Tooltip>
            </li>
          ))}
        </ul>

        {/* módulos por etapa (solo consultante, sidebar expandida) */}
        {role === 'consultante' && !collapsed && (
          <div className="mt-6">
            <p className="mb-2 px-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-faint">
              El método
            </p>
            {(Object.keys(STAGES) as (keyof typeof STAGES)[]).map((stage) => (
              <div key={stage} className="mb-3">
                <p className="px-2.5 pb-1 text-[11px] font-medium text-faint">{STAGES[stage].nombre}</p>
                <ul className="space-y-px">
                  {MODULES.filter((m) => m.etapa === stage).map((m) => (
                    <li key={m.id}>
                      <NavLink
                        to={`/mi/modulos/${m.id}`}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-2 rounded-md px-2.5 py-1 text-[12.5px] text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground',
                            isActive && 'bg-accent-soft text-accent-strong hover:bg-accent-soft hover:text-accent-strong',
                          )
                        }
                      >
                        <span className="w-4 text-center text-[10.5px] font-semibold text-faint">{m.numero}</span>
                        <span className="truncate">{m.nombre}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {role === 'profesional' && !collapsed && (
          <div className="mt-6 rounded-lg border border-dashed p-3">
            <div className="flex items-center gap-2 text-accent-strong">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[12px] font-semibold">Asistente IA</span>
            </div>
            <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">
              Resúmenes, hipótesis y borradores de informe desde la ficha de cada consultante.
            </p>
          </div>
        )}
      </nav>

      {/* pie */}
      <div className={cn('border-t p-2', collapsed && 'flex justify-center')}>
        <button
          onClick={toggle}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] text-faint transition-colors hover:bg-surface-2 hover:text-foreground"
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          {!collapsed && <span>Colapsar</span>}
        </button>
      </div>
    </aside>
  )
}
