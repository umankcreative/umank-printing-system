import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';
import ProductForm from '../components/ProductForm';
import { Product } from '../types';

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductWithIngredients, updateProduct } = useProductContext();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundProduct = getProductWithIngredients(id);
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [id, getProductWithIngredients]);

  const handleSubmit = (updatedProduct: Product) => {
    updateProduct({
      ...updatedProduct,
      updated_at: new Date().toISOString(),
    });
    navigate('/admin/products');
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600 mb-4">Product not found.</p>
        <button
          onClick={() => navigate('/admin/products')}
          className="btn btn-primary"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Produk: {product.name}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <ProductForm initialProduct={product} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ProductEdit;
