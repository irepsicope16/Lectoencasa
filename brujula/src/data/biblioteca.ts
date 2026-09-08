export interface RecursoBiblioteca {
  titulo: string
  autor: string
  descripcion: string
  /** Archivo propio alojado en /biblioteca, o link externo verificado. */
  href?: string
  tipo: 'pdf' | 'libro' | 'articulo'
}

export interface FichaProfesional {
  numero: number
  /** Bloque temático al que pertenece (varias fichas seguidas comparten bloque). */
  bloque: string
  titulo: string
  recursos: RecursoBiblioteca[]
}

// Biblioteca para el profesional: una serie de 10 fichas temáticas,
// agrupadas en bloques, pensada como material de formación continua
// (no para el consultante). El contenido de cada ficha se va cargando
// a medida que Irene lo envía — hasta entonces queda "recursos: []" y
// la UI lo muestra como próximamente.
export const BIBLIOTECA_PROFESIONAL: FichaProfesional[] = [
  {
    numero: 1,
    bloque: 'Fundamentos',
    titulo: 'Orientación vocacional como proceso y derecho',
    recursos: [
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
    ],
  },
  {
    numero: 2,
    bloque: 'Autoconocimiento',
    titulo: 'Savickas: construcción de carrera y Life Design',
    recursos: [],
  },
  {
    numero: 3,
    bloque: 'Autoconocimiento',
    titulo: 'Identidad vocacional y narrativa personal',
    recursos: [],
  },
  {
    numero: 4,
    bloque: 'Autoconocimiento → Exploración',
    titulo: 'Adaptabilidad de carrera: preocupación, control, curiosidad y confianza',
    recursos: [],
  },
  {
    numero: 5,
    bloque: 'Exploración',
    titulo: '"No podemos elegir lo que no conocemos": ampliar horizontes',
    recursos: [],
  },
  {
    numero: 6,
    bloque: 'Exploración',
    titulo: 'Jóvenes y mundo laboral actual — aportes de la OIT',
    recursos: [],
  },
  {
    numero: 7,
    bloque: 'Exploración',
    titulo: 'Nuevas formas de trabajo y trayectorias laborales',
    recursos: [],
  },
  {
    numero: 8,
    bloque: 'Decisión',
    titulo: 'Gati: dificultades en la toma de decisiones vocacionales',
    recursos: [],
  },
  {
    numero: 9,
    bloque: 'Decisión',
    titulo: 'Incertidumbre, indecisión y elección',
    recursos: [],
  },
  {
    numero: 10,
    bloque: 'Cierre',
    titulo: 'De la elección al proyecto: construir un camino posible',
    recursos: [],
  },
]
