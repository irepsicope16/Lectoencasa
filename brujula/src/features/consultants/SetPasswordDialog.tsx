import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/**
 * Deja elegir a mano la contraseña nueva del consultante (en vez de generar
 * una aleatoria) para poder acordarla con él y anotarla en su ficha o
 * cuadernito.
 */
export function SetPasswordDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onSubmit: (password: string) => Promise<void>
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const close = (o: boolean) => {
    if (!o) {
      setPassword('')
      setError('')
    }
    onOpenChange(o)
  }

  const submit = async () => {
    if (password.length < 6) {
      setError('Mínimo 6 caracteres')
      return
    }
    setLoading(true)
    try {
      await onSubmit(password)
      close(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo guardar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva contraseña</DialogTitle>
          <DialogDescription>
            Elegila junto con el consultante y anotala en su ficha o cuadernito — es la que va a usar para
            entrar a partir de ahora.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label>Contraseña</Label>
          <Input
            type="text"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            placeholder="Mínimo 6 caracteres"
            autoFocus
          />
          <FieldError>{error}</FieldError>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => close(false)}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={loading}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
