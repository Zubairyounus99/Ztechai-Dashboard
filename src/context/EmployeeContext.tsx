"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '@/types';

// Mock initial employees
const mockEmployees: User[] = [
  { id: 'emp-1', name: 'Alice Johnson', role: 'Employee' },
  { id: 'emp-2', name: 'Bob Williams', role: 'Employee' },
];

interface EmployeeContextType {
  employees: User[];
  addEmployee: (name: string) => void;
  deleteEmployee: (id: string) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<User[]>(() => {
    try {
      const localEmployees = window.localStorage.getItem("employees");
      return localEmployees ? JSON.parse(localEmployees) : mockEmployees;
    } catch (error) {
      console.error("Failed to parse employees from localStorage", error);
      return mockEmployees;
    }
  });

  useEffect(() => {
    window.localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (name: string) => {
    const newEmployee: User = {
      id: `emp-${Date.now()}`,
      name,
      role: 'Employee',
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, deleteEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};