# Método Brújula — Arquitectura

> **Encontrá tu norte. Construí tu camino.**
> Plataforma profesional de Orientación Vocacional de **Psicope con Ire**.

Este documento describe la arquitectura completa de la plataforma. Cada decisión está
justificada técnicamente y pensada para un producto SaaS comercial listo para escalar,
no para un MVP.

---

## 1. Visión de producto

Método Brújula es el software profesional con el que una Licenciada en Psicopedagogía
conduce procesos completos de orientación vocacional: evaluación, acompañamiento,
seguimiento, proyecto de vida, informes e IA — todo alrededor de un método propio de
**12 módulos** organizados en **5 etapas** (Conocerte · Valorarte · Explorar · Decidir · Actuar).

Principio rector del dominio: **la orientación no es un test**. El sistema nunca reduce a la
persona a un puntaje; el Motor Brújula cruza evidencia cualitativa y cuantitativa y siempre
explica el *porqué* de cada sugerencia. No se muestran porcentajes de "compatibilidad".

## 2. Stack y justificación

| Capa | Elección | Justificación |
|---|---|---|
| UI | React 19 + TypeScript estricto | Tipado de dominio completo; ecosistema maduro. |
| Build | Vite | DX instantánea, `base: './'` permite desplegar bajo cualquier subruta. |
| Estilos | Tailwind CSS v4 + shadcn/ui (componentes propios) | Sistema de diseño tokenizado en CSS variables → dark/light gratis; componentes accesibles sobre Radix. |
| Routing | React Router 7 | Rutas anidadas por layout de rol, lazy loading por área. |
| Server-state | TanStack Query | Toda lectura/escritura de datos pasa por repositorios async; Query cachea e invalida. Al migrar a Supabase la UI no cambia. |
| Client-state | Zustand (persist) | Sesión de auth y preferencias de UI (tema, sidebar). Nada de dominio vive aquí. |
| Formularios | React Hook Form + Zod | El esquema Zod es la única fuente de verdad de validación; se reutiliza en la capa de servicios. |
| Gráficos | Recharts | Radar (Mapa Brújula), áreas y barras del panel de estadísticas. |
| Animación | Framer Motion | Micro-transiciones suaves (fade/slide 150–250 ms), respetando `prefers-reduced-motion`. |
| Iconos | Lucide | Consistencia visual con Notion/Linear. |
| Tipografía | Inter Variable (autohospedada vía @fontsource) | Sin dependencia de Google Fonts, carga determinista. |

## 3. Persistencia: LocalStorage hoy, Supabase mañana

La UI **nunca** toca `localStorage` directamente. Existe una capa de repositorios:

```
UI (páginas/hooks) → TanStack Query → db.<colección> (Repository<T>) → StorageDriver
```

- `StorageDriver` es una interfaz mínima (`read/write` por colección) implementada hoy por
  `LocalStorageDriver` (claves `mb:data:<colección>`, serialización JSON, versionado de esquema).
- `Repository<T>` expone API **async** (`list`, `get`, `create`, `update`, `remove`, `query`)
  aunque LocalStorage sea síncrono. Es deliberado: el contrato ya es el de una base remota,
  por lo que migrar a Supabase = escribir `SupabaseDriver`/repositorios con la misma interfaz
  y borrar una línea en `db.ts`. Ningún componente cambia.
- IDs: `crypto.randomUUID()`. Timestamps ISO-8601. Campos `createdAt/updatedAt` en todas las
  entidades — mapeo 1:1 con las tablas Postgres propuestas (§6).
- Archivos: hoy DataURL con límite de tamaño; la interfaz `FileStore` ya separa metadatos de
  contenido para mapear a Supabase Storage.

## 4. Estructura de carpetas

```
brujula/
├── public/                  # favicon.svg y estáticos
├── src/
│   ├── main.tsx             # bootstrap + seed
│   ├── app/
│   │   ├── App.tsx          # providers (QueryClient, Tooltip, Theme) + RouterProvider
│   │   └── router.tsx       # árbol completo de rutas con lazy loading
│   ├── components/
│   │   ├── ui/              # sistema de diseño (button, card, dialog, tabs, …)
│   │   ├── layout/          # AppShell, Sidebar, Navbar, CommandPalette
│   │   └── shared/          # EmptyState, PageHeader, StatCard, ProgressRing, …
│   ├── branding/            # Logo (isotipo / horizontal / completo) como SVG React
│   ├── features/
│   │   ├── auth/            # login, guards, cuentas demo
│   │   ├── dashboard/       # dashboards pro y consultante
│   │   ├── consultants/     # CRUD + ficha completa
│   │   ├── sessions/        # sesiones y agenda
│   │   ├── method/          # los 12 módulos (vista pro y consultante)
│   │   ├── activities/      # actividades asignadas + respuestas
│   │   ├── reflections/     # bitácora del consultante
│   │   ├── evaluations/     # evaluaciones dimensionales
│   │   ├── files/           # materiales y archivos
│   │   ├── engine/          # Motor Brújula (puro, testeable)
│   │   ├── reports/         # informes imprimibles (PDF)
│   │   ├── stats/           # estadísticas del estudio
│   │   └── ai/              # capa IA (interfaz + OpenAI + heurístico local)
│   ├── data/
│   │   ├── modules.ts       # contenido de los 12 módulos
│   │   ├── careers.ts       # catálogo de áreas vocacionales y carreras
│   │   └── seed.ts          # datos demo (profesional + consultantes)
│   ├── services/
│   │   ├── storage/         # StorageDriver, LocalStorageDriver, Repository, db
│   │   └── ai/              # AIProvider, OpenAIProvider, LocalProvider
│   ├── stores/              # authStore, uiStore (Zustand persist)
│   ├── hooks/               # useConsultants, useSessions, … (TanStack Query)
│   ├── lib/                 # utils, cn, fechas, constantes
│   └── types/               # modelo de dominio completo
└── ARCHITECTURE.md
```

Regla de dependencias: `features` puede importar de `components/lib/hooks/services/types/data`;
nada importa desde `features` de otra feature salvo por sus barrels públicos. `engine` y
`services` son TypeScript puro sin React → testeables y portables a un backend.

## 5. Modelo de dominio (resumen)

- **User** (`profesional` | `consultante`) — el consultante enlaza a su `Consultant`.
- **Consultant** — ficha completa (foto, datos personales, escuela, motivo, estado,
  profesional, fecha de inicio…).
- **Session** — sesiones clínicas: fecha, modalidad, estado, temas, notas, módulos tocados,
  próximos pasos.
- **Observation** — observaciones profesionales, opcionalmente ancladas a un módulo.
- **ModuleProgress** — estado por consultante y módulo (disponible/en progreso/completado),
  notas profesionales y del consultante.
- **Activity** — instancia asignada de una actividad (preguntas → respuestas), con estados
  `pendiente → en_progreso → completada → revisada` y feedback profesional.
- **AssignedVideo**, **StoredFile**, **Reflection** (bitácora con estado de ánimo).
- **Evaluation** — evaluación dimensional (intereses, aptitudes, valores…) con ítems Likert
  1–5 *de uso interno del profesional* (nunca se muestran como porcentaje al consultante).
- **CompassSnapshot** — salida del Motor Brújula persistida con fecha (Perfil, Mapa, Carta).

Los 12 módulos y el catálogo de carreras son **contenido estático versionado en código**
(`data/`): forman parte del método y se editan con revisión, no desde la UI.

## 6. Esquema Supabase objetivo

Tablas espejo de las entidades: `profiles` (auth.users + rol), `consultants`, `sessions`,
`observations`, `module_progress`, `activities`, `activity_answers`, `assigned_videos`,
`files` (metadatos; binarios en Storage), `reflections`, `evaluations`, `evaluation_items`,
`compass_snapshots`. RLS: el profesional ve sus consultantes (`professional_id = auth.uid()`);
el consultante solo su propia fila y colecciones hijas. Los campos ya usan tipos compatibles
(uuid, timestamptz, jsonb para `questions/answers`).

## 7. Motor Brújula

`features/engine/compassEngine.ts` — funciones puras:

1. **Recolección de evidencia**: evaluaciones (dimensiones), actividades respondidas
   (valores elegidos, fortalezas, intereses declarados), reflexiones, observaciones,
   sesiones y progreso de módulos.
2. **Perfil Brújula**: síntesis por dimensión con las evidencias que la sustentan.
3. **Mapa Brújula**: radar de dimensiones (etiquetas cualitativas, no %).
4. **Carta de Navegación**: áreas vocacionales sugeridas en niveles
   (`brújula firme` / `rumbo posible` / `para explorar`), cada una con **motivos textuales
   citando la fuente** ("En la actividad *Mis valores* elegiste…"), tensiones detectadas
   (deseo vs. mandato) y pasos de exploración concretos.

El catálogo de carreras etiqueta cada área con valores/intereses/aptitudes/fortalezas; el
matching es por evidencia acumulada con umbrales, nunca un score expuesto.

## 8. IA

`services/ai/` define `AIProvider` (resumir sesión, proponer preguntas, redactar borrador de
informe, analizar respuestas, proponer hipótesis). Implementaciones:

- `OpenAIProvider`: llama a la API con la clave que la profesional guarda en Ajustes
  (solo en su dispositivo). Modelo configurable.
- `LocalAssistantProvider`: fallback determinista basado en plantillas + datos reales del
  consultante, para que la plataforma funcione sin clave.

Toda salida de IA se presenta como **borrador editable**: la IA nunca reemplaza el criterio
profesional (se explicita en la UI).

## 9. Informes PDF

Los 4 informes (profesional, Carta de Navegación, familia, consultante) son rutas de
impresión (`/print/...`) con CSS `@page`/`print:` dedicado y `window.print()`. Justificación:
salida vectorial perfecta, tipografía real, cero dependencias pesadas en el bundle, y al
migrar a backend se puede renderizar la misma vista con Playwright para PDFs server-side.

## 10. Diseño

- Tokens en `index.css` (`--background`, `--primary` verde agua, `--accent` lavanda, …)
  con capa `.dark`. Bordes suaves (radius 0.75rem), sombras mínimas, mucho blanco.
- Inspiración Notion/Linear/Calm: sidebar densa pero silenciosa, navbar con breadcrumb y
  ⌘K, tarjetas planas con borde hairline, animaciones 150–250 ms.
- Identidad: brújula minimalista flat (aguja NE) en verde agua + lavanda; variantes
  isotipo / horizontal / completa + favicon SVG con dark-mode media query.

## 11. Seguridad y roles

Guards de ruta por rol (`RequireRole`), sesión persistida en Zustand. En la fase Supabase la
autorización real vive en RLS; los guards de UI se mantienen como UX. Los datos demo se
siembran solo si el storage está vacío (versión de seed registrada).

## 12. Roadmap post-v1

1. `SupabaseDriver` + Auth real — ✅ hecho (ver §11).
2. PDFs server-side y envío por email.
3. Multi-profesional — ✅ hecho: cada profesional es su propio tenant (`profesionalId` en
   `consultants`, scopeado por RLS; alta pública en `/registro`). Si más adelante se necesita
   que varias profesionales de un mismo estudio compartan una cartera de consultantes, ahí sí
   habría que sumar una capa de `organization_id` por encima de esto.
4. Portal de pago (suscripción por profesional) y facturación.
5. Notificaciones push/email de tareas y sesiones.
