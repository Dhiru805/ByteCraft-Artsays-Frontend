// src/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(() => localStorage.getItem('userType') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [status, setStatus] = useState(() => localStorage.getItem('status') || null);

  const login = (token, type, userStatus) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', type);
    localStorage.setItem('status', userStatus);
    setIsAuthenticated(true);
    setUserType(type);
    setStatus(userStatus);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberedEmailOrPhone');
    localStorage.removeItem('rememberedPassword');
    localStorage.removeItem('status');
    setIsAuthenticated(false);
    setUserType(null);
    setStatus(null);
    toast.info('Session expired after 48 hours. Please log in again.');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const expiresIn = decoded.exp - currentTime;

        if (expiresIn <= 0) {
          logout();
          return;
        }

        const timer = setTimeout(() => {
          logout();
        }, expiresIn * 1000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);