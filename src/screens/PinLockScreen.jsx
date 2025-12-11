import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const PinLockScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { isPinEnabled, setupPin, removePin, verifyPin, pin } = useAuth();
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetupPin = async () => {
    if (newPin.length !== 4) {
      Alert. alert('Error', 'PIN must be 4 digits');
      return;
    }

    if (newPin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }

    setLoading(true);
    await setupPin(newPin);
    setLoading(false);
    Alert.alert('Success', 'PIN has been set successfully');
    setNewPin('');
    setConfirmPin('');
  };

  const handleRemovePin = async () => {
    if (! verifyPin(currentPin)) {
      Alert.alert('Error', 'Incorrect PIN');
      return;
    }

    Alert.alert(
      'Remove PIN',
      'Are you sure you want to remove PIN lock?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await removePin();
            setLoading(false);
            setCurrentPin('');
            Alert.alert('Success', 'PIN lock has been removed');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="PIN Lock"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png')}
            style={styles.appIcon}
          />
        </View>

        {!isPinEnabled ? (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Setup PIN Lock</Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              Protect your app with a 4-digit PIN. You'll need to enter this PIN every time you open the app.
            </Text>

            <CustomInput
              label="New PIN"
              value={newPin}
              onChangeText={setNewPin}
              placeholder="Enter 4-digit PIN"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />

            <CustomInput
              label="Confirm PIN"
              value={confirmPin}
              onChangeText={setConfirmPin}
              placeholder="Confirm 4-digit PIN"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />

            <CustomButton
              title="Setup PIN"
              onPress={handleSetupPin}
              loading={loading}
              disabled={newPin.length !== 4 || confirmPin.length !== 4}
            />
          </View>
        ) : (
          <View style={[styles. card, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>PIN Lock Enabled</Text>
            <Text style={[styles. cardDescription, { color: colors. textSecondary }]}>
              Your app is currently protected with a PIN.  Enter your current PIN below to remove it.
            </Text>

            <View style={[styles.statusBadge, { backgroundColor: colors. success }]}>
              <Text style={styles.statusText}>✓ PIN ENABLED</Text>
            </View>

            <CustomInput
              label="Current PIN"
              value={currentPin}
              onChangeText={setCurrentPin}
              placeholder="Enter current PIN"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />

            <CustomButton
              title="Remove PIN Lock"
              onPress={handleRemovePin}
              loading={loading}
              variant="danger"
              disabled={currentPin.length !== 4}
            />
          </View>
        )}

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            💡 Tip: Choose a PIN that's easy for you to remember but hard for others to guess.  
            If you forget your PIN, you'll need to reinstall the app (all data will be lost).
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 16,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  infoCard: {
    padding: 16,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PinLockScreen;