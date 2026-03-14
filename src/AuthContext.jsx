// src/AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import Axios from "./api/axiosConfig";

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

  // Refresh lock — prevents simultaneous refresh calls
  const isRefreshingRef = useRef(false);
  // Timer ref — so we can always clear the previous timer before setting a new one
  const refreshTimerRef = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
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

  const refreshToken = useCallback(async () => {
    // Prevent double refresh calls
    if (isRefreshingRef.current) return null;
    isRefreshingRef.current = true;

    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const refreshRes = await Axios.post(
        `${apiBase}/user/refresh`,
        storedRefreshToken ? { refreshToken: storedRefreshToken } : {},
        { withCredentials: true, headers: { "X-Requested-With": "XMLHttpRequest" } }
      );
      const { accessToken, refreshToken: newRefreshToken } = refreshRes.data;
      localStorage.setItem("token", accessToken);
      if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);

      // DO NOT call setIsAuthenticated(true) here — it would re-trigger the useEffect timer
      // Schedule next refresh based on the new token
      scheduleTokenRefresh(accessToken);

      return accessToken;
    } catch (error) {
      console.error("Failed to refresh token", error?.response?.data || error?.message || error);
      logout();
      return null;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [logout]);

  // Schedules (or re-schedules) the silent refresh timer for a given token
  const scheduleTokenRefresh = useCallback((token) => {
    // Always clear any existing timer first
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const expiresIn = decoded.exp - currentTime;

      if (expiresIn <= 0) {
        // Token already expired — refresh immediately
        refreshToken();
        return;
      }

      // Refresh 60s before expiry, minimum 0ms delay
      const delay = Math.max((expiresIn - 60) * 1000, 0);
      refreshTimerRef.current = setTimeout(() => {
        refreshToken();
      }, delay);
    } catch (error) {
      console.error("Error decoding token:", error);
      logout();
    }
  }, [refreshToken, logout]);

  // Run once on mount — set up timer based on whatever token is in storage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      scheduleTokenRefresh(token);
    }

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []); // ← empty deps: runs only once on mount, never re-triggered by state changes

  const login = (token, type, userStatus, username, firstName, lastName, userId, userrole, refreshTokenValue) => {
    localStorage.setItem("token", token);
    if (refreshTokenValue) localStorage.setItem("refreshToken", refreshTokenValue);
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

    // Schedule refresh timer for the new token
    scheduleTokenRefresh(token);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userType, status, userrole, userId, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
