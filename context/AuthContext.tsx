
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { AuthUser, Driver } from '../types';
import { MOCK_DRIVERS, GUEST_DRIVERS } from '../constants';

const DRIVER_STORAGE_KEY = 'cna_drivers_data';
const ADMIN_REGISTRY_KEY = 'cna_admin_registry';
const INITIAL_ADMINS = ['1177810'];

interface AuthContextType {
  user: AuthUser | null;
  login: (emailOrId: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authStep: number;
  allDrivers: Driver[]; // The true database
  visibleDrivers: Driver[]; // What the current user is allowed to see
  updateDriverInfo: (id: string, updates: Partial<Driver>) => void;
  admins: string[];
  addAdmin: (id: string) => void;
  removeAdmin: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState(0);
  const [allDrivers, setAllDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [admins, setAdmins] = useState<string[]>(INITIAL_ADMINS);

  useEffect(() => {
    const savedDrivers = localStorage.getItem(DRIVER_STORAGE_KEY);
    if (savedDrivers) {
      try { setAllDrivers(JSON.parse(savedDrivers)); } catch (e) {}
    }

    const savedAdmins = localStorage.getItem(ADMIN_REGISTRY_KEY);
    if (savedAdmins) {
      try { setAdmins(JSON.parse(savedAdmins)); } catch (e) {}
    }
  }, []);

  const isAuthenticated = !!user;

  // Dynamically switch drivers based on auth status
  const visibleDrivers = useMemo(() => {
    if (isAuthenticated) return allDrivers;
    return GUEST_DRIVERS;
  }, [isAuthenticated, allDrivers]);

  const addAdmin = (id: string) => {
    if (!admins.includes(id)) {
      const updated = [...admins, id];
      setAdmins(updated);
      localStorage.setItem(ADMIN_REGISTRY_KEY, JSON.stringify(updated));
    }
  };

  const removeAdmin = (id: string) => {
    const updated = admins.filter(a => a !== id);
    setAdmins(updated);
    localStorage.setItem(ADMIN_REGISTRY_KEY, JSON.stringify(updated));
    if (user && user.id === id) {
      setUser({ ...user, isAdmin: false });
    }
  };

  const updateDriverInfo = (id: string, updates: Partial<Driver>) => {
    const updated = allDrivers.map(d => d.id === id ? { ...d, ...updates } : d);
    setAllDrivers(updated);
    localStorage.setItem(DRIVER_STORAGE_KEY, JSON.stringify(updated));
    if (user && user.id === id) {
      setUser({ ...user, ...updates });
    }
  };

  const login = async (emailOrId: string) => {
    setIsAuthenticating(true);
    setAuthStep(1);
    await new Promise(resolve => setTimeout(resolve, 800));
    setAuthStep(2);
    await new Promise(resolve => setTimeout(resolve, 800));
    setAuthStep(3);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setAuthStep(4);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundDriver = allDrivers.find(d => emailOrId === d.id || emailOrId.toLowerCase().includes(d.name.toLowerCase().split(' ')[0].toLowerCase())) || allDrivers[0];
    const isAdmin = admins.includes(foundDriver.id);
    
    setUser({ ...foundDriver, email: emailOrId.includes('@') ? emailOrId : 'member@iracing.com', isAdmin });
    setIsAuthenticating(false);
    setAuthStep(0);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      isAuthenticating, 
      authStep, 
      allDrivers, 
      visibleDrivers,
      updateDriverInfo, 
      admins, 
      addAdmin, 
      removeAdmin 
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
