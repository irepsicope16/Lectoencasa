import { Outlet } from 'react-router-dom'
import type { UserRole } from '@/types'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { CommandPalette } from './CommandPalette'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function AppShell({ role }: { role: UserRole }) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar role={role} />
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col transition-[margin] duration-200',
        )}
      >
        <Navbar role={role} />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className={cn('mx-auto w-full px-6 py-6 lg:px-10', collapsed ? 'max-w-[1400px]' : 'max-w-[1200px]')}>
            <Outlet />
          </div>
        </main>
      </div>
      <CommandPalette role={role} />
    </div>
  )
}
