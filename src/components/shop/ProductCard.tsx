import { Product } from '../../types';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { MinusIcon, PlusIcon, ShoppingCartIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/shop/Card';
import { formatCurrency } from '../../lib/utils';
interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(product.minOrder);
  const { addItem } = useCart();

  const formattedPrice = formatCurrency(product.price);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const decreaseQuantity = () => {
    if (quantity > product.minOrder) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="bg-gray-100 h-48 mb-4 flex items-center justify-center p-0 ">
        {product.thumbnail_id ? (
          <img
            // src={`/images/products/${product.thumbnail_id}`}
            src={product.thumbnail_id}
            alt={product.name}
            className="w-full object-cover overflow-hidden h-full rounded-t-md transition-transform transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
            <span className="text-gray-500">Tidak ada gambar</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow mt-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="text-primary font-bold text-lg">{formattedPrice}</div>
        <div className="mt-2 text-xs text-gray-500">
          Min. Order: {product.minOrder} | Stok: {product.stock}
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <div className="w-full">
          <div className="flex items-center mb-3 justify-between">
            <span className="text-sm">Jumlah:</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                onClick={decreaseQuantity}
                disabled={quantity <= product.minOrder}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button className="w-full" onClick={handleAddToCart}>
            <ShoppingCartIcon className="mr-2 h-4 w-4" />
            Tambah ke Keranjang
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
