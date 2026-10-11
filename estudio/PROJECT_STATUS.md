# Método Estudio — Estado del proyecto

> Fecha: 2026-10-11 (actualizado, ronda 6) · Rama: `claude/mini-app-metodo-estudio`

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
