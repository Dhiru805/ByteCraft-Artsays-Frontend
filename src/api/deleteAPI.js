import axiosInstance from "./axiosConfig";

async function deleteAPI(url, config = {}, isPrivate = true) {
  try {
    let accessToken;
    if (isPrivate) {
      accessToken = localStorage.getItem("token");
    }

    const requestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...config.headers,
      },
    };

    if (config.params) {
      requestConfig.params = config.params;
    }

    const response = await axiosInstance.delete(url, requestConfig);

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

export default deleteAPI;
