import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { DataProvider } from './src/context/DataContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const { colors, isDarkMode } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ?  'light-content' : 'dark-content'}
        backgroundColor={colors.primary}
      />
      <AppNavigator />
    </>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};


export default App;