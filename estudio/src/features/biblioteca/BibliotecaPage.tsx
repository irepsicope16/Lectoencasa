import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { FadeIn, PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RUTAS } from '@/data/rutas'
import { FICHAS_POR_RUTA, type NivelHerramienta } from '@/data/biblioteca'
import { DIMENSIONES } from '@/data/items'
import { cn } from '@/lib/utils'

const NIVEL_LABEL: Record<NivelHerramienta, string> = {
  1: 'Nivel 1 · inicial',
  2: 'Nivel 2 · medio',
  3: 'Nivel 3 · avanzado',
}

const NIVEL_BADGE_VARIANT: Record<NivelHerramienta, 'default' | 'primario' | 'acento'> = {
  1: 'default',
  2: 'primario',
  3: 'acento',
}

type FiltroNivel = 'todos' | NivelHerramienta

export default function BibliotecaPage() {
  const [filtro, setFiltro] = useState<FiltroNivel>('todos')

  return (
    <FadeIn>
      <PageHeader
        title="Biblioteca de herramientas"
        subtitle="Una ficha por cada herramienta de las 8 rutas: qué es, para qué sirve y cómo aplicarla en sesión."
      />

      <div className="mb-6 rounded-xl border bg-surface p-4">
        <p className="mb-2.5 text-[12.5px] text-muted-foreground">
          El nivel es una complejidad orientativa, no una edad — depende de dónde está cada estudiante, no de cuántos
          años tiene. Un estudiante de nivel superior puede necesitar arrancar por el Nivel 1.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(['todos', 1, 2, 3] as FiltroNivel[]).map((n) => (
            <Button
              key={n}
              size="sm"
              variant={filtro === n ? 'default' : 'outline'}
              onClick={() => setFiltro(n)}
            >
              {n === 'todos' ? 'Todos los niveles' : NIVEL_LABEL[n]}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {RUTAS.map((ruta) => {
          const fichas = (FICHAS_POR_RUTA[ruta.id] ?? []).filter((f) => filtro === 'todos' || f.nivel === filtro)
          if (fichas.length === 0) return null
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
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="text-[14px]">{ficha.herramienta}</CardTitle>
                        <Badge variant={NIVEL_BADGE_VARIANT[ficha.nivel]} className={cn(ficha.nivel === 1 && 'text-muted-foreground')}>
                          {NIVEL_LABEL[ficha.nivel]}
                        </Badge>
                      </div>
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
        estudiante, y de qué nivel partir, sigue siendo un criterio profesional, no una indicación automática.
      </p>
    </FadeIn>
  )
}
