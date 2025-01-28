import React, { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';



function BlogPost() {
  const [formData, setFormData] = useState({
    productName: "",
    artistName: "",
    productImage: null,
    productCategory: "",
  });
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");



  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "productImage") {
      setFormData({ ...formData, productImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    const formDataObj = new FormData();

    console.log("Form Data:", { ...formData, productDescription: content }); // Debugging log

    // Append all form data including the blog description
    for (const key in formData) {
      formDataObj.append(key, formData[key]);
    }
    formDataObj.append("productDescription", content);

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
              <h2>Create Blog Post</h2>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="fa fa-dashboard"></i>
                  </a>
                </li>
                <li className="breadcrumb-item">App</li>
                <li className="breadcrumb-item active">Blog</li>
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
                      value={formData.artistName}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="$$"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="oldPrice"
                      value={formData.artistName}
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

                  <div className="form-group mt-3">
                    <iamgeEditior />

                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="file"
                      name="productImage"
                      onChange={handleChange}
                      className="form-control-file"
                      required
                    />
                  </div>
                  <div className="form-group mt-3">
                    <ReactQuill
                      value={content}
                      onChange={(newContent) => {
                        console.log("Editor content:", newContent); 
                        setContent(newContent);
                      }}
                      placeholder="Enter your blog content here."
                      modules={modules}
                      theme="snow"
                    
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-block btn-primary mt-3"
                  >
                    Post Blog
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
}

export default BlogPost;
