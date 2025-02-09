import React, { useState, useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import useUserType from '../../../urlconfig';

function UpdateBuyerRequest() {
  const navigate = useNavigate();
  const userType = useUserType(); 
  const { id } = useParams();
  const location = useLocation();
  const { state } = location || {};
  const { request } = state || {};

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [buyerImage, setBuyerImage] = useState(null);
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

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBuyerImage(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append('ProductName', productName);
    formData.append('Description', description);
    formData.append('Budget', budget);
    if (artistId) {
      formData.append('Artist', artistId);
    }
    if (buyerImage) {
      formData.append('BuyerImage', buyerImage, buyerImage.name);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/update-buyer-request/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Request updated successfully!");
        navigate(`/${userType}/Dashboard/BuyerCustomrequest`);
      } else {
        toast.error(data.message || "Failed to update the request. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const modules = {
    toolbar: [
      [{ 'font': ['sans-serif'] }, { 'size': ['small', 'large', 'huge'] }],
      [{ 'header': '1' }, { 'header': '2' }, 'bold', 'italic', 'underline'],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }],
      ['code-block'],
      ['blockquote'],
      ['fullscreen'],
      ['help'],
    ],
  };

  const editorStyle = {
    fontFamily: 'Nunito, Ubuntu, Raleway, IBM Plex Sans, sans-serif',
    fontSize: '12px', 
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Edit Buyer Custom Request</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/"><i className="fa fa-dashboard"></i></a>
              </li>
              <li className="breadcrumb-item active">
                <Link to={`/${userType}/Dashboard/BuyerCustomrequest`}>Buyer Custom Request</Link>
              </li>
              <li className="breadcrumb-item">Edit Custom Request</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="ProductName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="form-control"
                    placeholder="Product Name"
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <select
                    name="Artist"
                    value={artistId}
                    onChange={(e) => setArtistId(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="">Select Artist</option>
                    {artists.map((artist) => (
                      <option key={artist._id} value={artist._id}>
                        {artist.name}  {artist.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mt-3">
                  <input
                    type="number"
                    name="Budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="form-control"
                    placeholder="Budget"
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <input
                    type="file"
                    name="BuyerImage"
                    onChange={handleFileChange}
                    className="form-control-file"
                  />
                  {buyerImage && (
                    <div className="mt-2" style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
                      <img
                        src={URL.createObjectURL(buyerImage)}
                        alt="Selected Buyer Image"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  {request?.BuyerImage && !buyerImage && (
                    <div className="mt-2" style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
                      <img
                        src={`http://localhost:3001/${request.BuyerImage}`}
                        alt="Current Buyer Image"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
                <div className="form-group mt-3">
                  <ReactQuill
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter your request description here."
                    modules={modules}
                    theme="snow"
                    style={editorStyle}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-block btn-primary mt-3">
                  Update Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateBuyerRequest;
