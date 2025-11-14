import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import useUserType from '../../../../urlconfig';
import getAPI from "../../../../../../api/getAPI";


function ViewBuyerRequest() {
    const location = useLocation();
    const userType = useUserType();
    const { state } = location || {};
    const { request } = state || {};
    
    const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE;

    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [buyerId, setBuyerId] = useState('');
    const [artists, setArtists] = useState([]);
    const [image, setImage] = useState('');
    const [currentImages, setCurrentImages] = useState();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [localRequest, setLocalRequest] = useState(request);
    const [buyerAddress, setBuyerAddress] = useState('');


    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await getAPI("/api/artist/artists");
                setArtists(response.data);
            } catch (error) {
                console.error("Error fetching artists:", error);
            }
        };
        fetchArtists();

        if (request) {
            console.log("Incoming Request:", request);
            setLocalRequest(request);
            setProductName(request.ProductName || '');
            setDescription(request.Description || '');
            setBudget(request.Budget || '');
            setImage(request.BuyerImage ? `${BASE_URL}/${request.BuyerImage}` : '');
            setBuyerId(`${request.Buyer.id.name} ${request.Buyer.id.lastName}`);
            setBuyerAddress(request.Buyer.id.address || '');
        }
    }, [request]);

    const handleImageClick = (product) => {
        const images = [product.BuyerImage];
        setCurrentImages(images);
        setCurrentImageIndex(0);
        setShowPopup(true);
    };

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
                                            // <img
                                            //     src={image}
                                            //     alt="Buyer"
                                            //     className="img-fluid rounded shadow w-100"
                                            //     style={{ height: '100%', objectFit: 'cover' }}
                                            // />
                                            <img
                                                src={`${BASE_URL}/${localRequest?.BuyerImage?.replace(/\\/g, '/')}`}
                                                alt="Buyer"
                                                className="img-fluid rounded shadow w-100"
                                                onClick={() => handleImageClick(localRequest)}
                                                style={{ height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <p className="align-self-center"></p>
                                        )}

                                        {
                                            showPopup && (
                                                <div
                                                    onClick={() => setShowPopup(false)}
                                                    style={{
                                                        position: 'fixed',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        zIndex: 1000,
                                                    }}
                                                >
                                                    <div
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            position: 'relative',
                                                            height: '50%',
                                                            backgroundColor: '#111',
                                                            borderRadius: '12px',
                                                            boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {/* Image */}
                                                        <img
                                                            src={`${BASE_URL}/${currentImages[currentImageIndex]?.replace(/\\/g, '/')}`}
                                                            alt="Popup"
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                borderRadius: '12px',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
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
                                                <label>Address Line 1</label>
                                                <input type="text" className="form-control" value={request?.BuyerSelectedAddress?.line1 || ''} readOnly />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Address Line 2</label>
                                                <input type="text" className="form-control" value={request?.BuyerSelectedAddress?.line2 || ''} readOnly />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Landmark</label>
                                                <input type="text" className="form-control" value={request?.BuyerSelectedAddress?.landmark || ''} readOnly />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>City</label>
                                                <input type="text" className="form-control" value={request?.BuyerSelectedAddress?.city || ''} readOnly />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>State</label>
                                                <input type="text" className="form-control" value={request?.BuyerSelectedAddress?.state || ''} readOnly />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Country</label>
                                                <input type="text" className="form-control" value={request?.BuyerSelectedAddress?.country || ''} readOnly />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Pincode</label>
                                                <input type="text" className="form-control" value={request?.BuyerSelectedAddress?.pincode || ''} readOnly />
                                            </div>
                                        </div>
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
                                            <div className="form-group mt-4 d-flex align-items-center gap-2">
                                                <label className="ms-2">{request?.IsFramed ? "Frame required" : "Frame not required"}</label>
                                                {/* <div className="mx-4">
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
                                                </div> */}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>Expected Deadline (in days)</label>
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

                                    {request?.BuyerNegotiatedBudgets || request?.BuyerNotes ? <hr /> : null}

                                    <div className="row">
                                        {request?.ArtistNegotiatedBudgets?.length > 0 && (
                                            <div className="col-md-6">
                                                <label className="form-label">Artist Negotiated Budget History</label>
                                                <div className="form-group">
                                                    <div className="row font-weight-bold mb-2">
                                                        <div className="col-md-6">Negotiation</div>
                                                        <div className="col-md-6">Estimated Creation Days</div>
                                                    </div>
                                                    {request.ArtistNegotiatedBudgets.map((budget, index) => {
                                                        const position = ["1st", "2nd", "3rd"];
                                                        const label = position[index] || `${index + 1}th`;
                                                        const estimatedCreationDays = request.ArtistEstimatedCreationDaysHistory[index];

                                                        return (
                                                            <div key={index} className="row mb-2">
                                                                <div className="col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={`${label} Negotiation: ₹${budget}`}
                                                                        readOnly
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={`${estimatedCreationDays || "N/A"} Days`}
                                                                        readOnly
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                        )}

                                        {request?.BuyerNegotiatedBudgets?.length > 0 && (
                                            <div className="col-md-6">
                                                <label className="form-label">Buyer Negotiated Budget History</label>
                                                <div className="form-group">
                                                    <div className="row font-weight-bold mb-2">
                                                        <div className="col-md-6">Negotiation</div>
                                                        <div className="col-md-6">Estimated Creation Days</div>
                                                    </div>
                                                    {request.BuyerNegotiatedBudgets.map((budget, index) => {
                                                        const position = ["1st", "2nd", "3rd"];
                                                        const label = position[index] || `${index + 1}th`;
                                                        const estimatedCreationDays = request.BuyerEstimatedCreationDaysHistory[index +1];

                                                        return (
                                                            <div key={index} className="row mb-2">
                                                                <div className="col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={`${label} Negotiation: ₹${budget}`}
                                                                        readOnly
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={`${estimatedCreationDays || "N/A"} Days`}
                                                                        readOnly
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

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
