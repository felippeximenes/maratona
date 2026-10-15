import { FunctionsFetchError, FunctionsHttpError } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export type Kind = 'show' | 'movie';
export type ProductionStatus = 'in_production' | 'ended' | 'canceled';

export type SearchResult = {
  kind: Kind;
  tmdbId: number;
  name: string;
  year: number | null;
  posterPath: string | null;
};

export type Episode = {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  name: string | null;
  airDate: string | null;
  airstamp: string | null;
  runtime: number | null;
  runtimeIsEstimated: boolean | null;
};

export type Season = {
  id: string;
  seasonNumber: number;
  name: string | null;
  airDate: string | null;
  episodes: Episode[];
};

export type Title = {
  id: string;
  kind: Kind;
  tmdbId: number;
  name: string;
  year: number | null;
  overview: string | null;
  posterPath: string | null;
  productionStatus: ProductionStatus | null;
  releaseDate: string | null;
  runtime: number | null;
  runtimeIsEstimated: boolean | null;
};

export type TitleDetails = { title: Title; seasons: Season[] };

export type EpisodeDetails = {
  episode: Episode;
  show: { id: string; tmdbId: number; name: string };
  overview: string | null;
  previousId: string | null;
  nextId: string | null;
};

export type ApiErrorKind = 'offline' | 'not_found' | 'server';

export class ApiError extends Error {
  constructor(readonly kind: ApiErrorKind) {
    super(kind);
  }
}

async function call<T>(name: string, body: object): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>(name, { body });
  if (!error) return data as T;

  if (error instanceof FunctionsFetchError) throw new ApiError('offline');
  if (error instanceof FunctionsHttpError && (error.context as Response).status === 404) {
    throw new ApiError('not_found');
  }
  console.warn(`Function ${name} failed`, error);
  throw new ApiError('server');
}

export async function searchTitles(query: string): Promise<SearchResult[]> {
  const { results } = await call<{ results: SearchResult[] }>('search', { query });
  return results;
}

export function getTitle(kind: Kind, tmdbId: number): Promise<TitleDetails> {
  return call('title', { kind, tmdbId });
}

export function getEpisode(episodeId: string): Promise<EpisodeDetails> {
  return call('title', { episodeId });
}
