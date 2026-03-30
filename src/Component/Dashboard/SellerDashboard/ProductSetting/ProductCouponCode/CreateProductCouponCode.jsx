import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import { getImageUrl } from "../../../../../utils/getImageUrl";

const CreateProductCouponCodeModal = ({ onClose, refreshProductCouponCodes }) => {
  const [formData, setFormData] = useState({
    userType: "seller",
    userId: localStorage.getItem("userId"),
    productId: "",
    couponName: "",
    discountPercentage: "",
    applicationType: "immediately",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await getAPI(`/api/products-by-user?userId=${userId}`, {}, true);
        if (!response.hasError) {
          setProducts(response.data.data);
          setFormData((prev) => ({ ...prev, productId: "", couponName: "", discountPercentage: "", applicationType: "immediately" }));
        } else {
          toast.error(`Failed to fetch products: ${response.message}`);
        }
      } catch (error) {
        toast.error("An error occurred while fetching products.");
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId) {
      toast.error("Please select a product.");
      return;
    }
    if (!formData.couponName.trim()) {
      toast.error("Coupon name is required.");
      return;
    }
    if (!formData.discountPercentage || formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
      toast.error("Please enter a valid discount percentage (1-100).");
      return;
    }
    if (!formData.applicationType) {
      toast.error("Please select a coupon application type.");
      return;
    }

    const payload = {
      userType: formData.userType,
      userId: formData.userId,
      productId: formData.productId,
      couponName: formData.couponName,
      discountPercentage: parseFloat(formData.discountPercentage),
      applicationType: formData.applicationType,
    };

    setLoading(true);

    try {
      const response = await postAPI("/api/createproductcouponcode", payload, {}, true);
      toast.success(response.message);
      refreshProductCouponCodes();
      onClose();
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const productOptions = products.map((product) => ({
    value: product._id,
    label: `${product.productName} (₹${product.finalPrice || "N/A"})`,
  }));

  const selectedProduct = products.find((product) => product._id === formData.productId);
  const originalPrice = selectedProduct?.finalPrice || 0;
  const discountPercentage = parseFloat(formData.discountPercentage) || 0;
  const discountAmount = (originalPrice * discountPercentage) / 100;
  const finalPrice = originalPrice - discountAmount;

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
      <div className="modal-dialog modal-lg" style={{ maxWidth: "800px" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Product Coupon Code</h5>
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
            <div
              className="modal-body"
              style={{
                maxHeight: "calc(100vh - 200px)",
                overflowY: "auto",
              }}
            >
              <div className="mb-3">
                <label htmlFor="productId" className="form-label">
                  Product
                </label>
                <Select
                  id="productId"
                  name="productId"
                  options={productOptions}
                  value={productOptions.find((option) => option.value === formData.productId) || null}
                  onChange={(option) => handleChange("productId", option ? option.value : "")}
                  placeholder="Select Product"
                  isClearable
                />
              </div>
              {selectedProduct && (
                <div className="mb-3">
                  <label>Product Details</label>
                  <div className="d-flex align-items-center">
                    <img
                      src={getImageUrl(selectedProduct.mainImage)}
                      alt={selectedProduct.productName}
                      className="img-thumbnail mr-3"
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                    <div>
                      <p><strong>Product Name:</strong> {selectedProduct.productName}</p>
                      <p><strong>Price:</strong> ₹{selectedProduct.finalPrice || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Coupon Details</label>
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="couponName" className="form-label">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="couponName"
                      name="couponName"
                      value={formData.couponName}
                      onChange={(e) => handleChange("couponName", e.target.value)}
                      disabled={!formData.productId}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="discountPercentage" className="form-label">
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="discountPercentage"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={(e) => handleChange("discountPercentage", e.target.value)}
                      min="1"
                      max="100"
                      step="0.01"
                      disabled={!formData.productId}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Coupon Application Type</label>
                <div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="applicationType"
                      id="immediatelyApplied"
                      value="immediately"
                      checked={formData.applicationType === "immediately"}
                      onChange={(e) => handleChange("applicationType", e.target.value)}
                      disabled={!formData.productId}
                    />
                    <label className="form-check-label" htmlFor="immediatelyApplied">
                      Immediately Applied Coupon
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="applicationType"
                      id="afterCheckoutApplied"
                      value="afterCheckout"
                      checked={formData.applicationType === "afterCheckout"}
                      onChange={(e) => handleChange("applicationType", e.target.value)}
                      disabled={!formData.productId}
                    />
                    <label className="form-check-label" htmlFor="afterCheckoutApplied">
                      After Checkout Applied Coupon
                    </label>
                  </div>
                </div>
              </div>
              {selectedProduct && formData.discountPercentage > 0 && (
                <div className="mb-3">
                  <label>Price Calculation</label>
                  <div className="row">
                    <div className="col-md-4">
                      <p><strong>Original Price:</strong> ₹{originalPrice.toFixed(2)}</p>
                    </div>
                    <div className="col-md-4">
                      <p><strong>Discount ({formData.discountPercentage}%):</strong> ₹{discountAmount.toFixed(2)}</p>
                    </div>
                    <div className="col-md-4">
                      <p><strong>Final Price:</strong> ₹{finalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}
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
                {loading ? "Adding..." : "Add Product Coupon Code"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductCouponCodeModal;
