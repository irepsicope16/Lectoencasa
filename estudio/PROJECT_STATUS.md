# Método Estudio — Estado del proyecto

> Fecha: 2026-10-11 (actualizado, ronda 15) · Rama: `claude/mini-app-metodo-estudio`

## Resumen ejecutivo

Mini app de autoayuda para mejorar cómo se estudia: autoperfil, biblioteca de
técnicas y herramientas interactivas, para uso individual de un estudiante o
una familia — sin cuentas, sin profesional de por medio, pensada para
comercializarse directamente.

## 🔄 Pivot de producto (10/10/2026)

Hasta el 15/09/2026, Método Estudio era una herramienta **profesional**
(una psicopedagoga gestionando a varios estudiantes), con flujo clínico
completo (entrevista, integración, prioridades, plan de intervención) y un
backend multi-profesional con Supabase en construcción (PR #143, nunca
mergeado).

La usuaria decidió **abandonar ese enfoque** y reconstruir la app como
producto de autoservicio B2C: un estudiante o familia la usa directamente,
sin que una profesional la gestione. Se mantiene el nombre "Método Estudio"
y la identidad visual (logo, paleta), reutilizando `estudio/` como carpeta.

**Se sacó por completo** (todo lo que asumía una profesional gestionando a
otra persona): roles profesional/estudiante, login con cuentas, entrevista
inicial, indicadores lectores, integración profesional, prioridades, plan de
intervención, alertas clínicas, sesiones y agenda de consultorio, honorarios,
evaluación con archivos subidos, y todo el backend de Supabase (PR #143
queda abandonado, no mergeado — el código de esa rama no forma parte de
este pivot).

**Se mantuvo intacto** (el contenido de fondo, sin tocar): las 56 preguntas
del autoperfil (8 dimensiones), las 8 rutas con sus herramientas, el catálogo
de 26 actividades, los videos sugeridos, el motor de cálculo por dimensión,
el sistema de diseño (tokens, componentes) y el color por módulo.

## ✅ Lo que hay hoy

### Modelo de datos (un solo usuario local, LocalStorage)
`src/types/index.ts`: `QuestionnaireResponse`/`OpenAnswer` (autoperfil),
`DimensionSnapshot` (resultados), `Ruta`/`ActividadCatalogo`/`RecursoVideo`
(contenido estático), `ActividadProbada` (lo que la persona fue probando,
con calificación 1-5 y nota opcional al completarla), y las entidades nuevas
de las herramientas: `SesionEstudio` (cronómetro), `MapaConceptual`
(nodos + conexiones), `Ficha` (flashcards), `EntradaMetacognicion` (diario).

Sin roles, sin `studentId`: cada colección es directamente "lo de esta
persona" — el `Repository` genérico y `LocalStorageDriver` no cambiaron.

### Pantallas
- **Inicio** (`features/home/InicioPage.tsx`): pantalla de bienvenida la
  primera vez (solo pide un nombre, sin email ni contraseña) y dashboard
  después — racha, estadísticas rápidas, ruta sugerida según el autoperfil,
  atajos a Herramientas y Biblioteca.
- **Mi autoperfil** (`features/autoperfil/AutoperfilPage.tsx`): mismo
  cuestionario de 8×7 ítems que antes, ahora con una pantalla de resultados
  al final (banda de necesidad por dimensión + rutas sugeridas, con link
  directo a cada una).
- **Biblioteca** (`features/biblioteca/BibliotecaPage.tsx`): igual que
  antes, con el texto reescrito en segunda persona (ya no se dirige a una
  profesional).
- **Actividades** (`features/actividades/ActividadesPage.tsx`): catálogo +
  "Mis actividades" — probar una actividad, marcarla completada abre un
  diálogo para calificarla (1-5 estrellas + nota), queda en el progreso.
- **Herramientas** (`features/herramientas/`): hub (`HerramientasPage`) +
  4 herramientas nuevas:
  - `CronometroPage`: Pomodoro configurable o tiempo libre, con sonido al
    terminar (Web Audio API, sin asset externo) y registro de sesiones.
  - `MapasPage`: lienzo de mapas conceptuales — arrastrar nodos (pointer
    events + captura de puntero), conectarlos con un flujo de 2 pasos
    ("Conectar nodos" → tocar el primero → tocar el segundo), togglear modo
    conectar sin pre-armar nada (bug encontrado y corregido en la
    verificación con Playwright — ver abajo).
  - `FichasPage`: flashcards propias por tema, tarjeta que se da vuelta al
    tocarla, contador de repasos.
  - `DiarioPage`: 3 preguntas cortas post-estudio (qué método, qué tan bien
    funcionó, qué cambiaría).
