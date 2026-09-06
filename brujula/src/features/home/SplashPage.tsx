import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BrandMark } from '@/branding/Logo'
import { useAuthStore } from '@/stores/authStore'
import brandCompass from '@/assets/branding/brand-compass.png'

// Portada de la plataforma: primera pantalla que ve cualquier visitante
// sin sesión iniciada. Si ya hay sesión, no se muestra — va directo a su área.
// Excepción: con ?preview=1 en la URL se ve igual estando logueada/o (para
// que la profesional pueda revisarla sin cerrar sesión).
export default function SplashPage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const preview = params.get('preview') === '1'

  if (user && !preview) {
    return <Navigate to={user.role === 'profesional' ? '/pro' : '/mi'} replace />
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface px-6 py-12 text-center">
      <img
        src={brandCompass}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 hidden h-[560px] w-[560px] rounded-full opacity-[0.06] grayscale sm:block"
      />
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 shadow-[0_1px_2px_rgba(16,24,32,0.04)]">
        <Compass className="h-4 w-4 text-primary" />
        <span className="font-display text-[15px] uppercase italic tracking-wide text-primary-strong">
          Orientación Vocacional y Ocupacional
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mt-8 flex flex-col items-center"
      >
        <BrandMark showOrientationLabel={false} className="max-w-[440px]" />

        <p className="mx-auto mt-6 max-w-md text-[14px] leading-relaxed text-muted-foreground">
          La plataforma profesional de orientación vocacional: evaluación, acompañamiento,
          seguimiento y proyecto de vida en un solo lugar.
        </p>

        {user ? (
          <Button size="lg" className="mt-8" onClick={() => navigate(user.role === 'profesional' ? '/pro' : '/mi')}>
            Volver a mi panel <ArrowRight />
          </Button>
        ) : (
          <Button size="lg" className="mt-8" onClick={() => navigate('/login')}>
            Comenzar <ArrowRight />
          </Button>
        )}
      </motion.div>

      <footer className="mt-16">
        <p className="mx-auto max-w-md text-[10.5px] leading-relaxed text-faint">
          Material elaborado por Lic. Irene Morbidelli — MP: 260505. Prohibida su reproducción,
          distribución o venta sin autorización expresa de la autora.
        </p>
        <p className="mt-1.5 text-[10.5px] text-faint">
          <a href="mailto:irenemorbidelli@gmail.com" className="hover:text-foreground hover:underline">
            irenemorbidelli@gmail.com
          </a>
        </p>
      </footer>
    </div>
  )
}
