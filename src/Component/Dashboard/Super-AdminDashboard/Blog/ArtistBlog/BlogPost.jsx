import React, { useState,useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { Link } from "react-router-dom";
import useUserType from '../../urlconfig';
import axios from 'axios';

function BlogPost() {
  const navigate = useNavigate();
  const userType = useUserType(); 
  const [formData, setFormData] = useState({
    blogName: "",
    slug: "",
    summary: "",
    blogImage: null,
    category: "",
    tags: []
  });
  const [content, setContent] = useState(""); 
  const [tagInput, setTagInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/getblogcategory`);
        setCategories(response.data);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

useEffect(() => {
    fetchCategories();
}, []);
  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "blogImage") {
      setFormData({ ...formData, blogImage: files[0] });
      if (files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag]
        });
        setTagInput("");
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); 
    const formDataObj = new FormData();

    for (const key in formData) {
      if (key === "tags") {
        formDataObj.append(key, formData[key].join(','));
      } else {
        formDataObj.append(key, formData[key]);
      }
    }
    formDataObj.append("blogDescription", content);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Blog-Post/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error("Failed to create blog post");
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setErrorMessage("");
      setFormData({
        blogName: "",
        slug: "",
        summary: "",
        blogImage: null,
        category: "",
        tags: []
      });
      setContent(""); 
      setImagePreview(null);
      navigate(`/${userType}/Dashboard/bloglist`);
      toast.success('Blog post created successfully!');
      localStorage.removeItem("blogPostDraft");
      setFormData({
  blogName: "",
  slug: "",
  summary: "",
  blogImage: null,
  category: "",
  tags: []
});
setContent("");
setTagInput("");
setImagePreview(null);
    } catch (error) {
      setSuccessMessage("");
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
            <h2>Create Blog Post</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active"><Link to={`/${userType}/Dashboard/bloglist`}>Blogs</Link></li>
              <li className="breadcrumb-item">Create Blog Post</li>
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
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="blogName">Blog Title</label>
                  <input
                    type="text"
                    id="blogName"
                    name="blogName"
                    value={formData.blogName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter Blog Title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="slug">URL Slug</label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter URL slug (e.g., my-blog-post)"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="summary">Summary</label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter a short summary of the blog post"
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="tags">Tags</label>
                  <div 
                    className="d-flex flex-wrap align-items-center form-control p-2" 
                    style={{ minHeight: '44px' }}
                  >
                    {formData.tags.map((tag, index) => (
                      <div 
                        key={index}
                        className="d-flex align-items-center bg-light rounded px-2 py-1 m-1"
                      >
                        <span className="mr-1">#{tag}</span>
                        <span 
                          className="ml-1 text-danger"
                          style={{ cursor: 'pointer' }}
                          onClick={() => removeTag(index)}
                        >
                          &times;
                        </span>
                      </div>
                    ))}
                    <input
                      type="text"
                      id="tags"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleAddTag}
                      className="border-0 flex-grow-1 px-2"
                      style={{ outline: 'none', minWidth: '100px' }}
                      placeholder="Type tags and press enter or comma"
                    />
                  </div>
                  <small className="form-text text-muted">
                    Add relevant tags to help categorize your post (e.g., #webdesign, #tutorial)
                  </small>
                </div>
                <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control show-tick"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
                <div className="form-group mt-3">
                  <label htmlFor="blogImage">Featured Image</label>
                  <input
                    type="file"
                    id="blogImage"
                    name="blogImage"
                    onChange={handleChange}
                    className="form-control-file"
                    accept="image/*"
                    required
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="img-thumbnail" 
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  )}
                </div>
                <div className="form-group mt-3">
                  <label>Blog Content</label>
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