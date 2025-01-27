import React from "react";
import { useNavigate } from "react-router-dom";

const CustomorderHeader = () => {
     const navigate = useNavigate();
    return (
        <>
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>Buyer Custom Request</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="index.html">
                                    <i className="fa fa-dashboard"></i>
                                </a>
                            </li>
                            {/* <li className="breadcrumb-item">App</li> */}
                            <li className="breadcrumb-item ">Buyer Custom Request</li>
                        </ul>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="d-flex flex-row-reverse">
                            <div className="page_action">
                                <button
                                    type="button"
                                    className="btn btn-secondary mr-2"
                                    onClick={() => navigate("/Dashboard/BuyerCustomrequest/CreateCustomrequest")}
                                >
                                    <i className="fa fa-plus"></i> Add Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};
export default CustomorderHeader;
