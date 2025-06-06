
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { LogOut, ShoppingCart, User, Package, Truck, Settings, Heart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'pharmacist':
        return '/pharmacist';
      case 'delivery':
        return '/delivery';
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-18">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Heart className="h-7 w-7" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                MediCare+
              </span>
              <p className="text-xs text-gray-500 font-medium">Healthcare Delivery</p>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {user.role === 'user' && (
                  <Link to="/cart" className="relative group">
                    <Button variant="outline" size="sm" className="relative bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 px-4 py-2">
                      <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                      {getTotalItems() > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                          {getTotalItems()}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 px-4 py-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-xl rounded-lg">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuItem 
                      onClick={() => navigate(getDashboardRoute())}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      {user.role === 'admin' && <Settings className="h-4 w-4 mr-3 text-purple-600" />}
                      {user.role === 'pharmacist' && <Package className="h-4 w-4 mr-3 text-green-600" />}
                      {user.role === 'delivery' && <Truck className="h-4 w-4 mr-3 text-blue-600" />}
                      {user.role === 'user' && <User className="h-4 w-4 mr-3 text-gray-600" />}
                      <div>
                        <p className="font-medium">Dashboard</p>
                        <p className="text-xs text-gray-500">Manage your account</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      <div>
                        <p className="font-medium">Logout</p>
                        <p className="text-xs text-gray-500">Sign out of your account</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-4">
                <Button asChild variant="outline" size="sm" className="bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 px-6 py-2 font-medium">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2 font-medium">
                  <Link to="/auth">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
