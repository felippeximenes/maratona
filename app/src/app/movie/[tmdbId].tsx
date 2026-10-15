import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ErrorState, Loading, OfflineBanner } from '@/components/load-state';
import { Poster } from '@/components/poster';
import { useRemote } from '@/hooks/use-remote';
import { getTitle } from '@/lib/api';
import { formatDate, formatRuntime, isFutureDate } from '@/lib/format';
import { useThemeColors } from '@/lib/theme';

export default function MovieScreen() {
  const colors = useThemeColors();
  const tmdbId = Number(useLocalSearchParams<{ tmdbId: string }>().tmdbId);
  const { data, error, isLoading, isOffline, retry } = useRemote(`movie:${tmdbId}`, () =>
    getTitle('movie', tmdbId),
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

  const { title } = data;
  const isUnreleased = title.releaseDate != null && isFutureDate(title.releaseDate);
  const meta = [
    title.year,
    // Duração estimada (padrão de 100 min) não diz nada do filme; fica de fora.
    title.runtime && !title.runtimeIsEstimated && formatRuntime(title.runtime, false),
  ].filter(Boolean);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {header}
      {isOffline && <OfflineBanner />}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Poster path={title.posterPath} width={110} />
          <View style={styles.heroText}>
            <Text style={[styles.name, { color: colors.text }]}>{title.name}</Text>
            {meta.length > 0 && (
              <Text style={[styles.meta, { color: colors.textMuted }]}>{meta.join(' · ')}</Text>
            )}
            {isUnreleased && (
              <Text style={[styles.meta, { color: colors.textMuted }]}>
                Estreia em {formatDate(title.releaseDate!)}
              </Text>
            )}
          </View>
        </View>

        {title.overview && (
          <Text style={[styles.overview, { color: colors.text }]}>{title.overview}</Text>
        )}
      </ScrollView>
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
});
