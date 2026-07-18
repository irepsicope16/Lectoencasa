import { useState } from 'react'
import { NotebookPen, Plus } from 'lucide-react'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input, Label, NativeSelect, Textarea } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'
import { useCreate, useReflections } from '@/hooks/queries'
import { useAuthStore } from '@/stores/authStore'
import { MODULES, MODULE_MAP } from '@/data/modules'
import { MOODS } from '@/lib/constants'
import { fechaCorta } from '@/lib/utils'
import type { Mood, Reflection } from '@/types'
import { cn } from '@/lib/utils'

export default function MyReflectionsPage() {
  const user = useAuthStore((s) => s.user)
  const consultantId = user?.consultantId ?? ''
  const { data: reflections = [] } = useReflections()
  const createReflection = useCreate<Reflection>('reflections', (r) => ({
    actor: 'consultante',
    consultantId: r.consultantId,
    tipo: 'reflexion_creada',
    descripcion: `${user?.nombre ?? 'Consultante'} escribió la reflexión «${r.titulo}»`,
  }))

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ titulo: '', contenido: '', moduleId: '', animo: '' as Mood | '' })

  const own = reflections
    .filter((r) => r.consultantId === consultantId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <FadeIn>
      <PageHeader
        title="Mis reflexiones"
        subtitle="Tu bitácora personal del proceso. Tu profesional puede leerla para acompañarte mejor."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus /> Nueva reflexión
          </Button>
        }
      />

      {own.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="Todavía no escribiste reflexiones"
          description="Después de cada sesión o actividad, escribí lo que te quedó dando vueltas. Es tu espacio."
          action={
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus /> Escribir la primera
            </Button>
          }
        />
      ) : (
        <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
          {own.map((r) => (
            <div key={r.id} className="mb-3 break-inside-avoid rounded-xl border bg-surface p-4">
              <div className="flex items-center gap-2">
                <p className="min-w-0 flex-1 text-[13.5px] font-semibold">{r.titulo}</p>
                {r.animo && <span title={MOODS[r.animo].label}>{MOODS[r.animo].emoji}</span>}
              </div>
              <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-muted-foreground">
                {r.contenido}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                {r.moduleId && <Badge variant="outline">{MODULE_MAP[r.moduleId].nombre}</Badge>}
                <span className="ml-auto text-[11px] text-faint">{fechaCorta(r.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent wide>
          <DialogHeader>
            <DialogTitle>Nueva reflexión</DialogTitle>
            <DialogDescription>Escribí con tus palabras. No hay formato correcto.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="p. ej. Lo que me dejó la sesión de hoy"
              />
            </div>
            <div>
              <Label>¿Cómo te sentís?</Label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(MOODS) as Mood[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setForm({ ...form, animo: form.animo === m ? '' : m })}
                    className={cn(
                      'cursor-pointer rounded-full border px-3 py-1.5 text-[12.5px] transition-colors',
                      form.animo === m
                        ? 'border-accent bg-accent-soft text-accent-strong'
                        : 'text-muted-foreground hover:bg-surface-2',
                    )}
                  >
                    {MOODS[m].emoji} {MOODS[m].label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Módulo relacionado (opcional)</Label>
              <NativeSelect value={form.moduleId} onChange={(e) => setForm({ ...form, moduleId: e.target.value })}>
                <option value="">Sin módulo</option>
                {MODULES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.numero}. {m.nombre}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div>
              <Label>Tu reflexión</Label>
              <Textarea
                value={form.contenido}
                onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                className="min-h-[140px]"
                placeholder="¿Qué descubriste? ¿Qué te preocupa? ¿Qué te entusiasma?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!form.titulo.trim() || !form.contenido.trim()}
              onClick={async () => {
                await createReflection.mutateAsync({
                  consultantId,
                  titulo: form.titulo.trim(),
                  contenido: form.contenido.trim(),
                  moduleId: (form.moduleId || undefined) as never,
                  animo: form.animo || undefined,
                })
                setForm({ titulo: '', contenido: '', moduleId: '', animo: '' })
                setOpen(false)
                toast.success('Reflexión guardada en tu bitácora')
              }}
            >
              Guardar reflexión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FadeIn>
  )
}
