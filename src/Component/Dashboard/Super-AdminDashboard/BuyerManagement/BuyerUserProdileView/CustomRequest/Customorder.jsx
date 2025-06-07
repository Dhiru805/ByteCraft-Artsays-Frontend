import React, { useEffect, useState } from "react";
import BuyerRequestToArtistTable from "./BuyerRequestToArtistTable"
import getAPI from "../../../../../../api/getAPI";
import { useConfirm } from '../../../../StatusConfirm';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../api/putAPI';


const Customorder = ({userId}) => {
    const confirm = useConfirm();

    const [buyerRequestsAdmin, setBuyerRequestsAdmin] = useState([]);
    const fetchBuyerRequestsAdmin = async () => {
        try {
            const response = await getAPI(`/api/get-data-adminbyid/${userId}`);
            const buyerRequestsData = response.data.buyerRequests;
            setBuyerRequestsAdmin(buyerRequestsData);
        } catch (error) {
            console.error("Error fetching buyer requests:", error);
        }
    };

    useEffect(() => {
        fetchBuyerRequestsAdmin();
    }, []);




    const updateBuyerRequestStatus = async (requestId, status) => {
        try {
            await putAPI(
                `/api/update-request-status/${requestId}`,
                { requestStatus: status },
                {},
                true
            );
          
            fetchBuyerRequestsAdmin();
            
            if (status === 'Approved') {
                toast.success('Buyer Request is Approved');
            } else if (status === 'Rejected') {
                toast.error('Buyer Request is Rejected');
            }
        } catch (error) {
            console.error("Error updating buyer request status:", error);
        }
    };

    const handleRejectBuyerRequest = (requestId) => {
        confirm(() => updateBuyerRequestStatus(requestId, 'Rejected'), "Are you sure you want to reject this buyer request?");
    };



    return (
        <>
          
                <BuyerRequestToArtistTable
                    handleRejectBuyerRequest={handleRejectBuyerRequest}
                    updateBuyerRequestStatus={updateBuyerRequestStatus}
                    buyerRequests={buyerRequestsAdmin}
                    setBuyerRequests={setBuyerRequestsAdmin}
                    userId={userId} />
        </>
    );
};

export default Customorder;
