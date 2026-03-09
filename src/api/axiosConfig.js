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

// ─── Global refresh lock ───────────────────────────────────────────────────
// If multiple requests fail with 403 at the same time, only ONE refresh call
// is made. All queued requests wait for that single promise to resolve.
let refreshPromise = null;

const doRefresh = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const refreshRes = await Axios.post(
        `${apiBase}/user/refresh`,
        storedRefreshToken ? { refreshToken: storedRefreshToken } : {},
        {
          withCredentials: true,
          headers: { "X-Requested-With": "XMLHttpRequest" },
        }
      );
      const { accessToken, refreshToken: newRefreshToken } = refreshRes.data;
      localStorage.setItem("token", accessToken);
      if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
      return accessToken;
    } finally {
      // Always clear the lock so future refreshes can run
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
// ──────────────────────────────────────────────────────────────────────────

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

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const res = error?.response?.data;
    const status = error?.response?.status;

    // ✅ Handle Token Expiration — one shared refresh, then retry
    if (status === 403 && res?.message === "Token expired" && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = await doRefresh();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (!window.location.pathname.includes("/login")) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // ✅ Handle Session Revocation
    if (
      status === 401 &&
      (res?.sessionRevoked === true || res?.message === "Unauthorized: No token provided")
    ) {
      const hasToken = !!localStorage.getItem("token");
      if (hasToken && !window.location.pathname.includes("/login")) {
        console.warn("Session revoked or unauthorized. Logging out automatically.");
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
      toast.error(res.message || "Your account has been suspended.", { autoClose: 3000 });
      localStorage.clear();
      sessionStorage.clear();
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
