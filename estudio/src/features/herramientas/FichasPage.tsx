import { useMemo, useState } from 'react'
import { BookOpenCheck, Plus, RotateCw, Trash2 } from 'lucide-react'
import { useCrearFicha, useEliminarFicha, useFichas, useRepasarFicha } from '@/hooks/queries'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input, Label, NativeSelect, Textarea } from '@/components/ui/input'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

export default function FichasPage() {
  const { data: fichas = [] } = useFichas()
  const crear = useCrearFicha()
  const repasar = useRepasarFicha()
  const eliminar = useEliminarFicha()

  const [nuevaAbierta, setNuevaAbierta] = useState(false)
  const [temaFiltro, setTemaFiltro] = useState('todos')
  const [vueltas, setVueltas] = useState<Record<string, boolean>>({})

  const temas = useMemo(() => Array.from(new Set(fichas.map((f) => f.tema))).sort(), [fichas])
  const visibles = fichas.filter((f) => temaFiltro === 'todos' || f.tema === temaFiltro)

  return (
    <FadeIn className="space-y-5">
      <PageHeader
        title="Fichas de repaso"
        subtitle="Escribí tus propias tarjetas pregunta/respuesta y practicá dándoles la vuelta."
        actions={
          <Button onClick={() => setNuevaAbierta(true)}>
            <Plus className="h-4 w-4" /> Nueva ficha
          </Button>
        }
      />

      {temas.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant={temaFiltro === 'todos' ? 'default' : 'outline'} onClick={() => setTemaFiltro('todos')}>
            Todos los temas
          </Button>
          {temas.map((t) => (
            <Button key={t} size="sm" variant={temaFiltro === t ? 'default' : 'outline'} onClick={() => setTemaFiltro(t)}>
              {t}
            </Button>
          ))}
        </div>
      )}

      {visibles.length === 0 ? (
        <EmptyState icon={BookOpenCheck} title="Todavía no hay fichas" description="Creá la primera con «Nueva ficha»." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((f) => {
            const vuelta = !!vueltas[f.id]
            return (
              <Card
                key={f.id}
                className="group relative min-h-[140px] cursor-pointer select-none"
                onClick={() => setVueltas((v) => ({ ...v, [f.id]: !v[f.id] }))}
              >
                <CardHeader className="pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-faint">{f.tema}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        eliminar.mutate(f.id)
                      }}
                      className="opacity-0 group-hover:opacity-100"
                      aria-label="Borrar ficha"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-danger" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className={cn('text-[13.5px]', vuelta ? 'text-muted-foreground' : 'font-medium')}>
                    {vuelta ? f.respuesta : f.pregunta}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-faint">{vuelta ? 'Respuesta' : 'Pregunta'} · tocá para dar vuelta</span>
                    {!vuelta && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          repasar.mutate({ id: f.id, vecesRepasada: f.vecesRepasada })
                          setVueltas((v) => ({ ...v, [f.id]: true }))
                        }}
                        className="flex items-center gap-1 text-[11px] font-medium text-primary"
                      >
                        <RotateCw className="h-3 w-3" /> Repasada {f.vecesRepasada}×
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <DialogoNuevaFicha
        open={nuevaAbierta}
        onClose={() => setNuevaAbierta(false)}
        temasExistentes={temas}
        onCrear={async (data) => {
          await crear.mutateAsync(data)
          toast.success('Ficha creada')
          setNuevaAbierta(false)
        }}
      />
    </FadeIn>
  )
}

function DialogoNuevaFicha({
  open,
  onClose,
  temasExistentes,
  onCrear,
}: {
  open: boolean
  onClose: () => void
  temasExistentes: string[]
  onCrear: (data: { tema: string; pregunta: string; respuesta: string }) => Promise<void>
}) {
  const [tema, setTema] = useState('')
  const [temaNuevo, setTemaNuevo] = useState('')
  const [pregunta, setPregunta] = useState('')
  const [respuesta, setRespuesta] = useState('')

  const temaFinal = tema === '__nuevo__' ? temaNuevo.trim() : tema

  async function guardar() {
    if (!temaFinal || !pregunta.trim() || !respuesta.trim()) return
    await onCrear({ tema: temaFinal, pregunta: pregunta.trim(), respuesta: respuesta.trim() })
    setPregunta('')
    setRespuesta('')
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva ficha</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Tema</Label>
            <NativeSelect value={tema} onChange={(e) => setTema(e.target.value)}>
              <option value="">Elegí o creá un tema</option>
              {temasExistentes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="__nuevo__">+ Tema nuevo</option>
            </NativeSelect>
            {tema === '__nuevo__' && (
              <Input className="mt-2" placeholder="Nombre del tema" value={temaNuevo} onChange={(e) => setTemaNuevo(e.target.value)} />
            )}
          </div>
          <div>
            <Label>Pregunta</Label>
            <Textarea value={pregunta} onChange={(e) => setPregunta(e.target.value)} />
          </div>
          <div>
            <Label>Respuesta</Label>
            <Textarea value={respuesta} onChange={(e) => setRespuesta(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={guardar} disabled={!temaFinal || !pregunta.trim() || !respuesta.trim()}>
              Crear ficha
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
