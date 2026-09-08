import { Download } from 'lucide-react'
import { FadeIn, PageHeader } from '@/components/shared'
import { BIBLIOTECA_PROFESIONAL } from '@/data/biblioteca'
import { cn } from '@/lib/utils'

// Agrupa las fichas consecutivas que comparten bloque temático (el array ya
// viene ordenado así), para mostrar un encabezado de sección por bloque.
function agruparPorBloque() {
  const grupos: { bloque: string; fichas: typeof BIBLIOTECA_PROFESIONAL }[] = []
  for (const ficha of BIBLIOTECA_PROFESIONAL) {
    const ultimo = grupos[grupos.length - 1]
    if (ultimo && ultimo.bloque === ficha.bloque) ultimo.fichas.push(ficha)
    else grupos.push({ bloque: ficha.bloque, fichas: [ficha] })
  }
  return grupos
}

export default function BibliotecaPage() {
  const grupos = agruparPorBloque()

  return (
    <FadeIn>
      <PageHeader
        title="Biblioteca para el profesional"
        subtitle="Material de formación continua: teoría, técnica y referencias para acompañar el proceso de orientación."
      />

      <div className="space-y-8">
        {grupos.map((grupo) => (
          <section key={grupo.bloque}>
            <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-faint">{grupo.bloque}</h2>
            <div className="space-y-3">
              {grupo.fichas.map((ficha) => (
                <div key={ficha.numero} className="rounded-xl border bg-surface p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[12px] font-bold text-primary-strong">
                      {ficha.numero}
                    </span>
                    <p className="text-[14.5px] font-semibold">{ficha.titulo}</p>
                  </div>

                  {ficha.recursos.length === 0 ? (
                    <p className="mt-3 pl-9 text-[12.5px] text-faint italic">Contenido próximamente.</p>
                  ) : (
                    <div className="mt-3 grid gap-3 pl-9 sm:grid-cols-2 xl:grid-cols-3">
                      {ficha.recursos.map((recurso) => {
                        const contenido = (
                          <>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-[13px] font-semibold">{recurso.titulo}</p>
                              {recurso.href ? (
                                <Download className="h-3.5 w-3.5 shrink-0 text-primary" />
                              ) : (
                                <span
                                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                                  style={{ color: '#1faa59', backgroundColor: 'rgba(31, 170, 89, 0.12)' }}
                                >
                                  Recomendación
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[11.5px] font-medium text-faint">{recurso.autor}</p>
                            <p className="mt-1.5 line-clamp-3 text-[12px] leading-relaxed text-muted-foreground">
                              {recurso.descripcion}
                            </p>
                          </>
                        )
                        return recurso.href ? (
                          <a
                            key={recurso.titulo}
                            href={recurso.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'rounded-xl border bg-surface p-3.5 transition-all hover:border-border-strong hover:shadow-sm',
                            )}
                          >
                            {contenido}
                          </a>
                        ) : (
                          <div key={recurso.titulo} className="rounded-xl border border-dashed bg-surface-2/40 p-3.5">
                            {contenido}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 text-[11.5px] text-faint">
        Los libros y artículos se citan como referencia para buscarlos en tu biblioteca o librería de confianza —
        solo el material propio de Método Brújula está disponible para descargar directamente.
      </p>
    </FadeIn>
  )
}
