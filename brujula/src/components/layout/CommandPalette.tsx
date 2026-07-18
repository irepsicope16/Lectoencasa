import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import {
  BarChart3,
  Calendar,
  Compass,
  Home,
  ListChecks,
  NotebookPen,
  Settings,
  User,
  Users,
} from 'lucide-react'
import type { UserRole } from '@/types'
import { useUIStore } from '@/stores/uiStore'
import { useConsultants } from '@/hooks/queries'
import { MODULES } from '@/data/modules'
import { nombreCompleto } from '@/lib/utils'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export function CommandPalette({ role }: { role: UserRole }) {
  const open = useUIStore((s) => s.commandOpen)
  const setOpen = useUIStore((s) => s.setCommandOpen)
  const navigate = useNavigate()
  const { data: consultants = [] } = useConsultants()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  const go = (to: string) => {
    setOpen(false)
    navigate(to)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[30%] translate-y-0 gap-0 p-0" aria-describedby={undefined}>
        <DialogTitle className="sr-only">Buscador</DialogTitle>
        <Command label="Buscador global" className="outline-none">
          <Command.Input
            placeholder="Buscar consultantes, módulos, secciones…"
            className="h-12 w-full border-b bg-transparent px-4 text-sm outline-none placeholder:text-faint"
          />
          <Command.List className="max-h-[320px] overflow-y-auto p-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10.5px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.12em] [&_[cmdk-group-heading]]:text-faint">
            <Command.Empty className="py-8 text-center text-[13px] text-faint">
              Sin resultados.
            </Command.Empty>

            <Command.Group heading="Ir a">
              {(role === 'profesional'
                ? [
                    { to: '/pro', icon: Home, label: 'Inicio' },
                    { to: '/pro/consultantes', icon: Users, label: 'Consultantes' },
                    { to: '/pro/agenda', icon: Calendar, label: 'Agenda' },
                    { to: '/pro/metodo', icon: Compass, label: 'Método Brújula' },
                    { to: '/pro/estadisticas', icon: BarChart3, label: 'Estadísticas' },
                    { to: '/pro/ajustes', icon: Settings, label: 'Ajustes' },
                  ]
                : [
                    { to: '/mi', icon: Home, label: 'Mi camino' },
                    { to: '/mi/actividades', icon: ListChecks, label: 'Actividades' },
                    { to: '/mi/reflexiones', icon: NotebookPen, label: 'Reflexiones' },
                  ]
              ).map((item) => (
                <Command.Item
                  key={item.to}
                  onSelect={() => go(item.to)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-foreground data-[selected=true]:bg-surface-2"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" /> {item.label}
                </Command.Item>
              ))}
            </Command.Group>

            {role === 'profesional' && consultants.length > 0 && (
              <Command.Group heading="Consultantes">
                {consultants.map((c) => (
                  <Command.Item
                    key={c.id}
                    onSelect={() => go(`/pro/consultantes/${c.id}`)}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] data-[selected=true]:bg-surface-2"
                  >
                    <User className="h-4 w-4 text-muted-foreground" /> {nombreCompleto(c)}
                    <span className="ml-auto text-[11px] text-faint">{c.escuela}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Módulos del método">
              {MODULES.map((m) => (
                <Command.Item
                  key={m.id}
                  onSelect={() =>
                    go(role === 'profesional' ? `/pro/metodo/${m.id}` : `/mi/modulos/${m.id}`)
                  }
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] data-[selected=true]:bg-surface-2"
                >
                  <Compass className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <span className="mr-1.5 text-[11px] font-semibold text-faint">{m.numero}</span>
                    {m.nombre}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
