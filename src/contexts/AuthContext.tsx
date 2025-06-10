
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          console.log('User signed in, fetching profile...');
          await fetchUserProfile(session.user.id);
        } else {
          console.log('No user session, clearing state');
          clearUser();
        }
      }
    );

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
  }, [fetchUserProfile, clearUser, setLoading]);

  const login = async (email: string, password: string, role: string) => {
    setLoading(true);
    const result = await authService.login({ email, password, role } as LoginData);
    setLoading(false);
    return result;
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    const result = await authService.register(userData);
    setLoading(false);
    return result;
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
