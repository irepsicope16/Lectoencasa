import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStudent } from '@/hooks/queries'
import { PageHeader, FadeIn } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { edad, nombreCompleto } from '@/lib/utils'
import { RecorridoTab } from './tabs/RecorridoTab'
import { ResumenTab } from './tabs/ResumenTab'
import { EntrevistaTab } from './tabs/EntrevistaTab'
import { AutoperfilTab } from './tabs/AutoperfilTab'
import { IntegracionTab } from './tabs/IntegracionTab'
import { EvaluacionTab } from './tabs/EvaluacionTab'
import { PrioridadesTab } from './tabs/PrioridadesTab'
import { PlanTab } from './tabs/PlanTab'
import { ActividadesTab } from './tabs/ActividadesTab'
import { SessionsTab } from './tabs/SessionsTab'
import type { Student } from '@/types'

const ESTADO_LABEL: Record<Student['estado'], string> = {
  alta: 'Alta',
  entrevista: 'Entrevista',
  autoperfil: 'Autoperfil',
  en_proceso: 'En proceso',
  en_pausa: 'En pausa',
  finalizado: 'Finalizado',
}

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: student, isLoading } = useStudent(id)
  const [tab, setTab] = useState('resumen')

  if (isLoading) return <div className="p-6 text-sm text-faint">Cargando…</div>
  if (!student) return <div className="p-6 text-sm text-faint">No se encontró el estudiante.</div>

  return (
    <FadeIn>
      <Link to="/pro/estudiantes" className="mb-3 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Estudiantes
      </Link>
      <PageHeader
        title={nombreCompleto(student)}
        subtitle={`${edad(student.fechaNacimiento)} años · ${student.institucion ?? 'sin institución registrada'}`}
        actions={<Badge variant="outline">{ESTADO_LABEL[student.estado]}</Badge>}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="recorrido">Recorrido</TabsTrigger>
          <TabsTrigger value="entrevista">Entrevista</TabsTrigger>
          <TabsTrigger value="autoperfil">Autoperfil</TabsTrigger>
          <TabsTrigger value="integracion">Integración</TabsTrigger>
          <TabsTrigger value="evaluacion">Evaluación</TabsTrigger>
          <TabsTrigger value="prioridades">Prioridades</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="actividades">Actividades</TabsTrigger>
          <TabsTrigger value="sesiones">Sesiones</TabsTrigger>
        </TabsList>
        <TabsContent value="resumen">
          <ResumenTab student={student} />
        </TabsContent>
        <TabsContent value="recorrido">
          <RecorridoTab student={student} onNavigateTab={setTab} />
        </TabsContent>
        <TabsContent value="entrevista">
          <EntrevistaTab student={student} />
        </TabsContent>
        <TabsContent value="autoperfil">
          <AutoperfilTab student={student} />
        </TabsContent>
        <TabsContent value="integracion">
          <IntegracionTab student={student} />
        </TabsContent>
        <TabsContent value="evaluacion">
          <EvaluacionTab student={student} />
        </TabsContent>
        <TabsContent value="prioridades">
          <PrioridadesTab student={student} />
        </TabsContent>
        <TabsContent value="plan">
          <PlanTab student={student} />
        </TabsContent>
        <TabsContent value="actividades">
          <ActividadesTab student={student} />
        </TabsContent>
        <TabsContent value="sesiones">
          <SessionsTab student={student} />
        </TabsContent>
      </Tabs>
    </FadeIn>
  )
}