- **Mi progreso** (`features/progreso/ProgresoPage.tsx`): racha, calendario
  de hábito de los últimos 28 días, actividades completadas por ruta (barra
  por ruta con el color de `moduleColors.ts`), ranking de técnicas mejor
  calificadas, resultados del autoperfil por dimensión.
- **Ajustes** (`features/settings/SettingsPage.tsx`): nombre, tema
  claro/oscuro/sistema, exportar/importar copia de seguridad, borrar todos
  los datos. Sin perfil profesional, sin matrícula, sin nube.

### Racha y progreso (`lib/progreso.ts`)
`calcularRacha`: días consecutivos de actividad (cronómetro, actividad
completada, entrada de diario) contando desde hoy o ayer hacia atrás.
`diasActivosRecientes`: set de días únicos con actividad en los últimos N
días, para el calendario de hábito.

## ✅ Verificación (10/10/2026)

`npm run typecheck` y `npm run build` sin errores. Smoke test con Playwright
de punta a punta: bienvenida → completar autoperfil (56 respuestas) →
resultados con rutas sugeridas → Biblioteca → probar y completar una
actividad con calificación → Herramientas → Cronómetro → Mapas (crear,
agregar nodos, conectarlos) → Fichas (crear y dar vuelta) → Diario → Mi
progreso → Ajustes → modo oscuro. Cero errores de consola en todo el
recorrido.

Un bug real se encontró y corrigió durante la verificación: en Mapas, el
botón "Conectar nodos" pre-seleccionaba el primer nodo automáticamente al
activarse, lo cual era confuso (tocar ese mismo nodo de nuevo cancelaba la
conexión en vez de completarla). Se separó el estado en `modoConectar`
(booleano) + `conectando` (nodo armado), de forma que activar el modo no
arma ningún nodo — el primer toque arma, el segundo conecta.

## ✅ Ronda 2 (10/10/2026): PWA, recordatorios, exportar/imprimir, repaso espaciado

1. **Instalable como PWA** (`vite-plugin-pwa`, `vite.config.ts`): manifest
   (`name`, colores de marca, `display: standalone`) + íconos 192/512 y un
   512 maskable generados con Pillow desde `public/favicon.png` (ver
   `public/pwa-*.png`). Service worker autogenerado (`generateSW`) precachea
   el shell de la app — abre sin conexión después de la primera visita. Como
   los datos viven en LocalStorage, no hay llamadas de red que cachear aparte.
2. **Recordatorios de racha, honestos** (`lib/recordatorios.ts`,
   `stores/uiStore.ts`): como no hay backend, no existen avisos push reales
   con la app cerrada — eso es una limitación real del navegador, no algo
   que se pueda resolver sin servidor. Lo que sí hay: (a) un cartel dentro de
   la app en Inicio cuando la racha está en riesgo (no hiciste nada hoy
   todavía), siempre visible, sin pedir permiso; (b) opcionalmente, un aviso
   del navegador (Notification API) que **solo suena mientras hay una
   pestaña o la app instalada abierta** — toggle en Ajustes → Recordatorios,
   con el límite explicado en el propio texto de la UI, no escondido.
3. **Exportar/imprimir mapas y fichas** (`features/print/PrintFichasPage.tsx`,
   `features/print/PrintMapaPage.tsx`): mismo patrón que los imprimibles
   existentes (`print-page` + `window.print()`, sin dependencias nuevas).
   Fichas: lista pregunta/respuesta del tema filtrado o todas, pensada para
   repasar en papel. Mapa: recalcula el bounding box de los nodos y escala
   para que entre en una hoja, conserva las conexiones.
4. **Repetición espaciada real (Leitner)** (`lib/leitner.ts`, `types/index.ts`):
   `Ficha` ahora tiene `caja` (1 a 5) y `proximoRepaso`. Al repasar, "La
   sabía" sube de caja y reprograma más lejos (1/2/4/7/14 días); "No la
   sabía" vuelve a caja 1. FichasPage tiene un filtro "Para hoy" (las que
   tocan) además de "Todas", y muestra la caja de cada ficha.

