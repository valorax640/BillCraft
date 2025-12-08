export const validateProduct = (product) => {
  const errors = {};

  if (!product.name || product.name.trim() === '') {
    errors.name = 'Product name is required';
  }

  if (!product.price || parseFloat(product.price) <= 0) {
    errors.price = 'Valid price is required';
  }

  if (product.gstRate === undefined || product.gstRate === null) {
    errors.gstRate = 'GST rate is required';
  }

  return {
    isValid: Object.keys(errors). length === 0,
    errors,
  };
};

export const validateCustomer = (customer) => {
  const errors = {};

  if (customer.phone && !/^[0-9]{10}$/.test(customer.phone)) {
    errors.phone = 'Phone must be 10 digits';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateInvoice = (invoice) => {
  const errors = {};

  if (!invoice.customer) {
    errors.customer = 'Customer is required';
  }

  if (!invoice.items || invoice.items.length === 0) {
    errors.items = 'At least one item is required';
  }

  return {
    isValid: Object. keys(errors).length === 0,
    errors,
  };
};