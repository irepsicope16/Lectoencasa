import { useState } from 'react'
import { Check, Copy, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface ConsultantCredentials {
  email: string
  password: string
}

/**
 * Muestra el email y la contraseña de acceso de un consultante recién
 * creados o restablecidos. A diferencia de un toast (que se cierra solo en
 * unos segundos), esta ventana queda abierta hasta que se cierra a mano —
 * es la única oportunidad de ver esta contraseña: ni la app ni Supabase la
 * guardan en texto plano en ningún otro lado.
 */
export function CredentialsDialog({
  credentials,
  onClose,
}: {
  credentials: ConsultantCredentials | null
  onClose: () => void
}) {
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    if (!credentials) return
    try {
      await navigator.clipboard.writeText(`Usuario: ${credentials.email}\nContraseña: ${credentials.password}`)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      /* clipboard no disponible: la persona igual puede seleccionar y copiar a mano */
    }
  }

  return (
    <Dialog open={!!credentials} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" /> Acceso del consultante
          </DialogTitle>
          <DialogDescription>
            Compartí estos datos con el consultante para que entre a la plataforma. Guardalos ahora: al cerrar
            esta ventana, la contraseña no queda visible en ningún otro lado — ni siquiera para vos.
          </DialogDescription>
        </DialogHeader>
        {credentials && (
          <div className="space-y-2.5 rounded-lg border bg-surface-2 p-4 text-[14px]">
            <p>
              <span className="text-faint">Usuario: </span>
              <span className="font-medium">{credentials.email}</span>
            </p>
            <p>
              <span className="text-faint">Contraseña: </span>
              <span className="font-mono text-[15px] font-semibold text-primary-strong">
                {credentials.password}
              </span>
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={copiar}>
            {copiado ? <Check /> : <Copy />} {copiado ? 'Copiado' : 'Copiar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
