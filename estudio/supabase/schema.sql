-- ============================================================
-- Método Estudio — Esquema Supabase v1
-- Ejecutar COMPLETO en: Supabase → SQL Editor → New query → Run
--
-- Modelo: una tabla-documento por colección (id + data jsonb +
-- columnas generadas para seguridad e índices). El cliente
-- guarda/lee objetos completos, idéntico al modo local, lo que
-- elimina errores de mapeo. La normalización por columnas es un
-- paso posterior de backend.
--
-- Proyecto de Supabase propio y separado del de Método Brújula:
-- ningún dato de un consultante de Brújula y ningún dato de un
-- estudiante de Estudio comparten base ni tablas.
--
-- Seguridad (RLS) — multi-profesional:
--   · profesional  → acceso total, pero SOLO a sus propios estudiantes
--     y a los datos de esos estudiantes (por "professionalId")
--   · estudiante   → acceso mínimo real, calibrado tabla por tabla según
--     lo que la UI del portal efectivamente lee o escribe (ver más abajo,
--     nunca acceso en bloque a las 11 colecciones)
-- ============================================================

-- ---------- Perfiles (rol y datos de cada cuenta) ----------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb
);

alter table public.profiles enable row level security;

-- El perfil se crea automáticamente al registrarse una cuenta, tomando
-- rol/nombre/studentId de los metadatos del registro.
--
-- IMPORTANTE — por qué esta función es tan defensiva:
-- `raw_user_meta_data` lo arma el propio cliente al llamar auth.signUp(),
-- así que CUALQUIERA con la anon key (pública, va en el bundle) puede
-- invocar signUp directo por API con los metadatos que quiera — no hace
-- falta pasar por la UI de la app. Por eso acá NUNCA se confía en:
--   · membershipExpiresAt del cliente: si se copiara tal cual, cualquiera
--     podría autoasignarse una membresía activa por años sin pagar ni
--     ser activado por la dueña. Siempre se fuerza a "pendiente" (ahora
--     mismo, ya vencida) acá adentro; la única forma real de activarla
--     es profiles_admin_update, que ya exige me_is_owner().
--   · studentId del cliente: si se copiara tal cual, alguien podría
--     registrarse como "estudiante" reclamando el id de la ficha de
--     otro estudiante (si lo adivina o se filtra en algún lado) y leer
--     su proceso completo. Solo se acepta si ese id corresponde a un
--     estudiante real y todavía nadie lo reclamó.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  claimed_role text := coalesce(new.raw_user_meta_data->>'role', 'estudiante');
  claimed_sid text := new.raw_user_meta_data->>'studentId';
  safe_sid text := null;
