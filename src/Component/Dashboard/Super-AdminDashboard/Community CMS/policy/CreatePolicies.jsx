import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postAPI from "../../../../../api/postAPI";

const CreatePolicy = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    question: "",
    description: "",
    status: "draft", // ✅ default
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.question.trim() || !formData.description.trim()) {
      toast.error("Question and description are required");
      setLoading(false);
      return;
    }

    try {
      const response = await postAPI("/api/social-policies", formData);
      if (response.data.success) {
        toast.success(response.data.message || "Policy created successfully!");
        navigate("/super-admin/community-cms/policies");
      } else {
        toast.error(response.data.message || "Failed to create policy.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Create Policy</h2>
      </div>
      <div className="col-lg-12">
        <div className="card">
          <div className="body">
            <form onSubmit={handleSubmit}>
              {/* Question */}
              <div className="form-group">
                <label>Policy Question *</label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter policy question"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Policy Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter policy description"
                  rows={4}
                  required
                />
              </div>

              {/* Status Dropdown */}
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Buttons (No modal-footer = No line) */}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    navigate("/super-admin/community-cms/policies")
                  }
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePolicy;
