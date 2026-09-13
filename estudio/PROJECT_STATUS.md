# Método Estudio — Estado del proyecto

> Fecha: 2026-09-13 · Rama: `claude/nueva-plataforma-profesional-wtaimt`
> Fuente funcional: Documento Maestro V1 (Lic. Irene Morbidelli, set. 2026).

## Resumen ejecutivo

Primer prototipo funcional del **flujo core** de Método Estudio (React 19 +
Vite + TypeScript estricto + Tailwind v4), arquitectura melliza a Método
Brújula pero **plataforma independiente** (carpeta, login y storage propios,
sin compartir datos con Brújula — decisión explícita del 13/09/2026).

Cubre, del orden de implementación recomendado en el documento maestro
(§18): **1 a 7** — datos y permisos, alta y entrevista, autoperfil y
guardado, cálculo por dimensiones, vista de integración profesional,
prioridades y plan. **Quedan fuera** de esta primera etapa los pasos 8-10
(portal estudiante, seguimiento, informe exportable) — ver backlog.

## ✅ Completamente terminado

### Núcleo y arquitectura
- Modelo de dominio completo (`src/types/index.ts`), fiel al Documento
  Maestro: Professional, Student, Intake, QuestionnaireResponse,
  DimensionSnapshot, Alert, PriorityDecision, Goal.
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

## 🟡 Decisiones pendientes (explícitas en el documento, §17 — no resueltas por el desarrollo)

- Nombre comercial definitivo y disponibilidad marcaria (se usó "Método
  Estudio", el nombre de trabajo del documento).
- Logo en informes/páginas imprimibles: el isotipo ya está listo para
  incorporarse (`Isotipo`/`BrandCover`) apenas se construya el informe
  exportable (P14, todavía backlog — ver más abajo).
- Qué profesiones podrán registrarse y permisos por rol (hoy: un solo rol
  profesional; sin registro público ni multi-profesional).
- Países de lanzamiento y requisitos legales específicos.
- Versión adolescente vs. educación superior: mismos ítems o redacción
  diferenciada (hoy: mismos 56 ítems para todos los niveles).
- Modelo comercial, duración de acceso y soporte.

## 🔜 Backlog priorizado (pasos 8-10 del documento + mejoras técnicas)

1. **Portal de estudiante** (P12): acceso por invitación, separado del login
   profesional, con vista sin lenguaje técnico (`resultadoEstudiante` en
   `data/mensajes.ts` ya está escrito para ese momento).
2. **Tareas breves de desempeño** (§6, tabla 13): batería T1-T8 con escala
   observacional (tabla 14) — hoy el criterio "evidencia en tarea breve" de
   la tabla 17 queda en 0 porque no hay tareas todavía.
3. **Biblioteca completa** (P10) con ficha por actividad (Anexo A):
   población, modalidad, duración, variantes, precauciones. Hoy solo hay
   nombres de herramientas por ruta.
4. **Seguimiento de sesión** (P13) y evolución del plan a lo largo de
   ciclos.
5. **Informe exportable** (P14): solo tras validación profesional, texto
   editable, sin diagnósticos ni comparaciones normativas.
6. Archivo de configuración administrable para versiones de cuestionario y
   umbrales (hoy hardcodeado en `data/items.ts` y `estudioEngine.ts`, tal
   como pide el documento para la v1 — "editable desde una configuración
   administrativa después de una etapa piloto").
7. Tests unitarios del motor (`estudioEngine` es puro y fácilmente testeable
   con vitest — inversión de ítems, completitud, discrepancias).
8. Migración a backend real (hoy LocalStorage, mismo patrón repositorio que
   Brújula) si se valida el prototipo con usuarios reales.

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
