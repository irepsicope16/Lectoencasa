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
    recursos: [
      {
        titulo: 'Savickas: construcción de carrera y Life Design',
        autor: 'Savickas, M. L., et al. (2009). Journal of Vocational Behavior, 75(3), 239–250.',
        descripcion:
          'La orientación no consiste solo en encontrar una carrera que "encaje": la persona organiza experiencias, intereses y significados en una historia que le permite proyectarse hacia el futuro. Incluye claves para el profesional y preguntas para la sesión.',
        href: `${import.meta.env.BASE_URL}biblioteca/ficha-02-savickas-life-design.pdf`,
        tipo: 'pdf',
      },
    ],
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
    titulo: 'Adaptabilidad de carrera: recursos para transitar cambios',
    recursos: [
      {
        titulo: 'Adaptabilidad de carrera: recursos para transitar cambios',
        autor: 'Savickas, M. L. (1997). The Career Development Quarterly, 45(3), 247–259.',
        descripcion:
          'Las 4 C de la adaptabilidad de carrera (preocupación, control, curiosidad y confianza) como recursos para afrontar transiciones vocacionales en trayectorias que ya no son lineales.',
        href: `${import.meta.env.BASE_URL}biblioteca/ficha-04-adaptabilidad-carrera.pdf`,
        tipo: 'pdf',
      },
    ],
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
    recursos: [
      {
        titulo: 'Juventudes y mundo laboral actual',
        autor:
          'Organización Internacional del Trabajo. (2026). Hagamos doble click en el trabajo: Guía para informar y capacitar sobre el ingreso al mundo laboral de las juventudes. OIT.',
        descripcion:
          'Explorar el futuro ocupacional requiere acercar a los jóvenes información real sobre el mundo del trabajo: derechos, trabajo decente, protección social, nuevas formas de trabajo y construcción de trayectorias.',
        href: `${import.meta.env.BASE_URL}biblioteca/ficha-06-jovenes-mundo-laboral-oit.pdf`,
        tipo: 'pdf',
      },
    ],
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
