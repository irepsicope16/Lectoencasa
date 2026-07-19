import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { UserRole } from '@/types'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { CommandPalette } from './CommandPalette'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function AppShell({ role }: { role: UserRole }) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen)
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen)
  const location = useLocation()

  // el drawer móvil se cierra al navegar
  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname, setMobileNavOpen])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* sidebar fija (desktop) */}
      <div className="hidden lg:flex">
        <Sidebar role={role} />
      </div>

      {/* drawer móvil */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar role={role} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
