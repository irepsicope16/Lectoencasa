import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, Compass, Sparkles, UserRound } from 'lucide-react'
import { LogoFull } from '@/branding/Logo'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore'

const schema = z.object({
  email: z.string().email('Ingresá un email válido'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string>()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(undefined)
    const res = await login(data.email, data.password)
    if (!res.ok) {
      setServerError(res.error)
      return
    }
    const user = useAuthStore.getState().user
    navigate(user?.role === 'profesional' ? '/pro' : '/mi', { replace: true })
  }

  const fillDemo = (email: string) => {
    setValue('email', email)
    setValue('password', 'brujula')
  }

  return (
    <div className="flex min-h-screen">
      {/* panel de marca */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden border-r bg-surface p-10 lg:flex">
        <div className="flex items-center gap-2 text-[12px] font-medium tracking-[0.16em] text-faint uppercase">
          <Compass className="h-4 w-4 text-primary" /> Psicope con Ire
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-md"
        >
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            Encontrá tu norte.
            <br />
            <span className="text-primary">Construí tu camino.</span>
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
            Método Brújula es la plataforma profesional de orientación vocacional: evaluación,
            acompañamiento, seguimiento y proyecto de vida en un solo lugar. Porque orientar no es
            aplicar un test: es acompañar a alguien a encontrar su rumbo.
          </p>
          <div className="mt-8 flex gap-6 text-[12.5px] text-muted-foreground">
            {['Conocerte', 'Valorarte', 'Explorar', 'Decidir', 'Actuar'].map((s, i) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-soft text-[10px] font-semibold text-primary-strong">
                  {i + 1}
                </span>
                {s}
              </span>
            ))}
          </div>
        </motion.div>
        <p className="text-[11.5px] text-faint">
          © {new Date().getFullYear()} Psicope con Ire · Orientación vocacional y reorientación profesional
        </p>
        {/* brújula decorativa */}
        <div className="pointer-events-none absolute -right-24 -top-24 opacity-[0.05]">
          <Compass className="h-[420px] w-[420px] text-primary" strokeWidth={0.6} />
        </div>
      </div>

      {/* formulario */}
      <div className="flex flex-1 items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          <LogoFull className="mb-8 lg:hidden" />
          <h2 className="text-lg font-semibold tracking-tight">Ingresar a la plataforma</h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Accedé con tu cuenta profesional o de consultante.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" autoComplete="email" {...register('email')} />
              <FieldError>{errors.email?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" {...register('password')} />
              <FieldError>{errors.password?.message}</FieldError>
            </div>
            {serverError && (
              <p className="rounded-lg bg-danger-soft px-3 py-2 text-[12.5px] text-danger">{serverError}</p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Ingresar <ArrowRight />
            </Button>
          </form>

          <div className="mt-8 rounded-xl border border-dashed p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
              Cuentas de demostración
            </p>
            <div className="mt-2.5 space-y-1.5">
              <button
                onClick={() => fillDemo('ire@psicopeconire.com')}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-surface-2"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span>
                  <span className="font-medium">Profesional</span>
                  <span className="block text-[11.5px] text-faint">ire@psicopeconire.com</span>
                </span>
              </button>
              <button
                onClick={() => fillDemo('valen@demo.com')}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-surface-2"
              >
                <UserRound className="h-4 w-4 text-accent-strong" />
                <span>
                  <span className="font-medium">Consultante</span>
                  <span className="block text-[11.5px] text-faint">valen@demo.com</span>
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
