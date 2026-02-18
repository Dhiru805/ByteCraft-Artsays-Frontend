// src/api/axiosConfig.js
import Axios from "axios";
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_API_URL;

const axiosInstance = Axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor: Logout only when backend explicitly says user is suspended or session is revoked
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error?.response?.data;
    const status = error?.response?.status;

    // ✅ Handle Session Revocation (Immediate Logout)
    if (status === 401 && res?.sessionRevoked === true) {
      console.warn("Session revoked. Logging out automatically.");
      
      toast.error(res.message || "Your session has been revoked. Please login again.", {
        autoClose: 3000,
      });

      localStorage.clear();
      sessionStorage.clear();

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
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
