import type { ModuleActivityTemplate, ModuleQuestion } from '@/types'

// ============================================================
// Tests internos del Método Brújula.
// Ítems tipo 'escala' (1 = nada que ver conmigo · 5 = totalmente yo)
// agrupados por categoría. El consultante los responde en la
// plataforma; el puntaje por categoría es de uso profesional y
// alimenta el Motor Brújula. Nunca se le muestra un número.
// Instrumentos de elaboración propia inspirados en marcos clásicos
// (inteligencias múltiples de Gardner, inventarios de intereses
// y aptitudes) — no reproducen tests publicados.
// ============================================================

let n = 0
const item = (categoria: string, texto: string): ModuleQuestion => ({
  id: `t${++n}`,
  texto,
  tipo: 'escala',
  categoria,
})

// ---------- Test de Intereses Profesionales ----------
// Categorías = áreas del catálogo del motor (matching directo).
n = 0
export const TEST_INTERESES: ModuleActivityTemplate = {
  id: 'test-intereses',
  titulo: 'Test de Intereses Profesionales',
  descripcion:
    'Puntuá cada frase del 1 (nada que ver conmigo) al 5 (totalmente yo). No hay respuestas correctas: respondé rápido, con lo primero que te salga.',
  tipo: 'ejercicio',
  duracionMin: 20,
  dimensiones: ['intereses'],
  preguntas: [
    item('Salud y cuidado de personas', 'Me interesa saber cómo funciona el cuerpo y qué nos hace estar sanos.'),
    item('Salud y cuidado de personas', 'Cuando alguien está mal, me sale naturalmente ocuparme de esa persona.'),
    item('Arte y diseño', 'Disfruto crear cosas visuales: dibujar, diseñar, editar, decorar.'),
    item('Arte y diseño', 'Me doy cuenta enseguida cuando algo está bien o mal diseñado.'),
    item('Tecnología y programación', 'Me atrae entender cómo funcionan las aplicaciones, los juegos o las computadoras.'),
    item('Tecnología y programación', 'Me entusiasmaría crear una app, un juego o un sistema propio.'),
    item('Ciencias naturales', 'Me pregunto el porqué de los fenómenos naturales y me gusta experimentar.'),
    item('Ciencias naturales', 'Disfruto los contenidos de ciencia: biología, química, física, astronomía.'),
    item('Ciencias sociales', 'Me interesa entender por qué la sociedad funciona como funciona.'),
    item('Ciencias sociales', 'Disfruto leer o debatir sobre historia, política o cultura.'),
    item('Comunicación y medios', 'Me gusta contar historias: escribir, filmar, hablar frente a otros.'),
    item('Comunicación y medios', 'Me imagino trabajando en medios, redes o publicidad.'),
    item('Negocios y economía', 'Me atrae la idea de emprender o manejar un proyecto propio.'),
    item('Negocios y economía', 'Me interesa entender cómo se mueve el dinero y cómo funcionan las empresas.'),
    item('Educación', 'Disfruto explicarle cosas a otros y ver que las entienden.'),
    item('Educación', 'Me imagino enseñando o acompañando a otras personas a aprender.'),
    item('Derecho y justicia', 'Me moviliza defender lo que es justo, incluso discutiendo.'),
    item('Derecho y justicia', 'Me interesan las leyes, los juicios y los debates sobre derechos.'),
    item('Ingeniería y construcción', 'Me gusta entender cómo se construyen las cosas: máquinas, edificios, sistemas.'),
    item('Ingeniería y construcción', 'Disfruto armar, desarmar y mejorar objetos.'),
    item('Ambiente y naturaleza', 'Me importa el cuidado del ambiente, los animales o el campo.'),
    item('Ambiente y naturaleza', 'Disfruto las actividades al aire libre y en contacto con la naturaleza.'),
    item('Deporte y movimiento', 'El deporte o la actividad física son parte importante de mi vida.'),
    item('Deporte y movimiento', 'Me imagino trabajando con el cuerpo, el entrenamiento o el juego en equipo.'),
  ],
}

// ---------- Cuestionario de Aptitudes ----------
// Categorías = aptitudes que usa el catálogo de áreas (matching directo).
n = 100
export const TEST_APTITUDES: ModuleActivityTemplate = {
  id: 'test-aptitudes',
  titulo: 'Cuestionario de Aptitudes',
  descripcion:
    'Ahora no se trata de lo que te gusta sino de lo que te sale con facilidad. Puntuá cada frase del 1 (me cuesta mucho) al 5 (me sale muy fácil).',
  tipo: 'ejercicio',
  duracionMin: 15,
  dimensiones: ['aptitudes'],
  preguntas: [
    item('Explicar con palabras', 'Explicar una idea y que los demás la entiendan.'),
    item('Explicar con palabras', 'Escribir textos claros y expresar lo que pienso.'),
    item('Resolver problemas de lógica', 'Resolver acertijos, problemas de lógica o estrategias de juego.'),
    item('Resolver problemas de lógica', 'Encontrar el error o la falla en un razonamiento.'),
    item('Imaginar en 3D / dibujar', 'Imaginar objetos o espacios en tres dimensiones.'),
    item('Imaginar en 3D / dibujar', 'Dibujar, hacer planos o representar ideas visualmente.'),
    item('Trabajar con las manos', 'Armar, reparar o fabricar cosas con las manos.'),
    item('Trabajar con las manos', 'Usar herramientas con precisión.'),
    item('Entender a las personas', 'Darme cuenta de cómo se siente otra persona sin que me lo diga.'),
    item('Entender a las personas', 'Que otros me busquen para hablar de sus problemas.'),
    item('Organizar y planificar', 'Organizar eventos, horarios o grupos de trabajo.'),
    item('Organizar y planificar', 'Planificar los pasos para llegar a una meta.'),
    item('Trabajar con números', 'Hacer cálculos y manejar números con comodidad.'),
    item('Trabajar con números', 'Interpretar tablas, gráficos y estadísticas.'),
    item('Crear cosas nuevas', 'Que se me ocurran ideas originales que a nadie más se le ocurrieron.'),
    item('Crear cosas nuevas', 'Inventar soluciones nuevas cuando algo no funciona.'),
    item('Convencer y negociar', 'Convencer a otros de una idea o propuesta.'),
    item('Convencer y negociar', 'Negociar y llegar a acuerdos cuando hay conflicto.'),
    item('Observar detalles', 'Notar detalles que a los demás se les pasan.'),
    item('Observar detalles', 'Revisar un trabajo y encontrar los errores.'),
  ],
}

// ---------- Test de Inteligencias Múltiples (Gardner) ----------
n = 200
export const TEST_INTELIGENCIAS: ModuleActivityTemplate = {
  id: 'test-inteligencias',
  titulo: 'Test de Inteligencias Múltiples',
  descripcion:
    'Según Howard Gardner no existe UNA inteligencia sino varias formas de ser inteligente. Puntuá cada frase del 1 al 5 según cuánto te representa.',
  tipo: 'ejercicio',
  duracionMin: 20,
  dimensiones: ['aptitudes', 'fortalezas'],
  preguntas: [
    item('Lingüística', 'Me resulta fácil expresarme con palabras, hablando o escribiendo.'),
    item('Lingüística', 'Disfruto leer, escribir o jugar con el lenguaje.'),
    item('Lingüística', 'Recuerdo mejor lo que leo o escucho que lo que veo en imágenes.'),
    item('Lógico-matemática', 'Me gusta encontrar patrones y relaciones entre las cosas.'),
    item('Lógico-matemática', 'Los números y los razonamientos lógicos me resultan naturales.'),
    item('Lógico-matemática', 'Necesito entender el porqué de las cosas, no me alcanza con el cómo.'),
    item('Espacial', 'Pienso en imágenes: visualizo lo que imagino con mucho detalle.'),
    item('Espacial', 'Me oriento con facilidad en lugares nuevos.'),
    item('Espacial', 'Disfruto dibujar, diseñar o armar cosas viendo el espacio mentalmente.'),
    item('Musical', 'La música ocupa un lugar central en mi vida.'),
    item('Musical', 'Reconozco fácilmente ritmos, melodías o cuando algo suena desafinado.'),
    item('Musical', 'Aprendo o memorizo mejor con canciones y ritmos.'),
    item('Corporal-kinestésica', 'Aprendo mejor haciendo que mirando o escuchando.'),
    item('Corporal-kinestésica', 'Tengo buena coordinación y manejo de mi cuerpo.'),
    item('Corporal-kinestésica', 'Necesito moverme: me cuesta estar mucho tiempo quieto/a.'),
    item('Interpersonal', 'Entiendo con facilidad qué les pasa a las personas que me rodean.'),
    item('Interpersonal', 'Trabajo mejor en grupo que en soledad.'),
    item('Interpersonal', 'Suelo ser quien media cuando hay conflictos entre amigos.'),
    item('Intrapersonal', 'Me conozco bien: sé lo que siento y por qué.'),
    item('Intrapersonal', 'Necesito momentos de soledad para pensar y recargarme.'),
    item('Intrapersonal', 'Tengo claras mis metas personales.'),
    item('Naturalista', 'Disfruto observar y entender la naturaleza: animales, plantas, fenómenos.'),
    item('Naturalista', 'Me resulta fácil clasificar y ordenar información del mundo natural.'),
    item('Naturalista', 'Me siento mejor al aire libre que en espacios cerrados.'),
  ],
}

