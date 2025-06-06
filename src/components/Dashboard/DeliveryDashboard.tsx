
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Package, Clock, CheckCircle, Truck, Navigation } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      customerName: 'Alice Brown',
      customerPhone: '+91 98765 43210',
      address: '123 Main St, Sector 15, Gurgaon, Haryana 122001',
      items: ['Paracetamol 500mg x2', 'Dolo 650mg x1'],
      amount: 95,
      status: 'assigned',
      distance: '2.5 km',
      estimatedTime: '25 mins',
      pickupLocation: 'MediCare+ Pharmacy, Sector 14'
    },
    {
      id: 'ORD002',
      customerName: 'Bob Davis',
      customerPhone: '+91 87654 32109',
      address: '456 Park Avenue, Block A, Delhi 110001',
      items: ['Azithromycin 500mg x3', 'Electral Powder x2'],
      amount: 245,
      status: 'picked_up',
      distance: '1.8 km',
      estimatedTime: '15 mins',
      pickupLocation: 'MediCare+ Pharmacy, CP'
    },
    {
      id: 'ORD003',
      customerName: 'Carol White',
      customerPhone: '+91 76543 21098',
      address: '789 Green Valley, Phase 2, Noida, UP 201301',
      items: ['Saridon Advanced x1', 'Honitus Drops x1'],
      amount: 50,
      status: 'delivered',
      distance: '3.2 km',
      estimatedTime: 'Completed',
      pickupLocation: 'MediCare+ Pharmacy, Sector 18'
    }
  ]);

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    let message = '';
    switch (newStatus) {
      case 'picked_up':
        message = 'Order picked up from pharmacy';
        break;
      case 'out_for_delivery':
        message = 'Order is now out for delivery';
        break;
      case 'delivered':
        message = 'Order delivered successfully';
        break;
    }
    
    toast({
      title: "Status Updated",
      description: message,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <Package className="h-4 w-4" />;
      case 'picked_up': return <Truck className="h-4 w-4" />;
      case 'out_for_delivery': return <Navigation className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const assignedCount = orders.filter(o => o.status === 'assigned').length;
  const activeCount = orders.filter(o => ['picked_up', 'out_for_delivery'].includes(o.status)).length;
  const deliveredToday = orders.filter(o => o.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Delivery Dashboard</h1>
          <p className="text-gray-600">Manage your delivery routes and orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assigned Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{assignedCount}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Deliveries</p>
                  <p className="text-2xl font-bold text-orange-600">{activeCount}</p>
                </div>
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered Today</p>
                  <p className="text-2xl font-bold text-green-600">{deliveredToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Management */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Orders</CardTitle>
            <CardDescription>Manage your assigned deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="assigned" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="assigned">Assigned</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
                <TabsTrigger value="all">All Orders</TabsTrigger>
              </TabsList>

              <TabsContent value="assigned" className="space-y-4">
                {orders
                  .filter(order => order.status === 'assigned')
                  .map((order) => (
                    <DeliveryOrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="active" className="space-y-4">
                {orders
                  .filter(order => ['picked_up', 'out_for_delivery'].includes(order.status))
                  .map((order) => (
                    <DeliveryOrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="delivered" className="space-y-4">
                {orders
                  .filter(order => order.status === 'delivered')
                  .map((order) => (
                    <DeliveryOrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {orders.map((order) => (
                  <DeliveryOrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DeliveryOrderCard = ({ order, onStatusUpdate }: { order: any; onStatusUpdate: (id: string, status: string) => void }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <Package className="h-4 w-4" />;
      case 'picked_up': return <Truck className="h-4 w-4" />;
      case 'out_for_delivery': return <Navigation className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'assigned': return 'picked_up';
      case 'picked_up': return 'out_for_delivery';
      case 'out_for_delivery': return 'delivered';
      default: return null;
    }
  };

  const getActionText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'assigned': return 'Mark as Picked Up';
      case 'picked_up': return 'Start Delivery';
      case 'out_for_delivery': return 'Mark as Delivered';
      default: return null;
    }
  };

  return (
    <Card className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{order.id}</h3>
          <p className="text-gray-600">{order.customerName}</p>
          <p className="text-sm text-gray-500">{order.customerPhone}</p>
        </div>
        <div className="text-right">
          <Badge className={getStatusColor(order.status)}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
          </Badge>
          <p className="text-lg font-bold text-green-600 mt-1">₹{order.amount}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Pickup Location
          </h4>
          <p className="text-sm text-gray-600">{order.pickupLocation}</p>
        </div>
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Delivery Address
          </h4>
          <p className="text-sm text-gray-600">{order.address}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Items</h4>
        <div className="flex flex-wrap gap-2">
          {order.items.map((item: string, index: number) => (
            <Badge key={index} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <Navigation className="h-4 w-4 mr-1" />
          <span>{order.distance} • {order.estimatedTime}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            Navigate
          </Button>
          
          {getNextStatus(order.status) && (
            <Button 
              size="sm"
              onClick={() => onStatusUpdate(order.id, getNextStatus(order.status)!)}
            >
              {getActionText(order.status)}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DeliveryDashboard;
