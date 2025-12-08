import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Bottom Tab Navigator
import BottomTabNavigator from './BottomTabNavigator';

// Screens
import ProductListScreen from '../screens/ProductListScreen';
import AddEditProductScreen from '../screens/AddEditProductScreen';
import CreateInvoiceScreen from '../screens/CreateInvoiceScreen';
import InvoiceDetailScreen from '../screens/InvoiceDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ShopProfileScreen from '../screens/ShopProfileScreen';
import BackupScreen from '../screens/BackupScreen';
import PinLockScreen from '../screens/PinLockScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          keyboardHandlingEnabled: false,
        }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="ProductList" component={ProductListScreen} />
        <Stack.Screen name="AddEditProduct" component={AddEditProductScreen} />
        <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
        <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ShopProfile" component={ShopProfileScreen} />
        <Stack.Screen name="Backup" component={BackupScreen} />
        <Stack.Screen name="PinLock" component={PinLockScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;