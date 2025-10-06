import React from "react";
import { useNavigate } from "react-router-dom";
import useUserType from '../../urlconfig';
import AllProduct from "./SellerAllproduct";


function Product() {

  const navigate = useNavigate();
  const userType = useUserType();


  return (
    <>
      <div className="container-fluid">
        <div className="block-header">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h2>All Product</h2>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <span onClick={() => navigate('/seller/dashboard')} style={{ cursor: 'pointer' }}>
                    <i className="fa fa-dashboard"></i>
                  </span>
                </li>
                {/* <li className="breadcrumb-item">App</li> */}
                <li className="breadcrumb-item ">All Product</li>
              </ul>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="d-flex flex-row-reverse">
                <div className="page_action">
                  <button
                    type="button"
                    className="btn btn-secondary mr-2"
                    onClick={() => navigate(`/seller/SellerProductUpload`)}
                  >
                    <i className="fa fa-plus"></i> Add Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AllProduct />
      </div>
    </>
  )
};
export default Product;
