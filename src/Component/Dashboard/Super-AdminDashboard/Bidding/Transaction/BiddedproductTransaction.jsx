import React from 'react';
import ProductBiddedAdminTransaction from "./BiddedproductadminTransaction"



const BiddedProductTransaction = () => {



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
            <ProductBiddedAdminTransaction/>
        </div>
    );
};

export default BiddedProductTransaction;
