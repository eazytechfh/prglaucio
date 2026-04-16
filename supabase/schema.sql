-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
create type user_role as enum ('admin', 'member');

-- ============================================================
-- TABLE: profiles  (criada ANTES da função get_my_role)
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null unique,
  role        user_role not null default 'member',
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ============================================================
-- SECURITY DEFINER HELPER (evita recursão infinita nas policies)
-- A tabela profiles já existe aqui, então não há erro
-- ============================================================
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text from public.profiles where id = auth.uid()
$$;

-- Policies: profiles
create policy "profiles: own read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: admin read all"
  on public.profiles for select
  using (public.get_my_role() = 'admin');

create policy "profiles: admin insert"
  on public.profiles for insert
  with check (public.get_my_role() = 'admin');

create policy "profiles: admin delete"
  on public.profiles for delete
  using (public.get_my_role() = 'admin');

-- ============================================================
-- TABLE: contacts
-- ============================================================
create table public.contacts (
  id          uuid primary key default uuid_generate_v4(),
  nome        text not null,
  telefone    text not null,
  bairro      text not null,
  igreja      text not null,
  created_by  uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now()
);

alter table public.contacts enable row level security;

create policy "contacts: member select own"
  on public.contacts for select
  using (auth.uid() = created_by);

create policy "contacts: member insert own"
  on public.contacts for insert
  with check (auth.uid() = created_by);

create policy "contacts: member update own"
  on public.contacts for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "contacts: member delete own"
  on public.contacts for delete
  using (auth.uid() = created_by);

create policy "contacts: admin all"
  on public.contacts for all
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

-- ============================================================
-- TRIGGER: cria perfil automaticamente após signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'member')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- VIEWS: agregações para o Dashboard (admin)
-- ============================================================
create or replace view public.contacts_by_bairro as
  select bairro, count(*)::int as total
  from public.contacts
  group by bairro
  order by total desc;

create or replace view public.contacts_by_igreja as
  select igreja, count(*)::int as total
  from public.contacts
  group by igreja
  order by total desc;

grant select on public.contacts_by_bairro to authenticated;
grant select on public.contacts_by_igreja to authenticated;

-- ============================================================
-- CONFIGURAR ADMIN: execute separadamente após criar o usuário
-- UPDATE public.profiles
--   SET role = 'admin', name = 'Pr. Glaucio Goulart'
--   WHERE email = 'prglaucio@seuemail.com';
-- ============================================================
