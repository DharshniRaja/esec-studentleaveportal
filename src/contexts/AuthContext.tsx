import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'student' | 'advisor';

interface User {
  username: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const USERS: Record<string, { password: string; role: UserRole; name: string }> = {
  'ES23IT25': { password: '16042006', role: 'student', name: 'Student' },
  'ES23CD01': { password: '1234', role: 'advisor', name: 'Class Advisor' },
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('esec_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username: string, password: string): boolean => {
    const u = USERS[username.toUpperCase()];
    if (u && u.password === password) {
      const userData = { username: username.toUpperCase(), role: u.role, name: u.name };
      setUser(userData);
      localStorage.setItem('esec_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('esec_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
