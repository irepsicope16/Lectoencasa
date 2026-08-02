import { useState } from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts'
import { Plus, Scale, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label, NativeSelect } from '@/components/ui/input'
import { EmptyState } from '@/components/shared'
import { toast } from '@/components/ui/toast'
import { useUpdate } from '@/hooks/queries'
import { cn } from '@/lib/utils'
import type { CareerComparisonEntry, Consultant } from '@/types'

const COLORES = ['var(--primary)', 'var(--accent)', '#c1508f']

const CRITERIOS: { key: keyof Pick<CareerComparisonEntry, 'entusiasmo' | 'encajeValores' | 'estiloDeVida' | 'salidaLaboralPercibida' | 'viabilidad'>; label: string; ayuda: string }[] = [
  { key: 'entusiasmo', label: 'Entusiasmo', ayuda: '¿Cuánto me entusiasma esta carrera hoy?' },
  { key: 'encajeValores', label: 'Encaje con mis valores', ayuda: '¿Cuánto coincide con lo que valoro?' },
  { key: 'estiloDeVida', label: 'Estilo de vida', ayuda: '¿Se parece a la vida que me imagino?' },
  { key: 'salidaLaboralPercibida', label: 'Salida laboral (investigada)', ayuda: 'Según lo que investigaste: entrevistas, portales oficiales, videos.' },
  { key: 'viabilidad', label: 'Viabilidad práctica', ayuda: 'Duración, costo y cercanía: ¿qué tan realizable es?' },
]

function nuevaCarrera(): CareerComparisonEntry {
  return {
    id: crypto.randomUUID(),
    nombre: '',
    institucion: '',
    tipoInstitucion: undefined,
    duracion: '',
    entusiasmo: 3,
    encajeValores: 3,
    estiloDeVida: 3,
    salidaLaboralPercibida: 3,
    viabilidad: 3,
  }
}

function Puntitos({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} de 5`}
          className={cn(
            'h-5 w-5 rounded-full border-2 transition-colors',
            n <= value ? 'border-primary bg-primary' : 'border-neutral-300 bg-transparent hover:border-primary/50',
          )}
        />
      ))}
    </div>
  )
}

export function ComparadorTab({ consultant }: { consultant: Consultant }) {
  const updateConsultant = useUpdate<Consultant>('consultants')
  const [carreras, setCarreras] = useState<CareerComparisonEntry[]>(consultant.comparacionCarreras ?? [])
  const [saving, setSaving] = useState(false)

  const guardar = async (next: CareerComparisonEntry[]) => {
    setCarreras(next)
    setSaving(true)
    try {
      await updateConsultant.mutateAsync({ id: consultant.id, patch: { comparacionCarreras: next } })
    } catch {
      toast.error('No se pudo guardar la comparación')
    } finally {
      setSaving(false)
    }
  }

  const agregar = () => {
    if (carreras.length >= 3) {
      toast.info('Podés comparar hasta 3 carreras a la vez')
      return
    }
    void guardar([...carreras, nuevaCarrera()])
  }

  const quitar = (id: string) => {
    void guardar(carreras.filter((c) => c.id !== id))
  }

  const actualizar = (id: string, patch: Partial<CareerComparisonEntry>) => {
    const next = carreras.map((c) => (c.id === id ? { ...c, ...patch } : c))
    setCarreras(next)
  }

  const guardarCambios = () => void guardar(carreras)

  const radarData = CRITERIOS.map((c) => {
    const row: Record<string, string | number> = { criterio: c.label }
    carreras.forEach((carrera, i) => {
      row[`c${i}`] = carrera[c.key]
    })
    return row
  })

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" /> Comparador de Carreras
          </CardTitle>
          <CardDescription>
            Cargá hasta 3 carreras finalistas y valoralas junto al consultante, con lo que investigó en la
            "Ruta de Investigación de Carreras". No usa datos de mercado externos: refleja su propia mirada,
            para que la decisión sea suya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {carreras.length === 0 ? (
            <EmptyState
              icon={Scale}
              title="Todavía no cargaste carreras para comparar"
              description="Agregá la primera carrera finalista para empezar."
              action={
                <Button size="sm" onClick={agregar}>
                  <Plus className="h-4 w-4" /> Agregar carrera
                </Button>
              }
            />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-4">
                {carreras.map((c, i) => (
                  <div key={c.id} className="rounded-xl border p-4" style={{ borderColor: COLORES[i] }}>
                    <div className="flex items-center justify-between gap-2">
                      <Input
                        value={c.nombre}
                        onChange={(e) => actualizar(c.id, { nombre: e.target.value })}
                        placeholder={`Carrera ${i + 1}`}
                        className="font-semibold"
                      />
                      <Button variant="ghost" size="sm" onClick={() => quitar(c.id)} aria-label="Quitar carrera">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Input
                        value={c.institucion ?? ''}
                        onChange={(e) => actualizar(c.id, { institucion: e.target.value })}
                        placeholder="Institución"
                      />
                      <Input
                        value={c.duracion ?? ''}
                        onChange={(e) => actualizar(c.id, { duracion: e.target.value })}
                        placeholder="Duración (ej. 5 años)"
                      />
                    </div>
                    <NativeSelect
                      className="mt-2"
                      value={c.tipoInstitucion ?? ''}
                      onChange={(e) => actualizar(c.id, { tipoInstitucion: (e.target.value || undefined) as 'publica' | 'privada' | undefined })}
                    >
                      <option value="">Pública o privada…</option>
                      <option value="publica">Pública</option>
                      <option value="privada">Privada</option>
                    </NativeSelect>

                    <div className="mt-4 space-y-2.5">
                      {CRITERIOS.map((crit) => (
                        <div key={crit.key} className="flex items-center justify-between gap-3">
                          <div>
                            <Label className="text-[12px]">{crit.label}</Label>
                            <p className="text-[10.5px] text-faint">{crit.ayuda}</p>
                          </div>
                          <Puntitos value={c[crit.key]} onChange={(v) => actualizar(c.id, { [crit.key]: v })} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  {carreras.length < 3 && (
                    <Button variant="outline" size="sm" onClick={agregar}>
                      <Plus className="h-4 w-4" /> Agregar otra carrera
                    </Button>
                  )}
                  <Button size="sm" onClick={guardarCambios} disabled={saving}>
                    Guardar comparación
                  </Button>
                </div>
              </div>

              <div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="70%">
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="criterio" tick={{ fill: 'var(--muted-foreground)', fontSize: 10.5 }} />
                      {carreras.map((c, i) => (
                        <Radar
                          key={c.id}
                          dataKey={`c${i}`}
                          stroke={COLORES[i]}
                          fill={COLORES[i]}
                          fillOpacity={0.2}
                          animationDuration={500}
                        />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {carreras.map((c, i) => (
                    <span key={c.id} className="flex items-center gap-1.5 text-[12px]">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORES[i] }} />
                      {c.nombre || `Carrera ${i + 1}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
