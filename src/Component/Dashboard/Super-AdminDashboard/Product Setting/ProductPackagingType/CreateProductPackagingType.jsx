import React, { useState } from "react";
import postAPI from "../../../../../api/postAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateProductPackagingTypeModal = ({ onClose, refreshProductPackagingTypes }) => {
  const [productPackagingTypeName, setProductPackagingTypeName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productPackagingTypeName.trim()) {
      toast.error("Product Packaging Type Name is required");
      return;
    }

    const payload = {
      name: productPackagingTypeName,
    };

    setLoading(true);

    try {
      const response = await postAPI("/api/createproductpackagingtype", payload, {}, true);
      toast.success(response.message);
      refreshProductPackagingTypes();
      onClose();
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal"
      style={{
        display: "block",
        paddingLeft: "0px",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1040,
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Product Packaging Type</h5>
            <button
              className="btn"
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.0rem",
              }}
            >
              &#x2715;
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="productPackagingTypeName" className="form-label">
                  Product Packaging Type Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="productPackagingTypeName"
                  name="productPackagingTypeName"
                  value={productPackagingTypeName}
                  onChange={(e) => setProductPackagingTypeName(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Product Packaging Type"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPackagingTypeModal;