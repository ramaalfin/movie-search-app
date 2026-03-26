import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import theme from '../theme';

const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings coming soon</Text>
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

export default SettingsScreen;
