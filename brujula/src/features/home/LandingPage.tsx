import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
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
  ChevronDown,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import dashboardShot from '@/assets/landing/dashboard.png'
import modulosShot from '@/assets/landing/modulos-consultante.png'
import informeShot from '@/assets/landing/informe-preview.png'

const ETAPAS = [
  { n: 1, nombre: 'Conocerte', desc: 'Tu historia, tu identidad', bg: 'bg-primary-soft', text: 'text-primary-strong' },
  { n: 2, nombre: 'Valorarte', desc: 'Valores, deseos y mandatos', bg: 'bg-accent-soft', text: 'text-accent-strong' },
  { n: 3, nombre: 'Explorar', desc: 'Fortalezas, intereses y mundo', bg: 'bg-warning-soft', text: 'text-warning' },
  { n: 4, nombre: 'Decidir', desc: 'Proyecto de vida y carreras', bg: 'bg-rose-soft', text: 'text-rose' },
  { n: 5, nombre: 'Actuar', desc: 'Plan de acción concreto', bg: 'bg-danger-soft', text: 'text-danger' },
]

const COMO_FUNCIONA = [
  {
    icon: Users,
    bg: 'bg-primary-soft',
    iconColor: 'text-primary-strong',
    titulo: '1 · Cargás la ficha',
    desc: 'Una sola vez: datos, foto y motivo de consulta. El acceso del consultante se crea solo.',
  },
  {
    icon: ClipboardCheck,
    bg: 'bg-accent-soft',
    iconColor: 'text-accent-strong',
    titulo: '2 · Acompañás el proceso',
    desc: 'Asignás módulos y actividades según la etapa; registrás sesiones, observaciones y evaluaciones.',
  },
  {
    icon: FileText,
    bg: 'bg-warning-soft',
    iconColor: 'text-warning',
    titulo: '3 · Generás el informe',
    desc: 'Con un clic, armado con los datos reales del proceso. Vos revisás y ajustás lo que necesites.',
  },
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

const FAQ = [
  {
    q: '¿Necesito instalar algo?',
    a: 'No. Funciona desde el navegador, en celular, tablet o computadora. Se puede agregar como ícono en la pantalla de inicio, igual que una app, pero no requiere instalación desde ninguna tienda.',
  },
  {
    q: '¿Mis consultantes tienen que registrarse por su cuenta?',
    a: 'No. Vos cargás la ficha una sola vez y el acceso del consultante se genera solo, con su propia contraseña. Ellos entran para hacer sus actividades entre sesión y sesión, sin pasos extra de tu parte.',
  },
  {
    q: '¿Mis datos y los de mis consultantes están seguros?',
    a: 'Sí. Cada profesional tiene su propia cuenta, completamente aislada del resto: nadie más ve tus fichas, tus consultantes ni tus notas.',
  },
  {
    q: '¿Necesito manejar mucho la tecnología para usarlo?',
    a: 'No. Está pensado para usarse sin conocimientos técnicos — si usás el celular para lo cotidiano, ya sabés lo necesario para trabajar con Método Brújula.',
  },
  {
    q: '¿Sirve para Psicología, Psicopedagogía y Orientación en general?',
    a: 'Sí. Está pensado para cualquier profesional que acompañe procesos de orientación vocacional y ocupacional, sea cual sea su formación de base.',
  },
  {
    q: '¿Reemplaza mi criterio profesional?',
    a: 'No. Método Brújula ordena el proceso y te entrega información (respuestas, actividades, notas) de forma clara, pero sos vos, con tu formación y tu criterio clínico, quien interpreta esos resultados y toma las decisiones de la orientación.',
  },
  {
    q: '¿Los tests son instrumentos validados psicométricamente?',
    a: 'No, y preferimos ser claras al respecto: son cuestionarios de elaboración propia, pensados para orientar la exploración de intereses, aptitudes y valores. No reemplazan un test estandarizado ni se presentan como tal.',
  },
  {
    q: '¿Cuánto cuesta y cómo empiezo?',
    a: 'Escribime desde el registro y coordinamos el valor y los detalles antes de activar tu cuenta — así arrancás con todas tus dudas resueltas.',
  },
]

function Section({
  children,
  className = '',
  id,
  tone,
}: {
  children: React.ReactNode
  className?: string
  id?: string
  tone?: 'surface-2' | 'primary-soft' | 'accent-soft'
}) {
  const bg =
    tone === 'surface-2'
      ? 'bg-surface-2'
      : tone === 'primary-soft'
        ? 'bg-primary-soft'
        : tone === 'accent-soft'
          ? 'bg-accent-soft'
          : ''
  return (
    <div className={bg}>
      <section id={id} className={`mx-auto w-full max-w-5xl px-6 py-14 sm:py-20 ${className}`}>
        {children}
      </section>
    </div>
  )
}

// Página pública: primera pantalla que ve cualquier visitante sin sesión
// iniciada. Si ya hay sesión, va directo a su área — salvo ?preview=1,
// para que la profesional pueda revisarla sin cerrar sesión.
export default function LandingPage() {
  const user = useAuthStore((s) => s.user)
  const [params] = useSearchParams()
  const preview = params.get('preview') === '1'

  if (user && !preview) {
    return <Navigate to={user.role === 'profesional' ? '/pro' : '/mi'} replace />
  }

  return (
    <div className="bg-surface">
      {/* nav */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-surface/90 px-6 py-3 backdrop-blur">
        <Link to="/" className="flex items-center gap-2 text-[13px] font-semibold tracking-tight">
          <Compass className="h-4.5 w-4.5 text-primary" /> Método Brújula
        </Link>
        <nav className="hidden items-center gap-5 text-[13px] text-muted-foreground sm:flex">
          <a href="#como-funciona" className="hover:text-foreground">Cómo funciona</a>
          <a href="#faq" className="hover:text-foreground">Preguntas frecuentes</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button size="sm" className="hidden sm:inline-flex" asChild>
            <Link to="/registro">Quiero conocerlo</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">
              Ya tengo cuenta <ArrowRight />
            </Link>
          </Button>
        </div>
      </header>

      {/* hero */}
      <Section className="relative overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-140px] h-80 w-80 -translate-x-1/2 rounded-full bg-primary-soft opacity-70 blur-3xl" />
          <div className="absolute right-[-60px] top-24 h-64 w-64 rounded-full bg-accent-soft opacity-60 blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-[12px] font-medium tracking-[0.16em] text-faint uppercase">
            Para psicólogos, psicopedagogos y orientadores vocacionales
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-[28px] font-semibold leading-[1.2] tracking-tight sm:text-[38px]">
            Buscar el test. Armar la consigna. Ordenar la carpeta.{' '}
            <span className="text-primary">Volver a empezar con cada consultante.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Método Brújula ordena todo el proceso de Orientación Vocacional en un solo lugar, para que tu
            tiempo se vaya en escuchar, analizar y decidir junto a cada consultante — no en armar
            materiales sueltos ni rehacer el informe a mano.
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
          <p className="mt-6 text-[11.5px] text-faint">
            Creado por la Lic. Irene Morbidelli — Psicopedagoga, M.P. 260505
          </p>
        </motion.div>
      </Section>

      {/* qué es */}
      <Section className="border-t" tone="primary-soft">
        <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">¿Qué es Método Brújula?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[14.5px] leading-relaxed text-muted-foreground">
          Es un método de Orientación Vocacional propio, pensado como un recorrido en 5 etapas — de
          conocerse a sí mismo hasta armar un plan de acción concreto. Cada consultante avanza a su ritmo,
          con actividades y materiales para cada momento del proceso.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-5">
          {ETAPAS.map((e) => (
            <div key={e.n} className="rounded-xl border bg-background p-4 text-center shadow-sm">
              <div
                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold ${e.bg} ${e.text}`}
              >
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
          {COMO_FUNCIONA.map((s) => (
            <div key={s.titulo} className="rounded-2xl border bg-background p-6">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <p className="mt-4 text-[14.5px] font-semibold">{s.titulo}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* screenshots */}
      <Section className="border-t" tone="surface-2">
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
              <div className="mx-auto mt-4 max-w-3xl overflow-hidden rounded-xl border bg-background shadow-[0_1px_2px_rgba(16,24,32,0.04),0_12px_32px_-12px_rgba(16,24,32,0.14)]">
                <div className="flex items-center gap-1.5 border-b bg-surface-2 px-3.5 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-danger/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
                </div>
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
          {INCLUYE.map((f, i) => (
            <div key={f.titulo} className="rounded-xl border bg-background p-5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  i % 2 === 0 ? 'bg-primary-soft' : 'bg-accent-soft'
                }`}
              >
                <f.icon className={`h-4.5 w-4.5 ${i % 2 === 0 ? 'text-primary-strong' : 'text-accent-strong'}`} />
              </div>
              <p className="mt-3 text-[13.5px] font-semibold">{f.titulo}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* beneficios */}
      <Section className="border-t" tone="accent-soft">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">Por qué usarlo</h2>
          <ul className="mt-6 space-y-3">
            {BENEFICIOS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[14px] leading-relaxed">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* preguntas frecuentes */}
      <Section id="faq" className="border-t">
        <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">Preguntas frecuentes</h2>
        <div className="mx-auto mt-8 max-w-2xl space-y-2.5">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-xl border bg-background px-5 py-4 open:pb-4.5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-medium">
                {f.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-faint transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* membresía */}
      <Section className="border-t" tone="primary-soft">
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

      {/* instituciones */}
      <Section className="border-t">
        <div className="mx-auto max-w-lg rounded-2xl border bg-background p-8 text-center">
          <Building2 className="mx-auto h-6 w-6 text-accent-strong" />
          <h2 className="mt-3 text-lg font-semibold tracking-tight">
            ¿Sos un colegio o facultad de Psicopedagogía?
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
            Ofrecemos un descuento por volumen para que los matriculados y estudiantes de tu institución
            accedan a Método Brújula a un precio preferencial — con el mismo modelo simple de siempre, cuenta
            por cuenta.
          </p>
          <Button variant="outline" size="lg" className="mt-6" asChild>
            <Link to="/registro">
              Quiero conocer la propuesta institucional <ArrowRight />
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
          Material elaborado por Lic. Irene Morbidelli — MP: 260505. Uso exclusivo del profesional
          titular de la cuenta: personal e intransferible. Prohibida su reproducción, distribución o
          venta sin autorización expresa de la autora.
        </p>
        <Link to="/" className="mt-3 inline-block text-[12px] text-muted-foreground hover:text-foreground">
          ← Volver al inicio
        </Link>
      </footer>
    </div>
  )
}
