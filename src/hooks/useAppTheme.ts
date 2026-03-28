import { useTheme } from '../context/ThemeContext';

export const useAppTheme = () => {
    const { theme } = useTheme();
    return theme;
};

export default useAppTheme;
