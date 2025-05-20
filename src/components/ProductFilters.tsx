import React from 'react';
import { Search } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../types';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  // statusFilter: string;
  // onStatusChange: (value: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  // statusFilter,
  // onStatusChange,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search products..."
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            <option value="">All Categories</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select> */}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
