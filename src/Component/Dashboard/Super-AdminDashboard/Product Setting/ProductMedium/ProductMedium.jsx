import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import ProductMediumTable from "./ProductMediumTable";
import CreateProductMediumModal from "./CreateProductMedium";
import { useNavigate } from "react-router-dom";
import ProductRequestSkeleton from "../../../../Skeleton/artist/ProductRequestSkeleton";

const ProductMedium = () => {
  const [productMedia, setProductMedia] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const fetchProductMedia = async () => {
    try {
      const response = await getAPI("/api/getproductmedium");
      setProductMedia(response.data);
    } catch (error) {
      console.error("Error fetching product media:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductMedia();
  }, []);

  if(loading)return <ProductRequestSkeleton/>
  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Product Medium</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/super-admin/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Product Medium</li>
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
      <ProductMediumTable
        setProductMedia={setProductMedia}
        productMedia={productMedia}
        refreshProductMedia={fetchProductMedia}
      />
      {showModal && (
        <CreateProductMediumModal
          onClose={() => setShowModal(false)}
          refreshProductMedia={fetchProductMedia}
        />
      )}
    </div>
  );
};

export default ProductMedium;
