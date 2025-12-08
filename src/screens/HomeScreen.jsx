import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import Header from '../components/Header';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { products, invoices } = useData();

  const todayInvoices = invoices.filter(inv => {
    const invDate = new Date(inv.date).toDateString();
    return invDate === new Date().toDateString();
  });

  const todayTotal = todayInvoices.reduce((sum, inv) => sum + inv.totals.grandTotal, 0);

  const quickActions = [
    {
      id: 'invoice',
      title: 'New Invoice',
      icon: 'add-circle',
      color: colors.primary,
      screen: 'CreateInvoice',
      gradient: true,
    },
    {
      id: 'products',
      title: 'Products',
      icon: 'inventory-2',
      color: colors.secondary,
      count: products.length,
      screen: 'ProductList'
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        isHome 
        title="BillCraft" 
        greeting="Good Day!" 
        rightIcon="settings" 
        onRightPress={() => navigation.navigate('Settings')}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Today's Sales Card */}
        <View style={[
          styles.salesCard,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.shadow,
          }
        ]}>
          <View style={styles.salesHeader}>
            <View style={[styles.salesIconContainer, { backgroundColor: colors.successLight }]}>
              <Icon name="trending-up" size={28} color={colors.success} />
            </View>
            <View style={styles.salesInfo}>
              <Text style={[styles.salesLabel, { color: colors.textSecondary }]}>Today's Sales</Text>
              <Text style={[styles.salesValue, { color: colors.primary }]}>
                ₹{todayTotal.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={[styles.salesFooter, { backgroundColor: colors.surfaceAlt }]}>
            <Icon name="receipt" size={18} color={colors.textTertiary} />
            <Text style={[styles.salesCount, { color: colors.textSecondary }]}>
              {todayInvoices.length} invoices today
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.actionCard,
                action.gradient && styles.actionCardPrimary,
                {
                  backgroundColor: action.gradient ? colors.primary : colors.surface,
                  shadowColor: colors.shadow,
                  borderColor: action.gradient ? colors.primaryDark : colors.border,
                }
              ]}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.7}>
              <View style={[
                styles.actionIconContainer,
                { backgroundColor: action.gradient ? 'rgba(255,255,255,0.2)' : action.color + '15' }
              ]}>
                <Icon
                  name={action.icon}
                  size={action.gradient ? 36 : 32}
                  color={action.gradient ? '#FFF' : action.color}
                />
              </View>
              <Text style={[
                styles.actionTitle,
                { color: action.gradient ? '#FFF' : colors.text }
              ]}>
                {action.title}
              </Text>
              {action.count !== undefined && (
                <View style={[styles.countBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.countText, { color: colors.primary }]}>
                    {action.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
        <View style={[styles.activityCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
          {todayInvoices.slice(0, 3).length > 0 ? (
            todayInvoices.slice(0, 3).map((invoice, index) => (
              <TouchableOpacity
                key={invoice.id}
                style={[
                  styles.activityItem,
                  index !== todayInvoices.slice(0, 3).length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border
                  }
                ]}
                onPress={() => navigation.navigate('InvoiceDetail', { invoice })}>
                <View style={[styles.activityIcon, { backgroundColor: colors.primary + '15' }]}>
                  <Icon name="receipt-long" size={20} color={colors.primary} />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>
                    Invoice #{invoice.invoiceNo}
                  </Text>
                  <Text style={[styles.activitySubtitle, { color: colors.textSecondary }]}>
                    {new Date(invoice.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text style={[styles.activityAmount, { color: colors.primary }]}>
                  ₹{invoice.totals.grandTotal.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="inbox" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No invoices today
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  salesCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  salesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  salesIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  salesInfo: {
    flex: 1,
  },
  salesLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  salesValue: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  salesFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  salesCount: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 32,
  },
  actionCard: {
    width: '31%',
    margin: '1%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    minHeight: 120,
    justifyContent: 'center',
  },
  actionCardPrimary: {
    width: '98%',
    margin: '1%',
    elevation: 4,
  },
  actionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: '800',
  },
  activityCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    marginTop: 12,
    fontWeight: '500',
  },
});

export default HomeScreen;
