import React from 'react';
import ProductBiddedAdminTransaction from "./BiddedproductadminTransaction"
import { useNavigate } from 'react-router-dom';




const BiddedProductTransaction = () => {

const navigate = useNavigate();


    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Transaction</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Transaction</li>
                        </ul>
                    </div>
                </div>
            </div>
            <ProductBiddedAdminTransaction />
        </div>
    );
};

export default BiddedProductTransaction;
