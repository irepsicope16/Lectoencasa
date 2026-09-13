import { cn } from '@/lib/utils'

// ============================================================
// Ilustración de portada: la misma escena del fichero, ampliada
// a un escritorio visto desde arriba. Dibujada a mano en SVG
// (no un raster externo) para que quede on-brand de forma exacta
// y no dependa de un servicio de imágenes de terceros.
// ============================================================

export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      role="img"
      aria-label="Escritorio con fichas de repaso, una a mitad de vuelta, una lapicera y un resaltador"
      className={cn('h-auto w-full', className)}
    >
      <rect x="0" y="0" width="480" height="360" rx="28" fill="var(--surface-2)" />

      {/* sombra de la ficha que está volando */}
      <ellipse cx="322" cy="168" rx="58" ry="14" fill="#000000" opacity="0.08" />

      {/* tres fichas apiladas en abanico */}
      <g transform="rotate(-11 190 215)">
        <rect x="115" y="165" width="150" height="98" rx="6" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
      </g>
      <g transform="rotate(7 210 210)">
        <rect x="135" y="160" width="150" height="98" rx="6" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
      </g>
      <g>
        <rect x="120" y="185" width="160" height="102" rx="6" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2.5" />
        <path d="M120 199 h160" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M132 216 h136" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
        <path d="M132 231 h136" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
        <path d="M132 246 h96" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      </g>

      {/* ficha a mitad de vuelta */}
      <g transform="rotate(-16 322 150)">
        <rect x="262" y="110" width="120" height="80" rx="6" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.5" />
        <path d="M262 122 h120" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M272 138 h60" stroke="var(--border-strong)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        <path d="M272 150 h40" stroke="var(--border-strong)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* lapicera */}
      <g transform="rotate(-32 96 300)">
        <rect x="60" y="294" width="86" height="11" rx="5.5" fill="var(--foreground)" opacity="0.82" />
        <rect x="140" y="293" width="16" height="13" rx="4" fill="var(--primary)" />
      </g>

      {/* resaltador */}
      <g transform="rotate(-6 300 308)">
        <rect x="264" y="298" width="72" height="20" rx="7" fill="var(--highlight)" />
        <rect x="264" y="298" width="14" height="20" rx="6" fill="var(--foreground)" opacity="0.18" />
      </g>

      {/* planta */}
      <g transform="translate(400 268)">
        <path d="M-4 40 L44 40 L38 66 L2 66 Z" fill="var(--border-strong)" />
        <path d="M20 40 C 6 24, 4 6, 18 -8" stroke="#7c9070" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M20 40 C 30 22, 40 12, 40 -2" stroke="#8fa682" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M20 40 C 14 20, 22 6, 6 -4" stroke="#6d8161" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  )
}
