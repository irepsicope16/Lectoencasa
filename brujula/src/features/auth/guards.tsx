import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import type { UserRole } from '@/types'

export function RequireRole({ role }: { role: UserRole }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (user.role !== role) return <Navigate to={user.role === 'profesional' ? '/pro' : '/mi'} replace />
  return <Outlet />
}

/** Requiere sesión iniciada, cualquier rol (la autorización fina la hace la página). */
export function RequireAuth() {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return <Outlet />
}

export function RedirectByRole() {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'profesional' ? '/pro' : '/mi'} replace />
}
