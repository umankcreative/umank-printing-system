
import React from 'react';
import FloatingLabelInput from './FloatingLabelInput';
import { useCustomerContext } from '../../context/CustomerContext';
import { Customer } from '../../types/api';

interface Customer {
  id: string;
  name: string;
  address?: string;
  contact?: string;
}

interface BillTo {
  name: string;
  address: string;
  phone: string;
}

interface BillToSectionProps {
  billTo: BillTo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  billToName?: string;
  billToPhone?: string;
  billToAddress?: string;
  setBillToName?: (name: string) => void;
  setBillToPhone?: (phone: string) => void;
  setBillToAddress?: (address: string) => void;
}

const BillToSection: React.FC<BillToSectionProps> = ({ 
  billTo, 
  handleInputChange, 
  selectedCurrency, 
  setSelectedCurrency,
  billToName,
  billToPhone,
  billToAddress,
  setBillToName,
  setBillToPhone,
  setBillToAddress
}) => {
  const { 
      customers,
      loading 
    } = useCustomerContext();

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    const selectedCustomer = customers.find((c: Customer) => c.id === customerId);
    
    if (selectedCustomer && setBillToName && setBillToPhone && setBillToAddress) {
      // Update individual fields when customer is manually selected
      setBillToName(selectedCustomer.name);
      setBillToPhone(selectedCustomer.contact || '');
      setBillToAddress(selectedCustomer.address || '');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setBillToName) {
      setBillToName(e.target.value);
    } else {
      handleInputChange(e);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setBillToPhone) {
      setBillToPhone(e.target.value);
    } else {
      handleInputChange(e);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setBillToAddress) {
      setBillToAddress(e.target.value);
    } else {
      handleInputChange(e);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">Tagihan Kepada</h2>
      <div className="mb-4">
        <label htmlFor="customerSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Pelanggan
        </label>
        <select
          id="customerSelect"
          onChange={handleCustomerSelect}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          <option value="">Pilih pelanggan...</option>
          {customers.map((customer: Customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingLabelInput
          id="billToName"
          label="Nama"
          value={billToName !== undefined ? billToName : billTo.name}
          onChange={handleNameChange}
          name="name"
        />
        <FloatingLabelInput
          id="billToPhone"
          label="Telepon"
          value={billToPhone !== undefined ? billToPhone : billTo.phone}
          onChange={handlePhoneChange}
          name="phone"
        />
      </div>
      <FloatingLabelInput
        id="billToAddress"
        label="Alamat"
        value={billToAddress !== undefined ? billToAddress : billTo.address}
        onChange={handleAddressChange}
        name="address"
        className="mt-4"
      />
      
      <div className="mt-4">
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
          Mata Uang
        </label>
        <select
          id="currency"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="IDR">Rupiah Indonesia (IDR)</option>
          <option value="USD">Dolar Amerika (USD)</option>
          <option value="INR">Rupee India (INR)</option>
        </select>
      </div>
    </div>
  );
};

export default BillToSection;
