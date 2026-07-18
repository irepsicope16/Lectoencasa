import { Download, FileText, FolderOpen } from 'lucide-react'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useFiles } from '@/hooks/queries'
import { useAuthStore } from '@/stores/authStore'
import { MODULE_MAP } from '@/data/modules'
import { fechaCorta, formatBytes } from '@/lib/utils'
import type { StoredFile } from '@/types'

export default function MyMaterialsPage() {
  const user = useAuthStore((s) => s.user)
  const consultantId = user?.consultantId ?? ''
  const { data: files = [] } = useFiles()

  // materiales propios + materiales generales del estudio
  const visible = files
    .filter((f) => f.consultantId === consultantId || !f.consultantId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const download = (f: StoredFile) => {
    if (!f.dataUrl) return
    const a = document.createElement('a')
    a.href = f.dataUrl
    a.download = f.nombre
    a.click()
  }

  return (
    <FadeIn>
      <PageHeader
        title="Materiales"
        subtitle="Archivos y materiales que tu profesional compartió con vos."
      />
      {visible.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Sin materiales por ahora"
          description="Acá vas a encontrar plantillas, guías y archivos de tu proceso."
        />
      ) : (
        <div className="space-y-2">
          {visible.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded-xl border bg-surface p-4">
              <FileText className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium">{f.nombre}</p>
                <p className="text-[11.5px] text-faint">
                  {formatBytes(f.tamano)} · {fechaCorta(f.createdAt)}
                  {f.descripcion && ` · ${f.descripcion}`}
                </p>
              </div>
              {!f.consultantId && <Badge variant="lavanda">General</Badge>}
              {f.moduleId && <Badge variant="outline">{MODULE_MAP[f.moduleId].nombre}</Badge>}
              {f.dataUrl ? (
                <Button variant="outline" size="sm" onClick={() => download(f)}>
                  <Download /> Descargar
                </Button>
              ) : (
                <Badge variant="gris">disponible en sesión</Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </FadeIn>
  )
}
