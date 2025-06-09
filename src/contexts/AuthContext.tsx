
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
      
      // Wait a bit for the profile to be created if it doesn't exist yet
      let attempts = 0;
      const maxAttempts = 5;
      
      while (attempts < maxAttempts) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user profile:', error);
          attempts++;
          if (attempts < maxAttempts) {
            console.log(`Profile fetch attempt ${attempts} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          } else {
            setUser(null);
            setLoading(false);
            return;
          }
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
          setLoading(false);
          return;
        } else {
          console.log(`Profile not found, attempt ${attempts + 1}/${maxAttempts}`);
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      console.log('Profile not found after all attempts');
      setUser(null);
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
          return { success: false, error: 'Please check your email and confirm your account. If you just registered, look for a confirmation email.' };
        }
        if (authError.message === 'Invalid login credentials') {
          return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' };
        }
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        console.log('Auth successful, checking profile...');
        
        // Wait for profile to be available
        let profileCheckAttempts = 0;
        const maxProfileAttempts = 5;
        
        while (profileCheckAttempts < maxProfileAttempts) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Profile check error:', profileError);
            profileCheckAttempts++;
            if (profileCheckAttempts < maxProfileAttempts) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            } else {
              await supabase.auth.signOut();
              setLoading(false);
              return { success: false, error: 'User profile not found. Please contact support or try registering again.' };
            }
          }

          if (profile) {
            // Verify role matches
            if (profile.role !== role) {
              console.error('Role mismatch. Expected:', role, 'Got:', profile.role);
              await supabase.auth.signOut();
              setLoading(false);
              return { success: false, error: `You are registered as a ${profile.role}, not a ${role}. Please select the correct role.` };
            }

            console.log('Login successful with correct role');
            setLoading(false);
            return { success: true };
          } else {
            console.log('Profile not found, waiting...');
            profileCheckAttempts++;
            if (profileCheckAttempts < maxProfileAttempts) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
        
        // If we get here, profile was never found
        await supabase.auth.signOut();
        setLoading(false);
        return { success: false, error: 'Unable to load user profile. Please try again or contact support.' };
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
      // Check if user already exists first
      const { data: existingUser } = await supabase.auth.getUser();
      if (existingUser.user) {
        await supabase.auth.signOut();
      }

      // Create auth user without email confirmation requirement
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
        
        // Handle specific error cases
        if (authError.message.includes('User already registered')) {
          return { success: false, error: 'An account with this email already exists. Please try logging in instead.' };
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
        console.log('User created, creating profile...');
        
        // For development/testing, manually confirm the user if email confirmation is required
        if (!authData.session) {
          console.log('No session created, user needs email confirmation');
          setLoading(false);
          return { 
            success: true, 
            error: 'Registration successful! Please check your email for a confirmation link. In development, you may need to disable email confirmation in Supabase settings.' 
          };
        }
        
        // Create user profile with retry mechanism
        let profileCreated = false;
        let attempts = 0;
        const maxAttempts = 5;
        
        while (!profileCreated && attempts < maxAttempts) {
          attempts++;
          console.log(`Profile creation attempt ${attempts}/${maxAttempts}`);
          
          try {
            // Use upsert to handle potential conflicts
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: authData.user.id,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                phone: userData.phone || null,
                address: userData.address || null
              }, {
                onConflict: 'id'
              });

            if (profileError) {
              console.error(`Profile creation attempt ${attempts} failed:`, profileError);
              
              if (profileError.code === '42501') {
                // RLS policy violation - try to bypass by ensuring user is authenticated
                console.log('RLS policy violation, retrying...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
              }
              
              if (attempts === maxAttempts) {
                console.error('All profile creation attempts failed');
                // Don't sign out the user, they can still use the app
                setLoading(false);
                return { 
                  success: true, 
                  error: 'Account created but profile setup incomplete. Please try logging in.' 
                };
              }
              
              await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
              profileCreated = true;
              console.log('Profile created successfully');
            }
          } catch (error) {
            console.error(`Profile creation attempt ${attempts} error:`, error);
            if (attempts === maxAttempts) {
              setLoading(false);
              return { 
                success: true, 
                error: 'Account created but profile setup incomplete. Please try logging in.' 
              };
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
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
