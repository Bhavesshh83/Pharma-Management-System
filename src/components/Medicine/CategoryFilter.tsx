
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, FileText, Brain, Thermometer, Zap } from 'lucide-react';

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basic': return <Pill className="h-4 w-4" />;
      case 'prescription': return <FileText className="h-4 w-4" />;
      case 'headache': return <Brain className="h-4 w-4" />;
      case 'cough': return <Thermometer className="h-4 w-4" />;
      case 'energy': return <Zap className="h-4 w-4" />;
      default: return <Pill className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string, isSelected: boolean) => {
    if (isSelected) {
      switch (category) {
        case 'basic': return 'bg-blue-600 text-white border-blue-600 shadow-lg';
        case 'prescription': return 'bg-red-600 text-white border-red-600 shadow-lg';
        case 'headache': return 'bg-orange-600 text-white border-orange-600 shadow-lg';
        case 'cough': return 'bg-green-600 text-white border-green-600 shadow-lg';
        case 'energy': return 'bg-yellow-600 text-white border-yellow-600 shadow-lg';
        default: return 'bg-gray-600 text-white border-gray-600 shadow-lg';
      }
    }
    return 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50';
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Category</h3>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => onCategorySelect(null)}
          className={`mb-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg ${
            selectedCategory === null 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg hover:shadow-xl" 
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Pill className="h-4 w-4 mr-2" />
          All Medicines
          <Badge className="ml-3 bg-white/20 text-current border-0" variant="secondary">
            {Object.values(medicineCount).reduce((sum, count) => sum + count, 0)}
          </Badge>
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            onClick={() => onCategorySelect(category)}
            className={`mb-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg ${getCategoryColor(category, selectedCategory === category)}`}
          >
            {getCategoryIcon(category)}
            <span className="ml-2">{getCategoryLabel(category)}</span>
            <Badge className="ml-3 bg-white/20 text-current border-0" variant="secondary">
              {medicineCount[category] || 0}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
