import type { Activity } from '@/types'

// Puntuación de tests internos (ítems 'escala' con categoría).
// USO EXCLUSIVAMENTE PROFESIONAL: el consultante responde el test pero
// nunca ve un resultado numérico (principio del método).

export interface CategoryScore {
  categoria: string
  promedio: number // 1..5
  items: number
}

export function scoreActivity(activity: Activity): CategoryScore[] {
  const porCategoria = new Map<string, number[]>()
  for (const q of activity.preguntas) {
    if (q.tipo !== 'escala' || !q.categoria) continue
    const r = activity.respuestas.find((x) => x.questionId === q.id)
    const valor = r ? Number(r.texto) : NaN
    if (!Number.isFinite(valor)) continue
    const list = porCategoria.get(q.categoria) ?? []
    list.push(valor)
    porCategoria.set(q.categoria, list)
  }
  return [...porCategoria.entries()]
    .map(([categoria, valores]) => ({
      categoria,
      promedio: Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 10) / 10,
      items: valores.length,
    }))
    .sort((a, b) => b.promedio - a.promedio)
}

export function isTest(activity: Activity): boolean {
  return activity.preguntas.some((q) => q.tipo === 'escala' && q.categoria)
}
