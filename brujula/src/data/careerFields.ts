// ============================================================
// Mapa de Carreras: 26 grandes campos profesionales para explorar
// ANTES de elegir finalistas. No es el motor de matching (ver
// careers.ts / compassEngine): es un punto de partida amplio para
// descubrir campos que el consultante quizás no había considerado.
// ============================================================

export interface CareerField {
  id: string
  numero: number
  titulo: string
  pista: string
  carreras: string[]
  /** campos emergentes / interdisciplinarios dentro de esta área (opcional) */
  camposNuevos?: string[]
}

export const CAREER_FIELDS: CareerField[] = [
  {
    id: 'salud-bienestar-cuidado',
    numero: 1,
    titulo: 'Salud, bienestar y cuidado de las personas',
    pista: 'Te puede interesar si te gusta: ayudar, acompañar, escuchar, comprender el cuerpo humano, prevenir enfermedades, rehabilitar o mejorar la calidad de vida.',
    carreras: [
      'Medicina', 'Enfermería', 'Odontología', 'Nutrición', 'Kinesiología y Fisiatría', 'Fonoaudiología',
      'Terapia Ocupacional', 'Obstetricia', 'Psicología', 'Psicopedagogía', 'Musicoterapia', 'Farmacia',
      'Bioquímica', 'Óptica y Contactología', 'Instrumentación Quirúrgica', 'Podología', 'Gerontología',
      'Salud Pública', 'Administración y Gestión de Servicios de Salud',
    ],
    camposNuevos: [
      'Ingeniería Biomédica', 'Bioinformática', 'Física Médica', 'Neurociencias',
      'Biotecnología aplicada a la salud', 'Informática en Salud', 'Genética', 'Investigación Clínica',
      'Ciencia de Datos aplicada a salud',
    ],
  },
  {
    id: 'psicologia-educacion-desarrollo-humano',
    numero: 2,
    titulo: 'Psicología, educación y desarrollo humano',
    pista: 'Te puede interesar si disfrutás: enseñar, acompañar procesos de aprendizaje, escuchar, trabajar con niños, adolescentes, adultos o comunidades.',
    carreras: [
      'Psicología', 'Psicopedagogía', 'Ciencias de la Educación', 'Profesorado de Educación Inicial',
      'Profesorado de Educación Primaria', 'Profesorados de Educación Secundaria', 'Educación Especial',
      'Educación Física', 'Pedagogía', 'Gestión Educativa', 'Orientación Educativa', 'Educación Social',
      'Trabajo Social', 'Sociología', 'Terapia Ocupacional', 'Musicoterapia', 'Psicomotricidad',
      'Acompañamiento Terapéutico',
    ],
    camposNuevos: [
      'Tecnología Educativa', 'Diseño de experiencias de aprendizaje', 'Educación Digital', 'Neuroeducación',
      'Producción de contenidos educativos digitales', 'Diseño instruccional', 'Gamificación educativa',
      'Analítica del aprendizaje', 'Educación a distancia', 'Inclusión y accesibilidad educativa',
    ],
  },
  {
    id: 'tecnologia-computacion-ia',
    numero: 3,
    titulo: 'Tecnología, computación e inteligencia artificial',
    pista: 'Te puede interesar si disfrutás: resolver problemas, usar computadoras, investigar cómo funcionan las cosas, programar, crear sistemas o experimentar con nuevas tecnologías.',
    carreras: [
      'Ingeniería Informática', 'Ingeniería en Sistemas', 'Ingeniería en Computación', 'Licenciatura en Informática',
      'Licenciatura en Sistemas', 'Ciencias de la Computación', 'Analista de Sistemas', 'Programación',
      'Desarrollo de Software',
    ],
    camposNuevos: [
      'Inteligencia Artificial', 'Ciencia de Datos', 'Big Data', 'Machine Learning', 'Ciberseguridad',
      'Desarrollo de aplicaciones', 'Desarrollo Web', 'Desarrollo Mobile', 'Computación en la nube',
      'Arquitectura de Software', 'Automatización', 'Internet de las Cosas (IoT)', 'Blockchain', 'Robótica',
      'Sistemas Embebidos', 'Visión Artificial', 'Procesamiento del Lenguaje Natural', 'Computación Cuántica',
      'Tecnicatura en Programación', 'Tecnicatura en Ciencia de Datos e IA', 'Tecnicatura en Ciberseguridad',
      'Desarrollo de Videojuegos', 'Testing y calidad de software',
    ],
  },
  {
    id: 'ingenierias-desarrollo-tecnologico',
    numero: 4,
    titulo: 'Ingenierías y desarrollo tecnológico',
    pista: 'Te puede interesar si te atrae: construir, diseñar, calcular, solucionar problemas técnicos, fabricar o mejorar productos y procesos.',
    carreras: [
      'Ingeniería Civil', 'Ingeniería Industrial', 'Ingeniería Mecánica', 'Ingeniería Electrónica',
      'Ingeniería Eléctrica', 'Ingeniería Electromecánica', 'Ingeniería Química', 'Ingeniería en Telecomunicaciones',
      'Ingeniería Aeronáutica', 'Ingeniería Aeroespacial', 'Ingeniería Naval', 'Ingeniería Automotriz',
      'Ingeniería en Materiales', 'Ingeniería Metalúrgica', 'Ingeniería Nuclear', 'Ingeniería en Petróleo',
      'Ingeniería en Minas', 'Ingeniería Textil', 'Ingeniería en Alimentos', 'Ingeniería Agronómica',
      'Ingeniería Ambiental', 'Ingeniería Biomédica', 'Ingeniería Mecatrónica',
    ],
    camposNuevos: [
      'Robótica', 'Automatización Industrial', 'Industria 4.0', 'Nanotecnología', 'Materiales avanzados',
      'Impresión 3D', 'Sistemas autónomos', 'Tecnología de drones', 'Energías inteligentes', 'Tecnología espacial',
    ],
  },
  {
    id: 'ciencias-naturales-investigacion',
    numero: 5,
    titulo: 'Ciencias naturales e investigación',
    pista: 'Te puede interesar si te preguntás "¿por qué sucede esto?", disfrutás experimentar, investigar, observar la naturaleza o trabajar en laboratorios.',
    carreras: [
      'Biología', 'Ciencias Biológicas', 'Física', 'Química', 'Matemática', 'Astronomía', 'Geología',
      'Geofísica', 'Geoquímica', 'Meteorología', 'Oceanografía', 'Paleontología', 'Ciencias de la Atmósfera',
      'Ciencias Ambientales', 'Biotecnología', 'Bioquímica', 'Genética',
    ],
    camposNuevos: [
      'Bioinformática', 'Biología computacional', 'Biología molecular', 'Genómica', 'Nanociencias',
      'Neurociencias', 'Ciencia de materiales', 'Astrobiología', 'Modelización matemática',
      'Ciencia de Datos aplicada a investigación',
    ],
  },
  {
    id: 'ambiente-sustentabilidad-energia',
    numero: 6,
    titulo: 'Ambiente, sustentabilidad y energía',
    pista: 'Te puede interesar si te preocupa el cambio climático, el ambiente, la conservación de los recursos o las nuevas formas de producir energía.',
    carreras: [
      'Ciencias Ambientales', 'Gestión Ambiental', 'Ingeniería Ambiental', 'Ecología', 'Biología',
      'Recursos Naturales', 'Ingeniería Forestal', 'Ingeniería Hidráulica', 'Geología', 'Geografía', 'Agronomía',
    ],
    camposNuevos: [
      'Energías Renovables', 'Energía Solar', 'Energía Eólica', 'Hidrógeno', 'Eficiencia Energética',
      'Economía Circular', 'Gestión de residuos', 'Restauración ambiental', 'Gestión del cambio climático',
      'Desarrollo sostenible', 'Construcción sustentable',
    ],
  },
  {
    id: 'campo-produccion-agropecuaria-alimentos',
    numero: 7,
    titulo: 'Campo, producción agropecuaria y alimentos',
    pista: 'Te puede interesar si disfrutás: la naturaleza, los animales, el campo, producir alimentos o incorporar tecnología a la producción.',
    carreras: [
      'Agronomía', 'Ingeniería Agronómica', 'Veterinaria', 'Ciencias Agropecuarias', 'Producción Agropecuaria',
      'Ingeniería Forestal', 'Zootecnia', 'Bromatología', 'Ingeniería en Alimentos', 'Tecnología de los Alimentos',
      'Enología', 'Fruticultura', 'Floricultura',
    ],
    camposNuevos: [
      'AgTech', 'Agricultura de precisión', 'Biotecnología agropecuaria', 'Drones aplicados al agro',
      'Automatización agrícola', 'Gestión de datos agropecuarios', 'Producción sustentable', 'Agroecología',
      'Bioeconomía',
    ],
  },
  {
    id: 'economia-empresas-negocios',
    numero: 8,
    titulo: 'Economía, empresas y negocios',
    pista: 'Te puede interesar si disfrutás: organizar, liderar, vender, negociar, administrar dinero o desarrollar proyectos.',
    carreras: [
      'Administración de Empresas', 'Contador Público', 'Economía', 'Finanzas', 'Comercio Internacional',
      'Negocios Internacionales', 'Recursos Humanos', 'Relaciones Laborales', 'Marketing', 'Comercialización',
      'Logística', 'Gestión Empresarial', 'Administración Pública', 'Gestión de PyMES',
    ],
    camposNuevos: [
      'Negocios Digitales', 'Marketing Digital', 'E-commerce', 'Business Analytics', 'Fintech',
      'Finanzas Digitales', 'Emprendimientos', 'Innovación empresarial', 'Project Management',
      'Product Management', 'Customer Experience', 'Growth Marketing', 'Gestión de plataformas digitales',
    ],
  },
  {
    id: 'comunicacion-marketing-contenidos',
    numero: 9,
    titulo: 'Comunicación, marketing y contenidos',
    pista: 'Te puede interesar si disfrutás: comunicar ideas, hablar, escribir, investigar, crear contenido o conectar con diferentes públicos.',
    carreras: [
      'Comunicación Social', 'Periodismo', 'Publicidad', 'Relaciones Públicas', 'Comunicación Institucional',
      'Marketing', 'Letras', 'Edición', 'Producción Audiovisual', 'Locución',
    ],
    camposNuevos: [
      'Comunicación Digital', 'Social Media', 'Community Management', 'Estrategia de contenidos', 'Copywriting',
      'Content Marketing', 'Producción de podcasts', 'Producción de streaming', 'Comunicación transmedia',
      'Storytelling', 'SEO', 'Analítica Digital',
    ],
  },
  {
    id: 'arte-diseno-creatividad',
    numero: 10,
    titulo: 'Arte, diseño y creatividad',
    pista: 'Te puede interesar si disfrutás: crear, dibujar, imaginar, diseñar, expresarte o transformar ideas en objetos e imágenes.',
    carreras: [
      'Bellas Artes', 'Artes Visuales', 'Diseño Gráfico', 'Diseño Industrial', 'Diseño de Indumentaria',
      'Diseño Textil', 'Diseño de Interiores', 'Arquitectura', 'Fotografía', 'Ilustración', 'Escenografía',
      'Música', 'Composición', 'Danza', 'Teatro', 'Artes Audiovisuales', 'Cine',
    ],
    camposNuevos: [
      'Diseño UX/UI', 'Diseño de Experiencia de Usuario', 'Diseño de Interfaces', 'Diseño Digital',
      'Animación 2D y 3D', 'Modelado 3D', 'Motion Graphics', 'Arte Digital', 'Realidad Virtual',
      'Realidad Aumentada', 'Diseño de Videojuegos', 'Diseño de experiencias inmersivas', 'Diseño multimedia',
    ],
  },
  {
    id: 'videojuegos-animacion-entretenimiento-digital',
    numero: 11,
    titulo: 'Videojuegos, animación y entretenimiento digital',
    pista: 'Te puede interesar si te gustan: los videojuegos, las historias, el dibujo digital, la programación o crear mundos.',
    carreras: [
      'Desarrollo de Videojuegos', 'Diseño de Videojuegos', 'Programación de Videojuegos', 'Animación',
      'Animación 3D', 'Diseño Multimedia', 'Producción Audiovisual', 'Arte Digital', 'Diseño de personajes',
      'Modelado 3D', 'Guion', 'Producción de sonido', 'Música para medios audiovisuales',
    ],
    camposNuevos: [
      'Game Designer', 'Game Developer', 'Level Designer', 'Technical Artist', '3D Artist', 'Animator',
      'Narrative Designer', 'UX Designer para videojuegos', 'Diseñador de sonido',
    ],
  },
  {
    id: 'arquitectura-construccion-espacios',
    numero: 12,
    titulo: 'Arquitectura, construcción y espacios',
    pista: 'Te puede interesar si disfrutás: diseñar espacios, construir, imaginar ambientes o combinar creatividad con matemática.',
    carreras: [
      'Arquitectura', 'Ingeniería Civil', 'Maestro Mayor de Obras', 'Diseño de Interiores', 'Diseño Industrial',
      'Urbanismo', 'Paisajismo', 'Agrimensura', 'Topografía',
    ],
    camposNuevos: [
      'Construcción sustentable', 'Ciudades inteligentes', 'Modelado BIM', 'Domótica',
      'Diseño urbano sostenible', 'Visualización arquitectónica 3D', 'Gestión energética de edificios',
    ],
  },
  {
    id: 'derecho-justicia-seguridad',
    numero: 13,
    titulo: 'Derecho, justicia y seguridad',
    pista: 'Te puede interesar si disfrutás: debatir, argumentar, defender derechos, analizar normas o resolver conflictos.',
    carreras: [
      'Abogacía', 'Escribanía', 'Procuración', 'Ciencias Jurídicas', 'Criminalística', 'Criminología',
      'Seguridad', 'Ciencias Forenses', 'Mediación',
    ],
    camposNuevos: [
      'Derecho Informático', 'Protección de Datos', 'Ciberdelitos', 'Inteligencia Artificial y Derecho',
      'Compliance', 'Propiedad Intelectual', 'Derecho Ambiental', 'Derecho Internacional',
      'Resolución alternativa de conflictos',
    ],
  },
  {
    id: 'sociedad-politica-relaciones-internacionales',
    numero: 14,
    titulo: 'Sociedad, política y relaciones internacionales',
    pista: 'Te puede interesar si disfrutás: comprender cómo funciona la sociedad, analizar problemas sociales, debatir ideas o conocer diferentes culturas.',
    carreras: [
      'Ciencia Política', 'Sociología', 'Relaciones Internacionales', 'Trabajo Social', 'Antropología',
      'Ciencias Sociales', 'Historia', 'Geografía', 'Filosofía', 'Administración Pública', 'Desarrollo Local',
    ],
    camposNuevos: [
      'Políticas Públicas', 'Cooperación Internacional', 'Estudios Globales', 'Derechos Humanos', 'Migraciones',
      'Estudios de género', 'Desarrollo sostenible', 'Análisis político', 'Gestión de organizaciones sociales',
    ],
  },
  {
    id: 'idiomas-lengua-cultura',
    numero: 15,
    titulo: 'Idiomas, lengua y cultura',
    pista: 'Te puede interesar si disfrutás: aprender idiomas, leer, escribir, enseñar lenguas o conocer otras culturas.',
    carreras: [
      'Letras', 'Lingüística', 'Traductorado', 'Interpretación', 'Profesorados de idiomas', 'Edición',
      'Corrección de textos', 'Literatura',
    ],
    camposNuevos: [
      'Lingüística Computacional', 'Procesamiento del Lenguaje Natural', 'Localización de software',
      'Traducción audiovisual', 'Subtitulado', 'Comunicación intercultural', 'Humanidades Digitales',
    ],
  },
  {
    id: 'turismo-hoteleria-gastronomia',
    numero: 16,
    titulo: 'Turismo, hotelería y gastronomía',
    pista: 'Te puede interesar si disfrutás: viajar, conocer lugares, organizar experiencias, recibir personas o trabajar con gastronomía.',
    carreras: [
      'Turismo', 'Hotelería', 'Gastronomía', 'Administración Hotelera', 'Gestión Turística', 'Guía de Turismo',
      'Organización de Eventos', 'Sommelier', 'Enología', 'Artes Culinarias',
    ],
    camposNuevos: [
      'Turismo sustentable', 'Turismo aventura', 'Ecoturismo', 'Turismo rural', 'Gestión de experiencias turísticas',
      'Marketing turístico', 'Gestión de destinos',
    ],
  },
  {
    id: 'deporte-actividad-fisica-rendimiento',
    numero: 17,
    titulo: 'Deporte, actividad física y rendimiento',
    pista: 'Te puede interesar si disfrutás: el movimiento, los deportes, el entrenamiento o ayudar a otras personas a mejorar su rendimiento.',
    carreras: [
      'Profesorado de Educación Física', 'Licenciatura en Actividad Física', 'Ciencias del Deporte',
      'Kinesiología', 'Nutrición', 'Gestión Deportiva', 'Entrenamiento Deportivo', 'Recreación',
    ],
    camposNuevos: [
      'Analítica deportiva', 'Tecnología aplicada al deporte', 'Biomecánica', 'Rendimiento deportivo',
      'Gestión de eSports',
    ],
  },
  {
    id: 'industria-produccion-logistica',
    numero: 18,
    titulo: 'Industria, producción y logística',
    pista: 'Te puede interesar si disfrutás: organizar procesos, máquinas, producción, transporte o mejorar cómo funciona una empresa.',
    carreras: [
      'Ingeniería Industrial', 'Organización Industrial', 'Logística', 'Transporte', 'Ingeniería Mecánica',
      'Ingeniería Electromecánica', 'Ingeniería Química', 'Seguridad e Higiene', 'Gestión de Calidad',
    ],
    camposNuevos: [
      'Automatización', 'Robótica Industrial', 'Industria 4.0', 'Supply Chain', 'Analítica logística',
      'Gestión de operaciones', 'Manufactura avanzada',
    ],
  },
  {
    id: 'transporte-aviacion-navegacion',
    numero: 19,
    titulo: 'Transporte, aviación y navegación',
    pista: 'Te puede interesar si te atraen: los aviones, barcos, vehículos, motores, transporte o logística.',
    carreras: [
      'Ingeniería Aeronáutica', 'Ingeniería Aeroespacial', 'Ingeniería Naval', 'Ingeniería Mecánica',
      'Ingeniería Automotriz', 'Logística', 'Transporte', 'Piloto', 'Despachante de Aeronaves',
      'Técnico Aeronáutico', 'Marina Mercante', 'Diseño y mantenimiento de sistemas de transporte',
    ],
  },
  {
    id: 'espacio-astronomia-tecnologia-satelital',
    numero: 20,
    titulo: 'Espacio, astronomía y tecnología satelital',
    pista: 'Te puede interesar si te fascinan: el universo, los satélites, la física o la exploración espacial.',
    carreras: [
      'Astronomía', 'Física', 'Ingeniería Aeroespacial', 'Ingeniería Aeronáutica', 'Ingeniería Electrónica',
      'Ingeniería en Telecomunicaciones', 'Ciencias de la Atmósfera',
    ],
    camposNuevos: [
      'Tecnología Satelital', 'Sistemas espaciales', 'Teledetección', 'Geomática', 'Datos satelitales',
      'Instrumentación espacial',
    ],
  },
  {
    id: 'mar-oceanos-recursos-acuaticos',
    numero: 21,
    titulo: 'Mar, océanos y recursos acuáticos',
    pista: 'Te puede interesar si te gusta: el mar, los animales acuáticos, los barcos o investigar ecosistemas.',
    carreras: [
      'Oceanografía', 'Biología Marina', 'Ciencias del Mar', 'Ingeniería Naval', 'Recursos Pesqueros',
      'Acuicultura', 'Ecología Marina', 'Hidrografía',
    ],
  },
  {
    id: 'moda-belleza-imagen',
    numero: 22,
    titulo: 'Moda, belleza e imagen',
    pista: 'Te puede interesar si disfrutás: la estética, el diseño, las tendencias, crear estilos o trabajar con la imagen.',
    carreras: [
      'Diseño de Indumentaria', 'Diseño Textil', 'Producción de Moda', 'Fotografía', 'Cosmetología',
      'Maquillaje profesional', 'Caracterización', 'Estilismo', 'Asesoramiento de Imagen',
    ],
    camposNuevos: [
      'Moda digital', 'Diseño 3D de indumentaria', 'Marketing de moda', 'E-commerce de moda',
      'Producción de contenido de moda',
    ],
  },
  {
    id: 'emprendimiento-innovacion',
    numero: 23,
    titulo: 'Emprendimiento e innovación',
    pista: 'Te puede interesar si no te imaginás necesariamente trabajando toda tu vida dentro de una organización, sino creando tu propio proyecto — desde cualquier disciplina.',
    carreras: [
      'Administración', 'Marketing', 'Economía', 'Finanzas', 'Diseño', 'Ingeniería', 'Informática',
      'Comunicación', 'Comercio electrónico', 'Negocios Digitales', 'Innovación', 'Gestión de emprendimientos',
    ],
  },
  {
    id: 'carreras-cortas-tecnicaturas',
    numero: 24,
    titulo: 'Carreras cortas y tecnicaturas',
    pista: 'Te puede interesar si buscás una formación superior más corta (2 a 3 años) en vez de una carrera universitaria de 5 o 6.',
    carreras: [
      'Programación', 'Desarrollo de Software', 'Ciencia de Datos', 'Inteligencia Artificial', 'Ciberseguridad',
      'Redes', 'Telecomunicaciones', 'Videojuegos', 'Marketing Digital', 'Comercio Electrónico', 'Administración',
      'Recursos Humanos', 'Logística', 'Turismo', 'Hotelería', 'Gastronomía', 'Producción Audiovisual', 'Diseño',
      'Energías Renovables', 'Automatización', 'Robótica', 'Seguridad e Higiene', 'Laboratorio',
      'Instrumentación Quirúrgica', 'Bioimágenes', 'Producción Agropecuaria', 'Alimentos', 'Enología',
    ],
  },
  {
    id: 'oficios-formacion-profesional',
    numero: 25,
    titulo: 'Oficios y formación profesional',
    pista: 'Te puede interesar si te atrae una formación práctica y un oficio especializado — la universidad no es el único camino.',
    carreras: [
      'Electricidad', 'Electricidad industrial', 'Refrigeración', 'Instalación de aire acondicionado',
      'Energía solar', 'Plomería', 'Gas', 'Carpintería', 'Construcción', 'Soldadura', 'Mecánica automotriz',
      'Mecatrónica', 'Reparación de dispositivos electrónicos', 'Impresión 3D', 'Diseño y fabricación digital',
      'Cocina', 'Pastelería', 'Fotografía', 'Peluquería', 'Estética', 'Producción audiovisual',
    ],
  },
  {
    id: 'carreras-hibridas',
    numero: 26,
    titulo: 'Carreras híbridas: cuando dos mundos se encuentran',
    pista: 'Te puede interesar si te gusta combinar dos pasiones distintas — algunas de las oportunidades más interesantes aparecen justo en el cruce entre dos campos.',
    carreras: [
      'Salud + tecnología: Bioinformática, Ingeniería Biomédica, Informática en Salud, IA aplicada a diagnóstico',
      'Biología + tecnología: Biotecnología, Genómica, Biología computacional',
      'Arte + tecnología: UX/UI, Animación 3D, Videojuegos, Realidad Virtual',
      'Empresa + tecnología: Business Analytics, Fintech, Negocios Digitales, E-commerce',
      'Comunicación + tecnología: Comunicación Digital, Marketing Digital, Producción multimedia',
      'Ambiente + tecnología: Energías Renovables, AgTech, Smart Cities',
      'Derecho + tecnología: Derecho Digital, Protección de Datos, Ciberseguridad y legislación',
      'Educación + tecnología: Tecnología Educativa, Diseño instruccional, Educación Digital',
    ],
  },
]
