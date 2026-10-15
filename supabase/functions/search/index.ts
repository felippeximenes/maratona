// Buscar: consulta o TMDB (séries e filmes) e devolve os resultados.
// Marcar o que já está no acervo entra no M3, com user_titles.

import { handle, HttpError, json } from '../_shared/http.ts';
import { requireUser } from '../_shared/supabase.ts';
import { PT_BR, tmdb, yearOf } from '../_shared/tmdb.ts';

type MultiResult = {
  id: number;
  media_type: 'tv' | 'movie' | 'person' | 'collection';
  name?: string;
  title?: string;
  first_air_date?: string;
  release_date?: string;
  poster_path: string | null;
};

Deno.serve(
  handle(async (req) => {
    await requireUser(req);
    const { query } = await req.json().catch(() => ({}));
    if (typeof query !== 'string' || !query.trim()) throw new HttpError(400, 'missing_query');

    const data = await tmdb<{ results: MultiResult[] }>('/search/multi', {
      query: query.trim(),
      language: PT_BR,
      include_adult: 'false',
      page: '1',
    });

    const results = data.results
      .filter((r) => r.media_type === 'tv' || r.media_type === 'movie')
      .map((r) => ({
        kind: r.media_type === 'tv' ? 'show' : 'movie',
        tmdbId: r.id,
        name: r.name ?? r.title ?? '',
        year: yearOf(r.first_air_date ?? r.release_date),
        posterPath: r.poster_path,
      }));

    return json({ results });
  }),
);
