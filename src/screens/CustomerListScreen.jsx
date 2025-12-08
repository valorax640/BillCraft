import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CustomerCard from '../components/CustomerCard';
import CustomButton from '../components/CustomButton';
import ConfirmModal from '../components/ConfirmModal';

const CustomerListScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { customers, deleteCustomer } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ visible: false, customer: null });

  const filteredCustomers = customers.filter(customer =>
    customer.phone?.includes(searchQuery)
  );

  const handleDelete = (customer) => {
    setDeleteModal({ visible: true, customer });
  };

  const confirmDelete = async () => {
    await deleteCustomer(deleteModal.customer.id);
    setDeleteModal({ visible: false, customer: null });
  };

  const renderCustomer = ({ item }) => (
    <CustomerCard
      customer={item}
      onEdit={(customer) => navigation.navigate('AddEditCustomer', { customer })}
      onDelete={handleDelete}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors. background }]}>
      <Header
        title="Customers"
        onBack={() => navigation.goBack()}
        rightIcon="add"
        onRightPress={() => navigation.navigate('AddEditCustomer')}
      />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search customers..."
      />

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No customers found
            </Text>
            <CustomButton
              title="Add First Customer"
              onPress={() => navigation.navigate('AddEditCustomer')}
              style={styles.emptyButton}
            />
          </View>
        }
      />

      <ConfirmModal
        visible={deleteModal.visible}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteModal. customer?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ visible: false, customer: null })}
        confirmText="Delete"
      />
    </View>
  );
};

const styles = StyleSheet. create({
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

export default CustomerListScreen;