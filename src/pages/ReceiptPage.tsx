
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw, FileText, RotateCw } from "lucide-react";
import { Button } from "../components/ui/button";
import Receipt1 from "../components/invoice/templates/Receipt1";
import Receipt2 from "../components/invoice/templates/Receipt2";
import Receipt3 from "../components/invoice/templates/Receipt3";
import Receipt4 from "../components/invoice/templates/Receipt4";
import { formatCurrency } from "../utils/formatCurrency";
import { generateReceiptPDF } from "../utils/receiptPDFGenerator";
import { generateGSTNumber } from "../utils/invoiceCalculations";
import FloatingLabelInput from "../components/invoice/FloatingLabelInput";
import ItemDetails from "../components/invoice/ItemDetails";
import BillToSection from "../components/invoice/BillToSection";
import OrderSelection from "../components/invoice/OrderSelection";
import { useBranches } from "../hooks/useBranches";

interface Item {
  name: string;
  description: string;
  quantity: number;
  amount: number;
  total: number;
}

interface BillTo {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface Invoice {
  date: string;
  number: string;
}

interface Company {
  name: string;
  address: string;
  phone: string;
  gst: string;
}

interface Order {
  id: string;
  order_date: string;
  customers?: {
    id: string;
    name: string;
    address: string;
    contact: string;
  };
  order_items?: Array<{
    quantity: string;
    price: string;
    products?: {
      name: string;
      description: string;
    };
  }>;
}

const generateRandomInvoiceNumber = (): string => {
  const length = Math.floor(Math.random() * 6) + 3;
  const alphabetCount = Math.min(Math.floor(Math.random() * 4), length);
  let result = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  for (let i = 0; i < alphabetCount; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  for (let i = alphabetCount; i < length; i++) {
    result += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return result;
};

const footerOptions: string[] = [
  "Terima kasih telah memilih kami hari ini! Kami berharap pengalaman berbelanja Anda menyenangkan dan lancar. Kepuasan Anda penting bagi kami, dan kami berharap dapat melayani Anda lagi segera. Simpan struk ini untuk pengembalian atau penukaran.",
  "Pembelian Anda mendukung komunitas kami! Kami percaya pada memberikan kembali dan bekerja menuju masa depan yang lebih baik. Terima kasih telah menjadi bagian dari perjalanan kami. Kami menghargai kepercayaan Anda dan berharap dapat bertemu lagi segera.",
  "Kami menghargai masukan Anda! Bantu kami meningkatkan dengan berbagi pemikiran Anda melalui tautan survei pesan teks. Pendapat Anda membantu kami melayani Anda dengan lebih baik dan meningkatkan pengalaman berbelanja Anda. Terima kasih telah berbelanja dengan kami!",
  "Tahukah Anda bahwa Anda bisa menghemat lebih banyak dengan program loyalitas kami? Tanyakan tentangnya pada kunjungan berikutnya dan dapatkan poin untuk setiap pembelian. Ini adalah cara kami mengucapkan terima kasih karena menjadi pelanggan setia. Sampai jumpa lagi!",
  "Butuh bantuan dengan pembelian Anda? Kami di sini untuk membantu! Hubungi dukungan pelanggan kami, atau kunjungi situs web kami untuk informasi lebih lanjut. Kami berkomitmen memberikan layanan terbaik untuk Anda.",
  "Simpan struk ini untuk pengembalian atau penukaran.",
  "Setiap pembelian membuat perbedaan! Kami berdedikasi pada praktik ramah lingkungan dan keberlanjutan. Terima kasih telah mendukung planet yang lebih hijau bersama kami. Bersama-sama, kita bisa membangun masa depan yang lebih baik.",
  "Semoga hari Anda menyenangkan!",
  "Terima kasih telah berbelanja dengan kami hari ini. Tahukah Anda bahwa Anda dapat mengembalikan atau menukar barang Anda dalam 30 hari dengan struk ini? Kami ingin memastikan bahwa Anda puas dengan pembelian Anda, jadi jangan ragu untuk kembali jika Anda memerlukan bantuan.",
  "Bisnis ramah lingkungan. Struk ini dapat didaur ulang.",
  "Kami berharap Anda menikmati pengalaman berbelanja Anda! Ingat, untuk setiap teman yang Anda referensikan, Anda bisa mendapatkan hadiah eksklusif. Kunjungi www.example.com/refer untuk detail lebih lanjut. Kami berharap dapat menyambut Anda kembali segera!",
  "Terima kasih telah memilih kami! Kami menghargai bisnis Anda dan berharap dapat melayani Anda lagi. Simpan struk ini untuk pertanyaan atau pengembalian di masa depan.",
  "Pembelian Anda mendukung bisnis lokal dan membantu kami melanjutkan misi kami. Terima kasih telah menjadi pelanggan yang berharga. Kami berharap dapat bertemu Anda lagi segera!",
  "Kami berharap Anda memiliki pengalaman berbelanja yang luar biasa hari ini. Jika Anda memiliki masukan, silakan bagikan dengan kami di situs web kami. Kami selalu di sini untuk membantu Anda.",
  "Terima kasih atas kunjungan Anda! Ingat, kami menawarkan diskon eksklusif untuk pelanggan yang kembali. Periksa email Anda untuk penawaran khusus pada pembelian berikutnya.",
  "Kepuasan Anda adalah prioritas utama kami. Jika Anda memerlukan bantuan atau memiliki pertanyaan tentang pembelian Anda, jangan ragu untuk menghubungi kami. Semoga hari Anda menyenangkan!",
  "Kami menyayangi pelanggan kami! Terima kasih telah mendukung bisnis kami. Ikuti kami di media sosial untuk update tentang promosi dan produk baru. Sampai jumpa lagi!",
  "Setiap pembelian berarti! Kami berkomitmen untuk membuat dampak positif, dan dukungan Anda membantu kami mencapai tujuan kami. Terima kasih telah berbelanja dengan kami hari ini!",
  "Kami berharap Anda menemukan semua yang Anda butuhkan. Jika tidak, tolong beri tahu kami agar kami dapat meningkatkan pengalaman Anda. Masukan Anda membantu kami melayani Anda dengan lebih baik. Terima kasih!",
  "Terima kasih telah berkunjung! Tahukah Anda bahwa Anda bisa menghemat lebih banyak dengan program hadiah kami? Tanyakan tentangnya selama kunjungan berikutnya dan mulai dapatkan poin hari ini!",
  "Kami menghargai kepercayaan Anda kepada kami. Jika Anda pernah memerlukan bantuan dengan pesanan Anda, silakan kunjungi situs web kami atau hubungi layanan pelanggan. Kami di sini untuk membantu!",
];

const ReceiptPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const { branches } = useBranches();

  const [billTo, setBillTo] = useState<BillTo>({
    id: "",
    name: "",
    address: "",
    phone: ""
  });
  const [invoice, setInvoice] = useState<Invoice>({
    date: "",
    number: generateRandomInvoiceNumber(),
  });
  const [yourCompany, setYourCompany] = useState<Company>({
    name: "",
    address: "",
    phone: "",
    gst: "",
  });
  const [cashier, setCashier] = useState<string>("");
  const [items, setItems] = useState<Item[]>([
    { name: "", description: "", quantity: 0, amount: 0, total: 0 },
  ]);
  const [taxPercentage, setTaxPercentage] = useState<number>(0);
  const [theme, setTheme] = useState<string>("Receipt1");
  const [notes, setNotes] = useState<string>("");
  const [footer, setFooter] = useState<string>("Terima kasih");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("IDR");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");

  const refreshFooter = (): void => {
    const randomIndex = Math.floor(Math.random() * footerOptions.length);
    setFooter(footerOptions[randomIndex]);
  };

  useEffect(() => {
    const savedFormData = localStorage.getItem("receiptFormData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setBillTo(parsedData.billTo || { id: "", name: "", address: "", phone: "" });
      setInvoice(parsedData.invoice || { date: "", number: generateRandomInvoiceNumber() });
      setYourCompany(parsedData.yourCompany || { name: "", address: "", phone: "", gst: "" });
      setCashier(parsedData.cashier || "");
      setItems(parsedData.items || [{ name: "", description: "", quantity: 0, amount: 0, total: 0 }]);
      setTaxPercentage(parsedData.taxPercentage || 0);
      setNotes(parsedData.notes || "");
      setFooter(parsedData.footer || "Terima kasih");
      setSelectedCurrency(parsedData.selectedCurrency || "IDR");
    } else {
      setInvoice((prev) => ({ ...prev, number: generateRandomInvoiceNumber() }));
      setItems([{ name: "", description: "", quantity: 0, amount: 0, total: 0 }]);
    }
  }, []);

  useEffect(() => {
    const formData = {
      billTo,
      invoice,
      yourCompany,
      cashier,
      items,
      taxPercentage,
      notes,
      footer,
      selectedCurrency,
    };
    localStorage.setItem("receiptFormData", JSON.stringify(formData));
  }, [billTo, invoice, yourCompany, cashier, items, taxPercentage, notes, footer, selectedCurrency]);

  const handleDownloadPDF = async (): Promise<void> => {
    if (!isDownloading && receiptRef.current) {
      setIsDownloading(true);
      const receiptData = {
        billTo: billTo.name,
        invoice,
        yourCompany,
        cashier,
        items,
        taxPercentage,
        notes,
        footer,
        selectedCurrency,
      };
      try {
        await generateReceiptPDF(receiptRef.current, theme, receiptData);
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleBack = (): void => {
    navigate("/");
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setter((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleBillToInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    if (name === 'billTo') {
      setBillTo(value as any);
    } else {
      setBillTo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBranchSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const branchId = e.target.value;
    const selectedBranch = branches.find(b => b.id === branchId);
    
    if (selectedBranch) {
      setYourCompany({
        name: selectedBranch.name,
        address: selectedBranch.address || '',
        phone: selectedBranch.contact || '',
        gst: yourCompany.gst
      });
    }
  };

  const handleOrderSelect = (order: Order): void => {
    setSelectedOrder(order);
    setSelectedOrderId(order.id);
    
    setInvoice(prev => ({
      ...prev,
      number: order.id.slice(0, 8).toUpperCase(),
      date: new Date(order.order_date).toISOString().split('T')[0]
    }));

    if (order.customers) {
      setBillTo({
        id: order.customers.id || '',
        name: order.customers.name || '',
        address: order.customers.address || '',
        phone: order.customers.contact || ''
      });
    }

    if (order.order_items && order.order_items.length > 0) {
      const orderItems = order.order_items.map(item => ({
        name: item.products?.name || 'Produk Tidak Diketahui',
        description: item.products?.description || '',
        quantity: parseFloat(item.quantity) || 0,
        amount: parseFloat(item.price) || 0,
        total: (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0)
      }));
      setItems(orderItems);
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

  const calculateSubTotal = (): string => {
    return items.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const calculateTaxAmount = (): string => {
    const subTotal = parseFloat(calculateSubTotal());
    return (subTotal * (taxPercentage / 100)).toFixed(2);
  };

  const calculateGrandTotal = (): string => {
    const subTotal = parseFloat(calculateSubTotal());
    const taxAmount = parseFloat(calculateTaxAmount());
    return (subTotal + taxAmount).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Generator Struk</h1>
        <div className="flex items-center">
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="mr-4"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengunduh...
              </>
            ) : (
              "Unduh PDF Struk"
            )}
          </Button>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600"
            aria-label="Beralih ke Generator Tagihan"
          >
            <FileText size={24} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <form>
            <OrderSelection 
              onOrderSelect={handleOrderSelect}
              selectedOrderId={selectedOrderId}
            />

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Perusahaan Anda</h2>
              <div className="mb-4">
                <label htmlFor="branchSelect" className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Cabang
                </label>
                <select
                  id="branchSelect"
                  onChange={handleBranchSelect}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih cabang...</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingLabelInput
                  id="yourCompanyName"
                  label="Nama"
                  value={yourCompany.name}
                  onChange={handleInputChange(setYourCompany)}
                  name="name"
                />
                <FloatingLabelInput
                  id="yourCompanyPhone"
                  label="Telepon"
                  value={yourCompany.phone}
                  onChange={handleInputChange(setYourCompany)}
                  name="phone"
                />
              </div>
              <FloatingLabelInput
                id="yourCompanyAddress"
                label="Alamat"
                value={yourCompany.address}
                onChange={handleInputChange(setYourCompany)}
                name="address"
                className="mt-4"
              />
              <div className="relative mt-4">
                <FloatingLabelInput
                  id="yourCompanyGST"
                  label="No. GST"
                  value={yourCompany.gst}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 15);
                    handleInputChange(setYourCompany)({
                      target: { name: "gst", value },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  name="gst"
                  maxLength={15}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newGST = generateGSTNumber();
                    setYourCompany(prev => ({ ...prev, gst: newGST }));
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200"
                  title="Generate nomor GST baru"
                >
                  <RotateCw size={16} />
                </button>
              </div>
              <FloatingLabelInput
                id="cashier"
                label="Kasir"
                value={cashier}
                onChange={(e) => setCashier(e.target.value)}
                name="cashier"
                className="mt-4"
              />
            </div>

            <BillToSection 
              billTo={billTo}
              handleInputChange={handleBillToInputChange}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
            />

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Informasi Faktur
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FloatingLabelInput
                  id="invoiceNumber"
                  label="Nomor Faktur"
                  value={invoice.number}
                  onChange={handleInputChange(setInvoice)}
                  name="number"
                />
                <FloatingLabelInput
                  id="invoiceDate"
                  label="Tanggal Faktur"
                  type="date"
                  value={invoice.date}
                  onChange={handleInputChange(setInvoice)}
                  name="date"
                />
              </div>
            </div>

            <ItemDetails
              items={items}
              handleItemChange={handleItemChange}
              addItem={addItem}
              removeItem={removeItem}
            />

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Total</h3>
              <div className="flex justify-between mb-2">
                <span>Sub Total:</span>
                <span>{formatCurrency(parseFloat(calculateSubTotal()), selectedCurrency)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Pajak (%):</span>
                <input
                  type="number"
                  value={taxPercentage}
                  onChange={(e) =>
                    setTaxPercentage(parseFloat(e.target.value) || 0)
                  }
                  className="w-24 p-2 border rounded"
                  min="0"
                  max="28"
                  step="1"
                />
              </div>
              <div className="flex justify-between mb-2">
                <span>Jumlah Pajak:</span>
                <span>{formatCurrency(parseFloat(calculateTaxAmount()), selectedCurrency)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Keseluruhan:</span>
                <span>{formatCurrency(parseFloat(calculateGrandTotal()), selectedCurrency)}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Catatan</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
              ></textarea>
            </div>
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-medium">Footer</h3>
                <button
                  type="button"
                  onClick={refreshFooter}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200"
                  title="Refresh footer"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
              <textarea
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                className="w-full p-2 border rounded"
                rows={2}
              ></textarea>
            </div>
          </form>
        </div>

        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Pratinjau Struk</h2>
          <div className="mb-4 flex items-center">
            <h3 className="text-lg font-medium mr-4">Jenis Struk</h3>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="Receipt1"
                  checked={theme === "Receipt1"}
                  onChange={() => setTheme("Receipt1")}
                  className="mr-2"
                />
                Struk1
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="Receipt2"
                  checked={theme === "Receipt2"}
                  onChange={() => setTheme("Receipt2")}
                  className="mr-2"
                />
                Struk2
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="Receipt3"
                  checked={theme === "Receipt3"}
                  onChange={() => setTheme("Receipt3")}
                  className="mr-2"
                />
                Struk3
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="Receipt4"
                  checked={theme === "Receipt4"}
                  onChange={() => setTheme("Receipt4")}
                  className="mr-2"
                />
                Struk4
              </label>
            </div>
          </div>
          <div ref={receiptRef} className="w-[380px] mx-auto border shadow-lg">
            {theme === "Receipt1" && (
              <Receipt1
                data={{
                  billTo: billTo.name,
                  invoice,
                  yourCompany,
                  cashier,
                  items,
                  taxPercentage,
                  notes,
                  footer,
                  selectedCurrency,
                }}
              />
            )}
            {theme === "Receipt2" && (
              <Receipt2
                data={{
                  billTo: billTo.name,
                  invoice,
                  yourCompany,
                  cashier,
                  items,
                  taxPercentage,
                  notes,
                  footer,
                  selectedCurrency,
                }}
              />
            )}
            {theme === "Receipt3" && (
              <Receipt3
                data={{
                  billTo: billTo.name,
                  invoice,
                  yourCompany,
                  cashier,
                  items,
                  taxPercentage,
                  notes,
                  footer,
                  selectedCurrency,
                }}
              />
            )}
            {theme === "Receipt4" && (
              <Receipt4
                data={{
                  billTo: billTo.name,
                  invoice,
                  yourCompany,
                  items,
                  taxPercentage,
                  footer,
                  cashier,
                  selectedCurrency,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
