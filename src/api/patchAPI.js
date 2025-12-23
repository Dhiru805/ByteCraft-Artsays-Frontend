import axiosInstance from "./axiosConfig";

async function patchAPI(
  url,
  data = {},
  isPrivate = true
) {
  try {
    let accessToken;
    if (isPrivate) {
      accessToken = localStorage.getItem("token");
    }

    const response = await axiosInstance.patch(
      url,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      return {
        message: response.data.message,
        hasError: response.data.hasError,
        data: response.data,
      };
    }
  } catch (error) {
    console.error("Error during PATCH request:", error);
    throw error;
  }
}

export default patchAPI;
