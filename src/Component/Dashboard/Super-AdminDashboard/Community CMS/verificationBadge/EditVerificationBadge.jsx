import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import putAPI from "../../../../../api/putAPI";
import { toast } from "react-toastify";

const EditVerificationBadge = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const badge = state?.badge;

  const [formData, setFormData] = useState({
    badgeName: "",
    badgeDescription: "",
    badgePrice: "",
    badgeImage: null, // new file
    existingBadgeImage: null, // keep old image if not replaced
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Prefill form with selected badge data
  useEffect(() => {
    if (!badge) {
      toast.error("No badge data provided.");
      navigate("/super-admin/community-cms/verification-badge");
    } else {
      setFormData({
        badgeName: badge.badgeName || "",
        badgeDescription: badge.badgeDescription || "",
        badgePrice: badge.badgePrice || "",
        badgeImage: null,
        existingBadgeImage: badge.badgeImage || null,
      });
      setPreview(
        badge.badgeImage
          ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${badge.badgeImage}`
          : null
      );
    }
  }, [badge, navigate]);

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

  // Submit form
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
      } else if (formData.existingBadgeImage) {
        submissionData.append("existingBadgeImage", formData.existingBadgeImage);
      }

      const response = await putAPI(
        `/api/badges/${badge._id}`,
        submissionData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success("Badge updated successfully!");
        navigate("/super-admin/community-cms/verification-badge", { state: { reload: true } });
      } else {
        toast.error(response.data.message || "Failed to update badge");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating badge");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <h2>Edit Verification Badge</h2>
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
                  {loading ? "Updating..." : "Update Badge"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ml-2"
                  onClick={() => navigate("/super-admin/community-cms/verification-badge/")}
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

export default EditVerificationBadge;
