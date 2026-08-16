import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('nirmaan_auth_token');
      const storedUser = localStorage.getItem('nirmaan_auth_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.warn('Error restoring auth session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('nirmaan_auth_token', userToken);
    localStorage.setItem('nirmaan_auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nirmaan_auth_token');
    localStorage.removeItem('nirmaan_auth_user');
  };

  const switchRole = (newRole) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      role: newRole,
      designation: newRole === 'ADMIN' ? 'MCD Commissioner' :
                   newRole === 'WORKER' ? 'Field Operator' : 'Resident'
    };
    setUser(updatedUser);
    localStorage.setItem('nirmaan_auth_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
