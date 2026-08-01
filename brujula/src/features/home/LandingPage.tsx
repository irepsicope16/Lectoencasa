import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Compass,
  FileText,
  HeartHandshake,
  Map,
  Smartphone,
  Sparkles,
  UserRound,
  Users,
  ShieldCheck,
  ClipboardCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import dashboardShot from '@/assets/landing/dashboard.png'
import modulosShot from '@/assets/landing/modulos-consultante.png'
import informeShot from '@/assets/landing/informe-preview.png'

const ETAPAS = [
  { n: 1, nombre: 'Conocerte', desc: 'Tu historia, tu identidad' },
  { n: 2, nombre: 'Valorarte', desc: 'Valores, deseos y mandatos' },
  { n: 3, nombre: 'Explorar', desc: 'Fortalezas, intereses y mundo' },
  { n: 4, nombre: 'Decidir', desc: 'Proyecto de vida y carreras' },
  { n: 5, nombre: 'Actuar', desc: 'Plan de acción concreto' },
]

const INCLUYE = [
  { icon: Compass, titulo: 'El método completo', desc: 'Módulos organizados en 5 etapas, con actividades, videos y materiales para cada consultante.' },
  { icon: Users, titulo: 'Cuenta propia y privada', desc: 'Tu espacio queda aislado del de cualquier otra profesional: solo vos ves y trabajás con tus consultantes.' },
  { icon: FileText, titulo: 'Informes automáticos', desc: 'Profesional, Carta de Navegación, resumen para la familia y para el consultante — generados con los datos reales del proceso.' },
  { icon: Sparkles, titulo: 'Motor Brújula + Asistente IA', desc: 'Lectura del proceso por dimensiones y borradores de informe, siempre revisados por vos.' },
  { icon: Smartphone, titulo: 'Desde cualquier dispositivo', desc: 'Funciona en celular, tablet o computadora — se puede agregar como ícono en la pantalla de inicio.' },
  { icon: UserRound, titulo: 'Acceso para tu consultante', desc: 'Cada consultante tiene su propio ingreso, para hacer actividades entre sesión y sesión.' },
]

const BENEFICIOS = [
  'Ahorrás las horas que lleva armar un informe a mano',
  'Todo el proceso de cada consultante queda ordenado y documentado en un solo lugar',
  'Accedés desde cualquier lugar, en cualquier momento',
  'Tus consultantes avanzan con sus actividades incluso fuera de la sesión',
]

