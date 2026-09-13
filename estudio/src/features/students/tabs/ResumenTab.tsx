import { AlertTriangle, Calendar, CheckCircle2, CircleDashed, FileText, Target } from 'lucide-react'
import { useAlerts, useGoals, useIntake, useResponses, useSnapshots } from '@/hooks/queries'
import { DIMENSIONES, ITEMS } from '@/data/items'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { edad, fechaCorta, nombreCompleto } from '@/lib/utils'
import type { DimensionId, Student } from '@/types'

const DIMENSION_IDS = Object.keys(DIMENSIONES) as DimensionId[]

const NIVEL_LABEL: Record<Student['nivel'], string> = {
  '12_15': '12 a 15 años',
  '16_18': '16 a 18 años',
  superior: 'Educación superior',
  adulto: 'Adulto',
}

export function ResumenTab({ student }: { student: Student }) {
  const { data: intake } = useIntake(student.id)
  const { data: responses = [] } = useResponses(student.id)
  const { data: snapshots = [] } = useSnapshots(student.id)
  const { data: alerts = [] } = useAlerts(student.id)
  const { data: goals = [] } = useGoals(student.id)

  const respondidos = new Set(responses.map((r) => r.itemId)).size
  const progresoAutoperfil = Math.round((respondidos / ITEMS.length) * 100)

  const fortalezas = DIMENSION_IDS.filter((d) => snapshots.find((s) => s.dimension === d)?.banda === 'baja')
  const aFortalecer = DIMENSION_IDS.filter((d) => {
    const b = snapshots.find((s) => s.dimension === d)?.banda
    return b === 'moderada' || b === 'alta'
  })
  const alertasAbiertas = alerts.filter((a) => a.estado === 'abierta')
  const objetivosActivos = goals.filter((g) => g.estado !== 'cerrado')
  const proximaRevision = objetivosActivos
    .map((g) => g.fechaRevision)
    .filter(Boolean)
    .sort()[0]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Datos del estudiante</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 pt-0 text-[13px]">
            <Campo label="Nombre completo" valor={nombreCompleto(student)} />
            <Campo label="Edad" valor={`${edad(student.fechaNacimiento)} años`} />
            <Campo label="Nivel" valor={NIVEL_LABEL[student.nivel]} />
            <Campo label="Institución" valor={student.institucion ?? '—'} />
            <Campo label="Contacto" valor={student.contacto} />
            <Campo label="Inicio del proceso" valor={fechaCorta(student.createdAt)} />
            <div className="col-span-2">
              <Campo
                label="Consentimiento"
                valor={
                  student.consentimiento.otorgado
                    ? `Otorgado por ${student.consentimiento.nombreOtorgante} (${student.consentimiento.otorgante === 'adulto_responsable' ? 'adulto responsable' : 'el propio estudiante'})${student.consentimiento.fecha ? ' · ' + fechaCorta(student.consentimiento.fecha) : ''}`
                    : 'Pendiente'
                }
              />
            </div>
            <div className="col-span-2">
              <Campo label="Motivo de consulta" valor={student.motivoConsulta} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del proceso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <EstadoFila
              icon={intake ? CheckCircle2 : CircleDashed}
              hecho={!!intake}
              label="Entrevista inicial"
              detalle={intake ? 'Completada' : 'Sin registrar'}
            />
            <div>
              <div className="mb-1 flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-1.5">
                  {progresoAutoperfil === 100 ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <CircleDashed className="h-3.5 w-3.5 text-faint" />
                  )}
                  Autoperfil
                </span>
                <span className="text-faint">{progresoAutoperfil}%</span>
              </div>
              <Progress value={progresoAutoperfil} />
            </div>
            <EstadoFila
              icon={snapshots.length > 0 ? CheckCircle2 : CircleDashed}
              hecho={snapshots.length > 0}
              label="Integración"
              detalle={snapshots.length > 0 ? `${snapshots.length} dimensiones calculadas` : 'Sin calcular'}
            />
            <EstadoFila
              icon={objetivosActivos.length > 0 ? CheckCircle2 : CircleDashed}
              hecho={objetivosActivos.length > 0}
              label="Plan de intervención"
              detalle={objetivosActivos.length > 0 ? `${objetivosActivos.length} objetivo(s) activos` : 'Sin objetivos'}
            />
          </CardContent>
        </Card>
      </div>

      {alertasAbiertas.length > 0 && (
        <Card className="border-danger/30 bg-danger-soft/40">
          <CardContent className="flex items-center gap-3 pt-5">
            <AlertTriangle className="h-5 w-5 shrink-0 text-danger" />
            <div>
              <p className="text-[13px] font-medium text-danger">
                {alertasAbiertas.length} alerta{alertasAbiertas.length > 1 ? 's' : ''} abierta{alertasAbiertas.length > 1 ? 's' : ''}
              </p>
              <p className="text-[12.5px] text-muted-foreground">Ver la pestaña Integración para el detalle y resolverlas.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resultados clave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div>
              <p className="mb-1.5 text-[12px] font-medium text-faint uppercase tracking-wide">Fortalezas</p>
              {fortalezas.length === 0 ? (
                <p className="text-[13px] text-muted-foreground">Sin datos todavía.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {fortalezas.map((d) => (
                    <Badge key={d} variant="primario">
                      {d} · {DIMENSIONES[d].nombre}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="mb-1.5 text-[12px] font-medium text-faint uppercase tracking-wide">Áreas a fortalecer</p>
              {aFortalecer.length === 0 ? (
                <p className="text-[13px] text-muted-foreground">Sin datos todavía.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {aFortalecer.map((d) => (
                    <Badge key={d} variant="acento">
                      {d} · {DIMENSIONES[d].nombre}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan activo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {objetivosActivos.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">Todavía no hay objetivos en curso.</p>
            ) : (
              <>
                {objetivosActivos.map((g) => (
                  <div key={g.id} className="flex items-start gap-2 text-[13px]">
                    <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                    <span>{g.objetivoObservable}</span>
                  </div>
                ))}
                {proximaRevision && (
                  <p className="flex items-center gap-1.5 pt-1 text-[12.5px] text-faint">
                    <Calendar className="h-3.5 w-3.5" /> Próxima revisión: {fechaCorta(proximaRevision)}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="flex items-center gap-1.5 text-[12.5px] text-faint">
        <FileText className="h-3.5 w-3.5" /> El informe exportable todavía no está disponible en esta versión.
      </p>
    </div>
  )
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="text-[11.5px] text-faint">{label}</p>
      <p className="font-medium">{valor}</p>
    </div>
  )
}

function EstadoFila({
  icon: Icon,
  hecho,
  label,
  detalle,
}: {
  icon: typeof CheckCircle2
  hecho: boolean
  label: string
  detalle: string
}) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${hecho ? 'text-primary' : 'text-faint'}`} />
        {label}
      </span>
      <span className="text-faint">{detalle}</span>
    </div>
  )
}
