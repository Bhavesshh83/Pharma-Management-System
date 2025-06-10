
import React, { useState, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { medicines } from '@/data/medicines';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Upload, Shield, Truck, Clock, Star, Users, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

// Lazy load components
const CategoryFilter = lazy(() => import('@/components/Medicine/CategoryFilter'));
const OptimizedMedicineCard = lazy(() => import('@/components/Medicine/OptimizedMedicineCard'));

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user } = useAuth();

  const categories = ['basic', 'prescription', 'headache', 'cough', 'energy'];

  const filteredMedicines = useMemo(() => {
    return medicines.filter(medicine => {
      const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === null || medicine.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const medicineCount = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = medicines.filter(med => med.category === category).length;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section - Optimized */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-700"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Health,
            <span className="block text-yellow-300">Our Priority</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Get medicines delivered to your doorstep with AI-powered prescription verification and real-time tracking
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all">
                <Link to="/auth">Get Started Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-2 border-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all">
                <Link to="/prescription-upload">Upload Prescription</Link>
              </Button>
            </div>
          )}
          <div className="mt-12 flex justify-center items-center space-x-8 text-sm opacity-80">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-300" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>50,000+ Happy Customers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>ISO Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Optimized with memoization */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Why Choose MediCare+?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of healthcare delivery with our cutting-edge technology and exceptional service
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "AI Verification",
                description: "Advanced AI algorithms ensure prescription accuracy and safety, preventing medication errors and drug interactions",
                gradient: "from-green-400 to-green-600"
              },
              {
                icon: Truck,
                title: "Express Delivery",
                description: "Lightning-fast delivery within 2-4 hours with GPS tracking, temperature-controlled transport for sensitive medicines",
                gradient: "from-blue-400 to-blue-600"
              },
              {
                icon: Clock,
                title: "24/7 Service",
                description: "Round-the-clock availability with emergency medicine support, pharmacist consultation, and instant customer service",
                gradient: "from-purple-400 to-purple-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className={`mx-auto w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Medicine Catalog - Optimized with lazy loading */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Browse Medicines
              </h2>
              <p className="text-xl text-gray-600">Discover our extensive collection of quality medicines</p>
            </div>
            {user && (
              <Button asChild variant="outline" size="lg" className="mt-6 md:mt-0 bg-white border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all">
                <Link to="/prescription-upload">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Prescription
                </Link>
              </Button>
            )}
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative mb-10">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <Input
                placeholder="Search for medicines, brands, or health conditions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-400 focus:ring-blue-400 shadow-lg"
              />
            </div>
          </div>

          {/* Category Filter with Suspense */}
          <Suspense fallback={<LoadingSpinner />}>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              medicineCount={medicineCount}
            />
          </Suspense>

          {/* Medicine Grid with lazy loading */}
          <Suspense fallback={
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          }>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMedicines.map((medicine) => (
                <OptimizedMedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          </Suspense>

          {filteredMedicines.length === 0 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">No medicines found</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Try adjusting your search terms or browse our categories to find what you're looking for
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
