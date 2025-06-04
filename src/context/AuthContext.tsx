import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status?: string;
  branch_id?: string;
  avatar?: string;
  last_active?: string | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  branch?: {
    id: string;
    name: string;
    location: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, refreshToken: string, userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!storedToken || !storedUser) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    try {
      // Verify token with the backend
      const response = await api.get('/auth/verify');
      const { authenticated, user: verifiedUser } = response.data;
      
      if (authenticated && verifiedUser) {
        setToken(storedToken);
        setUser(verifiedUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (newToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, checkAuth, isLoading }}>
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