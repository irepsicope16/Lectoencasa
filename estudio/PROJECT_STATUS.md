# Método Estudio — Estado del proyecto

> Fecha: 2026-09-15 · Rama: `claude/nueva-plataforma-profesional-wtaimt`
> Fuente funcional: Documento Maestro V1 (Lic. Irene Morbidelli, set. 2026).

## Resumen ejecutivo

Primer prototipo funcional del **flujo core** de Método Estudio (React 19 +
Vite + TypeScript estricto + Tailwind v4), arquitectura melliza a Método
Brújula pero **plataforma independiente** (carpeta, login y storage propios,
sin compartir datos con Brújula — decisión explícita del 13/09/2026).

Cubre el flujo core del documento maestro (§18, pasos 1-7 y 9): datos y
permisos, alta y entrevista, autoperfil y guardado, cálculo por
dimensiones, integración profesional, prioridades, plan y seguimiento de
sesiones. Suma además, a pedido explícito, gestión de consultorio a la par
de Método Brújula (agenda, honorarios) y el **portal del estudiante**
(paso 8) con cuenta de acceso automática. **Queda fuera** de esta etapa el
informe exportable (paso 10) — ver backlog.

## ✅ Completamente terminado

### Núcleo y arquitectura
- Modelo de dominio completo (`src/types/index.ts`), fiel al Documento
  Maestro: User (rol `profesional`/`estudiante`), Student, Intake,
  QuestionnaireResponse, DimensionSnapshot, Alert, PriorityDecision, Goal,
  Session, CalendarEvent.
- Persistencia con patrón repositorio (`services/storage/`), igual al de
  Método Brújula: API async sobre LocalStorage, migrable a un backend real
  sin tocar la UI.
- TanStack Query como única puerta de datos (`hooks/queries.ts`).
- Seed con un caso ficticio completo y narrativamente coherente (Camila
  Sosa, 14 años): entrevista + referente, 56 respuestas de autoperfil,
  integración calculada, alerta lectora activada, prioridades y plan.

### Contenido clínico (versionado en código, `data/`)
- 56 ítems de las 8 dimensiones (tablas 4-11 del documento), con su clave
  recurso/dificultad.
- Módulo de antecedentes e indicadores lectores L1-L10 (tabla 12) + regla
  clínica de alerta (persistencia + impacto actual + multi-contexto).
- 6 preguntas abiertas obligatorias del autoperfil.
- 8 rutas con herramientas iniciales (tabla 18) — biblioteca compacta para
  vincular al plan.
- Mensajes obligatorios de interfaz (Anexo C).

### Motor de cálculo (`features/engine/estudioEngine.ts`, puro, sin React)
- Cálculo por dimensión: inversión de ítems de recurso, exclusión de "No
  aplica" del denominador, umbral de completitud del 70%, bandas de
  necesidad (tabla 15).
- Nivel de confianza por convergencia de fuentes (tabla 16): autoinforme,
  referente, observación profesional (marcada explícitamente por la
  profesional en Integración).
- Puntaje de prioridad orientativo (tabla 17): necesidad declarada +
  impacto + frecuencia multi-contexto + interés + urgencia. Nunca asigna
  solo — la profesional confirma, reordena o descarta.

### Pantallas (P01-P04, P06, P08, P09, P11 del mapa de pantallas)
- Dashboard profesional: estudiantes recientes, alertas abiertas.
- CRUD de estudiantes con consentimiento (adulto responsable / propio).
- Ficha del estudiante con pestañas: Entrevista (+ indicadores lectores si
  12-15 años), Autoperfil (una dimensión por pantalla, progreso, pausa y
  reanudación), Integración (fortalezas/áreas a fortalecer, alerta lectora
  con evidencia y resolución documentada, switch de convergencia
  profesional), Prioridades (edición de los 5 criterios de la tabla 17),
  Plan (objetivos observables vinculados a herramientas de las rutas).

### Calidad
- Dark/light mode sin flash. Aviso orientativo obligatorio visible en los
  pasos clínicos clave.

## ✅ Identidad visual definitiva (14/09/2026)

