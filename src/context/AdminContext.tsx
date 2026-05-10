import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  email: string;
  name: string;
  role: 'admin';
}

interface AdminContextType {
  admin: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;
}

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@way3d.tn',
  password: 'admin123',
  name: 'Administrateur WAY3D',
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('way3d_admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (admin) {
      localStorage.setItem('way3d_admin', JSON.stringify(admin));
    } else {
      localStorage.removeItem('way3d_admin');
    }
  }, [admin]);

  const adminLogin = (email: string, password: string): boolean => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setAdmin({ email, name: ADMIN_CREDENTIALS.name, role: 'admin' });
      return true;
    }
    return false;
  };

  const adminLogout = () => setAdmin(null);

  return (
    <AdminContext.Provider value={{ admin, isAdminAuthenticated: !!admin, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
