import { TrashIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { Button } from '../ui/button';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/utils';
interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  const formattedPrice = formatCurrency(item.Harga);

  const subTotal = parseInt(item.Harga) * item.quantity;
  const formattedSubtotal = formatCurrency(subTotal.toString());

  const handleDecrease = () => {
    if (item.quantity > parseInt(item.minOrder)) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < parseInt(item.Stok)) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center border-b pb-4 mb-4">
      {/* Product Image */}
      <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0">
        {item.thumbnail_id ? (
          <img
            // src={`/images/products/${item.thumbnail_id}`}
            src={item.thumbnail_id}
            alt={item.NamaProduk}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-gray-400 text-sm text-center">
            Tidak ada gambar
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="sm:ml-4 flex-grow">
        <h3 className="font-medium">{item.NamaProduk}</h3>
        <p className="text-sm text-gray-600">{formattedPrice}</p>
        <p className="text-xs text-gray-500 mt-1">
          Min. Order: {item.minOrder}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center mt-2 sm:mt-0">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecrease}
          disabled={item.quantity <= parseInt(item.minOrder)}
        >
          <MinusIcon className="h-3 w-3" />
        </Button>
        <span className="w-12 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncrease}
          disabled={item.quantity >= parseInt(item.Stok)}
        >
          <PlusIcon className="h-3 w-3" />
        </Button>
      </div>

      {/* Subtotal */}
      <div className="min-w-[120px] text-right mt-2 sm:mt-0 sm:ml-6">
        <div className="font-medium">{formattedSubtotal}</div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-red-500 mt-2 sm:mt-0 sm:ml-2"
        onClick={() => removeItem(item.id)}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
