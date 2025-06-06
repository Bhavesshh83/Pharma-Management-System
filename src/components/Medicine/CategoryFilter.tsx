
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  medicineCount: Record<string, number>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  medicineCount
}) => {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'basic': return 'Basic Medicines';
      case 'prescription': return 'Prescription';
      case 'headache': return 'Headache Relief';
      case 'cough': return 'Cough & Cold';
      case 'energy': return 'Energy & Hydration';
      default: return category;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategorySelect(null)}
        className="mb-2"
      >
        All Medicines
        <Badge className="ml-2" variant="secondary">
          {Object.values(medicineCount).reduce((sum, count) => sum + count, 0)}
        </Badge>
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategorySelect(category)}
          className="mb-2"
        >
          {getCategoryLabel(category)}
          <Badge className="ml-2" variant="secondary">
            {medicineCount[category] || 0}
          </Badge>
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
