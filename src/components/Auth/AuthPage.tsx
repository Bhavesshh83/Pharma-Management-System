
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

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    console.log('Login form submitted with:', loginData);
    
    try {
      const success = await login(loginData.email, loginData.password, loginData.role);
      
      if (success) {
        toast({
          title: "Login successful!",
          description: `Welcome back!`,
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
        toast({
          title: "Login Failed",
          description: "Invalid email, password, or role selection. Please check your credentials and ensure you're selecting the correct role.",
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

    if (!registerData.email.includes('@')) {
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
    console.log('Register form submitted with:', registerData);
    
    try {
      const success = await register(registerData);
      
      if (success) {
        toast({
          title: "Registration Successful!",
          description: `Account created successfully! You can now log in.`,
        });
        
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
        const loginTab = document.querySelector('[data-value="login"]') as HTMLElement;
        if (loginTab) {
          loginTab.click();
        }
      } else {
        toast({
          title: "Registration Failed",
          description: "Unable to create account. This email might already be registered. Please try with a different email.",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-800">MediCare+</CardTitle>
          <CardDescription>Your trusted medicine delivery partner</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-role">Login As</Label>
                  <RadioGroup
                    value={loginData.role}
                    onValueChange={(value: User['role']) => setLoginData({...loginData, role: value})}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="user" id="user" />
                      <Label htmlFor="user">Customer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pharmacist" id="pharmacist" />
                      <Label htmlFor="pharmacist">Pharmacist</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery">Delivery Partner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="admin" />
                      <Label htmlFor="admin">Admin</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-role">Register As</Label>
                  <RadioGroup
                    value={registerData.role}
                    onValueChange={(value: User['role']) => setRegisterData({...registerData, role: value})}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="user" id="reg-user" />
                      <Label htmlFor="reg-user">Customer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pharmacist" id="reg-pharmacist" />
                      <Label htmlFor="reg-pharmacist">Pharmacist</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="reg-delivery" />
                      <Label htmlFor="reg-delivery">Delivery Partner</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    required
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    required
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    required
                    placeholder="Create a password (min 6 characters)"
                    minLength={6}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Phone Number (Optional)</Label>
                  <Input
                    id="register-phone"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                    placeholder="Enter your phone number"
                    disabled={isLoading}
                  />
                </div>
                
                {registerData.role === 'user' && (
                  <div className="space-y-2">
                    <Label htmlFor="register-address">Address (Optional)</Label>
                    <Input
                      id="register-address"
                      value={registerData.address}
                      onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                      placeholder="Enter your address"
                      disabled={isLoading}
                    />
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
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
