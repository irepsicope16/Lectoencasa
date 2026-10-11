import { Backpack, BookOpenCheck, Cake, FileText, GraduationCap, ListTodo } from 'lucide-react'
import { planificadorSuperiorHooks } from '@/hooks/queries'
import { gamaTonal, PlanificadorSemanal, type TipoEventoConfig } from './PlanificadorSemanal'
import type { TipoEvento } from '@/types'

const TIPOS: Partial<Record<TipoEvento, TipoEventoConfig>> = {
  tarea: { label: 'Tarea', icon: ListTodo, color: 'var(--color-mod-regular)' },
  tp: { label: 'TP', icon: FileText, color: 'var(--color-secondary)' },
  parcial: { label: 'Parcial', icon: BookOpenCheck, color: 'var(--color-warning)' },
  final: { label: 'Final', icon: GraduationCap, color: 'var(--color-danger)' },
  material: { label: 'Material', icon: Backpack, color: 'var(--color-mod-organizar)' },
  cumpleanos: { label: 'Cumpleaños', icon: Cake, color: 'var(--color-mod-aprender)' },
}

const COLOR_DIA = gamaTonal('var(--color-primary)')

export default function PlanificadorSuperiorPage() {
  return (
    <PlanificadorSemanal
      titulo="Planificador — Superior"
      subtitulo="Tareas, TP, parciales, finales, materiales y cumpleaños — para el tramo más avanzado."
      tipos={TIPOS}
      colorPorDia={COLOR_DIA}
      hooks={planificadorSuperiorHooks}
    />
  )
}
