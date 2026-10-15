// R25: duração usada nas contas, escolhida nesta ordem: TMDB do episódio,
// TVmaze do episódio, média conhecida da temporada, típica da série, 40 min.
// Filme: TMDB ou 100 min. Zero ou acima de 5 horas conta como ausente.

export const DEFAULT_EPISODE_RUNTIME = 40;
export const DEFAULT_MOVIE_RUNTIME = 100;
const MAX_RUNTIME = 300;

export type Runtime = { runtime: number; isEstimated: boolean };

function valid(minutes: number | null | undefined): number | null {
  return minutes != null && minutes > 0 && minutes <= MAX_RUNTIME ? minutes : null;
}

/** Durações de todos os episódios de uma temporada, na mesma ordem. */
export function seasonRuntimes(
  episodes: { runtimeTmdb: number | null; runtimeTvmaze: number | null }[],
  typicalRuntime: number | null,
): Runtime[] {
  const known = episodes.map((e) => valid(e.runtimeTmdb) ?? valid(e.runtimeTvmaze));
  const knownValues = known.filter((m): m is number => m != null);
  const seasonAverage = knownValues.length
    ? Math.round(knownValues.reduce((sum, m) => sum + m, 0) / knownValues.length)
    : null;
  const fallback = seasonAverage ?? valid(typicalRuntime) ?? DEFAULT_EPISODE_RUNTIME;

  return known.map((m) =>
    m != null ? { runtime: m, isEstimated: false } : { runtime: fallback, isEstimated: true },
  );
}

export function movieRuntime(runtimeTmdb: number | null): Runtime {
  const m = valid(runtimeTmdb);
  return m != null
    ? { runtime: m, isEstimated: false }
    : { runtime: DEFAULT_MOVIE_RUNTIME, isEstimated: true };
}
