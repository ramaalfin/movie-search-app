import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import theme from '../theme';
import type {RootStackParamList} from '../navigation/RootNavigator';

type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const DetailScreen: React.FC<DetailScreenProps> = ({route}) => {
  const {movieId} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Detail coming soon</Text>
      <Text style={styles.caption}>Movie ID: {movieId}</Text>
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
  caption: {
    ...theme.typography.caption,
    marginTop: theme.spacing.sm,
  },
});

export default DetailScreen;
