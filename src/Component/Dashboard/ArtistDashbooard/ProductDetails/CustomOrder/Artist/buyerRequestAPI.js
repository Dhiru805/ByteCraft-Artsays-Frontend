import putAPI from "../../../../../../api/putAPI";

const updateBuyerStatus = async (requestId, buyerStatus, requestStatus) => {
  try {
    const payload = { BuyerStatus: buyerStatus, RequestStatus: requestStatus };
    const response = await putAPI(
      `/api/buyer-request-buyer-status/${requestId}`,
      payload,
      {},
      true
    );
    console.log('API Response:', response);
    return response;
  } catch (error) {
    console.error('Error updating buyer status:', error);
    throw error;
  }
};

export default updateBuyerStatus;