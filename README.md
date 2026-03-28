# Movie Search App

A React Native CLI starter project for the Movie Search App assignment.

## Setup

### Prerequisites

- Node.js >= 22
- Yarn
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/set-up-your-environment))
- TMDB API key (free at https://developer.themoviedb.org/)

### Installation

```bash
# 1. Install dependencies
yarn install

# 2. Configure API key
cp .env.example .env
# Edit .env and add your TMDB API key

# 3. Install iOS pods (macOS only)
cd ios && bundle install && bundle exec pod install && cd ..

# 4. Run the app
yarn ios     # or
yarn android
```

# Implementation Notes - Movie Search App

## 📋 Project Summary

A React Native app for searching and exploring movies using the TMDB API. Built with TypeScript, React Navigation, React Query, and Zustand for state management.

---

## 🔧 Issues Encountered & Solutions

### 1. **Loading State on Search Screen Appears on Mount**

**Problem:**
When opening the Search Screen for the first time, the loading indicator immediately appears even if the user hasn't performed any search. This provides a confusing experience as it seems like a process is running.

**Cause:**
React Query by default will run the query when the component mounts, and `isLoading` will be `true` even when the query is disabled with `enabled: false`.

**Solution:**
Added a state flag `hasSearched` to track whether the user has performed a search or not:

```typescript
const [hasSearched, setHasSearched] = useState(false);

const handleSearch = () => {
  if (searchInput.trim().length > 0) {
    setSearchQuery(searchInput.trim());
    addSearch(searchInput.trim());
    setIsFocused(false);
    setHasSearched(true); // Set flag after search
  }
};

const showLoading = isLoading && hasSearched; // Only show loading after search
```

**Result:**
The loading indicator only appears after the user actually performs a search, providing a better UX.

---

### 2. **Badge Count in Favorites Tab Doesn't Update in Real-time**

**Problem:**
When adding or removing a favorite from the Detail Screen, the badge count in the Favorites tab doesn't immediately update. The user has to switch tabs first before the badge changes.

**Cause:**
`TabNavigator` doesn't subscribe to state changes of favorites in the Zustand store, so it doesn't re-render when favorites change.

**Solution:**
Load favorites in `TabNavigator` and subscribe to store changes:

```typescript
const TabNavigator: React.FC = () => {
  const {favorites, loadFavorites} = useFavoritesStore();

  useEffect(() => {
    loadFavorites(); // Load on mount
  }, [loadFavorites]);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
          // Badge will update automatically because favorites from store
        }}
      />
    </Tab.Navigator>
  );
};
```

**Result:**
The badge count updates reactively every time favorites change, without needing a manual refresh.

---

### 3. **Language Change Doesn't Affect API Response**

**Problem:**
When the user changes the language in Settings (EN/ID), the displayed movie data is still in the old language. The API doesn't use the selected language.

**Cause:**
The API client uses hardcoded `language: 'en-US'` in the default params; it doesn't read from the settings store.

**Solution:**
Added a request interceptor that reads the language from the settings store before every API call:

```typescript
apiClient.interceptors.request.use(
  config => {
    const { language } = useSettingsStore.getState();
    if (config.params) {
      config.params.language = language; // Inject language from store
    }
    return config;
  },
  error => Promise.reject(error),
);
```

Then invalidate all queries after the language changes:

```typescript
const handleLanguageChange = async (lang: 'en-US' | 'id-ID') => {
  await setLanguage(lang);
  queryClient.invalidateQueries(); // Refetch all data with the new language
};
```

**Result:**
All API responses automatically use the language selected by the user, and the data is refreshed to display the content in the new language.

---

### 4. **Cast Members Without Photos Display Broken Images**

**Problem:**
Some cast members don't have a profile photo (`profile_path: null`), causing an ugly broken image placeholder.

**Cause:**
The `CastCard` component doesn't handle the case when `profile_path` is `null`.

**Solution:**
Added conditional rendering with a placeholder image:

```typescript
const CastCard: React.FC<CastCardProps> = ({cast}) => {
  const profileUrl = cast.profile_path
    ? `https://image.tmdb.org/t/p/w185${cast.profile_path}`
    : null;

  return (
    <View style={styles.container}>
      <Image
        source={
          profileUrl
            ? {uri: profileUrl}
            : {uri: "https://placeholder.pics/svg/300"} // Fallback placeholder
        }
        style={styles.image}
      />
      {/* ... */}
    </View>
  );
};
```

**Result:**
Cast members without photos display a proper placeholder image, with no broken images.

---

### 5. **Favorites Do Not Persist After App Restart**

**Problem:**
When the app is closed and reopened, all favorites are lost.

**Cause:**
Favorites are only stored in memory (Zustand state); they aren't properly persisted to AsyncStorage when the app mounts.

**Solution:**
Calling `loadFavorites()` in `App.tsx` when the application first mounts:

```typescript
const AppContent: React.FC = () => {
  const {loadSettings} = useSettingsStore();
  const {loadFavorites} = useFavoritesStore();

  useEffect(() => {
    loadSettings();
    loadFavorites(); // Load from AsyncStorage at app start
  }, [loadSettings, loadFavorites]);

  return (/* ... */);
};
```

**Result:**
Favorites are loaded from AsyncStorage every time the app is opened, so the data remains after a restart.

---

### 6. **Infinite Scroll Is Not Smooth, Frequently Triggers Multiple Requests**

**Problem:**
When scrolling down on the Home Screen, sometimes the API is called multiple times for the same page, causing duplicate data or unnecessary loading.

**Cause:**
`onEndReached` in the `FlatList` is too sensitive and there is no guard to prevent multiple calls.

**Solution:**
Added a condition check before fetching the next page:

```typescript
const handleLoadMore = () => {
  if (hasNextPage && !isFetchingNextPage) {
    // Only fetch if there is a next page AND not currently fetching
    fetchNextPage();
  }
};
```

And set an appropriate `onEndReachedThreshold`:

```typescript
<FlatList
  onEndReached={handleLoadMore}
  onEndReachedThreshold={0.5} // Trigger when 50% from the end
  ListFooterComponent={renderFooter}
/>
```

**Result:**
Infinite scroll runs smoothly without duplicate requests, and the loading indicator appears appropriately.

---

## 🎯 Implementation Decisions & Reasons

### 1. **Using React Query for Data Fetching**

**Decision:**
Using `@tanstack/react-query` for all API calls instead of manual fetching with useState/useEffect.

**Reason:**
- **Automatic Caching**: Data is cached for 10 minutes, reducing API calls.
- **Built-in Infinite Scroll**: `useInfiniteQuery` handles pagination easily.
- **Loading & Error States**: No need to manage manually.
- **Refetch on focus**: Data is always fresh when the user returns to the screen.
- **Optimistic Updates**: Can update the UI before the API response.

**Example:**
```typescript
const useInfiniteMovies = () => {
  return useInfiniteQuery<PaginatedResponse<Movie>>({
    queryKey: movieKeys.popular(),
    queryFn: ({ pageParam = 1 }) => getPopularMovies(pageParam as number),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};
```

---

### 2. **Zustand for Client State, Not Redux**

**Decision:**
Using Zustand for favorites and settings, instead of Redux or Context API.

**Reason:**
- **Simpler**: No need for actions, reducers, or boilerplate.
- **TypeScript Friendly**: Good type inference.
- **Minimal Re-renders**: Only components subscribed to changing state will re-render.
- **Built-in Async Actions**: Can directly use async/await inside actions.
- **Small Bundle Size**: ~1KB compared to Redux's ~10KB.

**Example:**
```typescript
const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  
  addFavorite: async (movie: Movie) => {
    const { favorites } = get();
    const updated = [...favorites, movie];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    set({ favorites: updated });
  },
  
  isFavorite: (movieId: number) => {
    const { favorites } = get();
    return favorites.some(m => m.id === movieId);
  },
}));
```

---

### 3. **Storing the Full Movie Object in Favorites, Not Just the ID**

**Decision:**
When a user favorites a movie, save the entire movie object (title, poster, rating, etc.) in AsyncStorage, not just the movie ID.

**Reason:**
- **Offline Viewing**: Users can view favorites without the internet.
- **Faster Loading**: No need to fetch details for every favorite.
- **Simpler Code**: No need to join data from the API and storage.
- **Acceptable Trade-off**: Storage size increases by ~1-2KB per movie, but the UX is much better.

**Implementation:**
```typescript
addFavorite: async (movie: Movie) => {
  const updated = [...favorites, movie]; // Save full object
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  set({ favorites: updated });
}
```

---

### 4. **Recent Searches Limited to 5 Items**

**Decision:**
Only save the last 5 recent searches, instead of an unlimited amount.

**Reason:**
- **No UI Overload**: 5 items are enough for quick access without scrolling.
- **Storage Efficient**: No need for complex cleanup logic.
- **Common UX Pattern**: Google, YouTube, etc. also limit recent searches.
- **Simple Implementation**: Simple array manipulation.

**Implementation:**
```typescript
export const saveRecentSearch = async (keyword: string) => {
  const existing = await getRecentSearches();
  const filtered = existing.filter(item => item !== keyword); // Remove duplicate
  const updated = [keyword, ...filtered].slice(0, 5); // Keep only 5
  await AsyncStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
};
```

---

### 5. **User Reviews Stored Locally, Not Sent to Server**

**Decision:**
User reviews written by users are stored locally in AsyncStorage, not sent to the TMDB API.

**Reason:**
- **TMDB API Limitation**: TMDB doesn't provide an endpoint to submit reviews.
- **Scope Matches the Assignment**: Focus is on UI/UX and data fetching.
- **Personal Notes Feature**: Users can save personal notes about a movie.
- **No Authentication Needed**: No need to implement login/register.

**Implementation:**
```typescript
// Storage structure: { movieId: [review1, review2, ...] }
export const saveUserReview = async (review: UserReview) => {
  const existing = await getUserReviews(review.movieId);
  const updated = [review, ...existing];
  const allReviews = await AsyncStorage.getItem(STORAGE_KEYS.USER_REVIEWS);
  const reviewsMap = allReviews ? JSON.parse(allReviews) : {};
  reviewsMap[review.movieId] = updated;
  await AsyncStorage.setItem(STORAGE_KEYS.USER_REVIEWS, JSON.stringify(reviewsMap));
};
```

---

### 6. **Dark Mode UI Ready, But Not Fully Implemented**

**Decision:**
Created a theme system with dark mode colors, but didn't fully apply it to all components.

**Reason:**
- **Time Constraint**: Full dark mode implementation requires extensive testing.
- **Foundation Ready**: Theme structure is in place, just needs to be applied.
- **Toggle Works**: The settings toggle works and the state is saved.
- **Future Enhancement**: It can be easily implemented later.

**Implementation:**
```typescript
// Theme system is ready
export const darkColors = { /* ... */ };
export const lightColors = { /* ... */ };

