// Página da série, Página do filme e tela Episódio.
// Busca no TMDB e grava no catálogo quando o título falta ou está velho
// (série: 24 h; filme: 7 dias). O resumo do episódio vem do TMDB na hora e
// não é guardado (decisão 6 de 04-arquitetura.md).

import { movieRuntime, seasonRuntimes } from '../../../core/src/runtime.ts';
import { handle, HttpError, json } from '../_shared/http.ts';
import { admin, requireUser } from '../_shared/supabase.ts';
import {
  dateOrNull,
  EN_US,
  mapLimit,
  overviewWithFallback,
  PT_BR,
  tmdb,
  type TmdbTranslations,
  yearOf,
} from '../_shared/tmdb.ts';

const HOUR = 60 * 60 * 1000;
const MAX_AGE = { show: 24 * HOUR, movie: 7 * 24 * HOUR };
const PAGE_SIZE = 1000;

type Kind = 'show' | 'movie';

type TitleRow = {
  id: string;
  kind: Kind;
  tmdb_id: number;
  name: string;
  year: number | null;
  overview: string | null;
  poster_path: string | null;
  production_status: 'in_production' | 'ended' | 'canceled' | null;
  release_date: string | null;
  runtime: number | null;
  runtime_is_estimated: boolean | null;
  synced_at: string | null;
};

type EpisodeRow = {
  id: string;
  season_id: string;
  season_number: number;
  episode_number: number;
  name: string | null;
  air_date: string | null;
  airstamp: string | null;
  runtime: number | null;
  runtime_is_estimated: boolean | null;
};

const TITLE_COLUMNS =
  'id, kind, tmdb_id, name, year, overview, poster_path, production_status, release_date, runtime, runtime_is_estimated, synced_at';
const EPISODE_COLUMNS =
  'id, season_id, season_number, episode_number, name, air_date, airstamp, runtime, runtime_is_estimated';

Deno.serve(
  handle(async (req) => {
    await requireUser(req);
    const body = await req.json().catch(() => ({}));

    if (typeof body.episodeId === 'string') {
      return json(await loadEpisode(body.episodeId));
    }
    if ((body.kind === 'show' || body.kind === 'movie') && Number.isInteger(body.tmdbId)) {
      return json(await loadTitle(body.kind, body.tmdbId));
    }
    throw new HttpError(400, 'bad_request');
  }),
);

// ---------------------------------------------------------------------------
// Título

async function loadTitle(kind: Kind, tmdbId: number) {
  let title = await findTitle(kind, tmdbId);
  const isStale =
    !title?.synced_at || Date.now() - new Date(title.synced_at).getTime() > MAX_AGE[kind];

  if (isStale) {
    try {
      title = kind === 'show' ? await syncShow(tmdbId, title?.id) : await syncMovie(tmdbId);
    } catch (error) {
      // Com o TMDB fora, um catálogo velho é melhor que erro.
      if (!title || (error instanceof HttpError && error.status === 404)) throw error;
      console.error(`Sync failed for ${kind} ${tmdbId}; serving cached copy`, error);
    }
  }
  if (!title) throw new HttpError(404, 'not_found');

  return {
    title: toTitlePayload(title),
    seasons: kind === 'show' ? await readSeasons(title.id) : [],
  };
}

