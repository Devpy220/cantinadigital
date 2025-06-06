import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, login as loginService, logout as logoutService, register as registerService } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);
  
  const login = async (email: string, password: string): Promise<User | null> => {
    const loggedInUser = loginService(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return loggedInUser;
    }
    return null;
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User | null> => {
    const newUser = registerService(userData);
    if (newUser) {
      setUser(newUser);
      return newUser;
    }
    return null;
  };
  
  const logout = () => {
    logoutService();
    setUser(null);
  };
  
  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};