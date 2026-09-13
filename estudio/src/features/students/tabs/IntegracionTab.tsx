import { useState } from 'react'
import { AlertTriangle, Check } from 'lucide-react'
import { useAlerts, useCreateAlert, useIntake, useResolveAlert, useResponses, useSaveSnapshot, useSnapshots } from '@/hooks/queries'
import { DIMENSIONES } from '@/data/items'
import { VERSION_CUESTIONARIO } from '@/data/items'
import { activaAlertaLectora } from '@/data/indicadoresLectores'
import { calcularConfianza, calcularNecesidadDimension, ETIQUETA_BANDA } from '@/features/engine/estudioEngine'
import { MENSAJES } from '@/data/mensajes'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/misc'
import { Textarea } from '@/components/ui/input'
import { AvisoOrientativo, EmptyState } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import type { BandaNecesidad, DimensionId, Student } from '@/types'

const DIMENSION_IDS = Object.keys(DIMENSIONES) as DimensionId[]

const BANDA_TONE: Record<BandaNecesidad, string> = {
  baja: 'bg-primary-soft text-primary-strong',
  leve: 'bg-surface-2 text-muted-foreground',
  moderada: 'bg-warning-soft text-warning',
  alta: 'bg-danger-soft text-danger',
}

export function IntegracionTab({ student }: { student: Student }) {
  const { data: responses = [] } = useResponses(student.id)
  const { data: intake } = useIntake(student.id)
  const { data: snapshots = [] } = useSnapshots(student.id)
  const saveSnapshot = useSaveSnapshot()
  const { data: alerts = [] } = useAlerts(student.id)
  const createAlert = useCreateAlert()
  const resolveAlert = useResolveAlert()

  const snapshotDe = (d: DimensionId) => snapshots.find((s) => s.dimension === d)
  const alertaLectora = alerts.find((a) => a.tipo === 'indicadores_lectores')

  async function calcularEIntegrar() {
    for (const dimension of DIMENSION_IDS) {
      const { promedio, completitud, banda } = calcularNecesidadDimension(dimension, responses)
      const existing = snapshotDe(dimension)
      const fuentes = existing?.fuentesConvergentes ?? ['autoinforme']
      const confianza = calcularConfianza(fuentes, banda, false)
      await saveSnapshot.mutateAsync({
        studentId: student.id,
        dimension,
        versionId: VERSION_CUESTIONARIO,
        promedioNecesidad: promedio,
        completitud,
        banda,
        confianza,
        fuentesConvergentes: fuentes,
        observacionProfesionalCoincide: existing?.observacionProfesionalCoincide ?? false,
        generadoEl: new Date().toISOString(),
        existingId: existing?.id,
      })
    }

    if (intake?.referente && !alertaLectora) {
      const { activa, evidencia } = activaAlertaLectora(intake.referente.respuestas)
      if (activa) {
        await createAlert.mutateAsync({ studentId: student.id, tipo: 'indicadores_lectores', evidencia, estado: 'abierta' })
      }
    }
    toast.success('Integración calculada')
  }

  async function toggleConvergencia(dimension: DimensionId, marcado: boolean) {
    const existing = snapshotDe(dimension)
    if (!existing) return
    const fuentes = marcado
      ? Array.from(new Set([...existing.fuentesConvergentes, 'observacion_profesional' as const]))
      : existing.fuentesConvergentes.filter((f) => f !== 'observacion_profesional')
    const confianza = calcularConfianza(fuentes, existing.banda, marcado)
    await saveSnapshot.mutateAsync({
      studentId: student.id,
      dimension,
      versionId: existing.versionId,
      promedioNecesidad: existing.promedioNecesidad,
      completitud: existing.completitud,
      banda: existing.banda,
      confianza,
      fuentesConvergentes: fuentes,
      observacionProfesionalCoincide: marcado,
      generadoEl: existing.generadoEl,
      existingId: existing.id,
    })
  }

  const fortalezas = DIMENSION_IDS.filter((d) => snapshotDe(d)?.banda === 'baja')
  const aFortalecer = DIMENSION_IDS.filter((d) => {
    const b = snapshotDe(d)?.banda
    return b === 'moderada' || b === 'alta'
  })

  return (
    <div className="space-y-4">
      <AvisoOrientativo>{MENSAJES.resultadoProfesional}</AvisoOrientativo>

      {snapshots.length === 0 ? (
        <EmptyState
          icon={Check}
          title="Todavía no se calculó la integración"
          description="Necesita respuestas del autoperfil. Al calcular, se genera un snapshot versionado por dimensión."
          action={<Button onClick={calcularEIntegrar}>Calcular integración</Button>}
        />
      ) : (
        <>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={calcularEIntegrar} disabled={saveSnapshot.isPending}>
              Recalcular con respuestas actuales
            </Button>
          </div>

          {alertaLectora && alertaLectora.estado === 'abierta' && (
            <Card className="border-danger/30 bg-danger-soft/40">
              <CardHeader>
                <div className="flex items-center gap-2 text-danger">
                  <AlertTriangle className="h-4 w-4" />
                  <CardTitle className="text-danger">Alerta: indicadores lectores para profundizar</CardTitle>
                </div>
                <CardDescription>{MENSAJES.alertaLectora}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <ul className="list-inside list-disc text-[13px] text-muted-foreground">
                  {alertaLectora.evidencia.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
                <ResolverAlerta
                  onResolve={(decision) => resolveAlert.mutateAsync({ id: alertaLectora.id, studentId: student.id, decisionProfesional: decision })}
                />
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fortalezas disponibles</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {fortalezas.length === 0 ? (
                  <p className="text-[13px] text-muted-foreground">Sin dimensiones en banda baja todavía.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {fortalezas.map((d) => (
                      <Badge key={d} variant="verde">
                        {d} · {DIMENSIONES[d].nombre}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Áreas a fortalecer</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {aFortalecer.length === 0 ? (
                  <p className="text-[13px] text-muted-foreground">Sin áreas moderadas o altas todavía.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {aFortalecer.map((d) => (
                      <Badge key={d} variant="terracota">
                        {d} · {DIMENSIONES[d].nombre}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resultados por dimensión</CardTitle>
              <CardDescription>Sin lenguaje diagnóstico ni porcentajes de riesgo. Bandas funcionales, editables tras piloto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {DIMENSION_IDS.map((d) => {
                const snap = snapshotDe(d)
                if (!snap) return null
                return (
                  <div key={d} className="rounded-lg border p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[13px] font-medium">
                        {d} · {DIMENSIONES[d].nombre}
                      </p>
                      {snap.banda ? (
                        <span className={cn('rounded-full px-2.5 py-0.5 text-[11.5px] font-medium', BANDA_TONE[snap.banda])}>
                          {ETIQUETA_BANDA[snap.banda]}
                        </span>
                      ) : (
                        <Badge variant="outline">Completitud insuficiente (&lt;70%)</Badge>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[12px] text-muted-foreground">
                      <span>
                        Completitud: {Math.round(snap.completitud * 100)}% · Confianza:{' '}
                        <span className="font-medium capitalize">{snap.confianza.replace('_', ' ')}</span>
                      </span>
                      <label className="flex cursor-pointer items-center gap-2">
                        <span>Observación profesional coincide</span>
                        <Switch
                          checked={snap.observacionProfesionalCoincide}
                          onCheckedChange={(v) => toggleConvergencia(d, v)}
                        />
                      </label>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function ResolverAlerta({ onResolve }: { onResolve: (decision: string) => Promise<unknown> }) {
  const [decision, setDecision] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <div className="space-y-2 border-t border-danger/20 pt-3">
      <label className="block text-[12.5px] font-medium">Decisión profesional (la alerta no se elimina, se resuelve documentada)</label>
      <Textarea value={decision} onChange={(e) => setDecision(e.target.value)} placeholder="Ej: se amplía entrevista y se deriva a evaluación psicopedagógica específica." />
      <Button
        size="sm"
        disabled={!decision || loading}
        onClick={async () => {
          setLoading(true)
          await onResolve(decision)
          setLoading(false)
        }}
      >
        Registrar decisión y resolver
      </Button>
    </div>
  )
}
