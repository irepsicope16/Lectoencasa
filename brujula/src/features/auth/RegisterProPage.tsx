import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Compass, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { isCloudEnabled } from '@/services/cloud/config'

const schema = z
  .object({
    nombre: z.string().min(1, 'Ingresá tu nombre'),
    apellido: z.string().min(1, 'Ingresá tu apellido'),
    titulo: z.string().optional(),
    email: z.string().email('Ingresá un email válido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmar: z.string(),
  })
  .refine((d) => d.password === d.confirmar, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar'],
  })
type FormData = z.infer<typeof schema>

// Alta de cuenta profesional, en modo nube: cada profesional que se
// registra acá obtiene su propio espacio, aislado del de las demás
// (cada una ve y edita solo a sus propios consultantes).
export default function RegisterProPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string>()
  const cloudActive = isCloudEnabled()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(undefined)
    const { getSupabase } = await import('@/services/cloud/client')
    const sb = await getSupabase()
    const { error } = await sb.auth.signUp({
      email: data.email.trim(),
      password: data.password,
      options: {
        data: {
          role: 'profesional',
          nombre: data.nombre.trim(),
          apellido: data.apellido.trim(),
          titulo: data.titulo?.trim() || undefined,
        },
      },
    })
    if (error) {
      setServerError(/already registered|already exists/i.test(error.message)
        ? 'Ya existe una cuenta con ese email.'
        : error.message)
      return
    }
    toast.success('Cuenta creada. Ya podés ingresar.')
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="mb-6 flex items-center gap-2 text-[12px] font-medium tracking-[0.16em] text-faint uppercase">
          <Compass className="h-4 w-4 text-primary" /> Psicope con Ire
        </div>

        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <UserPlus className="h-4.5 w-4.5 text-primary" /> Crear mi cuenta profesional
        </h2>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          Tu espacio queda aislado del de cualquier otra profesional: cada una ve y trabaja solo con sus propios
          consultantes.
        </p>

        {!cloudActive && (
          <p className="mt-4 rounded-lg bg-danger-soft px-3 py-2.5 text-[12.5px] leading-relaxed text-danger">
            El registro no está disponible en este momento. Contactá a la administradora de la plataforma.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" autoComplete="given-name" {...register('nombre')} disabled={!cloudActive} />
              <FieldError>{errors.nombre?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" autoComplete="family-name" {...register('apellido')} disabled={!cloudActive} />
              <FieldError>{errors.apellido?.message}</FieldError>
            </div>
          </div>
          <div>
            <Label htmlFor="titulo">Título profesional (opcional)</Label>
            <Input
              id="titulo"
              placeholder="Lic. en Psicopedagogía"
              {...register('titulo')}
              disabled={!cloudActive}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" autoComplete="email" {...register('email')} disabled={!cloudActive} />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('password')}
              disabled={!cloudActive}
            />
            <FieldError>{errors.password?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="confirmar">Confirmar contraseña</Label>
            <Input
              id="confirmar"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('confirmar')}
              disabled={!cloudActive}
            />
            <FieldError>{errors.confirmar?.message}</FieldError>
          </div>
          {serverError && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-[12.5px] text-danger">{serverError}</p>
          )}
          <Button type="submit" className="w-full" disabled={!cloudActive || isSubmitting}>
            Crear cuenta <ArrowRight />
          </Button>
        </form>

        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Ya tengo cuenta, ingresar
        </Link>
      </motion.div>
    </div>
  )
}
