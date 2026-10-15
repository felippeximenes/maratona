import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useThemeColors } from '@/lib/theme';

// Atribuições exigidas: TMDB (regra 3 do CLAUDE.md) e TVmaze (CC BY-SA).
export default function CreditsScreen() {
  const colors = useThemeColors();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: colors.text }]}>Dados de séries e filmes</Text>
      <Image
        source={require('@/assets/images/tmdb-logo.svg')}
        style={styles.logo}
        contentFit="contain"
        accessibilityLabel="TMDB"
      />
      <Text style={[styles.body, { color: colors.text }]}>
        Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.
      </Text>
      <Link label="themoviedb.org" url="https://www.themoviedb.org" />

      <Text style={[styles.heading, { color: colors.text }]}>Horários e durações</Text>
      <Text style={[styles.body, { color: colors.text }]}>
        Horários de exibição e durações de episódios vêm do TVmaze, sob a licença Creative
        Commons Atribuição-CompartilhaIgual 4.0 (CC BY-SA 4.0).
      </Text>
      <Link label="tvmaze.com" url="https://www.tvmaze.com" />
      <Link
        label="Licença CC BY-SA 4.0"
        url="https://creativecommons.org/licenses/by-sa/4.0/deed.pt_BR"
      />
    </ScrollView>
  );
}

function Link({ label, url }: { label: string; url: string }) {
  const colors = useThemeColors();
  return (
    <Pressable accessibilityRole="link" onPress={() => WebBrowser.openBrowserAsync(url)}>
      <Text style={[styles.link, { color: colors.accent }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 12,
  },
  heading: {
    fontSize: 17,
    fontWeight: '600',
    paddingTop: 12,
  },
  logo: {
    width: 160,
    height: 21,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 4,
  },
});
