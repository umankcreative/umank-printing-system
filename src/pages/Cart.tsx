import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ShoppingBagIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import CartItem from '../components/shop/CartItem';
import CartSummary from '../components/shop/CartSummary';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items } = useCart();

  return (
    <div className="container py-8 pt-20">
      <div className="flex items-center mb-6">
        <Link to="/shop">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Toko
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Keranjang Anda Kosong</h2>
          <p className="text-gray-500 mb-6">
            Anda belum menambahkan produk apapun ke keranjang
          </p>
          <Link to="/shop">
            <Button>Lanjutkan Belanja</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg">
              <div className="hidden sm:flex justify-between border-b pb-2 mb-4 font-medium text-gray-500 text-sm">
                <div className="w-[60%]">Produk</div>
                <div className="w-[15%] text-center">Jumlah</div>
                <div className="w-[20%] text-right">Subtotal</div>
                <div className="w-[5%]"></div>
              </div>

              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
