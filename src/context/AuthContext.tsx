"use client";

import { createContext, useState, useContext, ReactNode } from 'react';
import { User, Role } from '@/types';

const mockUsers: Record<Role, User> = {
  Admin: { id: '1', name: 'Admin User', role: 'Admin' },
  Employee: { id: '2', name: 'Employee User', role: 'Employee' },
};

interface AuthContextType {
  user: User;
  setUser: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers.Admin);

  const setUser = (role: Role) => {
    setCurrentUser(mockUsers[role]);
  };

  return (
    <AuthContext.Provider value={{ user: currentUser, setUser }}>
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