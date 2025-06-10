
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: User['role']) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          console.log('User signed in, fetching profile...');
          await fetchUserProfile(session.user.id);
        } else {
          console.log('No user session, clearing state');
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('Initial session check:', session?.user?.email || 'No session');
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // Don't retry - if profile doesn't exist, user needs to complete registration
        setUser(null);
        setLoading(false);
        return;
      }

      if (profile) {
        console.log('Profile found:', profile);
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role as User['role'],
          phone: profile.phone,
          address: profile.address
        });
      } else {
        console.log('Profile not found');
        setUser(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, role: User['role']): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    console.log('Attempting login for:', email, 'as role:', role);
    
    try {
      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Login error:', authError);
        setLoading(false);
        
        // Handle specific error cases
        if (authError.message === 'Email not confirmed') {
          return { success: false, error: 'Please check your email and confirm your account.' };
        }
        if (authError.message === 'Invalid login credentials') {
          return { success: false, error: 'Invalid email or password.' };
        }
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        console.log('Auth successful, checking profile...');
        
        // Quick profile check
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError || !profile) {
          console.error('Profile check error:', profileError);
          await supabase.auth.signOut();
          setLoading(false);
          return { success: false, error: 'User profile not found. Please contact support.' };
        }

        // Verify role matches
        if (profile.role !== role) {
          console.error('Role mismatch. Expected:', role, 'Got:', profile.role);
          await supabase.auth.signOut();
          setLoading(false);
          return { success: false, error: `You are registered as a ${profile.role}, not a ${role}.` };
        }

        console.log('Login successful with correct role');
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    console.log('Attempting registration for:', userData.email, 'as role:', userData.role);
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: userData.name,
            role: userData.role,
            phone: userData.phone || '',
            address: userData.address || ''
          }
        }
      });

      if (authError) {
        console.error('Registration auth error:', authError);
        setLoading(false);
        
        if (authError.message.includes('User already registered')) {
          return { success: false, error: 'An account with this email already exists.' };
        }
        if (authError.message.includes('email_address_invalid')) {
          return { success: false, error: 'Please enter a valid email address.' };
        }
        if (authError.message.includes('weak_password')) {
          return { success: false, error: 'Password must be at least 6 characters long.' };
        }
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        console.log('User created successfully');
        
        if (!authData.session) {
          setLoading(false);
          return { 
            success: true, 
            error: 'Registration successful! Please check your email for confirmation.' 
          };
        }
        
        // Create user profile quickly
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            phone: userData.phone || null,
            address: userData.address || null
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          setLoading(false);
          return { 
            success: true, 
            error: 'Account created but profile setup incomplete. Please try logging in.' 
          };
        }

        console.log('Registration completed successfully');
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'Registration failed. Please try again.' };
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      return { success: false, error: 'An unexpected error occurred during registration.' };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
