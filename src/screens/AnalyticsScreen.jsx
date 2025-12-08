import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import Header from '../components/Header';
import { formatCurrency } from '../utils/formatters';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { invoices, products } = useData();
  const [period, setPeriod] = useState('daily'); // daily, monthly

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const periodInvoices = invoices.filter(inv => {
    const invDate = new Date(inv.date);
    return period === 'daily' ? invDate >= todayStart : invDate >= monthStart;
  });

  const totalSales = periodInvoices.reduce((sum, inv) => sum + inv.totals.grandTotal, 0);
  const paidSales = periodInvoices
    .filter(inv => inv. status === 'paid')
    .reduce((sum, inv) => sum + inv.totals.grandTotal, 0);
  const unpaidSales = periodInvoices
    .filter(inv => inv.status === 'unpaid')
    .reduce((sum, inv) => sum + inv.totals.grandTotal, 0);

  // Top selling products
  const productSales = {};
  periodInvoices.forEach(inv => {
    inv.items.forEach(item => {
      if (! productSales[item.productId]) {
        productSales[item.productId] = {
          name: item.name,
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[item.productId].quantity += item.quantity;
      productSales[item.productId]. revenue += item.price * item.quantity * (1 - item.discount / 100);
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Pie chart data
  const pieChartColors = ['#FF6B35', '#F7931E', '#FDC830', '#37B5FF', '#4ECDC4'];
  const pieData = topProducts.map((product, index) => ({
    name: product.name,
    population: product.revenue,
    color: pieChartColors[index],
    legendFontColor: colors.text,
    legendFontSize: 13,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header isHome title="Analytics" greeting="Insights" />

      <ScrollView style={styles.content}>
        {/* Period Selector */}
        <View style={styles.periodContainer}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              { borderColor: colors.border },
              period === 'daily' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setPeriod('daily')}>
            <Text style={[
              styles.periodText,
              { color: period === 'daily' ? '#ffffff' : colors.text }
            ]}>
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.periodButton,
              { borderColor: colors.border },
              period === 'monthly' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setPeriod('monthly')}>
            <Text style={[
              styles.periodText,
              { color: period === 'monthly' ? '#ffffff' : colors.text }
            ]}>
              This Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sales Overview Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {formatCurrency(totalSales)}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Paid</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {formatCurrency(paidSales)}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Unpaid</Text>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {formatCurrency(unpaidSales)}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Invoices</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {periodInvoices.length}
            </Text>
          </View>
        </View>

        {/* Top Products */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Top Products</Text>
          {topProducts.length > 0 ? (
            <>
              <PieChart
                data={pieData}
                width={screenWidth - 64}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
              />
              <View style={styles.productList}>
                {topProducts.map((product, index) => (
                  <View key={index} style={styles.productItem}>
                    <View style={[styles.colorDot, { backgroundColor: pieChartColors[index] }]} />
                    <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={[styles.productValue, { color: colors.primary }]}>
                      {formatCurrency(product.revenue)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No sales data available
            </Text>
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
    padding: 16,
  },
  periodContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 15,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 16,
  },
  productList: {
    marginTop: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  productValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default AnalyticsScreen;