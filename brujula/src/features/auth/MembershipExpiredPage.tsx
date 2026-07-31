import { useNavigate } from 'react-router-dom'
import { CalendarClock, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

// Se muestra en vez del panel profesional cuando la membresía anual venció.
// Los datos no se tocan: vuelven a estar disponibles apenas se renueva
// la fecha en Supabase (profiles → data.membershipExpiresAt).
export default function MembershipExpiredPage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft">
        <CalendarClock className="h-7 w-7 text-accent-strong" />
      </div>
      <h1 className="mt-5 text-xl font-semibold tracking-tight">Tu acceso está pausado</h1>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
        {user?.nombre ? `Hola ${user.nombre}, tu` : 'Tu'} acceso profesional a Método Brújula está pausado hasta
        que se confirme el pago de la membresía anual. Tus consultantes y todos tus datos (si ya cargaste
        alguno) siguen guardados tal cual — no se pierde nada.
      </p>
      <p className="mt-4 max-w-sm text-[13.5px] text-muted-foreground">
        Para activarlo, escribí a{' '}
        <a href="mailto:irenemorbidelli@gmail.com" className="font-medium text-primary underline-offset-2 hover:underline">
          irenemorbidelli@gmail.com
        </a>
        .
      </p>
      <Button
        variant="outline"
        className="mt-8"
        onClick={() => {
          logout()
          navigate('/login')
        }}
      >
        <LogOut /> Cerrar sesión
      </Button>
    </div>
  )
}
