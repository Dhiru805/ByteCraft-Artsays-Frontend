// src/AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import Axios from "axios";

const AuthContext = createContext();

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const apiBase = baseURL.endsWith("/api") ? baseURL : `${baseURL}/api`;

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
  const [userId, setUserId] = useState(
    () => localStorage.getItem("userId") || null
  );

  const refreshToken = useCallback(async () => {
    try {
        const refreshRes = await Axios.get(`${apiBase}/user/refresh`, {
          withCredentials: true,
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });
      const { accessToken } = refreshRes.data;
      localStorage.setItem("token", accessToken);
      setIsAuthenticated(true);
      return accessToken;
    } catch (error) {
      console.error("Failed to refresh token", error);
      logout();
      return null;
    }
  }, []);

  const login = (token, type, userStatus, username, firstName, lastName, userId, userrole) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userType", type);
    localStorage.setItem("status", userStatus);
    localStorage.setItem("username", username);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userrole", userrole);

    setIsAuthenticated(true);
    setUserType(type);
    setStatus(userStatus);
    setUserrole(userrole);
    setUserId(userId);
  };

  const logout = useCallback(async () => {
    try {
      // Call backend logout
      const token = localStorage.getItem("token");
      if (token) {
          await Axios.post(`${apiBase}/user/logout`, {}, {
            headers: { Authorization: `Bearer ${token}`, "X-Requested-With": "XMLHttpRequest" },
            withCredentials: true
          });
      }
    } catch (e) {
      console.warn("Backend logout failed", e);
    }

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
    setUserId(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const expiresIn = decoded.exp - currentTime;

        if (expiresIn <= 0) {
          refreshToken(); // Try to refresh instead of logout
          return;
        }

        // Set timer to refresh 1 minute before expiration
        const timer = setTimeout(() => {
          refreshToken();
        }, (expiresIn - 60) * 1000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    } else {
      // If no token but we might have a refresh cookie
      // We could try to refresh once here
      refreshToken();
    }
  }, [isAuthenticated, refreshToken]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userType, status, userrole, userId, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
