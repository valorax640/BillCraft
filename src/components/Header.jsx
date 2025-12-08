import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title, onBack, rightIcon, onRightPress, isHome, greeting }) => {
  const { colors } = useTheme();

  if (isHome) {
    return (
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.homeHeaderContent}>
          <View>
            <Text style={styles.greeting}>{greeting || 'Good Day!'}</Text>
            <Text style={styles.appName}>{title}</Text>
          </View>
          {rightIcon && onRightPress && (
            <TouchableOpacity
              style={[styles.notificationButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
              onPress={onRightPress}>
              <Icon name={rightIcon} size={24} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {rightIcon && onRightPress && (
        <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
          <Icon name={rightIcon} size={24} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  homeHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginBottom: 4,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  notificationButton: {
    padding: 10,
    borderRadius: 12,
  },
});

export default Header;