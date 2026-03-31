import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    userId: localStorage.getItem('userId'),
  });

  const isAuthenticated = !!auth.token;

  const loginUser = (token, role, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    setAuth({ token, role, userId });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, userId: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, isAuthenticated, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
