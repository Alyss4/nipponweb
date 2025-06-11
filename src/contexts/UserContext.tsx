'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserContextType {
  isAuthenticated: boolean;
  email: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  isAuthenticated: false,
  email: null,
  role: null,
  login: () => {},
  logout: () => {},
});

function getJwtPayload(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const payload = getJwtPayload(token);
  const currentTime = Date.now() / 1000;
  return payload && (!payload.exp || payload.exp > currentTime);
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (isTokenValid(token)) {
      setIsAuthenticated(true);
      setRole(storedRole);
      const payload = getJwtPayload(token!);
      setEmail(payload?.email || null);
    } else {
      setIsAuthenticated(false);
      setRole(null);
      setEmail(null);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }, []);

  const login = (token: string, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    const payload = getJwtPayload(token);
    setEmail(payload?.email || null);
    setRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setEmail(null);
    setRole(null);
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, email, role, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
