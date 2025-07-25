import { Button } from '../ui/button';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import { useForm as useAppForm } from '../../context/FormContext';
import OrderForm from './OrderForm';
import { toast } from '../../hooks/use-toast';
import { FormTemplate } from '../../types/formTypes';
import { formatCurrency } from '../../lib/utils';
import { useOrderContext } from '../../context/OrderContext';
import { Order, Customer, OrderItem } from '../../types/api';
import * as formService from '../../services/formService';
import { v4 as uuidv4 } from 'uuid';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/shop/Card';
import { set } from 'lodash';
import { te } from 'date-fns/locale';

const CartSummary = () => {
  const { getTotalPrice, getTotalItems, clearCart, items } = useCart();
  const { addOrder } = useOrderContext();
  const { formCategoryMappings,getFormTemplateForCategory } = useAppForm();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const formattedTotal = formatCurrency(getTotalPrice());
  
  // Get templates based on product categories in cart
  const getTemplatesForCart = async () => {
    if (items.length === 0) return [];
    // Get unique category IDs from cart items
    const uniqueCategoryIds = Array.from(new Set(items.map(item => item.category_id).filter(Boolean)));
    
    const templates: FormTemplate[] = [];

          for (const categoryId of uniqueCategoryIds) {
            const mapping = formCategoryMappings.find(m => m.categoryId === categoryId);
            if (mapping && mapping.categoryId) {
              try {
                const template = await formService.getFormTemplate(mapping.formTemplateId);
                // console.log('Found template for category:', {
                //   categoryId: mapping.categoryId,
                //   categoryName: mapping.categoryName,
                //   formTemplateId: mapping.formTemplateId,
                // }); 
                if (template) {
                  templates.push(template);
                }
              } catch (error) {
                console.error('Error fetching template:', error);
              }
            }
          }
          return templates;
          
    // fetchTemplates();
  };

  const handleCheckout = async () => {
    const templates = await getTemplatesForCart();
    if (templates.length > 0) {
      console.log('Found template for category:', templates); 
      setTemplates(templates);
      setIsFormOpen(true);
    } else {
      toast({
        title: "Informasi",
        description: "Tidak ada template form untuk produk dalam keranjang. Pesanan akan diproses langsung."
      });
    }
  };
  
  const handleFormSubmit = (formData: Record<string, unknown>) => {
    // Create customer data
    const customer: Customer = {
      id: uuidv4(),
      name: formData.name as string || '',
      email: formData.email as string || '',
      phone: formData.phone as string || '',
      company: formData.company as string || '',
      is_active: true,
      contact: formData.contact as string || '',
      address: formData.address as string || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Create order items from cart items
    const orderItems: OrderItem[] = items.map(item => ({
      id: uuidv4(),
      order_id: '', // Will be set after order creation
      product_id: item.id,
      product: item,
      quantity: item.quantity,
      price: item.price,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Create the order
    const order: Order = {
      id: uuidv4(),
      customer,
      items: orderItems,
      total_amount: getTotalPrice(),
      status: 'pending',
      delivery_date: formData.delivery_date as string || new Date().toISOString(),
      notes: formData.notes as string || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      form_data: formData, // Store the form data
    };

    // Update order_id in order items
    order.items = order.items.map(item => ({
      ...item,
      order_id: order.id
    }));

    // Add order to context
    addOrder(order);
    
    // Clear the cart and close the form
    clearCart();
    setIsFormOpen(false);
    
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
        <Button onClick={handleCheckout} className="btn btn-primary btn-sm w-full">
          Proses Pesanan
        </Button>
        <Button variant="outline" onClick={clearCart} className="w-full btn-sm btn btn-outline-danger btn-sm">
          Kosongkan Keranjang
        </Button>
      </CardFooter>
      
      <OrderForm
        templates={templates}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </Card>
  );
};

export default CartSummary;
