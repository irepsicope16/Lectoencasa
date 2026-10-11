import { Backpack, Cake, FileCheck2, ListTodo } from 'lucide-react'
import { planificadorSecundariaHooks } from '@/hooks/queries'
import { gamaTonal, PlanificadorSemanal, type TipoEventoConfig } from './PlanificadorSemanal'
import type { TipoEvento } from '@/types'

const TIPOS: Partial<Record<TipoEvento, TipoEventoConfig>> = {
  tarea: { label: 'Tarea', icon: ListTodo, color: 'var(--color-mod-regular)' },
  evaluacion: { label: 'Evaluación', icon: FileCheck2, color: 'var(--color-danger)' },
  material: { label: 'Material', icon: Backpack, color: 'var(--color-mod-organizar)' },
  cumpleanos: { label: 'Cumpleaños', icon: Cake, color: 'var(--color-mod-aprender)' },
}

const COLOR_DIA = gamaTonal('var(--color-secondary)')

export default function PlanificadorSecundariaPage() {
  return (
    <PlanificadorSemanal
      titulo="Planificador — Secundaria"
      subtitulo="Tareas, evaluaciones, materiales y cumpleaños, con una gama de colores más sobria para el secundario."
      tipos={TIPOS}
      colorPorDia={COLOR_DIA}
      hooks={planificadorSecundariaHooks}
    />
  )
}
