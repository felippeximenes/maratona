import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { posterUrl } from '@/lib/format';
import { useThemeColors } from '@/lib/theme';

export function Poster({
  path,
  width,
  size = 'w185',
}: {
  path: string | null;
  width: number;
  size?: 'w92' | 'w185' | 'w342';
}) {
  const colors = useThemeColors();
  const uri = posterUrl(path, size);
  const style = [styles.poster, { width, height: width * 1.5, backgroundColor: colors.surface }];

  return uri ? (
    <Image source={{ uri }} style={style} contentFit="cover" transition={150} />
  ) : (
    <View style={style} />
  );
}

const styles = StyleSheet.create({
  poster: {
    borderRadius: 6,
  },
});
