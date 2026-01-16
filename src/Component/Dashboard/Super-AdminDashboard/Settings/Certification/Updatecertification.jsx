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
  const [price, setPrice] = useState("");
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
      setPrice(certification.price != null ? certification.price : "");
    }
  }, [certification]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!mainCategoryId) {
        toast.error("Please select a main category.");
        return;
      }
      if (!certificationName.trim()) {
        toast.error("Please enter a certification name.");
        return;
      }
      if (!Number.isInteger(Number(estimatedDays)) || Number(estimatedDays) < 1) {
        toast.error("Please enter a valid positive integer for estimated days.");
        return;
      }
      if (price === "" || isNaN(price) || Number(price) < 0) {
        toast.error("Please enter a valid non-negative price.");
        return;
      }

      const response = await putAPI(
        `/api/update-certification-setting/${certification._id}`,
        {
          certificationName: certificationName.trim(),
          mainCategoryId,
          estimatedDays: Number(estimatedDays),
          price: Number(price),
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
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Certification</h5>
            <button
              className="btn-close"
              onClick={onClose}
              style={{ background: "transparent", border: "none" }}
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleUpdate}>
              <div className="row g-3">
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
                      <option key={mainCategory._id} value={mainCategory._id}>
                        {mainCategory.mainCategoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

                <div className="col-md-4">
                  <label className="form-label">Certification Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={certificationName}
                    onChange={(e) => setCertificationName(e.target.value)}
                    disabled={!mainCategoryId}
                    placeholder={mainCategoryId ? "Enter certification name" : "Select category first"}
                    required
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Est. Days</label>
                  <input
                    type="number"
                    className="form-control"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                    disabled={!mainCategoryId}
                    min="1"
                    required
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={!mainCategoryId}
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Certification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCertificationModal;