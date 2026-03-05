// src/api/axiosConfig.js
import Axios from "axios";
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const apiBase = baseURL.endsWith("/api") ? baseURL : `${baseURL}/api`;

const axiosInstance = Axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest", // Simple CSRF defense
  },
});

// ✅ Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor: Logout only when backend explicitly says user is suspended or session is revoked
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const res = error?.response?.data;
    const status = error?.response?.status;

    // ✅ Handle Token Expiration (Attempt Refresh)
    if (status === 403 && res?.message === "Token expired" && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
          const refreshRes = await Axios.get(`${apiBase}/user/refresh`, {
            withCredentials: true,
            headers: { "X-Requested-With": "XMLHttpRequest" },
          });
        const { accessToken } = refreshRes.data;
        localStorage.setItem("token", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh token failed or expired — only redirect if not already on login
          if (!window.location.pathname.includes("/login")) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
    }

    // ✅ Handle Session Revocation (Immediate Logout)
    if (status === 401 && (res?.sessionRevoked === true || res?.message === "Unauthorized: No token provided")) {
      console.warn("Session revoked or unauthorized. Logging out automatically.");
      
      // If it's just missing token and we aren't on login page, redirect
      if (!window.location.pathname.includes("/login")) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // ✅ Handle User Suspension
    if (
      status === 403 &&
      res?.suspended === true &&
      typeof res?.message === "string" &&
      res.message.toLowerCase().includes("suspend")
    ) {
      console.warn("Suspended user detected. Logging out automatically.");

      toast.error(res.message || "Your account has been suspended.", {
        autoClose: 3000,
      });

      // Clear all caches
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
