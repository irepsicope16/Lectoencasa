import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, Flame, ListChecks, Sparkles, Timer } from 'lucide-react'
import { usePerfilStore } from '@/stores/perfilStore'
import { useActividadesProbadas, useDiario, useFichas, useResponses, useSesionesEstudio, useSnapshots } from '@/hooks/queries'
import { ITEMS } from '@/data/items'
import { RUTAS } from '@/data/rutas'
import { MENSAJES } from '@/data/mensajes'
import { calcularRacha } from '@/lib/progreso'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { AvisoOrientativo, EmptyState, FadeIn, PageHeader, StatCard } from '@/components/shared'
import { BrandCover } from '@/branding/Logo'

export default function InicioPage() {
  const nombre = usePerfilStore((s) => s.nombre)
  const { data: responses = [] } = useResponses()
  const { data: snapshots = [] } = useSnapshots()
  const { data: actividades = [] } = useActividadesProbadas()
  const { data: sesiones = [] } = useSesionesEstudio()
  const { data: diario = [] } = useDiario()
  const { data: fichas = [] } = useFichas()

  const respondidos = new Set(responses.map((r) => r.itemId)).size
  const autoperfilCompleto = respondidos >= ITEMS.length && snapshots.length > 0

  if (!nombre) {
    return <Bienvenida />
  }

  const fechasActividad = [
    ...actividades.filter((a) => a.fechaCompletada).map((a) => a.fechaCompletada!),
    ...sesiones.map((s) => s.fecha),
    ...diario.map((d) => d.fecha),
  ]
  const racha = calcularRacha(fechasActividad)
  const completadas = actividades.filter((a) => a.estado === 'completada')
  const minutosEstudiados = sesiones.reduce((acc, s) => acc + s.duracionMin, 0)

  const rutaPrioritaria = [...snapshots].sort((a, b) => {
    const orden: Record<string, number> = { alta: 0, moderada: 1, leve: 2, baja: 3 }
    return (orden[a.banda ?? 'baja'] ?? 4) - (orden[b.banda ?? 'baja'] ?? 4)
  })[0]
  const ruta = rutaPrioritaria ? RUTAS.find((r) => r.dimensiones.includes(rutaPrioritaria.dimension)) : undefined

  return (
    <FadeIn className="space-y-5">
      <PageHeader title={`Hola, ${nombre}`} subtitle="Tu espacio para mejorar cómo estudiás." />

      {!autoperfilCompleto && (
        <Card className="border-accent/30 bg-accent-soft/40">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 shrink-0 text-accent-strong" />
              <div>
                <p className="text-[13.5px] font-medium">Empezá por tu autoperfil</p>
                <p className="text-[12px] text-muted-foreground">
                  {respondidos}/{ITEMS.length} preguntas respondidas — así te sugerimos por dónde arrancar.
                </p>
              </div>
            </div>
            <Button asChild size="sm">
              <Link to="/autoperfil">{respondidos > 0 ? 'Continuar' : 'Empezar'}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={Flame} label="Racha" value={racha} hint={racha > 0 ? 'días seguidos' : 'empezá hoy'} tone="acento" />
        <StatCard icon={ListChecks} label="Actividades completadas" value={completadas.length} tone="primario" />
        <StatCard icon={Clock} label="Minutos de estudio" value={minutosEstudiados} tone="secundario" />
      </div>

      {autoperfilCompleto && ruta && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Te conviene empezar por: {ruta.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-0">
            <Button asChild size="sm">
              <Link to="/actividades">Ver actividades de esta ruta</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/biblioteca">Ver en la Biblioteca</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[14px]">
              <Timer className="h-4 w-4 text-primary" /> Herramientas
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-0">
            <Button asChild size="sm" variant="outline">
              <Link to="/herramientas/cronometro">Cronómetro</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/herramientas/mapas">Mapas conceptuales</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/herramientas/fichas">Fichas de repaso</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/herramientas/diario">Diario</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[14px]">
              <BookOpen className="h-4 w-4 text-primary" /> Biblioteca
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {fichas.length === 0 && completadas.length === 0 ? (
              <EmptyState icon={ListChecks} title="Todavía no probaste ninguna técnica" description="Explorá la biblioteca de herramientas por área." />
            ) : (
              <p className="text-[12.5px] text-muted-foreground">
                Ya probaste {completadas.length} {completadas.length === 1 ? 'actividad' : 'actividades'} y armaste {fichas.length} {fichas.length === 1 ? 'ficha' : 'fichas'} de repaso.
              </p>
            )}
            <Button asChild size="sm" variant="outline" className="mt-3">
              <Link to="/biblioteca">Explorar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </FadeIn>
  )
}

function Bienvenida() {
  const setNombre = usePerfilStore((s) => s.setNombre)
  const [valor, setValor] = useState('')

  return (
    <FadeIn className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md text-center">
        <BrandCover className="mx-auto max-w-[260px]" />
        <h1 className="font-display mt-6 text-[22px] font-semibold tracking-tight">
          Descubrí cómo estudiás mejor
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          Un autoperfil, una biblioteca de técnicas y herramientas para probar qué te funciona a vos — sin
          cuentas, sin que nadie más vea tus datos. Quedan guardados en este dispositivo.
        </p>
        <div className="mt-6 space-y-3 text-left">
          <Label htmlFor="nombre">¿Cómo te llamás?</Label>
          <Input
            id="nombre"
            autoFocus
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Tu nombre"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && valor.trim()) setNombre(valor.trim())
            }}
          />
          <Button className="w-full" disabled={!valor.trim()} onClick={() => setNombre(valor.trim())}>
            Empezar
          </Button>
        </div>
        <p className="mt-5 text-[12px] text-faint">{MENSAJES.emergencia}</p>
      </div>
    </FadeIn>
  )
}
