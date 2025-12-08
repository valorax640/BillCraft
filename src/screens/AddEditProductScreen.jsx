import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import Header from '../components/Header';
import ProductForm from '../components/ProductForm';

const AddEditProductScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { addProduct, updateProduct } = useData();
  const product = route.params?.product;
  const isEdit = !!product;

  const handleSubmit = async (formData) => {
    if (isEdit) {
      await updateProduct(product.id, formData);
    } else {
      await addProduct(formData);
    }
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={isEdit ?  'Edit Product' : 'Add Product'}
        onBack={() => navigation.goBack()}
      />
      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        onCancel={() => navigation.goBack()}
        submitLabel={isEdit ? 'Update' : 'Add'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddEditProductScreen;