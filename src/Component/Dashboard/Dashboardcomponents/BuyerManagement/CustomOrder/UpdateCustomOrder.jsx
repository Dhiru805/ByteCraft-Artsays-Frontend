import React, { useState, useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

function UpdateBuyerRequest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { state } = location || {};
  const { request } = state || {};

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [buyerImage, setBuyerImage] = useState(null);
  const [imageName, setImageName] = useState(''); 
  // const [errorMessage, setErrorMessage] = useState(''); 


  useEffect(() => {
    if (request) {
      setProductName(request.ProductName || '');
      setDescription(request.Description || '');
      if (request.BuyerImage) {
        setImageName(request.BuyerImage); 
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
      setImageName(file.name);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // if (!description.trim()) {
    //   setErrorMessage('Description is required!');
    //   return;
    // }

 
    // if (!buyerImage && !request.BuyerImage) {
    //   setErrorMessage('Buyer image is required!');
    //   return;
    // }

    // setErrorMessage('');

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append('ProductName', productName);
    formData.append('Description', description);
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
        navigate("/Dashboard/BuyerCustomrequest");
      } else {
        toast.error(data.message || "Failed to update the request. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const modules = {
    toolbar: [
      [{ 'font': ['sans-serif', 'serif', 'monospace'] }, { 'size': ['small', 'medium', 'large', 'huge'] }],
      [{ 'header': '1' }, { 'header': '2' }, 'bold', 'italic', 'underline'],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }],
      ['code-block'],
      ['blockquote'],
      ['fullscreen'],
      ['help']
    ],
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
                <Link to="/Dashboard/BuyerCustomrequest">Buyer Custom Request</Link>
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
                  <input
                    type="file"
                    name="BuyerImage"
                    onChange={handleFileChange}
                    className="form-control-file"
                    required={!imageName && !buyerImage}
                  />
                  {request && request.BuyerImage && !buyerImage && (
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
