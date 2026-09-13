import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useUIStore } from '@/stores/uiStore'
import type { UserRole } from '@/types'

export function AppShell({ role }: { role: UserRole }) {
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen)
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen)
  const location = useLocation()

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname, setMobileNavOpen])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="hidden lg:flex">
        <Sidebar role={role} />
      </div>

      {mobileNavOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileNavOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar role={role} />
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-surface-2 text-muted-foreground"
              aria-label="Cerrar menú"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] px-6 py-6 lg:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
