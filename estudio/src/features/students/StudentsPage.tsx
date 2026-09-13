import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useStudents } from '@/hooks/queries'
import { PageHeader, EmptyState, FadeIn } from '@/components/shared'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { StudentForm } from './StudentForm'
import { edad, nombreCompleto, haceCuanto } from '@/lib/utils'
import type { Student } from '@/types'

const ESTADO_LABEL: Record<Student['estado'], string> = {
  alta: 'Alta',
  entrevista: 'Entrevista',
  autoperfil: 'Autoperfil',
  en_proceso: 'En proceso',
  en_pausa: 'En pausa',
  finalizado: 'Finalizado',
}

const NIVEL_LABEL: Record<Student['nivel'], string> = {
  '12_15': '12-15 años',
  '16_18': '16-18 años',
  superior: 'Educación superior',
  adulto: 'Adulto',
}

export default function StudentsPage() {
  const user = useAuthStore((s) => s.user)
  const { data: students = [] } = useStudents(user?.id)
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  const activos = students.filter((s) => !s.archivedAt)
  const filtrados = activos.filter((s) => nombreCompleto(s).toLowerCase().includes(q.toLowerCase()))

  return (
    <FadeIn>
      <PageHeader
        title="Estudiantes"
        subtitle={`${activos.length} activos`}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus /> Nuevo estudiante
          </Button>
        }
      />

      <Input placeholder="Buscar por nombre…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-xs" />

      {filtrados.length === 0 ? (
        <EmptyState
          icon={Users}
          title={activos.length === 0 ? 'Todavía no hay estudiantes' : 'Sin resultados'}
          description={activos.length === 0 ? 'Creá el primero para empezar la entrevista y el autoperfil.' : 'Probá con otro nombre.'}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((s) => (
            <Link key={s.id} to={`/pro/estudiantes/${s.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="pt-5">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="text-[14px] font-semibold">{nombreCompleto(s)}</p>
                    <Badge variant="outline">{ESTADO_LABEL[s.estado]}</Badge>
                  </div>
                  <p className="text-[12.5px] text-muted-foreground">
                    {edad(s.fechaNacimiento)} años · {NIVEL_LABEL[s.nivel]}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[12.5px] text-faint">{s.motivoConsulta}</p>
                  <p className="mt-3 text-[11.5px] text-faint">Actualizado {haceCuanto(s.updatedAt)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <StudentForm open={open} onOpenChange={setOpen} />
    </FadeIn>
  )
}
