
import { useState, useEffect } from 'react';
import { Item } from '../utils/dummyData';

export const useInvoiceCalculations = (items: Item[], taxPercentage: number) => {
  const [subTotal, setSubTotal] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  const calculateSubTotal = (): number => {
    const calculatedSubTotal = items.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
    setSubTotal(calculatedSubTotal);
    return calculatedSubTotal;
  };

  const calculateTaxAmount = (subTotalValue: number): number => {
    const tax = (subTotalValue * taxPercentage) / 100;
    setTaxAmount(tax);
    return tax;
  };

  const calculateGrandTotal = (subTotalValue: number, taxAmountValue: number): number => {
    const total = parseFloat(subTotalValue.toString()) + parseFloat(taxAmountValue.toString());
    setGrandTotal(total);
    return total;
  };

  const updateTotals = (): void => {
    const currentSubTotal = calculateSubTotal();
    const currentTaxAmount = calculateTaxAmount(currentSubTotal);
    calculateGrandTotal(currentSubTotal, currentTaxAmount);
  };

  useEffect(() => {
    updateTotals();
  }, [items, taxPercentage]);

  return {
    subTotal,
    taxAmount,
    grandTotal,
    updateTotals,
  };
};
