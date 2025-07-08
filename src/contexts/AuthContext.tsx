
import React, { createContext, useContext, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, LoginData, RegisterData } from '@/types/auth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { authService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, loading, setLoading, fetchUserProfile, clearUser } = useUserProfile();

  useEffect(() => {
    // Optimized auth state management with minimal overhead
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          console.log('User signed in, fetching profile...');
          // Use setTimeout to prevent blocking the auth state change
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          console.log('No user session, clearing state');
          clearUser();
        }
      }
    );

    // Fast initial session check
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
          // Non-blocking profile fetch
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
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
  }, []);  // Remove function dependencies to prevent infinite loops

  const login = async (email: string, password: string, role: string) => {
    setLoading(true);
    try {
      const result = await authService.login({ email, password, role } as LoginData);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
