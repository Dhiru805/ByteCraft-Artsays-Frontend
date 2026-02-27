import putAPI from "../../../../../../api/putAPI";

const updateBuyerStatus = async (requestId) => {
  try {
    const response = await putAPI(
      `/api/updateArtistCustomRequestStatus/${requestId}`,
      {},
      {},
      true
    );

    console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};

export default updateBuyerStatus;
