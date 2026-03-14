import React, { useState } from "react";
import putAPI from "../../../../api/putAPI";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const BlogEdit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const page = state?.page;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    heading: page?.heading || "",
    description: page?.description || "",
    status: page?.status || "draft",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await putAPI(`/api/blog-CMS/update/${page._id}`, formData);
      toast.success("Blog page updated!");
      navigate("/super-admin/CMS-Blog");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Edit Blog Page</h2>
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
              {loading ? "Updating..." : "Update Blog Page"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogEdit;
