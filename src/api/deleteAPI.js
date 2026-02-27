
// import axiosInstance from "./axiosConfig";

// async function deleteAPI(url, config = {}, isPrivate = true) {
//   try {
//     let accessToken;
//     if (isPrivate) {
//       accessToken = localStorage.getItem("token");
//     }

//     // Only include headers and params
//     const requestConfig = {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         ...config.headers,
//       },
//     };

//     if (config.params) {
//       requestConfig.params = config.params;
//     }

//     const response = await axiosInstance.delete(url, requestConfig);

//     if (response.status === 200) {
//       return {
//         message: response.data.message,
//         hasError: response.data.hasError,
//         data: response.data,
//       };
//     }
//   } catch (error) {
//     console.error("Error during API request:", error);
//     throw error;
//   }
// }

// export default deleteAPI;

// src/api/deleteAPI.js
import axiosInstance from "./axiosConfig";

async function deleteAPI(url, isPrivate = true, customConfig = {}) {
  try {
    // Prepare headers - let axiosInstance interceptor handle the token
    const headers = {
      ...customConfig.headers,
    };

    // Prepare request config
    const requestConfig = {
      ...customConfig,
      headers,
    };

    // If there are params, add them to the config
    if (customConfig.params) {
      requestConfig.params = customConfig.params;
    }

    const response = await axiosInstance.delete(url, requestConfig);

    // Return consistent response format
    return {
      message: response.data?.message,
      hasError: response.data?.hasError,
      data: response.data,
    };
  } catch (error) {
    console.error("Error during DELETE API request:", error);
    // The interceptor will handle 401/403 errors, but we still need to throw
    // so the calling code knows there was an error
    throw error;
  }
}

export default deleteAPI;