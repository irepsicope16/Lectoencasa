import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Label, FieldError } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore'

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
  const [emailInput, setEmailInput] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function onSubmitEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(emailInput.trim())) {
      setError('Ingresá un email válido.')
      return
    }
    setError(undefined)
    setLoading(true)
    const res = await requestPasswordReset(emailInput.trim())
    setLoading(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setEmail(emailInput.trim())
  }

  async function onSubmitReset(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    if (token.trim().length < 6) {
      setError('Pegá el link o el código que te llegó por mail.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setError(undefined)
    setLoading(true)
    const res = await confirmPasswordReset(email, token, password)
    setLoading(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setDone(true)
    setTimeout(() => navigate('/login', { replace: true }), 2000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
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

            <form onSubmit={onSubmitEmail} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" autoComplete="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
              </div>
              <FieldError>{error}</FieldError>
              <Button type="submit" className="w-full" disabled={loading}>
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

            <form onSubmit={onSubmitReset} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="token">Link copiado (o código)</Label>
                <Input id="token" type="text" placeholder="Pegá acá el link o el código" value={token} onChange={(e) => setToken(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="password">Contraseña nueva</Label>
                <Input id="password" type="password" placeholder="••••••••" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="confirm">Repetí la contraseña</Label>
                <Input id="confirm" type="password" placeholder="••••••••" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              <FieldError>{error}</FieldError>
              <Button type="submit" className="w-full" disabled={loading}>
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
      </div>
    </div>
  )
}
