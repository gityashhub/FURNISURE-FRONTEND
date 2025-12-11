import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  const refreshUser = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await api.get('/auth/me');
        const userData = response.data;
        setUser(userData);
        setIsAdmin(userData.isAdmin === true);
        localStorage.setItem('isAdmin', (userData.isAdmin === true).toString());
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAdmin');
        setUser(null);
        setIsAdmin(false);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('====================================');
    console.log('useeffect called', !!token);
    console.log('====================================');
    
    if (token) {
      api.get('/auth/me')
        .then(response => {
          const userData = response.data;
          setUser(userData);
          setIsAdmin(userData.isAdmin === true);
          localStorage.setItem('isAdmin', (userData.isAdmin === true).toString());
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('isAdmin');
          setUser(null);
          setIsAdmin(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setIsAdmin(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('authToken', token);
      setUser(userData);
      setIsAdmin(userData.isAdmin === true);
      localStorage.setItem('isAdmin', (userData.isAdmin === true).toString());
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data?.message || 'An error occurred during sign in' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        fullName,
      });
      const { token, user: userData } = response.data;
      localStorage.setItem('authToken', token);
      setUser(userData);
      setIsAdmin(userData.isAdmin === true);
      localStorage.setItem('isAdmin', (userData.isAdmin === true).toString());
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data?.message || 'An error occurred during sign up' };
    }
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAdmin');
      setUser(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin,
      isSignedIn: !!user,
      signIn,
      signUp,
      signOut,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
