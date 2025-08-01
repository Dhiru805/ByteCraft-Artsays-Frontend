import React, { useEffect, useState } from "react";
import CustomorderHeader from "./CustomorderHeader";
import CustomOrderRequestArtist from "../Artist/BuyerRequestTable";
import getAPI from "../../../../../../api/getAPI";
import { useConfirm } from '../../../../StatusConfirm';
import { toast } from 'react-toastify';
import putAPI from '../../../../../../api/putAPI';


const Customorder = () => {

    const confirm = useConfirm();

    //Buyer
    const [buyerRequests, setBuyerRequests] = useState([]);
    const fetchBuyerRequests = async () => {
        try {
            const response = await getAPI("/api/get-buyer-request");
            const buyerRequestsData = response.data.buyerRequests;
            setBuyerRequests(buyerRequestsData);
        } catch (error) {
            console.error("Error fetching buyer requests:", error);
        }
    };

    useEffect(() => {
        fetchBuyerRequests();
    }, []);

    //Artist

    const [buyerRequestsdata, setBuyerRequestsdata] = useState([]);

    const fetchBuyerRequestsdata = async () => {
        try {
            const response = await getAPI("/api/get-buyer-request-data");
            const buyerRequestsData = response.data.buyerRequests;
            setBuyerRequestsdata(buyerRequestsData);
        } catch (error) {
            console.error("Error fetching buyer requests:", error);
        }
    };

    useEffect(() => {
        fetchBuyerRequestsdata();
    }, []);

    //Super Admin

    const [buyerRequestsAdmin, setBuyerRequestsAdmin] = useState([]);
    const fetchBuyerRequestsAdmin = async () => {
        try {
            const response = await getAPI("/api/get-data-admin");
            const buyerRequestsData = response.data.buyerRequests;
            setBuyerRequestsAdmin(buyerRequestsData);
        } catch (error) {
            console.error("Error fetching buyer requests:", error);
        }
    };

    useEffect(() => {
        fetchBuyerRequestsAdmin();
    }, []);


    //Artist And Super Admin

    const updateBuyerRequestStatus = async (requestId, status) => {
        try {
            await putAPI(
                `/api/update-request-status/${requestId}`,
                { requestStatus: status },
                {},
                true
            );
            fetchBuyerRequests();
            fetchBuyerRequestsdata();
            fetchBuyerRequestsAdmin();

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
            <CustomorderHeader />
            <CustomOrderRequestArtist
                buyerRequests={buyerRequestsdata}
                handleRejectBuyerRequest={handleRejectBuyerRequest}
                updateBuyerRequestStatus={updateBuyerRequestStatus}
                setBuyerRequests={setBuyerRequestsdata}
            />
        </>
    );
};

export default Customorder;
