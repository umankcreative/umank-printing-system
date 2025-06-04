
import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';

interface TotalsSectionProps {
  subTotal: number;
  taxPercentage: number;
  taxAmount: number;
  grandTotal: number;
  selectedCurrency: string;
  handleTaxPercentageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TotalsSection: React.FC<TotalsSectionProps> = ({
  subTotal,
  taxPercentage,
  taxAmount,
  grandTotal,
  selectedCurrency,
  handleTaxPercentageChange,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Totals</h3>
      <div className="flex justify-between mb-2">
        <span>Sub Total:</span>
        <span>{formatCurrency(subTotal, selectedCurrency)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Tax Rate (%):</span>
        <input
          type="number"
          value={taxPercentage}
          onChange={handleTaxPercentageChange}
          className="w-24 p-2 border rounded"
          min="0"
          max="28"
          step="1"
        />
      </div>
      <div className="flex justify-between mb-2">
        <span>Tax Amount:</span>
        <span>{formatCurrency(taxAmount, selectedCurrency)}</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Grand Total:</span>
        <span>{formatCurrency(grandTotal, selectedCurrency)}</span>
      </div>
    </div>
  );
};

export default TotalsSection;
