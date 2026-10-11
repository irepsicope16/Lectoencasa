import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { addDays, format, isWithinInterval, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { BookOpen, CalendarDays, Clock, Flame, ListChecks, Sparkles, Timer, Trophy } from 'lucide-react'
import { usePerfilStore } from '@/stores/perfilStore'
import { useUIStore } from '@/stores/uiStore'
import {
  useActividadesProbadas,
  useDiario,
  useEventosAgenda,
  useFichas,
  useMapas,
  useResponses,
  useSesionesEstudio,
  useSnapshots,
} from '@/hooks/queries'
import { ITEMS } from '@/data/items'
import { RUTAS } from '@/data/rutas'
import { MENSAJES } from '@/data/mensajes'
import { calcularRacha } from '@/lib/progreso'
import { notificarRachaEnRiesgo } from '@/lib/recordatorios'
import { calcularGamificacion } from '@/lib/gamificacion'
import { fechaLocal } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { AvisoOrientativo, EmptyState, FadeIn, InsigniasRow, PageHeader, StatCard } from '@/components/shared'
import { BrandCover } from '@/branding/Logo'

export default function InicioPage() {
  const nombre = usePerfilStore((s) => s.nombre)
  const avisosNavegadorActivos = useUIStore((s) => s.avisosNavegadorActivos)
  const { data: responses = [] } = useResponses()
  const { data: snapshots = [] } = useSnapshots()
  const { data: actividades = [] } = useActividadesProbadas()
  const { data: sesiones = [] } = useSesionesEstudio()
  const { data: diario = [] } = useDiario()
  const { data: fichas = [] } = useFichas()
  const { data: mapas = [] } = useMapas()
  const { data: eventosAgenda = [] } = useEventosAgenda()

  const respondidos = new Set(responses.map((r) => r.itemId)).size
  const autoperfilCompleto = respondidos >= ITEMS.length && snapshots.length > 0

  const fechasActividad = [
    ...actividades.filter((a) => a.fechaCompletada).map((a) => a.fechaCompletada!),
    ...sesiones.map((s) => s.fecha),
    ...diario.map((d) => d.fecha),
  ]
  const racha = calcularRacha(fechasActividad)
  const hoyISO = new Date().toISOString().slice(0, 10)
  const hizoAlgoHoy = fechasActividad.some((f) => f.slice(0, 10) === hoyISO)
  const rachaEnRiesgo = racha > 0 && !hizoAlgoHoy

  useEffect(() => {
    if (rachaEnRiesgo && avisosNavegadorActivos) notificarRachaEnRiesgo(racha)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rachaEnRiesgo, avisosNavegadorActivos])

  if (!nombre) {
    return <Bienvenida />
  }

  const completadas = actividades.filter((a) => a.estado === 'completada')
  const minutosEstudiados = sesiones.reduce((acc, s) => acc + s.duracionMin, 0)

  const { puntos, insignias } = calcularGamificacion({
    actividadesCompletadas: completadas.length,
    rutasDistintasProbadas: new Set(actividades.map((a) => a.rutaId)).size,
    racha,
    sesionesCronometro: sesiones.length,
    fichasCreadas: fichas.length,
    repasosFichas: fichas.reduce((acc, f) => acc + f.vecesRepasada, 0),
    mapasCreados: mapas.length,
    entradasDiario: diario.length,
  })
  const insigniasConseguidas = insignias.filter((i) => i.conseguida)

  const hoyInicio = startOfDay(new Date())
  const proximosEventos = eventosAgenda
    .filter((e) => !e.completado && isWithinInterval(fechaLocal(e.fecha), { start: hoyInicio, end: addDays(hoyInicio, 6) }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 4)

  const rutaPrioritaria = [...snapshots].sort((a, b) => {
    const orden: Record<string, number> = { alta: 0, moderada: 1, leve: 2, baja: 3 }
    return (orden[a.banda ?? 'baja'] ?? 4) - (orden[b.banda ?? 'baja'] ?? 4)
  })[0]
  const ruta = rutaPrioritaria ? RUTAS.find((r) => r.dimensiones.includes(rutaPrioritaria.dimension)) : undefined

  return (
    <FadeIn className="space-y-5">
      <PageHeader title={`Hola, ${nombre}`} subtitle="Tu espacio para mejorar cómo estudiás." />

      {rachaEnRiesgo && (
        <Card className="border-danger/30 bg-danger-soft/40">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 shrink-0 text-danger" />
              <div>
                <p className="text-[13.5px] font-medium">
                  Tu racha de {racha} {racha === 1 ? 'día' : 'días'} está en riesgo
                </p>
                <p className="text-[12px] text-muted-foreground">Todavía no hiciste nada hoy — repasá una ficha o abrí el cronómetro para mantenerla.</p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link to="/herramientas">Ver herramientas</Link>
            </Button>
          </CardContent>
        </Card>
      )}

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

      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard icon={Flame} label="Racha" value={racha} hint={racha > 0 ? 'días seguidos' : 'empezá hoy'} tone="acento" />
        <StatCard icon={ListChecks} label="Actividades completadas" value={completadas.length} tone="primario" />
        <StatCard icon={Clock} label="Minutos de estudio" value={minutosEstudiados} tone="secundario" />
        <StatCard icon={Trophy} label="Puntos" value={puntos} hint={`${insigniasConseguidas.length}/${insignias.length} insignias`} tone="neutro" />
      </div>

      {insigniasConseguidas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[14px]">
              <Trophy className="h-4 w-4 text-primary" /> Tus insignias
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <InsigniasRow insignias={insignias} />
          </CardContent>
        </Card>
      )}

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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-[14px]">
              <CalendarDays className="h-4 w-4 text-primary" /> Agenda — próximos 7 días
            </CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link to="/agenda">Ver semana</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {proximosEventos.length === 0 ? (
            <EmptyState icon={CalendarDays} title="Nada pendiente por ahora" description="Agregá evaluaciones, materiales o cumpleaños desde la Agenda." />
          ) : (
            <div className="space-y-1.5">
              {proximosEventos.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-[12.5px]">
                  <span className="font-medium">{e.titulo}</span>
                  <span className="shrink-0 text-faint">{format(fechaLocal(e.fecha), "d 'de' MMM", { locale: es })}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
