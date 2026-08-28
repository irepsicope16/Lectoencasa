-- ============================================================
-- Método Brújula — Esquema Supabase v1
-- Ejecutar COMPLETO en: Supabase → SQL Editor → New query → Run
--
-- Modelo: una tabla-documento por colección (id + data jsonb +
-- "consultantId" generado para seguridad e índices). El cliente
-- guarda/lee objetos completos, idéntico al modo local, lo que
-- elimina errores de mapeo. La normalización por columnas es un
-- paso posterior de backend (ver ARCHITECTURE.md).
--
-- Seguridad (RLS) — multi-profesional:
--   · profesional  → acceso total, pero SOLO a sus propios consultantes
--     y a los datos de esos consultantes (por "profesionalId")
--   · consultante  → solo SUS filas (por consultantId del perfil)
--   · materiales generales (files sin consultante) → lectura para todos
-- ============================================================

-- ---------- Perfiles (rol y datos de cada cuenta) ----------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb
);

alter table public.profiles enable row level security;

-- El perfil se crea automáticamente al registrarse una cuenta, tomando
-- rol/nombre/consultantId de los metadatos del registro.
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
--     es profiles_admin_update, que ya exige mb_is_owner().
--   · consultantId del cliente: si se copiara tal cual, alguien podría
--     registrarse como "consultante" reclamando el id de la ficha de
--     otra persona (si lo adivina o se filtra en algún lado) y leer su
--     proceso completo. Solo se acepta si ese id corresponde a un
--     consultante real y todavía nadie lo reclamó.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  claimed_role text := coalesce(new.raw_user_meta_data->>'role', 'consultante');
  claimed_cid text := new.raw_user_meta_data->>'consultantId';
  safe_cid text := null;
begin
  if claimed_role = 'consultante' and claimed_cid is not null then
    if exists (select 1 from public.consultants c where c."consultantId" = claimed_cid)
       and not exists (select 1 from public.profiles p where p.data->>'consultantId' = claimed_cid)
    then
      safe_cid := claimed_cid;
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
      'consultantId', safe_cid,
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
create or replace function public.mb_role()
returns text language sql stable security definer set search_path = public
as $$ select data->>'role' from public.profiles where id = auth.uid() $$;

create or replace function public.mb_consultant_id()
returns text language sql stable security definer set search_path = public
as $$ select data->>'consultantId' from public.profiles where id = auth.uid() $$;

-- ¿Es la cuenta dueña de la plataforma? Único rol con permiso para ver y
-- renovar la membresía anual de las demás profesionales (panel
-- /pro/profesionales). Identificada por email, no por id, para no
-- depender de un UUID fijo.
create or replace function public.mb_is_owner()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and data->>'email' = 'irenemorbidelli@gmail.com'
  )
$$;

-- ---------- Consultants (la ficha ES el consultante) ----------
-- Se crea acá, antes de mb_owns_consultant(), porque esa función la
-- referencia y Postgres valida las funciones "language sql" al crearlas.
-- "profesionalId" (dueña de la ficha) es el límite de aislamiento entre
-- profesionales: cada una solo ve y edita sus propios consultantes.
create table if not exists public.consultants (
  id text primary key,
  data jsonb not null,
  "consultantId" text generated always as (data->>'id') stored,
  "profesionalId" text generated always as (data->>'profesionalId') stored
);
-- por si la tabla ya existía de una instalación previa sin esta columna
alter table public.consultants
  add column if not exists "profesionalId" text generated always as (data->>'profesionalId') stored;
create index if not exists consultants_profesional_idx on public.consultants ("profesionalId");
alter table public.consultants enable row level security;
drop policy if exists consultants_pro on public.consultants;
create policy consultants_pro on public.consultants
  for all using (public.mb_role() = 'profesional' and "profesionalId" = auth.uid()::text)
  with check (public.mb_role() = 'profesional' and "profesionalId" = auth.uid()::text);
drop policy if exists consultants_own on public.consultants;
create policy consultants_own on public.consultants
  for select using ("consultantId" = public.mb_consultant_id());

-- ¿La profesional logueada es dueña de este consultante? Security definer
-- para poder consultar `consultants` desde las políticas de las otras
-- tablas sin caer en recursión de RLS.
create or replace function public.mb_owns_consultant(cid text)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.consultants c
    where c."consultantId" = cid and c."profesionalId" = auth.uid()::text
  )
$$;

-- Políticas de profiles: cada cuenta lee su propio perfil; la dueña de la
-- plataforma además puede ver y actualizar los de las demás profesionales
-- (panel /pro/profesionales, para renovar membresías sin tocar Supabase).
drop policy if exists profiles_own on public.profiles;
create policy profiles_own on public.profiles
  for select using (id = auth.uid() or public.mb_is_owner());
drop policy if exists profiles_pro on public.profiles;
drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
  for update using (public.mb_is_owner()) with check (public.mb_is_owner());

-- Autoedición segura del propio perfil (nombre, título, matrícula, teléfono):
-- sin política RLS de "update" para el dueño de la fila, a propósito —
-- así ningún profesional puede tocar su "role" ni "membershipExpiresAt"
-- editando el JSON directo. Solo esta función, con esta lista fija de
-- campos, puede escribir sobre la propia fila.
create or replace function public.mb_update_own_profile(
  p_nombre text default null,
  p_apellido text default null,
  p_titulo text default null,
  p_matricula text default null,
  p_telefono text default null
)
returns void language plpgsql security definer set search_path = public
as $$
begin
  update public.profiles
  set data = data || jsonb_strip_nulls(jsonb_build_object(
    'nombre', p_nombre,
    'apellido', p_apellido,
    'titulo', p_titulo,
    'matricula', p_matricula,
    'telefono', p_telefono
  ))
  where id = auth.uid();
