import { useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Printer, RotateCcw } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Isotipo } from '@/branding/Logo'
import { SignaturePad, type SignaturePadHandle } from '@/components/ui/signature-pad'
import { useConsultant, useUpdate } from '@/hooks/queries'
import { toast } from '@/components/ui/toast'
import { edad, fechaLarga, nombreCompleto } from '@/lib/utils'
import type { Consultant } from '@/types'

export default function PrintConsentPage() {
  const { consultantId } = useParams<{ consultantId: string }>()
  const user = useAuthStore((s) => s.user)
  const { data: consultant } = useConsultant(consultantId)
  const updateConsultant = useUpdate<Consultant>('consultants')
  const padRef = useRef<SignaturePadHandle>(null)
  const [firmante, setFirmante] = useState('')
  const [refirmando, setRefirmando] = useState(false)

  // Solo la profesional gestiona el consentimiento (se firma en persona, en la sesión).
  if (user?.role !== 'profesional') return <Navigate to="/mi" replace />
  if (!consultant) return null

  const esMenor = edad(consultant.fechaNacimiento) < 18
  const yaFirmado = consultant.consentimiento?.firmado && !refirmando

  const guardar = async () => {
    const firma = padRef.current?.toDataURL()
    if (!firma) {
      toast.error('Falta la firma')
      return
    }
    if (!firmante.trim()) {
      toast.error('Falta la aclaración (nombre y apellido de quien firma)')
      return
    }
    await updateConsultant.mutateAsync({
      id: consultant.id,
      patch: {
        consentimiento: {
          firmado: true,
          fecha: new Date().toISOString(),
          firmaDataUrl: firma,
          firmante: firmante.trim(),
        },
      },
    })
    toast.success('Consentimiento guardado')
    setRefirmando(false)
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b bg-surface px-6 py-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/pro/consultantes/${consultant.id}`}>
            <ArrowLeft /> Volver a la ficha
          </Link>
        </Button>
        <p className="text-[12.5px] text-muted-foreground">
          Para guardar como PDF: Imprimir → destino «Guardar como PDF»
        </p>
        <Button size="sm" onClick={() => window.print()}>
          <Printer /> Imprimir / PDF
        </Button>
      </div>

      <div className="mx-auto max-w-[760px] px-8 py-10 text-[13px] leading-relaxed">
        <header className="mb-8 overflow-hidden rounded-2xl border border-neutral-300">
          <div className="flex items-center gap-5 border-b border-neutral-200 px-7 py-6">
            <Isotipo size={72} className="shrink-0" />
            <div className="h-16 w-px shrink-0 bg-neutral-200" />
            <div className="flex-1 text-center">
              <h1 className="font-display text-[26px] font-medium tracking-tight text-primary-strong sm:text-[30px]">
                Método Brújula
              </h1>
              <p className="font-display mt-1.5 text-[13.5px] font-semibold uppercase tracking-wide text-primary-strong">
                Consentimiento informado
              </p>
            </div>
          </div>
          {user && (
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 border-b border-neutral-200 px-6 py-2 text-[11.5px]">
              <span className="font-semibold text-warning">{nombreCompleto(user)}</span>
              {user.titulo && (
                <>
                  <span className="text-neutral-300">|</span>
                  <span className="text-neutral-600">{user.titulo}</span>
                </>
              )}
              {user.matricula && (
                <>
                  <span className="text-neutral-300">|</span>
                  <span className="text-neutral-600">{user.matricula}</span>
                </>
              )}
            </div>
          )}
        </header>

        <p className="text-neutral-700">
          Se deja constancia de que <strong>{nombreCompleto(consultant)}</strong>
          {esMenor ? ', a través de su padre, madre o tutor/a,' : ''} ha sido informado/a sobre las características
          del proceso de <strong>Orientación Vocacional y Ocupacional</strong> a desarrollarse con{' '}
          {user ? nombreCompleto(user) : 'la profesional a cargo'}, en el marco de Método Brújula, y presta su
          conformidad en los siguientes términos:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-700">
          <li>
            El proceso consiste en un acompañamiento a lo largo de distintas etapas (historia personal, identidad,
            valores, intereses, aptitudes, exploración del mundo educativo y laboral) mediante entrevistas,
            actividades y materiales propios del método, y no en la aplicación de un test psicométrico con fines
            diagnósticos.
          </li>
          <li>
            La participación es voluntaria. {esMenor ? 'El/la consultante o su tutor/a puede' : 'Puede'} interrumpir
            el proceso en cualquier momento, sin necesidad de justificar la decisión.
          </li>
          <li>
            La información compartida en el marco del proceso es confidencial y se maneja conforme al secreto
            profesional, salvo en las situaciones en que la ley exige su comunicación.
          </li>
          <li>
            Los datos registrados (respuestas a actividades, notas de sesión, observaciones profesionales) se
            almacenan en la plataforma Método Brújula con acceso restringido a la profesional a cargo, y se utilizan
            exclusivamente para sostener el proceso de orientación.
          </li>
          <li>
            Al finalizar el proceso se entrega un informe con una lectura cualitativa del recorrido — nunca un
            puntaje ni un veredicto cerrado sobre qué estudiar o a qué dedicarse.
          </li>
        </ul>

        <div className="mt-10 border-t border-neutral-200 pt-6">
          {yaFirmado ? (
            <div>
              <p className="text-[12.5px] text-neutral-500">
                Firmado el {fechaLarga(consultant.consentimiento!.fecha!)}
              </p>
              <div className="mt-3 flex items-end gap-6">
                <img
                  src={consultant.consentimiento!.firmaDataUrl}
                  alt="Firma"
                  className="h-24 border-b border-neutral-300"
                />
                <p className="pb-1 text-neutral-700">{consultant.consentimiento!.firmante}</p>
              </div>
              <Button variant="outline" size="sm" className="no-print mt-4" onClick={() => setRefirmando(true)}>
                <RotateCcw /> Firmar de nuevo
              </Button>
            </div>
          ) : (
            <div className="no-print">
              <p className="mb-2 text-[12.5px] font-medium text-neutral-600">
                Firma de {esMenor ? 'quien ejerce la tutela' : 'el/la consultante'} (trazá con el dedo o el mouse)
              </p>
              <div className="h-36 w-full max-w-[420px] rounded-lg border border-dashed border-neutral-300 bg-white">
                <SignaturePad ref={padRef} />
              </div>
              <div className="mt-3 max-w-[420px]">
                <Label>Aclaración (nombre y apellido)</Label>
                <Input value={firmante} onChange={(e) => setFirmante(e.target.value)} placeholder="Nombre y apellido de quien firma" />
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={guardar} disabled={updateConsultant.isPending}>
                  Guardar consentimiento firmado
                </Button>
                <Button variant="ghost" size="sm" onClick={() => padRef.current?.clear()}>
                  Borrar firma
                </Button>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-10 border-t border-neutral-200 pt-4 text-[11px] leading-relaxed text-neutral-500">
          Método Brújula · Psicope con Ire · Encontrá tu norte. Construí tu camino.
        </footer>
      </div>
    </div>
  )
}
