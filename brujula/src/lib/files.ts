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

/**
 * Comprime una foto para subirla a Archivos (p. ej. la foto de un dibujo o
 * técnica proyectiva): la achica a un máximo de 1600px de lado manteniendo
 * la proporción completa (sin recortar) y la recodifica en JPEG. Una foto
 * de celular de 8-15 MB queda típicamente en unos cientos de KB, muy por
 * debajo del límite de subida, sin perder legibilidad para uso clínico.
 */
export function imageToCompressedDataUrl(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = url
  })
}

/** bytes aproximados que ocupa un DataURL en base64 (sin el prefijo "data:...;base64,"). */
export function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  return Math.round((base64.length * 3) / 4)
}
