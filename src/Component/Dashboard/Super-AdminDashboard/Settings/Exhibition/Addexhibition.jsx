import React, { useState } from "react";
import { toast } from "react-toastify";
import postAPI from "../../../../../api/postAPI";

const PLAN_TYPES = [
  "Featured Exhibition",
  "Sponsored Exhibition",
  "Homepage Takeover",
  "City-Based Promotion",
  "Global Promotion",
];

const AddExhibitionPlan = ({ onClose, fetchExhibitionPlans }) => {
  const [plans, setPlans] = useState([
    {
      planName: "",
      planType: "",
      price: "",
      isActive: true,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = {
      ...updatedPlans[index],
      [field]: value,
    };
    setPlans(updatedPlans);
  };

  const addNewRow = () => {
    setPlans([
      ...plans,
      {
        planName: "",
        planType: "",
        price: "",
        isActive: true,
      },
    ]);
  };

  const removeRow = (index) => {
    if (plans.length > 1) {
      setPlans(plans.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const invalid = plans.some((p) => {
      return (
        !p.planName.trim() ||
        !p.planType ||
        !p.price ||
        isNaN(p.price) ||
        Number(p.price) < 0
      );
    });

    if (invalid) {
      toast.error(
        "Please fill all fields correctly. Price must be a positive number."
      );
      setLoading(false);
      return;
    }

    const payload = plans.map((p) => ({
      planName: p.planName.trim(),
      planType: p.planType,
      price: Number(parseFloat(p.price).toFixed(2)),
      isActive: p.isActive,
    }));

    try {
      const response = await postAPI(
        "/api/create-exhibition-plan",
        payload,
        {},
        true
      );

      if (!response.hasError) {
        toast.success("Exhibition plan(s) created successfully!");
        await fetchExhibitionPlans();
        onClose();
      } else {
        toast.error(response.message || "Failed to create plans");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Exhibition Promotion Plans</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>×</span>
            </button>
          </div>

          <div
            className="modal-body"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            {plans.map((plan, index) => (
              <div key={index} className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    {}
                    <div className="col-12 mb-3 d-flex justify-content-between">
                      {plans.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeRow(index)}
                        >
                          <i className="fa fa-trash-o"></i> Remove
                        </button>
                      )}

                      {index === plans.length - 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm"
                          onClick={addNewRow}
                        >
                          <i className="fa fa-plus"></i> Add Another Plan
                        </button>
                      )}
                    </div>

                    {}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Plan Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={plan.planName}
                        onChange={(e) =>
                          handleChange(index, "planName", e.target.value)
                        }
                        placeholder="e.g. Premium Featured Month"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Plan Type</label>
                      <select
                        className="form-control"
                        value={plan.planType}
                        onChange={(e) =>
                          handleChange(index, "planType", e.target.value)
                        }
                        required
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
                        value={plan.price}
                        onChange={(e) =>
                          handleChange(index, "price", e.target.value)
                        }
                        placeholder="e.g. 9999.00"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3 d-flex align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={plan.isActive}
                          onChange={(e) =>
                            handleChange(index, "isActive", e.target.checked)
                          }
                          id={`active-${index}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`active-${index}`}
                        >
                          Active / Available for purchase
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-secondary mr-2" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save All Plans"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExhibitionPlan;
