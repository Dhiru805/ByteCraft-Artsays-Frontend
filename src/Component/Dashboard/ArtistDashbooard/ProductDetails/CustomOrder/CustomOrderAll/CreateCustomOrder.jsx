import React, { useState, useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useUserType from '../../../urlconfig';
import Switch from "react-switch";
import getAPI from "../../../../../../api/getAPI";


function BuyerRequest() {
  const navigate = useNavigate();
  const userType = useUserType();
  
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [buyerImage, setBuyerImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [artistId, setArtistId] = useState('');
  const [artists, setArtists] = useState([]);
  const [artType, setArtType] = useState('');
  const [size, setSize] = useState('');
  const [colourPreferences, setColourPreferences] = useState([]);
  const [currentColour, setCurrentColour] = useState('');
  const [isFramed, setIsFramed] = useState(false);
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [paymentTerm, setPaymentTerm] = useState('');
  const [expectedDeadline, setExpectedDeadline] = useState('');
  const [comments, setComments] = useState('');
  
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await getAPI(`${BASE_URL}/artist/artists`);
        setArtists(response.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBuyerImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addColourPreference = () => {
    if (currentColour && !colourPreferences.includes(currentColour)) {
      setColourPreferences([...colourPreferences, currentColour]);
      setCurrentColour('');
    }
  };

  const removeColourPreference = (colourToRemove) => {
    setColourPreferences(colourPreferences.filter(colour => colour !== colourToRemove));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append('ProductName', productName);
    formData.append('Description', description);
    formData.append('ArtType', artType);
    formData.append('Size', size);
    formData.append('ColourPreferences', JSON.stringify(colourPreferences));
    formData.append('IsFramed', isFramed);
    formData.append('MinBudget', minBudget);
    formData.append('MaxBudget', maxBudget);
    formData.append('PaymentTerm', paymentTerm);
    formData.append('ExpectedDeadline', expectedDeadline);
    formData.append('Comments', comments);

    if (artistId) {
      formData.append('Artist', artistId);
    }

    if (buyerImage) {
      formData.append('BuyerImage', buyerImage, buyerImage.name);
    }

    try {
      const response = await fetch(`/api/buyer-request`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Request created successfully!");
        setProductName('');
        setDescription('');
        setBuyerImage(null);
        setImagePreview(null);
        setArtistId('');
        setArtType('');
        setSize('');
        setColourPreferences([]);
        setIsFramed(false);
        setMinBudget('');
        setMaxBudget('');
        setPaymentTerm('');
        setExpectedDeadline('');
        setComments('');
        navigate(`/${userType}/Dashboard/customrequest`);
      } else {
        toast.error(data.message || "Failed to create the request. Please try again.");
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
            <h2>Add Custom Request</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/"><i className="fa fa-dashboard"></i></a>
              </li>
              <li className="breadcrumb-item active">
                <Link to={`/${userType}/Dashboard/customrequest`}>Custom Request</Link>
              </li>
              <li className="breadcrumb-item">Add Custom Request</li>
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
                  <label htmlFor="productName">Product Name</label>
                  <input
                    type="text"
                    id="productName"
                    name="ProductName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="form-control"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="artistSelect">Select Artist</label>
                  <select
                    id="artistSelect"
                    name="Artist"
                    value={artistId}
                    onChange={(e) => setArtistId(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="">Select an artist</option>
                    {artists.map((artist) => (
                      <option key={artist._id} value={artist._id}>
                        {artist.name} {artist.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="artType">Art Type</label>
                  <input
                    type="text"
                    id="artType"
                    name="ArtType"
                    value={artType}
                    onChange={(e) => setArtType(e.target.value)}
                    className="form-control"
                    placeholder="e.g., Painting, Sculpture, Digital Art"
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="size">Size</label>
                  <input
                    type="text"
                    id="size"
                    name="Size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="form-control"
                    placeholder="e.g., 24x36 inches, A4"
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="colourPreference">Colour Preferences</label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="colourPreference"
                      value={currentColour}
                      onChange={(e) => setCurrentColour(e.target.value)}
                      className="form-control"
                      placeholder="Add a colour preference"
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addColourPreference}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <small className="form-text text-muted">
                    Click "Add" to include each colour preference
                  </small>
                  <div className="mt-2">
                    {colourPreferences.map((colour, index) => (
                      <span key={index} className="badge badge-primary mr-2 d-inline-flex align-items-center">
                        <span style={{ margin: '0 auto' }}>{colour}</span>
                        <button
                          type="button"
                          className="close ml-2"
                          onClick={() => removeColourPreference(colour)}
                          style={{ fontSize: '1rem' }}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group mt-3 d-flex align-items-center gap-2">

                  <label className="ms-2">Frame Required</label>
                  <div className="mx-4">
                    <Switch
                      onChange={setIsFramed}
                      checked={isFramed}
                      onColor="#007bff"
                      offColor="#ccc"
                      uncheckedIcon={false}
                      checkedIcon={false}
                      height={19}
                      width={36}
                      handleDiameter={12}
                    />
                  </div>

                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mt-3">
                      <label htmlFor="minBudget">Minimum Budget (₹)</label>
                      <input
                        type="number"
                        id="minBudget"
                        name="MinBudget"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                        className="form-control"
                        placeholder="Enter minimum amount in ₹"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mt-3">
                      <label htmlFor="maxBudget">Maximum Budget (₹)</label>
                      <input
                        type="number"
                        id="maxBudget"
                        name="MaxBudget"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        className="form-control"
                        placeholder="Enter maximum amount in ₹"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="paymentTerm">Payment Term</label>
                  <select
                    id="paymentTerm"
                    name="PaymentTerm"
                    value={paymentTerm}
                    onChange={(e) => setPaymentTerm(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="">Select payment option</option>
                    <option value="full">Full Payment</option>
                    <option value="installment">Installment</option>
                    <option value="two-step">Two Step Payment</option>
                  </select>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="expectedDeadline">Expected Deadline (days)</label>
                  <input
                    type="number"
                    id="expectedDeadline"
                    name="ExpectedDeadline"
                    value={expectedDeadline}
                    onChange={(e) => setExpectedDeadline(e.target.value)}
                    className="form-control"
                    placeholder="Number of days to complete the work"
                    required
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="buyerImage">Reference Image</label>
                  <input
                    type="file"
                    id="buyerImage"
                    name="BuyerImage"
                    onChange={handleFileChange}
                    className="form-control-file"
                    required
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '4px',
                          padding: '5px'
                        }}
                      />

                    </div>
                  )}
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="comments">Additional Comments</label>
                  <textarea
                    id="comments"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="form-control"
                    placeholder="Any other details or references you'd like to include"
                    rows="3"
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="description">Detailed Description</label>
                  <ReactQuill
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Describe your request in detail..."
                    modules={modules}
                    theme="snow"
                    style={editorStyle}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-block btn-primary mt-3">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerRequest;