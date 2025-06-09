
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
        
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await fetchUserProfile(session.user.id);
        } else {
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
        
        console.log('Initial session:', session?.user?.email);
        
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
        // If profile doesn't exist, user data might not be synced yet
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
        
        if (authError.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password. Please check your credentials.' };
        }
        if (authError.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please check your email and confirm your account before logging in.' };
        }
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        console.log('Auth successful, checking profile...');
        
        // Check user profile and role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error('Profile not found:', profileError);
          await supabase.auth.signOut();
          setLoading(false);
          return { success: false, error: 'User profile not found. Please contact support.' };
        }

        // Verify role matches
        if (profile.role !== role) {
          console.error('Role mismatch. Expected:', role, 'Got:', profile.role);
          await supabase.auth.signOut();
          setLoading(false);
          return { success: false, error: `You are registered as a ${profile.role}, not ${role}. Please select the correct role.` };
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
            role: userData.role
          }
        }
      });

      if (authError) {
        console.error('Registration auth error:', authError);
        setLoading(false);
        
        if (authError.message.includes('User already registered')) {
          return { success: false, error: 'An account with this email already exists. Please try logging in instead.' };
        }
        if (authError.message.includes('email_address_invalid')) {
          return { success: false, error: 'Please enter a valid email address.' };
        }
        if (authError.message.includes('password')) {
          return { success: false, error: 'Password must be at least 6 characters long.' };
        }
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        console.log('User created, creating profile...');
        
        // Create user profile - retry mechanism for timing issues
        let profileCreated = false;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (!profileCreated && attempts < maxAttempts) {
          attempts++;
          
          try {
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
              console.error(`Profile creation attempt ${attempts} failed:`, profileError);
              
              if (attempts === maxAttempts) {
                // If all attempts failed, clean up auth user
                await supabase.auth.signOut();
                setLoading(false);
                return { success: false, error: 'Failed to create user profile. Please try again.' };
              }
              
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
              profileCreated = true;
              console.log('Profile created successfully');
            }
          } catch (error) {
            console.error(`Profile creation attempt ${attempts} error:`, error);
            if (attempts === maxAttempts) {
              await supabase.auth.signOut();
              setLoading(false);
              return { success: false, error: 'Failed to create user profile. Please try again.' };
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        console.log('Registration successful');
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'Registration failed. Please try again.' };
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      return { success: false, error: 'An unexpected error occurred during registration. Please try again.' };
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
