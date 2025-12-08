import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import CustomPicker from './CustomPicker';
import { GST_RATES } from '../constants/gstRates';
import { useTheme } from '../context/ThemeContext';
import { validateProduct } from '../utils/validators';

const ProductForm = ({ initialData, onSubmit, onCancel, submitLabel = 'Save' }) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    gstRate: 18,
    stock: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price?.toString() || '',
        gstRate: initialData.gstRate || 18,
        stock: initialData.stock?.toString() || '',
        category: initialData.category || '',
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = async () => {
    const validation = validateProduct(formData);
    if (! validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    await onSubmit({
      ...formData,
      price: parseFloat(formData. price),
      stock: formData.stock ?  parseInt(formData.stock) : 0,
    });
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <CustomInput
        label="Product Name *"
        value={formData. name}
        onChangeText={(value) => handleChange('name', value)}
        placeholder="Enter product name"
        error={errors.name}
      />

      <CustomInput
        label="Price *"
        value={formData.price}
        onChangeText={(value) => handleChange('price', value)}
        placeholder="0.00"
        keyboardType="decimal-pad"
        error={errors.price}
      />

      <CustomPicker
        label="GST Rate *"
        value={formData.gstRate}
        onValueChange={(value) => handleChange('gstRate', value)}
        items={GST_RATES}
        error={errors.gstRate}
      />

      <CustomInput
        label="Stock (Optional)"
        value={formData.stock}
        onChangeText={(value) => handleChange('stock', value)}
        placeholder="0"
        keyboardType="number-pad"
      />

      <CustomInput
        label="Category (Optional)"
        value={formData.category}
        onChangeText={(value) => handleChange('category', value)}
        placeholder="e.g., Electronics, Groceries"
      />

      <View style={styles.buttons}>
        <CustomButton
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          style={styles.button}
        />
        <CustomButton
          title={submitLabel}
          onPress={handleSubmit}
          loading={loading}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default ProductForm;