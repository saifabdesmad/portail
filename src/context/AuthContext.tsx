import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isModalOpen: boolean;
  modalTab: 'login' | 'register';
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  openModal: (tab?: 'login' | 'register') => void;
  closeModal: () => void;
  setModalTab: (tab: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'way3d_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const user = saved ? JSON.parse(saved) : null;
      return { user, isAuthenticated: !!user, isModalOpen: false, modalTab: 'login' };
    } catch {
      return { user: null, isAuthenticated: false, isModalOpen: false, modalTab: 'login' };
    }
  });

  useEffect(() => {
    if (state.user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state.user]);

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Simulated login - replace with real API call
    await new Promise(r => setTimeout(r, 800));
    const user: User = {
      id: '1',
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
    };
    setState(s => ({ ...s, user, isAuthenticated: true, isModalOpen: false }));
    return true;
  };

  const register = async (name: string, email: string, _password: string): Promise<boolean> => {
    // Simulated register - replace with real API call
    await new Promise(r => setTimeout(r, 1000));
    const user: User = { id: Date.now().toString(), name, email };
    setState(s => ({ ...s, user, isAuthenticated: true, isModalOpen: false }));
    return true;
  };

  const logout = () => {
    setState(s => ({ ...s, user: null, isAuthenticated: false }));
  };

  const openModal = (tab: 'login' | 'register' = 'login') => {
    setState(s => ({ ...s, isModalOpen: true, modalTab: tab }));
  };

  const closeModal = () => {
    setState(s => ({ ...s, isModalOpen: false }));
  };

  const setModalTab = (tab: 'login' | 'register') => {
    setState(s => ({ ...s, modalTab: tab }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, openModal, closeModal, setModalTab }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
