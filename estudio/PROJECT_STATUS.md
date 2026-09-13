# Método Estudio — Estado del proyecto

> Fecha: 2026-09-13 · Rama: `claude/nueva-plataforma-profesional-wtaimt`
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
    sidebar (5492216185376). **Confirmar si es el canal correcto para
    Método Estudio** o si conviene uno propio.

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
2. **Biblioteca completa** (P10) con ficha por actividad (Anexo A):
   población, modalidad, duración, variantes, precauciones. Hoy solo hay
   nombres de herramientas por ruta.
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
7. Migración a backend real (hoy LocalStorage, mismo patrón repositorio que
   Brújula) si se valida el prototipo con usuarios reales.
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
