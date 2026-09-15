# ☁️ Guía: activar la nube de Método Estudio

Con la nube activa, la plataforma deja de guardar los datos en cada navegador y pasa a
guardarlos en **tu** base de datos en internet (Supabase, plan gratuito, un proyecto propio
y separado del de Método Brújula). Eso habilita:

- **Cuentas reales** con contraseña para vos y cada estudiante.
- **Acceso desde cualquier dispositivo**: lo que cargás en la compu lo ves en el celular.
- **Sincronización con estudiantes**: lo que responden en su autoperfil te aparece a vos.
- **Respaldo automático** en la nube.
- **Multi-profesional**: cualquier otra profesional puede registrarse sola (`/registro`) y
  usar la plataforma con sus propios estudiantes, sin ver ni tocar los tuyos — cada una
  tiene su espacio aislado en la misma base de datos.

Lleva unos **10 minutos** y no hace falta saber programar. Es una sola vez.

---

## Paso 1 · Crear tu proyecto en Supabase (gratis)

1. Entrá a **https://supabase.com** y creá una cuenta (podés usar tu Google).
2. Botón **New project**:
   - *Name*: `metodo-estudio`
   - *Database Password*: inventá una y **guardala** (no la vas a necesitar a diario).
   - *Region*: `South America (São Paulo)` (la más cercana).
3. Esperá 1–2 minutos a que el proyecto se cree.

> Si ya tenés un proyecto de Supabase para Método Brújula, **creá uno nuevo y distinto**
> para Estudio — las dos plataformas son independientes a propósito: ningún dato de un
> consultante de Brújula y ningún dato de un estudiante de Estudio comparten base.

## Paso 2 · Crear las tablas (copiar y pegar)

1. En el menú izquierdo de Supabase: **SQL Editor** → **New query**.
2. Abrí el archivo [`supabase/schema.sql`](./supabase/schema.sql) de este proyecto,
   copiá **todo** su contenido y pegalo en el editor.
3. Botón **Run** (abajo a la derecha). Tiene que decir *Success*.

## Paso 3 · Permitir cuentas sin confirmación por email

1. Menú izquierdo: **Authentication** → **Sign In / Providers** → **Email**.
2. **Desactivá** la opción **Confirm email** y guardá.
   (Así las cuentas de tus estudiantes se crean al instante desde la app.)

## Paso 4 · Copiar tus dos claves

1. Menú izquierdo: **Project Settings** (engranaje) → **API Keys**.
2. Copiá dos cosas:
   - **Project URL** (algo como `https://abcdefg.supabase.co`)
   - **anon public** key (un texto largo que empieza con `eyJ…`)

## Paso 5 · Conectar la plataforma

1. Abrí Método Estudio e ingresá como profesional → **Ajustes** → tarjeta **Nube (Supabase)**.
2. Pegá la URL y la clave anónima → **Probar conexión** (tiene que salir ✅).
3. Botón **Activar modo nube** (la app se recarga sola).

## Paso 6 · Tu cuenta y tus datos

Al volver a Ajustes → Nube vas a ver dos pasos:

1. **Crear tu cuenta profesional**: tu nombre, apellido, email y una contraseña nueva
   (esta será TU cuenta real de ahora en más). Después ingresá a la plataforma con ella.
2. **Migrar mis datos a la nube**: sube todo lo que ya tenías en este navegador
   (estudiantes, sesiones, actividades…). Se puede repetir sin duplicar nada.

## Paso 7 · Dejar la nube activa para cualquiera que entre (para comercializarla)

Los pasos anteriores activan la nube solo **en tu navegador** (queda guardado ahí). Para que
otra profesional que nunca tocó Ajustes pueda entrar directo a `/registro` y crearse su
propia cuenta, la nube tiene que venir **prendida de fábrica** en el sitio publicado:

1. En la carpeta `estudio/`, creá un archivo llamado `.env.production.local` (este archivo
   nunca se sube a git — ya está en `.gitignore`) con estas dos líneas, usando la misma URL
   y clave `anon` del Paso 4:
   ```
   VITE_SUPABASE_URL=https://abcdefg.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
2. Corré `npm run deploy` de nuevo (o pedime a mí que lo haga) y publicá el resultado.
3. Listo: cualquier persona que entre a la plataforma desde cero ya la va a encontrar en
   modo nube, con el link **"Registrate"** visible en la pantalla de ingreso.

*(La clave `anon` está pensada para ser pública — vive en el navegador de cualquier
visitante. Lo que protege los datos de cada profesional es la seguridad de la base (RLS),
no que la clave sea secreta.)*

## ¡Listo!

Desde ahora:

- Vos ingresás con **tu email y tu contraseña** desde cualquier dispositivo.
- Cualquier otra profesional puede registrarse sola desde `/registro` y usar la plataforma
  con sus propios estudiantes — no ve los tuyos, ni vos los de ella.
- Al crear un estudiante con email de contacto, su cuenta se crea sola (contraseña
  generada al azar) y lo que responda en su autoperfil se sincroniza automáticamente con
  el panel de SU profesional.
- Si algún día querés volver al modo local: Ajustes → Nube → *Volver al modo local*.

---

### Preguntas frecuentes

**¿Cuánto cuesta?** El plan gratuito de Supabase alcanza de sobra para varios consultorios
(500 MB de base de datos, 50.000 usuarios). Si la plataforma crece mucho, Supabase tiene
planes pagos — lo vemos llegado el momento.

**¿Es seguro entre profesionales distintas?** Sí: además de que un estudiante no puede ver
datos de otros, **una profesional tampoco puede ver los estudiantes de otra profesional**.
Cada ficha guarda quién es su dueña (`professionalId`) y las reglas de seguridad de la base
de datos (RLS) filtran todo por ese dato — no es algo que dependa de la app, está aplicado
en el servidor, así que ni con herramientas técnicas se puede saltear desde el navegador.

**¿Qué puede ver un estudiante desde su portal?** Solo lo mínimo que la app realmente le
muestra: sus propias respuestas del autoperfil (las puede completar), sus objetivos del
plan y las actividades que le asignaste (de solo lectura). Nunca su entrevista con tus
notas privadas, ni las alertas, ni las prioridades, ni tu agenda — eso queda reservado a
la profesional, aplicado también a nivel de base de datos, no solo de pantalla.

**¿Y las cuentas demo?** Solo existen en el modo local. En la nube, las únicas cuentas son
las que se registran (vos, o cualquier otra profesional).

**Me da error "Confirm email".** Repetí el Paso 3: esa opción tiene que estar desactivada.

**Ya tenía un proyecto de Supabase de antes de esta guía, ¿tengo que crear uno nuevo?** No.
El archivo `schema.sql` se puede volver a correr sobre el mismo proyecto (Paso 2): agrega lo
que falte sin borrar nada de lo que ya tenías cargado.
