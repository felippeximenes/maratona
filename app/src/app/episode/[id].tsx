import { formatEpisodeCode } from '@glowbox/core/episode-code.ts';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ErrorState, Loading, OfflineBanner } from '@/components/load-state';
import { useRemote } from '@/hooks/use-remote';
import { getEpisode } from '@/lib/api';
import { formatAirMoment, formatRuntime, isUpcoming } from '@/lib/format';
import { useThemeColors } from '@/lib/theme';

export default function EpisodeScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, error, isLoading, isOffline, retry } = useRemote(`episode:${id}`, () =>
    getEpisode(id),
  );
  // Mostrar título e resumo vale só para esta vez (diretriz de voz 8).
  const [isRevealed, setIsRevealed] = useState(false);

  const code = data ? formatEpisodeCode(data.episode.seasonNumber, data.episode.episodeNumber) : '';
  const header = <Stack.Screen options={{ title: code }} />;
  if (!data) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {header}
        {error && !isLoading ? <ErrorState error={error} onRetry={retry} /> : <Loading />}
      </View>
    );
  }

  const { episode, show, overview, previousId, nextId } = data;
  const upcoming = isUpcoming(episode);

  function go(episodeId: string) {
    router.replace(`/episode/${episodeId}`);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {header}
      {isOffline && <OfflineBanner />}
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityRole="link"
          onPress={() => router.dismissTo(`/show/${show.tmdbId}`)}>
          <Text style={[styles.show, { color: colors.accent }]}>{show.name}</Text>
        </Pressable>
        <Text style={[styles.code, { color: colors.text }]}>{code}</Text>

        <View style={styles.facts}>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {upcoming ? 'Estreia: ' : ''}
            {formatAirMoment(episode)}
          </Text>
          {episode.runtime != null && (
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              {formatRuntime(episode.runtime, episode.runtimeIsEstimated)}
            </Text>
          )}
        </View>

        {isRevealed ? (
          <View style={styles.spoiler}>
            {episode.name && (
              <Text style={[styles.name, { color: colors.text }]}>{episode.name}</Text>
            )}
            <Text style={[styles.overview, { color: colors.text }]}>
              {overview ?? 'O TMDB ainda não tem resumo deste episódio.'}
            </Text>
          </View>
        ) : (
          <View style={[styles.hidden, { backgroundColor: colors.surface }]}>
            <Text style={[styles.meta, { color: colors.textMuted }]}>
              Título e resumo ficam escondidos até você ver o episódio.
            </Text>
            <Pressable accessibilityRole="button" onPress={() => setIsRevealed(true)}>
              <Text style={[styles.action, { color: colors.accent }]}>Mostrar mesmo assim</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.nav}>
          <NavButton label="Anterior" target={previousId} onPress={go} color={colors.accent} />
          <NavButton label="Seguinte" target={nextId} onPress={go} color={colors.accent} />
        </View>
      </ScrollView>
    </View>
  );
}

function NavButton({
  label,
  target,
  onPress,
  color,
}: {
  label: string;
  target: string | null;
  onPress: (id: string) => void;
  color: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !target }}
      disabled={!target}
      onPress={() => target && onPress(target)}
      style={[styles.navButton, !target && { opacity: 0.3 }]}>
      <Text style={[styles.action, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  show: {
    fontSize: 15,
    fontWeight: '600',
  },
  code: {
    fontSize: 28,
    fontWeight: '700',
  },
  facts: {
    gap: 4,
  },
  meta: {
    fontSize: 14,
  },
  spoiler: {
    gap: 8,
    paddingTop: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  overview: {
    fontSize: 15,
    lineHeight: 22,
  },
  hidden: {
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  action: {
    fontSize: 15,
    fontWeight: '600',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  navButton: {
    minHeight: 44,
    justifyContent: 'center',
  },
});
