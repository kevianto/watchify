import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';

interface User {
  id: string;
  email?: string;
  username: string;
  isAnonymous: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  loginAnonymous: (username: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('watchify_token');
    const storedUser = localStorage.getItem('watchify_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log('Restored user session:', JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('watchify_token');
        localStorage.removeItem('watchify_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login process...');
      const response = await authService.login(email, password);
      console.log('Login response received:', response.data);
      
      const { token: newToken, user: newUser } = response.data;
      
      if (!newToken || !newUser) {
        throw new Error('Invalid response format from server');
      }
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('watchify_token', newToken);
      localStorage.setItem('watchify_user', JSON.stringify(newUser));
      
      console.log('Login successful, user set:', newUser);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Clear any existing auth data on error
      setToken(null);
      setUser(null);
      localStorage.removeItem('watchify_token');
      localStorage.removeItem('watchify_user');
      
      // Re-throw with more specific error message
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:5000');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 404) {
        throw new Error('Login endpoint not found. Please check your backend API routes.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Login failed');
      }
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      console.log('Starting registration process...');
      const response = await authService.register(email, password, username);
      console.log('Registration response received:', response.data);
      
      const { token: newToken, user: newUser } = response.data;
      
      if (!newToken || !newUser) {
        throw new Error('Invalid response format from server');
      }
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('watchify_token', newToken);
      localStorage.setItem('watchify_user', JSON.stringify(newUser));
      
      console.log('Registration successful, user set:', newUser);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Clear any existing auth data on error
      setToken(null);
      setUser(null);
      localStorage.removeItem('watchify_token');
      localStorage.removeItem('watchify_user');
      
      // Re-throw with more specific error message
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:5000');
      } else if (error.response?.status === 409) {
        throw new Error('Email or username already exists');
      } else if (error.response?.status === 404) {
        throw new Error('Registration endpoint not found. Please check your backend API routes.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Registration failed');
      }
    }
  };

  const loginAnonymous = async (username: string) => {
    try {
      console.log('Starting anonymous login process...');
      const response = await authService.loginAnonymous(username);
      console.log('Anonymous login response received:', response.data);
      
      const { token: newToken, user: newUser } = response.data;
      
      if (!newToken || !newUser) {
        throw new Error('Invalid response format from server');
      }
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('watchify_token', newToken);
      localStorage.setItem('watchify_user', JSON.stringify(newUser));
      
      console.log('Anonymous login successful, user set:', newUser);
    } catch (error: any) {
      console.error('Anonymous login error:', error);
      
      // Clear any existing auth data on error
      setToken(null);
      setUser(null);
      localStorage.removeItem('watchify_token');
      localStorage.removeItem('watchify_user');
      
      // Re-throw with more specific error message
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:5000');
      } else if (error.response?.status === 404) {
        throw new Error('Anonymous login endpoint not found. Please check your backend API routes.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Anonymous login failed');
      }
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setToken(null);
    setUser(null);
    localStorage.removeItem('watchify_token');
    localStorage.removeItem('watchify_user');
  };

  const value = {
    user,
    token,
    login,
    register,
    loginAnonymous,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};