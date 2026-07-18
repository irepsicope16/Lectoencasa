import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeIn, PageHeader } from '@/components/shared'
import { MODULES } from '@/data/modules'
import { STAGES } from '@/lib/constants'
import { Isotipo } from '@/branding/Logo'

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
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-soft text-[12px] font-bold text-primary-strong">
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
    </FadeIn>
  )
}
