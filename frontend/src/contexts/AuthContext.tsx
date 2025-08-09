import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: 'employee' | 'admin') => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('hexamentor_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    if (email === 'admin@hexamentor.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@hexamentor.com',
        role: 'admin',
        skills: [],
        jobRoles: [],
        createdAt: new Date(),
      };
      setUser(adminUser);
      localStorage.setItem('hexamentor_user', JSON.stringify(adminUser));
      return true;
    } else if (email === 'user@hexamentor.com' && password === 'user123') {
      const employeeUser: User = {
        id: 'emp-1',
        name: 'John Developer',
        email: 'user@hexamentor.com',
        role: 'employee',
        skills: [],
        jobRoles: [],
        createdAt: new Date(),
      };
      setUser(employeeUser);
      localStorage.setItem('hexamentor_user', JSON.stringify(employeeUser));
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string, role: 'employee' | 'admin'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `${role}-${Date.now()}`,
      name,
      email,
      role,
      skills: [],
      jobRoles: [],
      createdAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('hexamentor_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hexamentor_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('hexamentor_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};