
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import putAPI from "../../../../api/putAPI";
import getAPI from "../../../../api/getAPI";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import "react-toastify/dist/ReactToastify.css";

const UpdatePolicy = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const quillRef = useRef(null);

  const [policy, setPolicy] = useState(state?.policy || null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
    userId: "",
  });

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const policyId = state?.policy?._id;
        if (!policyId) {
          toast.error("No policy provided.");
          navigate("/super-admin/policy");
          return;
        }

        const res = await getAPI(`/api/getPolicy/${policyId}`);
        if (!res.hasError) {
          const fetched = res.data.data;
          setPolicy(fetched);

          setFormData({
            title: fetched.title || "",
            description: fetched.description || "", 
            status: fetched.status || "draft",
            userId: localStorage.getItem("userId") || "",
          });
        } else {
          toast.error(res.message || "Failed to fetch policy.");
        }
      } catch (err) {
        console.error("Error fetching policy:", err);
        toast.error("Failed to fetch policy.");
      }
    };

    fetchPolicy();
  }, [state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sanitizeHtml = (html) => {
    return typeof window !== "undefined" ? DOMPurify.sanitize(html) : html;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: sanitizeHtml(formData.description),
      status: formData.status,
    };

    try {
      const response = await putAPI(`/api/updatePolicy/${policy._id}`, payload);

      if (!response.hasError) {
        toast.success("Policy updated successfully.");
        navigate("/super-admin/policy", {
          state: { updatedPolicy: response.data.data },
        });
      } else {
        toast.error(response.message || "Failed to update policy.");
      }
    } catch (err) {
      console.error("Error updating policy:", err);
      toast.error("An error occurred while updating policy.");
    }
  };

  return (
    <div className="block-header">
      <div className="row">
        <h2>Update Policy</h2>
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
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
                <div className="form-group">
                  <label>Description</label>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={formData.description}
                    onChange={(content) =>
                      setFormData((prev) => ({ ...prev, description: content }))
                    }
                    className="mt-2"
                  />
                </div>

                

                <button type="submit" className="btn btn-primary">
                  Update Policy
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePolicy;
