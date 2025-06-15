import { useState, useEffect } from 'react';
import ProductCard from '../components/shop/ProductCard';
import CategoryFilter from '../components/shop/CategoryFilter';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ShoppingCartIcon, SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import * as categoryService from '../services/categoryService';
import { Product as ShopProduct } from '../types';
import Pagination from '../components/Pagination';
import { Category } from '../types/formTypes';
// import ProductFilters from '../components/ProductFilters';
// import { ProductGrid } from '../components/ProductGrid';

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesData] = await Promise.all([
          productService.getProducts({
            page: currentPage,
            per_page: itemsPerPage,
            search: searchQuery || undefined,
            category: selectedCategory || undefined,
            is_active: true, // Only show active products
          }),
          categoryService.getCategories()
        ]);

        // Create a map of category IDs to names for quick lookup
        const categoryMap = new Map(categoriesData.map(cat => [cat.id, cat.name]));

        // Map API response to expected Product type
        const mappedProducts = productsResponse.data.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          category: categoryMap.get(p.category_id) || 'Unknown Category',
          price: parseFloat(p.price),
          cost_price: parseFloat(p.cost_price),
          stock: p.stock || 0,
          minOrder: p.min_order || 1,
          isActive: p.is_active ?? true,
          branch_id: p.branch_id || '1',
          thumbnail_id: p.thumbnail_id || undefined,
          created_at: p.created_at || new Date().toISOString(),
          updated_at: p.updated_at || new Date().toISOString(),
          printType: p.print_type,
          finishingType: p.finishing_type,
          customFinishing: p.custom_finishing,
          paperType: p.paper_type,
          paperGrammar: p.paper_grammar,
          category_id: p.category_id
        }));

        setProducts(mappedProducts);
        setCategories(categoriesData);
        setTotalItems(productsResponse.meta.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchQuery, selectedCategory]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  return (
    <div className="container py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Katalog Produk</h1>
          <p className="text-gray-600">
            Jelajahi produk cetakan berkualitas tinggi
          </p>
        </div>
        <div className="relative">
          <Link to="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Cari produk..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada produk yang ditemukan.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {totalItems > itemsPerPage && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
