
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Medicine } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, FileText, Star, Verified } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (medicine.requiresPrescription) {
      toast({
        title: "Prescription Required",
        description: "Please upload a prescription to purchase this medicine",
        variant: "destructive",
      });
      return;
    }

    addToCart(medicine);
    toast({
      title: "Added to cart",
      description: `${medicine.name} has been added to your cart`,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'prescription': return 'bg-red-100 text-red-800 border-red-200';
      case 'headache': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cough': return 'bg-green-100 text-green-800 border-green-200';
      case 'energy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'basic': return 'Basic Medicine';
      case 'prescription': return 'Prescription Required';
      case 'headache': return 'Headache Relief';
      case 'cough': return 'Cough & Cold';
      case 'energy': return 'Energy & Hydration';
      default: return category;
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group hover:-translate-y-1 bg-white">
      <CardHeader className="pb-3 relative">
        <div className="flex justify-between items-start mb-3">
          <Badge className={`${getCategoryColor(medicine.category)} border font-medium px-3 py-1`}>
            {getCategoryLabel(medicine.category)}
          </Badge>
          <div className="flex items-center space-x-1">
            {medicine.requiresPrescription && (
              <FileText className="h-4 w-4 text-red-500" />
            )}
            <Verified className="h-4 w-4 text-green-500" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={medicine.image}
            alt={medicine.name}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 px-6">
        <CardTitle className="text-xl mb-3 text-gray-800 font-bold line-clamp-2">{medicine.name}</CardTitle>
        <CardDescription className="text-sm mb-3 text-gray-600 line-clamp-2 leading-relaxed">
          {medicine.description}
        </CardDescription>
        <div className="flex items-center mb-3">
          <p className="text-xs text-gray-500 font-medium">By {medicine.manufacturer}</p>
          <div className="flex items-center ml-auto">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-500 ml-1">4.8</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            ₹{medicine.price}
          </span>
          <Badge 
            variant={medicine.inStock ? "default" : "destructive"}
            className={medicine.inStock ? "bg-green-100 text-green-800 border border-green-200" : ""}
          >
            {medicine.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6">
        <Button
          onClick={handleAddToCart}
          disabled={!medicine.inStock}
          className={`w-full py-3 font-semibold transition-all duration-300 ${
            medicine.requiresPrescription 
              ? "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200 hover:text-orange-900" 
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl"
          }`}
          variant={medicine.requiresPrescription ? "outline" : "default"}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {medicine.requiresPrescription ? "Prescription Required" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MedicineCard;