function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-5xl px-6 py-14 sm:py-20 ${className}`}>
      {children}
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="bg-surface">
      {/* nav */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-surface/90 px-6 py-3 backdrop-blur">
        <Link to="/" className="flex items-center gap-2 text-[13px] font-semibold tracking-tight">
          <Compass className="h-4.5 w-4.5 text-primary" /> Método Brújula
        </Link>
        <Link to="/login" className="text-[13px] font-medium text-muted-foreground hover:text-foreground">
          Ya tengo cuenta →
        </Link>
      </header>

      {/* hero */}
      <Section className="text-center">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-[12px] font-medium tracking-[0.16em] text-faint uppercase">
            Psicope con Ire · Plataforma profesional
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Orientación Vocacional, ordenada de punta a punta
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Método Brújula es la plataforma para profesionales de la Psicología y la Psicopedagogía que
            trabajan Orientación Vocacional: cargás a tu consultante una sola vez, la app acompaña todo el
            recorrido, y el informe se arma solo.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/registro">
                Quiero conocerlo <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#como-funciona">Ver cómo funciona</a>
            </Button>
          </div>
        </motion.div>
      </Section>

      {/* qué es */}
      <Section className="border-t">
        <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">¿Qué es Método Brújula?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[14.5px] leading-relaxed text-muted-foreground">
          Es un método de Orientación Vocacional propio, pensado como un recorrido en 5 etapas — de
          conocerse a sí mismo hasta armar un plan de acción concreto. Cada consultante avanza a su ritmo,
          con actividades y materiales para cada momento del proceso.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-5">
          {ETAPAS.map((e) => (
            <div key={e.n} className="rounded-xl border bg-background p-4 text-center">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-[13px] font-semibold text-primary-strong">
                {e.n}
              </div>
              <p className="mt-2.5 text-[13px] font-semibold">{e.nombre}</p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">{e.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* cómo funciona */}
      <Section id="como-funciona" className="border-t">
        <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">Cómo funciona</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: Users,
              titulo: '1 · Cargás la ficha',
              desc: 'Una sola vez: datos, foto y motivo de consulta. El acceso del consultante se crea solo.',
            },
            {
              icon: ClipboardCheck,
              titulo: '2 · Acompañás el proceso',
              desc: 'Asignás módulos y actividades según la etapa; registrás sesiones, observaciones y evaluaciones.',
            },
            {
              icon: FileText,
              titulo: '3 · Generás el informe',
              desc: 'Con un clic, armado con los datos reales del proceso. Vos revisás y ajustás lo que necesites.',
            },
          ].map((s) => (
            <div key={s.titulo} className="rounded-2xl border bg-background p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft">
                <s.icon className="h-5 w-5 text-primary-strong" />
              </div>
              <p className="mt-4 text-[14.5px] font-semibold">{s.titulo}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* screenshots */}
      <Section className="border-t">
        <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">Así se ve por dentro</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-[13.5px] text-muted-foreground">
          Capturas reales de la plataforma, con datos de ejemplo.
        </p>
        <div className="mt-10 space-y-14">
          {[
            { src: dashboardShot, alt: 'Panel principal de la profesional', titulo: 'Tu panel, de un vistazo', desc: 'Consultantes en proceso, próximas sesiones y actividad reciente, todo en una sola pantalla.' },
            { src: modulosShot, alt: 'Seguimiento de módulos de un consultante', titulo: 'El recorrido, módulo a módulo', desc: 'Cada consultante avanza por las 5 etapas del método; vos ves el progreso real en todo momento.' },
            { src: informeShot, alt: 'Informe profesional generado automáticamente', titulo: 'El informe, armado solo', desc: 'Con los datos reales del proceso — profesional, para la familia, o para el propio consultante.' },
          ].map((s) => (
            <div key={s.titulo} className="text-center">
              <p className="text-[14.5px] font-semibold">{s.titulo}</p>
              <p className="mx-auto mt-1 max-w-md text-[13px] text-muted-foreground">{s.desc}</p>
              <div className="mx-auto mt-4 max-w-3xl overflow-hidden rounded-xl border shadow-sm">
                <img src={s.src} alt={s.alt} loading="lazy" className="w-full" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* qué incluye */}
      <Section className="border-t">
        <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">Qué incluye</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INCLUYE.map((f) => (
            <div key={f.titulo} className="rounded-xl border bg-background p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft">
                <f.icon className="h-4.5 w-4.5 text-accent-strong" />
              </div>
              <p className="mt-3 text-[13.5px] font-semibold">{f.titulo}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* beneficios */}
      <Section className="border-t">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">Por qué usarlo</h2>
          <ul className="mt-6 space-y-3">
            {BENEFICIOS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* membresía */}
      <Section className="border-t">
        <div className="mx-auto max-w-lg rounded-2xl border bg-background p-8 text-center shadow-sm">
          <HeartHandshake className="mx-auto h-6 w-6 text-primary" />
          <h2 className="mt-3 text-lg font-semibold tracking-tight">Membresía anual</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
            Acceso completo a la plataforma por un año. Las primeras profesionales que se suman acceden a un
            <strong className="text-foreground"> precio de lanzamiento</strong>, más bajo que el valor
            regular.
          </p>
          <p className="mt-2 text-[12.5px] text-faint">
            Consultá el valor actual al escribir para registrarte — se coordina antes de activar la cuenta.
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link to="/registro">
              Quiero conocer Método Brújula <ArrowRight />
            </Link>
          </Button>
        </div>
      </Section>

      {/* referente */}
      <Section className="border-t text-center">
        <div className="flex items-center justify-center gap-2 text-[12px] font-medium tracking-[0.16em] text-faint uppercase">
          <Map className="h-4 w-4 text-primary" /> Sobre el método
        </div>
        <p className="mx-auto mt-4 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
          Método Brújula es el método de trabajo que la Lic. Irene Morbidelli (MP 260505) usa hace años en
          consulta, ahora digitalizado para que cualquier colega pueda aplicarlo en su propia práctica.
        </p>
      </Section>

      <footer className="border-t px-6 py-10 text-center">
        <p className="mx-auto max-w-md text-[10.5px] leading-relaxed text-faint">
          Material elaborado por Lic. Irene Morbidelli — MP: 260505. Prohibida su reproducción, distribución
          o venta sin autorización expresa de la autora.
        </p>
        <Link to="/" className="mt-3 inline-block text-[12px] text-muted-foreground hover:text-foreground">
          ← Volver al inicio
        </Link>
      </footer>
    </div>
  )
}
