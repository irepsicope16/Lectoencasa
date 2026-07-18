import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label, NativeSelect, Textarea } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Consultant } from '@/types'
import { CONSULTANT_STATUS } from '@/lib/constants'

const schema = z.object({
  nombre: z.string().min(2, 'Ingresá el nombre'),
  apellido: z.string().min(2, 'Ingresá el apellido'),
  fechaNacimiento: z.string().min(1, 'Ingresá la fecha de nacimiento'),
  escuela: z.string().min(1, 'Ingresá la escuela'),
  curso: z.string().min(1, 'Ingresá el curso'),
  email: z.string().email('Email inválido').or(z.literal('')),
  telefono: z.string(),
  motivoConsulta: z.string().min(5, 'Describí brevemente el motivo de consulta'),
  fechaInicio: z.string().min(1, 'Ingresá la fecha de inicio'),
  estado: z.enum(['entrevista_inicial', 'en_proceso', 'en_pausa', 'finalizado']),
})

export type ConsultantFormData = z.infer<typeof schema>

export function ConsultantFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  initial?: Consultant
  onSubmit: (data: ConsultantFormData) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsultantFormData>({
    resolver: zodResolver(schema),
    values: initial
      ? {
          nombre: initial.nombre,
          apellido: initial.apellido,
          fechaNacimiento: initial.fechaNacimiento,
          escuela: initial.escuela,
          curso: initial.curso,
          email: initial.email,
          telefono: initial.telefono,
          motivoConsulta: initial.motivoConsulta,
          fechaInicio: initial.fechaInicio,
          estado: initial.estado,
        }
      : {
          nombre: '',
          apellido: '',
          fechaNacimiento: '',
          escuela: '',
          curso: '',
          email: '',
          telefono: '',
          motivoConsulta: '',
          fechaInicio: new Date().toISOString().slice(0, 10),
          estado: 'entrevista_inicial',
        },
  })

  const submit = async (data: ConsultantFormData) => {
    await onSubmit(data)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent wide>
        <DialogHeader>
          <DialogTitle>{initial ? 'Editar consultante' : 'Nuevo consultante'}</DialogTitle>
          <DialogDescription>
            {initial
              ? 'Actualizá la ficha del consultante.'
              : 'Creá la ficha para comenzar el proceso de orientación.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Nombre</Label>
            <Input {...register('nombre')} placeholder="Nombre" />
            <FieldError>{errors.nombre?.message}</FieldError>
          </div>
          <div>
            <Label>Apellido</Label>
            <Input {...register('apellido')} placeholder="Apellido" />
            <FieldError>{errors.apellido?.message}</FieldError>
          </div>
          <div>
            <Label>Fecha de nacimiento</Label>
            <Input type="date" {...register('fechaNacimiento')} />
            <FieldError>{errors.fechaNacimiento?.message}</FieldError>
          </div>
          <div>
            <Label>Fecha de inicio del proceso</Label>
            <Input type="date" {...register('fechaInicio')} />
            <FieldError>{errors.fechaInicio?.message}</FieldError>
          </div>
          <div>
            <Label>Escuela</Label>
            <Input {...register('escuela')} placeholder="Institución" />
            <FieldError>{errors.escuela?.message}</FieldError>
          </div>
          <div>
            <Label>Curso</Label>
            <Input {...register('curso')} placeholder="p. ej. 6.º año — Sociales" />
            <FieldError>{errors.curso?.message}</FieldError>
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" {...register('email')} placeholder="email@ejemplo.com" />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input {...register('telefono')} placeholder="+54 9 …" />
          </div>
          <div className="sm:col-span-2">
            <Label>Motivo de consulta</Label>
            <Textarea {...register('motivoConsulta')} placeholder="¿Qué trae al consultante al proceso?" />
            <FieldError>{errors.motivoConsulta?.message}</FieldError>
          </div>
          <div>
            <Label>Estado</Label>
            <NativeSelect {...register('estado')}>
              {Object.entries(CONSULTANT_STATUS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </NativeSelect>
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {initial ? 'Guardar cambios' : 'Crear consultante'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
