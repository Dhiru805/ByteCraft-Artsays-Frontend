import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import ProductTypeTable from "./ProductTypeTable";
import CreateProductTypeModal from "./CreateProductType";
import { useNavigate } from 'react-router-dom';

const ProductType = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [productTypes, setProductTypes] = useState([]);
    
    const fetchProductTypes = async () => {
        try {
            const response = await getAPI("/api/getproducttype");
            setProductTypes(response.data);
        } catch (error) {
            console.error("Error fetching product types:", error);
        }
    };
    
    useEffect(() => {
        fetchProductTypes();
    }, []);

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Product Type</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Product Type</li>
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
            <ProductTypeTable
                setProductTypes={setProductTypes}
                productTypes={productTypes}
                refreshProductTypes={fetchProductTypes}
            />
            {showModal && <CreateProductTypeModal onClose={() => setShowModal(false)} refreshProductTypes={fetchProductTypes} />}
        </div>
    );
};

export default ProductType;