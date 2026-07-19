# Método Brújula — Estado del proyecto

> Última actualización: 2026-07-19 · Rama: `claude/metodo-brujula-platform-a1ns2b`
> Documento de continuidad: leer junto a [ARCHITECTURE.md](./ARCHITECTURE.md) antes de retomar el desarrollo.

## Resumen ejecutivo

Plataforma profesional de Orientación Vocacional (React 19 + Vite + TypeScript estricto +
Tailwind v4). **Fase 1** (plataforma completa) y **Fase 2** (completar experiencias,
historial del motor, automatizaciones) están terminadas, verificadas con smoke test E2E
y pusheadas. ~9.900 líneas de código fuente en 68 archivos. Typecheck y build en verde.

**Cuentas demo**: `ire@psicopeconire.com` / `brujula` (profesional) · `valen@demo.com` / `brujula` (consultante).

```bash
cd brujula && npm install && npm run dev   # desarrollo
npm run build && npx vite preview          # producción local
```

## ✅ Completamente terminado

### Núcleo y arquitectura
- Modelo de dominio completo (`src/types/index.ts`): 15 entidades espejo del esquema Supabase objetivo.
- Persistencia con patrón repositorio (`services/storage/`): API async sobre LocalStorage,
  migrable a Supabase cambiando solo el driver. Borrado en cascada implementado.
- TanStack Query como única puerta de datos (`hooks/queries.ts`); Zustand para auth/UI.
- Copia de seguridad: export/import JSON versionado (`services/storage/backup.ts`).
- Vendor split en build (chunks `react`/`motion`/`data` cacheables); lazy loading por página.

### Contenido del método (activo diferencial)
- 12 módulos completos (`data/modules.ts`): introducción dual, objetivos, 27 actividades
  con consignas, videos, materiales, preguntas guía clínicas.
- Catálogo de 12 áreas vocacionales / ~70 carreras etiquetadas (`data/careers.ts`).
- Seed demo narrativamente coherente (3 consultantes en distintos estadios).

### Área profesional
- Dashboard (métricas, próximas sesiones, actividad reciente, tareas, accesos rápidos).
- CRUD consultantes con foto (recorte/compresión), cuenta de acceso automática al crear,
  borrado en cascada con confirmación.
- Ficha con 9 pestañas: Resumen (observaciones + notas + historial), Módulos, Sesiones,
  Actividades (+videos), Evaluaciones (Likert interno), Archivos, Motor Brújula,
  Asistente IA, Informes.
- Agenda con calendario mensual + detalle diario + eventos/tareas/recordatorios.
- Estadísticas (Recharts), Ajustes (tema, IA, backup, reset demo).

### Área consultante
- "Mi camino" (recorrido por etapas, pendientes, próxima sesión, bitácora).
- Módulos con actividades respondibles (borrador/entrega), videos, notas propias.
- Reflexiones con estado de ánimo, materiales descargables, línea de avances.
- Acceso a su propio resumen y Carta en PDF (guard de propiedad en `/print`).

### Motor Brújula (`features/engine/compassEngine.ts` — puro, sin React)
- Cruza actividades + evaluaciones + reflexiones + observaciones + sesiones + progreso.
- Genera Perfil (9 dimensiones con evidencias citadas), Mapa (radar) y Carta de Navegación.
- Sin porcentajes: niveles `brújula firme / rumbo posible / para explorar`, siempre con motivos.
- Detección de tensiones deseo/mandato. Niveles relativos al máximo (máx. 2 áreas firmes).
- Historial de snapshots con selector, poda automática (10) y nota de evolución.

### Informes, IA y automatizaciones
- 4 informes imprimibles a PDF (profesional, Carta, familia, consultante) vía `/print`.
- Capa IA (`services/ai/`): contrato `AIProvider`, OpenAI real (clave en Ajustes) +
  asistente local determinista. 6 tareas. Borradores guardables como observación.
- Automatizaciones: fecha límite de actividad → tarea en agenda; consultante empieza a
  responder → módulo pasa a "en progreso".

### Calidad
- Dark/light mode sin flash; drawer móvil; contraste AA; toasts globales;
  animaciones Framer Motion con `prefers-reduced-motion`.
- Smoke tests E2E con Chromium (scripts en scratchpad de sesión; 12 pantallas, 0 errores).

## 🟡 Parcial / limitaciones conocidas

| Tema | Estado |
|---|---|
| Archivos grandes | Solo metadatos si superan 700 KB (límite LocalStorage; desaparece con Supabase Storage) |
| Buscador ⌘K | Navega a consultantes/módulos/secciones; no busca dentro de notas/sesiones |
| Dashboard | Layout fijo (el requerimiento original pedía widgets configurables) |
| Cuenta consultante | Se crea al crear la ficha; si se edita el email después, no se sincroniza |
| Formularios | Consultantes y Login usan RHF+Zod; Sesiones/Agenda/Evaluaciones usan useState |

## 🔜 Backlog priorizado

1. **Supabase** (`SupabaseDriver` + Auth real + Storage + RLS) — la interfaz ya lo espera;
   habilita multi-dispositivo y respaldo real. Ver esquema en ARCHITECTURE.md §6.
2. Tests unitarios del motor (`compassEngine` es puro y testeable; agregar vitest).
3. Unificar formularios restantes en RHF+Zod (elimina ~10 casts `as never`).
4. Búsqueda global de contenido (sesiones, notas, reflexiones).
5. Dashboard con widgets configurables.
6. Diccionario de sinónimos para el matching del motor (hoy substring normalizado).
7. Streaming de respuestas IA; notificaciones por email; multi-profesional (`organization_id`).

## Decisiones técnicas clave (no revertir sin razón)

- **HashRouter**: hosting estático (GitHub Pages) sin configuración de servidor.
- **PDF por impresión del navegador**: vectorial, cero dependencias; server-side en fase Supabase.
- **Contenido del método versionado en código** (no editable por UI): es parte del método
  profesional y se cambia con revisión.
- **Evaluaciones Likert de uso interno**: nunca se muestran como porcentaje al consultante.
- **La IA solo produce borradores**: el criterio profesional siempre tiene la última palabra
  (explicitado en la UI).
- La etiqueta genérica `personas` se quitó de Educación/Sociales en `careers.ts` para no
  inflar esas áreas con la misma evidencia (calibración del motor — mantener).

## Estructura del repo

```
Lectoencasa/
├── index.html, css/, js/…     → sitio de marca Psicope con Ire (no tocar)
├── app/                       → producto Lectoescritura (independiente, no tocar)
├── brujula/                   → código fuente de ESTA plataforma (Método Brújula)
└── plataforma/                → build de producción publicado en GitHub Pages
```

## Deploy

La app se publica como archivos estáticos en `/plataforma/` (GitHub Pages del repo):
**https://irepsicope16.github.io/Lectoencasa/plataforma/**

Tras cualquier cambio en `brujula/`, regenerar y commitear el build:

```bash
cd brujula && npm run deploy   # build + copia dist/ → ../plataforma/
git add ../plataforma && git commit && git push
```
