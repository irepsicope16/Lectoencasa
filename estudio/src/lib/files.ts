import type { StoredFile } from '@/types'

export function downloadStoredFile(file: StoredFile) {
  if (!file.dataUrl) return
  const a = document.createElement('a')
  a.href = file.dataUrl
  a.download = file.nombre
  a.click()
}
