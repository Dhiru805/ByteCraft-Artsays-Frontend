import React, { useEffect, useState } from "react";
import BuyerrequestHeader from "./BuyerRequestHeader";
import BuyerManageTable from "./BuyerRequestTable";
import getAPI from "../../../../../api/getAPI";
import { useConfirm } from '../../StatusConfirm';
import { toast } from 'react-toastify';
import putAPI from '../../../../../api/putAPI';

const BuyerRequest = () => { 
    const [buyerRequests, setBuyerRequests] = useState([]);
    const confirm = useConfirm();

    const fetchBuyerRequests = async () => {
        try {
            const response = await getAPI("http://localhost:3001/api/get-buyer-request-data");
            const buyerRequestsData = response.data.buyerRequests;
            setBuyerRequests(buyerRequestsData);
        } catch (error) {
            console.error("Error fetching buyer requests:", error);
        }
    };

    useEffect(() => {
        fetchBuyerRequests();
    }, []);

    const updateBuyerRequestStatus = async (requestId, status) => {
        try {
            await putAPI(
                `http://localhost:3001/api/update-request-status/${requestId}`,
                { requestStatus: status },
                {},
                true
            );
            setBuyerRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request._id === requestId ? { ...request, RequestStatus: status } : request
                )
            );
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
            <BuyerrequestHeader />
            <BuyerManageTable 
                buyerRequests={buyerRequests}
                handleRejectBuyerRequest={handleRejectBuyerRequest} 
                updateBuyerRequestStatus={updateBuyerRequestStatus}
                setBuyerRequests={setBuyerRequests} 
            />
        </>
    );
};

export default BuyerRequest;
