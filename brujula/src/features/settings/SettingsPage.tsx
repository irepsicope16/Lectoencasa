import { useState } from 'react'
import { Database, Moon, Paintbrush, RefreshCcw, Sparkles, Sun } from 'lucide-react'
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
          <CardContent>
            <Button variant="outline" size="sm" onClick={() => setResetOpen(true)}>
              <RefreshCcw /> Restablecer datos de demostración
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
