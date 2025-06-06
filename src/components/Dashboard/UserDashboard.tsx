
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Clock, Truck, CheckCircle, Upload, ShoppingCart, TrendingUp, Heart, Star } from 'lucide-react';

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
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-xl opacity-90">Manage your health journey with ease</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold">4.9</div>
                  <div className="opacity-80">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="opacity-80">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2hr</div>
                  <div className="opacity-80">Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group hover:-translate-y-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Browse Medicines</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Discover our extensive collection of quality medicines and health products</p>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all">
                <Link to="/">Shop Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group hover:-translate-y-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Upload Prescription</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Get prescription medicines with our AI-powered verification system</p>
              <Button asChild variant="outline" className="w-full border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all">
                <Link to="/prescription-upload">Upload</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group hover:-translate-y-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Track Orders</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Monitor your deliveries with real-time tracking and updates</p>
              <Button asChild variant="outline" className="w-full border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all">
                <Link to="/orders">View Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                    <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">Your latest medicine purchases</CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                  {recentOrders.length} orders
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {recentOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-lg text-gray-800">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-green-600">₹{order.total}</p>
                      <Badge className={`border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2 capitalize">{order.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              
              {recentOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-16 w-16 mx-auto mb-6 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                  <p className="mb-6">Start your health journey with us today</p>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                    <Link to="/">Start Shopping</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prescriptions */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50 rounded-t-lg border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                    <Heart className="h-6 w-6 mr-3 text-green-600" />
                    Prescription Status
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">Track your uploaded prescriptions</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800 border border-green-200">
                  {prescriptions.length} prescriptions
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-lg text-gray-800">Prescription #{prescription.id}</p>
                      <p className="text-sm text-gray-500">{prescription.uploadedAt}</p>
                    </div>
                    <Badge className={`border ${getStatusColor(prescription.status)}`}>
                      <span className="capitalize">{prescription.status}</span>
                    </Badge>
                  </div>
                  {prescription.medicines.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-3 text-gray-700">Approved medicines:</p>
                      <div className="space-y-1">
                        {prescription.medicines.map((medicine, index) => (
                          <p key={index} className="text-gray-600 flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                            {medicine}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {prescriptions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Upload className="h-16 w-16 mx-auto mb-6 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No prescriptions uploaded</h3>
                  <p className="mb-6">Upload your prescription for quick verification</p>
                  <Button asChild variant="outline" className="border-2 border-green-200 hover:bg-green-50">
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
