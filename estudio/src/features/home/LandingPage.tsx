import { Link } from 'react-router-dom'
import { Isotipo, BrandCover } from '@/branding/Logo'
import { Button } from '@/components/ui/button'
import { AvisoOrientativo } from '@/components/shared'

// Mismo canal de WhatsApp que ya usa Método Brújula (Lic. Irene Morbidelli).
// Confirmar si Método Estudio debe usar otro número o casilla propia.
const WHATSAPP_URL =
  'https://wa.me/5492216185376?text=Hola%20Irene%2C%20quiero%20consultar%20sobre%20M%C3%A9todo%20Estudio.'

const PASOS = [
  {
    paso: 'Entrevista inicial',
    texto: 'Contamos el motivo, la historia académica y el contexto — 20 a 30 minutos, con vos y con quien acompañe.',
  },
  {
    paso: 'Autoperfil por dimensiones',
    texto: 'Responde el estudiante: organización, lectura, escritura, memoria, autorregulación y más. Sin respuestas correctas.',
  },
  {
    paso: 'Plan compartido',
    texto: 'Dos o tres objetivos concretos, con herramientas para probar y una fecha de revisión — nunca más de eso a la vez.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5 lg:px-10">
        <div className="flex items-center gap-2.5">
          <Isotipo size={30} />
          <span className="font-display text-[16px] font-semibold tracking-tight">Método Estudio</span>
        </div>
        <Button asChild variant="outline">
          <Link to="/login">Ingresar</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-[1100px] px-6 pb-20 pt-6 lg:px-10">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-accent-strong">
              Acompañamiento en estrategias de estudio
            </p>
            <h1 className="font-display mt-3 text-[32px] font-semibold leading-[1.15] tracking-tight sm:text-[40px]">
              Cómo estudia cada quien, con evidencia — nunca con una etiqueta.
            </h1>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
              Un perfil por dimensiones construido con lo que contás vos, lo que observa la profesional, y sin
              diagnósticos automáticos. Para adolescentes desde los 12 años, estudiantes terciarios,
              universitarios y adultos en situación de estudio.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  Solicitar acceso
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Ya tengo cuenta</Link>
              </Button>
            </div>
            <p className="mt-3 text-[12.5px] text-faint">
              El acceso lo habilita la profesional después de coordinar — no hay registro abierto.
            </p>
          </div>
          <BrandCover className="max-w-[380px] justify-self-center lg:justify-self-end" />
        </section>

        <section className="mt-20">
          <h2 className="font-display text-center text-[22px] font-semibold tracking-tight">Cómo empieza el proceso</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {PASOS.map((p, i) => (
              <div key={p.paso} className="rounded-xl border bg-surface p-5 shadow-[0_1px_2px_rgba(16,24,32,0.04),0_4px_14px_-6px_rgba(16,24,32,0.07)]">
                <span className="font-mono text-[11px] font-medium text-faint">PASO {i + 1}</span>
                <h3 className="mt-1.5 text-[14.5px] font-semibold">{p.paso}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{p.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 max-w-[640px]">
          <AvisoOrientativo />
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-[1100px] px-6 py-6 text-[12.5px] text-faint lg:px-10">
          <p className="font-medium text-muted-foreground">Lic. Irene Morbidelli — Psicopedagogía</p>
          <p className="mt-0.5">Método Estudio</p>
        </div>
      </footer>
    </div>
  )
}
