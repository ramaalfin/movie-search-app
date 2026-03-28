import React, {useState} from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import theme from '../theme';
import {saveUserReview} from '../utils/storage';

interface ReviewModalProps {
  visible: boolean;
  movieId: number;
  onClose: () => void;
  onReviewAdded: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  movieId,
  onClose,
  onReviewAdded,
}) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const review = {
      id: Date.now().toString(),
      movieId,
      rating,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    await saveUserReview(review);
    setRating(5);
    setTitle('');
    setContent('');
    onClose();
    onReviewAdded();
    Alert.alert('Success', 'Your review has been added!');
  };

  const handleCancel = () => {
    setRating(5);
    setTitle('');
    setContent('');
    onClose();
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}>
            <Text style={styles.starText}>{star <= rating ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.header}>Write Your Review</Text>

            <Text style={styles.label}>Rating (1-10)</Text>
            {renderStars()}
            <Text style={styles.ratingValue}>{rating}/10</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter review title"
              placeholderTextColor={theme.colors.text.secondary}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Review</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write your review here..."
              placeholderTextColor={theme.colors.text.secondary}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    maxHeight: '80%',
  },
  header: {
    ...theme.typography.heading,
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.label,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.xs,
  },
  starButton: {
    padding: theme.spacing.xs,
  },
  starText: {
    fontSize: 24,
  },
  ratingValue: {
    ...theme.typography.body,
    color: theme.colors.rating,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.typography.body,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 120,
    paddingTop: theme.spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: theme.colors.secondary,
  },
  submitButtonText: {
    ...theme.typography.body,
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
});

export default ReviewModal;
