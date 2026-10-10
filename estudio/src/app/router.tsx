import { lazy, Suspense } from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'

// Hash router: funciona en hosting estático (GitHub Pages) sin config de servidor.
// Sin login ni roles: la app es de un solo usuario local, se entra directo.

const InicioPage = lazy(() => import('@/features/home/InicioPage'))
const AutoperfilPage = lazy(() => import('@/features/autoperfil/AutoperfilPage'))
const BibliotecaPage = lazy(() => import('@/features/biblioteca/BibliotecaPage'))
const ActividadesPage = lazy(() => import('@/features/actividades/ActividadesPage'))
const HerramientasPage = lazy(() => import('@/features/herramientas/HerramientasPage'))
const CronometroPage = lazy(() => import('@/features/herramientas/CronometroPage'))
const MapasPage = lazy(() => import('@/features/herramientas/MapasPage'))
const FichasPage = lazy(() => import('@/features/herramientas/FichasPage'))
const DiarioPage = lazy(() => import('@/features/herramientas/DiarioPage'))
const ProgresoPage = lazy(() => import('@/features/progreso/ProgresoPage'))
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'))
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
  { path: '/print/acentuacion', element: <Page><PrintAcentuacionPage /></Page> },
  { path: '/print/pasos-estudio', element: <Page><PrintPasosEstudioPage /></Page> },
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Page><InicioPage /></Page> },
      { path: '/autoperfil', element: <Page><AutoperfilPage /></Page> },
      { path: '/biblioteca', element: <Page><BibliotecaPage /></Page> },
      { path: '/actividades', element: <Page><ActividadesPage /></Page> },
      { path: '/herramientas', element: <Page><HerramientasPage /></Page> },
      { path: '/herramientas/cronometro', element: <Page><CronometroPage /></Page> },
      { path: '/herramientas/mapas', element: <Page><MapasPage /></Page> },
      { path: '/herramientas/fichas', element: <Page><FichasPage /></Page> },
      { path: '/herramientas/diario', element: <Page><DiarioPage /></Page> },
      { path: '/progreso', element: <Page><ProgresoPage /></Page> },
      { path: '/ajustes', element: <Page><SettingsPage /></Page> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
