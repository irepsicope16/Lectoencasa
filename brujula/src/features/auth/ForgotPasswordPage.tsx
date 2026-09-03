import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label, PasswordInput } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore'

const emailSchema = z.object({
  email: z.string().email('Ingresá un email válido'),
})
type EmailForm = z.infer<typeof emailSchema>

const resetSchema = z
  .object({
    token: z.string().min(6, 'Pegá el link o el código que te llegó por mail'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: 'Las contraseñas no coinciden', path: ['confirm'] })
type ResetForm = z.infer<typeof resetSchema>

/**
 * Recuperación en dos pasos, todo en una sola página. En vez de hacer clic
 * en el link del mail (los links de un solo uso fallan seguido: algunos
 * clientes de mail "abren" el link solos para escanearlo antes de que la
 * persona lo toque, gastándolo), se pega el link COPIADO — copiar no lo
 * gasta, solo clickearlo — o el código, si la cuenta de Supabase tiene
 * plantillas de mail personalizadas.
 */
export default function ForgotPasswordPage() {
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset)
  const confirmPasswordReset = useAuthStore((s) => s.confirmPasswordReset)
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>()
  const [serverError, setServerError] = useState<string>()
  const [done, setDone] = useState(false)

  const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema) })
  const resetForm = useForm<ResetForm>({ resolver: zodResolver(resetSchema) })

  const onSubmitEmail = async (data: EmailForm) => {
    setServerError(undefined)
    const res = await requestPasswordReset(data.email)
    if (!res.ok) {
      setServerError(res.error)
      return
    }
    setEmail(data.email)
  }

  const onSubmitReset = async (data: ResetForm) => {
    if (!email) return
    setServerError(undefined)
    const res = await confirmPasswordReset(email, data.token, data.password)
    if (!res.ok) {
      setServerError(res.error)
      return
    }
    setDone(true)
    setTimeout(() => navigate('/login', { replace: true }), 2000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a ingresar
        </Link>

        {done ? (
          <div className="text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold tracking-tight">Contraseña actualizada</h2>
            <p className="mt-1.5 text-[13px] text-muted-foreground">Te llevamos a la pantalla de ingreso…</p>
          </div>
        ) : !email ? (
          <>
            <h2 className="text-lg font-semibold tracking-tight">Recuperar contraseña</h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Ingresá el email de tu cuenta y te mandamos un mail para elegir una contraseña nueva.
            </p>

            <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  {...emailForm.register('email')}
                />
                <FieldError>{emailForm.formState.errors.email?.message}</FieldError>
              </div>
              {serverError && (
                <p className="rounded-lg bg-danger-soft px-3 py-2 text-[12.5px] text-danger">{serverError}</p>
              )}
              <Button type="submit" className="w-full" disabled={emailForm.formState.isSubmitting}>
                Enviar mail de recuperación
              </Button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold tracking-tight">Pegá el link del mail</h2>
            <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
              Te mandamos un mail a <strong>{email}</strong> (revisá también spam) con un link para recuperar la
              cuenta. <strong>No hagas clic</strong> — mantené el dedo (o el clic derecho) apretado sobre el link
              hasta que aparezca la opción «Copiar dirección del enlace», y pegala acá abajo.
            </p>

            <form onSubmit={resetForm.handleSubmit(onSubmitReset)} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="token">Link copiado (o código)</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Pegá acá el link o el código"
                  {...resetForm.register('token')}
                />
                <FieldError>{resetForm.formState.errors.token?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="password">Contraseña nueva</Label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...resetForm.register('password')}
                />
                <FieldError>{resetForm.formState.errors.password?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="confirm">Repetí la contraseña</Label>
                <PasswordInput
                  id="confirm"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...resetForm.register('confirm')}
                />
                <FieldError>{resetForm.formState.errors.confirm?.message}</FieldError>
              </div>
              {serverError && (
                <p className="rounded-lg bg-danger-soft px-3 py-2 text-[12.5px] text-danger">{serverError}</p>
              )}
              <Button type="submit" className="w-full" disabled={resetForm.formState.isSubmitting}>
                Guardar contraseña
              </Button>
              <button
                type="button"
                onClick={() => setEmail(undefined)}
                className="w-full text-center text-[12.5px] text-muted-foreground underline-offset-2 hover:underline"
              >
                Usar otro email
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
