// import { categories } from '../../../data/mockData';


interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'Semua', count: 0 },
  { id: 'nature', name: 'Alam', count: 0 },
  { id: 'technology', name: 'Teknologi', count: 0 },
  { id: 'animals', name: 'Hewan', count: 0 },
  { id: 'lifestyle', name: 'Gaya Hidup', count: 0 }
];

export const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`
            px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2
            ${activeCategory === category.id
              ? 'bg-gradient-primary text-primary-foreground shadow-filter scale-105'
              : 'bg-filter-inactive text-foreground hover:bg-primary/10 hover:scale-105'
            }
          `}
        >
          <span>{category.name}</span>
          <span className={`
            text-xs px-2 py-0.5 rounded-full
            ${activeCategory === category.id
              ? 'bg-primary-foreground/20 text-primary-foreground'
              : 'bg-primary/20 text-primary'
            }
          `}>
            {category.count}
          </span>
        </button>
      ))}
    </div>
  );
};