import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Clipboard } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import StorageService from '../storage/StorageService';

const BackupScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [backupData, setBackupData] = useState('');
  const [restoreData, setRestoreData] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    const data = await StorageService.exportAllData();
    if (data) {
      setBackupData(data);
      Alert.alert('Success', 'Backup data generated.  You can now copy and save it.');
    } else {
      Alert.alert('Error', 'Failed to export data');
    }
    setLoading(false);
  };

  const handleCopyBackup = () => {
    if (backupData) {
      Clipboard.setString(backupData);
      Alert.alert('Copied', 'Backup data copied to clipboard.  Save it in a safe place.');
    }
  };

  const handleRestore = async () => {
    if (!restoreData. trim()) {
      Alert.alert('Error', 'Please paste backup data first');
      return;
    }

    Alert.alert(
      'Restore Data',
      'This will replace all existing data. Are you sure? ',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const success = await StorageService.importData(restoreData);
            setLoading(false);
            
            if (success) {
              Alert.alert('Success', 'Data restored successfully.  Please restart the app.');
            } else {
              Alert.alert('Error', 'Failed to restore data.  Invalid backup format.');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all data. This action cannot be undone! ',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await StorageService.clearAll();
            setLoading(false);
            Alert.alert('Cleared', 'All data has been deleted.  Please restart the app.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors. background }]}>
      <Header
        title="Backup & Restore"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        {/* Export Section */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Export Backup</Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            Generate a backup of all your data.  Copy and save it in a safe place.
          </Text>
          
          <CustomButton
            title="Generate Backup"
            onPress={handleExport}
            loading={loading}
            style={styles. button}
          />

          {backupData && (
            <>
              <CustomInput
                label="Backup Data"
                value={backupData}
                multiline
                numberOfLines={6}
                editable={false}
                style={styles.dataInput}
              />
              <CustomButton
                title="Copy to Clipboard"
                onPress={handleCopyBackup}
                variant="secondary"
                style={styles.button}
              />
            </>
          )}
        </View>

        {/* Restore Section */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles. cardTitle, { color: colors. text }]}>Restore Backup</Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            Paste your backup data below and restore it.  Warning: This will replace all existing data. 
          </Text>

          <CustomInput
            label="Paste Backup Data"
            value={restoreData}
            onChangeText={setRestoreData}
            multiline
            numberOfLines={6}
            placeholder="Paste your backup JSON here..."
            style={styles. dataInput}
          />

          <CustomButton
            title="Restore Data"
            onPress={handleRestore}
            loading={loading}
            variant="success"
            style={styles.button}
          />
        </View>

        {/* Danger Zone */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.error }]}>
          <Text style={[styles.cardTitle, { color: colors.error }]}>Danger Zone</Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            Permanently delete all data from the app. This action cannot be undone! 
          </Text>

          <CustomButton
            title="Clear All Data"
            onPress={handleClearAll}
            variant="danger"
            loading={loading}
            style={styles.button}
          />
        </View>
      </ScrollView>
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
  button: {
    marginTop: 8,
  },
  dataInput: {
    marginTop: 16,
  },
});

export default BackupScreen;