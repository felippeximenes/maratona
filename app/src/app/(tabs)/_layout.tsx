import { Tabs } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

function tabIcon(name: SymbolViewProps['name']) {
  return function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <SymbolView name={name} tintColor={color} size={size} />;
  };
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Séries', tabBarIcon: tabIcon({ ios: 'tv', android: 'tv' }) }}
      />
      <Tabs.Screen
        name="movies"
        options={{ title: 'Filmes', tabBarIcon: tabIcon({ ios: 'film', android: 'movie' }) }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          tabBarIcon: tabIcon({ ios: 'magnifyingglass', android: 'search' }),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarIcon: tabIcon({ ios: 'person', android: 'person' }) }}
      />
    </Tabs>
  );
}
