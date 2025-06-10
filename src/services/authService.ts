
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { LoginData, RegisterData, AuthResult } from '@/types/auth';

export const authService = {
  async login({ email, password, role }: LoginData): Promise<AuthResult> {
    console.log('Attempting login for:', email, 'as role:', role);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Login error:', authError);
        
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
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError || !profile) {
          console.error('Profile check error:', profileError);
          await supabase.auth.signOut();
          return { success: false, error: 'User profile not found. Please contact support.' };
        }

        if (profile.role !== role) {
          console.error('Role mismatch. Expected:', role, 'Got:', profile.role);
          await supabase.auth.signOut();
          return { success: false, error: `You are registered as a ${profile.role}, not a ${role}.` };
        }

        console.log('Login successful with correct role');
        return { success: true };
      }

      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  },

  async register(userData: RegisterData): Promise<AuthResult> {
    console.log('Attempting registration for:', userData.email, 'as role:', userData.role);
    
    try {
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
          return { 
            success: true, 
            error: 'Registration successful! Please check your email for confirmation.' 
          };
        }
        
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
          return { 
            success: true, 
            error: 'Account created but profile setup incomplete. Please try logging in.' 
          };
        }

        console.log('Registration completed successfully');
        return { success: true };
      }

      return { success: false, error: 'Registration failed. Please try again.' };
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
