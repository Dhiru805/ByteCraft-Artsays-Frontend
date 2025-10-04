import React from "react";
// import { useNavigate } from "react-router-dom"; 
// import useUserType from '../urlconfig';
import AllProduct from "./Allproduct";


function Product() {
 
  // const navigate = useNavigate();
  // const userType = useUserType(); 


  return (
    <>
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>All Resell Product</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              {/* <li className="breadcrumb-item">App</li> */}
              <li className="breadcrumb-item ">All Resell Product</li>
            </ul>
          </div>
        </div>
      </div>
      <AllProduct/>
      </div>
      </>
      )};
export default Product;
