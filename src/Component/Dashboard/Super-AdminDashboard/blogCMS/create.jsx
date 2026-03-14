import React, { useState } from "react";
import postAPI from "../../../../api/postAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BlogCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    status: "draft",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await postAPI("/api/blog-CMS/create", formData);
      toast.success("Blog page created!");
      navigate("/super-admin/CMS-Blog");
    } catch (err) {
      toast.error("Error creating page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Create Blog Page</h2>
      </div>

      <div className="card">
        <div className="body">
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Heading *</label>
              <input
                type="text"
                name="heading"
                value={formData.heading}
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                rows="4"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Blog Page"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogCreate;
