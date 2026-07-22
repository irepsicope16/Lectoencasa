import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

// Portada de la plataforma: primera pantalla que ve cualquier visitante
// sin sesión iniciada. Si ya hay sesión, no se muestra — va directo a su área.
export default function SplashPage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  if (user) {
    return <Navigate to={user.role === 'profesional' ? '/pro' : '/mi'} replace />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-12 text-center">
      <div className="flex items-center gap-2 text-[12px] font-medium tracking-[0.16em] text-faint uppercase">
        <Compass className="h-4 w-4 text-primary" /> Psicope con Ire
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mt-8 flex flex-col items-center"
      >
        <img
          src="logo-completo.jpg"
          alt="Método Brújula — Psicope con Ire. Encontrá tu norte. Construí tu camino."
          className="w-full max-w-[420px] rounded-3xl shadow-sm sm:max-w-[480px]"
        />

        <p className="mx-auto mt-6 max-w-md text-[14px] leading-relaxed text-muted-foreground">
          La plataforma profesional de orientación vocacional: evaluación, acompañamiento,
          seguimiento y proyecto de vida en un solo lugar.
        </p>

        <p className="mt-4 text-[13px] font-medium text-foreground">
          Un espacio creado y guiado por Lic. Irene Morbidelli — MP: 260505
        </p>

        <Button size="lg" className="mt-8" onClick={() => navigate('/login')}>
          Comenzar <ArrowRight />
        </Button>
      </motion.div>

      <footer className="mt-16">
        <p className="mx-auto max-w-md text-[10.5px] leading-relaxed text-faint">
          Material elaborado por Lic. Irene Morbidelli — MP: 260505. Prohibida su reproducción,
          distribución o venta sin autorización expresa de la autora.
        </p>
      </footer>
    </div>
  )
}
