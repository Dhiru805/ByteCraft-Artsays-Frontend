import React, { useEffect, useState } from "react";
import CustomorderHeader from "./CustomorderHeader";
import CustomOrderTable from "./CustomOrderTable";
import getAPI from "../../../../../api/getAPI";


const Customorder = () => {
    const [buyerRequests, setBuyerRequests] = useState([]);
   
    const fetchBuyerRequests = async () => {
        try {
            const response = await getAPI("http://localhost:3001/api/get-buyer-request");
            const buyerRequestsData = response.data.buyerRequests;
            setBuyerRequests(buyerRequestsData);
        } catch (error) {
            console.error("Error fetching buyer requests:", error);
        }
    };

    useEffect(() => {
        fetchBuyerRequests();
    }, []);

    return (
        <>
            <CustomorderHeader />
            <CustomOrderTable buyerRequests={buyerRequests} setBuyerRequests={setBuyerRequests} />
        </>
    );
};

export default Customorder;
