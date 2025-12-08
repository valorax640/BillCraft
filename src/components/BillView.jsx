import React, { useRef } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { formatDateTime } from '../utils/formatters';
import { GST_TYPES } from '../constants/gstRates';

const BillView = React.forwardRef(({ invoice, shopProfile }, ref) => {
  const { colors } = useTheme();

  const numberToWords = (num) => {
    if (num === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    const convert = (n) => {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + ' ' + ones[n % 10];
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + convert(n % 100);
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand ' + convert(n % 1000);
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh ' + convert(n % 100000);
      return convert(Math.floor(n / 10000000)) + ' Crore ' + convert(n % 10000000);
    };

    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);

    let result = 'Rupees ' + convert(rupees).trim();
    if (paise > 0) {
      result += ' and ' + convert(paise).trim() + ' Paise';
    }
    return result + ' only.';
  };

  return (
    <View style={[styles.billContainer, { backgroundColor: '#FFFFFF' }]} collapsable={false}>
      <View style={[styles.paper, { backgroundColor: '#FFFFFF' }]}>
        {/* Header */}
        <Text style={styles.billTitle}>INVOICE</Text>
        {shopProfile && (
          <>
            <Text style={styles.shopName}>{shopProfile.name || 'Shop Name'}</Text>
            {shopProfile.address && <Text style={styles.centerText}>{shopProfile.address}</Text>}
            {shopProfile.phone && <Text style={styles.centerText}>MOB: {shopProfile.phone}</Text>}
            {shopProfile.gstNo && <Text style={styles.centerText}>GST NO: {shopProfile.gstNo}</Text>}
          </>
        )}

        <View style={styles.separator} />

        {/* Bill Info */}
        <View style={styles.rowBetween}>
          <Text style={styles.normalText}>Bill No: {invoice.invoiceNo}</Text>
          <Text style={styles.normalText}>Date: {formatDateTime(invoice.date).split(',')[0]}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.normalText}></Text>
          <Text style={[styles.statusBadge, { 
            backgroundColor: invoice.status === 'paid' ? '#D1FAE5' : '#FEF3C7',
            color: invoice.status === 'paid' ? '#065F46' : '#92400E'
          }]}>
            {invoice.status.toUpperCase()}
          </Text>
        </View>

        <View style={styles.separator} />

        {/* Items Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colSl, styles.headerText]}>Sl</Text>
          <Text style={[styles.colName, styles.headerText]}>Product Name</Text>
          <Text style={[styles.colRate, styles.headerText]}>Rate</Text>
          <Text style={[styles.colQty, styles.headerText]}>Qty</Text>
          <Text style={[styles.colAmt, styles.headerText]}>Amt</Text>
        </View>

        <View style={styles.separator} />

        {/* Items */}
        {invoice.items.map((item, index) => {
          const itemTotal = item.price * item.quantity * (1 - item.discount / 100);
          return (
            <View key={index}>
              <View style={styles.itemRow}>
                <Text style={styles.colSl}>{index + 1}</Text>
                <Text style={styles.colName}>{item.name}</Text>
                <Text style={styles.colRate}>₹{item.price.toFixed(2)}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colAmt}>₹{itemTotal.toFixed(2)}</Text>
              </View>
              {item.discount > 0 && (
                <View style={styles.itemSubRow}>
                  <Text style={styles.discountText}>Discount: {item.discount}%</Text>
                </View>
              )}
              {item.gstRate > 0 && (
                <View style={styles.itemSubRow}>
                  <Text style={styles.gstText}>GST: {item.gstRate}%</Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.separator} />

        {/* Totals */}
        <View style={styles.rowBetween}>
          <Text style={styles.boldText}>SUBTOTAL</Text>
          <Text style={styles.boldText}>₹{invoice.totals.subtotal.toFixed(2)}</Text>
        </View>

        {invoice.totals.billDiscountAmount > 0 && (
          <View style={styles.rowBetween}>
            <Text style={styles.normalText}>Bill Discount</Text>
            <Text style={styles.normalText}>-₹{invoice.totals.billDiscountAmount.toFixed(2)}</Text>
          </View>
        )}

        <View style={styles.separator} />

        <Text style={styles.smallText}>(GST Inclusive)</Text>
        {invoice.gstType === GST_TYPES.CGST_SGST ? (
          <>
            <View style={styles.rowBetween}>
              <Text style={styles.normalText}>CGST</Text>
              <Text style={styles.normalText}>₹{invoice.totals.cgst.toFixed(2)}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.normalText}>SGST</Text>
              <Text style={styles.normalText}>₹{invoice.totals.sgst.toFixed(2)}</Text>
            </View>
          </>
        ) : (
          <View style={styles.rowBetween}>
            <Text style={styles.normalText}>IGST</Text>
            <Text style={styles.normalText}>₹{invoice.totals.igst.toFixed(2)}</Text>
          </View>
        )}

        {invoice.totals.roundingAdjustment !== 0 && (
          <View style={styles.rowBetween}>
            <Text style={styles.normalText}>Rounding</Text>
            <Text style={styles.normalText}>
              {invoice.totals.roundingAdjustment > 0 ? '+' : ''}₹{invoice.totals.roundingAdjustment.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.thickSeparator} />

        <View style={styles.rowBetween}>
          <Text style={styles.totalText}>TOTAL</Text>
          <Text style={styles.totalText}>₹{invoice.totals.grandTotal.toFixed(2)}</Text>
        </View>

        <View style={styles.thickSeparator} />

        <Text style={styles.amountWords}>{numberToWords(invoice.totals.grandTotal)}</Text>

        <View style={{ marginTop: 32 }} />

        <Text style={styles.footerText}>Thank you for your business!</Text>
        {shopProfile?.name && (
          <Text style={styles.footerText}>for {shopProfile.name}</Text>
        )}
        
        <View style={{ marginTop: 16 }} />
        <Text style={styles.poweredBy}>Powered by BillCraft</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  billContainer: {
    padding: 16,
    alignItems: 'center',
  },
  paper: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  billTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
    letterSpacing: 2,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    color: '#000',
  },
  centerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
  separator: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#999',
    marginVertical: 10,
  },
  thickSeparator: {
    borderBottomWidth: 2,
    borderColor: '#000',
    marginVertical: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: '700',
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  headerText: {
    fontWeight: '700',
    fontSize: 11,
    color: '#000',
  },
  itemRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  itemSubRow: {
    marginLeft: 30,
    marginTop: 2,
  },
  colSl: {
    width: 30,
    fontSize: 11,
    color: '#333',
  },
  colName: {
    flex: 1,
    fontSize: 11,
    color: '#333',
  },
  colRate: {
    width: 70,
    textAlign: 'right',
    fontSize: 11,
    color: '#333',
  },
  colQty: {
    width: 40,
    textAlign: 'right',
    fontSize: 11,
    color: '#333',
  },
  colAmt: {
    width: 80,
    textAlign: 'right',
    fontSize: 11,
    color: '#333',
  },
  discountText: {
    fontSize: 10,
    color: '#16A34A',
    fontStyle: 'italic',
  },
  gstText: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  normalText: {
    fontSize: 12,
    color: '#333',
  },
  boldText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  smallText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  amountWords: {
    fontSize: 11,
    color: '#333',
    fontStyle: 'italic',
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
  },
  poweredBy: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default BillView;
