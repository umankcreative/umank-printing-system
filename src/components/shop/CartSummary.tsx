import { Button } from '../ui/button';
import { useCart } from '../../context/CartContext';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/shop/Card';

const CartSummary = () => {
  const { getTotalPrice, getTotalItems, clearCart } = useCart();

  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(getTotalPrice());

  const handleCheckout = () => {
    alert('Fitur checkout belum tersedia');
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
        <Button
          variant="outline"
          onClick={clearCart}
          className="w-full text-red-500"
        >
          Kosongkan Keranjang
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
