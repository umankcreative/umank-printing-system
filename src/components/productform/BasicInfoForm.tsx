import React from 'react';
import { PRODUCT_CATEGORIES } from '../../types/product';
import ImageUpload from './ImageUpload';

interface BasicInfoFormProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  images: string[];
  setImages: (images: string[]) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  name,
  setName,
  description,
  setDescription,
  category,
  setCategory,
  images,
  setImages,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="productName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nama Produk <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="productName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Masukkan nama produk"
          required
        />
      </div>

      <div>
        <label
          htmlFor="productCategory"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Kategori Produk <span className="text-red-500">*</span>
        </label>
        <select
          id="productCategory"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          required
        >
          <option value="">Pilih kategori</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="productDescription"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Deskripsi Produk <span className="text-red-500">*</span>
        </label>
        <textarea
          id="productDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Masukkan deskripsi produk"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gambar Produk{' '}
          <span className="text-gray-500 text-xs">(Maks. 5 gambar)</span>
        </label>
        <ImageUpload images={images} onChange={setImages} maxImages={5} />
      </div>
    </div>
  );
};

export default BasicInfoForm;
