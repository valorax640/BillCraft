import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const SearchBar = ({ value, onChangeText, placeholder = 'Search...' }) => {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.surface,
        borderColor: colors.border,
        shadowColor: colors.shadow,
      }
    ]}>
      <Icon name="search" size={22} color={colors.textSecondary} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
      />
      {value ? (
        <Icon 
          name="close" 
          size={20} 
          color={colors.textSecondary}
          onPress={() => onChangeText('')}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SearchBar;