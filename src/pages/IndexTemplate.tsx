
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormData } from '../hooks/useFormData';
import { useInvoiceCalculations } from '../hooks/useInvoiceCalculations';
import { generateDummyData, Contact, Item } from '../utils/dummyData';
import { generateRandomInvoiceNumber } from '../utils/invoiceNumberGenerator';
import { useOrderContext } from '../context/OrderContext';
import InvoiceForm from '../components/invoice/InvoiceForm';
import TemplateGallery from '../components/invoice/TemplateGallery';
import ActionButtons from '../components/invoice/ActionButtons';
import { useBranches } from '../hooks/useBranches';

interface Order {
  id: string;
  order_date?: string;
  delivery_date?: string;
  notes?: string;
  created_at?: string;
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

interface Branch {
  id: string;
  name?: string;
  address?: string;
  contact?: string;
}

interface FormData {
  billTo: Contact;
  shipTo: Contact;
  invoice: any;
  yourCompany: Contact;
  items: Item[];
  taxPercentage: number;
  taxAmount: number;
  subTotal: number;
  grandTotal: number;
  notes: string;
  selectedCurrency: string;
}

const IndexTemplate: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    selectedCurrency,
    setSelectedCurrency,
    selectedOrderId,
    setSelectedOrderId,
    billTo,
    setBillTo,
    shipTo,
    setShipTo,
    billToName,
    setBillToName,
    billToPhone,
    setBillToPhone,
    billToAddress,
    setBillToAddress,
    invoice,
    setInvoice,
    yourCompany,
    setYourCompany,
    items,
    setItems,
    taxPercentage,
    setTaxPercentage,
    notes,
    setNotes,
  } = useFormData();

  const { subTotal, taxAmount, grandTotal } = useInvoiceCalculations(items, taxPercentage);
const { orders} = useOrderContext();
  const handleOrderSelect = (selectedOrder: Order): void => {
    setSelectedOrderId(selectedOrder.id);
    
    // Set invoice number and date from order
    setInvoice(prev => ({
      ...prev,
      number: selectedOrder.id.slice(0, 8).toUpperCase(),
      date: selectedOrder.order_date ? new Date(selectedOrder.order_date).toISOString().split('T')[0] : "",
      paymentDate: selectedOrder.delivery_date ? new Date(selectedOrder.delivery_date).toISOString().split('T')[0] : ""
    }));

    // Set customer data
    if (selectedOrder.customers) {
      setBillTo({
        name: selectedOrder.customers.name || "",
        address: selectedOrder.customers.address || "",
        phone: selectedOrder.customers.contact || ""
      });
    }

    // Set items from order_items
    if (selectedOrder.order_items && selectedOrder.order_items.length > 0) {
      const orderItems: Item[] = selectedOrder.order_items.map(item => ({
        name: item.products?.name || "Product",
        description: item.products?.description || "",
        quantity: item.quantity || 0,
        amount: item.price || item.products?.selling_price || 0,
        total: (item.quantity || 0) * (item.price || item.products?.selling_price || 0)
      }));
      setItems(orderItems);
    }

    // Set notes
    if (selectedOrder.notes) {
      setNotes(selectedOrder.notes);
    }
  };

  const { branches } = useBranches();
  const handleBranchSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const branchId = e.target.value;
    const selectedBranch = branches.find(branch => branch.id === branchId);
    
    if (selectedBranch) {
      setYourCompany({
        name: selectedBranch.name || "",
        address: selectedBranch.location || "",
        phone: selectedBranch.phone || ""
      });
    }
  };

  const handleItemChange = (index: number, field: keyof Item, value: string | number): void => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    if (field === "quantity" || field === "amount") {
      newItems[index].total = newItems[index].quantity * newItems[index].amount;
    }
    setItems(newItems);
  };

  const addItem = (): void => {
    setItems([
      ...items,
      { name: "", description: "", quantity: 0, amount: 0, total: 0 },
    ]);
  };

  const removeItem = (index: number): void => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleTaxPercentageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const taxRate = parseFloat(e.target.value) || 0;
    setTaxPercentage(taxRate);
  };

  const handleTemplateClick = (templateNumber: number): void => {
    const formData: FormData = {
      billTo: {
        name: billToName || billTo.name,
        address: billToAddress || billTo.address,
        phone: billToPhone || billTo.phone
      },
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
    };
    navigate("/admin/template", {
      state: { formData, selectedTemplate: templateNumber },
    });
  };

  const fillDummyData = (): void => {
    const dummyData = generateDummyData();
    setBillTo(dummyData.billTo);
    setShipTo(dummyData.shipTo);
    setInvoice(dummyData.invoice);
    setYourCompany(dummyData.yourCompany);
    setItems(dummyData.items);
    setTaxPercentage(dummyData.taxPercentage);
    setNotes(dummyData.notes);
  };

  const clearForm = (): void => {
    setBillTo({ name: "", address: "", phone: "" });
    setShipTo({ name: "", address: "", phone: "" });
    setInvoice({
      date: "",
      paymentDate: "",
      number: generateRandomInvoiceNumber(),
    });
    setYourCompany({ name: "", address: "", phone: "" });
    setItems([{ name: "", description: "", quantity: 0, amount: 0, total: 0 }]);
    setTaxPercentage(0);
    setNotes("");
    localStorage.removeItem("formData");
  };

  const navigateToReceipt = (): void => {
    navigate("/admin/receipt", {
      state: {
        formData: {
          billTo: {
            name: billToName || billTo.name,
            address: billToAddress || billTo.address,
            phone: billToPhone || billTo.phone
          },
          shipTo,
          invoice,
          yourCompany,
          items,
          taxPercentage,
          notes,
          selectedCurrency,
        },
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold mb-8 text-center">Pembuat Invoice</h1>
      
      <ActionButtons
        clearForm={clearForm}
        fillDummyData={fillDummyData}
        navigateToReceipt={navigateToReceipt}
        
      />
      
      <div className="flex flex-col md:flex-row gap-8">
        <InvoiceForm
          billTo={billTo}
          shipTo={shipTo}
          invoice={invoice}
          yourCompany={yourCompany}
          items={items}
          taxPercentage={taxPercentage}
          taxAmount={taxAmount}
          subTotal={subTotal}
          grandTotal={grandTotal}
          notes={notes}
          selectedCurrency={selectedCurrency}
          selectedOrderId={selectedOrderId}
          billToName={billToName}
          billToPhone={billToPhone}
          billToAddress={billToAddress}
          setBillTo={setBillTo}
          setShipTo={setShipTo}
          setInvoice={setInvoice}
          setYourCompany={setYourCompany}
          setItems={setItems}
          setTaxPercentage={setTaxPercentage}
          setNotes={setNotes}
          setSelectedCurrency={setSelectedCurrency}
          setBillToName={setBillToName}
          setBillToPhone={setBillToPhone}
          setBillToAddress={setBillToAddress}
          handleOrderSelect={handleOrderSelect}
          handleBranchSelect={handleBranchSelect}
          handleItemChange={handleItemChange}
          addItem={addItem}
          removeItem={removeItem}
          handleTaxPercentageChange={handleTaxPercentageChange}
        />

        <TemplateGallery handleTemplateClick={handleTemplateClick} />
      </div>
    </div>
  );
};

export default IndexTemplate;
