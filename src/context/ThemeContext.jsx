import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS } from '../constants/colors';
import StorageService from '../storage/StorageService';
import { STORAGE_KEYS } from '../constants/config';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await StorageService. getData(STORAGE_KEYS. THEME);
    if (savedTheme !== null) {
      setIsDarkMode(savedTheme);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await StorageService.saveData(STORAGE_KEYS. THEME, newTheme);
  };

  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  return (
    <ThemeContext. Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);