import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input, Label, NativeSelect, Textarea } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore'
import { useCreateStudent } from '@/hooks/queries'
import { ensureStudentAccount } from '@/features/auth/accounts'
import { toast } from '@/components/ui/toast'
import type { NivelEducativo } from '@/types'

const NIVELES: { value: NivelEducativo; label: string }[] = [
  { value: '12_15', label: '12 a 15 años' },
  { value: '16_18', label: '16 a 18 años' },
  { value: 'superior', label: 'Educación superior' },
  { value: 'adulto', label: 'Adulto en situación de estudio' },
]

export function StudentForm({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const user = useAuthStore((s) => s.user)
  const createStudent = useCreateStudent()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [nivel, setNivel] = useState<NivelEducativo>('12_15')
  const [institucion, setInstitucion] = useState('')
  const [contacto, setContacto] = useState('')
  const [motivoConsulta, setMotivoConsulta] = useState('')
  const [otorgante, setOtorgante] = useState<'adulto_responsable' | 'propio'>('adulto_responsable')
  const [nombreOtorgante, setNombreOtorgante] = useState('')
  const [credenciales, setCredenciales] = useState<{ email: string; password: string } | null>(null)

  function reset() {
    setNombre('')
    setApellido('')
    setFechaNacimiento('')
    setNivel('12_15')
    setInstitucion('')
    setContacto('')
    setMotivoConsulta('')
    setOtorgante('adulto_responsable')
    setNombreOtorgante('')
    setCredenciales(null)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    const creado = await createStudent.mutateAsync({
      professionalId: user.id,
      nombre,
      apellido,
      fechaNacimiento,
      nivel,
      institucion: institucion || undefined,
      contacto,
      motivoConsulta,
      estado: 'alta',
      consentimiento: {
        otorgante,
        nombreOtorgante,
        otorgado: true,
        fecha: new Date().toISOString(),
      },
    })
    const cuenta = await ensureStudentAccount(creado)
    if (cuenta) {
      setCredenciales(cuenta)
    } else {
      toast.success('Estudiante creado')
      reset()
      onOpenChange(false)
    }
  }

  function cerrarConCredenciales() {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <DialogContent className="max-w-xl">
        {credenciales ? (
          <>
            <DialogHeader>
              <DialogTitle>Estudiante creado</DialogTitle>
              <DialogDescription>
                Se generó su acceso al portal. Compartiselo por el canal que uses habitualmente — no se vuelve a mostrar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 rounded-lg border bg-surface-2 p-4">
              <CredencialCampo label="Email" valor={credenciales.email} />
              <CredencialCampo label="Contraseña" valor={credenciales.password} />
            </div>
            <Button className="mt-4 w-full" onClick={cerrarConCredenciales}>
              Listo
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Nuevo estudiante</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="fnac">Fecha de nacimiento</Label>
                  <Input id="fnac" type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="nivel">Nivel</Label>
                  <NativeSelect id="nivel" value={nivel} onChange={(e) => setNivel(e.target.value as NivelEducativo)}>
                    {NIVELES.map((n) => (
                      <option key={n.value} value={n.value}>
                        {n.label}
                      </option>
                    ))}
                  </NativeSelect>
                </div>
              </div>
              <div>
                <Label htmlFor="institucion">Institución (opcional)</Label>
                <Input id="institucion" value={institucion} onChange={(e) => setInstitucion(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="contacto">Email de contacto</Label>
                <Input id="contacto" value={contacto} onChange={(e) => setContacto(e.target.value)} placeholder="para el acceso al portal" required />
              </div>
              <div>
                <Label htmlFor="motivo">Motivo de consulta</Label>
                <Textarea id="motivo" value={motivoConsulta} onChange={(e) => setMotivoConsulta(e.target.value)} required />
              </div>
              <div className="rounded-lg border border-dashed p-3">
                <p className="mb-2 text-[12.5px] font-medium">Consentimiento</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="otorgante">Otorgado por</Label>
                    <NativeSelect id="otorgante" value={otorgante} onChange={(e) => setOtorgante(e.target.value as typeof otorgante)}>
                      <option value="adulto_responsable">Adulto responsable</option>
                      <option value="propio">El propio estudiante</option>
                    </NativeSelect>
                  </div>
                  <div>
                    <Label htmlFor="nombreOtorgante">Nombre de quien otorga</Label>
                    <Input id="nombreOtorgante" value={nombreOtorgante} onChange={(e) => setNombreOtorgante(e.target.value)} required />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createStudent.isPending}>
                {createStudent.isPending ? 'Creando…' : 'Crear estudiante'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function CredencialCampo({ label, valor }: { label: string; valor: string }) {
  const [copiado, setCopiado] = useState(false)
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[11px] text-faint">{label}</p>
        <p className="font-mono text-[14px] font-medium">{valor}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="iconSm"
        onClick={async () => {
          await navigator.clipboard.writeText(valor)
          setCopiado(true)
          setTimeout(() => setCopiado(false), 1500)
        }}
        aria-label={`Copiar ${label}`}
      >
        {copiado ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
    </div>
  )
}
