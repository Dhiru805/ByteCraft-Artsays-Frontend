import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import axios from 'axios';
import useUserType from '../../../urlconfig';
import Switch from "react-switch";

function ViewBuyerRequest() {
    const location = useLocation();
    const userType = useUserType();
    const { state } = location || {};
    const { request } = state || {};

    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [buyerId, setBuyerId] = useState('');
    const [artists, setArtists] = useState([]);
    const [image, setImage] = useState('');

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/artist/artists`);
                setArtists(response.data);
            } catch (error) {
                console.error("Error fetching artists:", error);
            }
        };
        fetchArtists();

        if (request) {
            setProductName(request.ProductName || '');
            setDescription(request.Description || '');
            setBudget(request.Budget || '');
            setImage(request.BuyerImage ? `${process.env.REACT_APP_API_URL}/${request.BuyerImage}` : '');
            setBuyerId(`${request.Buyer.id.name} ${request.Buyer.id.lastName}`);
        }
    }, [request]);

    return (
        <div className="container-fluid">
            <div className="block-header">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <h2>View Custom Request</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/"><i className="fa fa-dashboard"></i></a>
                            </li>
                            <li className="breadcrumb-item active">
                                <Link to={`/${userType}/Dashboard/customrequest`}>Custom Request</Link>
                            </li>
                            <li className="breadcrumb-item">View custom Request</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="body">
                            <div className="row d-flex align-items-stretch">

                                <div className="col-md-12 d-flex align-items-center" style={{ paddingBottom: '20px' }}>
                                    <div className="media-left m-r-20" style={{ width: '140px', height: '140px', overflow: 'hidden' }}>
                                        {image ? (
                                            <img
                                                src={image}
                                                alt="Buyer"
                                                className="img-fluid rounded shadow w-100"
                                                style={{ height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <p className="align-self-center"></p>
                                        )}
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Product Name</label>
                                                    <input type="text" className="form-control" value={productName} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Buyer</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={buyerId}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Min Budget</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={request?.MinBudget}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Max Budget</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={request?.MaxBudget}
                                                        readOnly
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1 mx-3">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Art Type</label>
                                                <input type="text" className="form-control" value={request?.ArtType} readOnly />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Size</label>
                                                <input type="text" className="form-control" value={request?.Size} readOnly />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Colour Preferences</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={request?.ColourPreferences
                                                        .map(color => color.charAt(0).toUpperCase() + color.slice(1).toLowerCase())
                                                        .join(', ')}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mt-4 d-flex align-items-center gap-2">
                                                <label className="ms-2">Frame Required</label>
                                                <div className="mx-4">
                                                    <Switch
                                                        onColor="#007bff"
                                                        offColor="#ccc"
                                                        uncheckedIcon={false}
                                                        checkedIcon={false}
                                                        height={19}
                                                        width={36}
                                                        handleDiameter={12}
                                                        checked={request?.IsFramed || false}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Payment Term</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={request?.PaymentTerm}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Expected Deadline</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={request?.ExpectedDeadline}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                <div className="form-group mt-3">
                                        <label>Comments With Refrence</label>
                                        <textarea
                                            id="comments"
                                            value={request?.Comments}
                                            className="form-control"
                                            placeholder="Any other details or references you'd like to include"
                                            rows="3"
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label>Description</label>
                                        <ReactQuill value={description} readOnly theme="snow" modules={{ toolbar: false }} />
                                    </div>

                                    {request?.NegiotaiteBudget || request?.BuyerNotes ? <hr /> : null}

                                    {request?.NegiotaiteBudget && request?.BuyerNotes && (
                                        <label className="mt-3 d-block">Negotiation By Buyer</label>
                                    )}

                                    {request?.NegiotaiteBudget && (
                                        <div className="form-group mt-3">
                                            <label>Negotiate Budget</label>
                                            <input type="text" className="form-control" value={request.NegiotaiteBudget} readOnly />
                                        </div>
                                    )}

                                    {request?.Notes && (
                                        <div className="form-group mt-3">
                                            <label>Notes</label>
                                            <textarea className="form-control" value={request.BuyerNotes} readOnly />
                                        </div>
                                    )}
                                      {request?.rejectedcomment && (
                                        <div className="form-group mt-3">
                                            <label>Rejected Comment</label>
                                            <textarea className="form-control" value={request.rejectedcomment} readOnly />
                                        </div>
                                    )}
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
