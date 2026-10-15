// R20: momento de exibição de um episódio, com uma de três qualidades.
// Quando há horário (TVmaze), ele vence a data do TMDB.

export type AirMoment =
  | { quality: 'exact'; at: Date }
  | { quality: 'date'; date: string }
  | { quality: 'none' };

export function airMoment(episode: {
  airDate: string | null;
  airstamp: string | null;
}): AirMoment {
  if (episode.airstamp) {
    return { quality: 'exact', at: new Date(episode.airstamp) };
  }
  if (episode.airDate) {
    return { quality: 'date', date: episode.airDate };
  }
  return { quality: 'none' };
}
