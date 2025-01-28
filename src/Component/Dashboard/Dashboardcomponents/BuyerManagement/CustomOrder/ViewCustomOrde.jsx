import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import axios from 'axios';
import useUserType from '../../urlconfig';

function ViewBuyerRequest() {
    const location = useLocation();
    const userType = useUserType();
    const { state } = location || {};
    const { request } = state || {};

    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [artistId, setArtistId] = useState('');
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get("http://localhost:3001/artist/artists");
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
            if (request.Artist?.id && request.Artist.id._id) {
                setArtistId(request.Artist.id._id);
            }
        }
    }, [request]);

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
                                <Link to={`/${userType}/Dashboard/BuyerCustomrequest`}>Buyer Custom Request</Link>
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
                                <label>Artist</label>
                                {artistId && artists.some(artist => artist._id === artistId) ? (
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={artists.find((artist) => artist._id === artistId)?.name + ' ' + artists.find((artist) => artist._id === artistId)?.lastName || ''}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="form-control"
                                        value=""
                                    />
                                )}
                            </div>


                            <div className="form-group mt-3">
                                <label>Budget</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={budget}

                                />
                            </div>

                            <div className="form-group mt-3">
                                <label>Description</label>
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
