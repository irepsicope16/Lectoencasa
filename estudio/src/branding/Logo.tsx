import { BarChart3, Lightbulb, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import iconMark from '@/assets/branding/icon-mark.png'

// ============================================================
// Identidad visual Método Estudio: isotipo "E" (perfil · estrategias
// · seguimiento) provisto por la usuaria. El isotipo chico (sidebar,
// pestaña) sigue siendo la imagen original. La portada grande
// (BrandCover) se reconstruyó en código — la imagen original traía
// el lema "Evaluar · Comprender · Intervenir", lenguaje del enfoque
// profesional anterior al pivot del 10/10/2026 — así queda editable.
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

const BRAND_COVER_ITEMS = [
  { icon: User, label: 'Perfil' },
  { icon: Lightbulb, label: 'Estrategias' },
  { icon: BarChart3, label: 'Seguimiento' },
] as const

/** Lockup completo (isotipo + wordmark + lema) para portada y usos grandes. */
export function BrandCover({ className }: { className?: string }) {
  return (
    <div className={cn('select-none', className)}>
      <div className="flex items-stretch justify-center gap-3">
        <div
          className="w-7 shrink-0 rounded-full"
          style={{
            background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent-strong))',
            boxShadow: '0 12px 26px -8px var(--color-accent)',
          }}
        />
        <div className="flex flex-col gap-2.5">
          {BRAND_COVER_ITEMS.map((it) => (
            <div key={it.label} className="flex items-center gap-2.5">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                style={{
                  background: 'linear-gradient(145deg, var(--color-accent), var(--color-accent-strong))',
                  boxShadow: '0 10px 20px -6px var(--color-accent)',
                }}
              >
                <it.icon className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-accent-strong">
                {it.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="font-display text-[14px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">Método</p>
        <p className="font-display text-[44px] font-bold leading-none tracking-tight text-foreground">Estudio</p>
        <div className="mx-auto mt-2.5 h-1 w-14 rounded-full" style={{ background: 'var(--color-accent)' }} />
        <p className="mt-3 text-[11.5px] font-bold uppercase tracking-[0.18em] text-accent-strong">
          Conocé · Practicá · Mejorá
        </p>
      </div>
    </div>
  )
}
