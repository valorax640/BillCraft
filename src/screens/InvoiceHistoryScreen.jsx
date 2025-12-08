import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import InvoiceCard from '../components/InvoiceCard';

const InvoiceHistoryScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { invoices } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, paid, unpaid

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filter === 'all' ||
      (filter === 'paid' && invoice.status === 'paid') ||
      (filter === 'unpaid' && invoice. status === 'unpaid');

    return matchesSearch && matchesFilter;
  });

  const renderInvoice = ({ item }) => (
    <InvoiceCard
      invoice={item}
      onPress={() => navigation.navigate('InvoiceDetail', { invoice: item })}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header isHome title="Invoices" greeting="History" />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search invoices..."
      />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { borderColor: colors.border },
            filter === 'all' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('all')}>
          <Text style={[
            styles.filterText,
            { color: filter === 'all' ? '#ffffff' : colors.text }
          ]}>
            All ({invoices.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { borderColor: colors.border },
            filter === 'paid' && { backgroundColor: colors.success },
          ]}
          onPress={() => setFilter('paid')}>
          <Text style={[
            styles.filterText,
            { color: filter === 'paid' ? '#ffffff' : colors.text }
          ]}>
            Paid ({invoices.filter(i => i.status === 'paid').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { borderColor: colors.border },
            filter === 'unpaid' && { backgroundColor: colors.warning },
          ]}
          onPress={() => setFilter('unpaid')}>
          <Text style={[
            styles.filterText,
            { color: filter === 'unpaid' ? '#ffffff' : colors.text }
          ]}>
            Unpaid ({invoices.filter(i => i. status === 'unpaid').length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredInvoices}
        renderItem={renderInvoice}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles. list}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No invoices found
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 16,
  },
});

export default InvoiceHistoryScreen;