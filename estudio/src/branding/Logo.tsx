import { cn } from '@/lib/utils'
import iconMark from '@/assets/branding/icon-mark.png'
import logoCompleto from '@/assets/branding/logo-completo.webp'

// ============================================================
// Identidad visual Método Estudio: isotipo "E" (perfil · estrategias
// · seguimiento) provisto por la usuaria. Los archivos originales
// viven en src/assets/branding/; acá solo se recortan y aplican en
// los distintos tamaños de uso (sidebar, login, portada).
// ============================================================

interface LogoProps {
  className?: string
  /** tamaño en px del isotipo */
  size?: number
}

export function Isotipo({ className, size = 32 }: LogoProps) {
  return (
    <img
      src={iconMark}
      alt="Método Estudio"
      width={size}
      height={size}
      className={cn('shrink-0 rounded-md object-contain', className)}
      style={{ width: size, height: size }}
    />
  )
}

export function LogoHorizontal({ className, size = 30 }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Isotipo size={size} />
      <div className="flex flex-col leading-none">
        <span className="font-display text-[16px] font-semibold tracking-tight text-foreground">
          Método <span className="text-accent">Estudio</span>
        </span>
        <span className="mt-0.5 text-[10px] font-medium tracking-[0.14em] text-faint uppercase">
          Lic. Irene Morbidelli
        </span>
      </div>
    </div>
  )
}

/** Lockup completo (isotipo + wordmark + lema) para portada, login y usos grandes. */
export function BrandCover({ className }: { className?: string }) {
  return <img src={logoCompleto} alt="Método Estudio — Evaluar · Comprender · Intervenir" className={cn('w-full', className)} />
}
