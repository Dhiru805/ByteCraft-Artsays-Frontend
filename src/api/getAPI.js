import axiosInstance from "./axiosConfig";

async function getAPI(
  url,
  config = {},
  isPrivate = true,
  includeParams = false
) {
  try {
    let accessToken;
    if (isPrivate) {
      accessToken = localStorage.getItem("token"); // Get token from localStorage
    }

    const requestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Pass token in the Authorization header
      },
    };

    // Conditionally include query parameters
    if (includeParams && config.params) {
      requestConfig.params = config.params; // Only add params if includeParams is true and params are provided
    }

    const response = await axiosInstance.get(url, requestConfig);

    if (response.status === 200) {
      return {
        message: response.data.message,
        hasError: response.data.hasError,
        data: response.data,
      };
    }
  } catch (error) {
    console.error("Error during API request:", error);
    throw error;
  }
}

export default getAPI;
