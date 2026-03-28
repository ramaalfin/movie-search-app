import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
    RECENT_SEARCHES: '@recent_searches',
    FAVORITES: '@favorites',
    USER_REVIEWS: '@user_reviews',
};

export const saveRecentSearch = async (keyword: string) => {
    try {
        const existing = await getRecentSearches();
        const filtered = existing.filter(item => item !== keyword);

        const updated = [keyword, ...filtered].slice(0, 5);
        await AsyncStorage.setItem(
            STORAGE_KEYS.RECENT_SEARCHES,
            JSON.stringify(updated),
        );
    } catch (error) {
        console.error('Error saving recent search:', error);
    }
};

export const getRecentSearches = async (): Promise<string[]> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting recent searches:', error);
        return [];
    }
};

export const clearRecentSearches = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    } catch (error) {
        console.error('Error clearing recent searches:', error);
    }
};


export const saveUserReview = async (review: {
    id: string;
    movieId: number;
    rating: number;
    title: string;
    content: string;
    createdAt: string;
}) => {
    try {
        const existing = await getUserReviews(review.movieId);
        const updated = [review, ...existing];
        const allReviews = await AsyncStorage.getItem(STORAGE_KEYS.USER_REVIEWS);
        const reviewsMap = allReviews ? JSON.parse(allReviews) : {};
        reviewsMap[review.movieId] = updated;
        await AsyncStorage.setItem(
            STORAGE_KEYS.USER_REVIEWS,
            JSON.stringify(reviewsMap),
        );
    } catch (error) {
        console.error('Error saving user review:', error);
    }
};

export const getUserReviews = async (movieId: number): Promise<any[]> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_REVIEWS);
        if (data) {
            const reviewsMap = JSON.parse(data);
            return reviewsMap[movieId] || [];
        }
        return [];
    } catch (error) {
        console.error('Error getting user reviews:', error);
        return [];
    }
};

export const deleteUserReview = async (movieId: number, reviewId: string) => {
    try {
        const existing = await getUserReviews(movieId);
        const updated = existing.filter(r => r.id !== reviewId);
        const allReviews = await AsyncStorage.getItem(STORAGE_KEYS.USER_REVIEWS);
        const reviewsMap = allReviews ? JSON.parse(allReviews) : {};
        reviewsMap[movieId] = updated;
        await AsyncStorage.setItem(
            STORAGE_KEYS.USER_REVIEWS,
            JSON.stringify(reviewsMap),
        );
    } catch (error) {
        console.error('Error deleting user review:', error);
    }
};
