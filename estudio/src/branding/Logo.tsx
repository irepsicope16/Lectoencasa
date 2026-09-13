import { cn } from '@/lib/utils'

// ============================================================
// Identidad visual Método Estudio: "Fichero".
// El isotipo es una ficha de repaso apilada — la recuperación
// activa (F2 del autoperfil) es el mismo principio que sostiene
// todo el método. Ver la propuesta de identidad para el resto
// del razonamiento (paleta, tipografía, alternativas descartadas).
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
      viewBox="0 0 56 56"
      fill="none"
      role="img"
      aria-label="Método Estudio"
      className={cn('shrink-0', className)}
    >
      <rect x="8" y="14" width="34" height="24" rx="2.5" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
      <rect x="12" y="9" width="34" height="24" rx="2.5" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
      <rect x="16" y="4" width="34" height="24" rx="2.5" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2.5" />
      <path d="M16 10.5 h34" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 17 h24" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <path d="M21 22 h24" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

export function LogoHorizontal({ className, size = 30 }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Isotipo size={size} />
      <div className="flex flex-col leading-none">
        <span className="font-display text-[16px] font-semibold tracking-tight text-foreground">
          Método <span className="text-primary">Estudio</span>
        </span>
        <span className="mt-0.5 text-[10px] font-medium tracking-[0.14em] text-faint uppercase">
          Lic. Irene Morbidelli
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
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Método <span className="text-primary">Estudio</span>
        </h1>
        <p className="mt-1 font-display text-[15px] italic text-accent-strong">
          Cómo estudia cada quien, con evidencia — nunca con una etiqueta.
        </p>
        <p className="mt-2 text-[11px] font-medium tracking-[0.18em] text-faint uppercase">
          Lic. Irene Morbidelli
        </p>
      </div>
    </div>
  )
}
