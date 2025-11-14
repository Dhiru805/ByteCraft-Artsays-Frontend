// // src/api/axiosConfig.js
// import Axios from "axios";
// import { toast } from "react-toastify"; // optional but cleaner UX

// const baseURL = process.env.REACT_APP_API_URL;
// console.log("Base URL:", baseURL);

// const axiosInstance = Axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Interceptor: Only logout when backend explicitly says user is suspended
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const res = error?.response?.data;
//     const status = error?.response?.status;

//       status === 403 &&
//       res?.suspended === true &&
//       typeof res?.message === "string" &&
//       res.message.toLowerCase().includes("suspend")
//     ) {
//       console.warn(" Suspended user detected. Logging out automatically.");

//       // Show a friendly toast or alert
//       toast.error(res.message || "Your account has been suspended.", {
//         autoClose: 3000,
//       });

//       //  Clear local/session storage
//       localStorage.clear();
//       sessionStorage.clear();

//       //  Redirect to login after short delay
//       setTimeout(() => {
//         window.location.href = "/login";
//       }, 1500);
//     }

//     // Return for normal error handling
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


// src/api/axiosConfig.js
import Axios from "axios";
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_API_URL;
console.log("Base URL:", baseURL);

const axiosInstance = Axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor: Logout only when backend explicitly says user is suspended
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error?.response?.data;
    const status = error?.response?.status;

    // ✅ FIXED: Missing "if (" previously broke the condition
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
