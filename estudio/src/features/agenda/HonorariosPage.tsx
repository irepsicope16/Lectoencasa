import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { Wallet } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useAllSessions, useStudents, useUpdateSession } from '@/hooks/queries'
import { PageHeader, EmptyState, StatCard, FadeIn } from '@/components/shared'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/input'
import { fechaCorta, nombreCompleto } from '@/lib/utils'

function formatMonto(n: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

export default function HonorariosPage() {
  const user = useAuthStore((s) => s.user)
  const { data: students = [] } = useStudents(user?.id)
  const { data: sessions = [] } = useAllSessions(user?.id)
  const updateSession = useUpdateSession()
  const [mesFiltro, setMesFiltro] = useState('todos')

  const conMonto = sessions.filter((s) => s.monto !== undefined)

  const meses = useMemo(() => {
    const set = new Set(conMonto.map((s) => format(parseISO(s.fecha), 'yyyy-MM')))
    return Array.from(set).sort().reverse()
  }, [conMonto])

  const filtradas = mesFiltro === 'todos' ? conMonto : conMonto.filter((s) => format(parseISO(s.fecha), 'yyyy-MM') === mesFiltro)
  const ordenadas = [...filtradas].sort((a, b) => b.fecha.localeCompare(a.fecha))

  const totalCobrado = filtradas.filter((s) => s.cobrado).reduce((acc, s) => acc + (s.monto ?? 0), 0)
  const totalPendiente = filtradas.filter((s) => !s.cobrado).reduce((acc, s) => acc + (s.monto ?? 0), 0)

  const nombreDe = (studentId: string) => {
    const s = students.find((x) => x.id === studentId)
    return s ? nombreCompleto(s) : 'Estudiante'
  }

  return (
    <FadeIn>
      <PageHeader
        title="Honorarios"
        subtitle="Sesiones con monto registrado"
        actions={
          <NativeSelect className="w-40" value={mesFiltro} onChange={(e) => setMesFiltro(e.target.value)}>
            <option value="todos">Todos los meses</option>
            {meses.map((m) => (
              <option key={m} value={m}>
                {format(parseISO(m + '-01'), 'MMMM yyyy', { locale: es })}
              </option>
            ))}
          </NativeSelect>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={Wallet} label="Cobrado" value={formatMonto(totalCobrado)} tone="primario" />
        <StatCard icon={Wallet} label="Pendiente de cobro" value={formatMonto(totalPendiente)} tone="acento" />
        <StatCard icon={Wallet} label="Sesiones facturadas" value={filtradas.length} tone="neutro" />
      </div>

      <Card>
        <CardContent className="space-y-2 pt-5">
          {ordenadas.length === 0 ? (
            <EmptyState icon={Wallet} title="Sin honorarios registrados" description="Registrá un monto al cargar una sesión desde la ficha del estudiante." />
          ) : (
            ordenadas.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                <div>
                  <Link to={`/pro/estudiantes/${s.studentId}`} className="text-[13px] font-medium hover:text-accent">
                    {nombreDe(s.studentId)}
                  </Link>
                  <p className="text-[12px] text-faint">
                    {s.titulo} · {fechaCorta(s.fecha)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium">{formatMonto(s.monto ?? 0)}</span>
                  <Badge variant={s.cobrado ? 'primario' : 'acento'}>{s.cobrado ? 'Cobrada' : 'Pendiente'}</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateSession.mutateAsync({ id: s.id, patch: { cobrado: !s.cobrado } })}
                  >
                    Marcar {s.cobrado ? 'pendiente' : 'cobrada'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </FadeIn>
  )
}
