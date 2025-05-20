import React from 'react';
import { PRODUCT_CATEGORIES } from '../../data/mockData.ts';
import { Button } from '../../components/ui/button';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-3 text-lg">Kategori Produk</h2>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectCategory(null)}
          className="mb-2"
        >
          Semua
        </Button>

        {PRODUCT_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectCategory(category)}
            className="mb-2"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
