import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import useFavoritesStore from '../stores/useFavoritesStore';
import useAppTheme from '../hooks/useAppTheme';
import useSettingsStore from '../stores/useSettingsStore';

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  const theme = useAppTheme();
  const { favorites, loadFavorites } = useFavoritesStore();
  const { isDarkMode } = useSettingsStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? theme.colors.secondary : theme.colors.primary,
        tabBarInactiveTintColor: isDarkMode ? theme.colors.text.secondary : theme.colors.text.primary,
        tabBarStyle: {
          backgroundColor: isDarkMode ? theme.colors.card : theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: isDarkMode ? theme.colors.background : theme.colors.primary,
        },
        headerTintColor: isDarkMode ? theme.colors.text.primary : theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Popular',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>❤️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default TabNavigator;
