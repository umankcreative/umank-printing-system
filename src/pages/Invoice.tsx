import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useOrderContext } from '../context/OrderContext';
import { formatCurrency } from '../utils/formatCurrency';
import { generatePDF } from '../utils/pdfGenerator';
import { format } from 'date-fns';

const Invoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrder } = useOrderContext();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const orderData = await getOrder(id);
        setOrder(orderData || null);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, getOrder]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!order) return;
    try {
      await generatePDF(order);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center no-print">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Add an id to the content we want to convert to PDF */}
      <div id="invoice-content">
        <div className="bg-blue-500 text-white p-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-white inline-block">
                <h1 className="text-2xl font-bold" id="company-name">
                  {order.branch?.name}
                </h1>
              </div>
              <p className="mt-2">{order.branch?.location}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">DITAGIHKAN KE</h2>
              <p>{order.customer?.name}</p>
              <p>{order.customer?.address}</p>
              <p>{order.customer?.phone}</p>
            </div>
          </div>
          <div className="flex justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">INFO PENGIRIMAN</h2>
              <p>Status: {order.status}</p>
              <p>Payment: {order.payment_status}</p>
              <p>Method: {order.payment_method}</p>
            </div>
            <div className="text-right">
              <p>Invoice #: {order.id.slice(0, 8).toUpperCase()}</p>
              <p>Date: {format(new Date(order.created_at), 'dd/MM/yyyy')}</p>
              <p>Delivery Date: {order.delivery_date ? format(new Date(order.delivery_date), 'dd/MM/yyyy') : 'N/A'}</p>
              <p>Due Amount: {formatCurrency(order.total_amount)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-blue-500 -mt-[42px] w-[92%] mx-auto">
          <div id="item-data" className="w-full mb-8">
            <div className="bg-blue-200 flex rounded-t">
              <div className="p-2 w-12"></div>
              <div className="p-2 flex-grow text-left">NAMA ITEM/DESKRIPSI</div>
              <div className="p-2 flex-1 text-right">QTY.</div>
              <div className="p-2 flex-1 text-right">HARGA</div>
              <div className="p-2 flex-1 text-right">JUMLAH</div>
            </div>
            {order.items?.map((item, index) => (
              <div key={index} className="flex border-t border-b">
                <div className="p-2 w-12 text-left">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="p-2 flex-1">
                  <p className="font-semibold">{item.product?.name}</p>
                  <p className="text-sm text-gray-600">{item.notes}</p>
                </div>
                <div className="p-2 w-24 text-right">{item.quantity}</div>
                <div className="p-2 flex-1 text-right">{formatCurrency(item.price)}</div>
                <div className="p-2 flex-1 text-right">
                  {formatCurrency(item.quantity * item.price)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <div className="w-2/3 p-4">
              <h3 className="text-lg font-semibold">Notes</h3>
              <p className="text-sm text-gray-600">{order.notes || 'No notes'}</p>
            </div>
            <div className="w-1/3">
              <div className="flex justify-between mb-2 p-2">
                <span>Sub Total:</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex justify-between font-bold bg-blue-500 text-white p-2 mt-4">
                <span className="text-left">Total</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-8">
          <p>Thank you for your business!</p>
        </div>
      </div>
      </div>
    </>
  );
};

export default Invoice;