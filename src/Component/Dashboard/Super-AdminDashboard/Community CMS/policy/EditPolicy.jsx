import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import putAPI from "../../../../../api/putAPI";

const EditPolicy = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const policy = state?.policy;

  const [formData, setFormData] = useState({
    question: "",
    description: "",
    status: "draft",
  });

  const [loading, setLoading] = useState(false);

  // Pre-fill form if we got policy data from navigate()
  useEffect(() => {
    if (!policy) {
      toast.error("No policy data provided.");
      navigate("/super-admin/community-cms/policies");
    } else {
      setFormData({
        question: policy.question || "",
        description: policy.description || "",
        status: policy.status || "draft",
      });
    }
  }, [policy, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.question.trim() || !formData.description.trim()) {
        toast.error("Please fill in both question and description.");
        setLoading(false);
        return;
      }

      const response = await putAPI(
        `/api/social-policies/${policy._id}`,
        formData
      );

      if (response.data.success) {
        toast.success("Policy updated successfully!");
        navigate("/super-admin/community-cms/policies", { state: { reload: true } });
      } else {
        toast.error(response.data.message || "Failed to update policy");
      }
    } catch (error) {
      console.error("Error updating policy:", error);
      toast.error(error.response?.data?.message || "Error updating policy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Edit Policy</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Policy Question *</label>
                  <input
                    type="text"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Policy Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"
                    rows={4}
                    required
                  />
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
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/super-admin/community-cms/policies")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Policy"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPolicy;
