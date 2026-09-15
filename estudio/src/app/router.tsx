import { lazy, Suspense } from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'
import { RequireOwner, RequireRole } from '@/features/auth/guards'
import { AppShell } from '@/components/layout/AppShell'

// Hash router: funciona en hosting estático (GitHub Pages) sin config de servidor.

const LandingPage = lazy(() => import('@/features/home/LandingPage'))
const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const RegisterProPage = lazy(() => import('@/features/auth/RegisterProPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/ForgotPasswordPage'))
const ProDashboard = lazy(() => import('@/features/dashboard/ProDashboard'))
const BibliotecaPage = lazy(() => import('@/features/biblioteca/BibliotecaPage'))
const StudentsPage = lazy(() => import('@/features/students/StudentsPage'))
const StudentDetailPage = lazy(() => import('@/features/students/StudentDetailPage'))
const AgendaPage = lazy(() => import('@/features/agenda/AgendaPage'))
const HonorariosPage = lazy(() => import('@/features/agenda/HonorariosPage'))
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'))
const ProfessionalsAdminPage = lazy(() => import('@/features/settings/ProfessionalsAdminPage'))
const MyDashboard = lazy(() => import('@/features/dashboard/MyDashboard'))
const PrintAcentuacionPage = lazy(() => import('@/features/print/PrintAcentuacionPage'))
const PrintPasosEstudioPage = lazy(() => import('@/features/print/PrintPasosEstudioPage'))

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
  { path: '/registro', element: <Page><RegisterProPage /></Page> },
  { path: '/recuperar-contrasena', element: <Page><ForgotPasswordPage /></Page> },
  { path: '/print/acentuacion', element: <Page><PrintAcentuacionPage /></Page> },
  { path: '/print/pasos-estudio', element: <Page><PrintPasosEstudioPage /></Page> },
  {
    element: <RequireRole role="profesional" />,
    children: [
      {
        path: '/pro',
        element: <AppShell role="profesional" />,
        children: [
          { index: true, element: <Page><ProDashboard /></Page> },
          { path: 'biblioteca', element: <Page><BibliotecaPage /></Page> },
          { path: 'estudiantes', element: <Page><StudentsPage /></Page> },
          { path: 'estudiantes/:id', element: <Page><StudentDetailPage /></Page> },
          { path: 'agenda', element: <Page><AgendaPage /></Page> },
          { path: 'honorarios', element: <Page><HonorariosPage /></Page> },
          { path: 'ajustes', element: <Page><SettingsPage /></Page> },
          {
            element: <RequireOwner />,
            children: [{ path: 'profesionales', element: <Page><ProfessionalsAdminPage /></Page> }],
          },
        ],
      },
    ],
  },
  {
    element: <RequireRole role="estudiante" />,
    children: [
      {
        path: '/mi',
        element: <AppShell role="estudiante" />,
        children: [{ index: true, element: <Page><MyDashboard /></Page> }],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
