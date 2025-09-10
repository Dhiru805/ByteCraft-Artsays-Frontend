import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAPI from "../../../../../api/getAPI";
import putAPI from "../../../../../api/putAPI";

const EditCertificationModal = ({
  isOpen,
  onClose,
  certification,
  fetchSubCertificationData,
}) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [mainCategoryId, setMainCategoryId] = useState("");
  const [certificationName, setCertificationName] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
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
    if (certification) {
      setMainCategoryId(certification.mainCategoryId?._id || certification.mainCategoryId || "");
      setCertificationName(certification.certificationName || "");
      setEstimatedDays(certification.estimatedDays || "");
    }
  }, [certification]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!mainCategoryId) {
        toast.error("Please select a main category.");
        setLoading(false);
        return;
      }
      if (!certificationName.trim()) {
        toast.error("Please enter a certification name.");
        setLoading(false);
        return;
      }
      if (!Number.isInteger(Number(estimatedDays)) || Number(estimatedDays) < 1) {
        toast.error("Please enter a valid positive integer for estimated days.");
        setLoading(false);
        return;
      }

      const response = await putAPI(
        `/api/update-certification-setting/${certification._id}`,
        {
          certificationName: certificationName.trim(),
          mainCategoryId,
          estimatedDays: Number(estimatedDays),
        },
        {},
        true
      );

      if (!response.hasError) {
        toast.success("Certification updated successfully!");
        await fetchSubCertificationData();
        onClose();
      } else {
        toast.error(response.message || "Failed to update certification.");
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
            <h5 className="modal-title">Update Certification</h5>
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
              <div className="col-md-4">
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
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Certification Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={certificationName}
                    onChange={(e) => setCertificationName(e.target.value)}
                    disabled={!mainCategoryId}
                    placeholder={mainCategoryId ? "Enter certification name" : "Select main category first"}
                    required
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">Estimated Days</label>
                  <input
                    type="number"
                    className="form-control"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                    disabled={!mainCategoryId}
                    placeholder={mainCategoryId ? "Enter days" : ""}
                    min="1"
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

export default EditCertificationModal;