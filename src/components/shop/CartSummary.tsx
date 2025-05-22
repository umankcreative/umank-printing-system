import { Button } from '../ui/button';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card1';
import { useForm } from '../../context/FormContext';
import OrderForm from './OrderForm';
import { toast } from '../../hooks/use-toast';
import { FormTemplate } from '../../types/formTypes';
import { formatCurrency } from '../../lib/utils';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/shop/Card';



const CartSummary = () => {
  const { getTotalPrice, getTotalItems, clearCart, items } = useCart();
  const { getFormTemplateForCategory } = useForm();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const formattedTotal = formatCurrency(getTotalPrice());
  
  // Ambil template berdasarkan kategori produk dalam keranjang
  const getTemplatesForCart = () => {
    // Jika kosong, tidak ada template yang perlu ditampilkan
    if (items.length === 0) return [];
    
    // Kumpulkan semua kategori unik dalam keranjang
    const uniqueCategories = [...new Set(items.map(item => item.category))];
    
    // Ambil template untuk setiap kategori unik
    const templates: FormTemplate[] = [];
    
    uniqueCategories.forEach(category => {
      const template = getFormTemplateForCategory(category);
      if (template) {
        templates.push(template);
      }
    });
    
    return templates;
  };

  const handleCheckout = () => {
    const templates = getTemplatesForCart();
    if (templates.length > 0) {
      setIsFormOpen(true);
    } else {
      toast({
        title: "Informasi",
        description: "Tidak ada template form untuk produk dalam keranjang. Pesanan akan diproses langsung."
      });
    }
  };
  
  const handleFormSubmit = (data: Record<string, any>) => {
    console.log('Form data:', data);
    clearCart();
    toast({
      title: "Berhasil",
      description: "Pesanan telah berhasil diproses. Terima kasih telah berbelanja!"
    });
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Ringkasan Pesanan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Jumlah Item</span>
            <span>{getTotalItems()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formattedTotal}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button onClick={handleCheckout} className="w-full">
          Proses Pesanan
        </Button>
        <Button variant="outline" onClick={clearCart} className="w-full text-red-500">
          Kosongkan Keranjang
        </Button>
      </CardFooter>
      
      <OrderForm
        templates={getTemplatesForCart()}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </Card>
  );
};

export default CartSummary;
