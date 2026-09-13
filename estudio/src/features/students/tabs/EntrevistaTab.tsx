import { useEffect, useState } from 'react'
import { useIntake, useSaveIntake } from '@/hooks/queries'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label, Textarea, Input, NativeSelect } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { INDICADORES_LECTORES } from '@/data/indicadoresLectores'
import type { IndicadorLectorRespuesta, Student } from '@/types'

export function EntrevistaTab({ student }: { student: Student }) {
  const { data: intake, isLoading } = useIntake(student.id)
  const saveIntake = useSaveIntake()

  const [motivo, setMotivo] = useState('')
  const [historiaAcademica, setHistoriaAcademica] = useState('')
  const [apoyosPrevios, setApoyosPrevios] = useState('')
  const [contexto, setContexto] = useState('')
  const [notasPrivadas, setNotasPrivadas] = useState('')
  const [referenteNombre, setReferenteNombre] = useState('')
  const [referenteVinculo, setReferenteVinculo] = useState('')
  const [l10Texto, setL10Texto] = useState('')
  const [respuestasLector, setRespuestasLector] = useState<Record<string, IndicadorLectorRespuesta>>({})

  const incluyeReferente = student.nivel === '12_15'

  useEffect(() => {
    if (!intake) return
    setMotivo(intake.motivo)
    setHistoriaAcademica(intake.historiaAcademica)
    setApoyosPrevios(intake.apoyosPrevios)
    setContexto(intake.contexto)
    setNotasPrivadas(intake.notasPrivadas)
    if (intake.referente) {
      setReferenteNombre(intake.referente.nombre)
      setReferenteVinculo(intake.referente.vinculo)
      setL10Texto(intake.referente.l10Texto)
      setRespuestasLector(intake.referente.respuestas)
    }
  }, [intake])

  if (isLoading) return <div className="py-8 text-sm text-faint">Cargando…</div>

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await saveIntake.mutateAsync({
      studentId: student.id,
      existingId: intake?.id,
      data: {
        motivo,
        historiaAcademica,
        apoyosPrevios,
        contexto,
        notasPrivadas,
        referente: incluyeReferente
          ? { nombre: referenteNombre, vinculo: referenteVinculo, respuestas: respuestasLector, l10Texto }
          : undefined,
      },
    })
    toast.success('Entrevista guardada')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Entrevista inicial</CardTitle>
          <CardDescription>Formulario editable, guardable por secciones.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div>
            <Label>Motivo de consulta</Label>
            <Textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </div>
          <div>
            <Label>Historia académica</Label>
            <Textarea value={historiaAcademica} onChange={(e) => setHistoriaAcademica(e.target.value)} />
          </div>
          <div>
            <Label>Apoyos previos</Label>
            <Textarea value={apoyosPrevios} onChange={(e) => setApoyosPrevios(e.target.value)} />
          </div>
          <div>
            <Label>Contexto</Label>
            <Textarea value={contexto} onChange={(e) => setContexto(e.target.value)} />
          </div>
          <div>
            <Label>Notas privadas del profesional</Label>
            <Textarea value={notasPrivadas} onChange={(e) => setNotasPrivadas(e.target.value)} />
            <p className="mt-1 text-[11.5px] text-faint">No se comparte con el estudiante ni se exporta en informes.</p>
          </div>
        </CardContent>
      </Card>

      {incluyeReferente && (
        <Card>
          <CardHeader>
            <CardTitle>Cuestionario breve de adulto referente</CardTitle>
            <CardDescription>
              Para estudiantes de 12 a 15 años. Se muestra en columna separada y nunca reemplaza la voz del adolescente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nombre del referente</Label>
                <Input value={referenteNombre} onChange={(e) => setReferenteNombre(e.target.value)} />
              </div>
              <div>
                <Label>Vínculo</Label>
                <Input value={referenteVinculo} onChange={(e) => setReferenteVinculo(e.target.value)} placeholder="Madre, padre, tutor…" />
              </div>
            </div>

            <div className="divide-y rounded-lg border">
              {INDICADORES_LECTORES.map((ind) => (
                <div key={ind.codigo} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[13px]">
                    <span className="mr-1.5 font-mono text-[11px] text-faint">{ind.codigo}</span>
                    {ind.pregunta}
                  </p>
                  {ind.tipo === 'texto' ? (
                    <Input
                      className="sm:w-64"
                      value={l10Texto}
                      onChange={(e) => setL10Texto(e.target.value)}
                      placeholder="Describir…"
                    />
                  ) : (
                    <NativeSelect
                      className="sm:w-40"
                      value={respuestasLector[ind.codigo] ?? ''}
                      onChange={(e) =>
                        setRespuestasLector((prev) => ({ ...prev, [ind.codigo]: e.target.value as IndicadorLectorRespuesta }))
                      }
                    >
                      <option value="">Sin responder</option>
                      {ind.tipo === 'si_no_no_sabe' ? (
                        <>
                          <option value="si">Sí</option>
                          <option value="no">No</option>
                          <option value="no_sabe">No sabe</option>
                        </>
                      ) : (
                        <>
                          <option value="si">Sí</option>
                          <option value="no">No</option>
                          <option value="a_veces">A veces</option>
                        </>
                      )}
                    </NativeSelect>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button type="submit" disabled={saveIntake.isPending}>
        {saveIntake.isPending ? 'Guardando…' : 'Guardar entrevista'}
      </Button>
    </form>
  )
}
