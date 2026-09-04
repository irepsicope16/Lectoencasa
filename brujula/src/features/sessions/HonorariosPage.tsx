import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle2, CircleDollarSign, Clock3, Wallet } from 'lucide-react'
import { FadeIn, PageHeader, StatCard, EmptyState } from '@/components/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/input'
import { useConsultants, useSessions, useUpdate } from '@/hooks/queries'
import { fechaCorta, formatMonto, nombreCompleto } from '@/lib/utils'
import type { Session } from '@/types'

export default function HonorariosPage() {
  const { data: consultants = [] } = useConsultants()
  const { data: sessions = [] } = useSessions()
  const updateSession = useUpdate<Session>('sessions')
  const [filtro, setFiltro] = useState<'todos' | 'pendientes' | 'cobrados'>('pendientes')

  const consultantMap = useMemo(() => new Map(consultants.map((c) => [c.id, c])), [consultants])

  const conHonorario = useMemo(
    () => sessions.filter((s) => s.monto != null).sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [sessions],
  )

  const pendientes = conHonorario.filter((s) => !s.cobrado)
  const cobrados = conHonorario.filter((s) => s.cobrado)

  const mesActual = format(new Date(), 'yyyy-MM')
  const cobradoEsteMes = cobrados
    .filter((s) => s.fecha.slice(0, 7) === mesActual)
    .reduce((acc, s) => acc + (s.monto ?? 0), 0)
  const totalPendiente = pendientes.reduce((acc, s) => acc + (s.monto ?? 0), 0)

  const visibles =
    filtro === 'pendientes' ? pendientes : filtro === 'cobrados' ? cobrados : conHonorario

  const marcarCobrado = (s: Session) => updateSession.mutateAsync({ id: s.id, patch: { cobrado: !s.cobrado } })

  return (
    <FadeIn>
      <PageHeader
        title="Honorarios"
        subtitle="El monto y el cobro se registran sesión por sesión, desde la ficha de cada consultante."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard icon={Wallet} label="Cobrado este mes" value={formatMonto(cobradoEsteMes)} />
        <StatCard icon={Clock3} label="Pendiente de cobro" value={formatMonto(totalPendiente)} tone="lavanda" />
        <StatCard icon={CircleDollarSign} label="Sesiones con honorario" value={conHonorario.length} tone="neutro" />
      </div>

      <Card className="mt-5">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Sesiones</CardTitle>
          <NativeSelect
            className="w-auto"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as typeof filtro)}
          >
            <option value="pendientes">Pendientes</option>
            <option value="cobrados">Cobrados</option>
            <option value="todos">Todos</option>
          </NativeSelect>
        </CardHeader>
        <CardContent>
          {visibles.length === 0 ? (
            <EmptyState
              icon={CircleDollarSign}
              title="Sin sesiones acá"
              description="Registrá un honorario al cargar o editar una sesión, desde la ficha del consultante."
            />
          ) : (
            <div className="space-y-2">
              {visibles.map((s) => {
                const c = consultantMap.get(s.consultantId)
                return (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center gap-3 rounded-lg border bg-surface px-3.5 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium">{c ? nombreCompleto(c) : 'Consultante'}</p>
                      <p className="text-[12px] text-faint">
                        {s.titulo} · {fechaCorta(s.fecha)}
                        {s.fecha.slice(0, 4) !== format(new Date(), 'yyyy') &&
                          ` de ${format(parseISO(s.fecha), 'yyyy', { locale: es })}`}
                      </p>
                    </div>
                    <span className="text-[14px] font-semibold">{formatMonto(s.monto ?? 0)}</span>
                    <Badge variant={s.cobrado ? 'aqua' : 'amber'}>{s.cobrado ? 'Cobrado' : 'Pendiente'}</Badge>
                    <Button size="sm" variant="ghost" asChild>
                      <Link to={`/print/recibo/${s.id}`}>Recibo</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant={s.cobrado ? 'ghost' : 'outline'}
                      onClick={() => marcarCobrado(s)}
                      disabled={updateSession.isPending}
                    >
                      <CheckCircle2 /> {s.cobrado ? 'Marcar pendiente' : 'Marcar cobrado'}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </FadeIn>
  )
}
