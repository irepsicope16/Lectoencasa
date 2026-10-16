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

// ---------- Test RIASEC ----------
// Inspirado en la teoría de tipos vocacionales de John Holland (Realista,
// Investigador, Artístico, Social, Emprendedor, Convencional) — de
// elaboración propia, no reproduce el instrumento publicado (Self-Directed
// Search) ni sus ítems. Mismo criterio que el resto de los tests internos:
// categorías = tipos de Holland, matching directo contra el catálogo del
// motor (se suman tags 'realista'/'investigador'/etc. en careers.ts).
n = 500
export const TEST_RIASEC: ModuleActivityTemplate = {
  id: 'test-riasec',
  titulo: 'Test RIASEC',
  descripcion:
    'Basado en los 6 tipos de personalidad vocacional de Holland. Puntuá cada frase del 1 (nada que ver conmigo) al 5 (totalmente yo) — no hay respuestas correctas.',
  tipo: 'ejercicio',
  duracionMin: 15,
  dimensiones: ['intereses'],
  preguntas: [
    item('Realista', 'Prefiero resolver las cosas haciendo y probando, más que leyendo teoría sobre el tema.'),
    item('Realista', 'Disfruto trabajar con herramientas, máquinas o con las manos.'),
    item('Realista', 'Me gusta más estar en movimiento o al aire libre que sentado/a en un escritorio.'),
    item('Investigador', 'Me entusiasma investigar un problema hasta entenderlo a fondo.'),
    item('Investigador', 'Prefiero analizar datos y hechos con calma antes de sacar una conclusión.'),
    item('Investigador', 'Me atrae la lógica del método científico: observar, probar, comprobar.'),
    item('Artístico', 'Necesito espacio para expresarme de forma original, sin seguir un molde fijo.'),
    item('Artístico', 'Disfruto crear algo nuevo: una imagen, un texto, una idea, una composición.'),
    item('Artístico', 'Me aburre repetir siempre el mismo procedimiento paso a paso.'),
    item('Social', 'Me resulta gratificante ayudar o enseñarle algo a otra persona.'),
    item('Social', 'Disfruto trabajar en equipo más que en soledad.'),
    item('Social', 'Se me hace fácil darme cuenta de lo que necesita o siente otra persona.'),
    item('Emprendedor', 'Me gusta liderar un grupo y tomar la iniciativa.'),
    item('Emprendedor', 'Disfruto convencer a otros de una idea o un proyecto.'),
    item('Emprendedor', 'Me atrae la idea de armar y manejar un proyecto o negocio propio.'),
    item('Convencional', 'Me siento cómodo/a siguiendo reglas, procedimientos y normas claras.'),
    item('Convencional', 'Disfruto organizar información, archivos o datos con precisión.'),
    item('Convencional', 'Prefiero las tareas con instrucciones claras antes que la improvisación total.'),
  ],
}

// ---------- Cuestionario de Dificultades para Decidir ----------
// Inspirado en el modelo de dificultades en la toma de decisiones de carrera
// de Itamar Gati (CDDQ) y en los estilos de decisión de Harren (CDM-R): no
// reproduce ninguno de los dos instrumentos, es de elaboración propia. A
// diferencia de los otros tests, acá un puntaje alto NO es "más" de algo
// positivo: señala en qué parte del proceso de decidir se está trabando el
// consultante (falta de disposición, falta de información o conflictos),
// para que la profesional pueda intervenir puntualmente ahí. Pensado para
// el módulo Carreras, cuando ya hay opciones finalistas y se acerca el
// momento de elegir.
n = 400
export const TEST_DIFICULTADES_DECISION: ModuleActivityTemplate = {
  id: 'test-dificultades-decision',
  titulo: 'Cuestionario de Dificultades para Decidir',
  descripcion:
    'Puntuá cada frase del 1 (nada que ver conmigo) al 5 (totalmente yo). Ojo: acá un puntaje alto no es mejor ni peor, señala en qué parte de decidir te está costando más, para poder trabajarla puntualmente.',
  tipo: 'ejercicio',
  duracionMin: 12,
  dimensiones: ['exploracion'],
  preguntas: [
    item('Motivación para decidir', 'Siento que todavía no tengo ganas de ponerme a pensar en esto en serio.'),
    item('Motivación para decidir', 'Prefiero postergar esta decisión todo lo que pueda.'),
    item(
      'Indecisión general',
      'Me cuesta decidirme en general, no solo con esto: hasta elegir qué ver o qué comer me lleva rato.',
    ),
    item('Indecisión general', 'Suelo dar vueltas mucho antes de animarme a elegir algo.'),
    item('Creencias que traban', 'Creo que existe una única carrera perfecta para mí y tengo que encontrarla.'),
    item('Creencias que traban', 'Pienso que si me equivoco al elegir, voy a estar perdiendo el tiempo.'),
    item('Información sobre mí mismo/a', 'No tengo muy claro qué es lo que realmente me gusta o me interesa.'),
    item('Información sobre mí mismo/a', 'Me cuesta identificar en qué soy bueno/a o qué se me facilita.'),
    item('Información sobre las opciones', 'No conozco lo suficiente las carreras u oficios que podrían interesarme.'),
    item(
      'Información sobre las opciones',
      'Siento que me faltan datos concretos sobre cómo es estudiar o trabajar en lo que me gusta.',
    ),
    item('Información sobre el proceso', 'No sé bien por dónde empezar para tomar esta decisión.'),
    item('Información sobre el proceso', 'Me resulta confuso todo lo que hay que averiguar y organizar para elegir.'),
    item('Conflictos internos', 'Dudo entre dos o más opciones que me gustan casi por igual.'),
    item('Conflictos internos', 'Cuando me inclino por algo, enseguida me surgen dudas que me hacen volver atrás.'),
    item(
      'Conflictos externos',
      'Lo que a mí me gustaría elegir no coincide con lo que esperan de mí en mi familia.',
    ),
    item(
      'Conflictos externos',
      'Siento que tengo que elegir pensando en lo que otros van a opinar, más que en lo que yo quiero.',
    ),
  ],
}

