
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalAmount, clearCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Login Required</CardTitle>
            <CardDescription>Please login to view your cart</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/auth">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePrescriptionRequired = () => {
    const prescriptionItems = items.filter(item => item.medicine.requires_prescription);
    if (prescriptionItems.length > 0) {
      toast({
        title: "Prescription Required",
        description: "Some items in your cart require a prescription. Please upload one to proceed.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    const prescriptionItems = items.filter(item => item.medicine.requires_prescription);
    if (prescriptionItems.length > 0) {
      handlePrescriptionRequired();
      return;
    }

    toast({
      title: "Order Placed!",
      description: "Your order has been placed successfully.",
    });
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-8" />
            <h2 className="text-3xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Start shopping to add items to your cart</p>
            <Button asChild size="lg">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const prescriptionRequired = items.some(item => item.medicine.requires_prescription);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items before checkout</p>
        </div>

        {prescriptionRequired && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">Prescription Required</p>
                  <p className="text-sm text-orange-600">
                    Some items require a valid prescription. 
                    <Link to="/prescription-upload" className="ml-1 underline font-medium">
                      Upload prescription
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.medicine.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.medicine.image}
                      alt={item.medicine.name}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">
                        {item.medicine.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{item.medicine.description}</p>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {item.medicine.manufacturer}
                        </Badge>
                        {item.medicine.requires_prescription && (
                          <Badge variant="destructive" className="text-xs">
                            Prescription Required
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.medicine.id, Math.max(0, item.quantity - 1))}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium text-lg w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            ₹{(item.medicine.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">₹{item.medicine.price} each</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(item.medicine.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee:</span>
                  <span>₹50.00</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">₹{(getTotalAmount() + 50).toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  onClick={handleCheckout}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  Proceed to Checkout
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
