// src/api/axiosConfig.js
import Axios from "axios";
import { toast } from "react-toastify";
import { doRefresh, getState, SESSION_STATE } from "../auth/SessionOrchestrator";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const axiosInstance = Axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Request Interceptor: attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const res    = error?.response?.data;
    const status = error?.response?.status;

    // Never intercept calls to the refresh endpoint itself
    const isRefreshCall = originalRequest?.url?.includes("/user/refresh");

    // ── Token expired on a protected route → refresh and retry ───────────────
    const sessionState = getState();
    const sessionDead  =
      sessionState === SESSION_STATE.REAUTH_REQUIRED ||
      sessionState === SESSION_STATE.LOGGED_OUT;

    if (
      status === 403 &&
      (res?.message === "Token expired" || res?.message === "Invalid token") &&
      !originalRequest._retry &&
      !isRefreshCall &&
      !sessionDead
    ) {
      originalRequest._retry = true;
      try {
        const accessToken = await doRefresh();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        // doRefresh() already updated session state. Just reject.
        return Promise.reject(error);
      }
    }

    // ── Session revoked (403 REVOKED_SESSION) ───────────────────────────────
    if (status === 403 && res?.errorCode === "REVOKED_SESSION" && !isRefreshCall) {
      return Promise.reject(error);
    }

      // ── Account suspended ─────────────────────────────────────────────────────
    if (
      status === 403 &&
      res?.suspended === true &&
      typeof res?.message === "string" &&
      res.message.toLowerCase().includes("suspend")
    ) {
      toast.error(res.message || "Your account has been suspended.", { autoClose: 3000 });
      localStorage.clear();
      sessionStorage.clear();
      setTimeout(() => { window.location.href = "/login"; }, 1500);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
