import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "pharmacist", label: "Pharmacist" },
  { value: "delivery", label: "Delivery Partner" },
  { value: "admin", label: "Admin" }
] as const;

type RoleType = typeof ROLE_OPTIONS[number]["value"];

const AuthPage = () => {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    role: "user" as RoleType
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(formData.email, formData.password, formData.role);
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      } else {
        throw new Error(result.error || "Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error?.message || "Could not sign in.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await register({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        address: formData.address
      });
      if (result.success) {
        toast({
          title: "Account created!",
          description: "Welcome to MediCare+. You can now access all features.",
        });
      } else {
        throw new Error(result.error || "Failed to create account. Please try again.");
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Login/Register form UI, focused on usability and role safety
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-green-100 px-4">
      <form onSubmit={handleSignIn} className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full space-y-6">
        <h2 className="text-2xl font-bold mb-2">Sign in</h2>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Email"
          type="email"
          name="email"
          value={formData.email}
          autoComplete="username"
          onChange={handleChange}
          required
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          autoComplete="current-password"
          onChange={handleChange}
          required
        />
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(val => !val)}
            className="mr-2"
            id="showPw"
          />
          <label htmlFor="showPw" className="select-none">Show Password</label>
        </div>
        <select
          name="role"
          className="w-full p-2 border rounded mb-2"
          value={formData.role}
          onChange={handleChange}
        >
          {ROLE_OPTIONS.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-bold"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <form
        onSubmit={handleRegister}
        className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full space-y-6 ml-6 hidden lg:block"
      >
        <h2 className="text-2xl font-bold mb-2">Register</h2>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Email"
          type="email"
          name="email"
          value={formData.email}
          autoComplete="username"
          onChange={handleChange}
          required
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          autoComplete="new-password"
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="w-full p-2 border rounded mb-2"
          value={formData.role}
          onChange={handleChange}
        >
          {ROLE_OPTIONS.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