export const getTheme = (isDarkMode: boolean) => {
  const colors = isDarkMode ? darkColors : lightColors;
  return { colors, spacing, typography, borderRadius, shadows };
};

// ThemeContext is setup
const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {isDarkMode} = useSettingsStore();
  const theme = getTheme(isDarkMode);
  return <ThemeContext.Provider value={{theme, isDarkMode}}>{children}</ThemeContext.Provider>;
};
```

---

### 7. **Axios Interceptors for Centralized Error Handling**

**Decision:**
Using Axios interceptors to handle errors and inject the language parameter, rather than doing it in every API call.

**Reason:**
- **DRY Principle**: Error handling in one place.
- **Consistent Behavior**: All API calls share the same behavior.
- **Easy Debugging**: `console.error` in one place makes it easy to track.
- **Language Injection**: Automatically injects language without manual additions to every call.

**Implementation:**
```typescript
// Request interceptor - inject language
apiClient.interceptors.request.use(
  config => {
    const { language } = useSettingsStore.getState();
    if (config.params) {
      config.params.language = language;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error(`API Error [${error.response.status}]:`, error.response.data?.status_message);
    } else if (error.request) {
      console.error('Network Error: No response received');
    }
    return Promise.reject(error);
  },
);
```

---

### 8. **Component Structure: Presentational vs Container**

**Decision:**
Screens as container components (handle logic), reusable components as presentational (UI only).

**Reason:**
- **Separation of Concerns**: Logic is separated from UI.
- **Reusability**: Components can be used across various screens.
- **Testing Easier**: Presentational components are easy to test.
- **Code Organization**: It's clear what handles data and what handles UI.

**Example:**
```typescript
// Presentational Component
const MovieCard: React.FC<MovieCardProps> = ({movie, onPress}) => {
  return (
    <TouchableOpacity onPress={() => onPress(movie)}>
      {/* UI only, no logic */}
    </TouchableOpacity>
  );
};