async function findTitle(kind: Kind, tmdbId: number): Promise<TitleRow | null> {
  const { data, error } = await admin
    .from('titles')
    .select(TITLE_COLUMNS)
    .eq('kind', kind)
    .eq('tmdb_id', tmdbId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

function toTitlePayload(t: TitleRow) {
  return {
    id: t.id,
    kind: t.kind,
    tmdbId: t.tmdb_id,
    name: t.name,
    year: t.year,
    overview: t.overview,
    posterPath: t.poster_path,
    productionStatus: t.production_status,
    releaseDate: t.release_date,
    runtime: t.runtime,
    runtimeIsEstimated: t.runtime_is_estimated,
  };
}

function toEpisodePayload(e: EpisodeRow) {
  return {
    id: e.id,
    seasonNumber: e.season_number,
    episodeNumber: e.episode_number,
    name: e.name,
    airDate: e.air_date,
    airstamp: e.airstamp,
    runtime: e.runtime,
    runtimeIsEstimated: e.runtime_is_estimated,
  };
}

async function readSeasons(titleId: string) {
  const { data: seasons, error } = await admin
    .from('seasons')
    .select('id, season_number, name, air_date, episode_count')
    .eq('title_id', titleId)
    .order('season_number');
  if (error) throw error;

  const episodes = await readEpisodes(titleId);
  return seasons.map((s) => ({
    id: s.id,
    seasonNumber: s.season_number,
    name: s.name,
    airDate: s.air_date,
    episodes: episodes.filter((e) => e.season_id === s.id).map(toEpisodePayload),
  }));
}

/** All episodes of a title, in order, paging past PostgREST's row limit. */
async function readEpisodes(titleId: string): Promise<EpisodeRow[]> {
  const all: EpisodeRow[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await admin
      .from('episodes')
      .select(EPISODE_COLUMNS)
      .eq('title_id', titleId)
      .order('season_number')
      .order('episode_number')
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    all.push(...data);
    if (data.length < PAGE_SIZE) return all;
  }
}

// ---------------------------------------------------------------------------
// Sincronização com o TMDB

type TmdbShow = TmdbTranslations & {
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  first_air_date: string;
  status: string;
  episode_run_time: number[];
  seasons: { season_number: number; name: string; air_date: string | null; episode_count: number }[];
  external_ids: { imdb_id: string | null; tvdb_id: number | null };
};

type TmdbSeason = {
  episodes: {
    id: number;
    episode_number: number;
    name: string;
    air_date: string | null;
    runtime: number | null;
  }[];
};

type TmdbMovie = TmdbTranslations & {
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  runtime: number | null;
  imdb_id: string | null;
};

// "Returning Series", "In Production", "Planned" e "Pilot" contam como Em produção.
function productionStatus(status: string): TitleRow['production_status'] {
  if (status === 'Ended') return 'ended';
  if (status === 'Canceled') return 'canceled';
  return 'in_production';
}

// Sem tradução, o TMDB devolve "Episódio 5" em português.
const GENERIC_EPISODE_NAME = /^Episódio \d+$/;

async function syncShow(tmdbId: number, existingId?: string): Promise<TitleRow> {
  const show = await tmdb<TmdbShow>(`/tv/${tmdbId}`, {
    language: PT_BR,
    append_to_response: 'external_ids,translations',
  });

  const seasonNumbers = show.seasons.map((s) => s.season_number);
  const seasonDetails = await mapLimit(seasonNumbers, 6, async (n) => {
    // Temporada listada na série mas sem página no TMDB vira temporada vazia.
    const pt = await tmdb<TmdbSeason>(`/tv/${tmdbId}/season/${n}`, { language: PT_BR }).catch(
      (error) => {
        if (error instanceof HttpError && error.status === 404) return { episodes: [] };
        throw error;
      },
    );
    const needsEnglish = pt.episodes.some((e) => !e.name || GENERIC_EPISODE_NAME.test(e.name));
    const en = needsEnglish
      ? await tmdb<TmdbSeason>(`/tv/${tmdbId}/season/${n}`, { language: EN_US })
      : null;
    return { pt, en };
  });

  // Durações do TVmaze já gravadas entram na R25 junto com as do TMDB.
  const tvmazeRuntimes = new Map<string, number | null>();
  if (existingId) {
    const { data, error } = await admin
      .from('episodes')
      .select('season_number, episode_number, runtime_tvmaze')
      .eq('title_id', existingId)
      .not('runtime_tvmaze', 'is', null);
    if (error) throw error;
    for (const e of data) tvmazeRuntimes.set(`${e.season_number}x${e.episode_number}`, e.runtime_tvmaze);
  }

  const typicalRuntime = show.episode_run_time[0] ?? null;
  const { data: title, error: titleError } = await admin
    .from('titles')
    .upsert(
      {
        kind: 'show',
        tmdb_id: tmdbId,
        imdb_id: show.external_ids.imdb_id,
        tvdb_id: show.external_ids.tvdb_id,
        name: show.name,
        original_name: show.original_name,
        overview: overviewWithFallback(show.overview, show),
        poster_path: show.poster_path,
        year: yearOf(show.first_air_date),
        production_status: productionStatus(show.status),
        typical_runtime: typicalRuntime,
        has_regular_seasons: seasonNumbers.some((n) => n >= 1),
        synced_at: new Date().toISOString(),
      },
      { onConflict: 'kind,tmdb_id' },
    )
    .select(TITLE_COLUMNS)
    .single();
  if (titleError) throw titleError;

  const { data: seasons, error: seasonsError } = await admin
    .from('seasons')
    .upsert(
      show.seasons.map((s) => ({
        title_id: title.id,
        season_number: s.season_number,
        name: s.name,
        air_date: dateOrNull(s.air_date),
        episode_count: s.episode_count,
      })),
      { onConflict: 'title_id,season_number' },
    )
    .select('id, season_number');
  if (seasonsError) throw seasonsError;
  const seasonIds = new Map(seasons.map((s) => [s.season_number, s.id]));

  const episodes = seasonNumbers.flatMap((n, i) => {
    const { pt, en } = seasonDetails[i];
    const runtimes = seasonRuntimes(
      pt.episodes.map((e) => ({
        runtimeTmdb: e.runtime,
        runtimeTvmaze: tvmazeRuntimes.get(`${n}x${e.episode_number}`) ?? null,
      })),
      typicalRuntime,
    );
    return pt.episodes.map((e, j) => {
      const englishName = en?.episodes.find((x) => x.episode_number === e.episode_number)?.name;
      const hasPortugueseName = e.name && !GENERIC_EPISODE_NAME.test(e.name);
      return {
        title_id: title.id,
        season_id: seasonIds.get(n)!,
        season_number: n,
        episode_number: e.episode_number,
        name: hasPortugueseName ? e.name : englishName || e.name || null,
        air_date: dateOrNull(e.air_date),
        runtime_tmdb: e.runtime,
        runtime: runtimes[j].runtime,
        runtime_is_estimated: runtimes[j].isEstimated,
        tmdb_episode_id: e.id,
      };
    });
  });

  // Episódios sumidos do TMDB ficam; tratar isso entra com os registros (M4).
  for (let from = 0; from < episodes.length; from += PAGE_SIZE) {
    const { error } = await admin
      .from('episodes')
      .upsert(episodes.slice(from, from + PAGE_SIZE), {
        onConflict: 'title_id,season_number,episode_number',
      });
    if (error) throw error;
  }

  return title;
}

async function syncMovie(tmdbId: number): Promise<TitleRow> {
  const movie = await tmdb<TmdbMovie>(`/movie/${tmdbId}`, {
    language: PT_BR,
    append_to_response: 'translations',
  });
  const { runtime, isEstimated } = movieRuntime(movie.runtime);

  const { data, error } = await admin
    .from('titles')
    .upsert(
      {
        kind: 'movie',
        tmdb_id: tmdbId,
        imdb_id: movie.imdb_id,
        name: movie.title,
        original_name: movie.original_title,
        overview: overviewWithFallback(movie.overview, movie),
        poster_path: movie.poster_path,
        year: yearOf(movie.release_date),
        release_date: dateOrNull(movie.release_date),
        runtime,
        runtime_is_estimated: isEstimated,
        synced_at: new Date().toISOString(),
      },
      { onConflict: 'kind,tmdb_id' },
    )
    .select(TITLE_COLUMNS)
    .single();
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Episódio

async function loadEpisode(episodeId: string) {
  const { data: episode, error } = await admin
    .from('episodes')
    .select(`${EPISODE_COLUMNS}, title:titles!inner(id, tmdb_id, name)`)
    .eq('id', episodeId)
    .maybeSingle();
  if (error) throw error;
  if (!episode) throw new HttpError(404, 'not_found');

  const show = episode.title as unknown as { id: string; tmdb_id: number; name: string };

  // Anterior e seguinte andam dentro da mesma seção: temporadas ou Extras.
  const isExtra = episode.season_number === 0;
  const siblings = (await readEpisodes(show.id)).filter(
    (e) => (e.season_number === 0) === isExtra,
  );
  const index = siblings.findIndex((e) => e.id === episode.id);

  return {
    episode: toEpisodePayload(episode),
    show: { id: show.id, tmdbId: show.tmdb_id, name: show.name },
    overview: await fetchEpisodeOverview(show.tmdb_id, episode.season_number, episode.episode_number),
    previousId: siblings[index - 1]?.id ?? null,
    nextId: siblings[index + 1]?.id ?? null,
  };
}

async function fetchEpisodeOverview(showTmdbId: number, season: number, episode: number) {
  const path = `/tv/${showTmdbId}/season/${season}/episode/${episode}`;
  try {
    const pt = await tmdb<{ overview: string }>(path, { language: PT_BR });
    if (pt.overview) return pt.overview;
    const en = await tmdb<{ overview: string }>(path, { language: EN_US });
    return en.overview || null;
  } catch (error) {
    // Sem resumo, a tela Episódio ainda abre com o resto.
    console.error(`Overview fetch failed for ${path}`, error);
    return null;
  }
}
