import { INVOICE_PREFIX } from '../constants/config';

export const generateInvoiceNumber = (lastInvoiceNumber) => {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]. replace(/-/g, '');
  
  if (! lastInvoiceNumber || ! lastInvoiceNumber.includes(dateString)) {
    // New day, reset counter
    return `${INVOICE_PREFIX}-${dateString}-001`;
  }
  
  // Same day, increment counter
  const parts = lastInvoiceNumber.split('-');
  const counter = parseInt(parts[2]) + 1;
  const paddedCounter = String(counter).padStart(3, '0');
  
  return `${INVOICE_PREFIX}-${dateString}-${paddedCounter}`;
};