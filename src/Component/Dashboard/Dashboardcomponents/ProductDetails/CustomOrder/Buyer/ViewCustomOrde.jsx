// import React, { useEffect, useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';
// import axios from 'axios';
// import useUserType from '../../urlconfig';

// function ViewBuyerRequest() {
//     const location = useLocation();
//     const userType = useUserType();
//     const { state } = location || {};
//     const { request } = state || {};

//     const [productName, setProductName] = useState('');
//     const [description, setDescription] = useState('');
//     const [budget, setBudget] = useState('');
//     const [artistId, setArtistId] = useState('');
//     const [artists, setArtists] = useState([]);
//     const [image, setImage] = useState('');

//     useEffect(() => {
//         const fetchArtists = async () => {
//             try {
//                 const response = await axios.get("http://localhost:3001/artist/artists");
//                 setArtists(response.data);
//             } catch (error) {
//                 console.error("Error fetching artists:", error);
//             }
//         };
//         fetchArtists();

//         if (request) {
//             setProductName(request.ProductName || '');
//             setDescription(request.Description || '');
//             setBudget(request.Budget || '');
//             setImage(request.BuyerImage ? `http://localhost:3001/${request.BuyerImage}` : '');
//             if (request.Artist?.id && request.Artist.id._id) {
//                 setArtistId(request.Artist.id._id);
//             }
//         }
//     }, [request]);

//     return (
//         <div className="container-fluid">
//             <div className="block-header">
//                 <div className="row">
//                     <div className="col-lg-6 col-md-6 col-sm-12">
//                         <h2>View Buyer Custom Request</h2>
//                         <ul className="breadcrumb">
//                             <li className="breadcrumb-item">
//                                 <a href="/"><i className="fa fa-dashboard"></i></a>
//                             </li>
//                             <li className="breadcrumb-item active">
//                                 <Link to={`/${userType}/Dashboard/BuyerCustomrequest`}>Buyer Custom Request</Link>
//                             </li>
//                             <li className="breadcrumb-item">View Custom Request</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>

//             <div className="row clearfix">
//                 <div className="col-lg-12">
//                     <div className="card">
//                         <div className="body">
//                             <div className="row d-flex align-items-stretch">
//                                 {/* Left Column for Image */}
//                                 <div className="col-md-4 d-flex" style={{ display: 'flex', justifyContent: 'center' }}>
//                                     <div style={{ height: '140px', width: '100%', overflow: 'hidden' }}>
//                                         {image ? (
//                                             <img
//                                                 src={image}
//                                                 alt="Buyer"
//                                                 className="img-fluid rounded shadow w-100"
//                                                 style={{ height: '100%', objectFit: 'cover' }}
//                                             />
//                                         ) : (
//                                             <p className="align-self-center"></p>
//                                         )}
//                                     </div>
//                                 </div>

                          
//                                 <div className="col-md-8 d-flex flex-column">
//                                     <div className="row">
//                                         <div className="col-6" style={{ paddingRight: '10px' }}>
//                                             <div className="form-group">
//                                                 <label>Product Name</label>
//                                                 <input type="text" className="form-control" value={productName} readOnly />
//                                             </div>
//                                         </div>
//                                         <div className="col-6" style={{ paddingLeft: '10px' }}>
//                                             <div className="form-group">
//                                                 <label>Artist</label>
//                                                 <input type="text" className="form-control" value={artistId ? artists.find(a => a._id === artistId)?.name + ' ' + artists.find(a => a._id === artistId)?.lastName : 'Not Assigned'} readOnly />
//                                             </div>
//                                         </div>
//                                     </div>

                                 
//                                     <div className="form-group mt-3">
//                                         <label>Budget</label>
//                                         <input type="text" className="form-control" value={budget} readOnly />
//                                     </div>

                                  
//                                     <div className="form-group mt-3">
//                                         <label>Description</label>
//                                         <ReactQuill value={description} readOnly theme="snow" modules={{ toolbar: false }} />
//                                     </div>

//                                     {request?.NegiotaiteBudget || request?.Notes ? <hr /> : null}

                             
//                                     {request?.NegiotaiteBudget && (
//                                         <div className="form-group mt-3">
//                                             <label>Negotiate Budget</label>
//                                             <input type="text" className="form-control" value={request.NegiotaiteBudget} readOnly />
//                                         </div>
//                                     )}

                                
//                                     {request?.Notes && (
//                                         <div className="form-group mt-3">
//                                             <label>Notes</label>
//                                             <textarea className="form-control" value={request.Notes} readOnly />
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ViewBuyerRequest;


import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import axios from 'axios';
import useUserType from '../../../urlconfig';

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
    const [image, setImage] = useState('');

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
            setImage(request.BuyerImage ? `http://localhost:3001/${request.BuyerImage}` : '');
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
                        <h2>View Custom Request</h2>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/"><i className="fa fa-dashboard"></i></a>
                            </li>
                            <li className="breadcrumb-item active">
                                <Link to={`/${userType}/Dashboard/customrequest`}>Custom Request</Link>
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
                                                    <label>Artist</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={artistId ? artists.find(a => a._id === artistId)?.name + ' ' + artists.find(a => a._id === artistId)?.lastName : 'Not Assigned'}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group mt-3">
                                        <label>Budget</label>
                                        <input type="text" className="form-control" value={budget} readOnly />
                                    </div>

                                    <div className="form-group mt-3">
                                        <label>Description</label>
                                        <ReactQuill value={description} readOnly theme="snow" modules={{ toolbar: false }} />
                                    </div>

                                    {request?.NegiotaiteBudget || request?.Notes ? <hr /> : null}

                                    {request?.NegiotaiteBudget && request?.Notes && (
                                        <label className="mt-3 d-block">Negotiation By Artist</label>
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
                                            <textarea className="form-control" value={request.Notes} readOnly />
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
