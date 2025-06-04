
export const formatCurrency = (amount, currency = 'IDR') => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return currency === 'IDR' ? 'Rp 0' : '$0.00';
  }

  const currencySymbols = {
    USD: '$',
    INR: '₹',
    IDR: 'Rp '
  };

  const symbol = currencySymbols[currency] || 'Rp ';
  
  if (currency === 'IDR') {
    // Format Indonesian Rupiah with proper thousand separators
    return symbol + new Intl.NumberFormat('id-ID').format(numericAmount);
  }
  
  return symbol + numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
