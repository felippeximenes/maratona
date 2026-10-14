-- M1: perfil da pessoa (04-arquitetura.md, seção 2.1).
-- Só as colunas que o M1 usa; as demais entram nos marcos que precisam delas.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  auth_provider text not null check (auth_provider in ('google', 'apple')),
  created_at timestamptz not null default now()
);

-- Toda tabela nasce com RLS ligado e sem permissões; abrimos uma a uma.
alter table public.profiles enable row level security;
revoke all on table public.profiles from anon, authenticated;

grant select on table public.profiles to authenticated;

create policy "profiles: read own row"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

-- Cria o perfil no primeiro login, com nome e foto vindos do Google ou da Apple.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url, auth_provider)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    new.raw_app_meta_data ->> 'provider'
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
