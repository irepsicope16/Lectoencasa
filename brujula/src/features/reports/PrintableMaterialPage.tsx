import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Isotipo } from '@/branding/Logo'
import { useAuthStore } from '@/stores/authStore'
import { PRINTABLES_EXTRA } from './printablesExtra'

// ============================================================
// Plantillas imprimibles del método (láminas de trabajo en papel).
// Se abren desde los materiales de cada módulo y se imprimen o
// guardan como PDF con un clic. Renderizadas como HTML/SVG →
// salida vectorial nítida en cualquier impresora.
// ============================================================

const RUEDA_AREAS = [
  'Estudio',
  'Trabajo futuro',
  'Familia',
  'Amistades',
  'Salud',
  'Tiempo libre',
  'Dinero',
  'Crecimiento personal',
]

function RuedaDeLaVida() {
  const cx = 300
  const cy = 265
  const R = 210
  const sectores = RUEDA_AREAS.length
  return (
    <>
      <Instrucciones
        texto="Imaginá que esta rueda representa cómo te gustaría vivir tu vida en unos años. Para cada área, pintá desde el centro hasta el nivel IDEAL que te gustaría alcanzar (1 = centro, 10 = borde). Después conversamos: ¿qué áreas valorás más? ¿Qué te gustaría que mejore? ¿Tu futura ocupación puede ayudar con alguna?"
      />
      <svg viewBox="0 0 600 565" className="mx-auto block w-full max-w-[560px]">
        {/* anillos 1..10 */}
        {Array.from({ length: 10 }, (_, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={(R / 10) * (i + 1)}
            fill="none"
            stroke={i === 9 ? '#14a098' : '#d9d9d5'}
            strokeWidth={i === 9 ? 2 : 0.75}
          />
        ))}
        {/* radios y etiquetas */}
        {RUEDA_AREAS.map((area, i) => {
          const a = (i / sectores) * Math.PI * 2 - Math.PI / 2
          const am = ((i + 0.5) / sectores) * Math.PI * 2 - Math.PI / 2
          const lx = cx + (R + 30) * Math.cos(am)
          const ly = cy + (R + 30) * Math.sin(am)
          return (
            <g key={area}>
              <line
                x1={cx}
                y1={cy}
                x2={cx + R * Math.cos(a)}
                y2={cy + R * Math.sin(a)}
                stroke="#8b87d4"
                strokeWidth={1}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="600"
                fill="#1d1f24"
              >
                {area}
              </text>
            </g>
          )
        })}
        <circle cx={cx} cy={cy} r={3} fill="#14a098" />
        {/* escala de referencia */}
        <text x={cx + 6} y={cy - R + 12} fontSize="9" fill="#9aa0ac">10</text>
        <text x={cx + 6} y={cy - R / 2} fontSize="9" fill="#9aa0ac">5</text>
        <text x={cx + 6} y={cy - 8} fontSize="9" fill="#9aa0ac">1</text>
      </svg>
      <NotasFinales lineas={3} pregunta="Mirando tu rueda: ¿qué descubrís?" />
    </>
  )
}

function LineaDeVida() {
  return (
    <>
      <Instrucciones texto="Marcá sobre la línea los momentos más importantes de tu vida: cambios, logros, personas, descubrimientos, mudanzas. Poné arriba los momentos lindos y abajo los difíciles. Al lado de cada marca, escribí qué pasó y qué edad tenías." />
      <div className="relative mx-auto my-16 h-[340px]">
        <div className="absolute left-0 right-0 top-1/2 h-[2.5px] bg-[#14a098]" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border-2 border-[#14a098] bg-white px-3 py-1 text-[11px] font-semibold">
          Nacimiento
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border-2 border-[#8b87d4] bg-white px-3 py-1 text-[11px] font-semibold">
          Hoy
        </div>
        <p className="absolute left-1/2 top-2 -translate-x-1/2 text-[11px] font-medium text-[#0e7f79]">
          ↑ momentos lindos
        </p>
        <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-medium text-[#6f6ac1]">
          ↓ momentos difíciles
        </p>
      </div>
      <NotasFinales lineas={3} pregunta="¿Qué momento elegirías como el más importante? ¿Por qué?" />
    </>
  )
}

function TrianguloVida() {
  return (
    <>
      <Instrucciones texto="Este triángulo representa tu vida. En cada vértice escribí uno de los TRES pilares que querés que la sostengan (por ejemplo: una pasión, un vínculo, un valor, un proyecto). En el centro, escribí qué —o quién— querés ser." />
      <svg viewBox="0 0 520 440" className="mx-auto block w-full max-w-[520px]">
        <polygon points="260,60 60,380 460,380" fill="none" stroke="#14a098" strokeWidth="2.5" />
        {[
          { x: 260, y: 42, label: 'Pilar 1' },
          { x: 78, y: 408, label: 'Pilar 2' },
          { x: 442, y: 408, label: 'Pilar 3' },
        ].map((v) => (
          <g key={v.label}>
            <rect x={v.x - 75} y={v.y - 16} width="150" height="34" rx="8" fill="#edecf9" stroke="#8b87d4" />
            <text x={v.x} y={v.y + 5} textAnchor="middle" fontSize="11" fill="#6f6ac1" fontWeight="600">
              {v.label}: ______________
            </text>
          </g>
        ))}
        <circle cx="260" cy="290" r="58" fill="#e3f4f2" stroke="#14a098" strokeWidth="1.5" />
        <text x="260" y="283" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0e7f79">
          Quiero ser…
        </text>
        <text x="260" y="300" textAnchor="middle" fontSize="10" fill="#62687a">
          ________________
        </text>
      </svg>
      <NotasFinales lineas={3} pregunta="Si un pilar faltara, ¿qué pasaría? ¿Cuál es innegociable?" />
    </>
  )
}

function NoSiQuiero() {
  const col = (titulo: string, color: string) => (
    <div className="flex-1">
      <p className="mb-3 rounded-lg px-3 py-2 text-center text-[14px] font-bold" style={{ background: color }}>
        {titulo}
      </p>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="mb-5 border-b border-neutral-300" />
      ))}
    </div>
  )
  return (
    <>
      <Instrucciones texto="A veces es más fácil empezar por el descarte. Con total honestidad (nadie te va a juzgar), completá las dos listas: todo lo que ya sabés que NO querés para tu vida y tu futuro… y todo lo que SÍ querés." />
      <div className="mt-8 flex gap-8">
        {col('Lo que NO quiero', '#fbeae9')}
        {col('Lo que SÍ quiero', '#e3f4f2')}
      </div>
    </>
  )
}

function ArbolProfesiones() {
  const fila = (titulo: string, cajas: number) => (
    <div className="mb-7">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#6f6ac1]">{titulo}</p>
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: cajas }, (_, i) => (
          <div key={i} className="h-[64px] w-[150px] rounded-lg border-2 border-dashed border-neutral-300 p-1.5">
            <p className="text-[9px] text-neutral-400">Nombre y profesión/oficio:</p>
          </div>
        ))}
      </div>
    </div>
  )
  return (
    <>
      <Instrucciones texto="Armá el árbol de profesiones de tu familia: ¿a qué se dedica (o dedicó) cada uno? Anotá también las frases que se dicen de cada trabajo («era lo que había», «se sacrificó», «vive de lo que ama»). Después miralo de lejos: ¿hay tradiciones? ¿Alguien las rompió? ¿Qué se espera de vos?" />
      <div className="mt-6">
        {fila('Abuelos y abuelas', 4)}
        {fila('Madre · Padre · Tíos y tías', 4)}
        {fila('Hermanos, primos mayores u otras personas importantes', 3)}
        <div className="mt-2 rounded-xl border-2 border-[#14a098] p-3">
          <p className="text-[11px] font-bold text-[#0e7f79]">VOS — ¿Qué frases sobre estudio y trabajo escuchaste siempre en tu casa?</p>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="mt-5 border-b border-neutral-300" />
          ))}
        </div>
      </div>
    </>
  )
}

function MapaProyecto() {
  const areas = [
    ['Formación', '¿Qué querés aprender en los próximos años?'],
    ['Trabajo', '¿Cómo imaginás tu trabajo ideal?'],
    ['Lugar', '¿Dónde y cómo querés vivir?'],
    ['Vínculos', '¿Con quiénes querés compartir tu vida?'],
    ['Estilo de vida', '¿Cómo es una semana ideal para vos?'],
    ['Sueño grande', 'Eso que ni te animás a decir en voz alta.'],
  ]
  return (
    <>
      <Instrucciones texto="Tu proyecto de vida es más grande que una carrera. Completá cada área con tus palabras: no hay respuestas correctas, hay respuestas tuyas." />
      <div className="mt-6 grid grid-cols-2 gap-4">
        {areas.map(([titulo, ayuda]) => (
          <div key={titulo} className="rounded-xl border-2 border-neutral-200 p-3">
            <p className="text-[12px] font-bold text-[#0e7f79]">{titulo}</p>
            <p className="text-[10px] italic text-neutral-400">{ayuda}</p>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="mt-5 border-b border-neutral-300" />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

function Instrucciones({ texto }: { texto: string }) {
  return (
    <p className="rounded-xl bg-[#f6f6f4] p-4 text-[12.5px] leading-relaxed text-neutral-600">{texto}</p>
  )
}

function NotasFinales({ pregunta, lineas }: { pregunta: string; lineas: number }) {
  return (
    <div className="mt-6">
      <p className="text-[12px] font-semibold text-neutral-700">{pregunta}</p>
      {Array.from({ length: lineas }, (_, i) => (
        <div key={i} className="mt-6 border-b border-neutral-300" />
      ))}
    </div>
  )
}

export const PRINTABLES: Record<string, { titulo: string; componente: () => React.ReactNode }> = {
  ...PRINTABLES_EXTRA,
  'rueda-vida': { titulo: 'La Rueda de la Vida', componente: RuedaDeLaVida },
  'linea-vida': { titulo: 'Mi línea de vida', componente: LineaDeVida },
  'triangulo-vida': { titulo: 'El Triángulo de mi vida', componente: TrianguloVida },
  'no-si-quiero': { titulo: 'Lo que NO quiero · Lo que SÍ quiero', componente: NoSiQuiero },
  'arbol-profesiones': { titulo: 'Árbol de profesiones de mi familia', componente: ArbolProfesiones },
  'mapa-proyecto': { titulo: 'Mapa de mi proyecto de vida', componente: MapaProyecto },
}

export default function PrintableMaterialPage() {
  const { printableId = '' } = useParams<{ printableId: string }>()
  const user = useAuthStore((s) => s.user)
  const def = PRINTABLES[printableId]
  const volverA = user?.role === 'consultante' ? '/mi/materiales' : '/pro/metodo'

  if (!def) {
    return (
      <div className="py-20 text-center text-sm text-faint">
        Plantilla no encontrada.{' '}
        <Link to={volverA} className="text-primary underline">
          Volver
        </Link>
      </div>
    )
  }

  const Cuerpo = def.componente
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b bg-surface px-6 py-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to={volverA}>
            <ArrowLeft /> Volver
          </Link>
        </Button>
        <p className="text-[12.5px] text-muted-foreground">
          Imprimí la lámina o guardala como PDF (Imprimir → Guardar como PDF)
        </p>
        <Button size="sm" onClick={() => window.print()}>
          <Printer /> Imprimir
        </Button>
      </div>

      <div className="mx-auto max-w-[760px] px-8 py-8">
        <header className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-3">
            <Isotipo size={36} />
            <div>
              <p className="text-[13px] font-semibold leading-tight">Método Brújula</p>
              <p className="text-[9.5px] uppercase tracking-[0.14em] text-neutral-500">Psicope con Ire</p>
            </div>
          </div>
          <div className="text-right text-[11px] text-neutral-500">
            <p>Nombre: ______________________________</p>
            <p className="mt-1.5">Fecha: ____ / ____ / ______</p>
          </div>
        </header>

        <h1 className="mb-4 text-[20px] font-bold tracking-tight">{def.titulo}</h1>
        <Cuerpo />

        <footer className="mt-8 border-t border-neutral-200 pt-3 text-center text-[9.5px] text-neutral-400">
          Método Brújula · Encontrá tu norte. Construí tu camino. · Psicope con Ire
        </footer>
      </div>
    </div>
  )
}
