# Método Estudio — Estado del proyecto

> Fecha: 2026-10-10 · Rama: `claude/mini-app-metodo-estudio`

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

## 🔜 Backlog

1. Instalación como PWA (ícono en el celular, funciona offline) — hoy es
   una SPA que necesita conexión para la primera carga.
2. Notificaciones/recordatorios locales para sostener la racha.
3. Exportar o imprimir un mapa conceptual o un mazo de fichas.
4. Modelo de monetización: hoy no hay pago ni backend. Si se decide cobrar,
   evaluar aparte (no reusar el backend multi-profesional abandonado, que
   asumía un modelo de negocio distinto).
5. Fichas de repaso con repetición espaciada real (hoy solo cuenta veces
   repasada, no calcula cuándo conviene repasar de nuevo).

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
