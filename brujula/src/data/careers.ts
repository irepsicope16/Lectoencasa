// ============================================================
// Catálogo de áreas vocacionales y carreras.
// Cada área está etiquetada con las señales (valores, intereses,
// fortalezas, aptitudes) que el Motor Brújula usa para el cruce.
// Las etiquetas están en minúscula y sin tildes para el matching.
// ============================================================

export interface CareerArea {
  id: string
  nombre: string
  descripcion: string
  carreras: string[]
  /** señales que suman evidencia hacia esta área */
  tags: {
    valores: string[]
    intereses: string[]
    fortalezas: string[]
    aptitudes: string[]
  }
}

export const CAREER_AREAS: CareerArea[] = [
  {
    id: 'salud',
    nombre: 'Salud y cuidado de personas',
    descripcion: 'Profesiones dedicadas al cuidado, la prevención y la recuperación de la salud.',
    carreras: ['Medicina', 'Enfermería', 'Psicología', 'Kinesiología', 'Nutrición', 'Fonoaudiología', 'Terapia Ocupacional', 'Odontología'],
    tags: {
      valores: ['ayudar a otros', 'solidaridad', 'salud', 'familia'],
      intereses: ['salud y cuidado de personas', 'salud', 'cuidado', 'psicologia', 'cuerpo', 'biologia', 'personas'],
      fortalezas: ['empatia', 'escucha', 'paciencia', 'perseverancia'],
      aptitudes: ['entender a las personas', 'observar detalles'],
    },
  },
  {
    id: 'educacion',
    nombre: 'Educación',
    descripcion: 'Enseñar, acompañar aprendizajes y diseñar experiencias educativas.',
    carreras: ['Profesorados', 'Ciencias de la Educación', 'Psicopedagogía', 'Educación Inicial', 'Educación Especial'],
    tags: {
      valores: ['ayudar a otros', 'conocimiento', 'solidaridad', 'justicia'],
      intereses: ['educacion', 'enseñar', 'niños', 'aprendizaje', 'acompañar'],
      fortalezas: ['comunicacion', 'paciencia', 'empatia', 'escucha', 'creatividad'],
      aptitudes: ['explicar con palabras', 'entender a las personas'],
    },
  },
  {
    id: 'arte_diseno',
    nombre: 'Arte y Diseño',
    descripcion: 'Crear, componer y comunicar a través de lenguajes visuales, sonoros y escénicos.',
    carreras: ['Diseño Gráfico', 'Diseño de Indumentaria', 'Diseño Industrial', 'Bellas Artes', 'Música', 'Cine y Artes Audiovisuales', 'Teatro', 'Fotografía', 'Diseño UX/UI'],
    tags: {
      valores: ['creatividad', 'belleza', 'libertad', 'independencia'],
      intereses: ['arte y diseño', 'arte', 'artistico', 'visual', 'diseño', 'dibujo', 'ilustracion', 'musica', 'cine', 'fotografia', 'estetica', 'crear', 'ux'],
      fortalezas: ['creatividad', 'curiosidad', 'detallismo', 'iniciativa'],
      aptitudes: ['imaginar en 3d / dibujar', 'crear cosas nuevas', 'observar detalles'],
    },
  },
  {
    id: 'tecnologia',
    nombre: 'Tecnología e Informática',
    descripcion: 'Construir software, sistemas y soluciones digitales.',
    carreras: ['Ingeniería en Sistemas', 'Licenciatura en Informática', 'Ciencia de Datos', 'Desarrollo de Software', 'Ciberseguridad', 'Diseño de Videojuegos'],
    tags: {
      valores: ['conocimiento', 'independencia', 'creatividad', 'seguridad economica'],
      intereses: ['tecnologia y programacion', 'tecnologia', 'programacion', 'computadoras', 'videojuegos', 'internet'],
      fortalezas: ['pensamiento critico', 'curiosidad', 'perseverancia', 'organizacion'],
      aptitudes: ['resolver problemas de logica', 'trabajar con numeros', 'crear cosas nuevas'],
    },
  },
  {
    id: 'ingenieria',
    nombre: 'Ingenierías y Construcción',
    descripcion: 'Diseñar y construir infraestructura, productos y procesos.',
    carreras: ['Ingeniería Civil', 'Ingeniería Industrial', 'Ingeniería Mecánica', 'Ingeniería Electrónica', 'Arquitectura', 'Ingeniería Química'],
    tags: {
      valores: ['orden', 'conocimiento', 'seguridad economica'],
      intereses: ['ingenieria y construccion', 'ingenieria', 'construccion', 'maquinas', 'fisica', 'matematica'],
      fortalezas: ['organizacion', 'pensamiento critico', 'perseverancia', 'detallismo'],
      aptitudes: ['resolver problemas de logica', 'trabajar con numeros', 'imaginar en 3d / dibujar', 'trabajar con las manos'],
    },
  },
  {
    id: 'ciencias_naturales',
    nombre: 'Ciencias Exactas y Naturales',
    descripcion: 'Investigar y comprender la naturaleza y sus leyes.',
    carreras: ['Biología', 'Química', 'Física', 'Matemática', 'Bioquímica', 'Geología', 'Biotecnología', 'Astronomía'],
    tags: {
      valores: ['conocimiento', 'naturaleza', 'curiosidad'],
      intereses: ['ciencias naturales', 'ciencia', 'biologia', 'quimica', 'fisica', 'experimentos', 'investigar'],
      fortalezas: ['curiosidad', 'pensamiento critico', 'perseverancia', 'detallismo'],
      aptitudes: ['resolver problemas de logica', 'trabajar con numeros', 'observar detalles'],
    },
  },
  {
    id: 'sociales',
    nombre: 'Ciencias Sociales y Humanidades',
    descripcion: 'Comprender la sociedad, la cultura y la conducta humana.',
    carreras: ['Sociología', 'Antropología', 'Historia', 'Filosofía', 'Ciencia Política', 'Trabajo Social', 'Relaciones Internacionales', 'Letras'],
    tags: {
      valores: ['justicia', 'conocimiento', 'solidaridad', 'libertad'],
      intereses: ['ciencias sociales', 'sociedad', 'historia', 'politica', 'cultura', 'leer'],
      fortalezas: ['pensamiento critico', 'curiosidad', 'escucha', 'comunicacion'],
      aptitudes: ['explicar con palabras', 'entender a las personas'],
    },
  },
  {
    id: 'comunicacion',
    nombre: 'Comunicación y Medios',
    descripcion: 'Contar historias, informar y conectar audiencias.',
    carreras: ['Comunicación Social', 'Periodismo', 'Publicidad', 'Relaciones Públicas', 'Producción Audiovisual', 'Community Management'],
    tags: {
      valores: ['creatividad', 'libertad', 'reconocimiento'],
      intereses: ['comunicacion y medios', 'comunicacion', 'medios', 'redes', 'escribir', 'contar historias', 'periodismo'],
      fortalezas: ['comunicacion', 'creatividad', 'iniciativa', 'humor', 'adaptabilidad'],
      aptitudes: ['explicar con palabras', 'convencer y negociar', 'crear cosas nuevas'],
    },
  },
  {
    id: 'economia',
    nombre: 'Negocios y Economía',
    descripcion: 'Administrar, emprender y comprender los sistemas económicos.',
    carreras: ['Administración de Empresas', 'Contador Público', 'Economía', 'Marketing', 'Comercio Internacional', 'Recursos Humanos', 'Emprendedorismo'],
    tags: {
      valores: ['seguridad economica', 'liderazgo', 'reconocimiento', 'independencia'],
      intereses: ['negocios y economia', 'negocios', 'economia', 'emprender', 'dinero', 'empresas', 'marketing'],
      fortalezas: ['liderazgo', 'organizacion', 'iniciativa', 'trabajo en equipo', 'adaptabilidad'],
      aptitudes: ['convencer y negociar', 'organizar y planificar', 'trabajar con numeros'],
    },
  },
  {
    id: 'derecho',
    nombre: 'Derecho y Justicia',
    descripcion: 'Defender derechos, mediar conflictos y construir marcos justos.',
    carreras: ['Abogacía', 'Escribanía', 'Criminalística', 'Mediación', 'Martillero Público'],
    tags: {
      valores: ['justicia', 'orden', 'reconocimiento', 'seguridad economica'],
      intereses: ['derecho y justicia', 'derecho', 'justicia', 'leyes', 'debatir', 'argumentar'],
      fortalezas: ['pensamiento critico', 'comunicacion', 'perseverancia', 'honestidad'],
      aptitudes: ['explicar con palabras', 'convencer y negociar', 'observar detalles'],
    },
  },
  {
    id: 'ambiente',
    nombre: 'Ambiente y Agro',
    descripcion: 'Cuidar los ecosistemas y producir de forma sustentable.',
    carreras: ['Ciencias Ambientales', 'Agronomía', 'Veterinaria', 'Gestión Ambiental', 'Recursos Naturales', 'Paisajismo'],
    tags: {
      valores: ['naturaleza', 'salud', 'solidaridad', 'aventura'],
      intereses: ['ambiente y naturaleza', 'naturaleza', 'animales', 'plantas', 'campo', 'ecologia', 'aire libre'],
      fortalezas: ['curiosidad', 'paciencia', 'perseverancia', 'iniciativa'],
      aptitudes: ['trabajar con las manos', 'observar detalles'],
    },
  },
  {
    id: 'deporte',
    nombre: 'Deporte y Movimiento',
    descripcion: 'El cuerpo en acción: rendimiento, salud y enseñanza del movimiento.',
    carreras: ['Educación Física', 'Ciencias del Deporte', 'Entrenamiento Deportivo', 'Gestión Deportiva'],
    tags: {
      valores: ['salud', 'aventura', 'amistad', 'liderazgo'],
      intereses: ['deporte y movimiento', 'deporte', 'entrenar', 'cuerpo', 'equipo', 'competir'],
      fortalezas: ['perseverancia', 'trabajo en equipo', 'liderazgo', 'iniciativa'],
      aptitudes: ['trabajar con las manos', 'entender a las personas'],
    },
  },
]

export const AREA_MAP = Object.fromEntries(CAREER_AREAS.map((a) => [a.id, a]))
