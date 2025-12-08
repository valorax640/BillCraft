import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const CustomerCard = ({ customer, onPress, onEdit, onDelete }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>
            📞 {customer.phone || 'No Phone'}
          </Text>
        </View>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={() => onEdit(customer)} style={styles.actionButton}>
              <Icon name="edit" size={20} color={colors. primary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={() => onDelete(customer)} style={styles.actionButton}>
              <Icon name="delete" size={20} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  detail: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 10,
    marginLeft: 8,
    borderRadius: 8,
  },
});

export default CustomerCard;