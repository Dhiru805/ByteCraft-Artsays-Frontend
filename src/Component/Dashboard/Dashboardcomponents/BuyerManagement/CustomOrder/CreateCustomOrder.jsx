import React, { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function BuyerRequest() {
  const navigate = useNavigate();
  
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [buyerImage, setBuyerImage] = useState(null);


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
  if (buyerImage) {
    formData.append('BuyerImage', buyerImage, buyerImage.name);
  }

  try {
    const response = await fetch('http://localhost:3001/api/buyer-request', {
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
      navigate("/Dashboard/BuyerCustomrequest");
    } else {
      toast.error(data.message || "Failed to create the request. Please try again.");
    }
  } catch (error) {
    toast.error("An error occurred. Please try again.");
  }
};


  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': ['small', 'medium', 'large', 'huge'] }],
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
            <h2>Add Buyer Custom Request</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/"><i className="fa fa-dashboard"></i></a>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/Dashboard/BuyerCustomrequest">Buyer Custom Request</Link>
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
                    required
                  />
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
                  Add Request
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
