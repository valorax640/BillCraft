import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import CustomButton from '../components/CustomButton';
import ConfirmModal from '../components/ConfirmModal';

const ProductListScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { products, deleteProduct } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ visible: false, product: null });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase(). includes(searchQuery.toLowerCase())
  );

  const handleDelete = (product) => {
    setDeleteModal({ visible: true, product });
  };

  const confirmDelete = async () => {
    await deleteProduct(deleteModal.product. id);
    setDeleteModal({ visible: false, product: null });
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onEdit={(product) => navigation.navigate('AddEditProduct', { product })}
      onDelete={handleDelete}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Products"
        onBack={() => navigation.goBack()}
        rightIcon="add"
        onRightPress={() => navigation.navigate('AddEditProduct')}
      />

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
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No products found
            </Text>
            <CustomButton
              title="Add First Product"
              onPress={() => navigation.navigate('AddEditProduct')}
              style={styles.emptyButton}
            />
          </View>
        }
      />

      <ConfirmModal
        visible={deleteModal.visible}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.product?. name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ visible: false, product: null })}
        confirmText="Delete"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 48,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
});

export default ProductListScreen;