import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Cloud, CloudUpload, Database, Download, IdCard, Moon, Paintbrush, RefreshCcw, Sun, Upload } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore, type Theme } from '@/stores/uiStore'
import { prepareBackup, importBackup, type PreparedBackup } from '@/services/storage/backup'
import { getCloudConfig, isCloudEnabled, saveCloudConfig } from '@/services/cloud/config'
import { isOwner, oneYearFromNow } from '@/lib/membership'
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
  const showCloudPanel = isOwner(user)

  const [perfil, setPerfil] = useState({
    nombre: user?.nombre ?? '',
    apellido: user?.apellido ?? '',
    titulo: user?.titulo ?? '',
    matricula: user?.matricula ?? '',
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
      const { getIsolatedClient, getSupabase } = await import('@/services/cloud/client')
      const sb = await getIsolatedClient()
      const { data, error } = await sb.auth.signUp({
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
      if (error) {
        toast.error(error.message)
        return
      }
      // La membresía nunca se acepta desde los metadatos del registro (ver
      // handle_new_user en schema.sql) — se activa acá aparte, con la
      // sesión real de la dueña, que es la única habilitada por RLS
      // (profiles_admin_update) para escribir membershipExpiresAt.
      if (data.user) {
        const owner = await getSupabase()
        const { data: row, error: readErr } = await owner
          .from('profiles')
          .select('data')
          .eq('id', data.user.id)
          .maybeSingle()
        if (readErr || !row) {
          toast.error('Cuenta creada, pero no se pudo activar la membresía: no se encontró el perfil.')
          return
        }
        const merged = { ...(row.data as object), membershipExpiresAt: oneYearFromNow() }
        const { error: memErr } = await owner.from('profiles').update({ data: merged }).eq('id', data.user.id)
        if (memErr) {
          toast.error(`Cuenta creada, pero no se pudo activar la membresía: ${memErr.message}`)
          return
        }
      }
      toast.success('Cuenta profesional creada. Ya podés ingresar con ella.')
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
              <div>
                <Label>Título profesional</Label>
                <Input
                  value={perfil.titulo}
                  onChange={(e) => setPerfil({ ...perfil, titulo: e.target.value })}
                  placeholder="Lic. en Psicopedagogía"
                />
              </div>
              <div>
                <Label>Matrícula</Label>
                <Input
                  value={perfil.matricula}
                  onChange={(e) => setPerfil({ ...perfil, matricula: e.target.value })}
                  placeholder="MP 260505"
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

        {/* nube: solo la dueña de la plataforma administra la configuración de Supabase. */}
        {showCloudPanel && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-primary" /> Nube (Supabase)
              <Badge variant={cloudActive ? 'primario' : 'default'}>{cloudActive ? 'Activa' : 'Modo local'}</Badge>
            </CardTitle>
            <CardDescription>
              Con la nube activa, los datos viven en tu proyecto de Supabase: cuentas reales, acceso desde
              cualquier dispositivo y sincronización automática con las cuentas de estudiante. La guía paso a paso
              está en el archivo <code>SUPABASE.md</code> del proyecto (crear el proyecto lleva ~10 minutos y es
              gratis).
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
                    Copia todo lo que tenés guardado en este navegador (estudiantes, sesiones, actividades…) a la
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
        )}

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
