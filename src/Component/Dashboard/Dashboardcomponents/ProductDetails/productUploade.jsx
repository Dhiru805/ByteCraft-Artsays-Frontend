import React, { useState, useEffect } from "react";
import ImageEditor from "../../../Dashboard/Dashboardcomponents/ProductDetails/ImageCropping";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/char_counter.min.js";
// import getAPI from "../../../../api/getAPI";



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
  const [croppedImages, setCroppedImages] = useState([]);
  // const [lastReloadTimestamp, setLastReloadTimestamp] = useState(new Date()); 

  const [editingImageIndex, setEditingImageIndex] = useState(null); 




  // const fetchImages = async () => {
  //   try {
  //     const response = await getAPI('http://localhost:3001/api/get-cropImage', {
  //       lastReload: lastReloadTimestamp, // Send the last reload timestamp to the backend
  //     });

  //     const data = response.data;

  //     if (data && data.data) {
  //       setCroppedImages(data.data);
  //       // Update the last reload timestamp to the current time
  //       setLastReloadTimestamp(new Date());
  //     } else {
  //       console.error("No new images found.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching images:", error);
  //   }
  // };

  // // Fetch images when the component mounts (initial page load or reload)
  // useEffect(() => {
  //   // Fetch images immediately when the page loads or is reloaded
  //   fetchImages();

  //   // Optionally, set an interval for periodic re-fetching of images (every 10 seconds)
  //   const interval = setInterval(fetchImages, 10000); // Refresh every 10 seconds

  //   return () => clearInterval(interval); // Cleanup interval on unmount
  // }, []); // Empty dependency array to run this effect once on page reload

  useEffect(() => {
    const imageCount = localStorage.getItem("imageCount");
    const images = [];

    if (imageCount) {
      for (let i = 1; i <= parseInt(imageCount); i++) {
        const savedCroppedImage = localStorage.getItem("croppedImage" + i);
        if (savedCroppedImage) {
          images.push(savedCroppedImage);
        }
      }
    }

    setCroppedImages(images);
  }, []); 


  
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

  const [selectedImage, setSelectedImage] = useState(null);
  // const [formData, setFormData] = useState({ mainImage: "" });

  const [images, setImages] = useState([]); // Store uploaded images
  const [error, setError] = useState(null);
  const [editingImage, setEditingImage] = useState(null); // Store the image being edited
  const [editingIndex, setEditingIndex] = useState(null); 
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);// Store the index of the image being edited

  useEffect(() => {
    const imageCount = localStorage.getItem("imageCount");
    const images = [];

    if (imageCount) {
      for (let i = 1; i <= parseInt(imageCount); i++) {
        const savedCroppedImage = localStorage.getItem("croppedImage" + i);
        if (savedCroppedImage) {
          images.push(savedCroppedImage);
        }
      }
    }

    setCroppedImages(images);
  }, []);

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
  
    const totalFiles = images.length + files.length;
  
    if (totalFiles < 3 || totalFiles > 10) {
      setError("Please select between 3 and 10 images.");
      return;
    }
  
    setError(null);
  
    const newImages = [...images, ...files.map((file) => URL.createObjectURL(file))];
    setImages(newImages);
  
    localStorage.removeItem("imageCount");
    let i = 1;
    while (localStorage.getItem(`croppedImage${i}`)) {
      localStorage.removeItem(`croppedImage${i}`);
      i++;
    }
  };
  


  const handleEditClick = (image, index) => {
    const updatedImages = [...images];
    updatedImages[index] = {
      ...updatedImages[index],
      removed: true, // This flag hides the image
    };
  
    setSelectedImageIndex(index);
    setImages(updatedImages);
    setEditingImage(null);
  
    // Use a timeout to ensure the state is updated before reopening
    setTimeout(() => {
      setEditingImage(image);
      setEditingIndex(index);
    }, 0);
  };

  // const handleCroppedImage = (dataURL) => {
  //   console.log("Cropped Image Data URL:", dataURL);
  //   const updatedImages = [...images];
  //   updatedImages[editingIndex] = dataURL; // Replace the edited image in the array
  //   setImages(updatedImages);
  //   setEditingImage(null); // Close the editor after editing
  //   setEditingIndex(null);
  // };

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

                {/* Add multiple image fields */}
                <div className="form-group mt-3">
                  {/* <label>Images</label>  */}
                  <input
                    type="file"
                    name="images"
                    onChange={handleChange}
                    className="form-control-file"
                    multiple
                    accept="image/*"
                  />
                </div>

                {error && <div style={{ color: "red" }}>{error}</div>}

                <div className="mt-3">
  {images.length > 0 && images.some(image => !image.removed) && <h5>Preview Images</h5>} 
  <div className="image-preview-container" style={{
    display: 'flex',
    flexDirection: 'row', 
    gap: '10px', 
    flexWrap: 'wrap' 
  }}>
    {images.map((image, index) => (
      !image.removed && (
        <div key={index} className="position-relative" style={{ marginRight: "10px" }}>
          <img
            src={image}
            alt={`preview-${index}`}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '5px',
              display: selectedImageIndex === index ? 'none' : 'block', 
            }}
          />
          {images.length >= 3 && images.length <= 10 && selectedImageIndex !== index && (
            <button
              className="fa fa-edit position-absolute"
              style={{
                top: '5px',
                right: '5px',
                background: 'rgba(0, 0, 0, 0.5)',
                color: '#fff',
                border: 'none',
                padding: '5px',
                borderRadius: '50%',
                display: selectedImageIndex === index || image.removed ? 'none' : 'block', 
              }}
              onClick={() => handleEditClick(image, index)} 
            ></button>
          )}
        </div>
      )
    ))}
  </div>
</div>



                {editingImage && (
                  <div className="form-group mt-3 main-image">
                    <ImageEditor
                      initialImage={editingImage} 
                      editingImageIndex={editingImageIndex}
                    />
                  </div>
                )}



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