import { useState } from 'react'
import { Download, EllipsisVertical, Share, Smartphone, SquarePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'
import {
  getPlatform,
  promptInstall,
  rememberDismissal,
  useInstallStore,
  wasDismissedRecently,
  type InstallPlatform,
} from '@/lib/install'
import { cn } from '@/lib/utils'

/** Qué se puede ofrecer en este dispositivo: el aviso nativo, los pasos a mano o nada. */
function useInstallOffer() {
  const promptEvent = useInstallStore((s) => s.promptEvent)
  const installed = useInstallStore((s) => s.installed)
  const platform = getPlatform()
  if (installed) return { platform, mode: 'none' as const }
  if (promptEvent) return { platform, mode: 'prompt' as const }
  // Sin aviso nativo: en celular igual se puede instalar desde el menú del navegador.
  if (platform !== 'desktop') return { platform, mode: 'guide' as const }
  return { platform, mode: 'none' as const }
}

async function installOrGuide(mode: 'prompt' | 'guide', openGuide: () => void) {
  if (mode === 'prompt') {
    const shown = await promptInstall()
    if (shown) {
      if (useInstallStore.getState().installed) toast.success('¡Listo! Brújula ya está en tu pantalla de inicio.')
      return
    }
  }
  openGuide()
}

function Paso({ n, icon: Icon, children }: { n: number; icon: typeof Share; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[13px] font-semibold text-primary-strong">
        {n}
      </span>
      <span className="pt-0.5 text-[13.5px] leading-relaxed">
        {children}
        <Icon className="ml-1.5 inline h-4 w-4 align-[-3px] text-primary-strong" />
      </span>
    </li>
  )
}

function InstallGuideDialog({
  open,
  onOpenChange,
  platform,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  platform: InstallPlatform
}) {
  const ios = platform === 'ios'
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Instalá Brújula en tu celular</DialogTitle>
          <DialogDescription>
            Queda como una app más, con su ícono en la pantalla de inicio. No ocupa casi lugar y no hace falta
            descargarla de ninguna tienda.
          </DialogDescription>
        </DialogHeader>
        {ios ? (
          <ol className="space-y-3.5">
            <Paso n={1} icon={Share}>
              Tocá el botón <strong>Compartir</strong>: en Safari está abajo, en el centro; en Chrome, arriba a la
              derecha.
            </Paso>
            <Paso n={2} icon={SquarePlus}>
              Bajá en la lista y elegí <strong>Agregar a inicio</strong>.
            </Paso>
            <Paso n={3} icon={Smartphone}>
              Tocá <strong>Agregar</strong>. Desde ahora, abrí Brújula desde su ícono.
            </Paso>
          </ol>
        ) : (
          <ol className="space-y-3.5">
            <Paso n={1} icon={EllipsisVertical}>
              Tocá el <strong>menú</strong> del navegador (los tres puntitos, arriba a la derecha).
            </Paso>
            <Paso n={2} icon={Download}>
              Elegí <strong>Instalar app</strong> o <strong>Agregar a pantalla principal</strong>.
            </Paso>
            <Paso n={3} icon={Smartphone}>
              Confirmá con <strong>Instalar</strong>. Desde ahora, abrí Brújula desde su ícono.
            </Paso>
          </ol>
        )}
        <p className="rounded-lg bg-beige-soft px-3 py-2 text-[12px] leading-relaxed text-beige-strong">
          Tus datos no se guardan en el celular: siguen en tu cuenta, igual que cuando entrás desde el navegador.
        </p>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Entendido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Tarjeta arriba del contenido, solo en celulares (o donde haya aviso nativo) y si no se cerró hace poco. */
export function InstallBanner() {
  const { platform, mode } = useInstallOffer()
  const [hidden, setHidden] = useState(wasDismissedRecently)
  const [guideOpen, setGuideOpen] = useState(false)
  if (mode === 'none' || hidden) return null

  return (
    <>
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary-soft px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-primary-strong">Instalá Brújula en tu celular</p>
          <p className="text-[12px] leading-snug text-muted-foreground">
            Abrila desde su ícono, como cualquier app, sin buscar el link.
          </p>
        </div>
        <Button size="sm" className="shrink-0" onClick={() => installOrGuide(mode, () => setGuideOpen(true))}>
          {mode === 'prompt' ? 'Instalar' : 'Ver cómo'}
        </Button>
        <button
          type="button"
          onClick={() => {
            rememberDismissal()
            setHidden(true)
          }}
          className="shrink-0 cursor-pointer rounded-md p-1 text-faint hover:bg-background hover:text-foreground"
          aria-label="Ahora no"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <InstallGuideDialog open={guideOpen} onOpenChange={setGuideOpen} platform={platform} />
    </>
  )
}

/** Acceso fijo en el menú lateral: sigue disponible aunque se haya cerrado la tarjeta. */
export function SidebarInstallButton({ collapsed }: { collapsed: boolean }) {
  const { platform, mode } = useInstallOffer()
  const [guideOpen, setGuideOpen] = useState(false)
  if (mode === 'none') return null

  return (
    <>
      <button
        type="button"
        onClick={() => installOrGuide(mode, () => setGuideOpen(true))}
        className={cn(
          'mb-1 flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-primary-strong transition-colors hover:bg-primary-soft',
          collapsed && 'w-auto justify-center px-2',
        )}
        aria-label="Instalar Brújula en el celular"
      >
        <Smartphone className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{platform === 'desktop' ? 'Instalar la app' : 'Instalar en el celular'}</span>}
      </button>
      <InstallGuideDialog open={guideOpen} onOpenChange={setGuideOpen} platform={platform} />
    </>
  )
}
