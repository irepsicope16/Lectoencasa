import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Database, Download, IdCard, Moon, Paintbrush, RefreshCcw, Sun, Upload } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore, type Theme } from '@/stores/uiStore'
import { prepareBackup, importBackup, type PreparedBackup } from '@/services/storage/backup'
import { resetDemoData } from '@/data/seed'
import { toast } from '@/components/ui/toast'
import { FadeIn, PageHeader } from '@/components/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const updateProfile = useAuthStore((s) => s.updateProfile)

  const [perfil, setPerfil] = useState({
    nombre: user?.nombre ?? '',
    apellido: user?.apellido ?? '',
    titulo: user?.titulo ?? '',
  })
  const [perfilSaving, setPerfilSaving] = useState(false)
  const [perfilSaved, setPerfilSaved] = useState(false)

  const guardarPerfil = async () => {
    setPerfilSaving(true)
    try {
      await updateProfile(perfil)
      setPerfilSaved(true)
      setTimeout(() => setPerfilSaved(false), 1500)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo guardar el perfil')
    } finally {
      setPerfilSaving(false)
    }
  }

  const [resetOpen, setResetOpen] = useState(false)
  const importRef = useRef<HTMLInputElement>(null)
  const [backupReady, setBackupReady] = useState<PreparedBackup | null>(null)
  const [backupPreparing, setBackupPreparing] = useState(false)

  return (
    <FadeIn>
      <PageHeader title="Ajustes" subtitle="Perfil, apariencia y datos de la plataforma." />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IdCard className="h-4 w-4 text-primary" /> Mi perfil profesional
            </CardTitle>
            <CardDescription>Estos datos son propios de tu cuenta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Nombre</Label>
                <Input value={perfil.nombre} onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })} />
              </div>
              <div>
                <Label>Apellido</Label>
                <Input value={perfil.apellido} onChange={(e) => setPerfil({ ...perfil, apellido: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Título profesional</Label>
                <Input
                  value={perfil.titulo}
                  onChange={(e) => setPerfil({ ...perfil, titulo: e.target.value })}
                  placeholder="Lic. en Psicopedagogía"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={guardarPerfil} disabled={perfilSaving}>
                Guardar perfil
              </Button>
              {perfilSaved && <Badge variant="primario">Guardado ✓</Badge>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paintbrush className="h-4 w-4 text-primary" /> Apariencia
            </CardTitle>
            <CardDescription>El tema se aplica al instante y queda guardado en este dispositivo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { value: 'light', label: 'Claro', icon: Sun },
                  { value: 'dark', label: 'Oscuro', icon: Moon },
                  { value: 'system', label: 'Sistema', icon: RefreshCcw },
                ] as { value: Theme; label: string; icon: typeof Sun }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    'flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 transition-colors hover:bg-surface-2',
                    theme === opt.value && 'border-primary bg-primary-soft/50',
                  )}
                >
                  <opt.icon className="h-4 w-4" />
                  <span className="text-[12.5px] font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" /> Datos
            </CardTitle>
            <CardDescription>Esta versión guarda todo localmente en el navegador.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            {backupReady ? (
              <Button size="sm" asChild>
                <a
                  href={backupReady.url}
                  download={backupReady.filename}
                  onClick={() => {
                    toast.success('Copia de seguridad descargada')
                    setTimeout(() => {
                      URL.revokeObjectURL(backupReady.url)
                      setBackupReady(null)
                    }, 0)
                  }}
                >
                  <Download /> Descargar {backupReady.filename}
                </a>
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={backupPreparing}
                onClick={async () => {
                  setBackupPreparing(true)
                  try {
                    setBackupReady(await prepareBackup())
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : 'No se pudo generar la copia de seguridad')
                  } finally {
                    setBackupPreparing(false)
                  }
                }}
              >
                <Download /> {backupPreparing ? 'Preparando…' : 'Exportar copia de seguridad'}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => importRef.current?.click()}>
              <Upload /> Importar copia
            </Button>
            <input
              ref={importRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                e.target.value = ''
                if (!file) return
                const res = await importBackup(file)
                if (res.ok) {
                  await qc.invalidateQueries()
                  toast.success('Copia importada correctamente')
                } else {
                  toast.error(res.error ?? 'No se pudo importar la copia')
                }
              }}
            />
            <Button variant="ghost" size="sm" onClick={() => setResetOpen(true)}>
              <RefreshCcw /> Restablecer datos demo
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restablecer datos</DialogTitle>
            <DialogDescription>
              Se borrará todo lo cargado y se volverá a los datos de demostración originales. Esta acción no puede
              deshacerse.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setResetOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await resetDemoData()
                await qc.invalidateQueries()
                setResetOpen(false)
                toast.success('Datos restablecidos')
              }}
            >
              Restablecer todo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </FadeIn>
  )
}
