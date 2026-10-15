import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ApiError } from '@/lib/api';
import { useThemeColors } from '@/lib/theme';

const MESSAGES: Record<ApiError['kind'], string> = {
  offline: 'Sem internet. Confira a conexão e tente de novo.',
  not_found: 'Não encontramos este título.',
  server: 'Não deu para carregar agora. Tente de novo em instantes.',
};

export function Loading() {
  const colors = useThemeColors();
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.textMuted} />
    </View>
  );
}

export function ErrorState({ error, onRetry }: { error: ApiError; onRetry: () => void }) {
  const colors = useThemeColors();
  return (
    <View style={styles.center}>
      <Text style={[styles.message, { color: colors.text }]}>{MESSAGES[error.kind]}</Text>
      {error.kind !== 'not_found' && (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={[styles.button, { backgroundColor: colors.accent }]}>
          <Text style={styles.buttonText}>Tentar de novo</Text>
        </Pressable>
      )}
    </View>
  );
}

export function OfflineBanner() {
  const colors = useThemeColors();
  return (
    <View style={[styles.banner, { backgroundColor: colors.surface }]}>
      <Text style={[styles.bannerText, { color: colors.textMuted }]}>
        Sem internet. Mostrando o que foi carregado antes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  banner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bannerText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
