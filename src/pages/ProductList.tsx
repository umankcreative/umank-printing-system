import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, Table as TableIcon, Package } from 'lucide-react';
import ProductTable from '../components/ProductTable';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import ProductCard from '../components/ProductCard';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../components/ui/dropdown-menu';
import ProductFilters from '../components/ProductFilters';
import { productService } from '../services/productService';
import * as categoryService from '../services/categoryService';
import Pagination from '../components/Pagination';
import { Product } from '../types/api';
import { toast } from 'sonner';

const backendBaseURL = 'https://373b-114-10-139-244.ngrok-free.app'; // Update with your backend URL
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';

// Move mapping utility to a separate file to avoid Fast Refresh warning
import { mapApiProductToLocalProduct } from '../lib/utils';
import { Button } from '../components/ui/button';



const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const itemsPerPage = 12;

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [response, categories] = await Promise.all([
          productService.getProducts({
            page: currentPage,
            per_page: itemsPerPage,
            search: searchTerm || undefined,
            category: categoryFilter || undefined,
            is_active: statusFilter ? statusFilter === 'true' : undefined,
          }),
          categoryService.getCategoriesByType('product')
        ]);

        // Map API response to Product type while keeping the structure simple
        const mappedProducts = response.data.map(p => mapApiProductToLocalProduct(p, categories, backendBaseURL));
        setProducts(mappedProducts);
        setTotalItems(response.meta.total);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await productService.deleteProduct(productToDelete.id);
      
      // Refresh the product list
      const [response, categories] = await Promise.all([
        productService.getProducts({
          page: currentPage,
          per_page: itemsPerPage,
          search: searchTerm || undefined,
          category: categoryFilter || undefined,
          is_active: statusFilter ? statusFilter === 'true' : undefined,
        }),
        categoryService.getCategoriesByType('product')
      ]);

      // Map API response to Product type while keeping the structure simple
      const mappedProducts = response.data.map(p => mapApiProductToLocalProduct(p, categories, backendBaseURL));
      
      setProducts(mappedProducts);
      setTotalItems(response.meta.total);
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      let errorMessage = 'Failed to delete product';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        duration: 5000
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Clone product handler
  const handleCloneProduct = async (product: Product) => {
    try {
      // Remove id and adjust fields for new product
      const { id, created_at, updated_at, ...rest } = product;
      const clonePayload = {
        ...rest,
        name: product.name + ' (Copy)',
        // Optionally reset stock, images, etc.
        stock: 0,
        additional_images: [],
        thumbnail_id: '', // must be string, not null
        is_active: false,
      };
      await productService.createProduct(clonePayload);
      toast.success('Product cloned successfully');
      // Optionally refresh product list
      const [response, categories] = await Promise.all([
        productService.getProducts({
          page: currentPage,
          per_page: itemsPerPage,
          search: searchTerm || undefined,
          category: categoryFilter || undefined,
          is_active: statusFilter ? statusFilter === 'true' : undefined,
        }),
        categoryService.getCategoriesByType('product')
      ]);
      const mappedProducts = response.data.map(p => mapApiProductToLocalProduct(p, categories, backendBaseURL));
      setProducts(mappedProducts as Product[]);
      setTotalItems(response.meta.total);
    } catch {
      toast.error('Failed to clone product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />Products</h1>
        <Link to="/admin/products/create" className="btn btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-1" />
          Add Product
        </Link>
      </div>

      <div className="flex items-center justify-start space-x-4 mb-4">
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <ToggleGroup className='bg-gray-200 rounded-md' type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'table')}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table view">
            <TableIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada produk.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteClick}
              onClone={handleCloneProduct}
            />
          ))}
        </div>
      ) : (
        <ProductTable
          products={products}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
                onDelete={handleDeleteClick}
          onClone={handleCloneProduct}
        />
      )}

      {totalItems > itemsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Produk</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus produk ini? Setelah terhapus produk tidak bisa dikembalikan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
