import { useRef, useState } from 'react'
import { Download, FileText, FolderOpen, Trash2, Upload } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label, NativeSelect } from '@/components/ui/input'
import { EmptyState } from '@/components/shared'
import { useCreate, useFiles, useRemove } from '@/hooks/queries'
import { downloadStoredFile } from '@/lib/files'
import { toast } from '@/components/ui/toast'
import { fechaCorta, formatBytes } from '@/lib/utils'
import { MODULES, MODULE_MAP } from '@/data/modules'
import type { Consultant, ModuleId, StoredFile } from '@/types'

// Límite prudente para LocalStorage. Con Supabase Storage este límite desaparece
// (la interfaz ya separa metadatos de contenido).
const MAX_BYTES = 700 * 1024

export function FilesTab({ consultant }: { consultant: Consultant }) {
  const { data: files = [] } = useFiles()
  const createFile = useCreate<StoredFile>('files', (f) => ({
    actor: 'profesional',
    consultantId: f.consultantId,
    tipo: 'archivo_subido',
    descripcion: `Se subió el archivo «${f.nombre}»`,
  }))
  const removeFile = useRemove('files')
  const inputRef = useRef<HTMLInputElement>(null)
  const [moduleId, setModuleId] = useState<string>('')
  const [error, setError] = useState('')

  const own = files
    .filter((f) => f.consultantId === consultant.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    if (file.size > MAX_BYTES) {
      setError(
        `El archivo pesa ${formatBytes(file.size)}. En esta versión local el máximo es ${formatBytes(MAX_BYTES)}; con la migración a la nube este límite desaparece. Se guardará solo la referencia.`,
      )
      await createFile.mutateAsync({
        consultantId: consultant.id,
        moduleId: (moduleId || undefined) as ModuleId | undefined,
        nombre: file.name,
        mimeType: file.type || 'application/octet-stream',
        tamano: file.size,
        subidoPor: 'profesional',
      })
      return
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    await createFile.mutateAsync({
      consultantId: consultant.id,
      moduleId: (moduleId || undefined) as ModuleId | undefined,
      nombre: file.name,
      mimeType: file.type || 'application/octet-stream',
      tamano: file.size,
      dataUrl,
      subidoPor: 'profesional',
    })
    toast.success(`«${file.name}» subido`)
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Label>Módulo del archivo (opcional)</Label>
          <NativeSelect value={moduleId} onChange={(e) => setModuleId(e.target.value)} className="w-56">
            <option value="">General del proceso</option>
            {MODULES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.numero}. {m.nombre}
              </option>
            ))}
          </NativeSelect>
        </div>
        <Button size="sm" onClick={() => inputRef.current?.click()}>
          <Upload /> Subir archivo
        </Button>
        <input ref={inputRef} type="file" className="hidden" onChange={onPick} />
      </div>
      {error && <p className="mb-3 rounded-lg bg-warning-soft px-3 py-2 text-[12.5px] text-warning">{error}</p>}

      {own.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Sin archivos"
          description="Subí material de trabajo, escaneos de actividades o documentos del proceso."
        />
      ) : (
        <div className="space-y-2">
          {own.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-xl border bg-surface p-3.5">
              <FileText className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium">{f.nombre}</p>
                <p className="text-[11.5px] text-faint">
                  {formatBytes(f.tamano)} · {fechaCorta(f.createdAt)} · subido por {f.subidoPor}
                  {f.descripcion && ` · ${f.descripcion}`}
                </p>
              </div>
              {f.moduleId && <Badge variant="outline">{MODULE_MAP[f.moduleId].nombre}</Badge>}
              {f.dataUrl ? (
                <Button variant="ghost" size="iconSm" onClick={() => downloadStoredFile(f)} aria-label="Descargar">
                  <Download />
                </Button>
              ) : (
                <Badge variant="gris">solo referencia</Badge>
              )}
              <Button
                variant="ghost"
                size="iconSm"
                onClick={() => removeFile.mutate(f.id)}
                aria-label="Eliminar archivo"
              >
                <Trash2 className="text-danger" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
