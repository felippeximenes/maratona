import { useColorScheme } from 'react-native';

const light = {
  background: '#fff',
  surface: '#F2F2F5',
  text: '#000',
  textMuted: '#6B6B73',
  border: '#E1E1E6',
  accent: '#208AEF',
  danger: '#D93F3F',
};

const dark: typeof light = {
  background: '#000',
  surface: '#1C1C1F',
  text: '#fff',
  textMuted: '#9A9AA3',
  border: '#2C2C30',
  accent: '#4BA3F5',
  danger: '#E35B5B',
};

export type ThemeColors = typeof light;

export function useThemeColors(): ThemeColors {
  return useColorScheme() === 'dark' ? dark : light;
}
