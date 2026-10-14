import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { signInWithGoogle, SignInError } from '@/lib/auth';

export default function SignInScreen() {
  const isDark = useColorScheme() === 'dark';
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const textColor = isDark ? '#fff' : '#000';

  async function handleGoogle() {
    setIsBusy(true);
    setErrorMessage(null);
    try {
      // Com sucesso, a troca de sessão leva às abas.
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(
        error instanceof SignInError ? error.message : 'Algo deu errado. Tente de novo.',
      );
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: textColor }]}>Glowbox</Text>

      <Pressable
        accessibilityRole="button"
        disabled={isBusy}
        onPress={handleGoogle}
        style={({ pressed }) => [
          styles.button,
          { opacity: isBusy ? 0.5 : pressed ? 0.8 : 1 },
        ]}>
        {isBusy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar com Google</Text>
        )}
      </Pressable>

      {errorMessage && (
        <Text accessibilityLiveRegion="polite" style={[styles.error, { color: textColor }]}>
          {errorMessage}
        </Text>
      )}

      <Link href="/privacy" style={[styles.link, { color: textColor }]}>
        Política de privacidade
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    padding: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
  },
  button: {
    minWidth: 240,
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#208AEF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    textAlign: 'center',
    fontSize: 15,
  },
  link: {
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