Reemplaza la propuesta provisoria "Fichero" (13/09/2026) por el isotipo y la
paleta que trajo la usuaria — logo real, no una propuesta de Claude:

- **Isotipo**: la "E" de Método Estudio (barra roja + tres píldoras
  perfil/estrategias/seguimiento), provisto en dos archivos
  (`src/assets/branding/logo-completo.webp` para uso grande — portada, login
  — e `icon-mark.png`, un recorte cuadrado del isotipo solo, para sidebar y
  favicon). Componentes en `src/branding/Logo.tsx`: `Isotipo`,
  `LogoHorizontal`, `BrandCover`.
- **Paleta**, muestreada por color directamente del logo (`src/index.css`):
  `--primary` azul-marino #223346 (bordes/tinta del isotipo, color dominante
  → botón principal), `--accent` rojo #ab5246 (la barra vertical y el
  subrayado → botón de énfasis, áreas a fortalecer), `--secondary` azul
  acero #5e7688 (píldora "Estrategias" → tercer color de botón/badge, nuevo
  token agregado a los componentes de UI). `--danger` se mantuvo distinto
  del rojo de marca para no confundir alerta con botón de marca.
- **Jerarquía tipográfica reforzada**: títulos de página, de tarjeta y
  valores de estadística ahora más grandes (Source Serif 4), a pedido
  explícito de la usuaria.
- Se sacó la ilustración de escritorio dibujada a mano (`HeroIllustration.tsx`,
  ya no existe): la portada ahora usa el logo real de la usuaria como imagen
  principal, no una ilustración generada.

## ✅ Portada pública y modelo de acceso (definidos el 13/09/2026)

- **Acceso cerrado, confirmado**: la profesional da de alta cada cuenta a
  mano después de coordinar el pago — no hay ni habrá autoregistro público
  por ahora. No se construyó formulario de registro (no hace falta).
- **Portada pública** en `/` (`src/features/home/LandingPage.tsx`): hero con
  copy real del método, el logo como imagen principal, tres pasos del
  proceso (entrevista → autoperfil → plan), aviso orientativo obligatorio y
  botón "Solicitar acceso" por WhatsApp. `/login` sigue existiendo para quien
  ya tiene cuenta.
  - El botón de WhatsApp reusa el mismo número que ya tiene Brújula en su
    sidebar (5492216185376), con un mensaje adaptado — confirmado
    explícitamente por la usuaria el 14/09/2026.

## ✅ Ficha consolidada, agenda, honorarios y portal del estudiante (14/09/2026)

A pedido explícito: paridad de gestión de consultorio con Método Brújula.

- **Pestaña Resumen** (primera pestaña de la ficha, `tabs/ResumenTab.tsx`):
  datos del estudiante, estado del proceso (entrevista/autoperfil/
  integración/plan de un vistazo, con barra de progreso del autoperfil),
  alerta abierta destacada, fortalezas/áreas a fortalecer y plan activo —
  todo junto, sin tener que recorrer las otras pestañas.
- **Sesiones** (`tabs/SessionsTab.tsx` + tipo `Session`): registro de
  sesiones con modalidad, estado, notas, próximos pasos y honorario
  opcional. Nueva pestaña en la ficha del estudiante.
- **Agenda** (`features/agenda/AgendaPage.tsx`, ruta `/pro/agenda`):
  calendario mensual con sesiones y recordatorios (tipo `CalendarEvent`),
  detalle del día seleccionado, alta rápida de recordatorio/tarea
  vinculado o no a un estudiante.
- **Honorarios** (`features/agenda/HonorariosPage.tsx`, ruta
  `/pro/honorarios`): todas las sesiones con monto registrado, filtro por
  mes, totales cobrado/pendiente, marcar cobrada/pendiente en un clic.
  Honorarios y Agenda no están en el Documento Maestro clínico — son
  gestión de consultorio, agregadas por paridad con Brújula.