begin
  if claimed_role = 'estudiante' and claimed_sid is not null then
    if exists (select 1 from public.students s where s."studentId" = claimed_sid)
       and not exists (select 1 from public.profiles p where p.data->>'studentId' = claimed_sid)
    then
      safe_sid := claimed_sid;
    end if;
  end if;

  insert into public.profiles (id, data)
  values (
    new.id,
    jsonb_build_object(
      'role', claimed_role,
      'nombre', coalesce(new.raw_user_meta_data->>'nombre', ''),
      'apellido', coalesce(new.raw_user_meta_data->>'apellido', ''),
      'titulo', new.raw_user_meta_data->>'titulo',
      'matricula', new.raw_user_meta_data->>'matricula',
      'studentId', safe_sid,
      'membershipExpiresAt', to_jsonb(now())::text,
      'email', new.email,
      'createdAt', to_jsonb(now())::text
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helpers (security definer → evitan recursión de RLS)
create or replace function public.me_role()
returns text language sql stable security definer set search_path = public
as $$ select data->>'role' from public.profiles where id = auth.uid() $$;

create or replace function public.me_student_id()
returns text language sql stable security definer set search_path = public
as $$ select data->>'studentId' from public.profiles where id = auth.uid() $$;

-- ¿Es la cuenta dueña de la plataforma? Único rol con permiso para ver y
-- renovar la membresía anual de las demás profesionales (panel
-- /pro/profesionales). Identificada por email, no por id, para no
-- depender de un UUID fijo.
create or replace function public.me_is_owner()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and data->>'email' = 'irenemorbidelli@gmail.com'
  )
$$;

-- ¿Tiene la profesional logueada la membresía anual activa (o es la dueña,
-- siempre exenta)? El corte también aplica en RLS, no solo en el guard de
-- React (RequireRole) — así una profesional con la membresía vencida, o
-- cuyo acceso la dueña "cortó" desde /pro/profesionales, no puede seguir
-- leyendo/escribiendo sus estudiantes con una llamada directa a la API,
-- sin pasar por la app.
create or replace function public.me_membership_active()
returns boolean language sql stable security definer set search_path = public
as $$
  select public.me_is_owner() or coalesce(
    (select (p.data->>'membershipExpiresAt') is null
       or (p.data->>'membershipExpiresAt')::timestamptz > now()
     from public.profiles p where p.id = auth.uid()),
    false
  )
$$;

-- ---------- Students (la ficha ES el estudiante) ----------
-- Se crea acá, antes de me_owns_student(), porque esa función la
-- referencia y Postgres valida las funciones "language sql" al crearlas.
-- "professionalId" (dueña de la ficha) es el límite de aislamiento entre
-- profesionales: cada una solo ve y edita sus propios estudiantes.
create table if not exists public.students (
  id text primary key,
  data jsonb not null,
  "studentId" text generated always as (data->>'id') stored,
  "professionalId" text generated always as (data->>'professionalId') stored
);
create index if not exists students_professional_idx on public.students ("professionalId");
alter table public.students enable row level security;
drop policy if exists students_pro on public.students;
create policy students_pro on public.students
  for all using (
    public.me_role() = 'profesional' and "professionalId" = auth.uid()::text
    and public.me_membership_active()
  )
  with check (
    public.me_role() = 'profesional' and "professionalId" = auth.uid()::text
    and public.me_membership_active()
  );
-- El estudiante solo lee su propia ficha (la app la usa para mostrar
-- nombre/nivel en el portal) — nunca la edita.
drop policy if exists students_own on public.students;
create policy students_own on public.students
  for select using ("studentId" = public.me_student_id());

-- ¿La profesional logueada es dueña de este estudiante? Security definer
-- para poder consultar `students` desde las políticas de las otras tablas
-- sin caer en recursión de RLS.
create or replace function public.me_owns_student(sid text)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.students s
    where s."studentId" = sid and s."professionalId" = auth.uid()::text
  )
$$;

-- Políticas de profiles: cada cuenta lee su propio perfil; la dueña de la
-- plataforma además puede ver y actualizar los de las demás profesionales
-- (panel /pro/profesionales, para renovar membresías sin tocar Supabase).
drop policy if exists profiles_own on public.profiles;
create policy profiles_own on public.profiles
  for select using (id = auth.uid() or public.me_is_owner());
drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
  for update using (public.me_is_owner()) with check (public.me_is_owner());

-- Autoedición segura del propio perfil (nombre, título, matrícula):
-- sin política RLS de "update" para el dueño de la fila, a propósito —
-- así ningún profesional puede tocar su "role" ni "membershipExpiresAt"
-- editando el JSON directo. Solo esta función, con esta lista fija de
-- campos, puede escribir sobre la propia fila.
create or replace function public.me_update_own_profile(
  p_nombre text default null,
  p_apellido text default null,
  p_titulo text default null,
  p_matricula text default null
)
returns void language plpgsql security definer set search_path = public
as $$
begin
  update public.profiles
  set data = data || jsonb_strip_nulls(jsonb_build_object(
    'nombre', p_nombre,
    'apellido', p_apellido,
    'titulo', p_titulo,
    'matricula', p_matricula
  ))
  where id = auth.uid();
end;
$$;
grant execute on function public.me_update_own_profile to authenticated;

