import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import ProductMaterialTable from "./ProductMaterialTable";
import CreateProductMaterialModal from "./CreateProductMaterial";
import { useNavigate } from 'react-router-dom';
import ProductRequestSkeleton from "../../../../Skeleton/artist/ProductRequestSkeleton";
const ProductMaterial = () => {
    const [productMaterials, setProductMaterials] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
const[loading,setLoading]=useState(true);
    const fetchProductMaterials = async () => {
        try {
            const response = await getAPI("/api/getproductmaterials");
            setProductMaterials(response.data);
        } catch (error) {
            console.error("Error fetching product materials:", error);
        }finally{
            setLoading(false)
        }
    };
    
    useEffect(() => {
        fetchProductMaterials();
    }, []);

    if(loading)return <ProductRequestSkeleton/>
    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Product Material</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                                    <i className="fa fa-dashboard"></i>
                                </span>
                            </li>
                            <li className="breadcrumb-item">Product Material</li>
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
            <ProductMaterialTable
                setProductMaterials={setProductMaterials}
                productMaterials={productMaterials}
                refreshProductMaterials={fetchProductMaterials}
            />
            {showModal && <CreateProductMaterialModal onClose={() => setShowModal(false)} refreshProductMaterials={fetchProductMaterials} />}
        </div>
    );
};

export default ProductMaterial;