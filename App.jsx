import React, { useState } from 'react';
import { StatusBar, View, Text, StyleSheet, Image, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { DataProvider } from './src/context/DataContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import CustomInput from './src/components/CustomInput';
import CustomButton from './src/components/CustomButton';

const AppContent = () => {
  const { colors } = useTheme();
  const { isLocked, verifyPin, isPinEnabled, isLoading } = useAuth();
  const [enteredPin, setEnteredPin] = useState('');

  const handleVerifyPin = () => {
    if (verifyPin(enteredPin)) {
      setEnteredPin('');
    } else {
      Alert.alert('Error', 'Incorrect PIN');
      setEnteredPin('');
    }
  };

  // Show nothing while loading to prevent flash
  if (isLoading) {
    return (
      <View style={[styles.lockScreen, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.primary}
          translucent={true}
        />
      </View>
    );
  }

  if (isLocked && isPinEnabled) {
    return (
      <View style={[styles.lockScreen, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.primary}
          translucent={true}
        />
        <View style={styles.lockContent}>
          <Image
            source={require('./android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png')}
            style={styles.appIcon}
          />
          <Text style={[styles.appTitle, { color: colors.text }]}>BillCraft</Text>
          <Text style={[styles.lockMessage, { color: colors.textSecondary }]}>
            Enter your PIN to unlock
          </Text>
          
          <View style={styles.pinInputContainer}>
            <CustomInput
              value={enteredPin}
              onChangeText={setEnteredPin}
              placeholder="Enter 4-digit PIN"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              autoFocus
            />
            <CustomButton
              title="Unlock"
              onPress={handleVerifyPin}
              disabled={enteredPin.length !== 4}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={true}
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


const styles = StyleSheet.create({
  lockScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockContent: {
    width: '85%',
    alignItems: 'center',
  },
  appIcon: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 60,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  lockMessage: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  pinInputContainer: {
    width: '100%',
  },
});

export default App;