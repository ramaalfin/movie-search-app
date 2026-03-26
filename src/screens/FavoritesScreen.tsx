import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import theme from '../theme';

const FavoritesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favorites coming soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    ...theme.typography.subheading,
    color: theme.colors.text.secondary,
  },
});

export default FavoritesScreen;
