import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Label, FieldError } from '@/components/ui/input'
import { BrandCover } from '@/branding/Logo'
import { isCloudEnabled } from '@/services/cloud/config'
import { pendingMembership } from '@/lib/membership'

interface FormState {
  nombre: string
  apellido: string
  titulo: string
  matricula: string
  email: string
  password: string
  confirmar: string
  aceptaTerminos: boolean
}

const initialForm: FormState = {
  nombre: '',
  apellido: '',
  titulo: '',
  matricula: '',
  email: '',
  password: '',
  confirmar: '',
  aceptaTerminos: false,
}

// Alta de cuenta profesional, en modo nube: cada profesional que se
// registra acá obtiene su propio espacio, aislado del de las demás
// (cada una ve y edita solo a sus propios estudiantes).
export default function RegisterProPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const cloudActive = isCloudEnabled()

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(): string | undefined {
    if (!form.nombre.trim()) return 'Ingresá tu nombre.'
    if (!form.apellido.trim()) return 'Ingresá tu apellido.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Ingresá un email válido.'
    if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
    if (form.password !== form.confirmar) return 'Las contraseñas no coinciden.'
    if (!form.aceptaTerminos) return 'Tenés que aceptar esta condición para crear la cuenta.'
    return undefined
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    setError(undefined)
    setLoading(true)
    try {
      const { getSupabase } = await import('@/services/cloud/client')
      const sb = await getSupabase()
      const { error: signUpError } = await sb.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            role: 'profesional',
            nombre: form.nombre.trim(),
            apellido: form.apellido.trim(),
            titulo: form.titulo.trim() || undefined,
            matricula: form.matricula.trim() || undefined,
            membershipExpiresAt: pendingMembership(),
          },
        },
      })
      if (signUpError) {
        setError(
          /already registered|already exists/i.test(signUpError.message)
            ? 'Ya existe una cuenta con ese email.'
            : signUpError.message,
        )
        return
      }
      navigate('/login', { replace: true, state: { registered: true } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <BrandCover className="max-w-[200px]" />
        </div>

        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <UserPlus className="h-4.5 w-4.5 text-primary" /> Crear mi cuenta profesional
        </h2>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          Tu espacio queda aislado del de cualquier otra profesional: cada una ve y trabaja solo con sus propios
          estudiantes.
        </p>
        <p className="mt-2 text-[12px] text-faint">
          Tu cuenta se crea al instante, pero el acceso se activa una vez que coordines el pago de la membresía
          anual con Lic. Irene Morbidelli.
        </p>

        {!cloudActive && (
          <p className="mt-4 rounded-lg bg-danger-soft px-3 py-2.5 text-[12.5px] leading-relaxed text-danger">
            El registro no está disponible en este momento. Contactá a la administradora de la plataforma.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" autoComplete="given-name" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} disabled={!cloudActive} />
            </div>
            <div>
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" autoComplete="family-name" value={form.apellido} onChange={(e) => set('apellido', e.target.value)} disabled={!cloudActive} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="titulo">Título (opcional)</Label>
              <Input id="titulo" placeholder="Lic. en Psicopedagogía" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} disabled={!cloudActive} />
            </div>
            <div>
              <Label htmlFor="matricula">Matrícula (opcional)</Label>
              <Input id="matricula" placeholder="MP 260505" value={form.matricula} onChange={(e) => set('matricula', e.target.value)} disabled={!cloudActive} />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} disabled={!cloudActive} />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" placeholder="••••••••" autoComplete="new-password" value={form.password} onChange={(e) => set('password', e.target.value)} disabled={!cloudActive} />
          </div>
          <div>
            <Label htmlFor="confirmar">Confirmar contraseña</Label>
            <Input id="confirmar" type="password" placeholder="••••••••" autoComplete="new-password" value={form.confirmar} onChange={(e) => set('confirmar', e.target.value)} disabled={!cloudActive} />
          </div>
          <label className="flex items-start gap-2 text-[12px] leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-primary"
              checked={form.aceptaTerminos}
              onChange={(e) => set('aceptaTerminos', e.target.checked)}
              disabled={!cloudActive}
            />
            Declaro que esta cuenta es de uso personal e intransferible, para mi práctica profesional individual.
            Entiendo que compartir el acceso con otra persona puede implicar el corte del servicio, sin reembolso.
          </label>
          <FieldError>{error}</FieldError>
          <Button type="submit" className="w-full" disabled={!cloudActive || loading}>
            Crear cuenta <ArrowRight />
          </Button>
        </form>

        <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Ya tengo cuenta, ingresar
        </Link>
      </div>
    </div>
  )
}
