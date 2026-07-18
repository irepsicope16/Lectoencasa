import { lazy, Suspense } from 'react'
import { createHashRouter } from 'react-router-dom'
import { RedirectByRole, RequireAuth, RequireRole } from '@/features/auth/guards'
import { AppShell } from '@/components/layout/AppShell'

// Hash router: funciona en hosting estático (GitHub Pages) sin config de servidor.
// Lazy loading por página → cada área se descarga solo cuando se usa.

const LoginPage = lazy(() => import('@/features/auth/LoginPage'))

const ProDashboard = lazy(() => import('@/features/dashboard/ProDashboard'))
const ConsultantsPage = lazy(() => import('@/features/consultants/ConsultantsPage'))
const ConsultantDetailPage = lazy(() => import('@/features/consultants/ConsultantDetailPage'))
const AgendaPage = lazy(() => import('@/features/sessions/AgendaPage'))
const MethodOverviewPage = lazy(() => import('@/features/method/MethodOverviewPage'))
const ModuleDetailProPage = lazy(() => import('@/features/method/ModuleDetailProPage'))
const StatsPage = lazy(() => import('@/features/stats/StatsPage'))
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'))

const MyDashboard = lazy(() => import('@/features/dashboard/MyDashboard'))
const MyModulePage = lazy(() => import('@/features/method/MyModulePage'))
const MyActivitiesPage = lazy(() => import('@/features/activities/MyActivitiesPage'))
const ActivityRunnerPage = lazy(() => import('@/features/activities/ActivityRunnerPage'))
const MyReflectionsPage = lazy(() => import('@/features/reflections/MyReflectionsPage'))
const MyMaterialsPage = lazy(() => import('@/features/files/MyMaterialsPage'))
const MyProgressPage = lazy(() => import('@/features/method/MyProgressPage'))

const PrintReportPage = lazy(() => import('@/features/reports/PrintReportPage'))

function Page({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-[60vh] items-center justify-center text-sm text-faint">Cargando…</div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createHashRouter([
  { path: '/', element: <RedirectByRole /> },
  { path: '/login', element: <Page><LoginPage /></Page> },
  {
    element: <RequireRole role="profesional" />,
    children: [
      {
        path: '/pro',
        element: <AppShell role="profesional" />,
        children: [
          { index: true, element: <Page><ProDashboard /></Page> },
          { path: 'consultantes', element: <Page><ConsultantsPage /></Page> },
          { path: 'consultantes/:id', element: <Page><ConsultantDetailPage /></Page> },
          { path: 'agenda', element: <Page><AgendaPage /></Page> },
          { path: 'metodo', element: <Page><MethodOverviewPage /></Page> },
          { path: 'metodo/:moduleId', element: <Page><ModuleDetailProPage /></Page> },
          { path: 'estadisticas', element: <Page><StatsPage /></Page> },
          { path: 'ajustes', element: <Page><SettingsPage /></Page> },
        ],
      },
    ],
  },
  {
    // Vista de impresión (sin shell): profesional para todos los informes;
    // el consultante solo accede a los suyos (la página valida propiedad).
    element: <RequireAuth />,
    children: [{ path: '/print/:consultantId/:tipo', element: <Page><PrintReportPage /></Page> }],
  },
  {
    element: <RequireRole role="consultante" />,
    children: [
      {
        path: '/mi',
        element: <AppShell role="consultante" />,
        children: [
          { index: true, element: <Page><MyDashboard /></Page> },
          { path: 'modulos/:moduleId', element: <Page><MyModulePage /></Page> },
          { path: 'actividades', element: <Page><MyActivitiesPage /></Page> },
          { path: 'actividades/:id', element: <Page><ActivityRunnerPage /></Page> },
          { path: 'reflexiones', element: <Page><MyReflectionsPage /></Page> },
          { path: 'materiales', element: <Page><MyMaterialsPage /></Page> },
          { path: 'avances', element: <Page><MyProgressPage /></Page> },
        ],
      },
    ],
  },
  { path: '*', element: <RedirectByRole /> },
])