end;
$$;
grant execute on function public.mb_update_own_profile to authenticated;

-- ---------- Resto de colecciones de datos ----------
-- "consultantId" es columna generada desde data para RLS e índices.

-- El acceso de la CONSULTANTE a sus propias filas se calibra por tabla,
-- no en bloque: antes cualquier consultante podía leer/escribir/borrar
-- sus 11 colecciones enteras por RLS, sin importar qué hace realmente la
-- UI. Eso incluía "evaluations" (puntajes 1-5 de uso interno profesional,
-- que el código explícitamente nunca le muestra como número) y
-- "observations" (notas clínicas de la profesional) — accesibles igual
-- por cualquiera que llamara a la API de Supabase directo, sin pasar por
-- la app. Ahora el acceso es el mínimo real que usa el frontend:
--   · own_full   (leer + crear + editar, nunca borrar): lo que la
--     consultante realmente completa — su progreso, sus actividades, si
--     vio un video.
--   · own_insert (leer + crear, sin editar ni borrar): su bitácora de
--     reflexiones.
--   · own_read   (solo leer): trabajo de la profesional que le compete
--     ver — sesiones, archivos compartidos, su informe.
--   · own_none   (nada, ni lectura): trabajo clínico interno de la
--     profesional — evaluaciones, observaciones, agenda, log interno.
do $$
declare
  t text;
begin
  foreach t in array array[
    'sessions','observations','module_progress','activities','assigned_videos',
    'files','reflections','evaluations','compass_snapshots','calendar_events','activity_log'
  ]
  loop
    execute format($f$
      create table if not exists public.%I (
        id text primary key,
        data jsonb not null,
        "consultantId" text generated always as (data->>'consultantId') stored
      )$f$, t);
    execute format('create index if not exists %I on public.%I ("consultantId")', t || '_cid_idx', t);
    execute format('alter table public.%I enable row level security', t);
    -- profesional: acceso total, pero solo a SUS consultantes
    execute format('drop policy if exists %I on public.%I', t || '_pro', t);
    execute format($f$
      create policy %I on public.%I for all
        using (public.mb_role() = 'profesional' and public.mb_owns_consultant("consultantId"))
        with check (public.mb_role() = 'profesional' and public.mb_owns_consultant("consultantId"))$f$, t || '_pro', t);
    -- limpia cualquier política vieja "_own" en bloque (versiones previas
    -- del esquema); las de abajo la reemplazan con el acceso calibrado.
    execute format('drop policy if exists %I on public.%I', t || '_own', t);
    execute format('drop policy if exists %I on public.%I', t || '_own_sel', t);
    execute format('drop policy if exists %I on public.%I', t || '_own_ins', t);
    execute format('drop policy if exists %I on public.%I', t || '_own_upd', t);

    if t = any(array['module_progress','activities','assigned_videos']) then
      -- own_full: leer + crear + editar sus propias filas, nunca borrar
      execute format($f$
        create policy %I on public.%I for select
          using ("consultantId" = public.mb_consultant_id())$f$, t || '_own_sel', t);
      execute format($f$
        create policy %I on public.%I for insert
          with check ("consultantId" = public.mb_consultant_id())$f$, t || '_own_ins', t);
      execute format($f$
        create policy %I on public.%I for update
          using ("consultantId" = public.mb_consultant_id())
          with check ("consultantId" = public.mb_consultant_id())$f$, t || '_own_upd', t);
    elsif t = 'reflections' then
      -- own_insert: su bitácora — leer y crear, no editar ni borrar
      execute format($f$
        create policy %I on public.%I for select
          using ("consultantId" = public.mb_consultant_id())$f$, t || '_own_sel', t);
      execute format($f$
        create policy %I on public.%I for insert
          with check ("consultantId" = public.mb_consultant_id())$f$, t || '_own_ins', t);
    elsif t = any(array['sessions','files','compass_snapshots']) then
      -- own_read: trabajo de la profesional que le compete ver, solo lectura
      execute format($f$
        create policy %I on public.%I for select
          using ("consultantId" = public.mb_consultant_id())$f$, t || '_own_sel', t);
    end if;
    -- own_none (observations, evaluations, calendar_events, activity_log):
    -- ninguna política "_own" — sin ellas, RLS deniega por defecto.

    -- filas sin consultante (agenda personal, archivos generales, log
    -- general…): cualquier profesional las puede gestionar. No todas las
    -- tablas admiten consultantId null, pero la política no molesta a las
    -- que no lo usan — simplemente nunca aplica ahí.
    execute format('drop policy if exists %I on public.%I', t || '_gen', t);
    execute format($f$
      create policy %I on public.%I for all
        using ("consultantId" is null and public.mb_role() = 'profesional')
        with check ("consultantId" is null and public.mb_role() = 'profesional')$f$, t || '_gen', t);
  end loop;
end $$;

-- materiales generales (files sin consultante): además de lo anterior,
-- lectura para cualquier cuenta (incluida consultante), no solo profesional.
drop policy if exists files_general on public.files;
create policy files_general on public.files
  for select using ("consultantId" is null and auth.uid() is not null);

-- ============================================================
-- Listo. Siguiente paso: en Authentication → Providers → Email,
-- DESACTIVAR «Confirm email» (las cuentas de consultantes se
-- crean desde la app sin paso de confirmación).
-- ============================================================
