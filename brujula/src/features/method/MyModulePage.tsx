import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ExternalLink, FileText, MonitorPlay, Printer, Target } from 'lucide-react'
import { FadeIn } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/input'
import { useActivities, useCreate, useModuleProgress, useUpdate, useVideos } from '@/hooks/queries'
import { useAuthStore } from '@/stores/authStore'
import { MODULE_MAP, MODULES } from '@/data/modules'
import { ACTIVITY_STATUS, STAGES } from '@/lib/constants'
import type { AssignedVideo, ModuleId, ModuleProgress } from '@/types'
import { useState } from 'react'

export default function MyModulePage() {
  const { moduleId } = useParams<{ moduleId: ModuleId }>()
  const user = useAuthStore((s) => s.user)
  const consultantId = user?.consultantId ?? ''
  const mod = moduleId ? MODULE_MAP[moduleId] : undefined

  const { data: activities = [] } = useActivities()
  const { data: videos = [] } = useVideos()
  const { data: progress = [] } = useModuleProgress()
  const updateVideo = useUpdate<AssignedVideo>('videos', (v) =>
    v.visto
      ? {
          actor: 'consultante' as const,
          consultantId: v.consultantId,
          tipo: 'video_visto' as const,
          descripcion: `${user?.nombre ?? 'Consultante'} vio el video «${v.titulo}»`,
        }
      : null,
  )
  const createProgress = useCreate<ModuleProgress>('moduleProgress')
  const updateProgress = useUpdate<ModuleProgress>('moduleProgress')

  const [nota, setNota] = useState<string | null>(null)

  if (!mod) {
    return (
      <div className="py-20 text-center text-sm text-faint">
        Módulo no encontrado. <Link to="/mi" className="text-primary underline">Volver</Link>
      </div>
    )
  }

  const own = activities.filter((a) => a.consultantId === consultantId && a.moduleId === mod.id)
  const ownVideos = videos.filter((v) => v.consultantId === consultantId && v.moduleId === mod.id)
  const p = progress.find((x) => x.consultantId === consultantId && x.moduleId === mod.id)
  const notaValue = nota ?? p?.notasConsultante ?? ''

  const siguiente = MODULES.find((m) => m.numero === mod.numero + 1)

  const saveNota = async () => {
    if (p) {
      await updateProgress.mutateAsync({ id: p.id, patch: { notasConsultante: notaValue } })
    } else {
      await createProgress.mutateAsync({
        consultantId,
        moduleId: mod.id,
        estado: 'en_progreso',
        notasProfesionales: '',
        notasConsultante: notaValue,
        fechaInicio: new Date().toISOString(),
      })
    }
  }

  return (
    <FadeIn>
      <Link
        to="/mi"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Mi camino
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="lavanda">{STAGES[mod.etapa].nombre}</Badge>
          <Badge variant="outline">Módulo {mod.numero} de 12</Badge>
          {p?.estado === 'completado' && <Badge variant="aqua">Completado ✓</Badge>}
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{mod.nombre}</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
          {mod.paraElConsultante}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* actividades asignadas */}
          <Card>
            <CardHeader>
              <CardTitle>Tus actividades de este módulo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {own.map((a) => (
                <Link
                  key={a.id}
                  to={`/mi/actividades/${a.id}`}
                  className="flex items-center gap-3 rounded-lg border p-3.5 transition-colors hover:bg-surface-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium">{a.titulo}</p>
                    <p className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">{a.descripcion}</p>
                  </div>
                  <Badge
                    variant={
                      a.estado === 'completada' || a.estado === 'revisada'
                        ? 'aqua'
                        : a.estado === 'en_progreso'
                          ? 'lavanda'
                          : 'amber'
                    }
                  >
                    {ACTIVITY_STATUS[a.estado]}
                  </Badge>
                  <ArrowRight className="h-4 w-4 shrink-0 text-faint" />
                </Link>
              ))}
              {own.length === 0 && (
                <p className="text-[13px] text-faint">
                  Tu profesional todavía no te asignó actividades de este módulo.
                </p>
              )}
            </CardContent>
          </Card>

          {/* videos */}
          {ownVideos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MonitorPlay className="h-4 w-4 text-accent-strong" /> Videos para ver
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {ownVideos.map((v) => (
                  <div key={v.id} className="rounded-lg border p-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13.5px] font-medium">{v.titulo}</p>
                      <Badge variant={v.visto ? 'aqua' : 'amber'}>{v.visto ? 'Visto' : 'Pendiente'}</Badge>
                    </div>
                    <p className="mt-1 text-[12.5px] text-muted-foreground">{v.descripcion}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={v.url} target="_blank" rel="noreferrer">
                          <ExternalLink /> Ver video
                        </a>
                      </Button>
                      {!v.visto && (
                        <Button
                          size="sm"
                          variant="soft"
                          onClick={() => updateVideo.mutate({ id: v.id, patch: { visto: true } })}
                        >
                          Ya lo vi ✓
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* mis notas */}
          <Card>
            <CardHeader>
              <CardTitle>Mis notas del módulo</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notaValue}
                onChange={(e) => setNota(e.target.value)}
                onBlur={saveNota}
                placeholder="Anotá acá lo que quieras recordar de este módulo (se guarda solo)…"
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Qué vas a lograr
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1.5 pl-4 text-[13px] text-muted-foreground">
                {mod.objetivos.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Material del módulo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mod.materiales.map((m) => (
                <div key={m.id} className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium">{m.titulo}</p>
                    <Badge variant="outline">{m.tipo}</Badge>
                  </div>
                  <p className="text-[12px] text-muted-foreground">{m.descripcion}</p>
                  {m.printableId && (
                    <Button variant="soft" size="sm" className="mt-2" asChild>
                      <Link to={`/print/material/${m.printableId}`}>
                        <Printer /> Imprimir lámina
                      </Link>
                    </Button>
                  )}
                  {m.url && (
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <a href={m.url} target="_blank" rel="noreferrer">
                        <ExternalLink /> Abrir
                      </a>
                    </Button>
                  )}
                </div>
              ))}
              <p className="text-[11.5px] text-faint">
                Los archivos que te comparta tu profesional aparecen en{' '}
                <Link to="/mi/materiales" className="text-primary underline">
                  Materiales
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {siguiente && (
            <Button variant="outline" className="w-full" asChild>
              <Link to={`/mi/modulos/${siguiente.id}`}>
                Siguiente módulo: {siguiente.nombre} <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </FadeIn>
  )
}
