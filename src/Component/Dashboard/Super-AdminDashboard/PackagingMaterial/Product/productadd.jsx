import React, { useState, useEffect } from "react";
import useUserType from "../../urlconfig";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from 'jwt-decode';

function ProductUpload() {
  const userType = useUserType();
  const [selectedImages, setSelectedImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [userId, setUserId] = useState("");


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.userId) {
          setUserId(decodedToken.userId);
          setFormData((prevData) => ({ 
            ...prevData, 
            userId: decodedToken.userId  
          }));
        } else {
          console.error("User ID not found in token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.warn("No token found in localStorage");
    }
  }, []);

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    category: "", 
    description: "",
    mainImage: "",
    otherImages: [],
    userId: "", 
  });


  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });


  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    const newImages = await Promise.all(files.map((file) => toBase64(file)));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };


  const handleDeleteImage = (image) => {
    const updatedImages = selectedImages.filter((img) => img !== image);
    setSelectedImages(updatedImages);

    if (mainImage === image) {
      setMainImage(null);
      setFormData((prevData) => ({
        ...prevData,
        mainImage: "",
        otherImages: updatedImages,
      }));
    }
  };


  const handleFormChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

 
    if (!formData.productName.trim()) {
      toast.error("Product Name is required.");
      return;
    }
    if (!formData.price.trim()) {
      toast.error("Product Price is required.");
      return;
    }
    if (!formData.category.trim()) {
      toast.error("Product Category is required.");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Product Description is required.");
      return;
    }
    if (!mainImage) {
      toast.error("Please select a main image.");
      return;
    }


    const dataToSend = {
      ...formData,
      mainImage,
      otherImages: selectedImages.filter((img) => img !== mainImage),
      userId,
    };

    console.log("Final Payload:", dataToSend);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/addproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success("Product uploaded successfully!");
        setSelectedImages([]);
        setMainImage(null);
        setFormData({
          productName: "",
          price: "",
          category: "",
          description: "",
          mainImage: "",
          otherImages: [],
          userId: userId,
        });
      } else {
        const errorText = await response.text();
        toast.error("Error uploading product.");
        console.error("Server response:", errorText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Network error, check console for details.");
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Add Product</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">
                <Link to={`/${userType}/Dashboard/packagingmaterialproduct`}>Product</Link>
              </li>
              <li className="breadcrumb-item">Add Product</li>
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
                    name="productName"
                    className="form-control"
                    placeholder="Enter Product Name"
                    required
                    value={formData.productName}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    placeholder="Product Price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <select
                    name="category"
                    className="form-control show-tick"
                    required
                    value={formData.category}
                    onChange={handleFormChange}
                  >
                    <option value="">Select Product Category</option>
                    <option value="Web Design">Web Design</option>
                    <option value="Photography">Photography</option>
                    <option value="Technology">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <label className="btn btn-sm btn-secondary btn-upload" htmlFor="inputImage">
                  Choose file
                </label>
                <input
                  type="file"
                  className="sr-only"
                  id="inputImage"
                  name="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />

          
                <div className="input-image-preview-container" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {selectedImages.map((image, index) => (
                    <div key={index} style={{ position: "relative", display: "inline-block", margin: "5px" }}>
                      <img
                        src={image}
                        alt={`Selected ${index}`}
                        style={{ width: "100px", height: "100px", borderRadius: "5px", objectFit: "cover" }}
                      />
                      <input
                        type="radio"
                        name="mainImage"
                        checked={mainImage === image}
                        onChange={() => {
                          setMainImage(image);
                          setFormData((prevData) => ({
                            ...prevData,
                            mainImage: image,
                            otherImages: selectedImages.filter((img) => img !== image),
                          }));
                        }}
                        style={{ position: "absolute", bottom: "5px", left: "5px", cursor: "pointer" }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image)}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          background: "rgba(255, 0, 0, 0.5)",
                          color: "#fff",
                          border: "none",
                          width: "25px", 
                          height: "25px", 
                          borderRadius: "50%", 
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                          <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="form-group mt-3">
                  <textarea
                    name="description"
                    placeholder="Enter Product Description"
                    className="form-control"
                    rows="10"
                    style={{ height: "190px" }}
                    value={formData.description}
                    onChange={handleFormChange}
                  />
                </div>

                <button type="submit" className="btn btn-block btn-primary mt-3">
                  Add product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductUpload;