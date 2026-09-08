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
    recursos: [
      {
        titulo: 'Identidad vocacional y narrativa personal',
        autor: 'Savickas, M. L. (2005). En Career development and counseling. John Wiley & Sons.',
        descripcion:
          'La identidad vocacional no es algo fijo por descubrir: se construye y reconstruye a lo largo de la vida. Incluye conceptos clave (identidad narrativa, temas de vida, adaptabilidad de carrera) y preguntas para la sesión.',
        href: `${import.meta.env.BASE_URL}biblioteca/ficha-03-identidad-vocacional-narrativa.pdf`,
        tipo: 'pdf',
      },
    ],
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
    recursos: [
      {
        titulo: 'No podemos elegir lo que no conocemos: ampliar horizontes',
        autor: 'Rascovan, S. (2013) y Gavilán, M. (2006).',
        descripcion:
          'Toda elección se realiza dentro de un universo de opciones conocidas. Ampliar horizontes no es acumular información, sino crear condiciones para descubrir campos, recorridos y ocupaciones que antes no formaban parte de lo imaginable. Incluye claves para el profesional y preguntas para la sesión.',
        href: `${import.meta.env.BASE_URL}biblioteca/ficha-05-ampliar-horizontes.pdf`,
        tipo: 'pdf',
      },
    ],
  },
  {
    numero: 6,
    bloque: 'Exploración',
    titulo: 'Juventudes y mundo laboral actual',
    recursos: [
      {
        titulo: 'Juventudes y mundo laboral actual: nuevas formas de trabajo y trayectorias laborales',
        autor:
          'Organización Internacional del Trabajo. (2026). Hagamos doble click en el trabajo: Guía para informar y capacitar sobre el ingreso al mundo laboral de las juventudes (1.ª ed.). OIT.',
        descripcion:
          'El mundo laboral contemporáneo está atravesado por transformaciones tecnológicas y sociales: teletrabajo, plataformas digitales y nuevas ocupaciones. Orientar implica ayudar a comprender la inserción laboral como un proceso dinámico, no solo asociar una carrera con un empleo futuro.',
        href: `${import.meta.env.BASE_URL}biblioteca/ficha-06-juventudes-mundo-laboral.pdf`,
        tipo: 'pdf',
      },
    ],
  },
  {
    numero: 7,
    bloque: 'Exploración',
    titulo: 'Nuevas formas de trabajo y trayectorias laborales',
    recursos: [
      {
        titulo: 'Nuevas formas de trabajo y trayectorias laborales: transformaciones del empleo y recorridos flexibles',
        autor: 'Organización Internacional del Trabajo (OIT).',
        descripcion:
          'La relación tradicional entre estudiar una carrera e ingresar a una organización ya no representa todos los recorridos posibles. Trabajo remoto, plataformas digitales, freelance y emprendimientos amplían oportunidades pero también trasladan riesgos. Incluye escenarios laborales, aplicación en Método Brújula y preguntas para la sesión.',
        href: `${import.meta.env.BASE_URL}biblioteca/ficha-07-nuevas-formas-trabajo.pdf`,
        tipo: 'pdf',
      },
    ],
  },
  {
    numero: 8,
    bloque: 'Decisión',
    titulo: 'Gati: dificultades en la toma de decisiones vocacionales',
    recursos: [
      {
        titulo: 'Dificultades en la toma de decisiones vocacionales: modelo de Gati, Krausz y Osipow',
        autor: 'Gati, I., Krausz, M., & Osipow, S. H. (1996). Journal of Counseling Psychology, 43(4), 510–526.',
        descripcion:
          'Una taxonomía que organiza las dificultades para decidir en tres grupos: falta de preparación, falta de información e información inconsistente. Permite pasar de un "no sé qué elegir" general a una hipótesis de trabajo más precisa. Incluye claves para el profesional y preguntas para la sesión.',
        href: `${import.meta.env.BASE_URL}biblioteca/ficha-08-gati-toma-decisiones.pdf`,
        tipo: 'pdf',
      },
    ],
  },
  {
    numero: 9,
    bloque: 'Decisión',
    titulo: 'Incertidumbre, indecisión y elección',
    recursos: [
      {
        titulo: 'Incertidumbre, indecisión y elección: aprender a decidir sin exigir certezas absolutas',
        autor: 'Gelatt, H. B. (1989). Journal of Counseling Psychology, 36(2), 252–256.',
        descripcion:
          'Elegir una carrera no significa alcanzar una certeza total. Gelatt propone una actitud de "incertidumbre positiva": combinar racionalidad e intuición y mantener apertura para revisar el camino, en lugar de eliminar la duda. Diferencia incertidumbre, indecisión, elección y ambivalencia, con una secuencia de intervención para el módulo de Decisión.',
        href: `${import.meta.env.BASE_URL}biblioteca/ficha-09-incertidumbre-indecision.pdf`,
        tipo: 'pdf',
      },
    ],
  },
  {
    numero: 10,
    bloque: 'Cierre',
    titulo: 'De la elección al proyecto: construir un camino posible',
    recursos: [],
  },
]
