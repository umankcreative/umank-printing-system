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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Try to refresh token first
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        // If no refresh token, try to use existing token
        const response = await api.get('/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.valid) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          handleLogout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (newToken: string, refreshToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token: null, user, login, logout: handleLogout, checkAuth, isLoading: loading }}>
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