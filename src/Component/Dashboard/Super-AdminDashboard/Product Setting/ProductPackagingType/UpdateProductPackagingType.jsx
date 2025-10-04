import React, { useState, useEffect } from "react";
import putAPI from "../../../../../api/putAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductPackagingTypeModal = ({ onClose, refreshProductPackagingTypes, selectedProductPackagingType }) => {
  const [productPackagingTypeName, setProductPackagingTypeName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProductPackagingType) {
      setProductPackagingTypeName(selectedProductPackagingType.name);
    }
  }, [selectedProductPackagingType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productPackagingTypeName.trim()) {
      toast.error("Product Packaging Type Name is required");
      return;
    }

    setLoading(true);

    try {
      const response = await putAPI(`/api/updateproductpackagingtype/${selectedProductPackagingType._id}`, {
        name: productPackagingTypeName,
      });

      toast.success(response.data.message);
      refreshProductPackagingTypes();
      onClose();
    } catch (error) {
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
            <h5 className="modal-title">Update Product Packaging Type</h5>
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
                {loading ? "Updating..." : "Update Product Packaging Type"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductPackagingTypeModal;