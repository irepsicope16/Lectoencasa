import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Download, FileText } from 'lucide-react'
import { FadeIn, PageHeader } from '@/components/shared'
import { MODULES } from '@/data/modules'
import { STAGE_HEX, STAGES } from '@/lib/constants'
import { Isotipo } from '@/branding/Logo'
import { BIBLIOGRAFIA } from '@/data/bibliografia'

export default function MethodOverviewPage() {
  return (
    <FadeIn>
      <PageHeader
        title="Método Brújula"
        subtitle="12 módulos · 5 etapas · un camino de orientación que no es un test."
      />

      <div className="mb-8 flex items-center gap-5 rounded-xl border bg-surface p-6">
        <Isotipo size={56} />
        <div>
          <p className="max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
            El método recorre cinco etapas: primero <strong className="text-foreground">conocerse</strong> (historia,
            identidad), después <strong className="text-foreground">valorarse</strong> (valores, deseos, mandatos),
            luego <strong className="text-foreground">explorar</strong> (fortalezas, intereses, aptitudes y mundo real),
            para poder <strong className="text-foreground">decidir</strong> (proyecto de vida, carreras) y finalmente{' '}
            <strong className="text-foreground">actuar</strong> (plan de acción). Cada módulo alimenta el Motor Brújula
            con evidencia real del proceso.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {(Object.keys(STAGES) as (keyof typeof STAGES)[]).map((stage) => (
          <section key={stage}>
            <div className="mb-3 flex items-baseline gap-3">
              <span
                style={{ background: STAGE_HEX[stage].soft, color: STAGE_HEX[stage].solid }}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold"
              >
                {STAGES[stage].orden}
              </span>
              <h2 className="text-[16px] font-semibold tracking-tight">{STAGES[stage].nombre}</h2>
              <span className="text-[12.5px] text-faint">{STAGES[stage].descripcion}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {MODULES.filter((m) => m.etapa === stage).map((mod) => (
                <Link
                  key={mod.id}
                  to={`/pro/metodo/${mod.id}`}
                  style={{ borderLeftColor: STAGE_HEX[mod.etapa].solid, borderLeftWidth: 3 }}
                  className="group rounded-xl border bg-surface p-4 transition-all hover:border-border-strong hover:shadow-sm"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                    Módulo {mod.numero}
                  </p>
                  <p className="mt-0.5 text-[15px] font-semibold">{mod.nombre}</p>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">
                    {mod.esencia}
                  </p>
                  <p className="mt-2.5 text-[11.5px] text-faint">
                    {mod.actividades.length} actividades · {mod.videos.length} videos · {mod.materiales.length}{' '}
                    materiales
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-[12px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Ver módulo <ArrowRight className="h-3 w-3" />
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* bibliografía */}
      <section className="mt-10 border-t pt-8">
        <div className="mb-3 flex items-baseline gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
          </span>
          <h2 className="text-[16px] font-semibold tracking-tight">Bibliografía para profesionales</h2>
          <span className="text-[12.5px] text-faint">Material de consulta y referencias teóricas</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {BIBLIOGRAFIA.map((item) => {
            const Contenido = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13.5px] font-semibold">{item.titulo}</p>
                  {item.href && <Download className="h-3.5 w-3.5 shrink-0 text-primary" />}
                </div>
                <p className="mt-1 text-[11.5px] font-medium text-faint">{item.autor}</p>
                <p className="mt-1.5 line-clamp-3 text-[12.5px] leading-relaxed text-muted-foreground">
                  {item.descripcion}
                </p>
              </>
            )
            return item.href ? (
              <a
                key={item.titulo}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border bg-surface p-4 transition-all hover:border-border-strong hover:shadow-sm"
              >
                {Contenido}
              </a>
            ) : (
              <div key={item.titulo} className="rounded-xl border border-dashed bg-surface-2/40 p-4">
                {Contenido}
              </div>
            )
          })}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-faint">
          <FileText className="h-3 w-3" /> Los libros y artículos se citan como referencia para buscarlos en tu
          biblioteca o librería de confianza — solo el material propio de Método Brújula está disponible para
          descargar acá.
        </p>
      </section>
    </FadeIn>
  )
}
