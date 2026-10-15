import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState, Loading } from '@/components/load-state';
import { Poster } from '@/components/poster';
import { ApiError, searchTitles, type SearchResult } from '@/lib/api';
import { KIND_LABEL } from '@/lib/format';
import { useThemeColors } from '@/lib/theme';

const DEBOUNCE_MS = 400;

type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; query: string; results: SearchResult[] }
  | { status: 'error'; error: ApiError };

export default function SearchScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>({ status: 'idle' });
  const [attempt, setAttempt] = useState(0);
  const latestRequest = useRef(0);

  function changeQuery(text: string) {
    setQuery(text);
    if (text.trim()) {
      // Os resultados anteriores somem enquanto a busca nova espera.
      setState({ status: 'loading' });
    } else {
      latestRequest.current++;
      setState({ status: 'idle' });
    }
  }

  function retry() {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  }

  useEffect(() => {
    const term = query.trim();
    if (!term) return;

    const timer = setTimeout(() => {
      const request = ++latestRequest.current;
      searchTitles(term)
        .then((results) => {
          if (request === latestRequest.current) setState({ status: 'done', query: term, results });
        })
        .catch((error: unknown) => {
          if (request !== latestRequest.current) return;
          setState({
            status: 'error',
            error: error instanceof ApiError ? error : new ApiError('server'),
          });
        });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, attempt]);

  function open(result: SearchResult) {
    router.push(
      result.kind === 'show' ? `/show/${result.tmdbId}` : `/movie/${result.tmdbId}`,
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <TextInput
        value={query}
        onChangeText={changeQuery}
        placeholder="Buscar séries e filmes"
        placeholderTextColor={colors.textMuted}
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
      />

      {state.status === 'idle' && (
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Digite o nome de uma série ou de um filme.
        </Text>
      )}
      {state.status === 'loading' && <Loading />}
      {state.status === 'error' && (
        <ErrorState error={state.error} onRetry={retry} />
      )}
      {state.status === 'done' && (
        <FlatList
          data={state.results}
          keyExtractor={(r) => `${r.kind}-${r.tmdbId}`}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={[styles.hint, { color: colors.textMuted }]}>
              Nada encontrado para “{state.query}”. Confira a grafia.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              onPress={() => open(item)}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
              <Poster path={item.posterPath} width={56} size="w92" />
              <View style={styles.rowText}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[styles.meta, { color: colors.textMuted }]}>
                  {[item.year, KIND_LABEL[item.kind]].filter(Boolean).join(' · ')}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    margin: 16,
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  hint: {
    paddingHorizontal: 24,
    paddingTop: 24,
    fontSize: 15,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    fontSize: 14,
  },
});
