import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import Header from '../components/Header';
import CustomerForm from '../components/CustomerForm';

const AddEditCustomerScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { addCustomer, updateCustomer } = useData();
  const customer = route.params?. customer;
  const isEdit = !!customer;

  const handleSubmit = async (formData) => {
    if (isEdit) {
      await updateCustomer(customer.id, formData);
    } else {
      await addCustomer(formData);
    }
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors. background }]}>
      <Header
        title={isEdit ? 'Edit Customer' : 'Add Customer'}
        onBack={() => navigation.goBack()}
      />
      <CustomerForm
        initialData={customer}
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

export default AddEditCustomerScreen;