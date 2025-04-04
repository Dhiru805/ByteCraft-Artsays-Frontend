import axiosInstance from "./axiosConfig";

async function getAPI(
  url,
  config = {},
  includeParams = false,
  isPrivate = true,
) {
  try {
    let accessToken;
    if (isPrivate) {
      accessToken = localStorage.getItem("token"); 
    }

    const requestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, 
      },
    };

  
    if (includeParams && config.params) {
      requestConfig.params = config.params; 
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
