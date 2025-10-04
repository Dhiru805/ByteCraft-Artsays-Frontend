import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import ProductPackagingTypeTable from "./ProductPackagingTypeTable";
import CreateProductPackagingTypeModal from "./CreateProductPackagingType";
import { useNavigate } from 'react-router-dom';

const ProductPackagingType = () => {
    const [productPackagingTypes, setProductPackagingTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchProductPackagingTypes = async () => {
        try {
            const response = await getAPI("/api/getproductpackagingtypes");
            setProductPackagingTypes(response.data);
        } catch (error) {
            console.error("Error fetching product packaging types:", error);
        }
    };
    
    useEffect(() => {
        fetchProductPackagingTypes();
    }, []);

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Product Packaging Type</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Product Packaging Type</li>
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
            <ProductPackagingTypeTable
                setProductPackagingTypes={setProductPackagingTypes}
                productPackagingTypes={productPackagingTypes}
                refreshProductPackagingTypes={fetchProductPackagingTypes}
            />
            {showModal && <CreateProductPackagingTypeModal onClose={() => setShowModal(false)} refreshProductPackagingTypes={fetchProductPackagingTypes} />}
        </div>
    );
};

export default ProductPackagingType;