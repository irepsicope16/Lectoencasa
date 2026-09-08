export interface BibliografiaItem {
  titulo: string
  autor: string
  descripcion: string
  /** Si tiene archivo propio alojado en /biblioteca, o un link externo verificado. */
  href?: string
  tipo: 'pdf' | 'libro' | 'articulo'
}

// Bibliografía de referencia para profesionales. Los libros clásicos se citan
// sin link de descarga (son obras con derechos de autor, no material de
// distribución libre) para que cada profesional los busque en su biblioteca
// o librería de confianza.
export const BIBLIOGRAFIA: BibliografiaItem[] = [
  {
    titulo: 'Orientación vocacional. Teoría y técnica — resumen para profesionales',
    autor: 'Material elaborado para Método Brújula',
    descripcion:
      'Síntesis de una conferencia sobre los ejes centrales de la orientación vocacional como proceso subjetivo, relacional y social, con aportes concretos para la práctica.',
    href: `${import.meta.env.BASE_URL}biblioteca/resumen-conferencia-orientacion-vocacional.pdf`,
    tipo: 'pdf',
  },
  {
    titulo: 'La Orientación Vocacional: la estrategia clínica',
    autor: 'Bohoslavsky, R. (1978). Nueva Visión.',
    descripcion:
      'Obra fundacional que propone un enfoque clínico de la orientación vocacional, en lugar del modelo psicométrico tradicional.',
    tipo: 'libro',
  },
  {
    titulo: 'La Orientación Vocacional en el nuevo escenario social',
    autor: 'Rascovan, S. (2004). Revista Mexicana de Orientación Psicológica.',
    descripcion:
      'Repiensa la orientación vocacional frente a los cambios sociales, económicos y culturales del mundo del trabajo actual.',
    tipo: 'articulo',
  },
  {
    titulo: 'Proyecto de Vida y Decisión Vocacional',
    autor: 'Casullo, M. M. y Cayssials, A. (1994). Paidós.',
    descripcion:
      'Aborda la construcción del proyecto de vida vinculada a la identidad ocupacional y la representación subjetiva del futuro laboral.',
    tipo: 'libro',
  },
]
