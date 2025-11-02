import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import ProductCouponCodeTable from "./ProductCouponCodeTable";
import CreateProductCouponCodeModal from "./CreateProductCouponCode";
import { useNavigate } from 'react-router-dom';

const ProductCouponCode = () => {
    const [productCouponCodes, setProductCouponCodes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchProductCouponCodes = async () => {
        try {
            const response = await getAPI("/api/getproductcouponcodes");
            setProductCouponCodes(response.data);
        } catch (error) {
            console.error("Error fetching product coupon codes:", error);
        }
    };
    
    useEffect(() => {
        fetchProductCouponCodes();
    }, []);

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Product Coupon Code</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Product Coupon Code</li>
                        </ul>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="d-flex flex-row-reverse">
                            <div className="page_action">
                                <button
                                    type="button"
                                    className="btn btn-secondary mr-2"
                                    onClick={() => setShowModal(true)}
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ProductCouponCodeTable
                setProductCouponCodes={setProductCouponCodes}
                productCouponCodes={productCouponCodes}
                refreshProductCouponCodes={fetchProductCouponCodes}
            />
            {showModal && <CreateProductCouponCodeModal onClose={() => setShowModal(false)} refreshProductCouponCodes={fetchProductCouponCodes} />}
        </div>
    );
};

export default ProductCouponCode;