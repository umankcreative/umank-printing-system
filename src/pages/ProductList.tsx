import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';

const ProductList: React.FC = () => {
  const { products, deleteProduct } = useProductContext();
  const [searchTerm, setSearchTerm] = useState('');
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('');
  //  const [statusFilter, setStatusFilter] = useState('');

  // const filteredProducts = products.filter(
  //   (product) =>
  //     product.NamaProduk.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     product.Deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // Filter products based on search term, category, and status
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.NamaProduk.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Deskripsi.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === '' || product.category === categoryFilter;

      // const matchesStatus =
      //   statusFilter === '' ||
      //   (statusFilter === 'active' && product.isActive) ||
      //   (statusFilter === 'inactive' && !product.isActive);

      return matchesSearch && matchesCategory; //matchesStatus
    });
  }, [products, searchTerm, categoryFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Produk
        </h1>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 my-auto">
          <ProductFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            // statusFilter={statusFilter}
            // onStatusChange={setStatusFilter}
          />
          <div className="p-4">
            <Link
              to="/admin/products/create"
              className="btn btn-primary flex items-center justify-center h-full m-auto"
            >
              <Plus size={20} className="mr-2" /> Tambah Produk
            </Link>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-lg text-gray-600 mb-4">
            {searchTerm
              ? 'No products found matching your search.'
              : 'No products have been added yet.'}
          </p>
          <Link
            to="/admin/products/create"
            className="btn btn-primary inline-flex items-center"
          >
            <Plus size={20} className="mr-2" /> Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;