// Container Component (Screen)
const HomeScreen: React.FC = () => {
  const {data, isLoading, fetchNextPage} = useInfiniteMovies(); // Logic
  const navigation = useNavigation();
  
  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('Detail', {movieId: movie.id});
  };
  
  return (
    <FlatList
      data={movies}
      renderItem={({item}) => <MovieCard movie={item} onPress={handleMoviePress} />}
    />
  );
};
```

---

### 9. **TypeScript Strict Mode & Type Safety**

**Decision:**
Using TypeScript with strict typing, all props and state are typed with interfaces.

**Reason:**
- **Catch Errors Early**: Type errors are caught during development, not production.
- **Better IDE Support**: Accurate autocomplete and IntelliSense.
- **Self-Documenting**: Type definitions serve as documentation.
- **Refactoring Confidence**: Safely refactor, the compiler will warn if anything breaks.

**Example:**
```typescript
// Type definitions
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  // ...
}

// Component props
interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

// Hook return type
const useInfiniteMovies = (): UseInfiniteQueryResult<PaginatedResponse<Movie>> => {
  // ...
};
```

---

### 10. **Custom Hooks for Reusable Logic**

**Decision:**
Extract all data fetching logic into custom hooks (`useInfiniteMovies`, `useMovieSearch`, etc.).

**Reason:**
- **Reusability**: Logic can be used across multiple components.
- **Testing**: Hooks can be tested independently of the UI.
- **Cleaner Components**: Components focus on the UI, not data fetching.
- **Consistent Patterns**: All data fetching follows the same pattern.

**Example:**
```typescript
// Custom hook
const useMovieSearch = (query: string) => {
  return useQuery<PaginatedResponse<Movie>>({
    queryKey: searchKeys.movies(query),
    queryFn: () => searchMovies(query),
    enabled: query.length > 0,
  });
};

// Usage in component
const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {data, isLoading} = useMovieSearch(searchQuery);
  
  return (/* ... */);
};
```

---

## 📊 Metrics & Performance

### Bundle Size
- **Total**: ~15MB (development build)
- **JS Bundle**: ~2.5MB
- **Dependencies**: React Native 0.84, React Query, Zustand, Navigation

### API Calls Optimization
- **Caching**: 5 minutes stale time, 10 minutes cache time
- **Pagination**: 20 movies per page
- **Retry**: 2 retries on failure
- **Timeout**: 10 seconds

---

## 🚀 Future Improvements

1. **Full Dark Mode Implementation**
   - Apply theme to all components
   - Smooth transition animation
   - System preference detection

2. **Offline Support**
   - Cache images with `react-native-fast-image`
   - Offline indicator
   - Queue API calls when offline

3. **Performance Optimization**
   - Image lazy loading
   - `FlatList` optimization (`getItemLayout`)
   - Memoization using `React.memo`

4. **Enhanced Features**
   - Movie trailers/videos
   - Filter by genre
   - Sort options (rating, date, popularity)
   - Share movie functionality

5. **Testing**
   - Unit tests for hooks and utilities
   - Component testing with React Testing Library
   - E2E tests with Detox

---

## 📝 Lessons Learned

1. **React Query is powerful**: Significantly reduces boilerplate code.
2. **Zustand is simple**: Easier than Redux for simple state management.
3. **TypeScript saves time**: Catches bugs early, allows refactoring with confidence.
4. **Custom hooks are essential**: Increases reusability and testability.
5. **AsyncStorage is reliable**: For simple persistence, no database is needed.
6. **Interceptors are useful**: Centralized logic for API calls.
7. **Component composition**: Small, focused components are more maintainable.
