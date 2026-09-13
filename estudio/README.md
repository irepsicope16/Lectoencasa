# Método Estudio

Plataforma profesional de acompañamiento en estrategias de estudio de la
**Lic. Irene Morbidelli**, para estudiantes desde los 12 años. Construye un
perfil multidimensional (no una etiqueta única) a partir de autoinforme,
cuestionario de referente y observación profesional, y lo transforma en
prioridades y un plan de intervención editable.

Plataforma independiente de Método Brújula. El nombre comercial definitivo
todavía está pendiente (ver PROJECT_STATUS.md); la identidad visual (logo,
paleta y tipografía) ya es la definitiva.

## Desarrollo

```bash
npm install
npm run dev        # entorno local
npm run build      # build de producción (dist/)
npm run typecheck  # verificación de tipos
```

## Cuentas demo

| Rol | Email | Clave |
|---|---|---|
| Profesional | `irene@metodoestudio.demo` | `estudio` |
| Estudiante | `camila.tutor@demo.com` | `estudio` |

Los datos demo (un caso ficticio completo: entrevista, autoperfil,
integración, prioridades, plan y sesiones) se siembran automáticamente la
primera vez en LocalStorage.

## Alcance de esta versión

Flujo core del Documento Maestro V1: alta de estudiante → entrevista +
indicadores lectores → autoperfil de 8 dimensiones / 56 ítems → cálculo →
integración profesional → prioridades → plan → seguimiento de sesiones.
Suma gestión de consultorio (agenda, honorarios) y portal del estudiante
con cuenta de acceso automática, a la par de Método Brújula. Ver
[PROJECT_STATUS.md](./PROJECT_STATUS.md) para lo que queda fuera de esta
etapa (tareas breves, biblioteca completa de actividades, informe
exportable).
