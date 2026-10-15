import { airMoment } from '@glowbox/core/air-moment.ts';

import type { Episode, Kind, ProductionStatus } from '@/lib/api';

const POSTER_BASE = 'https://image.tmdb.org/t/p/';

/** Pôster no CDN público do TMDB (sem chave). */
export function posterUrl(path: string | null, width: 'w92' | 'w185' | 'w342' = 'w185') {
  return path ? `${POSTER_BASE}${width}${path}` : null;
}

export const KIND_LABEL: Record<Kind, string> = { show: 'Série', movie: 'Filme' };

export const PRODUCTION_STATUS_LABEL: Record<ProductionStatus, string> = {
  in_production: 'Em produção',
  ended: 'Fim da série',
  canceled: 'Cancelada',
};

/** "2026-10-18" vira "18/10/2026", sem conversão de fuso (R23). */
export function formatDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function todayLocal(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function isFutureDate(date: string): boolean {
  return date > todayLocal();
}

const dateTime = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** Data e hora de exibição de um episódio (R20, R23). */
export function formatAirMoment(episode: Pick<Episode, 'airDate' | 'airstamp'>): string {
  const moment = airMoment(episode);
  switch (moment.quality) {
    case 'exact':
      return dateTime.format(moment.at).replace(',', ' às');
    case 'date':
      return `${formatDate(moment.date)} · horário não informado`;
    case 'none':
      return 'sem data';
  }
}

/** Ainda não foi ao ar: data no futuro, ou momento exato depois de agora. */
export function isUpcoming(episode: Pick<Episode, 'airDate' | 'airstamp'>): boolean {
  const moment = airMoment(episode);
  if (moment.quality === 'exact') return moment.at.getTime() > Date.now();
  if (moment.quality === 'date') return isFutureDate(moment.date);
  return false;
}

export function formatRuntime(minutes: number, isEstimated: boolean | null): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const text = hours ? (rest ? `${hours} h ${rest} min` : `${hours} h`) : `${rest} min`;
  return isEstimated ? `cerca de ${text}` : text;
}
