import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';
import ProductForm from '../components/ProductForm';
import { Product } from '../types';
import ProductPreview from '../components/ProductPreview';
import FormSection from '../components/productform/FormSection';

const ProductCreate: React.FC = () => {
  const { addProduct } = useProductContext();
  const navigate = useNavigate();
  const [previewProduct, setPreviewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: '',
    images: [],
    paperType: 'Artpaper',
    paperGrammar: '120gr',
    printType: 'Full Color',
    finishingType: 'Tanpa Finishing',
    customFinishing: '',
    price: 0,
    isActive: true,
    stock: 0,
  });
  const [materialEnabled, setMaterialEnabled] = useState({
    paper: false,
    printing: false,
    finishing: false,
  });

  const handleSubmit = (product: Product) => {
    // Add timestamp and ID
    const newProduct = {
      ...product,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addProduct(newProduct);
    navigate('/admin/products');
  };

  const handleFormChange = (updatedProduct: Partial<Product>) => {
    setPreviewProduct(prev => ({
      ...prev,
      ...updatedProduct,
    }));
    // Update material enabled states based on form changes
    setMaterialEnabled({
      paper: !!updatedProduct.paperType,
      printing: !!updatedProduct.printType,
      finishing: !!updatedProduct.finishingType && updatedProduct.finishingType !== 'Tanpa Finishing',
    });
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
      <div className="flex flex-row gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 w-2/3">
          <ProductForm onSubmit={handleSubmit} onChange={handleFormChange} />
        </div>
        <div className="w-1/3">
          <div className="sticky top-6">
            <FormSection title="Product Preview">
              <ProductPreview
                product={previewProduct}
                dimensions={{ width: 100, height: 100 }}
                materialEnabled={materialEnabled}
              />
            </FormSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
