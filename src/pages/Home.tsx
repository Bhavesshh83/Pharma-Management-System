
import React, { useState, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { medicines } from '@/data/medicines';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Upload, Shield, Truck, Clock, Star, Users, Award, Heart, Zap, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 text-white py-24 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full animate-pulse blur-xl"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-cyan-500/20 rounded-full animate-pulse delay-300 blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-pink-500/20 rounded-full animate-pulse delay-700 blur-xl"></div>
          <div className="absolute bottom-32 right-1/4 w-28 h-28 bg-blue-500/20 rounded-full animate-pulse delay-1000 blur-xl"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white/10 backdrop-blur-lg rounded-full">
              <Heart className="h-16 w-16 text-pink-400" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MediCare+
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed text-gray-200">
            Experience the future of healthcare delivery with AI-powered prescription verification, 
            real-time tracking, and medicines delivered to your doorstep in hours
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-10 py-6 text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group">
                <Link to="/auth">
                  <Sparkles className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                  Get Started Now
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 font-bold px-10 py-6 text-lg shadow-2xl backdrop-blur-lg bg-white/5 transition-all duration-300 group">
                <Link to="/prescription-upload">
                  <Upload className="mr-2 h-6 w-6 group-hover:-translate-y-1 transition-transform" />
                  Upload Prescription
                </Link>
              </Button>
            </div>
          )}
          
          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Star, value: "4.9/5", label: "Customer Rating", color: "text-yellow-400" },
              { icon: Users, value: "50,000+", label: "Happy Customers", color: "text-blue-400" },
              { icon: Award, value: "ISO", label: "Certified Platform", color: "text-green-400" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">MediCare+</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience cutting-edge healthcare technology designed for your safety and convenience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "AI Verification",
                description: "Advanced AI algorithms ensure prescription accuracy and safety, preventing medication errors and drug interactions with real-time verification",
                gradient: "from-green-400 to-emerald-600",
                bgGradient: "from-green-500/10 to-emerald-500/10"
              },
              {
                icon: Zap,
                title: "Express Delivery",
                description: "Lightning-fast delivery within 2-4 hours with GPS tracking, temperature-controlled transport for sensitive medicines",
                gradient: "from-blue-400 to-cyan-600",
                bgGradient: "from-blue-500/10 to-cyan-500/10"
              },
              {
                icon: Clock,
                title: "24/7 Service",
                description: "Round-the-clock availability with emergency medicine support, pharmacist consultation, and instant customer service",
                gradient: "from-purple-400 to-pink-600",
                bgGradient: "from-purple-500/10 to-pink-500/10"
              }
            ].map((feature, index) => (
              <Card key={index} className={`text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-xl group hover:-translate-y-4 bg-gradient-to-br ${feature.bgGradient} backdrop-blur-lg border border-white/10`}>
                <CardHeader className="pb-6">
                  <div className={`mx-auto w-24 h-24 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                    <feature.icon className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg text-gray-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Medicine Catalog */}
      <section className="py-24 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Browse <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Medicines</span>
              </h2>
              <p className="text-xl text-gray-300">Discover our extensive collection of quality medicines and healthcare products</p>
            </div>
            {user && (
              <Button asChild variant="outline" size="lg" className="mt-8 md:mt-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-2 border-purple-400/50 hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-cyan-600/40 hover:border-purple-400 transition-all duration-300 text-white backdrop-blur-lg">
                <Link to="/prescription-upload">
                  <Upload className="h-6 w-6 mr-3" />
                  Upload Prescription
                </Link>
              </Button>
            )}
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative mb-16">
            <div className="relative max-w-3xl mx-auto">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <Input
                placeholder="Search for medicines, brands, or health conditions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-16 pr-6 py-6 text-lg border-2 border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-400 rounded-2xl focus:border-purple-400 focus:ring-purple-400/20 shadow-2xl backdrop-blur-lg transition-all duration-300"
              />
            </div>
          </div>

          {/* Category Filter */}
          <Suspense fallback={<LoadingSpinner />}>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              medicineCount={medicineCount}
            />
          </Suspense>

          {/* Medicine Grid */}
          <Suspense fallback={
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="p-6 bg-gray-800/50 border-gray-700">
                  <Skeleton className="w-full h-48 mb-4 bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 mb-4 bg-gray-700" />
                  <Skeleton className="h-10 w-full bg-gray-700" />
                </Card>
              ))}
            </div>
          }>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
              {filteredMedicines.map((medicine) => (
                <OptimizedMedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          </Suspense>

          {filteredMedicines.length === 0 && (
            <div className="text-center py-24">
              <div className="w-32 h-32 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-lg">
                <Search className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-3xl font-semibold text-white mb-6">No medicines found</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Try adjusting your search terms or browse our categories to find what you're looking for
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-900 via-blue-900 to-cyan-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-8">
            Ready to Experience the Future of Healthcare?
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust MediCare+ for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100 font-bold px-10 py-6 text-lg shadow-2xl transition-all duration-300 group">
              <Link to="/auth">
                <CheckCircle className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                Get Started Today
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-900 font-bold px-10 py-6 text-lg shadow-2xl transition-all duration-300">
              <Link to="/prescription-upload">
                <Upload className="mr-2 h-6 w-6" />
                Upload Prescription
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
