import { NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, Calendar, Home, MessageCircle, Settings, ShieldCheck, Users, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Isotipo } from '@/branding/Logo'
import { useAuthStore } from '@/stores/authStore'
import { isOwner } from '@/lib/membership'
import type { UserRole } from '@/types'

const proNav = [
  { to: '/pro', icon: Home, label: 'Inicio', end: true },
  { to: '/pro/biblioteca', icon: BookOpen, label: 'Biblioteca' },
  { to: '/pro/estudiantes', icon: Users, label: 'Estudiantes' },
  { to: '/pro/agenda', icon: Calendar, label: 'Agenda' },
  { to: '/pro/honorarios', icon: Wallet, label: 'Honorarios' },
  { to: '/pro/ajustes', icon: Settings, label: 'Ajustes' },
]

/** Solo visible para la dueña de la plataforma (ver isOwner): activar/renovar membresías de otras profesionales. */
const ownerNavItem: (typeof proNav)[number] = { to: '/pro/profesionales', icon: ShieldCheck, label: 'Profesionales' }

const estudianteNav = [{ to: '/mi', icon: Home, label: 'Mi camino', end: true }]

export function Sidebar({ role }: { role: UserRole }) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const nav = role === 'profesional' ? (isOwner(user) ? [...proNav, ownerNavItem] : proNav) : estudianteNav

  return (
    <aside className="flex h-full w-[228px] shrink-0 flex-col border-r bg-surface">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <button
          onClick={() => navigate(role === 'profesional' ? '/pro' : '/mi')}
          className="flex cursor-pointer items-center gap-2"
          aria-label="Ir al inicio"
        >
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

      {role === 'profesional' && (
        <div className="border-t p-2">
          <a
            href="https://wa.me/5492216185376?text=Hola%20Irene%2C%20tengo%20una%20consulta%20sobre%20M%C3%A9todo%20Estudio."
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1faa59' }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors hover:bg-[#1faa59]/10"
            aria-label="Soporte por WhatsApp"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span>Soporte por WhatsApp</span>
          </a>
        </div>
      )}
    </aside>
  )
}
