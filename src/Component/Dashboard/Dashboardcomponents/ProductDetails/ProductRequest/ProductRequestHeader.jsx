import React from "react";
import { useNavigate } from "react-router-dom";
import useUserType from '../../urlconfig';

const CustomorderHeader = () => {
     const navigate = useNavigate();
     const userType = useUserType(); 
    return (
        <>
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Product Request</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            {/* <li className="breadcrumb-item">App</li> */}
                            <li className="breadcrumb-item ">Product Request</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );

};
export default CustomorderHeader;
