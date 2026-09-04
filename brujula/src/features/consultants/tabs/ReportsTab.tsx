import { Link } from 'react-router-dom'
import { FileText, HeartHandshake, Map, PenLine, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Consultant } from '@/types'

export const REPORT_TYPES = [
  {
    tipo: 'profesional',
    icon: FileText,
    titulo: 'Informe profesional',
    descripcion: 'Documento clínico completo: proceso, dimensiones, evidencias y conclusiones.',
  },
  {
    tipo: 'carta',
    icon: Map,
    titulo: 'Carta de Navegación',
    descripcion: 'El mapa del rumbo: áreas sugeridas con sus motivos, vientos y próximas escalas.',
  },
  {
    tipo: 'familia',
    icon: HeartHandshake,
    titulo: 'Resumen para la familia',
    descripcion: 'Versión cuidada para compartir en casa: qué se trabajó y cómo acompañar.',
  },
  {
    tipo: 'consultante',
    icon: UserRound,
    titulo: 'Resumen para el consultante',
    descripcion: 'En segunda persona: lo que descubriste de vos y tus próximos pasos.',
  },
] as const

export function ReportsTab({ consultant }: { consultant: Consultant }) {
  return (
    <div>
      <p className="mb-4 text-[12.5px] text-faint">
        Cada informe se abre en vista de impresión: desde ahí se guarda como PDF con un clic
        (Imprimir → Guardar como PDF). Se generan con los datos actuales del proceso.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {REPORT_TYPES.map((r) => (
          <Link
            key={r.tipo}
            to={`/print/${consultant.id}/${r.tipo}`}
            className="group rounded-xl border bg-surface p-5 transition-all hover:border-border-strong hover:shadow-sm"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft">
              <r.icon className="h-4.5 w-4.5 text-primary-strong" />
            </div>
            <p className="text-[14px] font-semibold">{r.titulo}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{r.descripcion}</p>
            <p className="mt-3 text-[12px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Generar y previsualizar →
            </p>
          </Link>
        ))}

        <Link
          to={`/print/consentimiento/${consultant.id}`}
          className="group rounded-xl border bg-surface p-5 transition-all hover:border-border-strong hover:shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft">
              <PenLine className="h-4.5 w-4.5 text-accent-strong" />
            </div>
            <Badge variant={consultant.consentimiento?.firmado ? 'aqua' : 'amber'}>
              {consultant.consentimiento?.firmado ? 'Firmado' : 'Sin firmar'}
            </Badge>
          </div>
          <p className="text-[14px] font-semibold">Consentimiento informado</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
            Para firmar en persona, con el consultante (o tutor/a) presente.
          </p>
          <p className="mt-3 text-[12px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {consultant.consentimiento?.firmado ? 'Ver documento firmado →' : 'Firmar ahora →'}
          </p>
        </Link>
      </div>
    </div>
  )
}
