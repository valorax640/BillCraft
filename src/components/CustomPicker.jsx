import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../context/ThemeContext';

const CustomPicker = ({ 
  label, 
  value, 
  onValueChange, 
  items = [],
  placeholder,
  error,
  style 
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <View style={[
        styles.pickerWrapper,
        {
          backgroundColor: colors.surface,
          borderColor: error ? colors.error : colors.border,
        }
      ]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={[styles.picker, { color: colors.text }]}
          dropdownIconColor={colors.textSecondary}
        >
          {placeholder && (
            <Picker.Item 
              label={placeholder} 
              value={null} 
              color={colors.textTertiary}
            />
          )}
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
              color={colors.text}
            />
          ))}
        </Picker>
      </View>
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  pickerWrapper: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
    minHeight: 52,
    justifyContent: 'center',
  },
  picker: {
    ...Platform.select({
      ios: {
        height: 52,
      },
      android: {
        height: 52,
        marginHorizontal: 8,
      },
    }),
  },
  error: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
});

export default CustomPicker;
