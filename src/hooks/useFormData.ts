
import { useState, useEffect } from 'react';
import { Contact, InvoiceInfo, Item } from '../utils/dummyData';
import { generateRandomInvoiceNumber } from '../utils/invoiceNumberGenerator';

interface FormData {
  billTo: Contact;
  shipTo: Contact;
  invoice: InvoiceInfo;
  yourCompany: Contact;
  items: Item[];
  taxPercentage: number;
  taxAmount: number;
  subTotal: number;
  grandTotal: number;
  notes: string;
  selectedCurrency: string;
}

export const useFormData = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("IDR");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [billTo, setBillTo] = useState<Contact>({ name: "", address: "", phone: "" });
  const [shipTo, setShipTo] = useState<Contact>({ name: "", address: "", phone: "" });
  
  const [billToName, setBillToName] = useState<string>("");
  const [billToPhone, setBillToPhone] = useState<string>("");
  const [billToAddress, setBillToAddress] = useState<string>("");
  
  const [invoice, setInvoice] = useState<InvoiceInfo>({
    date: "",
    paymentDate: "",
    number: "",
  });
  const [yourCompany, setYourCompany] = useState<Contact>({
    name: "",
    address: "",
    phone: "",
  });
  const [items, setItems] = useState<Item[]>([]);
  const [taxPercentage, setTaxPercentage] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    // Load form data from localStorage on component mount
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      const parsedData: FormData = JSON.parse(savedFormData);
      setBillTo(parsedData.billTo || { name: "", address: "", phone: "" });
      setShipTo(parsedData.shipTo || { name: "", address: "", phone: "" });
      setInvoice(
        parsedData.invoice || { date: "", paymentDate: "", number: "" }
      );
      setYourCompany(
        parsedData.yourCompany || { name: "", address: "", phone: "" }
      );
      setItems(parsedData.items || []);
      setTaxPercentage(parsedData.taxPercentage || 0);
      setNotes(parsedData.notes || "");
      setSelectedCurrency(parsedData.selectedCurrency || "IDR");
    } else {
      // If no saved data, set invoice number
      setInvoice((prev) => ({
        ...prev,
        number: generateRandomInvoiceNumber(),
      }));
    }
  }, []);

  useEffect(() => {
    // Save form data to localStorage whenever it changes
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
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [
    billTo,
    billToName,
    billToPhone,
    billToAddress,
    shipTo,
    invoice,
    yourCompany,
    items,
    taxPercentage,
    notes,
    taxAmount,
    subTotal,
    grandTotal,
    selectedCurrency,
  ]);

  return {
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
    taxAmount,
    setTaxAmount,
    subTotal,
    setSubTotal,
    grandTotal,
    setGrandTotal,
    notes,
    setNotes,
  };
};
