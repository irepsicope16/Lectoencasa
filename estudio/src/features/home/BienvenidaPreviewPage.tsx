import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Bienvenida } from './InicioPage'
import { Button } from '@/components/ui/button'

/**
 * Vista previa de la pantalla de bienvenida (portada), accesible desde
 * Ajustes sin borrar datos: una vez que ya cargaste tu nombre, la app no
 * vuelve a mostrar esa pantalla sola — esta ruta la muestra igual.
 */
export default function BienvenidaPreviewPage() {
  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm">
        <Link to="/ajustes">
          <ArrowLeft /> Volver a Ajustes
        </Link>
      </Button>
      <Bienvenida />
    </div>
  )
}
