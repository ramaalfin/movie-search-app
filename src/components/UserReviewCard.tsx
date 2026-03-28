import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import theme from '../theme';
import {formatDate} from '../utils/formatters';

interface UserReviewCardProps {
  review: {
    id: string;
    rating: number;
    title: string;
    content: string;
    createdAt: string;
  };
  onDelete: () => void;
}

const UserReviewCard: React.FC<UserReviewCardProps> = ({review, onDelete}) => {
  const handleDelete = () => {
    Alert.alert('Delete Review', 'Are you sure you want to delete this review?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: onDelete},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.badge}>Your Review</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {review.rating}/10</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{review.title}</Text>
      <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
      <Text style={styles.content}>{review.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  badge: {
    ...theme.typography.caption,
    color: theme.colors.secondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ratingBadge: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  ratingText: {
    ...theme.typography.caption,
    color: theme.colors.rating,
    fontWeight: '600',
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  deleteText: {
    fontSize: 20,
  },
  title: {
    ...theme.typography.subheading,
    marginBottom: theme.spacing.xs,
  },
  date: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.md,
  },
  content: {
    ...theme.typography.body,
    lineHeight: 20,
  },
});

export default UserReviewCard;
