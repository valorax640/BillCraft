import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const InvoiceCard = ({ invoice, onPress }) => {
  const { colors } = useTheme();

  const statusColor = invoice.status === 'paid' ? colors.success : colors.warning;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.row}>
        <Text style={[styles.invoiceNo, { color: colors.primary }]}>
          {invoice.invoiceNo}
        </Text>
        <Text style={[styles.amount, { color: colors.text }]}>
          {formatCurrency(invoice.totals.grandTotal)}
        </Text>
      </View>
      
      <View style={styles.row}>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>
            {invoice.status.toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {formatDate(invoice.date)}
        </Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceNo: {
    fontSize: 16,
    fontWeight: '700',
  },
  amount: {
    fontSize: 18,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default InvoiceCard;