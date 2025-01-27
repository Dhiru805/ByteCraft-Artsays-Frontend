import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

function ViewBuyerRequest() {
    const { id } = useParams();
    const location = useLocation();
    const { state } = location || {};
    const { request } = state || {};

    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [imageName, setImageName] = useState('');

    useEffect(() => {
        if (request) {
            setProductName(request.ProductName || '');
            setDescription(request.Description || '');
            if (request.BuyerImage) {
                setImageName(request.BuyerImage);
            }
        }
    }, [request]);

    // useEffect(() => {
    //     // Apply inline styles to .ql-container and .ql-editor
    //     const quillContainer = document.querySelector('.ql-container');
    //     const quillEditor = document.querySelector('.ql-editor');

    //     if (quillContainer && quillEditor) {
    //       quillContainer.style.border = 'none';
    //       quillContainer.style.background = 'none';
    //       quillContainer.style.padding = '0';
    //       quillContainer.style.margin = '0';

    //       quillEditor.style.padding = '0';
    //       quillEditor.style.minHeight = '0';
    //     }
    //   }, []);


    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>View Buyer Custom Request</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/"><i className="fa fa-dashboard"></i></a>
                            </li>
                            <li className="breadcrumb-item active">
                                <Link to="/Dashboard/BuyerCustomrequest">Buyer Custom Request</Link>
                            </li>
                            <li className="breadcrumb-item">View Custom Request</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="body">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={productName}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label> Image</label>
                                {imageName && (
                                    <div className="mt-2" style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
                                        <img
                                            src={`http://localhost:3001/${imageName}`}
                                            alt="Buyer Image"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="form-group mt-3">
                                <label>Description </label>
                                <div className="form-group mt-3">
                                    <ReactQuill
                                        value={description}
                                        readOnly={true}
                                        theme="snow"
                                        modules={{ toolbar: false }}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewBuyerRequest;
