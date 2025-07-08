
import { useState, useCallback } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { globalCache } from '@/hooks/useOptimizedFetch';

export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Check cache first
      const cacheKey = `profile_${userId}`;
      if (globalCache.has(cacheKey)) {
        const cachedProfile = globalCache.get<User>(cacheKey);
        if (cachedProfile) {
          console.log('Using cached profile');
          setUser(cachedProfile);
          setLoading(false);
          return;
        }
      }
      
      // Optimized single query with indexed lookup
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, name, role, phone, address')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
        setLoading(false);
        return;
      }

      if (profile) {
        console.log('Profile found:', profile);
        const userProfile: User = {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role as User['role'],
          phone: profile.phone,
          address: profile.address
        };
        
        setUser(userProfile);
        // Cache for 10 minutes
        globalCache.set(cacheKey, userProfile, 10 * 60 * 1000);
      } else {
        console.log('Profile not found');
        setUser(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    setLoading(false);
  }, []);

  return {
    user,
    setUser,
    loading,
    setLoading,
    fetchUserProfile,
    clearUser
  };
};
