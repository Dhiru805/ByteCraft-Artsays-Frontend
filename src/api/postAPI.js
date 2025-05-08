import axiosInstance from "./axiosConfig";

async function postAPI(url, payload, config = {},isPrivate = true,) {
  try {
    let accessToken;
    if (isPrivate) {
      accessToken = localStorage.getItem("token");
    }

    const requestConfig = {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        ...(payload instanceof FormData
          ? { "Content-Type": "multipart/form-data" } 
          : { "Content-Type": "application/json" }),
        ...config.headers,
      },
      validateStatus: function (status) {
        return status >= 200 && status < 300;
      },
    };

    const response = await axiosInstance.post(url, payload, requestConfig);

   
      return {
        message: response.data.message,
        hasError: response.data.hasError,
        data: response.data,
      };
  
  } catch (error) {
    console.error("Error during API request:", error);
    throw error;
  }
}

export default postAPI;