- **Portal del estudiante** (rol `estudiante`, rutas `/mi`): al crear un
  estudiante con un email de contacto se genera automáticamente su cuenta
  de acceso (`features/auth/accounts.ts`, `ensureStudentAccount` — mismo
  patrón que `ensureConsultantAccount` de Brújula) y la profesional ve las
  credenciales una sola vez en un diálogo con botón de copiar. El estudiante
  entra a `/mi` (`features/dashboard/MyDashboard.tsx`) y ve: el aviso no
  clínico (`MENSAJES.resultadoEstudiante`), su propio autoperfil si no lo
  completó (reutiliza `AutoperfilTab`, el mismo componente que usa la
  profesional), y su plan activo en lenguaje llano (sin códigos de
  dimensión ni jerga clínica).
  - **Sigue siendo acceso cerrado**: la cuenta la genera la profesional al
    cargar la ficha, nunca un autoregistro público — mismo criterio que la
    decisión del 13/09/2026 sobre cuentas profesionales.
  - Refactor de `Professional` a `User` con `role` unificado
    (`profesional`/`estudiante`) en `types/index.ts`, `services/storage/db.ts`
    (colección `users`), `stores/authStore.ts` y `features/auth/guards.tsx`
    (`RequireRole`), igual que en Brújula.
  - `AppShell`/`Sidebar` ahora reciben `role` y muestran nav distinto por rol.

## ✅ Evaluación, Ajustes y revisión de navegación (14/09/2026)

A pedido explícito: completar lo que faltaba copiar de Método Brújula del
lado profesional, y una pestaña nueva para subir instrumentos antes del plan.

- **Pestaña Evaluación** (`tabs/EvaluacionTab.tsx`, nueva pestaña en la ficha
  del estudiante, entre Integración y Prioridades): subida de screenings,
  tests u otros documentos de evaluación por estudiante, con tipo
  (screening/test/otro), tope de 700KB por archivo en esta versión
  LocalStorage (igual que `FilesTab.tsx` de Brújula), descarga y borrado.
  Si un archivo pesa más del máximo, se guarda la referencia (nombre, peso,
  tipo) pero no el contenido, con aviso explícito. Nuevo tipo `StoredFile`
  (`types/index.ts`) y colección `db.files` (con cascada al borrar un
  estudiante).
- **Página Ajustes** (`features/settings/SettingsPage.tsx`, ruta
  `/pro/ajustes`, nuevo ítem en el menú lateral): perfil profesional
  editable (nombre, apellido, título), tema claro/oscuro/sistema, y datos
  (exportar/importar copia de seguridad en JSON, restablecer a los datos de
  demostración con confirmación). Mismo patrón que la de Brújula, sin los
  paneles de nube/IA que no existen en Método Estudio. Nuevo
  `updateProfile` en `stores/authStore.ts`, `services/storage/backup.ts` y
  `resetDemoData()` en `data/seed.ts`.
- **Navegación revisada**: el menú lateral ahora muestra los cinco destinos
  del rol profesional (Inicio, Estudiantes, Agenda, Honorarios, Ajustes)
  siempre con ícono y etiqueta visibles, sin colapsar — se verificó que no
  falte ningún botón para moverse dentro de la plataforma. No se copiaron
  de Brújula la Biblioteca, el Método ni Estadísticas porque no forman
  parte del alcance acordado (flujo core) — quedan en el backlog si se
  decide sumarlas.

## ✅ Biblioteca de herramientas y soporte por WhatsApp (14/09/2026)

A pedido explícito: sumar lo que faltaba para la paridad de navegación con
Método Brújula (menos Estadísticas, fuera de alcance por ahora).

- **Biblioteca** (`features/biblioteca/BibliotecaPage.tsx`, ruta
  `/pro/biblioteca`, segundo ítem del menú): una ficha (qué es / para qué
  sirve / cómo aplicarla) por cada una de las 56 herramientas de las 8 rutas
  de la tabla 18 (se sumó "Mapas conceptuales" en Aprender y recordar),
  agrupadas por ruta con sus dimensiones. A diferencia de la Biblioteca de
  Brújula (fichas de bibliografía de orientación vocacional, con PDFs que la
  usuaria fue enviando), esta es contenido nuevo redactado a partir de los
  fundamentos del documento (`data/biblioteca.ts`) — no hay bibliografía
  externa que cargar todavía. Queda pendiente, si se quiere más adelante,
  sumar el resto de los campos de la "ficha de actividad" completa del
  Anexo A (población, modalidad, duración, materiales, consigna, variantes,
  precauciones) — hoy solo se cubren los tres primeros.
