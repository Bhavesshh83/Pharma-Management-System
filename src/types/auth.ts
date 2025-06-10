
import { User } from '@/types';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: User['role']) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

export interface LoginData {
  email: string;
  password: string;
  role: User['role'];
}

export interface RegisterData extends Omit<User, 'id'> {
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}
