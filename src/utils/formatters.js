export const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toFixed(2)}`;
};

export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateTime = (date) => {
  const d = new Date(date);
  return `${formatDate(d)} ${d.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })}`;
};

export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};