- **Nivel de complejidad (14/09/2026, a pedido explícito)**: cada
  herramienta suma un `nivel` 1 (inicial), 2 (medio) o 3 (avanzado) —
  independiente de la edad, porque un estudiante de nivel superior puede
  necesitar arrancar por el Nivel 1. La Biblioteca tiene un filtro por
  nivel. **Es un primer borrador mío a revisar**: asigné los 56 niveles con
  criterio general de complejidad, no es una escala validada ni una
  decisión clínica tomada por la plataforma — Irene puede pedir que se
  ajuste cualquier herramienta editando `data/biblioteca.ts`. Con el criterio
  actual, el Nivel 3 quedó concentrado casi todo en la ruta "Construir
  autonomía" (elección de estrategias, transferencia, plan personal,
  reducción de ayudas) — vale la pena revisar si eso refleja la intención
  real o si otras herramientas de otras rutas también deberían subir de
  nivel para usos más universitarios. Todavía no hay un campo de "nivel
  actual" en la ficha del estudiante ni una sugerencia automática de nivel
  de partida — el profesional elige el nivel a mostrar/usar por su cuenta.
- **Soporte por WhatsApp**: botón en el pie del menú lateral profesional,
  mismo número que Brújula (5492216185376) con un mensaje adaptado a
  Método Estudio — confirmado explícitamente por la usuaria.

## ✅ Actividades por sesión, videos e imprimibles (14/09/2026)

A pedido explícito, a partir de material que la usuaria compartió (técnicas
de estudio de distintos autores/plataformas y un método comercial) —
reformulado con redacción propia, nunca copiado, por tratarse de material de
terceros con derechos de autor explícitos en varios casos.

- **Catálogo de actividades** (`data/actividades.ts`, tipo `ActividadCatalogo`):
  26 actividades concretas (con consigna, no solo descripción de técnica)
  repartidas en las 8 rutas y los 3 niveles ya definidos en la Biblioteca.
- **Pestaña Actividades** (`features/students/tabs/ActividadesTab.tsx`,
  nueva pestaña en la ficha del estudiante, entre Plan y Sesiones): permite
  asignar cualquier actividad del catálogo a una **sesión puntual del
  estudiante** (o dejarla sin sesión) y marcarla pendiente/completada.
  A diferencia de Método Brújula, donde la actividad y la sesión no se
  conectan, acá sí — colección `db.asignaciones` (tipo `ActividadAsignada`),
  con cascada al borrar el estudiante.
- **Videos sugeridos** (`data/videos.ts`, tipo `RecursoVideo`): 3 links
  reales de YouTube, verificados y aprobados por la usuaria, mostrados como
  tarjeta con link externo dentro de la sección de la ruta correspondiente
  en la Biblioteca — igual patrón que Método Brújula (no se incrustan).
- **Imprimibles** (`features/print/`, rutas públicas `/print/acentuacion` y
  `/print/pasos-estudio`): páginas HTML con una plantilla en blanco y un
  botón "Imprimir" que llama a `window.print()` del navegador — mismo
  mecanismo que Método Brújula (sin librería de PDF). Accesibles desde un
  apartado nuevo al pie de la Biblioteca. La "Guía de acentuación" surge de
  una idea de la usuaria (regla de tildación); "Pasos para estudiar" es una
  secuencia propia armada con herramientas que ya existían en la Biblioteca
  (Rutina de inicio → Lectura por capas → Idea principal → Resumen/Mapas
  conceptuales → Recuperación activa → Explicación con propias palabras).
- Antes de construir todo esto, se armó y aprobó una vista previa como
  Artifact (borrador visual + contenido) — quedó como referencia de estilo
  para futuros imprimibles.

## ✅ Recorrido por niveles (14/09/2026)

A pedido explícito: una forma de navegar por Nivel 1/2/3 que una en un solo
lugar la evaluación inicial y el contenido de la Biblioteca/Actividades,
sin tocar el resto de la navegación existente (decisión tomada junto con la
usuaria: vista nueva, no reemplazo de las pestañas actuales).

