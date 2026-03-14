import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import putAPI from "../../../../../api/putAPI";

const PLAN_TYPES = [
  "Featured Exhibition",
  "Sponsored Exhibition",
  "Homepage Takeover",
  "City-Based Promotion",
  "Global Promotion",
];

const EditExhibitionPlan = ({
  isOpen,
  onClose,
  plan,
  fetchExhibitionPlans,
}) => {
  const [formData, setFormData] = useState({
    planName: "",
    planType: "",
    price: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData({
        planName: plan.planName || "",
        planType: plan.planType || "",
        price: plan.price != null ? String(plan.price) : "",
        isActive: plan.isActive !== false,
      });
    }
  }, [plan]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!formData.planName.trim() || !formData.planType || !formData.price) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (isNaN(formData.price) || Number(formData.price) < 0) {
      toast.error("Price must be a valid positive number");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        planName: formData.planName.trim(),
        planType: formData.planType,
        price: Number(parseFloat(formData.price).toFixed(2)),
        isActive: formData.isActive,
      };

      const response = await putAPI(
        `/api/update-exhibition-plan/${plan._id}`,
        payload,
        {},
        true
      );

      if (!response.hasError) {
        toast.success("Plan updated successfully!");
        await fetchExhibitionPlans();
        onClose();
      } else {
        toast.error(response.message || "Failed to update plan");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Update failed";
      toast.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !plan) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Exhibition Plan</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>×</span>
            </button>
          </div>

          <div className="modal-body">
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">Plan Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.planName}
                  onChange={(e) => handleChange("planName", e.target.value)}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Plan Type</label>
                <select
                  className="form-control"
                  value={formData.planType}
                  onChange={(e) => handleChange("planType", e.target.value)}
                >
                  <option value="">Select Plan Type</option>
                  {PLAN_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3 d-flex align-items-center pt-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                    id="isActiveEdit"
                  />
                  <label className="form-check-label" htmlFor="isActiveEdit">
                    Active / Visible to users
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-secondary mr-2" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Plan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExhibitionPlan;
