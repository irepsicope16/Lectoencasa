import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-surface-2 text-muted-foreground',
        aqua: 'bg-primary-soft text-primary-strong',
        lavanda: 'bg-accent-soft text-accent-strong',
        amber: 'bg-warning-soft text-warning',
        danger: 'bg-danger-soft text-danger',
        outline: 'border text-muted-foreground',
        gris: 'bg-surface-2 text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
