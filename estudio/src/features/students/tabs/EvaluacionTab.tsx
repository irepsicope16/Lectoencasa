import { useRef, useState } from 'react'
import { Download, FileText, FolderOpen, Trash2, Upload } from 'lucide-react'
import { useCreateFile, useDeleteFile, useFiles } from '@/hooks/queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label, NativeSelect } from '@/components/ui/input'
import { AvisoOrientativo, EmptyState } from '@/components/shared'
import { downloadStoredFile } from '@/lib/files'
import { toast } from '@/components/ui/toast'
import { fechaCorta, formatBytes } from '@/lib/utils'
import type { Student, StoredFileTipo } from '@/types'

// Límite prudente para LocalStorage, que comparte una cuota total minúscula
// entre todos los datos de la app, no solo archivos.
const MAX_BYTES = 700 * 1024

const TIPO_LABEL: Record<StoredFileTipo, string> = {
  screening: 'Screening',
  test: 'Test',
  otro: 'Otro',
}

export function EvaluacionTab({ student }: { student: Student }) {
  const { data: files = [] } = useFiles(student.id)
  const createFile = useCreateFile()
  const removeFile = useDeleteFile()
  const inputRef = useRef<HTMLInputElement>(null)
  const [tipo, setTipo] = useState<StoredFileTipo>('screening')
  const [error, setError] = useState('')

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    if (file.size > MAX_BYTES) {
      setError(
        `El archivo pesa ${formatBytes(file.size)} y el máximo es ${formatBytes(MAX_BYTES)}. Se guarda solo el nombre como referencia — no se va a poder abrir desde acá.`,
      )
      await createFile.mutateAsync({
        studentId: student.id,
        nombre: file.name,
        mimeType: file.type || 'application/octet-stream',
        tamano: file.size,
        tipo,
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
      studentId: student.id,
      nombre: file.name,
      mimeType: file.type || 'application/octet-stream',
      tamano: file.size,
      dataUrl,
      tipo,
    })
    toast.success(`«${file.name}» subido`)
  }

  return (
    <div className="space-y-4">
      <AvisoOrientativo>
        Subí acá los screenings o tests que quieras tener a mano antes de definir el plan — quedan disponibles para
        consultar en cualquier momento, no reemplazan el criterio profesional.
      </AvisoOrientativo>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <CardTitle>Evaluación</CardTitle>
              <CardDescription>Screenings, tests o documentos de evaluación de este estudiante.</CardDescription>
            </div>
            <div className="flex items-end gap-2">
              <div>
                <Label>Tipo</Label>
                <NativeSelect className="w-36" value={tipo} onChange={(e) => setTipo(e.target.value as StoredFileTipo)}>
                  <option value="screening">Screening</option>
                  <option value="test">Test</option>
                  <option value="otro">Otro</option>
                </NativeSelect>
              </div>
              <Button size="sm" onClick={() => inputRef.current?.click()}>
                <Upload /> Subir archivo
              </Button>
              <input ref={inputRef} type="file" className="hidden" onChange={onPick} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {error && <p className="mb-3 rounded-lg bg-warning-soft px-3 py-2 text-[12.5px] text-warning">{error}</p>}

          {files.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title="Sin evaluaciones subidas"
              description="Subí el primer screening o test para empezar a reunir evidencia antes del plan."
            />
          ) : (
            <div className="space-y-2">
              {files.map((f) => (
                <div key={f.id} className="flex items-center gap-3 rounded-xl border bg-surface p-3.5">
                  <FileText className="h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium">{f.nombre}</p>
                    <p className="text-[11.5px] text-faint">
                      {formatBytes(f.tamano)} · {fechaCorta(f.createdAt)}
                    </p>
                  </div>
                  <Badge variant="secundario">{TIPO_LABEL[f.tipo]}</Badge>
                  {f.dataUrl ? (
                    <Button variant="ghost" size="iconSm" onClick={() => downloadStoredFile(f)} aria-label="Descargar">
                      <Download />
                    </Button>
                  ) : (
                    <Badge variant="outline" title="Pesaba más del máximo permitido: se guardó el nombre, pero no el contenido.">
                      sin contenido
                    </Badge>
                  )}
                  <Button variant="ghost" size="iconSm" onClick={() => removeFile.mutate(f.id)} aria-label="Eliminar archivo">
                    <Trash2 className="text-danger" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
