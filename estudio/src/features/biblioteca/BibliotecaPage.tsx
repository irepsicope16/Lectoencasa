import { BookOpen } from 'lucide-react'
import { FadeIn, PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RUTAS } from '@/data/rutas'
import { FICHAS_POR_RUTA } from '@/data/biblioteca'
import { DIMENSIONES } from '@/data/items'

export default function BibliotecaPage() {
  return (
    <FadeIn>
      <PageHeader
        title="Biblioteca de herramientas"
        subtitle="Una ficha por cada herramienta de las 8 rutas: qué es, para qué sirve y cómo aplicarla en sesión."
      />

      <div className="space-y-8">
        {RUTAS.map((ruta) => {
          const fichas = FICHAS_POR_RUTA[ruta.id] ?? []
          return (
            <section key={ruta.id}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h2 className="text-[15px] font-semibold tracking-tight">{ruta.nombre}</h2>
                <div className="flex flex-wrap gap-1">
                  {ruta.dimensiones.map((d) => (
                    <Badge key={d} variant="secundario" title={DIMENSIONES[d].nombre}>
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                {fichas.map((ficha) => (
                  <Card key={ficha.herramienta}>
                    <CardHeader>
                      <CardTitle className="text-[14px]">{ficha.herramienta}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0 text-[12.5px] leading-relaxed">
                      <p>
                        <span className="font-semibold text-foreground">Qué es: </span>
                        <span className="text-muted-foreground">{ficha.queEs}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Para qué sirve: </span>
                        <span className="text-muted-foreground">{ficha.paraQue}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Cómo aplicarla: </span>
                        <span className="text-muted-foreground">{ficha.comoAplicarla}</span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <p className="mt-8 text-[11.5px] text-faint">
        Estas fichas son una guía de consulta rápida durante la sesión — la elección de qué herramienta usar con cada
        estudiante sigue siendo un criterio profesional, no una indicación automática.
      </p>
    </FadeIn>
  )
}
