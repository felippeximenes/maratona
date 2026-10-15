import { formatEpisodeCode } from '@glowbox/core/episode-code.ts';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ErrorState, Loading, OfflineBanner } from '@/components/load-state';
import { Poster } from '@/components/poster';
import { useRemote } from '@/hooks/use-remote';
import { getTitle, type Season } from '@/lib/api';
import { formatAirMoment, PRODUCTION_STATUS_LABEL } from '@/lib/format';
import { type ThemeColors, useThemeColors } from '@/lib/theme';

export default function ShowScreen() {
  const colors = useThemeColors();
  const tmdbId = Number(useLocalSearchParams<{ tmdbId: string }>().tmdbId);
  const { data, error, isLoading, isOffline, retry } = useRemote(`show:${tmdbId}`, () =>
    getTitle('show', tmdbId),
  );

  const header = <Stack.Screen options={{ title: data?.title.name ?? '' }} />;
  if (!data) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {header}
        {error && !isLoading ? <ErrorState error={error} onRetry={retry} /> : <Loading />}
      </View>
    );
  }

  const { title, seasons } = data;
  const regular = seasons.filter((s) => s.seasonNumber > 0);
  const extras = seasons.find((s) => s.seasonNumber === 0);
  const hasEpisodes = seasons.some((s) => s.episodes.length > 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {header}
      {isOffline && <OfflineBanner />}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Poster path={title.posterPath} width={110} />
          <View style={styles.heroText}>
            <Text style={[styles.name, { color: colors.text }]}>{title.name}</Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              {[title.year, title.productionStatus && PRODUCTION_STATUS_LABEL[title.productionStatus]]
                .filter(Boolean)
                .join(' · ')}
            </Text>
          </View>
        </View>

        {title.overview && (
          <Text style={[styles.overview, { color: colors.text }]}>{title.overview}</Text>
        )}

        {!hasEpisodes && (
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            Esta série ainda não tem episódios cadastrados.
          </Text>
        )}

        {regular.map((season) => (
          <SeasonSection
            key={season.id}
            season={season}
            label={`Temporada ${season.seasonNumber}`}
            colors={colors}
          />
        ))}
        {extras && extras.episodes.length > 0 && (
          <SeasonSection season={extras} label="Extras" colors={colors} />
        )}
      </ScrollView>
    </View>
  );
}

function SeasonSection({
  season,
  label,
  colors,
}: {
  season: Season;
  label: string;
  colors: ThemeColors;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const count = season.episodes.length;

  return (
    <View style={[styles.season, { borderColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen((open) => !open)}
        style={styles.seasonHeader}>
        <Text style={[styles.seasonTitle, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          {count === 1 ? '1 episódio' : `${count} episódios`} {isOpen ? '▴' : '▾'}
        </Text>
      </Pressable>

      {/* Episódio não visto não mostra título (diretriz de voz 8). */}
      {isOpen &&
        season.episodes.map((episode) => (
          <Pressable
            key={episode.id}
            accessibilityRole="button"
            onPress={() => router.push(`/episode/${episode.id}`)}
            style={({ pressed }) => [styles.episode, pressed && { opacity: 0.6 }]}>
            <Text style={[styles.episodeCode, { color: colors.text }]}>
              {formatEpisodeCode(episode.seasonNumber, episode.episodeNumber)}
            </Text>
            <Text style={[styles.episodeDate, { color: colors.textMuted }]}>
              {formatAirMoment(episode)}
            </Text>
          </Pressable>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  hero: {
    flexDirection: 'row',
    gap: 16,
  },
  heroText: {
    flex: 1,
    gap: 6,
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  meta: {
    fontSize: 14,
  },
  overview: {
    fontSize: 15,
    lineHeight: 22,
  },
  empty: {
    fontSize: 15,
  },
  season: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  seasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  seasonTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  episode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
  episodeCode: {
    width: 72,
    fontSize: 15,
    fontWeight: '500',
  },
  episodeDate: {
    flex: 1,
    fontSize: 14,
  },
});
