import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore'

const schema = z.object({
  email: z.string().email('Ingresá un email válido'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset)
  const [serverError, setServerError] = useState<string>()
  const [sent, setSent] = useState<string>()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(undefined)
    const res = await requestPasswordReset(data.email)
    if (!res.ok) {
      setServerError(res.error)
      return
    }
    setSent(data.email)
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

        {sent ? (
          <div className="text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
              <MailCheck className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold tracking-tight">Revisá tu email</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
              Si <strong>{sent}</strong> tiene una cuenta, te enviamos un link para elegir una contraseña nueva.
              Puede tardar unos minutos — revisá también la carpeta de spam.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold tracking-tight">Recuperar contraseña</h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Ingresá el email de tu cuenta y te mandamos un link para elegir una nueva contraseña.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" autoComplete="email" {...register('email')} />
                <FieldError>{errors.email?.message}</FieldError>
              </div>
              {serverError && (
                <p className="rounded-lg bg-danger-soft px-3 py-2 text-[12.5px] text-danger">{serverError}</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Enviar link de recuperación
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