-- ---------- Resto de colecciones de datos ----------
-- "studentId" es columna generada desde data para RLS e índices.
--
-- El acceso del ESTUDIANTE a sus propias filas se calibra por tabla, no
-- en bloque, según lo que el portal del estudiante (MyDashboard.tsx)
-- efectivamente lee o escribe hoy:
--   · own_full  (leer + crear + editar, nunca borrar): lo que el propio
--     estudiante completa — sus respuestas del autoperfil
--     (questionnaire_responses) y sus preguntas abiertas (open_answers).
--   · own_read  (solo leer): lo que ve pero no toca — sus objetivos del
--     plan (goals) y las actividades que le asignó la profesional
--     (asignaciones; marcarlas completadas sigue siendo, por ahora, una
--     acción de la profesional, no del estudiante).
--   · own_none  (nada, ni lectura): trabajo clínico interno de la
--     profesional — entrevista con notas privadas (intakes), snapshots
--     por dimensión (dimension_snapshots), alertas (alerts), prioridades
--     (priority_decisions), agenda y honorarios (sessions,
--     calendar_events), y archivos de evaluación (files).
do $$
declare
  t text;
begin
  foreach t in array array[
    'intakes','questionnaire_responses','open_answers','dimension_snapshots',
    'alerts','priority_decisions','goals','sessions','calendar_events',
    'files','asignaciones'
  ]
  loop
    execute format($f$
      create table if not exists public.%I (
        id text primary key,
        data jsonb not null,
        "studentId" text generated always as (data->>'studentId') stored
      )$f$, t);
    execute format('create index if not exists %I on public.%I ("studentId")', t || '_sid_idx', t);
    execute format('alter table public.%I enable row level security', t);
    -- profesional: acceso total, pero solo a SUS estudiantes
    execute format('drop policy if exists %I on public.%I', t || '_pro', t);
    execute format($f$
      create policy %I on public.%I for all
        using (
          public.me_role() = 'profesional' and public.me_owns_student("studentId")
          and public.me_membership_active()
        )
        with check (
          public.me_role() = 'profesional' and public.me_owns_student("studentId")
          and public.me_membership_active()
        )$f$, t || '_pro', t);
    execute format('drop policy if exists %I on public.%I', t || '_own_sel', t);
    execute format('drop policy if exists %I on public.%I', t || '_own_ins', t);
    execute format('drop policy if exists %I on public.%I', t || '_own_upd', t);

    if t = any(array['questionnaire_responses','open_answers']) then
      -- own_full: leer + crear + editar sus propias filas, nunca borrar
      execute format($f$
        create policy %I on public.%I for select
          using ("studentId" = public.me_student_id())$f$, t || '_own_sel', t);
      execute format($f$
        create policy %I on public.%I for insert
          with check ("studentId" = public.me_student_id())$f$, t || '_own_ins', t);
      execute format($f$
        create policy %I on public.%I for update
          using ("studentId" = public.me_student_id())
          with check ("studentId" = public.me_student_id())$f$, t || '_own_upd', t);
    elsif t = any(array['goals','asignaciones']) then
      -- own_read: solo lectura
      execute format($f$
        create policy %I on public.%I for select
          using ("studentId" = public.me_student_id())$f$, t || '_own_sel', t);
    end if;
    -- own_none (intakes, dimension_snapshots, alerts, priority_decisions,
    -- sessions, calendar_events, files): ninguna política "_own" — sin
    -- ellas, RLS deniega por defecto.

    -- filas sin estudiante (agenda personal de la profesional, recordatorios
    -- generales…): cualquier profesional las puede gestionar. No todas las
    -- tablas admiten studentId null, pero la política no molesta a las que
    -- no lo usan — simplemente nunca aplica ahí.
    execute format('drop policy if exists %I on public.%I', t || '_gen', t);
    execute format($f$
      create policy %I on public.%I for all
        using (
          "studentId" is null and public.me_role() = 'profesional'
          and public.me_membership_active()
        )
        with check (
          "studentId" is null and public.me_role() = 'profesional'
          and public.me_membership_active()
        )$f$, t || '_gen', t);
  end loop;
end $$;

-- ============================================================
-- Listo. Siguiente paso: en Authentication → Providers → Email,
-- DESACTIVAR «Confirm email» (las cuentas de estudiantes se crean desde
-- la app sin paso de confirmación).
-- ============================================================
