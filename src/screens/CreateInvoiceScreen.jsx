import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import Header from '../components/Header';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomPicker from '../components/CustomPicker';
import InvoiceItemPicker from '../components/InvoiceItemPicker';
import { formatCurrency } from '../utils/formatters';
import { calculateInvoiceTotals, calculateRoundingAdjustment } from '../utils/calculations';
import { GST_TYPES } from '../constants/gstRates';

const CreateInvoiceScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { products, addInvoice } = useData();
  const [gstType, setGstType] = useState(GST_TYPES.CGST_SGST);
  const [items, setItems] = useState([]);
  const [billDiscount, setBillDiscount] = useState('0');
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enableRounding, setEnableRounding] = useState(true);

  const handleAddProduct = (product) => {
    // Check stock availability
    if (product.stock !== undefined && product.stock !== null) {
      const existing = items.find(item => item.productId === product.id);
      const currentQuantity = existing ? existing.quantity : 0;
      
      if (product.stock <= 0) {
        Alert.alert('Out of Stock', `${product.name} is currently out of stock.`);
        return;
      }
      
      if (currentQuantity >= product.stock) {
        Alert.alert('Insufficient Stock', `Only ${product.stock} units of ${product.name} available.`);
        return;
      }
    }

    const existing = items.find(item => item.productId === product.id);
    if (existing) {
      updateItemQuantity(existing.id, existing.quantity + 1, product);
    } else {
      setItems([
        ...items,
        {
          id: Date.now(). toString(),
          productId: product.id,
          name: product.name,
          price: product.price,
          gstRate: product.gstRate,
          quantity: 1,
          discount: 0,
        },
      ]);
    }
    setShowProductPicker(false);
  };

  const updateItemQuantity = (itemId, quantity, product) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    // Validate stock if product has stock tracking
    if (product && product.stock !== undefined && product.stock !== null) {
      if (quantity > product.stock) {
        Alert.alert('Insufficient Stock', `Only ${product.stock} units available.`);
        return;
      }
    }

    setItems(items.map(item => 
      item.id === itemId ? { ...item, quantity: parseInt(quantity) || 1 } : item
    ));
  };

  const updateItemDiscount = (itemId, discount) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, discount: parseFloat(discount) || 0 } : item
    ));
  };

  const removeItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const roundingAdjustment = enableRounding && items.length > 0
    ? calculateRoundingAdjustment(
        calculateInvoiceTotals(items, parseFloat(billDiscount) || 0, gstType, 0). grandTotal
      )
    : 0;

  const totals = items.length > 0
    ? calculateInvoiceTotals(items, parseFloat(billDiscount) || 0, gstType, roundingAdjustment)
    : null;

  const handleSaveInvoice = async (status) => {
    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }

    setLoading(true);
    const invoice = {
      items,
      gstType,
      billDiscount: parseFloat(billDiscount) || 0,
      totals,
      status,
    };

    const savedInvoice = await addInvoice(invoice);
    setLoading(false);
    navigation.replace('InvoiceDetail', { invoice: savedInvoice });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Create Invoice"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        {/* GST Type */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>GST Type</Text>
          <View style={styles.gstTypeContainer}>
            <TouchableOpacity
              style={[
                styles.gstTypeButton,
                { borderColor: colors.border },
                gstType === GST_TYPES.CGST_SGST && { backgroundColor: colors.primary },
              ]}
              onPress={() => setGstType(GST_TYPES.CGST_SGST)}>
              <Text style={[
                styles.gstTypeText,
                { color: gstType === GST_TYPES.CGST_SGST ? '#ffffff' : colors.text }
              ]}>
                CGST/SGST
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.gstTypeButton,
                { borderColor: colors.border },
                gstType === GST_TYPES. IGST && { backgroundColor: colors.primary },
              ]}
              onPress={() => setGstType(GST_TYPES.IGST)}>
              <Text style={[
                styles.gstTypeText,
                { color: gstType === GST_TYPES. IGST ? '#ffffff' : colors.text }
              ]}>
                IGST
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Items</Text>
            <CustomButton
              title="Add Item"
              onPress={() => setShowProductPicker(true)}
              style={styles.addButton}
            />
          </View>

          {items.map(item => (
            <View
              key={item.id}
              style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Icon name="close" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>

              <View style={styles.itemDetails}>
                <Text style={[styles.itemPrice, { color: colors.textSecondary }]}>
                  {formatCurrency(item.price)} × {item.quantity}
                </Text>
                <Text style={[styles.itemGst, { color: colors.textSecondary }]}>
                  GST: {item.gstRate}%
                </Text>
              </View>

              <View style={styles.itemInputs}>
                <CustomInput
                  label="Qty"
                  value={item.quantity.toString()}
                  onChangeText={(value) => {
                    const product = products.find(p => p.id === item.productId);
                    updateItemQuantity(item.id, value, product);
                  }}
                  keyboardType="number-pad"
                  style={styles.itemInput}
                />
                <CustomInput
                  label="Discount %"
                  value={item. discount.toString()}
                  onChangeText={(value) => updateItemDiscount(item.id, value)}
                  keyboardType="decimal-pad"
                  style={styles.itemInput}
                />
              </View>

              <Text style={[styles.itemTotal, { color: colors.primary }]}>
                Subtotal: {formatCurrency(item.price * item.quantity * (1 - item.discount / 100))}
              </Text>
            </View>
          ))}

          {items.length === 0 && (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No items added yet
            </Text>
          )}
        </View>

        {/* Bill Discount */}
        {items.length > 0 && (
          <View style={styles. section}>
            <CustomInput
              label="Bill Discount %"
              value={billDiscount}
              onChangeText={setBillDiscount}
              keyboardType="decimal-pad"
              placeholder="0"
            />
          </View>
        )}

        {/* Rounding Toggle */}
        {items.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.roundingToggle}
              onPress={() => setEnableRounding(! enableRounding)}>
              <Icon
                name={enableRounding ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.roundingText, { color: colors.text }]}>
                Enable Rounding Adjustment
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Totals */}
        {totals && (
          <View style={[styles.totalsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.totalsTitle, { color: colors. text }]}>Bill Summary</Text>
            
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Subtotal</Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>
                {formatCurrency(totals.subtotal)}
              </Text>
            </View>

            {totals.billDiscountAmount > 0 && (
              <View style={styles. totalRow}>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Discount</Text>
                <Text style={[styles.totalValue, { color: colors.error }]}>
                  - {formatCurrency(totals. billDiscountAmount)}
                </Text>
              </View>
            )}

            {gstType === GST_TYPES.CGST_SGST ?  (
              <>
                <View style={styles. totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>CGST</Text>
                  <Text style={[styles.totalValue, { color: colors.text }]}>
                    {formatCurrency(totals.cgst)}
                  </Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>SGST</Text>
                  <Text style={[styles.totalValue, { color: colors.text }]}>
                    {formatCurrency(totals.sgst)}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>IGST</Text>
                <Text style={[styles.totalValue, { color: colors.text }]}>
                  {formatCurrency(totals.igst)}
                </Text>
              </View>
            )}

            {enableRounding && roundingAdjustment !== 0 && (
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
                  Rounding Adjustment
                </Text>
                <Text style={[styles.totalValue, { color: colors.text }]}>
                  {formatCurrency(roundingAdjustment)}
                </Text>
              </View>
            )}

            <View style={[styles.grandTotalRow, { borderTopColor: colors.border }]}>
              <Text style={[styles. grandTotalLabel, { color: colors.text }]}>Grand Total</Text>
              <Text style={[styles.grandTotalValue, { color: colors.primary }]}>
                {formatCurrency(totals.grandTotal)}
              </Text>
            </View>
          </View>
        )}

        {/* Save Buttons */}
        {items.length > 0 && (
          <View style={styles.saveButtons}>
            <CustomButton
              title="Save as Unpaid"
              onPress={() => handleSaveInvoice('unpaid')}
              variant="outline"
              loading={loading}
              style={styles.saveButton}
            />
            <CustomButton
              title="Save as Paid"
              onPress={() => handleSaveInvoice('paid')}
              variant="success"
              loading={loading}
              style={styles.saveButton}
            />
          </View>
        )}
      </ScrollView>

      <InvoiceItemPicker
        visible={showProductPicker}
        products={products}
        onSelect={handleAddProduct}
        onClose={() => setShowProductPicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  link: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  gstTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  gstTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  gstTypeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  itemCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemPrice: {
    fontSize: 14,
  },
  itemGst: {
    fontSize: 14,
  },
  itemInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  itemInput: {
    flex: 1,
    marginBottom: 0,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
  },
  roundingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundingText: {
    fontSize: 16,
    marginLeft: 8,
  },
  totalsCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  totalsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  saveButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  saveButton: {
    flex: 1,
  },
});

export default CreateInvoiceScreen;