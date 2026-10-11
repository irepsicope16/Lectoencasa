import { Backpack, Cake, FileCheck2, ListTodo } from 'lucide-react'
import { planificadorPrincipianteHooks } from '@/hooks/queries'
import { DIA_COLOR_VIVO, PlanificadorSemanal, type TipoEventoConfig } from './PlanificadorSemanal'
import type { TipoEvento } from '@/types'

const TIPOS: Partial<Record<TipoEvento, TipoEventoConfig>> = {
  tarea: { label: 'Tarea', icon: ListTodo, color: 'var(--color-mod-regular)' },
  evaluacion: { label: 'Evaluación', icon: FileCheck2, color: 'var(--color-danger)' },
  material: { label: 'Material', icon: Backpack, color: 'var(--color-mod-organizar)' },
  cumpleanos: { label: 'Cumpleaños', icon: Cake, color: 'var(--color-mod-aprender)' },
}

export default function PlanificadorPrincipiantePage() {
  return (
    <PlanificadorSemanal
      titulo="Planificador — Principiante"
      subtitulo="Tareas, evaluaciones, materiales y cumpleaños, con colores bien vivos para los primeros años."
      tipos={TIPOS}
      colorPorDia={DIA_COLOR_VIVO}
      hooks={planificadorPrincipianteHooks}
    />
  )
}
