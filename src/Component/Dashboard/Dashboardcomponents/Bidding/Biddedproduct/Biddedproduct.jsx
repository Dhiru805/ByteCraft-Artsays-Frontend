import React from 'react';
import useUserType from '../../urlconfig';
import ProductBiddedAdmin from "./Biddedproductadmin"
import ProductBiddedBuyer from "./Biddedproductbuyer"


const BiddedProduct = () => {

const userType = useUserType();

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Bidded Product</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item">Bidded Product</li>
                        </ul>
                    </div>
                </div>
            </div>
            {userType === "Super-Admin" && (
            <ProductBiddedAdmin  />
            )}
           
            {userType === "Buyer" && (
              <ProductBiddedBuyer/>
            )}
           
        </div>
    );
};

export default BiddedProduct;
