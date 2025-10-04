import React from 'react';
import useUserType from '../../urlconfig';
import ProductPurchasedAdmin from "./ProductPurchasedAdmin"
import ProductPurchasedArtist from "./ProductPurchasedArtist"
import ProductPurchasedBuyer from "./ProductPurchasedBuyer"
import ProductPurchasedSeller from "./ProductPurchasedSeller"

const ProductRequest = () => {



    const userType = useUserType();






    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Product Purchased</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            <li className="breadcrumb-item">Product Purchased</li>
                        </ul>
                    </div>
                </div>
            </div>
            {userType === "Super-Admin" && (
            <ProductPurchasedAdmin />
            )}
            {userType === "Artist" && (
              <ProductPurchasedArtist/>
            )}
            {userType === "Buyer" && (
              <ProductPurchasedBuyer/>
            )}
            {userType === "Seller" && (
            <ProductPurchasedSeller/>
            )}
        </div>
    );
};

export default ProductRequest;
