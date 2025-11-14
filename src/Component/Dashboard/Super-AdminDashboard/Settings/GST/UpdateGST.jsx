import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import putAPI from "../../../../../api/putAPI";

const EditGSTModal = ({
  isOpen,
  onClose,
  gst,
  fetchSubGSTData,
}) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [mainCategoryId, setMainCategoryId] = useState("");
  const [percentage, setPercentage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await getAPI("/api/main-category", true);
        if (!response.hasError) {
          setMainCategories(response.data.data);
        } else {
          toast.error(`Failed to fetch Main Categories: ${response.message}`);
        }
      } catch (error) {
        toast.error("An error occurred while fetching main categories.");
      }
    };
    fetchMainCategories();
  }, []);

  useEffect(() => {
    if (gst) {
      setMainCategoryId(gst.mainCategoryId?._id || gst.mainCategoryId || "");
      setPercentage(gst.percentage || "");
    }
  }, [gst]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!mainCategoryId) {
        toast.error("Please select a main category.");
        setLoading(false);
        return;
      }
      if (!Number.isFinite(Number(percentage)) || Number(percentage) < 0) {
        toast.error("Please enter a valid non-negative percentage.");
        setLoading(false);
        return;
      }

      const response = await putAPI(
        `/api/update-gst-setting/${gst._id}`,
        {
          mainCategoryId,
          percentage: Number(percentage),
        },
        {},
        true
      );

      if (!response.hasError) {
        toast.success("GST setting updated successfully!");
        await fetchSubGSTData();
        onClose();
      } else {
        toast.error(response.message || "Failed to update GST setting.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update GST Setting</h5>
            <button
              className="btn"
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.0rem",
              }}
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="row mb-2 ml-2">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Main Category</label>
                  <select
                    className="form-control"
                    value={mainCategoryId}
                    onChange={(e) => setMainCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Select Main Category</option>
                    {mainCategories.map((mainCategory) => (
                      <option
                        key={mainCategory._id}
                        value={mainCategory._id}
                      >
                        {mainCategory.mainCategoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Percentage</label>
                  <input
                    type="number"
                    className="form-control"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    disabled={!mainCategoryId}
                    placeholder={mainCategoryId ? "Enter percentage" : "Select main category first"}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGSTModal;