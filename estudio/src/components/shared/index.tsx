import * as React from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-3', className)}>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center', className)}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-2">
        <Icon className="h-5 w-5 text-faint" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'verde',
}: {
  icon: LucideIcon
  label: string
  value: React.ReactNode
  hint?: string
  tone?: 'verde' | 'terracota' | 'neutro'
}) {
  return (
    <div className="rounded-xl border bg-surface p-4 shadow-[0_1px_2px_rgba(16,24,32,0.04),0_4px_14px_-6px_rgba(16,24,32,0.07)]">
      <div className="flex items-center gap-2 text-muted-foreground">
        <div
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg',
            tone === 'verde' && 'bg-primary-soft text-primary-strong',
            tone === 'terracota' && 'bg-accent-soft text-accent-strong',
            tone === 'neutro' && 'bg-surface-2 text-muted-foreground',
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[12.5px] font-medium">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <p className="mt-0.5 text-[12px] text-faint">{hint}</p>}
    </div>
  )
}

export function FadeIn({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Aviso obligatorio (Anexo C del documento maestro): la herramienta orienta, no diagnostica. */
export function AvisoOrientativo({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <p className={cn('rounded-lg border border-dashed bg-surface-2 px-3 py-2 text-[12px] text-muted-foreground', className)}>
      {children ?? 'Esta herramienta orienta la intervención y no reemplaza una evaluación diagnóstica.'}
    </p>
  )
}
