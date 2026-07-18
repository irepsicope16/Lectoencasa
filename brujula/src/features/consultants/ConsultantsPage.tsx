import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, UserPlus, Users } from 'lucide-react'
import { EmptyState, FadeIn, PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input, NativeSelect } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { useConsultants, useCreate, useModuleProgress } from '@/hooks/queries'
import { edad, fechaCorta, iniciales, nombreCompleto } from '@/lib/utils'
import { overallProgress } from '@/lib/progress'
import { CONSULTANT_STATUS } from '@/lib/constants'
import { useAuthStore } from '@/stores/authStore'
import type { Consultant } from '@/types'
import { toast } from '@/components/ui/toast'
import { ensureConsultantAccount } from '@/features/auth/accounts'
import { ConsultantFormDialog } from './ConsultantForm'

export default function ConsultantsPage() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState<string>('todos')
  const open = params.get('nuevo') === '1'
  const user = useAuthStore((s) => s.user)

  const { data: consultants = [] } = useConsultants()
  const { data: progress = [] } = useModuleProgress()
  const createConsultant = useCreate<Consultant>('consultants', (c) => ({
    actor: 'profesional',
    consultantId: c.id,
    tipo: 'consultante_creado',
    descripcion: `Se creó la ficha de ${nombreCompleto(c)}`,
  }))

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return consultants
      .filter((c) => (estado === 'todos' ? true : c.estado === estado))
      .filter((c) =>
        term
          ? `${c.nombre} ${c.apellido} ${c.escuela} ${c.curso}`.toLowerCase().includes(term)
          : true,
      )
      .sort((a, b) => a.apellido.localeCompare(b.apellido))
  }, [consultants, q, estado])

  const setOpen = (o: boolean) => {
    if (o) params.set('nuevo', '1')
    else params.delete('nuevo')
    setParams(params, { replace: true })
  }

  return (
    <FadeIn>
      <PageHeader
        title="Consultantes"
        subtitle={`${consultants.length} consultantes · ${consultants.filter((c) => c.estado === 'en_proceso').length} en proceso activo`}
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <UserPlus /> Nuevo consultante
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o escuela…"
            className="pl-9"
          />
        </div>
        <NativeSelect value={estado} onChange={(e) => setEstado(e.target.value)} className="w-48">
          <option value="todos">Todos los estados</option>
          {Object.entries(CONSULTANT_STATUS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin consultantes"
          description="Creá tu primer consultante para comenzar un proceso de orientación."
          action={
            <Button size="sm" onClick={() => setOpen(true)}>
              <UserPlus /> Nuevo consultante
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const pct = overallProgress(progress, c.id)
            const st = CONSULTANT_STATUS[c.estado]
            return (
              <Link
                key={c.id}
                to={`/pro/consultantes/${c.id}`}
                className="group rounded-xl border bg-surface p-4 transition-all hover:border-border-strong hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{iniciales(c.nombre, c.apellido)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold">{nombreCompleto(c)}</p>
                    <p className="text-[12px] text-faint">
                      {edad(c.fechaNacimiento)} años · {c.curso}
                    </p>
                  </div>
                  <Badge variant={st.tone as 'aqua'}>{st.label}</Badge>
                </div>
                <p className="mt-3 line-clamp-2 min-h-[2.4em] text-[12.5px] text-muted-foreground">
                  {c.motivoConsulta}
                </p>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[11px] text-faint">
                    <span>Recorrido del método</span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={pct} />
                </div>
                <p className="mt-2.5 text-[11px] text-faint">
                  Inicio: {fechaCorta(c.fechaInicio)} · {c.escuela}
                </p>
              </Link>
            )
          })}
        </div>
      )}

      <ConsultantFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={async (data) => {
          const created = await createConsultant.mutateAsync({ ...data, profesionalId: user?.id ?? '' })
          const cuenta = await ensureConsultantAccount(created)
          if (cuenta) {
            toast.success(`Ficha creada · acceso: ${cuenta.email} / clave «${cuenta.password}»`)
          } else {
            toast.success('Ficha creada correctamente')
          }
        }}
      />
    </FadeIn>
  )
}
