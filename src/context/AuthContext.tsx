import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Branch } from '../types/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  branch_id: string;
  branch : Branch;
  avatar: string;
  is_active: boolean;
  status: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs once on mount to initialize auth state from localStorage
    try {
      const storedToken = localStorage.getItem('token');
      const storedUserData = localStorage.getItem('userData');
      console.log('AuthProvider initializing from storage. Token:', storedToken);

      if (storedToken && storedUserData) {
        const parsedUser: User = JSON.parse(storedUserData);
        // Set state based on what was found in storage
        setToken(storedToken);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to parse user data from localStorage', error);
      // Clear potentially corrupt data
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    } finally {
      // Finished loading auth state
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
