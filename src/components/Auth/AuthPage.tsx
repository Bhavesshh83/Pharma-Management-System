
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Stethoscope, Truck, Shield, User as UserIcon, Mail, Lock, Eye, EyeOff, Pill } from 'lucide-react';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    role: 'user' as User['role']
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'user' as User['role']
  });

  const roleOptions = [
    { 
      value: 'user', 
      label: 'Customer', 
      icon: UserIcon, 
      description: 'Order medicines online',
      color: 'text-blue-500 dark:text-blue-400'
    },
    { 
      value: 'pharmacist', 
      label: 'Pharmacist', 
      icon: Stethoscope, 
      description: 'Verify prescriptions',
      color: 'text-green-500 dark:text-green-400'
    },
    { 
      value: 'delivery', 
      label: 'Delivery Partner', 
      icon: Truck, 
      description: 'Deliver medicines',
      color: 'text-orange-500 dark:text-orange-400'
    },
    { 
      value: 'admin', 
      label: 'Admin', 
      icon: Shield, 
      description: 'Manage platform',
      color: 'text-purple-500 dark:text-purple-400'
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    if (!loginData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Login form submitted with:', { ...loginData, password: '[HIDDEN]' });
    
    try {
      const result = await login(loginData.email, loginData.password, loginData.role);
      
      if (result.success) {
        toast({
          title: "Login Successful!",
          description: "Welcome back!",
        });
        
        // Navigate based on role
        switch (loginData.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'pharmacist':
            navigate('/pharmacist');
            break;
          case 'delivery':
            navigate('/delivery');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        console.error('Login failed:', result.error);
        toast({
          title: "Login Failed",
          description: result.error || "Login failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.name || !registerData.email || !registerData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in name, email, and password.",
        variant: "destructive",
      });
      return;
    }

    if (!registerData.email.includes('@') || !registerData.email.includes('.')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Register form submitted with:', { ...registerData, password: '[HIDDEN]' });
    
    try {
      const result = await register(registerData);
      
      if (result.success) {
        if (result.error) {
          // Success with a message (like email confirmation needed)
          toast({
            title: "Registration Successful!",
            description: result.error,
          });
        } else {
          toast({
            title: "Registration Successful!",
            description: "Account created successfully! You can now log in.",
          });
        }
        
        // Clear form and switch to login tab
        setRegisterData({
          name: '',
          email: '',
          password: '',
          phone: '',
          address: '',
          role: 'user'
        });
        
        // Auto-fill login form
        setLoginData({
          email: registerData.email,
          password: '',
          role: registerData.role
        });
        
        // Switch to login tab
        setActiveTab('login');
      } else {
        console.error('Registration failed:', result.error);
        toast({
          title: "Registration Failed",
          description: result.error || "Registration failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              MediCare+
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-lg mt-2">
              Your trusted medicine delivery partner
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
            <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
              <strong>Development Note:</strong> If you encounter email confirmation issues, disable email confirmation in your Supabase project settings.
            </AlertDescription>
          </Alert>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-700">
              <TabsTrigger value="login" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600">
                Register
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-6 mt-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-slate-700 dark:text-slate-200 font-medium">Login As</Label>
                  <RadioGroup
                    value={loginData.role}
                    onValueChange={(value: User['role']) => setLoginData({...loginData, role: value})}
                    className="grid grid-cols-2 gap-3"
                  >
                    {roleOptions.map((option) => (
                      <div key={option.value} className="relative">
                        <RadioGroupItem 
                          value={option.value} 
                          id={`login-${option.value}`} 
                          className="peer sr-only" 
                        />
                        <Label 
                          htmlFor={`login-${option.value}`}
                          className="flex flex-col items-center space-y-2 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-600 peer-data-[state=checked]:border-blue-500 dark:peer-data-[state=checked]:border-blue-400 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-900/20 cursor-pointer transition-all"
                        >
                          <option.icon className={`w-6 h-6 ${option.color}`} />
                          <span className="font-medium text-slate-900 dark:text-slate-100">{option.label}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 text-center">{option.description}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-slate-700 dark:text-slate-200 font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        required
                        placeholder="Enter your email"
                        disabled={isLoading}
                        className="pl-10 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-slate-700 dark:text-slate-200 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                        placeholder="Enter your password"
                        disabled={isLoading}
                        className="pl-10 pr-10 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-6 mt-6">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-slate-700 dark:text-slate-200 font-medium">Register As</Label>
                  <RadioGroup
                    value={registerData.role}
                    onValueChange={(value: User['role']) => setRegisterData({...registerData, role: value})}
                    className="grid grid-cols-2 gap-3"
                  >
                    {roleOptions.filter(option => option.value !== 'admin').map((option) => (
                      <div key={option.value} className="relative">
                        <RadioGroupItem 
                          value={option.value} 
                          id={`reg-${option.value}`} 
                          className="peer sr-only" 
                        />
                        <Label 
                          htmlFor={`reg-${option.value}`}
                          className="flex flex-col items-center space-y-2 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-600 peer-data-[state=checked]:border-blue-500 dark:peer-data-[state=checked]:border-blue-400 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-900/20 cursor-pointer transition-all"
                        >
                          <option.icon className={`w-6 h-6 ${option.color}`} />
                          <span className="font-medium text-slate-900 dark:text-slate-100">{option.label}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 text-center">{option.description}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-slate-700 dark:text-slate-200 font-medium">Full Name</Label>
                    <Input
                      id="register-name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                      required
                      placeholder="Enter your full name"
                      disabled={isLoading}
                      className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-slate-700 dark:text-slate-200 font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        required
                        placeholder="Enter your email"
                        disabled={isLoading}
                        className="pl-10 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-slate-700 dark:text-slate-200 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                      <Input
                        id="register-password"
                        type={showRegPassword ? "text" : "password"}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        required
                        placeholder="Create a password (min 6 characters)"
                        minLength={6}
                        disabled={isLoading}
                        className="pl-10 pr-10 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-phone" className="text-slate-700 dark:text-slate-200 font-medium">Phone (Optional)</Label>
                      <Input
                        id="register-phone"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                        placeholder="Phone number"
                        disabled={isLoading}
                        className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                    
                    {registerData.role === 'user' && (
                      <div className="space-y-2">
                        <Label htmlFor="register-address" className="text-slate-700 dark:text-slate-200 font-medium">Address (Optional)</Label>
                        <Input
                          id="register-address"
                          value={registerData.address}
                          onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                          placeholder="Your address"
                          disabled={isLoading}
                          className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
