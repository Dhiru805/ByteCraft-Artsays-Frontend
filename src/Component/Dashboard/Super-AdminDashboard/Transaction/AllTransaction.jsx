import React from 'react';
import AllTransactionadmin from "./Alltransactionadmin"
import AllTransactionartist from "./AllTransactionArtist"
import AllTransactionseller from "./AllTransactionSeller"


import useUserType from '../urlconfig';

const Transaction = () => {
    const userType = useUserType();

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2> Transaction</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item"> Transaction</li>
                        </ul>
                    </div>
                </div>
            </div>
            {userType === "Super-Admin" && <AllTransactionadmin />}
            {userType === "Artist" && <AllTransactionartist/>}
            {userType === "Seller" && <AllTransactionseller/>}
        </div>
    );
};

export default Transaction;