// ---------- Test de Estilo Personal ----------
// Inspirado en el modelo de los "Cinco Grandes" rasgos de personalidad
// (Apertura, Responsabilidad, Extraversión, Amabilidad y Estabilidad
// emocional — esta última es el polo positivo de lo que la literatura
// llama "Neuroticismo", reformulado en sentido afirmativo para que el
// puntaje alto siempre se lea como "más de este rasgo"). Complementa el
// video "Los 5 grandes rasgos de la personalidad" del módulo Identidad.
// No es un test clínico ni diagnóstico: explora el estilo personal para
// pensar en qué ambientes de estudio o trabajo el consultante se
// sentiría más cómodo/a.
n = 300
export const TEST_ESTILO_PERSONAL: ModuleActivityTemplate = {
  id: 'test-estilo-personal',
  titulo: 'Test de Estilo Personal',
  descripcion:
    'Puntuá cada frase del 1 (nada que ver conmigo) al 5 (totalmente yo). No mide si sos "bueno" o "malo" en algo: explora tu estilo personal, para pensar en qué ambientes y formas de trabajo te vas a sentir más cómodo/a.',
  tipo: 'ejercicio',
  duracionMin: 15,
  dimensiones: ['identidad'],
  preguntas: [
    item('Apertura a la experiencia', 'Me gusta probar cosas nuevas, aunque no sepa cómo van a salir.'),
    item('Apertura a la experiencia', 'Disfruto imaginar ideas, historias o posibilidades poco comunes.'),
    item('Apertura a la experiencia', 'Me atrae aprender sobre temas que no tienen nada que ver con lo que ya sé.'),
    item('Apertura a la experiencia', 'Prefiero los cambios y las sorpresas antes que la rutina.'),
    item('Responsabilidad', 'Cuando me comprometo con algo, lo termino aunque me cueste.'),
    item('Responsabilidad', 'Me gusta planificar las cosas antes de hacerlas.'),
    item('Responsabilidad', 'Soy cuidadoso/a con los detalles y los plazos.'),
    item('Responsabilidad', 'Me esfuerzo por hacer las cosas bien, aunque nadie las vaya a revisar.'),
    item('Extraversión', 'Me energizo estando rodeado/a de gente.'),
    item('Extraversión', 'Me resulta fácil iniciar una conversación con alguien que no conozco.'),
    item('Extraversión', 'Prefiero hacer planes con otros antes que quedarme solo/a.'),
    item('Extraversión', 'Me gusta ser el centro de atención en un grupo.'),
    item('Amabilidad', 'Trato de ponerme en el lugar del otro antes de opinar.'),
    item('Amabilidad', 'Prefiero ceder antes que generar un conflicto innecesario.'),
    item('Amabilidad', 'Confío en las intenciones de las personas, aunque no las conozca bien.'),
    item('Amabilidad', 'Me importa que las decisiones grupales sean justas para todos.'),
    item('Estabilidad emocional', 'Me mantengo tranquilo/a incluso cuando las cosas se complican.'),
    item('Estabilidad emocional', 'No me cuesta demasiado recuperarme después de un mal momento.'),
    item('Estabilidad emocional', 'Puedo tomar decisiones importantes sin sentirme abrumado/a por los nervios.'),
    item('Estabilidad emocional', 'En general, me siento seguro/a de mí mismo/a.'),
  ],
}
