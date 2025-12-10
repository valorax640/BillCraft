import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import SearchBar from './SearchBar';
import CustomButton from './CustomButton';
import { formatCurrency } from '../utils/formatters';

const InvoiceItemPicker = ({ visible, products, onSelect, onClose }) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products. filter(product =>
    product. name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[styles.productItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => onSelect(item)}>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles. productDetail, { color: colors.textSecondary }]}>
          GST: {item.gstRate}%
        </Text>
      </View>
      <Text style={[styles.productPrice, { color: colors.primary }]}>
        {formatCurrency(item.price)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <Text style={styles.headerTitle}>Select Product</Text>
          <CustomButton
            title="Close"
            onPress={onClose}
            variant="outline"
            style={styles.closeButton}
            textStyle={{ color: colors.primary }}
          />
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
        />

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={[styles. emptyText, { color: colors.textSecondary }]}>
              No products found
            </Text>
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    paddingHorizontal: 16,
    borderColor: '#ffffff',
  },
  list: {
    padding: 8,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDetail: {
    fontSize: 14,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
});

export default InvoiceItemPicker;