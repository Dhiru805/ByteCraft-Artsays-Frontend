import React, { useState, useEffect } from "react";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import { useAuth } from '../../../../../AuthContext';

function BlogPost() {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const userId = user?._id || "guest"; 
  const DRAFT_KEY = `blogPostDraft_${userId}`; 

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
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await getAPI("/api/getblogcategory");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY); 
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.formData?.blogName || draft.content) {
          setFormData(prev => ({
            ...prev,
            ...draft.formData,
            blogImage: null,
          }));
          setContent(draft.content || "");
          setImagePreview(draft.imagePreview || null);
        }
      } catch (err) {
        console.warn("Failed to parse draft:", err);
      }
    }
  }, [userId]); 

  useEffect(() => {
    const draft = {
      formData: { ...formData, blogImage: null },
      content,
      imagePreview,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); 
  }, [formData, content, imagePreview, userId]); 

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

    } else if (name === "blogName") {
      const capitalizedTitle = value.charAt(0).toUpperCase() + value.slice(1);

      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      setFormData({
        ...formData,
        blogName: capitalizedTitle,
        slug: generatedSlug,
      });

    } else if (name === "slug") {
      const cleanedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      setFormData({ ...formData, slug: cleanedSlug });

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
    setLoading(true);
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
      await postAPI("/Blog-Post/create", formDataObj, true);
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
      localStorage.removeItem(DRAFT_KEY); 
      navigate(-1);
    } catch (error) {
      const errorData = error?.response?.data;
      if (Array.isArray(errorData?.errors)) {
        errorData.errors.forEach(msg => toast.error(msg));
      } else {
        const errorMessage = errorData?.message || error.message || 'Something went wrong.';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
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
                <span onClick={() => navigate('/super-admin/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item active">
                <span onClick={() => navigate('/super-admin/blog')} style={{ cursor: 'pointer' }}>
                  Blogs
                </span>
              </li>
              <li className="breadcrumb-item">Create Blog Post</li>
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
                <button type="submit" className="btn btn-block btn-primary mt-3"
                  disabled={loading}>
                  {loading ? "Creating Blog........." : "Create Blog"}
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
