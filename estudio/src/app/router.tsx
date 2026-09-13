import { lazy, Suspense } from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'
import { RequireAuth } from '@/features/auth/guards'
import { AppShell } from '@/components/layout/AppShell'

// Hash router: funciona en hosting estático (GitHub Pages) sin config de servidor.

const LandingPage = lazy(() => import('@/features/home/LandingPage'))
const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const ProDashboard = lazy(() => import('@/features/dashboard/ProDashboard'))
const StudentsPage = lazy(() => import('@/features/students/StudentsPage'))
const StudentDetailPage = lazy(() => import('@/features/students/StudentDetailPage'))

function Page({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex h-[60vh] items-center justify-center text-sm text-faint">Cargando…</div>}>
      {children}
    </Suspense>
  )
}

export const router = createHashRouter([
  { path: '/', element: <Page><LandingPage /></Page> },
  { path: '/login', element: <Page><LoginPage /></Page> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/pro',
        element: <AppShell />,
        children: [
          { index: true, element: <Page><ProDashboard /></Page> },
          { path: 'estudiantes', element: <Page><StudentsPage /></Page> },
          { path: 'estudiantes/:id', element: <Page><StudentDetailPage /></Page> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
