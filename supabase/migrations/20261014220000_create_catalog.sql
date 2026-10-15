-- M2: catálogo compartilhado, cópia local do TMDB e do TVmaze
-- (04-arquitetura.md, seção 2.2). Qualquer pessoa logada lê; só o servidor
-- grava, pelas Edge Functions com a chave de serviço (que passa por cima do RLS).

create table public.titles (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('show', 'movie')),
  tmdb_id integer not null,
  imdb_id text,
  tvdb_id integer,
  tvmaze_id integer,
  tvmaze_match text not null default 'pending'
    check (tvmaze_match in ('pending', 'matched', 'not_found')),
  name text not null,
  original_name text,
  overview text,
  poster_path text,
  year smallint,
  -- Série: Em produção, Fim da série ou Cancelada.
  production_status text check (production_status in ('in_production', 'ended', 'canceled')),
  typical_runtime smallint,
  -- Filme.
  release_date date,
  runtime smallint,
  runtime_is_estimated boolean,
  has_regular_seasons boolean,
  synced_at timestamptz,
  next_sync_at timestamptz,
  created_at timestamptz not null default now(),
  unique (kind, tmdb_id)
);

create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  title_id uuid not null references public.titles (id) on delete cascade,
  -- 0 = Extras.
  season_number integer not null check (season_number >= 0),
  name text,
  air_date date,
  episode_count integer,
  unique (title_id, season_number)
);

create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  title_id uuid not null references public.titles (id) on delete cascade,
  season_id uuid not null references public.seasons (id) on delete cascade,
  season_number integer not null check (season_number >= 0),
  episode_number integer not null,
  -- Só aparece na tela conforme a regra de spoiler. O resumo não é guardado.
  name text,
  air_date date,
  airstamp timestamptz,
  runtime_tmdb smallint,
  runtime_tvmaze smallint,
  runtime smallint,
  runtime_is_estimated boolean,
  tmdb_episode_id integer,
  tvmaze_episode_id integer,
  unique (title_id, season_number, episode_number)
);

create index episodes_season_id_idx on public.episodes (season_id);

-- Toda tabela nasce com RLS ligado e sem permissões; abrimos uma a uma.
alter table public.titles enable row level security;
alter table public.seasons enable row level security;
alter table public.episodes enable row level security;

revoke all on table public.titles, public.seasons, public.episodes from anon, authenticated;
grant select on table public.titles, public.seasons, public.episodes to authenticated;

create policy "titles: logged-in read" on public.titles
  for select to authenticated using (true);
create policy "seasons: logged-in read" on public.seasons
  for select to authenticated using (true);
create policy "episodes: logged-in read" on public.episodes
  for select to authenticated using (true);
