import type { StoredFile } from '@/types'

/** Descarga un archivo almacenado como DataURL (helper compartido pro/consultante). */
export function downloadStoredFile(f: StoredFile) {
  if (!f.dataUrl) return
  const a = document.createElement('a')
  a.href = f.dataUrl
  a.download = f.nombre
  a.click()
}

/**
 * Lee una imagen y la devuelve como DataURL cuadrado y comprimido (para fotos
 * de perfil en LocalStorage; en Supabase la foto irá a Storage sin este límite).
 */
export function imageToAvatarDataUrl(file: File, size = 192): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!
      // recorte centrado tipo cover
      const min = Math.min(img.width, img.height)
      const sx = (img.width - min) / 2
      const sy = (img.height - min) / 2
      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = reject
    img.src = url
  })
}
