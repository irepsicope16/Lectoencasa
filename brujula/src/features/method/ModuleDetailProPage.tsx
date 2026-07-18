import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Clapperboard, FileText, HelpCircle, Target } from 'lucide-react'
import { FadeIn } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MODULE_MAP } from '@/data/modules'
import { ACTIVITY_KIND, STAGES } from '@/lib/constants'
import type { ModuleId } from '@/types'

export default function ModuleDetailProPage() {
  const { moduleId } = useParams<{ moduleId: ModuleId }>()
  const mod = moduleId ? MODULE_MAP[moduleId] : undefined

  if (!mod) {
    return (
      <div className="py-20 text-center text-sm text-faint">
        Módulo no encontrado. <Link to="/pro/metodo" className="text-primary underline">Volver al método</Link>
      </div>
    )
  }

  return (
    <FadeIn>
      <Link
        to="/pro/metodo"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Método Brújula
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2.5">
          <Badge variant="lavanda">Etapa: {STAGES[mod.etapa].nombre}</Badge>
          <Badge variant="outline">Módulo {mod.numero} de 12</Badge>
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{mod.nombre}</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">{mod.esencia}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Introducción
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[13.5px] leading-relaxed">
              <p>{mod.introduccion}</p>
              <div className="rounded-lg bg-accent-soft/50 p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-accent-strong">
                  Cómo lo ve el consultante
                </p>
                <p className="text-[13px] italic text-foreground/80">“{mod.paraElConsultante}”</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actividades del módulo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mod.actividades.map((a) => (
                <div key={a.id} className="rounded-lg border p-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13.5px] font-medium">{a.titulo}</p>
                    <Badge variant="aqua">{ACTIVITY_KIND[a.tipo]}</Badge>
                    <span className="ml-auto text-[11.5px] text-faint">~{a.duracionMin} min</span>
                  </div>
                  <p className="mt-1 text-[12.5px] text-muted-foreground">{a.descripcion}</p>
                  <ul className="mt-2 list-disc space-y-0.5 pl-5 text-[12.5px] text-muted-foreground">
                    {a.preguntas.map((q) => (
                      <li key={q.id}>{q.texto}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Objetivos
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
                <HelpCircle className="h-4 w-4 text-accent-strong" /> Preguntas guía (sesión)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1.5 pl-4 text-[13px] text-muted-foreground">
                {mod.preguntasGuia.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clapperboard className="h-4 w-4 text-primary" /> Videos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {mod.videos.map((v) => (
                <div key={v.id} className="rounded-lg border p-3">
                  <p className="text-[13px] font-medium">{v.titulo}</p>
                  <p className="text-[12px] text-muted-foreground">{v.descripcion}</p>
                  <p className="mt-1 text-[11px] text-faint">{v.duracion}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Materiales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {mod.materiales.map((m) => (
                <div key={m.id} className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium">{m.titulo}</p>
                    <Badge variant="outline">{m.tipo}</Badge>
                  </div>
                  <p className="text-[12px] text-muted-foreground">{m.descripcion}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  )
}