// ---------- Cuestionario de Intereses (versión extensa) ----------
// Inspirado en la estructura clásica de inventarios de intereses
// vocacionales de larga trayectoria (10 áreas: aire libre, mecánica,
// cálculo, científica, persuasiva, artístico-plástica, literaria,
// musical, servicio social y oficina/administrativa) — de elaboración
// propia, NO reproduce ningún instrumento comercial con derechos de
// autor ni sus ítems. Pensado como la versión larga y exhaustiva (110
// ítems) para cuando se necesita una administración más formal y
// completa que el "Test de Intereses Profesionales" (más breve, 24
// ítems). Mismo formato que el resto de los tests internos: escala
// 1-5, puntaje por categoría de uso profesional.
n = 600
export const TEST_CUESTIONARIO_INTERESES: ModuleActivityTemplate = {
  id: 'cuestionario-intereses',
  titulo: 'Cuestionario de Intereses',
  descripcion:
    'Versión extensa y completa, de 110 frases agrupadas en 10 áreas de interés clásicas. Puntuá cada una del 1 (nada que ver conmigo) al 5 (totalmente yo). No hay respuestas correctas: respondé rápido, con lo primero que te salga. Pensado para una administración más formal, cuando se necesita un relevamiento más exhaustivo que el Test de Intereses Profesionales.',
  tipo: 'ejercicio',
  duracionMin: 35,
  dimensiones: ['intereses'],
  preguntas: [
    item('Aire libre', 'Prefiero estar afuera, en contacto con el clima y la naturaleza, antes que encerrado/a en un lugar.'),
    item('Aire libre', 'Disfruto actividades como acampar, cultivar una huerta o cuidar animales.'),
    item('Aire libre', 'Me atrae más un trabajo al aire libre que uno de oficina.'),
    item('Aire libre', 'Me gusta observar plantas, animales o el paisaje con atención.'),
    item('Aire libre', 'No me molesta ensuciarme las manos trabajando la tierra o con herramientas de campo.'),
    item('Aire libre', 'Disfruto las caminatas, el montañismo o las actividades en la naturaleza.'),
    item('Aire libre', 'Me interesaría un trabajo relacionado con la agricultura, la ganadería o los espacios verdes.'),
    item('Aire libre', 'Prefiero un trabajo físico al aire libre antes que uno sentado todo el día.'),
    item('Aire libre', 'Me gusta estar en contacto con los animales.'),
    item('Aire libre', 'No me molesta el clima cambiante: sol, lluvia, frío, a diferencia de un ambiente siempre controlado.'),
    item('Aire libre', 'Me atraería cuidar parques, bosques o espacios naturales.'),

    item('Mecánica', 'Me gusta entender cómo funcionan las máquinas y los motores por dentro.'),
    item('Mecánica', 'Disfruto armar, desarmar o reparar objetos con mis manos.'),
    item('Mecánica', 'Me atrae trabajar con herramientas: destornilladores, llaves, taladros.'),
    item('Mecánica', 'Me interesaría arreglar un electrodoméstico o un vehículo que no funciona.'),
    item('Mecánica', 'Entiendo con facilidad cómo encajan las piezas de algo mecánico.'),
    item('Mecánica', 'Disfruto construir cosas desde cero siguiendo un plano o mis propias ideas.'),
    item('Mecánica', 'Me atrae la idea de trabajar en un taller o una fábrica.'),
    item('Mecánica', 'Prefiero resolver un problema técnico probando con las manos antes que leyendo el manual.'),
    item('Mecánica', 'Me interesa la tecnología de los autos, las motos o la maquinaria.'),
    item('Mecánica', 'Disfruto instalar o ensamblar muebles y equipos.'),
    item('Mecánica', 'Me gustaría aprender un oficio técnico: electricidad, plomería, mecánica.'),

    item('Cálculo', 'Disfruto resolver problemas con números y cálculos.'),
    item('Cálculo', 'Se me hace fácil trabajar con planillas, estadísticas o presupuestos.'),
    item('Cálculo', 'Me atrae llevar las cuentas de algo: un proyecto, un negocio, un evento.'),
    item('Cálculo', 'Prefiero un problema con una respuesta exacta antes que uno abierto a interpretación.'),
    item('Cálculo', 'Disfruto detectar errores en cálculos o números que no cierran.'),
    item('Cálculo', 'Me interesa entender cómo se arma un presupuesto o una inversión.'),
    item('Cálculo', 'Me resulta entretenido trabajar con fórmulas o ecuaciones.'),
    item('Cálculo', 'Me gustaría un trabajo relacionado con las finanzas, la contabilidad o la estadística.'),
    item('Cálculo', 'Disfruto organizar información numérica en tablas o gráficos.'),
    item('Cálculo', 'Prefiero trabajar con datos concretos antes que con ideas abstractas.'),
    item('Cálculo', 'Se me da bien estimar cantidades, costos o tiempos con precisión.'),

    item('Científica', 'Me gusta investigar por qué pasan las cosas, hasta entenderlas a fondo.'),
    item('Científica', 'Disfruto hacer experimentos y comprobar hipótesis.'),
    item('Científica', 'Me atraen los temas de biología, química, física o astronomía.'),
    item('Científica', 'Me interesa leer sobre descubrimientos científicos o avances de investigación.'),
    item('Científica', 'Disfruto analizar un problema paso a paso, de forma metódica.'),
    item('Científica', 'Me gustaría trabajar en un laboratorio o en un centro de investigación.'),
    item('Científica', 'Me atrae entender los fenómenos naturales desde la lógica y la evidencia.'),
    item('Científica', 'Prefiero comprobar las cosas por mí mismo/a antes de creerlas sin más.'),
    item('Científica', 'Me interesa la medicina o la investigación en salud.'),
    item('Científica', 'Disfruto plantearme preguntas que todavía no tienen respuesta.'),
    item('Científica', 'Me gustaría dedicarme a estudiar o investigar algo en profundidad.'),

    item('Persuasiva', 'Me gusta convencer a otros de una idea en la que creo.'),
    item('Persuasiva', 'Disfruto negociar o llegar a un acuerdo en una discusión.'),
    item('Persuasiva', 'Se me da bien venderle algo a alguien o promocionar un proyecto.'),
    item('Persuasiva', 'Me atrae la idea de liderar un grupo o un equipo.'),
    item('Persuasiva', 'Disfruto hablar en público y captar la atención de los demás.'),
    item('Persuasiva', 'Me interesa un trabajo que implique convencer, vender o representar a otros.'),
    item('Persuasiva', 'Me resulta fácil motivar a un grupo para que haga algo en conjunto.'),
    item('Persuasiva', 'Disfruto debatir y defender un punto de vista.'),
    item('Persuasiva', 'Me atrae la política, el marketing o las relaciones públicas.'),
    item('Persuasiva', 'Me gustaría tener mi propio emprendimiento o negocio.'),
    item('Persuasiva', 'Me siento cómodo/a tomando la iniciativa frente a otros.'),

    item('Artístico-plástica', 'Disfruto crear algo visual: dibujar, pintar, diseñar, decorar.'),
    item('Artístico-plástica', 'Me doy cuenta enseguida si algo está bien compuesto estéticamente.'),
    item('Artístico-plástica', 'Me gusta expresarme a través de imágenes, formas o colores.'),
    item('Artístico-plástica', 'Disfruto actividades como el diseño gráfico, la moda o la fotografía.'),
    item('Artístico-plástica', 'Me atrae crear algo original, sin seguir un molde fijo.'),
    item('Artístico-plástica', 'Me gustaría trabajar en un campo artístico o creativo.'),
    item('Artístico-plástica', 'Disfruto visitar museos, galerías o exposiciones de arte.'),
    item('Artístico-plástica', 'Me interesa la decoración de espacios o el diseño de objetos.'),
    item('Artístico-plástica', 'Prefiero un trabajo donde pueda imaginar y crear antes que repetir una rutina.'),
    item('Artístico-plástica', 'Me atrae la idea de diseñar algo que otros van a ver o usar.'),
    item('Artístico-plástica', 'Disfruto experimentar con distintos materiales o técnicas artísticas.'),

    item('Literaria', 'Me gusta leer y escribir con frecuencia.'),
    item('Literaria', 'Disfruto redactar un texto cuidando cómo queda escrito.'),
    item('Literaria', 'Me atrae contar historias, propias o ajenas, con palabras.'),
    item('Literaria', 'Me interesa el periodismo, la literatura o la escritura creativa.'),
    item('Literaria', 'Disfruto corregir o mejorar un texto que no está bien redactado.'),
    item('Literaria', 'Me gustaría escribir un libro, un blog o un guion algún día.'),
    item('Literaria', 'Me atrae trabajar con el lenguaje: traducir, editar, redactar.'),
    item('Literaria', 'Disfruto las palabras: su significado, su sonido, su uso preciso.'),
    item('Literaria', 'Me interesa investigar y después poner en palabras lo que descubrí.'),
    item('Literaria', 'Prefiero expresar una idea por escrito antes que oralmente.'),
    item('Literaria', 'Me gustaría dedicarme a algo relacionado con los libros o la escritura.'),

    item('Musical', 'La música ocupa un lugar importante en mi vida diaria.'),
    item('Musical', 'Disfruto tocar un instrumento o cantar.'),
    item('Musical', 'Me atrae componer, mezclar o producir música.'),
    item('Musical', 'Reconozco con facilidad si algo musical está afinado o no.'),
    item('Musical', 'Me interesaría trabajar en algo relacionado con la música o el sonido.'),
    item('Musical', 'Disfruto ir a recitales, ensayar o escuchar música con atención.'),
    item('Musical', 'Me gustaría aprender a tocar un instrumento que todavía no sé tocar.'),
    item('Musical', 'Me atrae el mundo de la producción musical o el sonido para audiovisuales.'),
    item('Musical', 'Disfruto bailar o moverme al ritmo de la música.'),
    item('Musical', 'Me interesa la historia o la teoría de la música.'),
    item('Musical', 'Me gustaría dedicarme profesionalmente a algo musical.'),

    item('Servicio social', 'Me resulta gratificante ayudar a otras personas.'),
    item('Servicio social', 'Disfruto escuchar a alguien que necesita hablar o ser escuchado.'),
    item('Servicio social', 'Me atrae trabajar con personas que atraviesan una dificultad.'),
    item('Servicio social', 'Me interesa un trabajo donde el centro sea cuidar o acompañar a otros.'),
    item('Servicio social', 'Se me hace fácil ponerme en el lugar del otro.'),
    item('Servicio social', 'Disfruto enseñarle algo a alguien y ver que lo logra.'),
    item('Servicio social', 'Me atrae la idea de trabajar en salud, educación o acción social.'),
    item('Servicio social', 'Me importa contribuir a mejorar la vida de mi comunidad.'),
    item('Servicio social', 'Disfruto el trabajo en equipo orientado a ayudar a otros.'),
    item('Servicio social', 'Me gustaría dedicarme a una profesión de ayuda o cuidado.'),
    item('Servicio social', 'Me moviliza ver que puedo hacer una diferencia en la vida de alguien.'),

    item('Oficina / Administrativa', 'Disfruto organizar información, archivos o documentos con prolijidad.'),
    item('Oficina / Administrativa', 'Me resulta cómodo seguir procedimientos claros y ordenados.'),
    item('Oficina / Administrativa', 'Me atrae un trabajo con tareas previsibles y bien definidas.'),
    item('Oficina / Administrativa', 'Disfruto planificar y organizar los detalles de una tarea o un evento.'),
    item('Oficina / Administrativa', 'Se me da bien llevar un registro prolijo de datos o tareas.'),
    item('Oficina / Administrativa', 'Me gustaría un trabajo de oficina, con rutinas claras y estables.'),
    item('Oficina / Administrativa', 'Me interesa la gestión administrativa: trámites, formularios, registros.'),
    item('Oficina / Administrativa', 'Disfruto tener todo ordenado y clasificado.'),
    item('Oficina / Administrativa', 'Prefiero la estabilidad y el orden antes que la improvisación constante.'),
    item('Oficina / Administrativa', 'Me resulta satisfactorio completar tareas administrativas paso a paso.'),
    item('Oficina / Administrativa', 'Me atrae trabajar con sistemas, bases de datos o gestión de información.'),
  ],
}
