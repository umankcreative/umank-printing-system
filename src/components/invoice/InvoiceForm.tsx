
import React from 'react';
import BillToSection from './BillToSection';
import ShipToSection from './ShipToSection';
import InvoiceInformation from './InvoiceInformation';
import YourCompanySection from './YourCompanySection';
import ItemDetails from "./ItemDetails";
import OrderSelection from "./OrderSelection";
import TotalsSection from './TotalsSection';
import NotesSection from './NotesSection';
import { Contact, InvoiceInfo, Item } from '../../utils/dummyData';

interface Branch {
  id: string;
  name?: string;
  address?: string;
  contact?: string;
}

interface Order {
  id: string;
  order_date?: string;
  delivery_date?: string;
  notes?: string;
  customers?: {
    name?: string;
    address?: string;
    contact?: string;
  };
  order_items?: Array<{
    quantity?: number;
    price?: number;
    products?: {
      name?: string;
      description?: string;
      selling_price?: number;
    };
  }>;
}

interface InvoiceFormProps {
  // Form data
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
  selectedOrderId: string | null;
  billToName: string;
  billToPhone: string;
  billToAddress: string;
  
  // Setters
  setBillTo: React.Dispatch<React.SetStateAction<Contact>>;
  setShipTo: React.Dispatch<React.SetStateAction<Contact>>;
  setInvoice: React.Dispatch<React.SetStateAction<InvoiceInfo>>;
  setYourCompany: React.Dispatch<React.SetStateAction<Branch>>;
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  setTaxPercentage: React.Dispatch<React.SetStateAction<number>>;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
  setBillToName: React.Dispatch<React.SetStateAction<string>>;
  setBillToPhone: React.Dispatch<React.SetStateAction<string>>;
  setBillToAddress: React.Dispatch<React.SetStateAction<string>>;
  
  // Handlers
  handleOrderSelect: (selectedOrder: Order) => void;
  handleBranchSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleItemChange: (index: number, field: keyof Item, value: string | number) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  handleTaxPercentageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  billTo,
  shipTo,
  invoice,
  yourCompany,
  items,
  taxPercentage,
  taxAmount,
  subTotal,
  grandTotal,
  notes,
  selectedCurrency,
  selectedOrderId,
  billToName,
  billToPhone,
  billToAddress,
  setBillTo,
  setShipTo,
  setInvoice,
  setYourCompany,
  setItems,
  setTaxPercentage,
  setNotes,
  setSelectedCurrency,
  setBillToName,
  setBillToPhone,
  setBillToAddress,
  handleOrderSelect,
  handleBranchSelect,
  handleItemChange,
  addItem,
  removeItem,
  handleTaxPercentageChange,
}) => {
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<Contact>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
      <form>
        <OrderSelection 
          onOrderSelect={handleOrderSelect}
          selectedOrderId={selectedOrderId}
        />
        
        <BillToSection
          billTo={billTo}
          handleInputChange={handleInputChange(setBillTo)}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          billToName={billToName}
          billToPhone={billToPhone}
          billToAddress={billToAddress}
          setBillToName={setBillToName}
          setBillToPhone={setBillToPhone}
          setBillToAddress={setBillToAddress}
        />
        
        <ShipToSection
          shipTo={shipTo}
          handleInputChange={handleInputChange(setShipTo)}
          billTo={billTo}
        />

        <InvoiceInformation
          invoice={invoice}
          handleInputChange={handleInputChange(setInvoice)}
        />

        <YourCompanySection
          yourCompany={yourCompany}
          handleInputChange={handleInputChange(setYourCompany)}
          handleBranchSelect={handleBranchSelect}
        />

        <ItemDetails
          items={items}
          handleItemChange={handleItemChange}
          addItem={addItem}
          removeItem={removeItem}
        />

        <TotalsSection
          subTotal={subTotal}
          taxPercentage={taxPercentage}
          taxAmount={taxAmount}
          grandTotal={grandTotal}
          selectedCurrency={selectedCurrency}
          handleTaxPercentageChange={handleTaxPercentageChange}
        />

        <NotesSection
          notes={notes}
          setNotes={setNotes}
        />
      </form>
    </div>
  );
};

export default InvoiceForm;
