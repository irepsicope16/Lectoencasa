import { Link } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Isotipo } from '@/branding/Logo'

const PASOS = [
  {
    titulo: 'Preparate',
    desc: 'Guardá el celular, tené los materiales a mano y mirá qué vas a estudiar hoy.',
    herramienta: 'Rutina de inicio',
  },
  {
    titulo: 'Primera lectura, panorama general',
    desc: 'Leé una vez rápido, sin detenerte en detalles. Solo entender de qué se trata.',
    herramienta: 'Lectura por capas',
  },
  {
    titulo: 'Segunda lectura, a fondo',
    desc: 'Ahora sí: buscá la idea principal de cada parte y anotá las palabras que no entendés.',
    herramienta: 'Idea principal · Glosario',
  },
  {
    titulo: 'Organizá lo que entendiste',
    desc: 'Armá un resumen propio o un mapa conceptual con las ideas y cómo se conectan.',
    herramienta: 'Resumen · Mapas conceptuales',
  },
  {
    titulo: 'Guardalo en la memoria',
    desc: 'Cerrá el material e intentá recordar sin mirar. Repetí este paso en otro día, no todo junto.',
    herramienta: 'Recuperación activa · Práctica espaciada',
  },
  {
    titulo: 'Confirmá que lo sabés',
    desc: 'Explicáselo a alguien con tus palabras, sin mirar el material. Si te trabás, volvé al paso 3.',
    herramienta: 'Explicación con propias palabras',
  },
]

export default function PrintPasosEstudioPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="no-print mb-6 flex items-center justify-between">
        <Link to="/pro/biblioteca" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver
        </Link>
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Imprimir
        </Button>
      </div>

      <div className="print-page rounded-xl border bg-surface p-8">
        <div className="mb-6 flex items-center gap-2">
          <Isotipo size={26} />
          <span className="font-display text-[14px] font-semibold tracking-tight">
            Método <span className="text-accent">Estudio</span>
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold tracking-tight">Pasos para estudiar un tema</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Un recorrido de 6 pasos, con la herramienta de la Biblioteca que corresponde a cada uno.
        </p>

        <ol className="mt-6 space-y-4">
          {PASOS.map((p, i) => (
            <li key={p.titulo} className="flex gap-3.5 border-b border-dashed pb-4 last:border-0">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-semibold text-white"
                style={{ background: i % 2 === 0 ? 'var(--color-accent)' : 'var(--color-secondary)' }}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-[14.5px] font-semibold">{p.titulo}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">{p.desc}</p>
                <span className="mt-1.5 inline-block rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[10.5px] text-secondary-strong">
                  {p.herramienta}
                </span>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 border-t border-dashed pt-3 text-[11px] text-faint">
          Método Estudio · llevátelo impreso a tu lugar de estudio
        </p>
      </div>
    </div>
  )
}
