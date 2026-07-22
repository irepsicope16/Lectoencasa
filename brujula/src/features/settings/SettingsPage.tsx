import { useRef, useState } from 'react'
import { Cloud, CloudUpload, Database, Download, Moon, Paintbrush, RefreshCcw, Sparkles, Sun, Upload } from 'lucide-react'
import { exportBackup, importBackup } from '@/services/storage/backup'
import { getCloudConfig, isCloudEnabled, saveCloudConfig } from '@/services/cloud/config'
import { toast } from '@/components/ui/toast'
import { FadeIn, PageHeader } from '@/components/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label, NativeSelect } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUIStore, type Theme } from '@/stores/uiStore'
import { getAISettings, saveAISettings } from '@/services/ai'
import { resetDemoData } from '@/data/seed'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const qc = useQueryClient()

  const [ai, setAi] = useState(getAISettings())
  const [saved, setSaved] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const importRef = useRef<HTMLInputElement>(null)

  const [cloud, setCloud] = useState(getCloudConfig())
  const cloudActive = isCloudEnabled()
  const [cloudBusy, setCloudBusy] = useState('')
  const [proAccount, setProAccount] = useState({ nombre: '', apellido: '', titulo: '', email: '', password: '' })

  const testCloud = async () => {
    setCloudBusy('Probando conexión…')
    const { testCloudConnection } = await import('@/services/cloud/client')
    const res = await testCloudConnection(cloud.url.trim(), cloud.anonKey.trim())
    setCloudBusy('')
    if (res.ok) toast.success('Conexión exitosa con Supabase')
    else toast.error(res.error ?? 'No se pudo conectar')
  }

  const activateCloud = () => {
    saveCloudConfig({ url: cloud.url.trim(), anonKey: cloud.anonKey.trim(), enabled: true })
    toast.success('Modo nube activado · recargando…')
    setTimeout(() => window.location.reload(), 900)
  }

  const deactivateCloud = () => {
    saveCloudConfig({ ...cloud, enabled: false })
    toast.info('Modo nube desactivado · recargando…')
    setTimeout(() => window.location.reload(), 900)
  }

  const createProAccount = async () => {
    setCloudBusy('Creando cuenta profesional…')
    try {
      const { getIsolatedClient } = await import('@/services/cloud/client')
      const sb = await getIsolatedClient()
      const { error } = await sb.auth.signUp({
        email: proAccount.email.trim(),
        password: proAccount.password,
        options: {
          data: {
            role: 'profesional',
            nombre: proAccount.nombre.trim(),
            apellido: proAccount.apellido.trim(),
            titulo: proAccount.titulo.trim() || undefined,
          },
        },
      })
      if (error) toast.error(error.message)
      else toast.success('Cuenta profesional creada. Ya podés ingresar con ella.')
    } finally {
      setCloudBusy('')
    }
  }

  const migrate = async () => {
    setCloudBusy('Migrando datos…')
    const { migrateLocalToCloud } = await import('@/services/cloud/migrate')
    const res = await migrateLocalToCloud((m) => setCloudBusy(m))
    setCloudBusy('')
    if (res.ok) toast.success(`Migración completa: ${res.subidos} registros subidos a la nube`)
    else toast.error(`Migración interrumpida (${res.subidos} subidos): ${res.error}`)
  }

  return (
    <FadeIn>
      <PageHeader title="Ajustes" subtitle="Apariencia, asistente IA y datos de la plataforma." />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* apariencia */}
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

        {/* IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-strong" /> Asistente IA
            </CardTitle>
            <CardDescription>
              Sin clave funciona el asistente local (plantillas + datos reales). Con una clave de OpenAI, los
              borradores los redacta el modelo elegido. La clave se guarda solo en este dispositivo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Proveedor</Label>
              <NativeSelect
                value={ai.proveedor}
                onChange={(e) => setAi({ ...ai, proveedor: e.target.value as 'local' | 'openai' })}
              >
                <option value="local">Asistente local (sin conexión)</option>
                <option value="openai">OpenAI</option>
              </NativeSelect>
            </div>
            {ai.proveedor === 'openai' && (
              <>
                <div>
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={ai.apiKey ?? ''}
                    onChange={(e) => setAi({ ...ai, apiKey: e.target.value })}
                    placeholder="sk-…"
                  />
                </div>
                <div>
                  <Label>Modelo</Label>
                  <NativeSelect value={ai.modelo} onChange={(e) => setAi({ ...ai, modelo: e.target.value })}>
                    <option value="gpt-4o-mini">gpt-4o-mini (recomendado)</option>
                    <option value="gpt-4o">gpt-4o</option>
                    <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                  </NativeSelect>
                </div>
              </>
            )}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => {
                  saveAISettings(ai)
                  setSaved(true)
                  setTimeout(() => setSaved(false), 1500)
                }}
              >
                Guardar configuración
              </Button>
              {saved && <Badge variant="aqua">Guardado ✓</Badge>}
            </div>
            <p className="text-[11.5px] leading-relaxed text-faint">
              La IA de Método Brújula produce solo borradores: la lectura clínica y la palabra final son siempre de
              la profesional.
            </p>
          </CardContent>
        </Card>

        {/* nube */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-primary" /> Nube (Supabase)
              <Badge variant={cloudActive ? 'aqua' : 'gris'}>{cloudActive ? 'Activa' : 'Modo local'}</Badge>
            </CardTitle>
            <CardDescription>
              Con la nube activa, los datos viven en tu proyecto de Supabase: cuentas reales, acceso desde
              cualquier dispositivo y sincronización automática con tus consultantes. La guía paso a paso está en
              el archivo <code>SUPABASE.md</code> del proyecto (crear el proyecto lleva ~10 minutos y es gratis).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>URL del proyecto</Label>
                <Input
                  value={cloud.url}
                  onChange={(e) => setCloud({ ...cloud, url: e.target.value })}
                  placeholder="https://xxxx.supabase.co"
                />
              </div>
              <div>
                <Label>Clave anónima (anon key)</Label>
                <Input
                  type="password"
                  value={cloud.anonKey}
                  onChange={(e) => setCloud({ ...cloud, anonKey: e.target.value })}
                  placeholder="eyJ…"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={testCloud} disabled={!cloud.url || !cloud.anonKey || !!cloudBusy}>
                Probar conexión
              </Button>
              {!cloudActive ? (
                <Button size="sm" onClick={activateCloud} disabled={!cloud.url || !cloud.anonKey || !!cloudBusy}>
                  <CloudUpload /> Activar modo nube
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={deactivateCloud}>
                  Volver al modo local
                </Button>
              )}
              {cloudBusy && <span className="text-[12px] text-accent-strong">{cloudBusy}</span>}
            </div>

            {cloudActive && (
              <div className="grid gap-4 rounded-lg border border-dashed p-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-[12.5px] font-semibold">1 · Crear tu cuenta profesional</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Nombre"
                      value={proAccount.nombre}
                      onChange={(e) => setProAccount({ ...proAccount, nombre: e.target.value })}
                    />
                    <Input
                      placeholder="Apellido"
                      value={proAccount.apellido}
                      onChange={(e) => setProAccount({ ...proAccount, apellido: e.target.value })}
                    />
                  </div>
                  <Input
                    placeholder="Título profesional (opcional)"
                    value={proAccount.titulo}
                    onChange={(e) => setProAccount({ ...proAccount, titulo: e.target.value })}
                  />
                  <Input
                    placeholder="tu@email.com"
                    value={proAccount.email}
                    onChange={(e) => setProAccount({ ...proAccount, email: e.target.value })}
                  />
                  <Input
                    type="password"
                    placeholder="Contraseña (mín. 6 caracteres)"
                    value={proAccount.password}
                    onChange={(e) => setProAccount({ ...proAccount, password: e.target.value })}
                  />
                  <Button
                    size="sm"
                    onClick={createProAccount}
                    disabled={
                      !proAccount.nombre || !proAccount.apellido || !proAccount.email ||
                      proAccount.password.length < 6 || !!cloudBusy
                    }
                  >
                    Crear cuenta profesional
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-[12.5px] font-semibold">2 · Subir tus datos locales</p>
                  <p className="text-[12px] text-muted-foreground">
                    Copia todo lo que tenés guardado en este navegador (consultantes, sesiones, actividades…) a la
                    nube. Se puede repetir sin duplicar. Requiere haber ingresado con tu cuenta profesional.
                  </p>
                  <Button size="sm" variant="soft" onClick={migrate} disabled={!!cloudBusy}>
                    <CloudUpload /> Migrar mis datos a la nube
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* datos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" /> Datos
            </CardTitle>
            <CardDescription>
              Esta versión guarda todo localmente en el navegador. La arquitectura ya está preparada para migrar a
              la nube (Supabase) sin cambios en la interfaz: cuentas reales, respaldo automático y acceso desde
              cualquier dispositivo.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={async () => {
                await exportBackup()
                toast.success('Copia de seguridad descargada')
              }}
            >
              <Download /> Exportar copia de seguridad
            </Button>
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
          <DialogFooter>
            <Button variant="ghost" onClick={() => setResetOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await resetDemoData()
                await qc.invalidateQueries()
                setResetOpen(false)
              }}
            >
              Restablecer todo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FadeIn>
  )
}
