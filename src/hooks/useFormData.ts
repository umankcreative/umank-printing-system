import { useState, useEffect } from 'react';
import { Contact, InvoiceInfo, Item } from '../utils/dummyData';
import { generateRandomInvoiceNumber } from '../utils/invoiceNumberGenerator';
import { Branch } from '../types/api';

interface FormData {
  billTo: Contact;
  shipTo: Contact;
  invoice: InvoiceInfo;
  yourCompany: Branch;
  items: Item[];
  taxPercentage: number;
  taxAmount: number;
  subTotal: number;
  grandTotal: number;
  notes: string;
  selectedCurrency: string;
  billToName: string;
  billToPhone: string;
  billToAddress: string;
}

export const useFormData = () => {
  // Currency and order state
  const [selectedCurrency, setSelectedCurrency] = useState<string>('IDR');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Bill to information
  const [billTo, setBillTo] = useState<Contact>({ name: '', address: '', phone: '' });
  const [billToName, setBillToName] = useState<string>('');
  const [billToPhone, setBillToPhone] = useState<string>('');
  const [billToAddress, setBillToAddress] = useState<string>('');

  // Ship to information
  const [shipTo, setShipTo] = useState<Contact>({ name: '', address: '', phone: '' });

  // Invoice details
  const [invoice, setInvoice] = useState<InvoiceInfo>({
    number: generateRandomInvoiceNumber(),
    date: '',
    paymentDate: ''
  });

  // Company information
  const [yourCompany, setYourCompany] = useState<Branch>({ 
    id: '', 
    name: '', 
    location: '',
    is_active: true,
    created_at: '',
    updated_at: ''
  });

  // Items and calculations
  const [items, setItems] = useState<Item[]>([{ 
    name: '', 
    description: '', 
    quantity: 0, 
    amount: 0, 
    total: 0 
  }]);
  const [taxPercentage, setTaxPercentage] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  // Calculate derived values
  const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
  const taxAmount = (subTotal * taxPercentage) / 100;
  const grandTotal = subTotal + taxAmount;

  return {
    // Basic form data
    selectedCurrency,
    setSelectedCurrency,
    selectedOrderId,
    setSelectedOrderId,
    
    // Bill to information
    billTo,
    setBillTo,
    billToName,
    setBillToName,
    billToPhone,
    setBillToPhone,
    billToAddress,
    setBillToAddress,
    
    // Ship to information
    shipTo,
    setShipTo,
    
    // Invoice details
    invoice,
    setInvoice,
    
    // Company information
    yourCompany,
    setYourCompany,
    
    // Items and calculations
    items,
    setItems,
    taxPercentage,
    setTaxPercentage,
    notes,
    setNotes,
    
    // Calculated values
    subTotal,
    taxAmount,
    grandTotal
  };
};
