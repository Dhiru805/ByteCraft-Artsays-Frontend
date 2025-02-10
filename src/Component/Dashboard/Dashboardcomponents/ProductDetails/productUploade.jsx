import React from "react";
import ImageEditor from "../../../Dashboard/Dashboardcomponents/ProductDetails/ImageCropping";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

function ProductUpload() {

  const modules = {
    toolbar: [
      [{ 'font': ['sans-serif', 'serif', 'monospace'] }, { 'size': ['small', 'large', 'huge'] }],
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
              {/* <form>
                <div className="form-group">
                  <input
                    type="text"
                    name="productName"
                    className="form-control"
                    placeholder="Enter Product Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="newPrice"
                    className="form-control"
                    placeholder="Produt Price"
                    required
                  />
                </div>

                <div className="form-group">
                  <select
                    name="productCategory"
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

              
               
              </form> */}
              <label className="btn btn-sm btn-secondary btn-upload" htmlFor="inputImage" title="Upload image file">
                  Choose file
                </label>
                <input
                  type="file"
                  className="sr-only"
                  id="inputImage"
                  name="file"
                  accept="image/*"
                  multiple
                />
                <div className="input-image-preview-container">
                  <h5>Selected Image Preview:</h5>
                  <div id="imagePreviewList"></div>

                </div>
                <button  id="uploadBtn">Upload</button>
                <div className="form-group mt-3 main-image">
                  <ImageEditor

                  />
                </div>
                <div className="form-group mt-3">
                  <div className="form-group mt-3">
                    <ReactQuill
                      placeholder="Enter Product Details"
                      modules={modules}
                      theme="snow"
                      style={editorStyle}
                    />
                  </div>
                </div>
                <button
                  // type="submit"
                  className="btn btn-block btn-primary mt-3"
                  id="uploadBtn"
                >
                  Upload product
                </button>
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