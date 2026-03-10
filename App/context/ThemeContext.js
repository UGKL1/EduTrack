// context/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Define your Color Palettes
const Colors = {
  dark: {
    background: '#0D0D0D',
    card: '#1E1E1E', // Used for Inputs, Cards, etc.
    text: '#FFFFFF',
    subText: '#CCCCCC',
    placeholder: '#999',
    primary: '#007BFF',
    icon: '#FFFFFF',
    border: '#333',
  },
  light: {
    background: '#FFFFFF',
    card: '#F2F2F2', // Slightly grey for inputs/cards to stand out on white
    text: '#000000',
    subText: '#666666',
    placeholder: '#888',
    primary: '#007BFF', // Keep brand color same
    icon: '#000000',
    border: '#E0E0E0',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 'system', 'light', or 'dark'
  const [themePreference, setThemePreference] = useState('system'); 
  const systemScheme = useColorScheme(); // Returns 'light' or 'dark' from device

  // Load saved preference on startup
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('userTheme');
        if (savedTheme) {
          setThemePreference(savedTheme);
        }
      } catch (error) {
        console.log('Failed to load theme', error);
      }
    };
    loadTheme();
  }, []);

  // Determine the actual active colors
  const activeTheme =
    themePreference === 'system' ? systemScheme : themePreference;
  
  // Get the color object (default to dark if undefined)
  const colors = Colors[activeTheme] || Colors.dark;

  // Function to update theme
  const updateTheme = async (newTheme) => {
    setThemePreference(newTheme);
    await AsyncStorage.setItem('userTheme', newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        themePreference,
        updateTheme,
        colors,
        isDark: activeTheme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy access in screens
export const useTheme = () => useContext(ThemeContext);