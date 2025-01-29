import React, { useState, useEffect } from "react";
import ImageEditor from "../../../Dashboard/Dashboardcomponents/ProductDetails/ImageCropping";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/char_counter.min.js";

// Utility functions to dynamically load CSS and scripts
const loadStyle = (href) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

function ProductUpload() {
  const [successMessage, setsuccessMessage] = useState();
  const [errorMessage, seterrorMessage] = useState();
  const [formData, setFormData] = useState({
    productName: "",
    artistName: "",
    productCategory: "",
    newPrice: "",
    size: "",
    oldPrice: "",
    images: [], // To store all image files
    mainImage: null, // Add main image to state



  });
  const [content, setContent] = useState(""); // Froala Editor content

  // Function to convert a dataURL to a Blob
  const dataURLToBlob = (dataURL) => {
    if (!dataURL || !dataURL.includes(",")) {
      console.error("Invalid dataURL provided to dataURLToBlob.");
      return null;
    }
    try {
      const parts = dataURL.split(",");
      const mime = parts[0].match(/:(.*?);/)[1];
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    } catch (error) {
      console.error("Error converting dataURL to Blob:", error.message);
      return null;
    }
  };

  useEffect(() => {
    loadStyle("/DashboardAssets/assets/vendor/bootstrap/css/bootstrap.min.css");
    loadStyle(
      "/DashboardAssets/assets/vendor/font-awesome/css/font-awesome.min.css"
    );
    loadStyle("/DashboardAssets/assets/css/main.css");

    loadScript("/DashboardAssets/assets/bundles/libscripts.bundle.js").catch(
      (err) => console.error("Failed to load script:", err)
    );
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const filesArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArray], // Append new images to the existing ones
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Function to strip HTML tags and get plain text content
  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert the main image data URL to a Blob
    const mainImageBlob = dataURLToBlob(formData.mainImage);
    const plainTextContent = stripHtmlTags(content);

    const token = localStorage.getItem("token");
    const formDataObj = new FormData();

    formDataObj.append("productName", formData.productName);
    formDataObj.append("artistName", formData.artistName);
    formDataObj.append("productCategory", formData.productCategory);
    formDataObj.append("newPrice", formData.newPrice);
    formDataObj.append("oldPrice", formData.oldPrice);
    formDataObj.append("description", plainTextContent);
    formDataObj.append("size", formData.size);

    if (mainImageBlob) {
      formDataObj.append("mainImage", mainImageBlob, "cropped-image.png");
    } else {
      console.error("Main image is missing!");
    }

    // Append additional images
  formData.images.forEach((image) => {
  formDataObj.append("images", image); // Ensure the field name matches
});


    // Log formData entries
    for (let [key, value] of formDataObj.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch(
        "http://localhost:3001/product-management/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataObj,
        }
      );

      const result = await response.json();
      if (response.ok) {
        setsuccessMessage("Product uploaded successfully!");
      } else {
        seterrorMessage(result.message || "Failed to upload product.");
      }
    } catch (err) {
      seterrorMessage("Error submitting form. Please try again.");
      console.error("Error submitting form:", err);
    }
  };

  return (
    // <div id="wrapper" className="theme-cyan">
    //   <Navbar />
    //   <UserAccount />
    //   <RightIconBar />
    //   <div id="main-content">
        <div className="container-fluid">
          <div className="block-header">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <h2>Create Product</h2>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">
                      <i className="fa fa-dashboard"></i>
                    </a>
                  </li>
                  <li className="breadcrumb-item">App</li>
                  <li className="breadcrumb-item active">Product Upload</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row clearfix">
            <div className="col-lg-12">
              <div className="card">
                <div className="body">
                  {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                  )}
                  {errorMessage && (
                    <div className="alert alert-danger">{errorMessage}</div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter Product Name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="artistName"
                        value={formData.artistName}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Artist Name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="newPrice"
                        value={formData.newPrice}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="$$"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="size"
                        value={formData.newsize}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter size"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="oldPrice"
                        value={formData.oldPrice}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="$$"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <select
                        name="productCategory"
                        value={formData.productCategory}
                        onChange={handleChange}
                        className="form-control show-tick"
                        required
                      >
                        <option value="">Select productCategory</option>
                        <option value="Web Design">Web Design</option>
                        <option value="Photography">Photography</option>
                        <option value="Technology">Technology</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Sports">Sports</option>
                      </select>
                    </div>

                    <div className="form-group mt-3 main-image">
                      <ImageEditor
                        onCroppedImage={(dataURL) => {
                          console.log("Cropped Image Data URL:", dataURL);
                          setFormData((prev) => ({
                            ...prev,
                            mainImage: dataURL, // Update mainImage in formData
                          }));
                        }}
                      />
                      ;
                    </div>

                    {/* Add multiple image fields */}
                    <div className="form-group mt-3">
                      <label>Upload Additional Images</label>
                      <input
                        type="file"
                        name="images"
                        onChange={handleChange}
                        className="form-control-file"
                        multiple
                        accept="image/*"
                      />
                    </div>
                    <div className="form-group mt-3">
                      <FroalaEditor
                        model={content}
                        onModelChange={(newContent) => {
                          console.log("Editor content:", newContent); // Debugging log
                          setContent(newContent);
                        }}
                        config={{
                          placeholderText: "Enter your product details here.",
                          charCounterCount: true,
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-block btn-primary mt-3"
                    >
                      Upload product
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
    //   </div>
    // </div>
  );
}

export default ProductUpload;
