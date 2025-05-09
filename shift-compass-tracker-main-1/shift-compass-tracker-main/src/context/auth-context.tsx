
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'admin';
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // set to true initially

  // On initial mount, restore user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setIsLoading(false); // done loading after checking localStorage
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Login error:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Login failed');
      } else {
        console.error('Unexpected error:', err);
        throw new Error('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Registration error:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Registration failed');
      } else {
        console.error('Unexpected error:', err);
        throw new Error('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
