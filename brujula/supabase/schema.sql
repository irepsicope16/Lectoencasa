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
-- Seguridad (RLS):
--   · profesional  → acceso total a todas las colecciones
--   · consultante  → solo SUS filas (por consultantId del perfil)
--   · materiales generales (files sin consultante) → lectura para todos
-- ============================================================

-- ---------- Perfiles (rol y datos de cada cuenta) ----------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb
);

alter table public.profiles enable row level security;

-- El perfil se crea automáticamente al registrarse una cuenta,
-- tomando rol/nombre/consultantId de los metadatos del registro.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, data)
  values (
    new.id,
    jsonb_build_object(
      'role', coalesce(new.raw_user_meta_data->>'role', 'consultante'),
      'nombre', coalesce(new.raw_user_meta_data->>'nombre', ''),
      'apellido', coalesce(new.raw_user_meta_data->>'apellido', ''),
      'titulo', new.raw_user_meta_data->>'titulo',
      'consultantId', new.raw_user_meta_data->>'consultantId',
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

-- Políticas de profiles
drop policy if exists profiles_own on public.profiles;
create policy profiles_own on public.profiles
  for select using (id = auth.uid());
drop policy if exists profiles_pro on public.profiles;
create policy profiles_pro on public.profiles
  for select using (public.mb_role() = 'profesional');

-- ---------- Colecciones de datos ----------
-- "consultantId" es columna generada desde data para RLS e índices.
-- En `consultants` se genera desde data->>'id' (la ficha ES el consultante).

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
    -- profesional: acceso total
    execute format('drop policy if exists %I on public.%I', t || '_pro', t);
    execute format($f$
      create policy %I on public.%I for all
        using (public.mb_role() = 'profesional')
        with check (public.mb_role() = 'profesional')$f$, t || '_pro', t);
    -- consultante: solo sus filas
    execute format('drop policy if exists %I on public.%I', t || '_own', t);
    execute format($f$
      create policy %I on public.%I for all
        using ("consultantId" = public.mb_consultant_id())
        with check ("consultantId" = public.mb_consultant_id())$f$, t || '_own', t);
  end loop;
end $$;

-- consultants: igual, pero el id de la fila ES el consultantId
create table if not exists public.consultants (
  id text primary key,
  data jsonb not null,
  "consultantId" text generated always as (data->>'id') stored
);
alter table public.consultants enable row level security;
drop policy if exists consultants_pro on public.consultants;
create policy consultants_pro on public.consultants
  for all using (public.mb_role() = 'profesional')
  with check (public.mb_role() = 'profesional');
drop policy if exists consultants_own on public.consultants;
create policy consultants_own on public.consultants
  for select using ("consultantId" = public.mb_consultant_id());

-- materiales generales (files sin consultante): lectura para cualquier cuenta
drop policy if exists files_general on public.files;
create policy files_general on public.files
  for select using ("consultantId" is null and auth.uid() is not null);

-- ============================================================
-- Listo. Siguiente paso: en Authentication → Providers → Email,
-- DESACTIVAR «Confirm email» (las cuentas de consultantes se
-- crean desde la app sin paso de confirmación).
-- ============================================================
