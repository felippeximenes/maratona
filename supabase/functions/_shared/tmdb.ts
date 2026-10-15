import { HttpError } from './http.ts';

// Token de leitura da API do TMDB (v4). Só nos segredos das funções (regra 3).
const TOKEN = Deno.env.get('TMDB_ACCESS_TOKEN');
const BASE_URL = 'https://api.themoviedb.org/3';

export const PT_BR = 'pt-BR';
export const EN_US = 'en-US';

export async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  if (!TOKEN) throw new Error('Missing TMDB_ACCESS_TOKEN secret');
  const url = new URL(BASE_URL + path);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' },
  });
  if (res.status === 404) throw new HttpError(404, 'not_found');
  if (!res.ok) {
    console.error(`TMDB ${res.status} on ${path}`);
    throw new HttpError(502, 'tmdb_unavailable');
  }
  return (await res.json()) as T;
}

export type TmdbTranslations = {
  translations: { iso_639_1: string; data: { overview?: string } }[];
};

/** Overview in pt-BR when TMDB has it; otherwise the English one. */
export function overviewWithFallback(ptBr: string | null | undefined, t?: TmdbTranslations) {
  if (ptBr) return ptBr;
  return t?.translations.find((tr) => tr.iso_639_1 === 'en')?.data.overview || null;
}

export function yearOf(date: string | null | undefined): number | null {
  return date ? Number(date.slice(0, 4)) : null;
}

/** Null for TMDB's empty strings, so dates are stored as "sem data". */
export function dateOrNull(date: string | null | undefined): string | null {
  return date || null;
}

/** Runs `fn` over `items` with at most `limit` calls in flight. */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
