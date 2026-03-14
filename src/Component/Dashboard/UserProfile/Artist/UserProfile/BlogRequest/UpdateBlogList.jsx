import React, { useState, useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import useUserType from '../../../urlconfig';

function UpdateBlog() {
  // const navigate = useNavigate();
    const { blogId } = useParams();
    const { userId } = useParams();
  const userType = useUserType();
  const location = useLocation();
  const blog = location.state?.blog || null;

  console.log("Blog Data Received:", blog);


  const [formData, setFormData] = useState({
    blogName: "",
    blogAuthor: "",
    blogImage: null,
    category: "",
  });
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    if (blog) {
      setFormData({
        blogName: blog.blogName || "",
        blogAuthor: blog.blogAuthor || "",
        blogImage: null,
        category: blog.category || "",
      });
      setContent(blog.blogDescription || "");
    }
  }, [blog]);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "blogImage") {
      setFormData({ ...formData, blogImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blog || !blog._id) {
      toast.error("Invalid blog data.");
      return;
    }

    const token = localStorage.getItem("token");
    const formDataObj = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formDataObj.append(key, formData[key]);
      }
    }
    formDataObj.append("blogDescription", content);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Blog-Post/update/${blog._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error("Failed to update blog post");
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      toast.success('Blog post updated successfully!');


      // navigate(`/${userType}/Dashboard/artistblogs`);

    } catch (error) {
      setErrorMessage(error.message);
      toast.error(`Error: ${error.message}`);
    }
  };


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
            <h2>Artist Edit Blog</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">
                <Link to={`/${userType}/Dashboard/artistmanagetable`}>Artist Management</Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to={`/${userType}/Dashboard/artistmanagetable/artistprofile/${userId}`}>Artist Profile</Link>
              </li>
              <li className="breadcrumb-item">Artist Edit Blog</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

              {blog ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="blogName"
                      value={formData.blogName}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter Blog Title"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="blogAuthor"
                      value={formData.blogAuthor}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Author Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-control show-tick"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Web Design">Web Design</option>
                      <option value="Photography">Photography</option>
                      <option value="Technology">Technology</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>
                  <div className="form-group mt-3">
                    <input
                      type="file"
                      name="blogImage"
                      onChange={handleChange}
                      className="form-control-file"
                    />
                    {blog.blogImage && (
                      <div className="mt-2">
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${blog.blogImage.replace(/\\/g, "/")}`}
                          alt="Current"
                          style={{ maxWidth: "150px", maxHeight: "150px" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="form-group mt-3">
                    <ReactQuill
                      value={content}
                      onChange={(newContent) => setContent(newContent)}
                      placeholder="Enter your blog content here."
                      modules={modules}
                      theme="snow"
                      style={editorStyle}
                    />
                  </div>
                  <button type="submit" className="btn btn-block btn-primary mt-3">
                    Update Blog
                  </button>
                </form>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateBlog;
