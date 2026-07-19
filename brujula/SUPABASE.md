# ☁️ Guía: activar la nube de Método Brújula

Con la nube activa, la plataforma deja de guardar los datos en cada navegador y pasa a
guardarlos en **tu** base de datos en internet (Supabase, plan gratuito). Eso habilita:

- **Cuentas reales** con contraseña para vos y cada consultante.
- **Acceso desde cualquier dispositivo**: lo que cargás en la compu lo ves en el celular.
- **Sincronización con consultantes**: lo que responden en su casa te aparece a vos.
- **Respaldo automático** en la nube.

Lleva unos **10 minutos** y no hace falta saber programar. Es una sola vez.

---

## Paso 1 · Crear tu proyecto en Supabase (gratis)

1. Entrá a **https://supabase.com** y creá una cuenta (podés usar tu Google).
2. Botón **New project**:
   - *Name*: `metodo-brujula`
   - *Database Password*: inventá una y **guardala** (no la vas a necesitar a diario).
   - *Region*: `South America (São Paulo)` (la más cercana).
3. Esperá 1–2 minutos a que el proyecto se cree.

## Paso 2 · Crear las tablas (copiar y pegar)

1. En el menú izquierdo de Supabase: **SQL Editor** → **New query**.
2. Abrí el archivo [`supabase/schema.sql`](./supabase/schema.sql) de este proyecto,
   copiá **todo** su contenido y pegalo en el editor.
3. Botón **Run** (abajo a la derecha). Tiene que decir *Success*.

## Paso 3 · Permitir cuentas sin confirmación por email

1. Menú izquierdo: **Authentication** → **Sign In / Providers** → **Email**.
2. **Desactivá** la opción **Confirm email** y guardá.
   (Así las cuentas de tus consultantes se crean al instante desde la app.)

## Paso 4 · Copiar tus dos claves

1. Menú izquierdo: **Project Settings** (engranaje) → **API Keys**.
2. Copiá dos cosas:
   - **Project URL** (algo como `https://abcdefg.supabase.co`)
   - **anon public** key (un texto largo que empieza con `eyJ…`)

## Paso 5 · Conectar la plataforma

1. Abrí Método Brújula e ingresá como profesional → **Ajustes** → tarjeta **Nube (Supabase)**.
2. Pegá la URL y la clave anónima → **Probar conexión** (tiene que salir ✅).
3. Botón **Activar modo nube** (la app se recarga sola).

## Paso 6 · Tu cuenta y tus datos

Al volver a Ajustes → Nube vas a ver dos pasos:

1. **Crear tu cuenta profesional**: tu email y una contraseña nueva (esta será TU cuenta
   real de ahora en más). Después ingresá a la plataforma con ella.
2. **Migrar mis datos a la nube**: sube todo lo que ya tenías en este navegador
   (consultantes, sesiones, actividades…). Se puede repetir sin duplicar nada.

## ¡Listo! 🧭

Desde ahora:

- Vos ingresás con **tu email y tu contraseña** desde cualquier dispositivo.
- Al crear un consultante con email, su cuenta se crea sola (contraseña inicial `brujula`)
  y lo que responda se sincroniza automáticamente con tu panel.
- Si algún día querés volver al modo local: Ajustes → Nube → *Volver al modo local*.

---

### Preguntas frecuentes

**¿Cuánto cuesta?** El plan gratuito de Supabase alcanza de sobra para un consultorio
(500 MB de base de datos, 50.000 usuarios).

**¿Es seguro?** Sí: cada cuenta solo puede ver lo suyo. Las reglas de seguridad están en la
propia base de datos (RLS): un consultante **no puede** ver datos de otros ni tus notas de
otros procesos, aunque lo intente.

**¿Y las cuentas demo?** Solo existen en el modo local. En la nube, las únicas cuentas son
las que vos creás.

**Me da error "Confirm email".** Repetí el Paso 3: esa opción tiene que estar desactivada.
