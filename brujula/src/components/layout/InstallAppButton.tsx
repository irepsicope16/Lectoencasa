import { useEffect, useState } from 'react'
import { Download, Share, SquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

// Botón global para "instalar" la PWA como ícono de escritorio/celular.
// En Chrome/Edge/Android dispara el prompt nativo (beforeinstallprompt);
// en iOS Safari ese evento no existe, así que mostramos los pasos manuales
// (Compartir → Agregar a pantalla de inicio), que es la única vía ahí.
export function InstallAppButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(() => isStandalone())
  const [manualOpen, setManualOpen] = useState(false)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed) return null

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt()
      const choice = await deferred.userChoice
      if (choice.outcome === 'accepted') setInstalled(true)
      setDeferred(null)
      return
    }
    setManualOpen(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        aria-label="Instalar la app"
        title="Instalar la app"
      >
        <Download className="h-4 w-4" />
      </button>

      <Dialog open={manualOpen} onOpenChange={setManualOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Instalar Método Brújula</DialogTitle>
            <DialogDescription>
              Agregala como ícono en tu celular o computadora, para entrar directo sin buscarla en el
              navegador cada vez.
            </DialogDescription>
          </DialogHeader>
          {isIOS() ? (
            <ol className="space-y-2.5 text-[13.5px] leading-relaxed">
              <li className="flex items-start gap-2.5">
                <Share className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Tocá el ícono de compartir, abajo en Safari.
              </li>
              <li className="flex items-start gap-2.5">
                <SquarePlus className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Elegí "Agregar a pantalla de inicio".
              </li>
              <li className="flex items-start gap-2.5 pl-[26px]">Confirmá tocando "Agregar".</li>
            </ol>
          ) : (
            <ol className="space-y-2.5 text-[13.5px] leading-relaxed">
              <li>1. Buscá el ícono de instalar en la barra de direcciones (o el menú ⋮ → "Instalar app").</li>
              <li>2. Confirmá la instalación.</li>
            </ol>
          )}
          <DialogFooter>
            <Button onClick={() => setManualOpen(false)}>Entendido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
