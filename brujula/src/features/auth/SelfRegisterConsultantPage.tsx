import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, Compass, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label, PasswordInput, Textarea } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { isCloudEnabled } from '@/services/cloud/config'
import { useAuthStore } from '@/stores/authStore'

const schema = z.object({
  nombre: z.string().min(2, 'Ingresá tu nombre'),
  apellido: z.string().min(2, 'Ingresá tu apellido'),
  fechaNacimiento: z.string().min(1, 'Ingresá tu fecha de nacimiento'),
  escuela: z.string().min(1, 'Ingresá tu escuela o institución'),
  curso: z.string().min(1, 'Ingresá tu curso o año'),
  telefono: z.string(),
  email: z.string().email('Ingresá un email válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  motivoConsulta: z.string().min(5, 'Contanos brevemente qué te trae a la consulta'),
})
type FormData = z.infer<typeof schema>

type ProfesionalInfo = { nombre: string; apellido: string; titulo: string | null }

// Autorregistro: la persona que consulta completa su propia ficha desde un
// link personal que la profesional le comparte (con el id de la profesional
// adentro), en vez de que la profesional tenga que crearla a mano primero.
export default function SelfRegisterConsultantPage() {
  const { proId } = useParams<{ proId: string }>()
  const navigate = useNavigate()
  const cloudActive = isCloudEnabled()
  const currentUser = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const login = useAuthStore((s) => s.login)

  const [profesional, setProfesional] = useState<ProfesionalInfo | null>(null)
  const [linkInvalido, setLinkInvalido] = useState(false)
  const [checking, setChecking] = useState(true)
  const [serverError, setServerError] = useState<string>()

  useEffect(() => {
    if (!cloudActive || !proId) {
      setChecking(false)
      return
    }
    let active = true
    ;(async () => {
      try {
        const { getSupabase } = await import('@/services/cloud/client')
        const sb = await getSupabase()
        const { data, error } = await sb.rpc('mb_public_profesional', { p_id: proId })
        if (!active) return
        const row = Array.isArray(data) ? data[0] : data
        if (error || !row) setLinkInvalido(true)
        else setProfesional({ nombre: row.nombre, apellido: row.apellido, titulo: row.titulo })
      } catch {
        if (active) setLinkInvalido(true)
      } finally {
        if (active) setChecking(false)
      }
    })()
    return () => {
      active = false
    }
  }, [proId, cloudActive])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      escuela: '',
      curso: '',
      telefono: '',
      email: '',
      password: '',
      motivoConsulta: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    if (!proId) return
    setServerError(undefined)
    const { getSupabase } = await import('@/services/cloud/client')
    const sb = await getSupabase()
    const email = data.email.trim().toLowerCase()

    const { error: signUpError } = await sb.auth.signUp({
      email,
      password: data.password,
      options: { data: { role: 'consultante' } },
    })
    if (signUpError) {
      setServerError(
        /already registered|already exists/i.test(signUpError.message)
          ? 'Ya existe una cuenta con ese email. Si ya te registraste antes, ingresá desde el login.'
          : signUpError.message,
      )
      return
    }

    const { error: rpcError } = await sb.rpc('mb_self_register_consultant', {
      p_profesional_id: proId,
      p_nombre: data.nombre.trim(),
      p_apellido: data.apellido.trim(),
      p_fecha_nacimiento: data.fechaNacimiento,
      p_escuela: data.escuela.trim(),
      p_curso: data.curso.trim(),
      p_telefono: data.telefono.trim(),
      p_motivo_consulta: data.motivoConsulta.trim(),
    })
    if (rpcError) {
      setServerError(rpcError.message)
      return
    }

    const res = await login(email, data.password)
    if (!res.ok) {
      toast.success('Ficha creada. Ingresá con el email y la contraseña que elegiste.')
      navigate('/login', { replace: true })
      return
    }
    toast.success('¡Listo! Ya podés empezar a trabajar en la plataforma.')
    navigate('/mi', { replace: true })
  }

  if (currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-12 text-center">
        <p className="max-w-sm text-[14px] text-muted-foreground">
          Ya hay una sesión iniciada en este navegador ({currentUser.email}). Para registrarte como nuevo
          consultante, cerrá esa sesión primero.
        </p>
        <Button className="mt-4" variant="outline" onClick={() => logout()}>
          Cerrar esa sesión y continuar
        </Button>
      </div>
    )
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
          <Compass className="h-4 w-4 text-primary" /> Método Brújula
        </div>

        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <UserPlus className="h-4.5 w-4.5 text-primary" /> Completá tu ficha
        </h2>

        {!cloudActive ? (
          <p className="mt-4 rounded-lg bg-danger-soft px-3 py-2.5 text-[12.5px] leading-relaxed text-danger">
            El autorregistro no está disponible en este momento.
          </p>
        ) : checking ? (
          <p className="mt-3 text-[13px] text-muted-foreground">Comprobando el link…</p>
        ) : linkInvalido ? (
          <p className="mt-4 rounded-lg bg-danger-soft px-3 py-2.5 text-[12.5px] leading-relaxed text-danger">
            Este link de registro no es válido o venció. Pedile a tu profesional que te comparta uno nuevo.
          </p>
        ) : (
          <>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Te vas a registrar con{' '}
              <span className="font-medium text-foreground">
                {profesional?.titulo ? `${profesional.titulo} ` : ''}
                {profesional?.nombre} {profesional?.apellido}
              </span>
              .
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" autoComplete="given-name" {...register('nombre')} />
                  <FieldError>{errors.nombre?.message}</FieldError>
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input id="apellido" autoComplete="family-name" {...register('apellido')} />
                  <FieldError>{errors.apellido?.message}</FieldError>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
                  <Input id="fechaNacimiento" type="date" {...register('fechaNacimiento')} />
                  <FieldError>{errors.fechaNacimiento?.message}</FieldError>
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" placeholder="+54 9 …" {...register('telefono')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="escuela">Escuela</Label>
                  <Input id="escuela" placeholder="Institución" {...register('escuela')} />
                  <FieldError>{errors.escuela?.message}</FieldError>
                </div>
                <div>
                  <Label htmlFor="curso">Curso</Label>
                  <Input id="curso" placeholder="p. ej. 6.º año" {...register('curso')} />
                  <FieldError>{errors.curso?.message}</FieldError>
                </div>
              </div>
              <div>
                <Label htmlFor="motivoConsulta">¿Qué te trae a la consulta?</Label>
                <Textarea id="motivoConsulta" {...register('motivoConsulta')} />
                <FieldError>{errors.motivoConsulta?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" {...register('email')} />
                <FieldError>{errors.email?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="password">Elegí una contraseña</Label>
                <PasswordInput id="password" autoComplete="new-password" {...register('password')} />
                <FieldError>{errors.password?.message}</FieldError>
              </div>
              {serverError && (
                <p className="rounded-lg bg-danger-soft px-3 py-2 text-[12.5px] text-danger">{serverError}</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Crear mi ficha <ArrowRight />
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
