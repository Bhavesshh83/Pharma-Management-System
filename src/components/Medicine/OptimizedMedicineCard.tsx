
import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Medicine } from '@/types';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, FileText } from 'lucide-react';
import LazyImage from '@/components/Common/LazyImage';

interface MedicineCardProps {
  medicine: Medicine;
}

const OptimizedMedicineCard: React.FC<MedicineCardProps> = memo(({ medicine }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      return;
    }

    addToCart(medicine);
    toast({
      title: "Added to Cart",
      description: `${medicine.name} added to your cart`,
    });
  };

  const categoryColors = {
    basic: 'bg-blue-100 text-blue-800',
    prescription: 'bg-red-100 text-red-800',
    headache: 'bg-green-100 text-green-800',
    cough: 'bg-yellow-100 text-yellow-800',
    energy: 'bg-purple-100 text-purple-800',
    saline: 'bg-cyan-100 text-cyan-800',
    equipment: 'bg-gray-100 text-gray-800',
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-lg overflow-hidden">
      <div className="relative">
        <LazyImage
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {medicine.requires_prescription && (
          <Badge className="absolute top-3 right-3 bg-red-500 text-white">
            <FileText className="h-3 w-3 mr-1" />
            Rx
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
            {medicine.name}
          </CardTitle>
          <Badge className={`text-xs ${categoryColors[medicine.category] || 'bg-gray-100 text-gray-800'}`}>
            {medicine.category}
          </Badge>
        </div>
        <CardDescription className="text-gray-600 text-sm line-clamp-2">
          {medicine.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-green-600">₹{medicine.price}</p>
            <p className="text-xs text-gray-500">{medicine.manufacturer}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {medicine.in_stock ? 'In Stock' : 'Out of Stock'}
            </p>
            {!medicine.in_stock && (
              <p className="text-xs text-red-600 font-medium">Unavailable</p>
            )}
          </div>
        </div>

        <Button 
          onClick={handleAddToCart}
          disabled={!medicine.in_stock}
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {medicine.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardContent>
    </Card>
  );
});

OptimizedMedicineCard.displayName = 'OptimizedMedicineCard';

export default OptimizedMedicineCard;
