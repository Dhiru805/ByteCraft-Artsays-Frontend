import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import postAPI from "../../../../../../src/api/postAPI"
import { toast } from "react-toastify";

const CreateVerificationBadge = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    badgeName: "",
    badgeDescription: "",
    badgePrice: "",
    badgeImage: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "badgeImage" && files[0]) {
      const file = files[0];

      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        toast.error("Only JPEG/PNG images are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB.");
        return;
      }

      setFormData({ ...formData, badgeImage: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit new badge
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = new FormData();
      submissionData.append("badgeName", formData.badgeName.trim());
      submissionData.append("badgeDescription", formData.badgeDescription.trim());
      submissionData.append("badgePrice", formData.badgePrice);

      if (formData.badgeImage) {
        submissionData.append("badgeImage", formData.badgeImage);
      }

      const response = await postAPI(
        "/api/badges",
        submissionData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success("Badge created successfully!");
        navigate("/super-admin/community-cms/verification-badge", { state: { reload: true } });
      } else {
        toast.error(response.data.message || "Failed to create badge");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating badge");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Create Verification Badge</h2>
      </div>
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                  <label>Badge Name *</label>
                  <input
                    type="text"
                    name="badgeName"
                    value={formData.badgeName}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Badge Description *</label>
                  <textarea
                    name="badgeDescription"
                    value={formData.badgeDescription}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Badge Price *</label>
                  <input
                    type="number"
                    name="badgePrice"
                    value={formData.badgePrice}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Badge Image *</label>
                  <input
                    type="file"
                    name="badgeImage"
                    accept="image/jpeg,image/png"
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                  {preview && (
                    <div className="mt-2">
                      <img
                        src={preview}
                        alt="Badge Preview"
                        style={{
                          maxWidth: "120px",
                          maxHeight: "120px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Badge"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ml-2"
                  onClick={() => navigate("/super-admin/badges")}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVerificationBadge;
