// Abreviação de episódio do glossário: temporada 2, episódio 5 vira "T2 E5".
export function formatEpisodeCode(seasonNumber: number, episodeNumber: number): string {
  return `T${seasonNumber} E${episodeNumber}`;
}
