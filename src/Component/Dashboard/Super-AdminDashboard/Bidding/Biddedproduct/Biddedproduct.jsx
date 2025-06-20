import React from 'react';
import ProductBiddedAdmin from "./Biddedproductadmin"
import { useNavigate } from 'react-router-dom';



const BiddedProduct = () => {
const navigate = useNavigate();

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Bidded Product</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Bidded Product</li>
                        </ul>
                    </div>
                </div>
            </div>
            <ProductBiddedAdmin />
        </div>
    );
};

export default BiddedProduct;
