import React, { createContext, useState, useEffect, useContext } from 'react';
import StorageService from '../storage/StorageService';
import { STORAGE_KEYS } from '../constants/config';
import { generateId } from '../utils/formatters';
import { generateInvoiceNumber } from '../utils/invoiceGenerator';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [shopProfile, setShopProfile] = useState(null);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    const [productsData, customersData, invoicesData, shopData, lastInvoice] = await Promise.all([
      StorageService.getData(STORAGE_KEYS.PRODUCTS),
      StorageService.getData(STORAGE_KEYS.CUSTOMERS),
      StorageService.getData(STORAGE_KEYS. INVOICES),
      StorageService.getData(STORAGE_KEYS.SHOP_PROFILE),
      StorageService.getData(STORAGE_KEYS.INVOICE_COUNTER),
    ]);

    setProducts(productsData || []);
    setCustomers(customersData || []);
    setInvoices(invoicesData || []);
    setShopProfile(shopData);
    setLastInvoiceNumber(lastInvoice || '');
    setLoading(false);
  };

  // Product Operations
  const addProduct = async (product) => {
    const newProduct = { ...product, id: generateId() };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    await StorageService.saveData(STORAGE_KEYS.PRODUCTS, updatedProducts);
    return newProduct;
  };

  const updateProduct = async (id, updatedProduct) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, ... updatedProduct } : p
    );
    setProducts(updatedProducts);
    await StorageService.saveData(STORAGE_KEYS.PRODUCTS, updatedProducts);
  };

  const deleteProduct = async (id) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    await StorageService. saveData(STORAGE_KEYS.PRODUCTS, updatedProducts);
  };

  // Customer Operations
  const addCustomer = async (customer) => {
    const newCustomer = { ...customer, id: generateId() };
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    await StorageService.saveData(STORAGE_KEYS. CUSTOMERS, updatedCustomers);
    return newCustomer;
  };

  const updateCustomer = async (id, updatedCustomer) => {
    const updatedCustomers = customers.map(c => 
      c.id === id ? { ...c, ... updatedCustomer } : c
    );
    setCustomers(updatedCustomers);
    await StorageService.saveData(STORAGE_KEYS.CUSTOMERS, updatedCustomers);
  };

  const deleteCustomer = async (id) => {
    const updatedCustomers = customers.filter(c => c.id !== id);
    setCustomers(updatedCustomers);
    await StorageService.saveData(STORAGE_KEYS.CUSTOMERS, updatedCustomers);
  };

  // Invoice Operations
  const addInvoice = async (invoice) => {
    const invoiceNumber = generateInvoiceNumber(lastInvoiceNumber);
    const newInvoice = {
      ...invoice,
      id: generateId(),
      invoiceNo: invoiceNumber,
      date: new Date().toISOString(),
    };
    
    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    setLastInvoiceNumber(invoiceNumber);
    
    await Promise.all([
      StorageService.saveData(STORAGE_KEYS.INVOICES, updatedInvoices),
      StorageService.saveData(STORAGE_KEYS.INVOICE_COUNTER, invoiceNumber),
    ]);
    
    return newInvoice;
  };

  const updateInvoice = async (id, updatedInvoice) => {
    const updatedInvoices = invoices.map(inv => 
      inv.id === id ? { ...inv, ...updatedInvoice } : inv
    );
    setInvoices(updatedInvoices);
    await StorageService.saveData(STORAGE_KEYS.INVOICES, updatedInvoices);
  };

  const duplicateInvoice = async (invoiceId) => {
    const originalInvoice = invoices.find(inv => inv.id === invoiceId);
    if (!originalInvoice) return null;

    const { id, invoiceNo, date, ... invoiceData } = originalInvoice;
    return await addInvoice(invoiceData);
  };

  // Shop Profile
  const updateShopProfile = async (profile) => {
    setShopProfile(profile);
    await StorageService.saveData(STORAGE_KEYS.SHOP_PROFILE, profile);
  };

  return (
    <DataContext.Provider
      value={{
        products,
        customers,
        invoices,
        shopProfile,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addInvoice,
        updateInvoice,
        duplicateInvoice,
        updateShopProfile,
        refreshData: loadAllData,
      }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);