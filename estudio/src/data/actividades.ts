// Catálogo de actividades por ruta y nivel. Contenido propio, reformulado a
// partir de material que la usuaria compartió (técnicas de estudio de
// distintos autores, un método comercial y su propia biblioteca de hábitos
// de estudio) — nunca copiado tal cual, ver `fuente` como referencia interna
// de inspiración, no de autoría. El nivel (1 a 3) es una complejidad
// orientativa, igual que en `data/biblioteca.ts`: no representa una edad.

import type { ActividadCatalogo } from '@/types'

export const ACTIVIDADES: ActividadCatalogo[] = [
  // ---------- Organizar para empezar ----------
  {
    id: 'organizar-carpeta-materia',
    rutaId: 'organizar',
    nivel: 1,
    titulo: 'Armar la carpeta por materia',
    descripcion: 'Una sesión de orden: separadores, etiquetas y un lugar fijo para cada materia.',
    fuente: 'hábitos de estudio',
  },
  {
    id: 'organizar-microtareas',
    rutaId: 'organizar',
    nivel: 1,
    titulo: 'De objetivo grande a microtareas',
    descripcion: 'Convertir "estudiar el capítulo 5" en 4 pasos chicos y concretos, uno por vez.',
    fuente: 'técnicas de estudio',
  },
  {
    id: 'organizar-cinco-preguntas',
    rutaId: 'organizar',
    nivel: 2,
    titulo: 'Un objetivo con las 5 preguntas',
    descripcion: 'Qué quiero lograr, cómo sé que lo cumplí, si tengo los recursos, por qué importa y para cuándo.',
    fuente: 'técnicas de estudio',
  },
  {
    id: 'organizar-piramide-prioridades',
    rutaId: 'organizar',
    nivel: 2,
    titulo: 'Pirámide de prioridades',
    descripcion: 'Ordenar lo que hay que estudiar en urgente, importante-no urgente, y para reforzar a largo plazo.',
    fuente: 'método de estudio',
  },

  // ---------- Sostener la atención ----------
  {
    id: 'atencion-regla-2-minutos',
    rutaId: 'sostener_atencion',
    nivel: 1,
    titulo: 'Regla de los 2 minutos + ambiente despejado',
    descripcion: 'Si algo lleva menos de 2 minutos, hacerlo ya; el celular se deja en otro ambiente, no solo en silencio.',
    fuente: 'técnicas de estudio',
  },
  {
    id: 'atencion-bloque-apagon',
    rutaId: 'sostener_atencion',
    nivel: 2,
    titulo: 'Bloque de 25 con apagón total',
    descripcion: 'Un bloque Pomodoro con notificaciones apagadas y el celular en otro ambiente, cronometrado de punta a punta.',
    fuente: 'método de estudio, reformulado',
  },

  // ---------- Comprender consignas y textos ----------
  {
    id: 'comprender-observar-predecir',
    rutaId: 'comprender',
    nivel: 1,
    titulo: 'Antes de leer: observar y predecir',
    descripcion: 'Mirar el título, las imágenes y los subtítulos, y anotar dos preguntas que esperás que el texto responda.',
    fuente: 'método de estudio, reformulado',
  },
  {
    id: 'comprender-lectura-activa-5-pasos',
    rutaId: 'comprender',
    nivel: 2,
    titulo: 'Lectura activa en 5 pasos',
    descripcion: 'De qué trata en una línea, dos preguntas propias, subrayado, explicarlo con tus palabras y resumen en 3 oraciones.',
    fuente: 'método SQ3R, reformulado',
  },
  {
    id: 'comprender-verificar-evidencia',
    rutaId: 'comprender',
    nivel: 3,
    titulo: 'Verificar con evidencia del texto',
    descripcion: 'Volver al texto y citar exactamente la frase que respalda cada respuesta, no solo "me parece que".',
    fuente: 'técnicas de estudio',
  },

  // ---------- Escribir para comunicar ----------
  {
    id: 'escribir-plan-3-vinetas',
    rutaId: 'escribir',
    nivel: 1,
    titulo: 'Plan en 3 viñetas antes de escribir',
    descripcion: 'Anotar 3 ideas clave en el orden en que van a aparecer, antes de escribir la primera oración.',
    fuente: 'técnicas de estudio',
  },
  {
    id: 'escribir-resumen-3-oraciones',
    rutaId: 'escribir',
    nivel: 2,
    titulo: 'Resumen en 3 oraciones',
    descripcion: 'Condensar un texto ya leído en exactamente 3 oraciones, sin mirar el original mientras se escribe.',
    fuente: 'método SQ3R, reformulado',
  },
  {
    id: 'escribir-informal-a-academico',
    rutaId: 'escribir',
    nivel: 3,
    titulo: 'De texto informal a texto académico',
    descripcion: 'Reescribir un párrafo propio reemplazando palabras cotidianas por su versión más formal.',
    fuente: 'técnicas de estudio',
  },
  {
    id: 'escribir-taller-conectores',
    rutaId: 'escribir',
    nivel: 3,
    titulo: 'Taller de conectores',
    descripcion: 'Escribir un párrafo que compare dos ideas usando 4 conectores obligatorios.',
    fuente: 'técnicas de estudio',
  },

  // ---------- Aprender y recordar ----------
  {
    id: 'aprender-4-preguntas',
    rutaId: 'aprender_recordar',
    nivel: 1,
    titulo: '4 preguntas sin mirar',
    descripcion: 'Escribir 4 preguntas sobre el tema y responderlas de memoria, sin el material a la vista.',
    fuente: 'técnicas de estudio',
  },
  {
    id: 'aprender-explicarselo-a-alguien',
    rutaId: 'aprender_recordar',
    nivel: 1,
    titulo: 'Explicárselo a alguien',
    descripcion: 'Contar el tema a otra persona (o en voz alta, solo) como si nunca lo hubiera escuchado.',
    fuente: 'método de estudio, reformulado',
  },
  {
    id: 'aprender-plan-repaso-espaciado',
    rutaId: 'aprender_recordar',
    nivel: 2,
    titulo: 'Plan de repaso espaciado en 4 días',
    descripcion: 'Día 1 lectura, día 3 repaso en voz alta, día 5 repaso con otra persona, día 7 autoevaluación.',
    fuente: 'técnicas de estudio',
  },
  {
    id: 'aprender-grabar-y-revisar',
    rutaId: 'aprender_recordar',
    nivel: 3,
    titulo: 'Grabarte explicando y revisar',
    descripcion: 'Grabar la propia explicación del tema, escucharla después y marcar qué partes quedaron poco claras.',
    fuente: 'método de estudio, reformulado',
  },

  // ---------- Prepararse para evaluar ----------
  {
    id: 'evaluar-calendario-regresivo',
    rutaId: 'prepararse_evaluar',
    nivel: 1,
    titulo: 'Calendario regresivo simple',
    descripcion: 'Contar cuántos días faltan y repartir los temas hacia atrás desde la fecha de la evaluación.',
    fuente: 'cuestionario de planificación',
  },
  {
    id: 'evaluar-bloque-encadenado',
    rutaId: 'prepararse_evaluar',
    nivel: 2,
    titulo: 'Bloque encadenado: mapa, repaso, simulacro',
    descripcion: "25' armando un mapa conceptual, descanso, 25' de repaso en voz alta, descanso, simulacro breve.",
    fuente: 'método de estudio, reformulado',
  },
  {
    id: 'evaluar-simulacro-analisis-errores',
    rutaId: 'prepararse_evaluar',
    nivel: 3,
    titulo: 'Simulacro cronometrado + análisis de errores',
    descripcion: 'Resolver una evaluación de práctica con tiempo real y clasificar cada error por su causa probable.',
    fuente: 'técnicas de estudio',
  },

  // ---------- Regular emociones y persistir ----------
  {
    id: 'regular-respiracion-4-6',
    rutaId: 'regular_persistir',
    nivel: 1,
    titulo: 'Respiración 4-6 antes de rendir',
    descripcion: 'Inhalar contando 4, exhalar contando 6, repetir de 6 a 10 veces.',
    fuente: 'técnicas de estudio',
  },
  {
    id: 'regular-grounding',
    rutaId: 'regular_persistir',
    nivel: 1,
    titulo: 'Grounding 5-4-3-2-1',
    descripcion: 'Nombrar 5 cosas que ves, 4 que tocás, 3 sonidos — para bajar la ansiedad antes de un examen.',
    fuente: 'técnicas de estudio',
  },
  {
    id: 'regular-reencuadre',
    rutaId: 'regular_persistir',
    nivel: 2,
    titulo: 'Reencuadrar un pensamiento ansioso',
    descripcion: 'Escribir el pensamiento, buscar evidencia en contra, y redactar una versión más realista.',
    fuente: 'técnicas de estudio',
  },

  // ---------- Construir autonomía ----------
  {
    id: 'autonomia-registro-eficacia',
    rutaId: 'construir_autonomia',
    nivel: 2,
    titulo: 'Registrar qué tan bien funcionó',
    descripcion: 'Después de probar una herramienta nueva, anotar en una escala simple si funcionó, más o menos, o no.',
    fuente: 'criterio propio de la plataforma',
  },
  {
    id: 'autonomia-transferencia',
    rutaId: 'construir_autonomia',
    nivel: 3,
    titulo: 'Transferir una herramienta a otra materia',
    descripcion: 'Usar por cuenta propia, en una materia distinta, una herramienta aprendida para otra.',
    fuente: 'criterio propio de la plataforma',
  },
  {
    id: 'autonomia-plan-personal',
    rutaId: 'construir_autonomia',
    nivel: 3,
    titulo: 'Armar mi plan personal de herramientas',
    descripcion: 'Hacia el cierre del proceso: una lista propia de qué herramienta usar para cada tipo de tarea.',
    fuente: 'criterio propio de la plataforma',
  },
]
