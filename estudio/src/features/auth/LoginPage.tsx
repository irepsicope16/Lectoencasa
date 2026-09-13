import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input, Label, FieldError } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { BrandCover } from '@/branding/Logo'

export default function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [email, setEmail] = useState('irene@metodoestudio.demo')
  const [password, setPassword] = useState('estudio')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    const res = await login(email, password)
    setLoading(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate('/pro')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <BrandCover className="max-w-[220px]" />
          <p className="text-[13px] text-muted-foreground">Acceso profesional</p>
        </div>
        <Card>
          <CardContent className="pt-5">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <FieldError>{error}</FieldError>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Ingresando…' : 'Ingresar'}
              </Button>
            </form>
            <p className="mt-4 text-center text-[12px] text-faint">
              Cuenta demo precargada: <span className="font-medium text-muted-foreground">irene@metodoestudio.demo</span> / <span className="font-medium text-muted-foreground">estudio</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
