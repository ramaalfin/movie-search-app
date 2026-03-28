import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import DetailScreen from '../screens/DetailScreen';
import useAppTheme from '../hooks/useAppTheme';
import useSettingsStore from '../stores/useSettingsStore';

export type RootStackParamList = {
  Tabs: undefined;
  Detail: { movieId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const theme = useAppTheme();
  const { isDarkMode } = useSettingsStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? theme.colors.background : theme.colors.primary,
        },
        headerTintColor: isDarkMode ? theme.colors.text.primary : theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}>
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'Movie Detail' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
