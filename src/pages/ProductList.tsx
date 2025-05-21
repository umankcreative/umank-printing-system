import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, Table as TableIcon } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';
import ProductTable from '../components/ProductTable';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';

const ProductList: React.FC = () => {
  const { products, deleteProduct } = useProductContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const itemsPerPage = 10;

  // Filter products based on search term
  const filteredProducts = useMemo(() => 
    products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesStatus = statusFilter === '' || product.isActive === (statusFilter === 'true');
      
      return matchesSearch && matchesCategory && matchesStatus;
    }),
    [products, searchTerm, categoryFilter, statusFilter]
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Products</h1>
        
      </div>

      <div className="mb-6 flex justify-between items-center">
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={handleCategoryChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          className="flex-1 mr-4"
        />
        

        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => value && setViewMode(value as 'grid' | 'table')}
          className="border rounded-md"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid size={16} />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table view">
            <TableIcon size={16} />
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="p-4">
            <Link
              to="/admin/products/create"
              className="btn btn-primary flex items-center justify-center h-full m-auto"
            >
              <Plus size={20} className="mr-2" /> Tambah Produk
            </Link>
          </div>
      </div>

      {viewMode === 'table' ? (
        <ProductTable
          products={filteredProducts}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onDelete={handleDelete}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.slice(startIndex, endIndex).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductList;
