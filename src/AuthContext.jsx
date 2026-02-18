// src/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(
    () => localStorage.getItem("userType") || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token")
  );
  const [status, setStatus] = useState(
    () => localStorage.getItem("status") || null
  );
  const [userrole, setUserrole] = useState(
    () => localStorage.getItem("userrole") || null
  );

  const login = (token, type, userStatus,username,firstName,lastName) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userType", type);
    localStorage.setItem("status", userStatus);
    localStorage.setItem("username", username);
    localStorage.setItem("firstName",firstName);
    localStorage.setItem("lastName",lastName);

    setIsAuthenticated(true);
    setUserType(type);
    setStatus(userStatus);
    setUserrole(localStorage.getItem("userrole"));
  };

  const logout = (isExpired = false) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("rememberedEmailOrPhone");
    localStorage.removeItem("rememberedPassword");
    localStorage.removeItem("status");
    localStorage.removeItem("userrole");
    localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    
    setUserType(null);
    setStatus(null);
    setUserrole(null);
    setIsAuthenticated(false);

    if (isExpired) {
      toast.info("Session expired after 48 hours. Please log in again.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
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
        console.error("Error decoding token:", error);
        logout();
      }
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userType, status, userrole, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
