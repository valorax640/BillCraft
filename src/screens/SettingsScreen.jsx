import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const SettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { isPinEnabled } = useAuth();

  const settingsItems = [
    {
      id: 'shop-profile',
      title: 'Shop Profile',
      icon: 'store',
      screen: 'ShopProfile',
    },
    {
      id: 'pin-lock',
      title: 'PIN Lock',
      icon: 'lock',
      screen: 'PinLock',
      badge: isPinEnabled ? 'Enabled' : 'Disabled',
    },
  ];

  const renderSettingItem = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate(item.screen)}
        activeOpacity={0.7}>
        <View style={styles.settingLeft}>
          <Icon name={item.icon} size={24} color={colors.primary} />
          <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
        </View>
        <View style={styles.settingRight}>
          {item.badge && (
            <Text style={[styles.badge, { color: colors.textSecondary }]}>{item.badge}</Text>
          )}
          <Icon name="chevron-right" size={24} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          {settingsItems.map(renderSettingItem)}
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Icon name="info-outline" size={24} color={colors.primary} />
          <View style={styles.infoText}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              100% Private & Offline
            </Text>
            <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
              All your data is stored locally on your device.  No internet connection required.  
              No data is ever sent to any server.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            BillCraft v1.0. 0
          </Text>
          <Text style={[styles.footerText, { color: colors. textSecondary }]}>
            Made with ❤️ for Shopkeepers
          </Text>
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
  section: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    fontSize: 14,
    marginRight: 8,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default SettingsScreen;