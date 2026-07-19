import type { ModuleDefinition, ModuleId } from '@/types'

// ============================================================
// Contenido del Método Brújula: 12 módulos · 5 etapas.
// Contenido estático versionado en código (forma parte del
// método profesional; se edita con revisión, no desde la UI).
// ============================================================

export const MODULES: ModuleDefinition[] = [
  {
    id: 'historia',
    numero: 1,
    etapa: 'conocerte',
    nombre: 'Historia',
    esencia: 'De dónde venís: tu recorrido hasta hoy.',
    introduccion:
      'Todo proceso de orientación comienza por la biografía. Este módulo reconstruye la historia personal, familiar y escolar del consultante: los hitos, las mudanzas, los cambios de escuela, las personas significativas y los momentos en que algo despertó su curiosidad.',
    paraElConsultante:
      'Antes de mirar hacia adelante, vamos a mirar tu recorrido. Tu historia guarda pistas: momentos en los que disfrutaste aprender, personas que te marcaron, decisiones que ya tomaste sin darte cuenta.',
    objetivos: [
      'Reconstruir la línea de vida con sus hitos significativos',
      'Identificar experiencias que despertaron interés o rechazo',
      'Reconocer personas y contextos que influyeron en el recorrido',
      'Generar un clima de confianza para el proceso',
    ],
    actividades: [
      {
        id: 'historia-linea-vida',
        titulo: 'Mi línea de vida',
        descripcion:
          'Dibujá o escribí una línea del tiempo con los momentos más importantes de tu vida: cambios, logros, personas, descubrimientos.',
        tipo: 'ejercicio',
        duracionMin: 40,
        dimensiones: ['historia'],
        preguntas: [
          { id: 'q1', texto: '¿Cuáles fueron los 5 momentos más importantes de tu vida hasta hoy?', tipo: 'lista' },
          { id: 'q2', texto: '¿Qué momento recordás como el más feliz? ¿Qué estabas haciendo?', tipo: 'abierta' },
          { id: 'q3', texto: '¿Hubo algún cambio grande (mudanza, escuela, familia) que te haya marcado?', tipo: 'abierta' },
        ],
      },
      {
        id: 'historia-escolar',
        titulo: 'Mi recorrido escolar',
        descripcion: 'Un repaso honesto por tu experiencia en la escuela: lo que disfrutaste, lo que sufriste, lo que aprendiste de vos.',
        tipo: 'reflexion',
        duracionMin: 30,
        dimensiones: ['historia', 'intereses'],
        preguntas: [
          { id: 'q1', texto: '¿Qué materias disfrutaste más a lo largo de tu escolaridad? ¿Por qué?', tipo: 'abierta' },
          { id: 'q2', texto: '¿Qué materias te costaron o te aburrieron? ¿Qué era lo que no funcionaba?', tipo: 'abierta' },
          { id: 'q3', texto: '¿Algún docente te marcó (para bien o para mal)? Contá la escena.', tipo: 'abierta' },
        ],
      },
      {
        id: 'historia-objetos',
        titulo: 'Tres objetos que me cuentan',
        descripcion: 'Elegí tres objetos de tu casa que digan algo de quién sos y traelos (o fotografialos) para la próxima sesión.',
        tipo: 'collage',
        duracionMin: 20,
        dimensiones: ['historia', 'identidad'],
        preguntas: [
          { id: 'q1', texto: '¿Qué tres objetos elegiste?', tipo: 'lista' },
          { id: 'q2', texto: '¿Qué cuenta cada uno de vos?', tipo: 'abierta' },
        ],
      },
    ],
    videos: [
      {
        id: 'v1',
        titulo: '¿Qué es la orientación vocacional?',
        descripcion: 'Por qué orientarse no es hacer un test: es un proceso de conocimiento personal.',
        url: 'https://www.youtube.com/watch?v=metodo-brujula-intro',
        duracion: '6 min',
      },
    ],
    materiales: [
      { id: 'm1', titulo: 'Plantilla: Línea de vida', descripcion: 'PDF imprimible para dibujar tu línea de vida.', tipo: 'plantilla' },
      { id: 'm2', titulo: 'Guía para familias: cómo acompañar', descripcion: 'Qué decir (y qué no) durante el proceso.', tipo: 'pdf' },
    ],
    preguntasGuia: [
      '¿Cómo llega al proceso? ¿Quién lo trae: deseo propio o presión externa?',
      '¿Qué lugar ocupa el estudio en la historia familiar?',
      '¿Aparecen duelos, migraciones o quiebres relevantes?',
    ],
  },
  {
    id: 'identidad',
    numero: 2,
    etapa: 'conocerte',
    nombre: 'Identidad',
    esencia: 'Quién sos hoy, más allá de las etiquetas.',
    introduccion:
      'Este módulo trabaja la pregunta “¿quién soy?” desde múltiples espejos: cómo se ve el consultante, cómo lo ven los demás, qué roles ocupa y qué imagen de sí mismo está en construcción. La identidad vocacional es parte de la identidad personal.',
    paraElConsultante:
      'Elegir qué estudiar es, antes que nada, saber quién sos y quién querés ser. En este módulo vas a mirarte desde distintos espejos: el tuyo, el de tu familia, el de tus amigos.',
    objetivos: [
      'Explorar la autopercepción y la imagen social',
      'Distinguir identidad propia de expectativas ajenas',
      'Poner en palabras cómo se define hoy y qué está en construcción',
    ],
    actividades: [
      {
        id: 'identidad-quien-soy',
        titulo: '¿Quién soy? Diez respuestas',
        descripcion: 'Respondé diez veces la pregunta “¿quién soy?”. Sin pensar demasiado: las primeras respuestas también cuentan.',
        tipo: 'ejercicio',
        duracionMin: 25,
        dimensiones: ['identidad'],
        preguntas: [
          { id: 'q1', texto: 'Escribí tus diez respuestas a “¿quién soy?”', tipo: 'lista' },
          { id: 'q2', texto: '¿Cuál de todas te representa más? ¿Por qué?', tipo: 'abierta' },
          { id: 'q3', texto: '¿Cuál pusiste porque “había que ponerla”?', tipo: 'abierta' },
        ],
      },
      {
        id: 'identidad-espejos',
        titulo: 'Los espejos',
        descripcion: 'Preguntale a tres personas cercanas cómo te describirían en tres palabras. Compará con cómo te ves vos.',
        tipo: 'entrevista',
        duracionMin: 30,
        dimensiones: ['identidad', 'fortalezas'],
        preguntas: [
          { id: 'q1', texto: '¿Qué palabras eligió cada persona?', tipo: 'lista' },
          { id: 'q2', texto: '¿Qué coincidió con tu propia mirada? ¿Qué te sorprendió?', tipo: 'abierta' },
        ],
      },
    ],
    videos: [
      {
        id: 'v1',
        titulo: 'Identidad vocacional: quién sos cuando elegís',
        descripcion: 'La elección vocacional como capítulo de tu identidad.',
        url: 'https://www.youtube.com/watch?v=metodo-brujula-identidad',
        duracion: '8 min',
      },
    ],
    materiales: [
      { id: 'm1', titulo: 'Ficha: Mis espejos', descripcion: 'Plantilla para registrar las respuestas de tus personas cercanas.', tipo: 'plantilla' },
    ],
    preguntasGuia: [
      '¿Qué distancia hay entre cómo se ve y cómo lo ven?',
      '¿Su identidad está definida por pertenencias (club, grupo, familia)?',
      '¿Aparece una identidad “prestada” (ser lo que otro espera)?',
    ],
  },
  {
    id: 'valores',
    numero: 3,
    etapa: 'valorarte',
    nombre: 'Valores',
    esencia: 'Lo que no negociás: tu brújula interior.',
    introduccion:
      'Los valores son el criterio silencioso detrás de toda decisión. Este módulo los hace visibles: qué es lo importante para el consultante, qué está dispuesto a resignar y qué no, y cómo eso condiciona la elección de un modo de vida (no solo de una carrera).',
    paraElConsultante:
      'Tus valores son tu brújula interior: aquello que, cuando lo respetás, te hace sentir en paz. Vamos a descubrir cuáles son los tuyos y qué te dicen sobre el estilo de vida que querés construir.',
    objetivos: [
      'Identificar y jerarquizar los valores personales',
      'Diferenciar valores propios de valores heredados',
      'Conectar valores con estilos de vida y de trabajo',
    ],
    actividades: [
      {
        id: 'valores-eleccion',
        titulo: 'Mis valores',
        descripcion: 'De una lista amplia de valores, elegí los 5 que más te representan y ordenalos. Después contá una escena donde cada uno se haya notado.',
        tipo: 'ejercicio',
        duracionMin: 35,
        dimensiones: ['valores'],
        preguntas: [
          {
            id: 'q1',
            texto: 'Elegí tus 5 valores fundamentales',
            tipo: 'seleccion',
            opciones: [
              'Libertad', 'Ayudar a otros', 'Creatividad', 'Seguridad económica', 'Familia',
              'Conocimiento', 'Justicia', 'Independencia', 'Reconocimiento', 'Naturaleza',
              'Salud', 'Amistad', 'Aventura', 'Orden', 'Espiritualidad', 'Belleza', 'Liderazgo', 'Solidaridad',
            ],
          },
          { id: 'q2', texto: 'Ordenalos del más al menos importante y explicá el primero.', tipo: 'abierta' },
          { id: 'q3', texto: 'Contá una escena real donde uno de esos valores haya guiado una decisión tuya.', tipo: 'abierta' },
        ],
      },
      {
        id: 'valores-vida-ideal',
        titulo: 'Un día en mi vida ideal',
        descripcion: 'Describí un día completo de tu vida ideal dentro de 10 años, de la mañana a la noche. Sin censura.',
        tipo: 'reflexion',
        duracionMin: 30,
        dimensiones: ['valores', 'deseos'],
        preguntas: [
          { id: 'q1', texto: 'Describí ese día: ¿dónde vivís, con quién, cómo es tu trabajo, qué hacés al salir?', tipo: 'abierta' },
          { id: 'q2', texto: '¿Qué de ese día te parece irrenunciable?', tipo: 'abierta' },
        ],
      },
    ],
    videos: [
      {
        id: 'v1',
        titulo: 'Valores: el criterio invisible',
        descripcion: 'Cómo los valores ordenan (sin que lo notes) tus decisiones.',
        url: 'https://www.youtube.com/watch?v=metodo-brujula-valores',
        duracion: '7 min',
      },
    ],
    materiales: [
      { id: 'm1', titulo: 'Listado de 40 valores', descripcion: 'Material de apoyo para la actividad Mis valores.', tipo: 'pdf' },
    ],
    preguntasGuia: [
      '¿Sus valores son propios o repetidos del discurso familiar?',
      '¿Qué conflicto de valores aparece (p. ej. libertad vs. seguridad)?',
      '¿Qué valores necesita que el futuro trabajo respete sí o sí?',
    ],
  },
  {
    id: 'deseos',
    numero: 4,
    etapa: 'valorarte',
    nombre: 'Deseos',
    esencia: 'Lo que querés de verdad, con permiso para soñar.',
    introduccion:
      'El deseo es el motor de todo proyecto sostenible. Este módulo abre un espacio sin juicio para nombrar lo que el consultante quiere de verdad — incluso lo “impracticable” — y distinguir el deseo propio del deber y del miedo.',
    paraElConsultante:
      'Acá no hay respuestas correctas ni carreras “serias”. Vamos a darle lugar a lo que querés de verdad, aunque parezca lejano o imposible. Los deseos, escuchados a tiempo, son información valiosísima.',
    objetivos: [
      'Habilitar el deseo sin filtro de “lo posible”',
      'Distinguir deseo propio de deber y de miedo',
      'Detectar patrones en aquello que se desea',
    ],
    actividades: [
      {
        id: 'deseos-sin-limites',
        titulo: 'Si nada fuera imposible',
        descripcion: 'Imaginá que el dinero, la opinión ajena y el “no da” no existen. ¿Qué harías con tu vida?',
        tipo: 'reflexion',
        duracionMin: 25,
        dimensiones: ['deseos'],
        preguntas: [
          { id: 'q1', texto: 'Si nada fuera imposible, ¿a qué te dedicarías?', tipo: 'abierta' },
          { id: 'q2', texto: '¿Qué es lo que más te atrae de eso?', tipo: 'abierta' },
          { id: 'q3', texto: '¿Qué te frena hoy de tomarlo en serio?', tipo: 'abierta' },
        ],
      },
      {
        id: 'deseos-envidia',
        titulo: 'Envidias que enseñan',
        descripcion: 'La envidia sana señala deseos no escuchados. ¿A quién envidiás (un poco) y por qué?',
        tipo: 'reflexion',
        duracionMin: 20,
        dimensiones: ['deseos', 'intereses'],
        preguntas: [
          { id: 'q1', texto: '¿Qué personas tienen una vida o un trabajo que te da “sana envidia”?', tipo: 'lista' },
          { id: 'q2', texto: '¿Qué exactamente de sus vidas te gustaría tener?', tipo: 'abierta' },
        ],
      },
    ],
    videos: [
      {
        id: 'v1',
        titulo: 'Deseo, deber y miedo',
        descripcion: 'Tres voces que se confunden al elegir. Cómo reconocer cuál habla.',
        url: 'https://www.youtube.com/watch?v=metodo-brujula-deseos',
        duracion: '9 min',
      },
    ],
    materiales: [
      { id: 'm1', titulo: 'Bitácora del deseo', descripcion: 'Registro semanal de momentos de disfrute genuino.', tipo: 'plantilla' },
    ],
    preguntasGuia: [
      '¿Puede nombrar deseos o responde con deberes?',
      '¿Qué hace cuando nadie le pide nada? Ahí suele estar el deseo.',
      '¿Aparece culpa al desear? ¿De dónde viene?',
    ],
  },
  {
    id: 'mandatos',
    numero: 5,
    etapa: 'valorarte',
    nombre: 'Mandatos',
    esencia: 'Las voces heredadas: escucharlas para elegir con libertad.',
    introduccion:
      'Toda familia transmite expectativas: profesiones “de éxito”, carreras prohibidas, lealtades invisibles. Este módulo las pone sobre la mesa para que el consultante pueda decidir qué tomar y qué devolver, sin culpa. Un mandato detectado deja de decidir por nosotros.',
    paraElConsultante:
      'En toda familia circulan frases: “vos tenés que ser…”, “con eso te vas a morir de hambre”, “en esta casa siempre fuimos…”. Vamos a escucharlas de frente para que puedas elegir vos, no ellas.',
    objetivos: [
      'Identificar mandatos familiares y sociales explícitos e implícitos',
      'Analizar su origen y su peso actual',
      'Diferenciar acuerdo genuino de obediencia o rebeldía automática',
    ],
    actividades: [
      {
        id: 'mandatos-frases',
        titulo: 'Frases de mi casa',
        descripcion: 'Registrá las frases que escuchaste en tu familia sobre el estudio, el trabajo y el éxito.',
        tipo: 'ejercicio',
        duracionMin: 30,
        dimensiones: ['mandatos'],
        preguntas: [
          { id: 'q1', texto: '¿Qué frases sobre estudio/trabajo se repiten en tu familia?', tipo: 'lista' },
          { id: 'q2', texto: '¿Qué se espera de vos en tu casa? ¿Quién lo espera?', tipo: 'abierta' },
          { id: 'q3', texto: '¿Hay carreras “bien vistas” y “mal vistas” en tu familia? ¿Cuáles?', tipo: 'abierta' },
        ],
      },
      {
        id: 'mandatos-arbol',
        titulo: 'Árbol de profesiones',
        descripcion: 'Armá el árbol genealógico profesional: a qué se dedicó cada miembro de tu familia y qué se dice de eso.',
        tipo: 'ejercicio',
        duracionMin: 40,
        dimensiones: ['mandatos', 'historia'],
        preguntas: [
          { id: 'q1', texto: '¿A qué se dedican (o dedicaron) tus padres, abuelos y tíos?', tipo: 'abierta' },
          { id: 'q2', texto: '¿Hay alguna “tradición” profesional? ¿Alguien la rompió? ¿Qué pasó?', tipo: 'abierta' },
          { id: 'q3', texto: '¿Sentís que alguna de esas historias te empuja o te frena?', tipo: 'abierta' },
        ],
      },
    ],
    videos: [
      {
        id: 'v1',
        titulo: 'Mandatos: elegir con las voces en la mesa',
        descripcion: 'Qué es un mandato, cómo opera y cómo se desactiva.',
        url: 'https://www.youtube.com/watch?v=metodo-brujula-mandatos',
        duracion: '10 min',
      },
    ],
    materiales: [
      { id: 'm1', titulo: 'Plantilla: Árbol de profesiones', descripcion: 'Esquema imprimible del genograma profesional.', tipo: 'plantilla' },
    ],
    preguntasGuia: [
      '¿Elige por deseo, por obediencia o por rebeldía?',
      '¿Qué costo imagina si “decepciona” a la familia?',
      '¿Los padres sostienen el proceso o lo condicionan?',
    ],
  },
  {
    id: 'fortalezas',
    numero: 6,
    etapa: 'explorar',
    nombre: 'Fortalezas',
    esencia: 'Aquello en lo que ya brillás (aunque no lo veas).',
    introduccion:
      'Las fortalezas no son solo notas escolares: son patrones de energía y logro. Este módulo releva fortalezas de carácter, habilidades sociales, talentos prácticos y logros pasados para construir una base realista de confianza.',
    paraElConsultante:
      'Todos tenemos cosas que nos salen bien con naturalidad, tan naturales que ni las registramos. Vamos a ponerles nombre: conocer tus fortalezas te da piso para elegir con confianza.',
    objetivos: [
      'Identificar fortalezas de carácter, sociales y prácticas',
      'Recuperar logros que evidencian capacidades',
      'Cruzar la mirada propia con la de otros',
    ],
    actividades: [
      {
        id: 'fortalezas-inventario',
        titulo: 'Inventario de fortalezas',
        descripcion: 'Elegí de la lista tus fortalezas más claras y respaldá cada una con un ejemplo real.',
        tipo: 'ejercicio',
        duracionMin: 30,
        dimensiones: ['fortalezas'],
        preguntas: [
          {
            id: 'q1',
            texto: 'Elegí tus 5 fortalezas principales',
            tipo: 'seleccion',
            opciones: [
              'Creatividad', 'Curiosidad', 'Pensamiento crítico', 'Perseverancia', 'Honestidad',
              'Empatía', 'Trabajo en equipo', 'Liderazgo', 'Organización', 'Comunicación',
              'Paciencia', 'Humor', 'Adaptabilidad', 'Detallismo', 'Iniciativa', 'Escucha',
            ],
          },
          { id: 'q2', texto: 'Elegí una y contá un logro concreto donde se haya notado.', tipo: 'abierta' },
          { id: 'q3', texto: '¿Qué te dicen los demás que hacés bien?', tipo: 'abierta' },
        ],
      },
      {
        id: 'fortalezas-flow',
        titulo: 'Momentos de flow',
        descripcion: '¿Haciendo qué se te pasa el tiempo volando? Registrá esta semana tus momentos de concentración plena.',
        tipo: 'reflexion',
        duracionMin: 20,
        dimensiones: ['fortalezas', 'intereses'],
        preguntas: [
          { id: 'q1', texto: '¿Haciendo qué actividades perdés la noción del tiempo?', tipo: 'lista' },
          { id: 'q2', texto: '¿Qué tienen en común esas actividades?', tipo: 'abierta' },
        ],
      },
    ],
    videos: [
      {
        id: 'v1',
        titulo: 'Fortalezas: lo fácil tuyo no es fácil para todos',
        descripcion: 'Cómo detectar talentos que pasan desapercibidos por familiaridad.',
        url: 'https://www.youtube.com/watch?v=metodo-brujula-fortalezas',
        duracion: '7 min',
      },
    ],
    materiales: [
      { id: 'm1', titulo: 'Inventario de fortalezas (imprimible)', descripcion: 'Listado ampliado con definiciones.', tipo: 'pdf' },
    ],
    preguntasGuia: [
      '¿Reconoce logros propios o los minimiza?',
      '¿Sus fortalezas percibidas coinciden con las observadas en sesión?',
      '¿Qué fortalezas usa cuando ayuda a otros?',
    ],
  },
  {
    id: 'intereses',
    numero: 7,
    etapa: 'explorar',
    nombre: 'Intereses',
    esencia: 'Los temas que te encienden la curiosidad.',
    introduccion:
      'Este módulo mapea los intereses genuinos del consultante: qué consume, qué busca, sobre qué pregunta, qué haría gratis. Se trabaja con registro de vida cotidiana, no solo con listados abstractos, para capturar el interés real y no el declarado.',
    paraElConsultante:
      'Tus intereses ya están hablando: en lo que mirás, lo que leés, los videos que buscás, las conversaciones que no te querés perder. Vamos a mapearlos y ver hacia dónde apuntan.',
    objetivos: [
      'Mapear intereses genuinos a partir de la vida cotidiana',
      'Agrupar intereses en áreas temáticas',
      'Diferenciar interés sostenido de entusiasmo pasajero',
    ],
    actividades: [
      {
        id: 'intereses-mapa',
        titulo: 'Mapa de intereses',
        descripcion: 'Registrá todo lo que consumís y hacés por gusto durante una semana: videos, lecturas, charlas, hobbies.',
        tipo: 'investigacion',
        duracionMin: 45,
        dimensiones: ['intereses'],
        preguntas: [
          { id: 'q1', texto: '¿Qué temas aparecen una y otra vez en lo que mirás/leés/escuchás?', tipo: 'lista' },
          { id: 'q2', texto: '¿Sobre qué tema podrías hablar una hora sin aburrirte?', tipo: 'abierta' },
          { id: 'q3', texto: '¿Qué actividad harías gratis, solo por el gusto de hacerla?', tipo: 'abierta' },
        ],
      },
      {
        id: 'intereses-areas',
        titulo: 'Áreas que me llaman',
        descripcion: 'De estas grandes áreas, señalá las que te despiertan curiosidad real (podés elegir varias).',
        tipo: 'ejercicio',
        duracionMin: 20,
        dimensiones: ['intereses'],
        preguntas: [
          {
            id: 'q1',
            texto: '¿Qué áreas te atraen?',
            tipo: 'seleccion',
            opciones: [
              'Salud y cuidado de personas', 'Arte y diseño', 'Tecnología y programación',
              'Ciencias naturales', 'Ciencias sociales', 'Comunicación y medios',
              'Negocios y economía', 'Educación', 'Derecho y justicia', 'Ingeniería y construcción',
              'Ambiente y naturaleza', 'Deporte y movimiento',
            ],
          },
          { id: 'q2', texto: 'De las que elegiste, ¿cuál te intriga más ahora mismo y por qué?', tipo: 'abierta' },
        ],
      },
    ],
    videos: [
      {
        id: 'v1',
        titulo: 'Interés real vs. interés declarado',
        descripcion: 'Por qué lo que hacés dice más que lo que decís que te gusta.',
        url: 'https://www.youtube.com/watch?v=metodo-brujula-intereses',
        duracion: '8 min',
      },
    ],
    materiales: [
      { id: 'm1', titulo: 'Registro semanal de intereses', descripcion: 'Plantilla de bitácora de consumo cultural.', tipo: 'plantilla' },
    ],
    preguntasGuia: [
      '¿Los intereses declarados coinciden con su vida cotidiana?',
      '¿Hay intereses “tapados” por ser poco prestigiosos?',
      '¿Qué intensidad y constancia tiene cada interés?',
    ],
  },
  {
    id: 'aptitudes',
    numero: 8,
    etapa: 'explorar',
    nombre: 'Aptitudes',
    esencia: 'Tus formas naturales de pensar y hacer.',
    introduccion:
      'Las aptitudes son facilidades relativamente estables: razonamiento lógico, expresión verbal, percepción espacial, motricidad fina, sensibilidad estética, habilidad social. Este módulo las releva mediante autoobservación guiada y evidencia escolar y extraescolar — como insumo, nunca como sentencia.',
    paraElConsultante:
      'No se trata de ser “bueno o malo”: se trata de conocer tus formas naturales de pensar y hacer. Saber qué te resulta fluido te ayuda a anticipar cómo vas a vivir una carrera por dentro.',
    objetivos: [
      'Relevar aptitudes con evidencia concreta',
      'Cruzar aptitudes con intereses (pueden no coincidir)',
      'Desdramatizar dificultades: son datos, no condenas',
    ],
    actividades: [
      {
        id: 'aptitudes-autoobservacion',
        titulo: 'Lo que me sale fluido',
        descripcion: 'Evaluá con honestidad cuán fluidas te resultan estas tareas cotidianas.',
        tipo: 'ejercicio',
        duracionMin: 30,
        dimensiones: ['aptitudes'],
        preguntas: [
          { id: 'q1', texto: '¿Qué tareas escolares resolvés más rápido que tus compañeros?', tipo: 'abierta' },
          { id: 'q2', texto: '¿Qué te piden los demás que hagas porque “a vos te sale”?', tipo: 'abierta' },
          {
            id: 'q3',
            texto: '¿Cuáles de estas habilidades sentís más naturales en vos?',
            tipo: 'seleccion',
            opciones: [
              'Explicar con palabras', 'Resolver problemas de lógica', 'Imaginar en 3D / dibujar',
              'Trabajar con las manos', 'Entender a las personas', 'Organizar y planificar',
              'Trabajar con números', 'Crear cosas nuevas', 'Convencer y negociar', 'Observar detalles',
            ],
          },
        ],
      },
      {
        id: 'aptitudes-desafio',
        titulo: 'Mi relación con la dificultad',
        descripcion: 'Cómo reaccionás cuando algo no te sale: esa reacción también es una aptitud (o una oportunidad).',
        tipo: 'reflexion',
        duracionMin: 20,
        dimensiones: ['aptitudes', 'fortalezas'],
        preguntas: [
          { id: 'q1', texto: 'Contá la última vez que algo te costó mucho. ¿Qué hiciste?', tipo: 'abierta' },
          { id: 'q2', texto: '¿Abandonás, insistís o pedís ayuda? ¿Depende de qué?', tipo: 'abierta' },
        ],
      },
    ],
    videos: [
      {
        id: 'v1',
        titulo: 'Aptitud e interés: cuando no coinciden',
        descripcion: 'Qué hacer cuando te gusta algo que te cuesta (y viceversa).',
        url: 'https://www.youtube.com/watch?v=metodo-brujula-aptitudes',
        duracion: '9 min',
      },
    ],
    materiales: [
      { id: 'm1', titulo: 'Guía de aptitudes con ejemplos', descripcion: 'Descripción de cada aptitud con ejemplos cotidianos.', tipo: 'pdf' },
    ],
    preguntasGuia: [
      '¿Qué evidencia escolar/extraescolar respalda cada aptitud?',
      '¿Dónde hay brecha entre interés y aptitud? ¿Es entrenable?',
      '¿Cómo tolera la frustración? ¿Qué implica para carreras largas?',
    ],
  },
  {
    id: 'exploracion',
    numero: 9,
    etapa: 'explorar',
    nombre: 'Exploración',
    esencia: 'Salir a mirar el mundo real del estudio y el trabajo.',
    introduccion:
      'La orientación se juega también fuera del consultorio. Este módulo organiza la exploración activa: entrevistas a profesionales y estudiantes, visitas a universidades, ferias, clases abiertas y jornadas de observación. La información de primera mano desarma fantasías (positivas y negativas).',
    paraElConsultante:
      'Es hora de salir a mirar: hablar con gente que estudia y trabaja en lo que te interesa, pisar una facultad, ver cómo es un día real de esa vida. Nada reemplaza la información de primera mano.',
    objetivos: [
      'Planificar y ejecutar exploraciones concretas',
      'Entrevistar a estudiantes y profesionales',
      'Contrastar fantasías con información real',
    ],
    actividades: [
      {
        id: 'exploracion-entrevista',
        titulo: 'Entrevista a un profesional',
        descripcion: 'Entrevistá a alguien que trabaje en un área que te interese. Te damos la guía de preguntas.',
        tipo: 'entrevista',
        duracionMin: 60,
        dimensiones: ['exploracion', 'intereses'],
        preguntas: [
          { id: 'q1', texto: '¿A quién entrevistaste y a qué se dedica?', tipo: 'abierta' },
          { id: 'q2', texto: '¿Cómo es un día normal de su trabajo? ¿Qué te sorprendió?', tipo: 'abierta' },
          { id: 'q3', texto: '¿Qué es lo mejor y lo peor de su profesión, según sus palabras?', tipo: 'abierta' },
          { id: 'q4', texto: 'Después de la charla, ¿el área te interesa más o menos que antes? ¿Por qué?', tipo: 'abierta' },
        ],
      },
      {
        id: 'exploracion-visita',
        titulo: 'Visita a una institución',
        descripcion: 'Visitá una universidad, terciario o espacio de formación (presencial o virtual) y registrá la experiencia.',
        tipo: 'investigacion',
        duracionMin: 90,
        dimensiones: ['exploracion'],
        preguntas: [
          { id: 'q1', texto: '¿Qué institución visitaste (o qué charla virtual viste)?', tipo: 'abierta' },
          { id: 'q2', texto: '¿Te imaginaste estudiando ahí? ¿Qué sentiste en el lugar?', tipo: 'abierta' },
          { id: 'q3', texto: '¿Qué averiguaste que no sabías (plan de estudios, duración, costos, títulos)?', tipo: 'abierta' },
        ],
      },
    ],
    videos: [
      {
        id: 'v1',
        titulo: 'Cómo entrevistar a un profesional',
        descripcion: 'Guía práctica para conseguir y conducir la entrevista.',
        url: 'https://www.youtube.com/watch?v=metodo-brujula-exploracion',
        duracion: '6 min',
      },
    ],
    materiales: [
      { id: 'm1', titulo: 'Guía de entrevista a profesionales', descripcion: '20 preguntas sugeridas + tips de contacto.', tipo: 'pdf' },
      { id: 'm2', titulo: 'Checklist de visita a instituciones', descripcion: 'Qué mirar y qué preguntar en una visita.', tipo: 'plantilla' },
    ],
    preguntasGuia: [
      '¿Qué fantasías se confirmaron y cuáles se desarmaron?',
      '¿Evita explorar? ¿Qué teme encontrar?',
      '¿La exploración amplió o redujo el abanico? Ambas son avances.',
    ],
  },
  {
    id: 'proyecto_vida',
    numero: 10,
    etapa: 'decidir',
    nombre: 'Proyecto de Vida',
    esencia: 'La carrera es una parte: el proyecto es la vida entera.',
    introduccion:
      'Antes de elegir carrera se elige una vida. Este módulo integra todo lo trabajado en una visión de futuro: dónde y cómo quiere vivir, qué lugar tendrá el trabajo, el estudio, los vínculos, el descanso. La carrera se elige al servicio del proyecto, no al revés.',
    paraElConsultante:
      'Una carrera es un medio, no un fin. En este módulo vas a diseñar el proyecto más importante: tu vida. Después vamos a buscar qué caminos de formación te acercan a ella.',
    objetivos: [
      'Integrar valores, deseos, fortalezas e intereses en una visión de futuro',
      'Definir qué lugar ocupa el estudio/trabajo en esa vida',
      'Formular el proyecto en palabras propias',
    ],
    actividades: [
      {
        id: 'proyecto-vision',
        titulo: 'Mi visión a 10 años',
        descripcion: 'Escribí una carta desde tu “yo de dentro de 10 años” contándote cómo es su vida.',
        tipo: 'reflexion',
        duracionMin: 45,
        dimensiones: ['deseos', 'valores'],
        preguntas: [
          { id: 'q1', texto: 'Escribí la carta: ¿cómo es tu vida dentro de 10 años?', tipo: 'abierta', ayuda: 'Dónde vivís, con quién, de qué trabajás, cómo es tu semana, qué te hace bien.' },
          { id: 'q2', texto: '¿Qué tres cosas de esa vida son innegociables?', tipo: 'lista' },
        ],
      },
      {
        id: 'proyecto-mapa',
        titulo: 'Mapa de mi proyecto',
        descripcion: 'Organizá tu proyecto en áreas: formación, trabajo, vínculos, lugar, estilo de vida.',
        tipo: 'collage',
        duracionMin: 40,
        dimensiones: ['valores', 'deseos'],
        preguntas: [
          { id: 'q1', texto: 'Formación: ¿qué querés aprender en los próximos años?', tipo: 'abierta' },
          { id: 'q2', texto: 'Trabajo: ¿cómo imaginás tu trabajo ideal (con gente, solo, creativo, estable…)?', tipo: 'abierta' },
          { id: 'q3', texto: 'Lugar y estilo de vida: ¿dónde y cómo querés vivir?', tipo: 'abierta' },
        ],
      },
    ],
    videos: [
      {
        id: 'v1',
        titulo: 'Proyecto de vida: la carrera al servicio de la vida',
        descripcion: 'Por qué empezar por la vida y no por el listado de carreras.',
        url: 'https://www.youtube.com/watch?v=metodo-brujula-proyecto',
        duracion: '11 min',
      },
    ],
    materiales: [
      { id: 'm1', titulo: 'Plantilla: Mapa de proyecto de vida', descripcion: 'Esquema de áreas para completar.', tipo: 'plantilla' },
    ],
    preguntasGuia: [
      '¿El proyecto es propio o calcado de un modelo externo?',
      '¿Qué coherencia hay entre proyecto y valores trabajados?',
      '¿El proyecto admite varios caminos de formación? ¿Cuáles?',
    ],
  },
  {
    id: 'carreras',
    numero: 11,
    etapa: 'decidir',
    nombre: 'Carreras',
    esencia: 'Del proyecto a los caminos concretos de formación.',
    introduccion:
      'Recién ahora — con el autoconocimiento y el proyecto construidos — se estudian carreras en serio: planes de estudio, duración, instituciones, salida laboral, vida cotidiana del estudiante y del profesional. Se comparan opciones finalistas con criterios propios del consultante.',
    paraElConsultante:
      'Con tu proyecto claro, ahora sí: vamos a investigar carreras de verdad — qué se estudia, dónde, cuánto dura, cómo es el día a día — y compararlas con TUS criterios, no con los del ranking.',
    objetivos: [
      'Investigar en profundidad las opciones finalistas',
      'Comparar carreras con criterios propios ponderados',
      'Analizar planes de estudio e instituciones reales',
    ],
    actividades: [
      {
        id: 'carreras-finalistas',
        titulo: 'Mis carreras finalistas',
        descripcion: 'Elegí 2 a 4 opciones finalistas e investigá cada una a fondo con la ficha comparativa.',
        tipo: 'investigacion',
        duracionMin: 90,
        dimensiones: ['exploracion', 'intereses'],
        preguntas: [
          { id: 'q1', texto: '¿Cuáles son tus carreras/formaciones finalistas?', tipo: 'lista' },
          { id: 'q2', texto: 'Para cada una: ¿qué materias tiene el plan de estudios? ¿Cuáles te entusiasman y cuáles te asustan?', tipo: 'abierta' },
          { id: 'q3', texto: '¿Dónde se estudia cada una? ¿Qué implica (viaje, mudanza, costos)?', tipo: 'abierta' },
          { id: 'q4', texto: '¿Cómo es el trabajo real de esa profesión en el día a día?', tipo: 'abierta' },
        ],
      },
      {
        id: 'carreras-criterios',
        titulo: 'Mi tabla de criterios',
        descripcion: 'Definí tus criterios de decisión (los tuyos) y evaluá cada finalista con ellos.',
        tipo: 'ejercicio',
        duracionMin: 40,
        dimensiones: ['valores', 'deseos'],
        preguntas: [
          { id: 'q1', texto: '¿Qué 5 criterios son los más importantes PARA VOS al elegir? (ej.: creatividad, estabilidad, ayudar, tiempo libre, viajar)', tipo: 'lista' },
          { id: 'q2', texto: '¿Cómo queda cada carrera finalista mirada con esos criterios?', tipo: 'abierta' },
        ],
      },
    ],
    videos: [
      {
        id: 'v1',
        titulo: 'Cómo leer un plan de estudios',
        descripcion: 'Qué mirar más allá del nombre de la carrera.',
        url: 'https://www.youtube.com/watch?v=metodo-brujula-carreras',
        duracion: '8 min',
      },
    ],
    materiales: [
      { id: 'm1', titulo: 'Ficha comparativa de carreras', descripcion: 'Plantilla para investigar cada finalista.', tipo: 'plantilla' },
      { id: 'm2', titulo: 'Directorio de portales oficiales', descripcion: 'Dónde buscar información confiable de instituciones.', tipo: 'enlace' },
    ],
    preguntasGuia: [
      '¿Investiga con criterios propios o con rankings ajenos?',
      '¿Qué emociones aparecen al acercarse a la decisión?',
      '¿Las finalistas son coherentes con el Perfil Brújula? Si no, ¿qué falta conversar?',
    ],
  },
  {
    id: 'plan_accion',
    numero: 12,
    etapa: 'actuar',
    nombre: 'Plan de Acción',
    esencia: 'Del rumbo elegido a los primeros pasos concretos.',
    introduccion:
      'El cierre del proceso convierte la decisión en plan: inscripciones, fechas, requisitos, plan B, apoyos necesarios y primeros pasos. También se trabaja la despedida del proceso y la confianza para sostener la decisión ante terceros.',
    paraElConsultante:
      'Ya tenés tu norte. Ahora lo bajamos a tierra: fechas, inscripciones, requisitos, plan B y los primeros pasos de tu camino. Un proyecto sin plan es un deseo; con plan, es un rumbo.',
    objetivos: [
      'Armar el plan de acción con pasos, fechas y responsables',
      'Prever obstáculos y plan alternativo',
      'Cerrar el proceso consolidando lo aprendido',
    ],
    actividades: [
      {
        id: 'plan-pasos',
        titulo: 'Mis próximos pasos',
        descripcion: 'Armá tu plan concreto: qué, cuándo y qué necesitás para cada paso.',
        tipo: 'ejercicio',
        duracionMin: 45,
        dimensiones: ['exploracion'],
        preguntas: [
          { id: 'q1', texto: 'Listá los pasos concretos de acá a la inscripción (con fechas).', tipo: 'lista' },
          { id: 'q2', texto: '¿Qué obstáculos podrían aparecer y cómo los vas a manejar?', tipo: 'abierta' },
          { id: 'q3', texto: '¿Cuál es tu plan B si el A se demora o cambia?', tipo: 'abierta' },
        ],
      },
      {
        id: 'plan-carta-final',
        titulo: 'Carta a mí mismo/a',
        descripcion: 'Escribite una carta para leer en tu primer día de estudio: qué aprendiste de vos en este proceso.',
        tipo: 'reflexion',
        duracionMin: 30,
        dimensiones: ['identidad', 'historia'],
        preguntas: [
          { id: 'q1', texto: 'Escribí la carta: ¿qué descubriste de vos? ¿Qué querés recordarte?', tipo: 'abierta' },
        ],
      },
    ],
    videos: [
      {
        id: 'v1',
        titulo: 'Sostener la decisión',
        descripcion: 'Cómo responder a los cuestionamientos sin perder el rumbo.',
        url: 'https://www.youtube.com/watch?v=metodo-brujula-plan',
        duracion: '7 min',
      },
    ],
    materiales: [
      { id: 'm1', titulo: 'Plantilla: Plan de acción', descripcion: 'Cronograma de pasos con fechas y requisitos.', tipo: 'plantilla' },
      { id: 'm2', titulo: 'Calendario de inscripciones', descripcion: 'Fechas clave de inscripción por institución.', tipo: 'pdf' },
    ],
    preguntasGuia: [
      '¿El plan es realista y con fechas verificables?',
      '¿Qué apoyos familiares/económicos requiere y están conversados?',
      '¿Cómo se siente al cerrar? ¿Qué queda abierto para seguimiento?',
    ],
  },
]

export const MODULE_MAP: Record<ModuleId, ModuleDefinition> = Object.fromEntries(
  MODULES.map((m) => [m.id, m]),
) as Record<ModuleId, ModuleDefinition>

export function getModule(id: ModuleId): ModuleDefinition {
  return MODULE_MAP[id]
}
