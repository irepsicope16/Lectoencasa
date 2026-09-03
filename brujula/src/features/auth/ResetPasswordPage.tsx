import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore'

const schema = z
  .object({
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: 'Las contraseñas no coinciden', path: ['confirm'] })
type FormData = z.infer<typeof schema>

/**
 * Página a la que redirige el link del email de recuperación. El código
 * llega como "?code=..." (flujo PKCE) — Supabase lo intercambia solo por
 * una sesión temporal apenas se crea el cliente; acá solo hace falta
 * confirmar que llegó bien antes de dejar elegir la contraseña nueva.
 */
export default function ResetPasswordPage() {
  const confirmPasswordReset = useAuthStore((s) => s.confirmPasswordReset)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [ready, setReady] = useState(false)
  const [linkError, setLinkError] = useState<string>()
  const [serverError, setServerError] = useState<string>()
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const code = params.get('code')
    if (!code) {
      setLinkError('Este link de recuperación es inválido o ya fue usado. Pedí uno nuevo.')
      return
    }
    import('@/services/cloud/client').then(async ({ getSupabase }) => {
      const sb = await getSupabase()
      const { error } = await sb.auth.exchangeCodeForSession(code)
      if (error) setLinkError('Este link de recuperación venció o ya fue usado. Pedí uno nuevo.')
      else setReady(true)
    })
  }, [params])

  const onSubmit = async (data: FormData) => {
    setServerError(undefined)
    const res = await confirmPasswordReset(data.password)
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
        {done ? (
          <div className="text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold tracking-tight">Contraseña actualizada</h2>
            <p className="mt-1.5 text-[13px] text-muted-foreground">Te llevamos a la pantalla de ingreso…</p>
          </div>
        ) : linkError ? (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-[13px] text-danger">{linkError}</p>
        ) : !ready ? (
          <p className="text-[13px] text-muted-foreground">Verificando el link…</p>
        ) : (
          <>
            <h2 className="text-lg font-semibold tracking-tight">Elegí una contraseña nueva</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="password">Contraseña nueva</Label>
                <Input id="password" type="password" placeholder="••••••••" autoComplete="new-password" {...register('password')} />
                <FieldError>{errors.password?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="confirm">Repetí la contraseña</Label>
                <Input id="confirm" type="password" placeholder="••••••••" autoComplete="new-password" {...register('confirm')} />
                <FieldError>{errors.confirm?.message}</FieldError>
              </div>
              {serverError && (
                <p className="rounded-lg bg-danger-soft px-3 py-2 text-[12.5px] text-danger">{serverError}</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Guardar contraseña
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
