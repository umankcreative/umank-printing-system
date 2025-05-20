import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';
import ProductForm from '../components/ProductForm';
import { Product } from '../types';

const ProductCreate: React.FC = () => {
  const { addProduct } = useProductContext();
  const navigate = useNavigate();

  const handleSubmit = (product: Product) => {
    // Add timestamp and ID
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addProduct(newProduct);
    navigate('/admin/products');
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Produk Baru</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ProductCreate;
