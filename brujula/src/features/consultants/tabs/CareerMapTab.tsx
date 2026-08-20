import { useState } from 'react'
import { Compass, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import { useUpdate } from '@/hooks/queries'
import { cn } from '@/lib/utils'
import { CAREER_FIELDS } from '@/data/careerFields'
import type { CareerFieldReaction, CareerMapEntry, Consultant } from '@/types'

const REACCIONES: { valor: CareerFieldReaction; emoji: string; label: string; activeClass: string }[] = [
  { valor: 'interesa', emoji: '❤️', label: 'Me interesa', activeClass: 'border-primary bg-primary-soft text-primary-strong' },
  { valor: 'curiosidad', emoji: '🤔', label: 'Quiero saber más', activeClass: 'border-accent bg-accent-soft text-accent-strong' },
  { valor: 'no', emoji: '✕', label: 'No me interesa', activeClass: 'border-danger bg-danger-soft text-danger' },
]

export function CareerMapTab({ consultant }: { consultant: Consultant }) {
  const updateConsultant = useUpdate<Consultant>('consultants')
  const [reacciones, setReacciones] = useState<Record<string, CareerFieldReaction>>(() => {
    const map: Record<string, CareerFieldReaction> = {}
    consultant.mapaCarreras?.forEach((e) => (map[e.campoId] = e.reaccion))
    return map
  })

  const marcar = async (campoId: string, valor: CareerFieldReaction) => {
    const next = { ...reacciones, [campoId]: reacciones[campoId] === valor ? undefined : valor }
    if (!next[campoId]) delete next[campoId]
    setReacciones(next as Record<string, CareerFieldReaction>)
    const entries: CareerMapEntry[] = Object.entries(next).map(([id, reaccion]) => ({
      campoId: id,
      reaccion: reaccion as CareerFieldReaction,
    }))
    try {
      await updateConsultant.mutateAsync({ id: consultant.id, patch: { mapaCarreras: entries } })
    } catch {
      toast.error('No se pudo guardar el mapa de carreras')
    }
  }

  const marcados = Object.keys(reacciones).length
  const interesa = CAREER_FIELDS.filter((f) => reacciones[f.id] === 'interesa')
  const curiosidad = CAREER_FIELDS.filter((f) => reacciones[f.id] === 'curiosidad')
  const prioritarios = [...interesa, ...curiosidad].slice(0, 5)

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary" /> Mapa de Carreras
          </CardTitle>
          <CardDescription>
            No busques encontrar hoy "la carrera": el objetivo es descubrir campos que quizás nunca habías
            considerado. Marcá tu primera reacción a cada uno — después vamos a las finalistas en el Comparador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-[12px] text-faint">{marcados} de {CAREER_FIELDS.length} campos marcados</p>

          {prioritarios.length > 0 && (
            <div className="mb-5 rounded-xl border border-primary/40 bg-primary-soft/40 p-4">
              <p className="flex items-center gap-2 text-[13px] font-bold text-primary-strong">
                <Sparkles className="h-4 w-4" /> Campos prioritarios para explorar
              </p>
              <ul className="mt-2 space-y-1">
                {prioritarios.map((f) => (
                  <li key={f.id} className="text-[12.5px]">
                    <span className="font-semibold">{f.titulo}</span>
                    {reacciones[f.id] === 'curiosidad' && (
                      <span className="ml-1.5 text-[11px] text-faint">(despertó curiosidad)</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            {CAREER_FIELDS.map((f) => (
              <div key={f.id} className="rounded-xl border p-3.5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold">
                      <span className="mr-1.5 text-faint">{f.numero}.</span>
                      {f.titulo}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{f.pista}</p>
                    <details className="mt-1.5">
                      <summary className="cursor-pointer text-[11.5px] text-primary">Ver ejemplos</summary>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {[...f.carreras, ...(f.camposNuevos ?? [])].map((c) => (
                          <Badge key={c} variant="outline" className="font-normal">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </details>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    {REACCIONES.map((r) => {
                      const active = reacciones[f.id] === r.valor
                      return (
                        <button
                          key={r.valor}
                          type="button"
                          onClick={() => marcar(f.id, r.valor)}
                          aria-label={r.label}
                          title={r.label}
                          className={cn(
                            'cursor-pointer rounded-full border px-2.5 py-1.5 text-[14px] transition-all',
                            active ? r.activeClass : 'text-muted-foreground hover:bg-surface-2',
                          )}
                        >
                          {r.emoji}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
