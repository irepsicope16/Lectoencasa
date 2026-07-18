import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, GraduationCap, Mail, Pencil, Phone, Trash2 } from 'lucide-react'
import { FadeIn, ProgressRing } from '@/components/shared'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useConsultant, useModuleProgress, useRemove, useUpdate } from '@/hooks/queries'
import { edad, fechaCorta, iniciales, nombreCompleto } from '@/lib/utils'
import { overallProgress } from '@/lib/progress'
import { CONSULTANT_STATUS } from '@/lib/constants'
import type { Consultant } from '@/types'
import { useNavigate } from 'react-router-dom'
import { ConsultantFormDialog } from './ConsultantForm'
import { OverviewTab } from './tabs/OverviewTab'
import { ModulesTab } from './tabs/ModulesTab'
import { SessionsTab } from './tabs/SessionsTab'
import { ActivitiesTab } from './tabs/ActivitiesTab'
import { EvaluationsTab } from './tabs/EvaluationsTab'
import { FilesTab } from './tabs/FilesTab'
import { CompassTab } from './tabs/CompassTab'
import { AITab } from './tabs/AITab'
import { ReportsTab } from './tabs/ReportsTab'

export default function ConsultantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: consultant, isLoading } = useConsultant(id)
  const { data: progress = [] } = useModuleProgress()
  const updateConsultant = useUpdate<Consultant>('consultants')
  const removeConsultant = useRemove('consultants')
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (isLoading) return null
  if (!consultant) {
    return (
      <div className="py-20 text-center text-sm text-faint">
        No se encontró el consultante.{' '}
        <Link to="/pro/consultantes" className="text-primary underline">
          Volver
        </Link>
      </div>
    )
  }

  const pct = overallProgress(progress, consultant.id)
  const st = CONSULTANT_STATUS[consultant.estado]

  return (
    <FadeIn>
      <Link
        to="/pro/consultantes"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Consultantes
      </Link>

      {/* encabezado de ficha */}
      <div className="mb-6 flex flex-wrap items-start gap-5 rounded-xl border bg-surface p-5">
        <Avatar className="h-16 w-16">
          {consultant.fotoUrl && <AvatarImage src={consultant.fotoUrl} alt="" />}
          <AvatarFallback className="text-lg">{iniciales(consultant.nombre, consultant.apellido)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">{nombreCompleto(consultant)}</h1>
            <Badge variant={st.tone as 'aqua'}>{st.label}</Badge>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> {edad(consultant.fechaNacimiento)} años
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" /> {consultant.escuela} · {consultant.curso}
            </span>
            {consultant.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {consultant.email}
              </span>
            )}
            {consultant.telefono && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {consultant.telefono}
              </span>
            )}
          </div>
          <p className="mt-2 max-w-2xl text-[13px] text-muted-foreground">
            <span className="font-medium text-foreground">Motivo:</span> {consultant.motivoConsulta}
          </p>
          <p className="mt-1 text-[11.5px] text-faint">Proceso iniciado el {fechaCorta(consultant.fechaInicio)}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <ProgressRing value={pct} size={56} />
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil /> Editar
            </Button>
            <Button variant="ghost" size="iconSm" onClick={() => setDeleteOpen(true)} aria-label="Eliminar">
              <Trash2 className="text-danger" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="resumen">
        <TabsList className="flex h-auto flex-wrap">
          {[
            ['resumen', 'Resumen'],
            ['modulos', 'Módulos'],
            ['sesiones', 'Sesiones'],
            ['actividades', 'Actividades'],
            ['evaluaciones', 'Evaluaciones'],
            ['archivos', 'Archivos'],
            ['motor', 'Motor Brújula'],
            ['ia', 'Asistente IA'],
            ['informes', 'Informes'],
          ].map(([v, l]) => (
            <TabsTrigger key={v} value={v}>
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="resumen"><OverviewTab consultant={consultant} /></TabsContent>
        <TabsContent value="modulos"><ModulesTab consultant={consultant} /></TabsContent>
        <TabsContent value="sesiones"><SessionsTab consultant={consultant} /></TabsContent>
        <TabsContent value="actividades"><ActivitiesTab consultant={consultant} /></TabsContent>
        <TabsContent value="evaluaciones"><EvaluationsTab consultant={consultant} /></TabsContent>
        <TabsContent value="archivos"><FilesTab consultant={consultant} /></TabsContent>
        <TabsContent value="motor"><CompassTab consultant={consultant} /></TabsContent>
        <TabsContent value="ia"><AITab consultant={consultant} /></TabsContent>
        <TabsContent value="informes"><ReportsTab consultant={consultant} /></TabsContent>
      </Tabs>

      <ConsultantFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={consultant}
        onSubmit={async (data) => {
          await updateConsultant.mutateAsync({ id: consultant.id, patch: data })
        }}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar consultante</DialogTitle>
            <DialogDescription>
              Se eliminará la ficha de {nombreCompleto(consultant)}. Esta acción no puede deshacerse.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await removeConsultant.mutateAsync(consultant.id)
                navigate('/pro/consultantes')
              }}
            >
              Eliminar definitivamente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FadeIn>
  )
}
