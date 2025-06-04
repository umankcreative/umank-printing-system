
import React from 'react';

interface YourCompany {
  name: string;
  address: string;
  phone: string;
  gst?: string;
}

interface Invoice {
  number: string;
  date: string;
}

interface Item {
  name: string;
  quantity: number;
  amount: number;
  total: number;
  description: string;
}

interface Receipt4Data {
  billTo: string;
  invoice: Invoice;
  yourCompany: YourCompany;
  items: Item[];
  taxPercentage: number;
  footer: string;
  cashier: string;
  selectedCurrency: string;
}

interface Receipt4Props {
  data: Receipt4Data;
}

const Receipt4: React.FC<Receipt4Props> = ({ data }) => {
  const { billTo, invoice, yourCompany, items, taxPercentage, footer, cashier, selectedCurrency } = data;
  const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
  const currencySymbol = selectedCurrency === 'USD' ? '$' : selectedCurrency === 'IDR' ? 'Rp ' : '₹';

  return (
    <div className="p-4 font-['Courier_New',_monospace]">
      <h2 className="text-center font-bold">{yourCompany.name}</h2>
      <p className="text-center">{yourCompany.address}</p>
      <p className="text-center">Nomor Telepon: {yourCompany.phone}</p>
      {yourCompany.gst && (
        <p className="text-center">No. GST: {yourCompany.gst.toUpperCase()}</p>
      )}
      <hr className="my-4" />
      <div>
        <p>Nomor Faktur: {invoice.number}</p>
        <p>Dibuat Oleh: {cashier}</p>
        <p>
          Tanggal & Waktu: {invoice.date} {currentTime}
        </p>
      </div>
      <hr className="my-4" />
      <div>
        <h3>Tagihan kepada:</h3>
        <p>{billTo}</p>
        <span>Tempat pasokan: Jakarta-01</span>
      </div>
      <hr className="my-4" />
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Barang</th>
            <th className="text-right">Qty</th>
            <th className="text-right">Harga</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="align-bottom">
                <td>{item.name}</td>
                <td className="text-right text-sm">{item.quantity}</td>
                <td className="text-right text-sm">{item.amount}</td>
              </tr>
              <tr className="align-top">
                <td colSpan={2} className="text-left text-sm pb-2">
                  Kode HSN: {item.description}
                </td>
                <td className="text-right pb-2">Total: {item.total}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <hr className="my-4" />
      <div className="flex justify-between">
        <span>Sub Total:</span>
        <span>
          {currencySymbol} {items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Pajak ({taxPercentage}%):</span>
        <span>
          {currencySymbol}{" "}
          {(
            items.reduce((sum, item) => sum + item.total, 0) *
            (taxPercentage / 100)
          ).toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between font-bold">
        <span>TOTAL:</span>
        <span>
          {currencySymbol}{" "}
          {(
            items.reduce((sum, item) => sum + item.total, 0) *
            (1 + taxPercentage / 100)
          ).toFixed(2)}
        </span>
      </div>
      <hr className="my-4" />
      <div>
        <h3 className="mb-2">Ringkasan Pajak</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left font-normal">Jenis</th>
              <th className="text-right font-normal">Tarif</th>
              <th className="text-right font-normal">Total Amt</th>
              <th className="text-right font-normal">Jumlah Pajak</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CGST</td>
              <td className="text-right">{(taxPercentage / 2).toFixed(2)}%</td>
              <td className="text-right">
                {items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
              </td>
              <td className="text-right">
                {(
                  items.reduce((sum, item) => sum + item.total, 0) *
                  (taxPercentage / 200)
                ).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>SGST</td>
              <td className="text-right">{(taxPercentage / 2).toFixed(2)}%</td>
              <td className="text-right">
                {items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
              </td>
              <td className="text-right">
                {(
                  items.reduce((sum, item) => sum + item.total, 0) *
                  (taxPercentage / 200)
                ).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr className="my-4" />
      <p className="text-center">{footer}</p>
    </div>
  );
};

export default Receipt4;
