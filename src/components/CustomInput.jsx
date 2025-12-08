import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const CustomInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder,
  error,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  ... props
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <TextInput
        style={[
          styles. input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: error ? colors.error : colors.border,
          },
          multiline && styles.multiline,
          ! editable && styles.disabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        {...props}
      />
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
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 16,
    minHeight: 52,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  disabled: {
    opacity: 0.6,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
});

export default CustomInput;