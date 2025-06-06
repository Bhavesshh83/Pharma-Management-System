
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/components/Dashboard/UserDashboard';
import PharmacistDashboard from '@/components/Dashboard/PharmacistDashboard';
import DeliveryDashboard from '@/components/Dashboard/DeliveryDashboard';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Access Denied</h2>
          <p className="text-gray-500">Please login to access your dashboard</p>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'pharmacist':
      return <PharmacistDashboard />;
    case 'delivery':
      return <DeliveryDashboard />;
    default:
      return <UserDashboard />;
  }
};

export default Dashboard;
