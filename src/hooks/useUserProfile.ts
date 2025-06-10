
import { useState } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
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

  const clearUser = () => {
    setUser(null);
    setLoading(false);
  };

  return {
    user,
    setUser,
    loading,
    setLoading,
    fetchUserProfile,
    clearUser
  };
};
