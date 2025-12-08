import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency } from '../utils/formatters';

const ProductCard = ({ product, onPress, onEdit, onDelete }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
          <View style={styles.row}>
            <Text style={[styles.price, { color: colors.primary }]}>
              {formatCurrency(product.price)}
            </Text>
            <Text style={[styles.gst, { color: colors.textSecondary }]}>
              GST: {product.gstRate}%
            </Text>
          </View>
          {product.stock !== undefined && product.stock !== null && (
            <Text style={[styles.stock, { color: product.stock > 0 ? colors.success : colors.error }]}>
              Stock: {product.stock}
            </Text>
          )}
        </View>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={() => onEdit(product)} style={styles.actionButton}>
              <Icon name="edit" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={() => onDelete(product)} style={styles.actionButton}>
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
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
  },
  gst: {
    fontSize: 13,
    fontWeight: '500',
  },
  stock: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
    borderRadius: 8,
  },
});

export default ProductCard;