import axiosInstance from "./axiosConfig";

async function putAPI(url, payload, config = {}, isPrivate = true) {
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

    const response = await axiosInstance.put(url, payload, requestConfig);

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

export default putAPI;
