
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { LoginData, RegisterData, AuthResult } from '@/types/auth';

export const authService = {
  async login({ email, password, role }: LoginData): Promise<AuthResult> {
    console.log('Attempting login for:', email, 'as role:', role);
    
    try {
      // Single authentication call - no pre-checks
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Login error:', authError);
        
        // Fast error mapping without additional lookups
        const errorMap: Record<string, string> = {
          'Email not confirmed': 'Please check your email and confirm your account.',
          'Invalid login credentials': 'Invalid email or password.',
        };
        
        return { 
          success: false, 
          error: errorMap[authError.message] || authError.message 
        };
      }

      if (!authData.user) {
        return { success: false, error: 'Login failed. Please try again.' };
      }

      // Use optimized database function for role check
      const { data: userRole, error: roleError } = await supabase
        .rpc('get_user_role', { p_user_id: authData.user.id });

      if (roleError || !userRole) {
        console.error('Role check error:', roleError);
        await supabase.auth.signOut();
        return { success: false, error: 'User profile not found. Please contact support.' };
      }

      if (userRole !== role) {
        console.error('Role mismatch. Expected:', role, 'Got:', userRole);
        await supabase.auth.signOut();
        return { success: false, error: `You are registered as a ${userRole}, not a ${role}.` };
      }

      console.log('Login successful with correct role');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  },

  async register(userData: RegisterData): Promise<AuthResult> {
    console.log('Attempting registration for:', userData.email, 'as role:', userData.role);
    
    try {
      // Streamlined registration with optimized redirect
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
        
        // Fast error mapping
        const errorMap: Record<string, string> = {
          'User already registered': 'An account with this email already exists.',
          'email_address_invalid': 'Please enter a valid email address.',
          'weak_password': 'Password must be at least 6 characters long.',
        };
        
        const errorKey = Object.keys(errorMap).find(key => 
          authError.message.includes(key)
        );
        
        return { 
          success: false, 
          error: errorKey ? errorMap[errorKey] : authError.message 
        };
      }

      if (!authData.user) {
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      // Check if email confirmation is required
      if (!authData.session) {
        return { 
          success: true, 
          error: 'Registration successful! Please check your email for confirmation.' 
        };
      }

      // Use optimized database function for profile creation
      const { data: profileCreated, error: profileError } = await supabase
        .rpc('create_user_profile', {
          p_user_id: authData.user.id,
          p_email: userData.email,
          p_name: userData.name,
          p_role: userData.role,
          p_phone: userData.phone || null,
          p_address: userData.address || null
        });

      if (profileError || !profileCreated) {
        console.error('Profile creation error:', profileError);
        return { 
          success: true, 
          error: 'Account created but profile setup incomplete. Please try logging in.' 
        };
      }

      console.log('Registration completed successfully');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An unexpected error occurred during registration.' };
    }
  },

  async logout(): Promise<void> {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};
