import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type Profile = { display_name: string | null };

export default function ProfileScreen() {
  const isDark = useColorScheme() === 'dark';
  const color = isDark ? '#fff' : '#000';
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // O RLS só devolve a linha de quem está logado.
    supabase
      .from('profiles')
      .select('display_name')
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.warn('Failed to load profile', error);
        setProfile(data);
      });
  }, []);

  function confirmSignOut() {
    Alert.alert('Sair da conta?', undefined, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
    ]);
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color }]}>{profile?.display_name ?? 'Perfil'}</Text>

      {/* Provisório: Créditos vai para Configurações > Sobre no M7. */}
      <Link href="/credits" style={styles.link}>
        Créditos
      </Link>

      <Pressable accessibilityRole="button" onPress={confirmSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
  },
  button: {
    minWidth: 160,
    minHeight: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D93F3F',
  },
  link: {
    color: '#208AEF',
    fontSize: 16,
    fontWeight: '600',
    padding: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
