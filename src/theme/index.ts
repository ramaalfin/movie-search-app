export const lightColors = {
  primary: '#032541',
  secondary: '#01B4E4',
  accent: '#90CEA1',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#FFFFFF',
  text: {
    primary: '#1A1A2E',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
    link: '#01B4E4',
  },
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  rating: '#F59E0B',
  skeleton: '#E5E7EB',
};

export const darkColors = {
  primary: '#1A1A2E',
  secondary: '#01B4E4',
  accent: '#90CEA1',
  background: '#0F0F1E',
  surface: '#1A1A2E',
  card: '#252538',
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
    inverse: '#1A1A2E',
    link: '#01B4E4',
  },
  border: '#374151',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  rating: '#F59E0B',
  skeleton: '#374151',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const getTypography = (colors: typeof lightColors) => ({
  heading: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    color: colors.text.primary,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: colors.text.primary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: colors.text.primary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: colors.text.secondary,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    color: colors.text.secondary,
  },
});

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};

export const getTheme = (isDarkMode: boolean) => {
  const colors = isDarkMode ? darkColors : lightColors;
  return {
    colors,
    spacing,
    typography: getTypography(colors),
    borderRadius,
    shadows,
  };
};

const theme = getTheme(false);

export type Theme = typeof theme;
export default theme;
