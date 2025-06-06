
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Clock, Truck, CheckCircle, Upload, ShoppingCart } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const recentOrders = [
    {
      id: '1',
      items: ['Paracetamol 500mg x2', 'Dolo 650mg x1'],
      status: 'delivered',
      date: '2024-06-05',
      total: 95
    },
    {
      id: '2',
      items: ['Saridon Advanced x1', 'Electral Powder x2'],
      status: 'out_for_delivery',
      date: '2024-06-06',
      total: 85
    }
  ];

  const prescriptions = [
    {
      id: '1',
      status: 'verified',
      uploadedAt: '2024-06-04',
      medicines: ['Azithromycin 500mg', 'Metformin 500mg']
    },
    {
      id: '2',
      status: 'pending',
      uploadedAt: '2024-06-06',
      medicines: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'out_for_delivery': return <Truck className="h-4 w-4" />;
      case 'preparing': return <Package className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Manage your orders and prescriptions</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Browse Medicines</h3>
              <p className="text-sm text-gray-600 mb-4">Find and order medicines</p>
              <Button asChild className="w-full">
                <Link to="/">Shop Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Upload className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Upload Prescription</h3>
              <p className="text-sm text-gray-600 mb-4">Get prescription medicines</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/prescription-upload">Upload</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Track Orders</h3>
              <p className="text-sm text-gray-600 mb-4">Monitor your deliveries</p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/orders">View Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest medicine orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.total}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                  </div>
                  <div>
                    {order.items.map((item, index) => (
                      <p key={index} className="text-sm text-gray-600">• {item}</p>
                    ))}
                  </div>
                </div>
              ))}
              
              {recentOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders yet</p>
                  <Button asChild className="mt-4">
                    <Link to="/">Start Shopping</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prescriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Prescription Status</CardTitle>
              <CardDescription>Track your uploaded prescriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">Prescription #{prescription.id}</p>
                      <p className="text-sm text-gray-500">{prescription.uploadedAt}</p>
                    </div>
                    <Badge className={getStatusColor(prescription.status)}>
                      <span className="capitalize">{prescription.status}</span>
                    </Badge>
                  </div>
                  {prescription.medicines.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Approved medicines:</p>
                      {prescription.medicines.map((medicine, index) => (
                        <p key={index} className="text-sm text-gray-600">• {medicine}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {prescriptions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No prescriptions uploaded</p>
                  <Button asChild className="mt-4" variant="outline">
                    <Link to="/prescription-upload">Upload Prescription</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
