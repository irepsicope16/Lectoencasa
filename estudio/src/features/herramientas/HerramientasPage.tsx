import { Link } from 'react-router-dom'
import { BookOpenCheck, NotebookPen, Timer, Workflow } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn, PageHeader } from '@/components/shared'

const HERRAMIENTAS = [
  {
    to: '/herramientas/cronometro',
    icon: Timer,
    titulo: 'Cronómetro de estudio',
    descripcion: 'Ciclos de estudio y descanso (tipo Pomodoro) o tiempo libre, con aviso al terminar.',
  },
  {
    to: '/herramientas/mapas',
    icon: Workflow,
    titulo: 'Mapas conceptuales',
    descripcion: 'Armá y conectá ideas en un lienzo visual para organizar lo que leíste.',
  },
  {
    to: '/herramientas/fichas',
    icon: BookOpenCheck,
    titulo: 'Fichas de repaso',
    descripcion: 'Creá tus propias tarjetas pregunta/respuesta y practicá con ellas.',
  },
  {
    to: '/herramientas/diario',
    icon: NotebookPen,
    titulo: 'Diario de metacognición',
    descripcion: 'Después de cada sesión: qué método usaste, qué tan bien te funcionó y qué cambiarías.',
  },
]

export default function HerramientasPage() {
  return (
    <FadeIn className="space-y-5">
      <PageHeader title="Herramientas" subtitle="Tu caja de herramientas para estudiar mejor." />
      <div className="grid gap-3 sm:grid-cols-2">
        {HERRAMIENTAS.map((h) => (
          <Link key={h.to} to={h.to}>
            <Card className="h-full transition-colors hover:bg-surface-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[15px]">
                  <h.icon className="h-4.5 w-4.5 text-primary" /> {h.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-[12.5px] text-muted-foreground">{h.descripcion}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </FadeIn>
  )
}
