import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PolicyView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const policy = state?.policy;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    coverImage: null,
  });

  const [coverImagePreview, setCoverImagePreview] = useState(null);

  useEffect(() => {
    if (!policy) {
      toast.error("No policy data provided.");
      navigate("/super-admin/policy");
    } else {
      setFormData({
        title: policy.title || "",
        description: policy.description || "",
        status: policy.status || "draft",
        coverImage: null,
      });

      setCoverImagePreview(
        policy.coverImage ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}/${policy.coverImage}` : null
      );
    }
  }, [policy, navigate]);

  useEffect(() => {
    return () => {
      if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
    };
  }, [coverImagePreview]);

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>View Policy</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/policy")} style={{ cursor: "pointer" }}>
                  Policies
                </span>
              </li>
              <li className="breadcrumb-item active">View Policy</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    className="form-control"
                    placeholder="Enter Policy Title"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    className="form-control"
                    rows="6"
                    placeholder="Enter Policy Description"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <input
                    type="text"
                    id="status"
                    name="status"
                    value={formData.status}
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="coverImage">Cover Image</label>
                  {coverImagePreview && (
                    <div className="mt-2">
                      <img
                        src={coverImagePreview}
                        alt="Cover Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain" }}
                      />
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyView;
