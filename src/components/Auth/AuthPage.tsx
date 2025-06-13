
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Sparkles, Shield, Zap, Clock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    role: 'user'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(formData.email, formData.password);
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.phone,
        formData.address
      );
      toast({
        title: "Account created!",
        description: "Welcome to MediCare+. You can now access all features.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error?.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-700"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-lg rounded-full border border-white/10">
              <Heart className="h-12 w-12 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            MediCare+
          </h1>
          <p className="text-gray-300 text-lg">Your healthcare companion</p>
        </div>

        <Card className="glass-effect border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-white">Welcome</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700">
                <TabsTrigger value="signin" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-6 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-gray-300">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-gray-300">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-6 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-gray-300">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-300">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-purple-400">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="user" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-blue-400" />
                            Customer
                          </div>
                        </SelectItem>
                        <SelectItem value="pharmacist" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-green-400" />
                            Pharmacist
                          </div>
                        </SelectItem>
                        <SelectItem value="delivery" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-yellow-400" />
                            Delivery Partner
                          </div>
                        </SelectItem>
                        <SelectItem value="admin" className="text-white hover:bg-gray-700">
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-2 text-red-400" />
                            Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone" className="text-gray-300">Phone (Optional)</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-address" className="text-gray-300">Address (Optional)</Label>
                    <Input
                      id="signup-address"
                      type="text"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating account...
                      </div>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
