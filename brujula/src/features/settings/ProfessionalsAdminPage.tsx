import { useEffect, useState } from 'react'
import { CalendarClock, RefreshCcw, ShieldCheck, ShieldOff } from 'lucide-react'
import { FadeIn, PageHeader } from '@/components/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toast'
import { isCloudEnabled } from '@/services/cloud/config'

interface ProfesionalRow {
  id: string
  nombre: string
  apellido: string
  email: string
  titulo?: string
  membershipExpiresAt?: string
}

function addOneYear(iso: string): string {
  const d = new Date(iso)
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString()
}

function formatDate(iso?: string): string {
  if (!iso) return 'Sin vencimiento'
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Panel de administración de membresías: solo lo ve la dueña de la
// plataforma (ver isOwner en lib/membership). La app no cobra sola —
// esto reemplaza tener que editar profiles a mano desde Supabase.
export default function ProfessionalsAdminPage() {
  const [rows, setRows] = useState<ProfesionalRow[] | null>(null)
  const [busyId, setBusyId] = useState('')

  const load = async () => {
    setRows(null)
    const { getSupabase } = await import('@/services/cloud/client')
    const sb = await getSupabase()
    const { data: authData } = await sb.auth.getUser()
    const myId = authData.user?.id
    const { data, error } = await sb.from('profiles').select('id, data')
    if (error) {
      toast.error('No se pudo cargar la lista: ' + error.message)
      setRows([])
      return
    }
    const list = (data ?? [])
      .filter((r) => r.data?.role === 'profesional' && r.id !== myId)
      .map((r) => ({
        id: r.id as string,
        nombre: (r.data.nombre as string) ?? '',
        apellido: (r.data.apellido as string) ?? '',
        email: (r.data.email as string) ?? '',
        titulo: r.data.titulo as string | undefined,
        membershipExpiresAt: r.data.membershipExpiresAt as string | undefined,
      }))
      .sort((a, b) => (a.membershipExpiresAt ?? '').localeCompare(b.membershipExpiresAt ?? ''))
    setRows(list)
  }

  useEffect(() => {
    if (isCloudEnabled()) void load()
    else setRows([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const actualizarFecha = async (row: ProfesionalRow, nuevaFecha: string, mensaje: string) => {
    setBusyId(row.id)
    try {
      const { getSupabase } = await import('@/services/cloud/client')
      const sb = await getSupabase()
      const { data: current, error: readErr } = await sb
        .from('profiles')
        .select('data')
        .eq('id', row.id)
        .maybeSingle()
      if (readErr || !current) throw new Error(readErr?.message ?? 'No se encontró el perfil')
      const { error } = await sb
        .from('profiles')
        .update({ data: { ...current.data, membershipExpiresAt: nuevaFecha } })
        .eq('id', row.id)
      if (error) throw new Error(error.message)
      setRows((prev) => prev?.map((r) => (r.id === row.id ? { ...r, membershipExpiresAt: nuevaFecha } : r)) ?? prev)
      toast.success(mensaje)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo actualizar la membresía')
    } finally {
      setBusyId('')
    }
  }

  const renovar = (row: ProfesionalRow) => {
    const base =
      row.membershipExpiresAt && new Date(row.membershipExpiresAt).getTime() > Date.now()
        ? row.membershipExpiresAt
        : new Date().toISOString()
    const nuevaFecha = addOneYear(base)
    void actualizarFecha(row, nuevaFecha, `Membresía renovada hasta ${formatDate(nuevaFecha)}`)
  }

  const revocar = (row: ProfesionalRow) => {
    const nuevaFecha = new Date().toISOString()
    void actualizarFecha(row, nuevaFecha, `Acceso cortado para ${row.nombre} ${row.apellido}`)
  }

  return (
    <FadeIn>
      <PageHeader title="Profesionales" subtitle="Cuentas registradas y vencimiento de su membresía anual." />

      {!isCloudEnabled() ? (
        <Card>
          <CardContent className="py-6 text-[13px] text-faint">
            Esta sección requiere el modo nube activo.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Membresías
            </CardTitle>
            <CardDescription>
              Cuando una profesional te confirme el pago de su renovación anual, buscala acá y tocá "Renovar 1
              año". No hace falta entrar a Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rows === null && <p className="text-[13px] text-faint">Cargando…</p>}
            {rows?.length === 0 && (
              <p className="text-[13px] text-faint">Todavía no se registró ninguna profesional.</p>
            )}
            {rows && rows.length > 0 && (
              <div className="space-y-2">
                {rows.map((row) => {
                  const expired = row.membershipExpiresAt
                    ? new Date(row.membershipExpiresAt).getTime() < Date.now()
                    : false
                  return (
                    <div
                      key={row.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-[13.5px] font-medium">
                          {row.titulo ? `${row.titulo} ` : ''}
                          {row.nombre} {row.apellido}
                        </p>
                        <p className="text-[12px] text-muted-foreground">{row.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={expired ? 'danger' : 'aqua'}>
                          <CalendarClock className="h-3 w-3" />
                          {expired ? 'Vencida: ' : 'Vence: '}
                          {formatDate(row.membershipExpiresAt)}
                        </Badge>
                        <Button
                          size="sm"
                          variant={expired ? 'default' : 'outline'}
                          onClick={() => renovar(row)}
                          disabled={busyId === row.id}
                        >
                          <RefreshCcw className="h-3.5 w-3.5" /> Renovar 1 año
                        </Button>
                        {!expired && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (window.confirm(`¿Cortar el acceso de ${row.nombre} ${row.apellido} ahora mismo?`)) {
                                revocar(row)
                              }
                            }}
                            disabled={busyId === row.id}
                          >
                            <ShieldOff className="h-3.5 w-3.5" /> Cortar acceso
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </FadeIn>
  )
}
