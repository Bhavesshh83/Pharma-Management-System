
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Medicine } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, Prescription } from 'lucide-react';
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
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'prescription': return 'bg-red-100 text-red-800';
      case 'headache': return 'bg-orange-100 text-orange-800';
      case 'cough': return 'bg-green-100 text-green-800';
      case 'energy': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getCategoryColor(medicine.category)}>
            {getCategoryLabel(medicine.category)}
          </Badge>
          {medicine.requiresPrescription && (
            <Prescription className="h-4 w-4 text-red-500" />
          )}
        </div>
        <img
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-32 object-cover rounded-md"
        />
      </CardHeader>
      
      <CardContent className="flex-1">
        <CardTitle className="text-lg mb-2">{medicine.name}</CardTitle>
        <CardDescription className="text-sm mb-2">
          {medicine.description}
        </CardDescription>
        <p className="text-xs text-gray-500 mb-2">By {medicine.manufacturer}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-600">₹{medicine.price}</span>
          <Badge variant={medicine.inStock ? "default" : "destructive"}>
            {medicine.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleAddToCart}
          disabled={!medicine.inStock}
          className="w-full"
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
