
import axiosInstance from "./axiosConfig";

async function deleteAPI(url, config = {}, isPrivate = true) {
  try {
    let accessToken;
    if (isPrivate) {
      accessToken = localStorage.getItem("token");
    }

    // Only include headers and params
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...config.headers,
      },
    };

    if (config.params) {
      requestConfig.params = config.params;
    }

      const response = await axiosInstance.delete(url, requestConfig);

      return {
        message: response.data.message,
        hasError: response.data.hasError ?? (response.status !== 200),
        data: response.data,
      };
    } catch (error) {
      console.error("Error during API request:", error);
      const errData = error?.response?.data;
      if (errData) {
        return {
          message: errData.message || "Request failed.",
          hasError: true,
          data: errData,
        };
      }
      throw error;
    }
}

export default deleteAPI;
