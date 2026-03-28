import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import {ThemeProvider, useTheme} from './src/context/ThemeContext';
import useSettingsStore from './src/stores/useSettingsStore';
import useFavoritesStore from './src/stores/useFavoritesStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

const AppContent: React.FC = () => {
  const {theme, isDarkMode} = useTheme();
  const {loadSettings} = useSettingsStore();
  const {loadFavorites} = useFavoritesStore();

  useEffect(() => {
    loadSettings();
    loadFavorites();
  }, [loadSettings, loadFavorites]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={theme.colors.primary}
            />
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
