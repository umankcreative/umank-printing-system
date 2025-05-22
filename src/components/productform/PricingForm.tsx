import React from 'react';
import { formatCurrency } from '../../utils/productUtils';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface PricingFormProps {
  productionCost: number;
  profitMargin: number;
  setProfitMargin: (margin: number) => void;
  sellingPrice: number;
  stock: number;
  setStock: (stock: number) => void;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}

const PricingForm: React.FC<PricingFormProps> = ({
  productionCost,
  profitMargin,
  setProfitMargin,
  sellingPrice,
  stock,
  setStock,
  isActive,
  setIsActive,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
        <h3 className="font-medium text-blue-800 mb-2">Ringkasan Biaya</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm text-gray-600">Biaya Produksi:</div>
          <div className="text-sm font-medium text-gray-800">
            {formatCurrency(productionCost)}
          </div>
          <div className="text-sm text-gray-600">Margin Keuntungan:</div>
          <div className="text-sm font-medium text-gray-800">
            {profitMargin}%
          </div>
          <div className="text-sm text-gray-600">Harga Jual:</div>
          <div className="text-sm font-medium text-blue-700">
            {formatCurrency(sellingPrice)}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="profitMargin"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Margin Keuntungan (%) <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <input
            type="range"
            id="profitMargin"
            value={profitMargin}
            onChange={(e) => setProfitMargin(parseFloat(e.target.value))}
            min="0"
            max="200"
            step="1"
            className="flex-grow h-2 rounded-lg appearance-none bg-gray-200 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
          />
          <span className="ml-4 bg-gray-100 py-1 px-2 rounded text-sm min-w-[60px] text-center">
            {profitMargin}%
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="stock"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Stok <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="stock"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value) || 0)}
          min="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          required
        />
      </div>

      <div>
        <label className="flex justify-between items-center cursor-pointer">
          <span className="text-sm font-medium text-gray-700">
            Status Produk (Ditampilkan di Store)
          </span>
          <div className="relative" onClick={() => setIsActive(!isActive)}>
            {isActive ? (
              <div className="flex items-center">
                <span className="mr-2 text-sm text-green-600">Active</span>
                <ToggleRight className="h-8 w-8 text-green-500" />
              </div>
            ) : (
              <div className="flex items-center">
                <span className="mr-2 text-sm text-red-500">Inactive</span>
                <ToggleLeft className="h-8 w-8 text-red-400" />
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default PricingForm;