Verificado con Playwright: manifest y `sw.js` accesibles (200), alta de
ficha → "La sabía" saca la ficha de "Para hoy" y sube la racha → "No la
sabía" la deja para mañana → impresión de fichas y de un mapa con 2 nodos
conectados renderizan con los datos reales, sin errores de consola ni
requests fallidos. Se encontró y corrigió un bug real: el `useEffect` del
aviso de racha estaba después de un `return` condicional en `InicioPage`,
violando las reglas de hooks (error #310 de React) — se movió antes del
`return`.

## ✅ Ronda 3 (10/10/2026): actividades interactivas, puntos e insignias

1. **Ejemplo + ejercicio por actividad** — ahora en las 30 actividades del
   catálogo (las 8 rutas completas; empezó como piloto en 2 rutas, aprobado
   y extendido al resto en la misma ronda): cada tarjeta abre un detalle con
   un caso resuelto ("Ejemplo") y una consigna fija de práctica ("Ejercicio").
2. **Aplicá tu propio tema**: mientras una actividad está en curso, un
   cuadro de texto pregunta "¿Cómo la vas a aplicar a lo que estás
   estudiando ahora?" — se guarda en su propio registro (`aplicacionPropia`)
   y queda visible en "Mis actividades".
3. **Atajo a Pomodoro**: el detalle de cada actividad tiene un botón directo
   al Cronómetro (que ya existía, pero no estaba conectado a las técnicas).
4. **Actividades ↔ Fichas de repaso conectadas**: al marcar una actividad
   como completada, se ofrece crear una ficha de repaso ya prellenada con
   el tema (la ruta) y una pregunta sugerida — un clic y queda lista para
   terminar de escribir la respuesta.
5. **Puntos e insignias** (`lib/gamificacion.ts`): puntos derivados de lo que
   ya se guarda (actividades, sesiones, fichas, mapas, diario, racha — nada
   nuevo que persistir) y 9 insignias simples por hitos ("Primer paso",
   "Explorador", "En llamas"...). Sin ranking ni comparación con nadie.
   Visible en Inicio (resumen) y Mi progreso (grilla completa, incluye las
   bloqueadas en gris para mostrar qué falta).
6. **Más intensidad visual**: tipografía base y de botones más grande,
   acento (rojo de los botones) más saturado, sombras con un poco de glow
   de color en los botones principales — pensado para que se sienta más
   vivo para adolescentes, sin tocar el fondo "ladrillo" + hoja clara de la
   ronda anterior (ese esquema sigue siendo lo que protege la lectura).
7. **Más profundidad/color en las tarjetas**: la usuaria mandó una captura
   mostrando la app muy plana y blanca en el celular. Se agregaron
   degradés de color a `Card` y `StatCard` (fondo + insignia del ícono con
   sombra de color) y se aumentó el padding del marco "ladrillo" en mobile.
   Bug real encontrado y corregido en el camino: el primer intento de
   degradé usaba `to-accent-soft/10` (un color con 10% de **opacidad**, no
   10% de mezcla) — el 90% transparente dejaba pasar el rojo ladrillo del
   fondo de la página por detrás, generando un lavado rosado mucho más
   fuerte de lo buscado. Se corrigió usando colores de degradé opacos
   (`from-surface to-accent-soft`, sin modificador de opacidad) tanto en
   `AppShell` como en `Card`.

## ✅ Ronda 4 (11/10/2026): Agenda semanal interactiva

Nueva herramienta pedida explícitamente: una agenda visual para no olvidar
evaluaciones, actividades extraescolares, materiales, cumpleaños y notas.

- **Modelo** (`types/index.ts`): `EventoAgenda` — `tipo` (uno de los 5
  anteriores), `titulo`, `fecha`, `nota` opcional, `completado`. Colección
  nueva en `db.ts` (`agenda_eventos`) y hooks CRUD + toggle en `queries.ts`.
- **Vista semanal** (`features/agenda/AgendaPage.tsx`): 7 días (lunes a
  domingo), navegación semana anterior/siguiente + botón "Hoy", cada tipo de
  evento con su propio color e ícono (evaluación en rojo, extraescolar en
  azul acero, material en dorado, cumpleaños en violeta, nota en azul
  marino). Cada evento se marca como completado con un check — así no hace
  falta borrarlo para saber que ya se resolvió, y se puede ver de un
  vistazo qué falta. Responsive: columnas en desktop, lista apilada en
  mobile.
- **Conectada al resto de la app**: tarjeta "Agenda — próximos 7 días" en
  Inicio con los pendientes más cercanos y acceso directo a la semana
  completa. Ícono propio en el menú lateral.
- Dos bugs reales encontrados y corregidos en la verificación: (1) el
  diálogo "Nuevo evento" reseteaba sus campos en el callback `onOpenChange`
  de Radix, que **no** se dispara cuando el padre reabre el diálogo de
  forma programática (el botón "+" de cada día) — una nota quedaba pegada
  del evento anterior. Se movió el reseteo a un `useEffect` sobre la prop
  `open`. (2) los títulos largos se truncaban con "..." en las columnas
  angostas de 7 días — se cambió a texto que hace salto de línea en vez de
  cortarse.

## ✅ Ronda 5 (11/10/2026): rediseño pastel tipo "planner"

La usuaria mandó capturas de planificadores semanales reales (Pinterest/
Instagram) como referencia directa: cada día con su propio color pastel,
bordes bien redondeados, íconos en circulitos de color — y marcó que,
pese a los ajustes de las rondas anteriores, la app seguía sintiéndose
"aburrida" y "antigua". Esta ronda adopta ese lenguaje visual en serio,
no como otro ajuste incremental de gradientes:

- **Paleta por día de semana** (`index.css`, tokens `--dia-*`): 7 pasteles
  distintos (rosa, celeste, menta, verde, manteca, durazno, lavanda), con
  su versión oscura para dark mode. La Agenda ahora usa el color propio de
  cada día en vez de tarjetas blancas uniformes — igual que las
  referencias. El día de hoy se distingue con un anillo de color y una
  píldora "HOY", sin perder su propio pastel.
- **Bordes más redondeados en toda la app**: se subió el token `--radius`
  de 0.65rem a 1rem — como `Card`, `Button` y `Dialog` ya usaban
  `rounded-lg`/`rounded-xl` mapeados a ese token, el cambio se propaga
  solo, sin tocar cada componente.
- **Íconos en círculo de color** (`IconBadge`, en `components/shared`):
  reemplaza los íconos grises sueltos junto a los títulos de tarjeta por
  un círculo de color sólido con sombra — Inicio, Herramientas y Ajustes.
  Da el efecto "sticker" de las referencias en vez de un ícono plano.

## ✅ Ronda 6 (11/10/2026): Agenda anual + 3 planificadores por nivel

La usuaria pidió una agenda anual mes por mes, y un planificador de tareas/
evaluaciones/TP/materiales/cumpleaños — pero uno distinto por nivel escolar
(principiante bien colorido, secundaria con una gama de colores, superior
similar pero con TP/parciales/finales). Se le preguntó si prefería un solo
planificador con selector de nivel, o tres herramientas separadas — y si la
vista anual debía ser una pestaña de la Agenda actual o una herramienta
aparte. En ambos casos eligió la opción **no recomendada**: tres
planificadores separados, y la agenda anual como herramienta
independiente. Se respetó esa decisión aunque implica algo más de código
repetido.

- **Modelo**: `TipoEvento` se amplió con `tarea`, `tp`, `parcial`, `final`
  (además de los ya existentes). Se agregaron 3 colecciones nuevas en
  LocalStorage (`planificador_principiante`, `planificador_secundaria`,
  `planificador_superior`) — cada planificador guarda sus propios eventos,
  sin mezclarse entre sí ni con la Agenda semanal original.
- **Componente reutilizable `PlanificadorSemanal`**: evita triplicar la
  página completa. Recibe qué tipos de evento mostrar, la paleta de color
  por día y los hooks de datos como props; cada una de las 3 páginas de
  nivel es un wrapper de ~20 líneas. La Agenda semanal original
  (`AgendaPage.tsx`) se dejó intacta a propósito, sin migrarla a este
  componente, para no arriesgar una regresión en algo que la usuaria ya vio
  y aprobó.
- **Principiante**: paleta arcoíris viva (la misma de la Agenda). **Secundaria**
  y **Superior**: paleta tonal de un solo color (`gamaTonal()`, un
  `color-mix` progresivo de blanco a color sobre `--color-secondary` y
  `--color-primary` respectivamente) — más sobria, pensada para adolescentes
  y jóvenes adultos en vez del arcoíris de los primeros años.
- **Superior** reemplaza "Evaluación" por tres tipos más específicos: TP,
  Parcial y Final (más Tarea, Material, Cumpleaños).
- **Agenda anual**: vista de 12 mini-calendarios (uno por mes), con
  navegación por año, punteado de color por evento en cada día y un panel
  inferior para ver/completar/borrar y agregar eventos del día
  seleccionado sin abrir un modal. **No es una colección de datos nueva**:
  muestra los mismos eventos de la Agenda semanal ya existente, solo que
  vistos mes por mes — una decisión deliberadamente distinta a la de los 3
  planificadores, porque acá sí es la misma información bajo otra vista.
- Acceso desde una sección nueva "Planificadores y agenda" en Herramientas.

**Bug encontrado y corregido antes de publicar**: en los planificadores de
Secundaria y Superior, los días con el tono más oscuro de la gama (viernes
a domingo) tenían el texto de la fecha y "Sin eventos" casi invisible —
estaban pensados para fondos claros y no se adaptaban al fondo oscuro del
propio día. Se agregó una marca `oscuro` a cada color de día y el texto
cambia a blanco cuando corresponde. Se verificó visualmente con capturas
de escritorio y mobile antes de confirmar que quedó legible en los 7 días.

## ✅ Ronda 7 (11/10/2026): contenido de "Etapas del estudio" + bug de navegación

La usuaria mandó una infografía de referencia de otra cuenta ("Psico
acompaña"), con 6 pasos concretos para pasar de leer un texto a tener un
resumen propio. Se le preguntó qué hacer con la imagen (no se pueden
replicar las ilustraciones de personajes dibujados a mano) y pidió
cambiar el contenido, no solo el estilo visual.

- El imprimible `/print/pasos-estudio` pasó de un recorrido genérico de
  6 pasos de estudio a los 6 pasos concretos de la referencia: **el tema,
  lectura global, dividir, subrayar, releer, el resumen** — mismo
  contenido pedagógico, reescrito con la voz de Método Estudio y
  conectado a las técnicas que ya existen en la Biblioteca (Lectura por
  capas, Idea principal, Resumen) en vez de inventar nombres nuevos.
- Visualmente, cada paso ahora tiene su propio color (de los 8 tokens de
  color por módulo ya existentes en el sistema de diseño, no colores
  nuevos) y un ícono propio junto al título, en vez de solo alternar
  entre dos colores.
- Se renombró a "Etapas del estudio" también en el botón de la sección
  Imprimibles de Biblioteca, para que coincida con el título de la
  página.

**Bug real encontrado al tocar este archivo (no buscado a propósito)**:
el botón "Volver" de este imprimible y del de "Guía de acentuación"
apuntaba a `/pro/biblioteca`, una ruta que quedó del esquema anterior
(profesional/estudiante) y que ya no existe desde el pivot del
10/10 — al tocarlo, caía al catch-all y mandaba a Inicio en silencio, sin
error visible. Se corrigió a `/biblioteca` en ambos archivos y se
verificó con Playwright que el click ahora aterriza en la página
correcta.

## ✅ Ronda 8 (11/10/2026): nivel Principiante simple y visual en Biblioteca y Actividades

La usuaria pidió verificar si el nivel Principiante (inicial) ya se veía tan
simple y visual como la nueva "Etapas del estudio" — la respuesta honesta
fue que no: las fichas de Biblioteca y las actividades de nivel 1 usaban el
mismo formato denso de texto que Medio y Superior, sin diferenciación
visual. Se confirmó el alcance con ella (acortar el texto real, no solo el
envoltorio) antes de tocar contenido pedagógico.

- **Biblioteca** (31 fichas de nivel 1, en las 7 rutas que tienen
  Principiante): cada una pasó de 3 bloques de texto ("Qué es / Para qué
  sirve / Cómo aplicarla") a una sola frase corta y directa, con ícono
  propio en un círculo del color de su ruta. Los 3 bloques originales se
  mantienen en el dato (`queEs`/`paraQue`/`comoAplicarla`) por si hacen
  falta más adelante, pero ya no se muestran para nivel 1 — Medio y
  Superior siguen con el formato completo, sin cambios.
- **Actividades** (11 actividades de nivel 1): se agregó el mismo ícono de
  color en la tarjeta del catálogo. El texto de `descripcion` ya era
  bastante corto, así que el cambio principal acá fue visual; `ejemplo` y
  `ejercicio` (el contenido práctico que ella pidió en una ronda anterior)
  no se tocaron, porque ahí sí hace falta el detalle.
- Se sumó un campo opcional `fraseSimple`/`icon` en `biblioteca.ts` y
  `icon` en `actividades.ts` (vía el tipo `ActividadCatalogo`), sin romper
  Medio/Superior ni el modal de detalle de Actividades.

## ✅ Ronda 9 (11/10/2026): Planificadores como solapa propia + tipos por nivel

La usuaria pidió sacar "Planificadores y agenda" de dentro de Herramientas
y darle su propia solapa en el menú principal, con sub-solapas por nivel
dentro. También pidió revisar los tipos de evento de cada nivel y colores
más distinguibles entre Secundaria y Superior. Se confirmaron por
AskUserQuestion los puntos ambiguos (nombres de sub-solapas, si
Secundaria/Superior suman o reemplazan sus tipos anteriores, si "Entregas"
es un tipo nuevo o lo mismo que TP) antes de tocar el modelo de datos.

- **Nueva solapa de nivel superior "Planificadores"** en el menú (antes
  vivía como una sección dentro de Herramientas). La página nueva
  (`PlanificadoresPage.tsx`) usa el componente `Tabs` de Radix (ya estaba
  en el sistema de diseño, sin usar hasta ahora) con 4 sub-solapas: **Nivel
  1, Nivel 2, Nivel 3 y Agenda anual** — cada una renderiza el componente
  ya existente correspondiente, sin duplicar código.
- **Tipos de evento revisados por nivel** (se agregó `trabajo_grupo` al
  modelo `TipoEvento`):
  - Nivel 1: Tarea, TP, Evaluación, Material, Cumpleaños, **Para no
    olvidar** (se sumaron TP y Nota).
  - Nivel 2: Tarea, TP, Evaluación, **Trabajo en grupo**, Material,
    Cumpleaños, Para no olvidar (se sumaron TP, Trabajo en grupo y Nota).
  - Nivel 3: TP, Parcial, Final, Material, Cumpleaños, Para no olvidar (se
    sacó Tarea, se sumó Nota; "Entregas" no se modeló aparte — queda
    cubierto por TP, como se confirmó).
- **Colores más distinguibles**: Nivel 2 pasó de una gama gris-azulada a
  una gama **verde agua** (`--color-mod-atencion`, ya existía en el
  sistema de diseño) y Nivel 3 a una gama **celeste**
  (`--color-dia-mar-strong`, el mismo celeste de "martes" en la Agenda) —
  ambos tokens ya existían, no se inventaron colores nuevos.
- Se sacó la sección "Planificadores y agenda" de Herramientas para no
  duplicar el acceso.

## ✅ Ronda 10 (11/10/2026): auditoría de cobertura + exposición oral y precisión en consignas

La usuaria preguntó, en términos generales, si la app cubre memorizar,
aprender, exponer oralmente, concentrarse en consignas y "responder
asertivamente". Antes de escribir nada se hizo una auditoría real del
contenido existente (no una opinión al aire) comparando los 60 técnicas de
Biblioteca y 30 actividades contra esos 4 ejes. Resultado:

- **Memorizar/aprender**: bien cubierto (repetición espaciada, recuperación
  activa, flashcards, mapas conceptuales, intercalado) — no se tocó.
- **Concentrarse en consignas**: las técnicas ya eran buenas ("Verbo de la
  consigna", "Identificar condiciones") pero no había ninguna actividad
  práctica que las ejercitara.
- **Exponer oralmente**: gap real — lo único que existía era sobre el
  miedo a hablar en público, nada sobre cómo armar y dar una exposición.
- **"Responder asertivamente"**: se le preguntó qué quiso decir exactamente
  (el término es ambiguo) — aclaró que se refería a identificar con
  precisión qué pide la consigna y responder exactamente eso, no a
  asertividad interpersonal. Se trató como una extensión del punto
  anterior, no como un eje aparte.

**Contenido nuevo agregado** (4 técnicas + 3 actividades, todas con ícono
y color siguiendo el patrón de nivel 1 de la ronda 8):

- *Comprender consignas y textos*: técnica "Responder exactamente lo que
  piden" + actividad "Marcar la consigna antes de responder".
- *Escribir para comunicar*: técnicas "Guión de una exposición" y
  "Tarjetas de apoyo para exponer" (nivel 1), "Practicar en voz alta y
  cronometrado" (nivel 2) + actividades "Armar el guión de tu exposición"
  (nivel 1) y "Ensayo cronometrado frente al espejo" (nivel 2).

No se creó ninguna ruta ni dimensión nueva — todo el contenido entra en
las 8 rutas ya existentes, para no romper el vínculo con las 8 dimensiones
del autoperfil del Documento Maestro.

## ✅ Ronda 11 (11/10/2026): 3 herramientas nuevas a partir de referencias visuales

La usuaria mandó capturas de otro producto ("MIO Planners") con 3 ideas:
un gráfico circular de distribución del día, una guía de seguimiento de
textos y un horario de cursada. Se evaluó dónde encajaba cada una y se
confirmó alcance antes de construir — las 3 se agregaron como tarjetas
nuevas en Herramientas (ya son 7):

- **Guía de textos** (`GuiaTextosPage.tsx`): lista de lecturas con 3
  casilleros por texto (Leído / Subrayado / Resumido) que se togglean con
  un clic. Conecta directo con "Etapas del estudio" de una ronda
  anterior: ahora esos pasos se pueden trackear, no solo leer. Usa el
  mismo patrón Repository que Fichas/Actividades (`db.textosGuia`).
- **Horario de cursada** (`HorarioCursadaPage.tsx`): grilla fija Lunes a
  Viernes, 7:00 a 19:00, con celdas editables y un campo de notas —
  deliberadamente separado de la Agenda, que es para eventos puntuales,
  no para el horario fijo de clases. Es un documento único persistido
  con Zustand (`me:horario_cursada`), no una lista de eventos.
- **Distribución de actividades** (`DistribucionActividadesPage.tsx`):
  4 sliders (Estudio/Descanso/Pendientes/Recreación) con un gráfico de
  dona en vivo hecho con `conic-gradient` de CSS puro (sin librería de
  gráficos nueva) — mejora la versión en papel del original porque
  actualiza en tiempo real y avisa cuánto falta o sobra para llegar al
  100%.

Las 3 quedan en `db`/stores nuevos, sin tocar ningún modelo existente.
Verificado con capturas en desktop y mobile, sin errores de consola.

## ✅ Ronda 12 (11/10/2026): portada reconstruida en código (ya no imagen)

La usuaria mandó una captura de la pantalla de bienvenida (la "portada")
mostrando que el lema todavía decía "Evaluar · Comprender · Intervenir" —
lenguaje clínico del enfoque profesional previo al pivot, y pidió
reformularlo para estudiantes, además de más color y profundidad.

- Se descubrió que esa portada no era texto editable: era una imagen
  (`logo-completo.webp`) que la propia usuaria había subido al principio
  del proyecto, con el lema "quemado" en los píxeles — no se podía tocar
  con código.
- Se reconstruyó `BrandCover` (en `branding/Logo.tsx`) completamente en
  HTML/CSS, usando el sistema de diseño ya existente, en vez de la
  imagen. El isotipo chico de la sidebar/pestaña no se tocó (ese no
  tenía texto desactualizado).
- Lema nuevo: **"Conocé · Practicá · Mejorá"**, en segunda persona
  (vos), acorde al resto de la app. Las etiquetas Perfil/Estrategias/
  Seguimiento se mantuvieron — ya mapean bien a Autoperfil/Biblioteca/
  Mi progreso, no hacía falta cambiarlas.
- Los 3 círculos pasaron de gris-navy plano a colores vivos con
  gradiente y sombra propia (terracota, verde agua, violeta — todos
  tokens ya existentes), y el lema reemplazó el gris por el acento
  terracota en negrita. Verificado en claro, oscuro, con input vacío y
  con nombre cargado — el flujo de "Empezar" sigue funcionando igual.

## ✅ Ronda 13 (11/10/2026): bug reportado — "no puedo visualizar la portada"

La usuaria reportó que no podía ver la pantalla de bienvenida (la portada
rediseñada en la ronda 12).

- Diagnóstico: la portada (`Bienvenida`, dentro de `InicioPage.tsx`) solo se
  muestra cuando `usePerfilStore().nombre` está vacío. Como ella ya había
  guardado un nombre probando la app en rondas anteriores, el navegador
  nunca volvía a mostrársela — queda guardada en `localStorage` (clave
  `me:perfil`) y persiste entre visitas a la misma URL.
- Se verificó con capturas (escritorio y mobile, localStorage limpio) que la
  portada en sí renderiza bien, sin bugs visuales ni errores de consola —
  el problema no era de diseño, era de que no se podía *llegar* a verla.
- Se confirmó que `driver.ts` → `clearAll()` (usado por "Ajustes → Borrar
  todos mis datos") sí borra la clave `me:perfil` (borra toda clave que
  empiece con `me:`), así que ese botón técnicamente la hacía reaparecer —
  pero de forma destructiva, borrando también autoperfil, actividades,
  fichas, mapas y diario solo para ver una pantalla.
- Se agregó una forma no destructiva: un botón **"Ver pantalla de
  bienvenida"** en Ajustes → Tu nombre, que lleva a una ruta nueva
  (`/#/bienvenida`) con la misma portada y un link para volver. No toca el
  nombre guardado ni ningún otro dato — se puede visitar las veces que
  haga falta.
- Verificado con Playwright: el botón aparece en Ajustes, al cliquearlo
  muestra la portada completa, y el nombre guardado sigue intacto en
  localStorage después de visitarla y volver. Sin errores de consola.
- De paso se encontró y corrigió un problema de build no relacionado: el
  `@import` de `@fontsource` traía las variantes cirílico/griego/vietnamita
  de IBM Plex (68 archivos de fuente, ~830 KB), aunque la app es 100% en
  español. Se cambió a los imports `latin-*.css`/`latin-ext-*.css` de cada
  peso, que son los únicos que se usan — bajó el precache de la PWA de 147
  a 103 entradas (2100 KiB → 1681 KiB). Verificado visualmente que las
  tipografías se siguen viendo igual.

## ✅ Ronda 14 (11/10/2026): seguimiento familiar de actividades

La usuaria preguntó si existe la posibilidad de "ir marcando las
actividades que fueron realizando", para que una familia lleve el
seguimiento de su hijo respecto al estudio y las técnicas que usó.

- Antes de tocar código se auditó lo que ya existía: `ActividadProbada` ya
  tenía `estado` (pendiente/en_curso/completada), `fechaInicio`,
  `fechaCompletada`, `calificacion` y `nota`; "Mi progreso" ya mostraba
  racha, minutos de estudio, insignias, calendario de hábito y actividades
  completadas por ruta. Es decir, la base ya estaba — el pedido no era
  "agregar tracking" sino hacerlo legible para una familia.
- Se confirmó con la usuaria el escenario real antes de construir nada
  (AskUserQuestion): la familia mira el mismo dispositivo que el
  estudiante (no hay pedido de ver desde otro dispositivo — eso hubiera
  requerido backend/cuentas, un cambio de arquitectura grande que no se
  justificaba acá), y quiere ver un checklist simple de actividades, más
  la racha/insignias y el tiempo de estudio que ya existían.
- Se agregó una tarjeta nueva **"Qué fue haciendo"** en "Mi progreso",
  arriba de Insignias: lista cronológica (más reciente primero) de todas
  las actividades probadas, con ícono de check/círculo según estado,
  título, ruta, fecha de completada (o "en curso desde...") y calificación
  en estrellas si la tiene. Es de solo lectura — administrar/marcar sigue
  haciéndose desde Actividades, esta vista es para repasar juntos.
- Verificado con Playwright (datos de prueba sembrados en localStorage,
  escritorio y mobile): ordena bien por fecha, sin errores de consola.

## ✅ Ronda 15 (11/10/2026): tilde de un toque en el catálogo de Actividades

La usuaria aclaró la ronda anterior: no pedía vincular el cronómetro,
sino un botón tipo tilde en cada actividad para marcar el desempeño
rápido, visible para el estudiante y su familia.

- Se encontró que el único checkmark tocable ya existente vivía en "Mis
  actividades" (la lista de las ya empezadas) — el Catálogo (donde se
  explora y elige qué probar) solo mostraba una etiqueta de texto
  ("Completada ✓" / "En curso"), sin ningún control: había que abrir el
  diálogo de detalle, tocar "Empezar a probarla", volver a entrar y
  calificarla para que quedara marcada. Eso es justo lo contrario de
  "rápido".
- Se agregó un ícono de tilde/círculo tocable en cada tarjeta del
  Catálogo, aparte del área que abre el detalle. Un toque alcanza:
  si la actividad no se había probado, la crea y la marca completada en
  el mismo gesto; si ya estaba completada, un segundo toque la vuelve a
  "en curso" (deshacer). La calificación con estrellas sigue existiendo
  pero ahora es opcional — se agrega abriendo el detalle, no se fuerza
  en cada marca.
- Se alineó el mismo comportamiento en "Mis actividades": antes, tocar el
  círculo abría el diálogo de calificar; ahora alterna directo, igual que
  en el Catálogo, para que el gesto sea consistente en toda la página.
- Verificado con Playwright (escritorio y mobile): un toque crea y
  completa la actividad, actualiza la racha, no choca con el botón de
  abrir detalle, sin errores de consola.

## 🔜 Backlog

1. Modelo de monetización: hoy no hay pago ni backend. Si se decide cobrar,
   evaluar aparte (no reusar el backend multi-profesional abandonado, que
   asumía un modelo de negocio distinto).
2. Generación de fichas/preguntas con IA a partir de un archivo propio —
   evaluado y descartado por ahora: requeriría backend o que cada persona
   traiga su propia API key (como hace Método Brújula). Queda para cuando
   haya definición de monetización.

## Decisiones técnicas clave (no revertir sin razón)

- **Sin backend, sin cuentas**: todo LocalStorage, un dispositivo = una
  persona. Decisión explícita del pivot (10/10/2026) — no reintroducir
  roles ni multi-tenant sin una conversación nueva sobre el modelo de
  negocio.
- **HashRouter** y `base: './'`: hosting estático sin config de servidor,
  igual que antes.
- **Contenido versionado en código** (`data/`): forma parte del método y se
  edita con revisión, no desde la UI.
- **Repository/StorageDriver genéricos** (`services/storage/`): se
  mantienen sin cambios — si en el futuro se decide sumar backend, la
  costura ya existe (ver código de Método Brújula o el PR #143 abandonado
  como referencia de cómo se hizo ahí).

## Deploy

`npm run deploy` compila y copia el resultado a `../metodo-estudio/`
(carpeta publicada en el sitio). HashRouter + `base: './'` permiten
desplegarlo en cualquier subruta de hosting estático.
