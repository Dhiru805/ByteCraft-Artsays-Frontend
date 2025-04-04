import React, { useEffect, useState } from "react";
import ProductRequestHeader from "./ProductRequestHeader";
import ProductRequestArtistTable from "./ProductRequestArtist/ProductRequestTable";
import ProductRequestBuyerTable from "./ProductRequestBuyer/ProductRequestTable";
import ProductRequestSellerTable from "./ProductRequestSeller/ProductRequestTable"
// import getAPI from "../../../../../../api/getAPI";
import useUserType from '../../urlconfig';
import { useConfirm } from '../../StatusConfirm';
// import { toast } from 'react-toastify';
// import putAPI from '../../../../../../api/putAPI';


const Customorder = () => {

    const userType = useUserType();
    const confirm = useConfirm();




    return (
        <>
            <ProductRequestHeader />

            {userType === "Artist" && (
                <ProductRequestArtistTable />
            )}

            {userType === "Buyer" && (
                <ProductRequestBuyerTable />
            )}

            {userType === "Seller" && (
                <ProductRequestSellerTable />
            )}



        </>
    );
};

export default Customorder;
