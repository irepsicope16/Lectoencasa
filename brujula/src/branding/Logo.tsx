import { cn } from '@/lib/utils'

// ============================================================
// Identidad visual Método Brújula.
// Brújula minimalista flat: aro verde agua, rosa de los vientos
// en lavanda + verde agua, aguja NE. Tres variantes:
// <Isotipo />, <LogoHorizontal />, <LogoFull />.
// ============================================================

interface LogoProps {
  className?: string
  /** tamaño en px del isotipo */
  size?: number
}

export function Isotipo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Método Brújula"
      className={cn('shrink-0', className)}
    >
      {/* aro */}
      <circle cx="32" cy="32" r="29" stroke="var(--primary)" strokeWidth="3.5" />
      {/* marcas cardinales del aro */}
      <circle cx="32" cy="7.5" r="1.6" fill="var(--accent)" />
      <circle cx="32" cy="56.5" r="1.6" fill="var(--accent)" />
      <circle cx="7.5" cy="32" r="1.6" fill="var(--accent)" />
      <circle cx="56.5" cy="32" r="1.6" fill="var(--accent)" />
      {/* rosa de los vientos: puntas cardinales (lavanda) */}
      <path d="M32 13 L36 32 L32 36 L28 32 Z" fill="var(--accent)" />
      <path d="M32 51 L28 32 L32 28 L36 32 Z" fill="var(--accent)" opacity="0.55" />
      <path d="M13 32 L32 28 L36 32 L32 36 Z" fill="var(--accent)" opacity="0.55" />
      <path d="M51 32 L32 36 L28 32 L32 28 Z" fill="var(--accent)" />
      {/* aguja NE (verde agua): el rumbo propio */}
      <path d="M46.5 17.5 L34.5 29.5 L32 32 L34.9 34.9 Z" fill="var(--primary)" />
      <path d="M46.5 17.5 L34.9 34.9 L32 32 L29.5 29.5 Z" fill="var(--primary)" opacity="0.45" />
      {/* centro */}
      <circle cx="32" cy="32" r="4.2" fill="var(--surface, #fff)" stroke="var(--primary)" strokeWidth="2.5" />
    </svg>
  )
}

export function LogoHorizontal({ className, size = 30 }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Isotipo size={size} />
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Método <span className="text-primary">Brújula</span>
        </span>
        <span className="mt-0.5 text-[10px] font-medium tracking-[0.14em] text-faint uppercase">
          Psicope con Ire
        </span>
      </div>
    </div>
  )
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-4 text-center', className)}>
      <Isotipo size={72} />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Método <span className="text-primary">Brújula</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Encontrá tu norte. Construí tu camino.</p>
        <p className="mt-2 text-[11px] font-medium tracking-[0.18em] text-faint uppercase">
          Psicope con Ire
        </p>
      </div>
    </div>
  )
}
