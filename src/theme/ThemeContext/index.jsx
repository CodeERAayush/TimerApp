import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightTheme = {
  colors: {
    primary: '#6200EE',
    secondary: '#03DAC6',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#B00020',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    onError: '#FFFFFF',
    border: '#E0E0E0',
    disabled: '#9E9E9E',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    h1: {
      fontSize: 26,
      fontWeight: 'bold'
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold'
    },
    body: {
      fontSize: 16
    },
    caption: {
      fontSize: 14
    }
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    round: 999
  }
};

export const darkTheme = {
    colors: {
      primary: '#BB86FC',
      secondary: '#03DAC6',
      background: '#121212',
      surface: '#1E1E1E',
      error: '#CF6679',
      onPrimary: '#000000',
      onSecondary: '#000000',
      onBackground: '#FFFFFF',
      onSurface: '#FFFFFF',
      onError: '#000000',
      border: '#2C2C2C',
      disabled: '#666666',
      success: '#4CAF50',
      warning: '#FFC107'
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32
    },
    typography: {
      h1: {
        fontSize: 26,
        fontWeight: 'bold'
      },
      h2: {
        fontSize: 24,
        fontWeight: 'bold'
      },
      body: {
        fontSize: 16
      },
      caption: {
        fontSize: 14
      }
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 16,
      round: 999
    }
  };

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [theme, setTheme] = useState(darkTheme);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme_preference');
      if (savedTheme) {
        const isDark = JSON.parse(savedTheme);
        setIsDarkMode(isDark);
        setTheme(isDark ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    setTheme(newIsDarkMode ? darkTheme : lightTheme);
    try {
      await AsyncStorage.setItem('@theme_preference', JSON.stringify(newIsDarkMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};