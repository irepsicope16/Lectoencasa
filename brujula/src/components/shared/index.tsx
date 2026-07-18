import * as React from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------- PageHeader ----------
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

// ---------- EmptyState ----------
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

// ---------- StatCard ----------
export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'aqua',
}: {
  icon: LucideIcon
  label: string
  value: React.ReactNode
  hint?: string
  tone?: 'aqua' | 'lavanda' | 'neutro'
}) {
  return (
    <div className="rounded-xl border bg-surface p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <div
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg',
            tone === 'aqua' && 'bg-primary-soft text-primary-strong',
            tone === 'lavanda' && 'bg-accent-soft text-accent-strong',
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

// ---------- ProgressRing ----------
export function ProgressRing({
  value,
  size = 44,
  stroke = 4,
  className,
  label,
}: {
  value: number // 0..100
  size?: number
  stroke?: number
  className?: string
  label?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * Math.min(100, Math.max(0, value))) / 100 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute text-[10.5px] font-semibold text-foreground">
        {label ?? `${Math.round(value)}%`}
      </span>
    </div>
  )
}

// ---------- FadeIn (transición de página) ----------
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
