export const calculateItemTotal = (price, quantity, discount = 0) => {
  const subtotal = price * quantity;
  const discountAmount = (subtotal * discount) / 100;
  return subtotal - discountAmount;
};

export const calculateGST = (amount, gstRate, gstType) => {
  const gstAmount = (amount * gstRate) / 100;
  
  if (gstType === 'CGST_SGST') {
    return {
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      igst: 0,
      total: gstAmount,
    };
  } else {
    return {
      cgst: 0,
      sgst: 0,
      igst: gstAmount,
      total: gstAmount,
    };
  }
};

export const calculateInvoiceTotals = (items, billDiscount = 0, gstType = 'CGST_SGST', roundingAdjustment = 0) => {
  // Calculate subtotal (before GST and discount)
  const subtotal = items.reduce((sum, item) => {
    const itemSubtotal = item.price * item.quantity;
    const itemDiscount = (itemSubtotal * (item.discount || 0)) / 100;
    return sum + (itemSubtotal - itemDiscount);
  }, 0);

  // Apply bill-level discount
  const billDiscountAmount = (subtotal * billDiscount) / 100;
  const subtotalAfterDiscount = subtotal - billDiscountAmount;

  // Calculate GST for each item
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;

  items.forEach(item => {
    const itemSubtotal = item.price * item.quantity;
    const itemDiscount = (itemSubtotal * (item.discount || 0)) / 100;
    const itemTotal = itemSubtotal - itemDiscount;
    
    // Adjust for bill discount proportion
    const proportionalAmount = itemTotal * (1 - billDiscount / 100);
    
    const gst = calculateGST(proportionalAmount, item.gstRate, gstType);
    totalCGST += gst. cgst;
    totalSGST += gst.sgst;
    totalIGST += gst.igst;
  });

  const totalGST = totalCGST + totalSGST + totalIGST;
  const grandTotal = subtotalAfterDiscount + totalGST + roundingAdjustment;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    billDiscountAmount: parseFloat(billDiscountAmount.toFixed(2)),
    subtotalAfterDiscount: parseFloat(subtotalAfterDiscount.toFixed(2)),
    cgst: parseFloat(totalCGST.toFixed(2)),
    sgst: parseFloat(totalSGST.toFixed(2)),
    igst: parseFloat(totalIGST.toFixed(2)),
    totalGST: parseFloat(totalGST.toFixed(2)),
    roundingAdjustment: parseFloat(roundingAdjustment),
    grandTotal: parseFloat(grandTotal.toFixed(2)),
  };
};

export const calculateRoundingAdjustment = (amount) => {
  const rounded = Math.round(amount);
  return parseFloat((rounded - amount).toFixed(2));
};