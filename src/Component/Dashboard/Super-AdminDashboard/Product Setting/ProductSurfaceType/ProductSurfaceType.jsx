import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import ProductSurfaceTypeTable from "./ProductSurfaceTypeTable";
import CreateProductSurfaceTypeModal from "./CreateProductSurfaceType";
import { useNavigate } from 'react-router-dom';

const ProductSurfaceType = () => {
    const [productSurfaceTypes, setProductSurfaceTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchProductSurfaceTypes = async () => {
        try {
            const response = await getAPI("/api/getproductsurfacetypes");
            setProductSurfaceTypes(response.data);
        } catch (error) {
            console.error("Error fetching product surface types:", error);
        }
    };
    
    useEffect(() => {
        fetchProductSurfaceTypes();
    }, []);

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Product Surface Type</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Product Surface Type</li>
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
            <ProductSurfaceTypeTable
                setProductSurfaceTypes={setProductSurfaceTypes}
                productSurfaceTypes={productSurfaceTypes}
                refreshProductSurfaceTypes={fetchProductSurfaceTypes}
            />
            {showModal && <CreateProductSurfaceTypeModal onClose={() => setShowModal(false)} refreshProductSurfaceTypes={fetchProductSurfaceTypes} />}
        </div>
    );
};

export default ProductSurfaceType;