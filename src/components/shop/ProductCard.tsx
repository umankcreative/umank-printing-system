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
  const [quantity, setQuantity] = useState(parseInt(product.minOrder));
  const { addItem } = useCart();

  const formattedPrice = formatCurrency(product.Harga);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const decreaseQuantity = () => {
    if (quantity > parseInt(product.minOrder)) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < parseInt(product.Stok)) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="bg-gray-100 h-48 flex items-center justify-center p-4">
        {product.thumbnail_id ? (
          <img
            // src={`/images/products/${product.thumbnail_id}`}
            src={product.thumbnail_id}
            alt={product.NamaProduk}
            className="max-h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-md">
            <span className="text-gray-500">Tidak ada gambar</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.NamaProduk}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">
          {product.Deskripsi}
        </p>
        <div className="text-primary font-bold text-lg">{formattedPrice}</div>
        <div className="mt-2 text-xs text-gray-500">
          Min. Order: {product.minOrder} | Stok: {product.Stok}
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
                disabled={quantity <= parseInt(product.minOrder)}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                onClick={increaseQuantity}
                disabled={quantity >= parseInt(product.Stok)}
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
