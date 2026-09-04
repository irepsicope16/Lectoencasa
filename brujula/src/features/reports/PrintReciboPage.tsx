import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Isotipo } from '@/branding/Logo'
import { useConsultant, useSessions } from '@/hooks/queries'
import { fechaLarga, formatMonto, nombreCompleto } from '@/lib/utils'

export default function PrintReciboPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const user = useAuthStore((s) => s.user)
  const { data: sessions = [] } = useSessions()
  const session = sessions.find((s) => s.id === sessionId)
  const { data: consultant } = useConsultant(session?.consultantId)

  if (user?.role !== 'profesional') return <Navigate to="/mi" replace />
  if (sessions.length > 0 && !session) return <Navigate to="/pro/honorarios" replace />
  if (!session || !consultant) return null
  if (session.monto == null) return <Navigate to={`/pro/consultantes/${session.consultantId}`} replace />

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b bg-surface px-6 py-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/pro/honorarios">
            <ArrowLeft /> Volver a Honorarios
          </Link>
        </Button>
        <p className="text-[12.5px] text-muted-foreground">
          Para guardar como PDF: Imprimir → destino «Guardar como PDF»
        </p>
        <Button size="sm" onClick={() => window.print()}>
          <Printer /> Imprimir / PDF
        </Button>
      </div>

      <div className="mx-auto max-w-[560px] px-8 py-10 text-[13.5px] leading-relaxed">
        <header className="mb-10 overflow-hidden rounded-2xl border border-neutral-300">
          <div className="flex items-center gap-5 border-b border-neutral-200 px-7 py-6">
            <Isotipo size={64} className="shrink-0" />
            <div className="h-14 w-px shrink-0 bg-neutral-200" />
            <div className="flex-1 text-center">
              <h1 className="font-display text-[24px] font-medium tracking-tight text-primary-strong">
                Método Brújula
              </h1>
              <p className="font-display mt-1.5 text-[13px] font-semibold uppercase tracking-wide text-primary-strong">
                Recibo de honorarios
              </p>
            </div>
          </div>
        </header>

        <div className="mb-6 flex items-baseline justify-between border-b border-neutral-200 pb-4">
          <span className="text-neutral-500">Fecha de emisión</span>
          <span className="font-medium">{fechaLarga(new Date().toISOString())}</span>
        </div>

        <p className="text-neutral-800">
          Recibí de <strong>{nombreCompleto(consultant)}</strong> la suma de{' '}
          <strong className="text-[16px] text-primary-strong">{formatMonto(session.monto)}</strong> en concepto de
          honorarios por sesión de <strong>Orientación Vocacional y Ocupacional</strong>, «{session.titulo}»,
          realizada el {fechaLarga(session.fecha)}.
        </p>

        <p className="mt-4 text-neutral-800">Por el pago recibido, se extiende el presente recibo.</p>

        {user && (
          <div className="mt-16 border-t border-neutral-300 pt-4 text-center">
            <p className="font-semibold">{nombreCompleto(user)}</p>
            {user.titulo && <p className="text-neutral-600">{user.titulo}</p>}
            {user.matricula && <p className="text-neutral-600">{user.matricula}</p>}
            <p className="mt-1 text-[11px] text-neutral-400">Firma</p>
          </div>
        )}

        <footer className="mt-16 border-t border-neutral-200 pt-4 text-center text-[11px] leading-relaxed text-neutral-500">
          Método Brújula · Psicope con Ire · Encontrá tu norte. Construí tu camino.
        </footer>
      </div>
    </div>
  )
}