- **Pestaña Recorrido** (`features/students/tabs/RecorridoTab.tsx`, nueva
  primera pestaña adicional en la ficha del estudiante, junto a Resumen):
  3 botones grandes Nivel 1/2/3, con la etiqueta de cada uno en las propias
  palabras de la usuaria ("Arranque", "Secundario", "Ingreso a la
  universidad"). El botón **Nivel 1** muestra el estado de la Entrevista, el
  Autoperfil y la Evaluación (completo/pendiente, con conteo) y al tocarlos
  saltan directo a esa pestaña — para esto las pestañas de la ficha pasaron
  a ser controladas (`useState` en `StudentDetailPage.tsx` en vez de
  `defaultValue`). Los tres niveles muestran, agrupadas por ruta, las
  fichas de la Biblioteca y las actividades del catálogo de ese nivel, con
  la misma tarjeta de asignar-a-sesión que la pestaña Actividades
  (extraída a `features/students/shared/CatalogoActividadCard.tsx` para no
  duplicar la lógica).
- **Portal del estudiante** (`features/dashboard/MyDashboard.tsx`): mismos
  3 botones de nivel, versión simplificada — Nivel 1 muestra el estado del
  propio autoperfil, y cada nivel lista las actividades que la profesional
  le asignó de ese nivel (solo lectura: marcar completada sigue siendo
  una acción de la profesional, no del estudiante, por ahora).
- **Importante, para no perder de vista**: la entrevista y el autoperfil
  siguen siendo un proceso fijo que cada estudiante hace una sola vez al
  principio — no son "contenido de nivel 1" que se repite o se filtra.
  El Recorrido los muestra ahí por conveniencia de navegación, pero
  Integración, Prioridades y Plan (que son criterio profesional, no
  contenido catalogable) deliberadamente no se movieron a esta vista de
  niveles.

## ✅ Color por módulo + navegación destacada (14/09/2026)

A pedido explícito: identificar cada ruta con un color propio en sus
fichas ("como una sombra, como desplegado") y destacar con rojo los
botones de navegación (sidebar y pestañas). Propuesto primero como
Artifact y aprobado por la usuaria antes de tocar código.

- **Tokens de color por módulo** (`src/index.css`, `:root`/`.dark`/`@theme
  inline`): 8 rutas → 8 colores distintos, cada uno con una variante
  "soft" para el fondo. 3 reutilizan tokens de marca ya existentes
  (secundario → Comprender, acento → Prepararse y evaluarse, primario →
  Construir autonomía); los otros 5 son nuevos (ámbar → Organizar, verde
  azulado → Sostener la atención, ciruela → Escribir, índigo → Aprender y
  recordar, verde bosque → Regular y persistir), definidos para modo claro
  y oscuro.
- **`src/lib/moduleColors.ts`** (nuevo): `RUTA_COLOR` (mapa ruta→color) y
  `moduleCardStyle(rutaId)`, que arma el estilo de borde superior +
  sombra + fondo tintado de una ficha según su ruta.
- Aplicado en **Biblioteca** (fichas + ícono del encabezado de cada
  ruta), **Recorrido** (fichas fijas y tarjetas de actividad de cada
  nivel) y **Actividades** (fichas del catálogo + borde izquierdo
  coloreado en la lista de asignadas). Deliberadamente **separado** del
  sistema de color por Nivel (badges): son dos dimensiones distintas y no
  se mezclan en una misma tarjeta.
- **Navegación destacada**: el ítem activo del sidebar (`Sidebar.tsx`) y
  la pestaña activa (`components/ui/tabs.tsx`) pasan a fondo rojo/terracota
  sólido (`--accent`) con texto claro y una sombra elevada, en vez del
  resaltado gris sutil anterior — mismo criterio en toda la app.

## ✅ Backend multi-profesional con Supabase (15/09/2026) — verificado en vivo

A pedido explícito para poder comercializar la plataforma a varias profesionales, igual
que Método Brújula. Se portó el mismo patrón ya probado en producción en Brújula, adaptado
al modelo de datos propio de Estudio. **Proyecto de Supabase propio y separado del de
Brújula** — ninguna tabla ni dato se comparte entre las dos plataformas.

- **Capa de nube** (`services/cloud/{client,config,migrate}.ts`,
  `services/storage/supabaseRepository.ts`): igual contrato que el repositorio local — la
  UI no distingue entre LocalStorage y Supabase. `db.ts` elige uno u otro por colección
  según `isCloudEnabled()`.
- **Esquema y seguridad** (`supabase/schema.sql`, nuevo): tabla `students` como raíz
  (aislada por `professionalId`) y 11 tablas hijas con Row Level Security. El acceso del
  **estudiante** se calibró tabla por tabla según lo que el portal (`MyDashboard.tsx`)
  realmente lee o escribe — nunca en bloque: autoperfil (`questionnaire_responses`,
  `open_answers`) con lectura y escritura; objetivos (`goals`) y actividades asignadas
  (`asignaciones`) de solo lectura; entrevista con notas privadas, alertas, prioridades,
  agenda y archivos de evaluación sin ningún acceso desde el rol estudiante, ni siquiera
  lectura.
- **Autenticación real** (`stores/authStore.ts`): Supabase Auth reemplaza la contraseña en
  texto plano de LocalStorage cuando la nube está activa — incluye recuperación de
  contraseña por email (`features/auth/ForgotPasswordPage.tsx`), que resuelve el problema
  concreto de esta semana con una contraseña mal dictada por WhatsApp.
- **Alta de profesionales**: `/registro` (autoregistro público, cuenta creada pero con
  membresía "pendiente"), `lib/membership.ts` (misma dueña de plataforma que Brújula,
  `irenemorbidelli@gmail.com`, sin cobro automático — se activa manualmente),
  `/pro/profesionales` (panel de administración: renovar 1 año o cortar acceso, solo
  visible para la dueña), `MembershipExpiredPage.tsx` (pantalla de acceso pausado sin
  perder datos).
- **Ajustes → tarjeta Nube**: conectar el proyecto de Supabase, activarlo, crear la cuenta
  profesional real y migrar los datos locales — solo visible para la dueña de la
  plataforma.
- **Guía paso a paso**: `SUPABASE.md`, adaptada de la de Brújula.

### Verificación en vivo (15/09/2026)

La usuaria creó su propio proyecto de Supabase (`metodo-estudio`, región São Paulo) y
corrió `schema.sql` ahí. Como el entorno de desarrollo no tiene salida de red hacia
proyectos externos de Supabase, la verificación se hizo directamente desde el Editor SQL
del proyecto, usando la técnica estándar de Supabase para simular ser un usuario
autenticado distinto (`set_config('request.jwt.claims', ...)` + `set local role
authenticated`) — sin exponer ninguna clave secreta en ningún momento. Con dos cuentas de
prueba (profesional A y B, luego borradas):

1. **Aislamiento entre profesionales**: A crea una estudiante de prueba y la ve
   correctamente; B, intentando leer esa misma tabla, obtiene **0 filas** — no puede verla.
2. **Escritura bloqueada entre profesionales**: B intenta modificar el nombre de la
   estudiante de A (`UPDATE ... SET nombre = 'Hackeado'`) — la fila sigue intacta, sin
   cambios.
3. **Corte de membresía a nivel de base de datos**: con la membresía de A vencida
   manualmente, A deja de poder leer incluso sus propios datos (no es un chequeo que
   dependa solo de la pantalla de la app).

Las tres pruebas pasaron. Los datos y usuarios de prueba se borraron al terminar.

**Pendiente, no urgente**: verificar de la misma forma los límites de acceso del rol
estudiante (autoperfil propio sí, entrevista/alertas/prioridades no) — quedó fuera de esta
ronda por tiempo, pero la política ya está escrita y calibrada en `schema.sql` siguiendo
el mismo criterio que las tres pruebas de arriba. Antes de comercializar a muchas
profesionales, conviene correrla también.

Hasta que se hornee `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` en el build de producción
(`SUPABASE.md`, Paso 7) y se publique, la plataforma sigue funcionando en modo 100% local
para cualquier visitante — nada de esto cambia el comportamiento por defecto todavía.

## 🟡 Decisiones pendientes (explícitas en el documento, §17 — no resueltas por el desarrollo)

- Nombre comercial definitivo y disponibilidad marcaria (se usó "Método
  Estudio", el nombre de trabajo del documento).
- Qué profesiones podrán registrarse y permisos por rol (hoy: un solo rol
  profesional; sin registro público ni multi-profesional).
- Países de lanzamiento y requisitos legales específicos.
- Versión adolescente vs. educación superior: mismos ítems o redacción
  diferenciada (hoy: mismos 56 ítems para todos los niveles).
- Modelo comercial, duración de acceso y soporte.

## 🔜 Backlog priorizado (pasos 8-10 del documento + mejoras técnicas)

1. **Tareas breves de desempeño** (§6, tabla 13): batería T1-T8 con escala
   observacional (tabla 14) — hoy el criterio "evidencia en tarea breve" de
   la tabla 17 queda en 0 porque no hay tareas todavía.
2. **Biblioteca completa** (P10) con ficha por actividad (Anexo A) ampliada:
   la Biblioteca ya tiene qué es / para qué sirve / cómo aplicarla por
   herramienta (14/09/2026); falta población, modalidad, duración,
   materiales, consigna para estudiante, variantes y precauciones por cada
   una, como pide el Anexo A completo.
3. **Evolución del plan a lo largo de ciclos**: la pestaña Sesiones ya
   registra el historial; falta comparar objetivos entre revisiones
   sucesivas (qué se mantuvo, qué se graduó, qué se reemplazó).
4. **Informe exportable** (P14): solo tras validación profesional, texto
   editable, sin diagnósticos ni comparaciones normativas. El isotipo ya
   está listo para incorporarse (`Isotipo`/`BrandCover`) en cuanto se
   construya.
5. Archivo de configuración administrable para versiones de cuestionario y
   umbrales (hoy hardcodeado en `data/items.ts` y `estudioEngine.ts`, tal
   como pide el documento para la v1 — "editable desde una configuración
   administrativa después de una etapa piloto").
6. Tests unitarios del motor (`estudioEngine` es puro y fácilmente testeable
   con vitest — inversión de ítems, completitud, discrepancias).
7. La migración a backend real ya está construida (ver sección "Backend
   multi-profesional" más abajo) — lo que falta es que la usuaria cree su
   propio proyecto de Supabase y se verifique en vivo antes de
   comercializar la plataforma.
8. El alta de estudiante ahora pide un email de contacto (antes aceptaba
   teléfono) porque ese email es el que usa la cuenta del portal
   (`ensureStudentAccount`) — si en algún caso no hay email, no se genera
   cuenta y el estudiante queda sin acceso a `/mi` (no bloquea el resto del
   flujo, pero conviene decidir un fallback si se da seguido).

## Decisiones técnicas clave (no revertir sin razón)

- **HashRouter** y `base: './'`: hosting estático (GitHub Pages) sin config
  de servidor, igual que Brújula.
- **Contenido clínico versionado en código** (`data/`): forma parte del
  método profesional, se cambia con revisión, no desde la UI.
- **Snapshots versionados, no recálculo silencioso**: cada
  `DimensionSnapshot` guarda su `versionId` y fecha; cambiar reglas no debe
  reescribir perfiles históricos (regla de trazabilidad §14).
- **Las alertas no se eliminan**: se resuelven con una decisión profesional
  documentada (`Alert.decisionProfesional`).
- **Sin tareas breves ni biblioteca completa en esta versión**: decisión de
  alcance para priorizar el flujo core validable primero (ver Alcance en
  README.md).

## Estructura del repo

```
Lectoencasa/
├── brujula/                   → Método Brújula (independiente, no tocar)
├── metodo-brujula/            → build de producción de Brújula
├── estudio/                   → código fuente de ESTA plataforma
└── metodo-estudio/            → build de producción publicado en GitHub Pages
```

## Deploy

```bash
cd estudio && npm run deploy   # build + copia dist/ → ../metodo-estudio/
git add ../metodo-estudio && git commit && git push
```

Publicado en: **https://irepsicope16.github.io/Lectoencasa/metodo-estudio/**
