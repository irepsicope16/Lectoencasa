# Método Estudio

Plataforma profesional de acompañamiento en estrategias de estudio de la
**Lic. Irene Morbidelli**, para estudiantes desde los 12 años. Construye un
perfil multidimensional (no una etiqueta única) a partir de autoinforme,
cuestionario de referente y observación profesional, y lo transforma en
prioridades y un plan de intervención editable.

Nombre y branding son de trabajo (ver PROJECT_STATUS.md, "Decisiones
pendientes"). Plataforma independiente de Método Brújula.

## Desarrollo

```bash
npm install
npm run dev        # entorno local
npm run build      # build de producción (dist/)
npm run typecheck  # verificación de tipos
```

## Cuenta demo

| Rol | Email | Clave |
|---|---|---|
| Profesional | `irene@metodoestudio.demo` | `estudio` |

Los datos demo (un caso ficticio completo: entrevista, autoperfil,
integración, prioridades y plan) se siembran automáticamente la primera vez
en LocalStorage.

## Alcance de esta versión

Flujo core del Documento Maestro V1: alta de estudiante → entrevista +
indicadores lectores → autoperfil de 8 dimensiones / 56 ítems → cálculo →
integración profesional → prioridades → plan. Ver
[PROJECT_STATUS.md](./PROJECT_STATUS.md) para lo que queda fuera de esta
primera etapa (portal estudiante, tareas breves, biblioteca completa,
informes exportables, seguimiento).
