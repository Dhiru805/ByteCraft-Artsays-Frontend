import React from 'react';
import useUserType from '../../urlconfig';
import ProductTransactionAdmin from "./Packagingtransactionadmin"
import ProductTransactionArtist from "./Packagingtransactionartist"
import ProductTransactionBuyer from "./Packagingtransactionbuyer"
import ProductTransactionSeller from "./Packagingtransactionseller"

const Transaction = () => {
const userType = useUserType();

return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Transaction</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item">Transaction</li>
                        </ul>
                    </div>
                </div>
            </div>
            {userType === "Super-Admin" && (
            <ProductTransactionAdmin />
            )}
            {userType === "Artist" && (
              <ProductTransactionArtist/>
            )}
            {userType === "Buyer" && (
              <ProductTransactionBuyer/>
            )}
            {userType === "Seller" && (
            <ProductTransactionSeller/>
            )}
        </div>
    );
};

export default Transaction;