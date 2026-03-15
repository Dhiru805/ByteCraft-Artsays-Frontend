import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import putAPI from "../../../../../api/putAPI";
import useUserType from "../../../urlconfig";
import { getImageUrl } from "../../../../../utils/getImageUrl";

const STATUS_COLORS = {
  Ordered: "#17a2b8",
  "Payment Pending": "#ffc107",
  "Payment Received": "#28a745",
  "Handling Time": "#fd7e14",
  "Order Confirmed": "#007bff",
  "Ready for Dispatch": "#6f42c1",
  Shipped: "#20c997",
  "Out for Delivery": "#17a2b8",
  Delivered: "#28a745",
  Completed: "#28a745",
  Cancelled: "#dc3545",
  "Return Requested": "#dc3545",
  "Refund Approved": "#ffc107",
  Resale: "#ff6600",
};

const TIMELINE_STEPS = [
  { key: "Ordered", label: "Order Placed", icon: "fa-shopping-cart" },
  { key: "Handling Time", label: "Processing", icon: "fa-cogs" },
  { key: "Shipped", label: "Shipped", icon: "fa-truck" },
  { key: "Out for Delivery", label: "Out for Delivery", icon: "fa-motorcycle" },
  { key: "Delivered", label: "Delivered", icon: "fa-check-circle" },
];

const STATUS_TO_STEP = {
  Ordered: 0,
  "Payment Pending": 0,
  "Payment Received": 0,
  "Handling Time": 1,
  "Order Confirmed": 1,
  "Ready for Dispatch": 1,
  Shipped: 2,
  "Out for Delivery": 3,
  Delivered: 4,
  Completed: 4,
};

const ArtistOrderView = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const rawUserType = useUserType();
  const userType = rawUserType?.toLowerCase();
  const BASE_URL = getImageUrl(null);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelComment, setCancelComment] = useState("");

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Please select a reason for cancellation.");
      return;
    }
    setCancelling(true);
    try {
      const res = await putAPI(`/api/buyer-order-list/cancel/${order.orderId}`, {
        cancelReason,
        cancelComment,
      });
      if (res?.data) {
        alert("Order cancelled and refund processed successfully.");
        setOrder((prev) => ({ ...prev, orderStatus: "Cancelled", cancelReason, cancelComment }));
        setShowCancelModal(false);
        setCancelReason("");
        setCancelComment("");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      alert(error?.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getAPI(`/api/order-detail/${orderId}`, {}, true, false);
        if (res?.data?.success) {
          setOrder(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return <OrderViewSkeleton />;

  if (!order) {
    return (
      <div className="container-fluid">
        <div className="card">
          <div className="body text-center py-5">
            <i className="fa fa-exclamation-circle fa-3x text-muted mb-3" style={{ display: "block" }}></i>
            <h4>Order not found</h4>
            <button className="btn btn-primary btn-sm mt-3" onClick={() => navigate(-1)}>
              <i className="fa fa-arrow-left mr-1"></i> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orderStatus = order.orderStatus || "Ordered";
  const isCancelled = orderStatus === "Cancelled";
  const isResale = order.isResale;
  const activeStep = STATUS_TO_STEP[orderStatus] ?? 0;
  const buyer = order.Buyer || {};
  const address = order.BuyerSelectedAddress || order.deliveryAddress || {};
  const items = order.items || [];
  const createdAt = order.createdAt || order.purchaseDate;

  const buildImageUrl = (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <div className="container-fluid">
      {/* Breadcrumb */}
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Order Details</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate(`/${userType}/dashboard`)} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">
                <span onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
                  Received Orders
                </span>
              </li>
              <li className="breadcrumb-item active">Order #{order.orderId}</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 text-right">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
              <i className="fa fa-arrow-left mr-1"></i> Back
            </button>
          </div>
        </div>
      </div>

      {/* Order Header Card */}
      <div className="row">
        <div className="col-12">
          <div className="card" style={{ borderLeft: `4px solid ${STATUS_COLORS[orderStatus] || "#6c757d"}` }}>
            <div className="body">
              <div className="d-flex flex-wrap justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1" style={{ fontWeight: 700 }}>
                    Order #{order.orderId}
                    {isResale && (
                      <span className="badge ml-2" style={{ backgroundColor: "#ff6600", color: "#fff", fontSize: "11px", verticalAlign: "middle" }}>
                        Resale
                      </span>
                    )}
                  </h4>
                  <p className="text-muted mb-0">
                    <i className="fa fa-calendar mr-1"></i>
                    {createdAt ? new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "N/A"}
                    <span className="mx-2">|</span>
                    <i className="fa fa-credit-card mr-1"></i>
                    {order.paymentMethod || "N/A"}
                    {order.transactionId && (
                      <>
                        <span className="mx-2">|</span>
                        <i className="fa fa-hashtag mr-1"></i>
                        Txn: {order.transactionId}
                      </>
                    )}
                  </p>
                </div>
                <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: STATUS_COLORS[orderStatus] || "#6c757d",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {orderStatus}
                    </span>
                    {!isCancelled && orderStatus !== "Completed" && (
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ fontWeight: 600, borderRadius: "6px" }}
                        onClick={() => setShowCancelModal(true)}
                      >
                        <i className="fa fa-times-circle mr-1"></i>
                        Cancel / Refund Order
                      </button>
                    )}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline - only for non-cancelled orders */}
      {!isCancelled && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="header">
                <h2><i className="fa fa-truck mr-2"></i>Order Progress</h2>
              </div>
              <div className="body">
                <div className="d-flex justify-content-between align-items-start position-relative" style={{ padding: "0 20px" }}>
                  {/* Progress bar line */}
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      left: "40px",
                      right: "40px",
                      height: "3px",
                      backgroundColor: "#e9ecef",
                      zIndex: 0,
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        backgroundColor: "#28a745",
                        width: `${(activeStep / (TIMELINE_STEPS.length - 1)) * 100}%`,
                        transition: "width 0.5s ease",
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                  {TIMELINE_STEPS.map((step, idx) => {
                    const isActive = idx <= activeStep;
                    return (
                      <div key={step.key} className="text-center" style={{ flex: 1, zIndex: 1 }}>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: isActive ? "#28a745" : "#e9ecef",
                            color: isActive ? "#fff" : "#adb5bd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 8px",
                            fontSize: "16px",
                            transition: "all 0.3s ease",
                            boxShadow: isActive ? "0 2px 8px rgba(40,167,69,0.3)" : "none",
                          }}
                        >
                          <i className={`fa ${step.icon}`}></i>
                        </div>
                        <p
                          className="mb-0"
                          style={{
                            fontSize: "12px",
                            fontWeight: isActive ? 700 : 400,
                            color: isActive ? "#333" : "#adb5bd",
                          }}
                        >
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger d-flex align-items-center" style={{ borderRadius: "8px", fontSize: "15px" }}>
              <i className="fa fa-times-circle fa-2x mr-3"></i>
              <div>
                <strong>This order has been cancelled.</strong>
                {order.cancelReason && <p className="mb-0 mt-1">Reason: {order.cancelReason}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        {/* Buyer Details */}
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="header">
              <h2><i className="fa fa-user mr-2"></i>Buyer Details</h2>
            </div>
            <div className="body">
              <table className="table table-sm mb-0">
                <tbody>
                  <tr>
                    <td style={{ width: "130px", fontWeight: 600 }}><i className="fa fa-user-o mr-2 text-muted"></i>Name</td>
                    <td>{buyer.fullName || buyer.name || "N/A"}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}><i className="fa fa-envelope-o mr-2 text-muted"></i>Email</td>
                    <td>{buyer.email || "N/A"}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}><i className="fa fa-phone mr-2 text-muted"></i>Phone</td>
                    <td>{buyer.phone || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="header">
              <h2><i className="fa fa-map-marker mr-2"></i>Shipping Address</h2>
            </div>
            <div className="body">
              {address && Object.keys(address).length > 0 ? (
                <div>
                  <p className="mb-1" style={{ fontWeight: 600 }}>{address.fullName || buyer.fullName || ""}</p>
                  <p className="mb-1">{[address.line1, address.line2].filter(Boolean).join(", ")}</p>
                  {address.landmark && <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>Landmark: {address.landmark}</p>}
                  <p className="mb-1" style={{ fontWeight: 600 }}>
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="mb-0 text-muted">{address.country || "India"}</p>
                  {address.phone && <p className="mb-0 mt-1"><i className="fa fa-phone mr-1"></i>{address.phone}</p>}
                </div>
              ) : (
                <p className="text-muted mb-0">No address provided</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="header">
              <h2><i className="fa fa-shopping-bag mr-2"></i>Order Items ({items.length})</h2>
            </div>
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="thead-light">
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                    <tbody>
                      {items.map((item, idx) => {
                        const product = item.productId && typeof item.productId === "object" ? item.productId : null;
                        const customProduct = item.customProduct && typeof item.customProduct === "object" ? item.customProduct : null;
                        const isCustomOrder = !!customProduct;
                        const name = isCustomOrder
                          ? (customProduct.ProductName || item.name || "Custom Order")
                          : (product?.productName || item.name || "Product");
                        const image = isCustomOrder
                          ? customProduct.BuyerImage
                          : (product?.mainImage || item.image || item.mainImage);
                        const price = item.price || item.finalPrice || product?.finalPrice || 0;
                        const qty = item.quantity || item.qty || 1;

                        return (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                {image && (
                                  <img
                                    src={buildImageUrl(image)}
                                    alt={name}
                                    style={{
                                      width: "45px",
                                      height: "45px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      marginRight: "12px",
                                      border: "1px solid #eee",
                                    }}
                                  />
                                )}
                                  <div>
                                    <span
                                      style={{ fontWeight: 600, color: "#007bff", cursor: "pointer", textDecoration: "none" }}
                                      onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                                      onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                                        onClick={() => {
                                          if (isCustomOrder) {
                                            const customPath = userType === "super-admin"
                                              ? `/${userType}/customordertable/view-request`
                                              : `/${userType}/custom-order/view-request`;
                                            navigate(customPath, { state: { request: customProduct } });
                                          } else {
                                            const pid = product?._id || item.productId;
                                            if (pid) {
                                              if (userType === "artist") {
                                                navigate(`/artist/product-fetch-view-artist/${pid}`);
                                              } else if (userType === "seller") {
                                                navigate(`/seller/product-fetch-view-seller/${pid}`);
                                              } else {
                                                navigate(`/${userType}/product-fetch-view/${pid}`);
                                              }
                                            }
                                          }
                                        }}
                                    >
                                      {name}
                                    </span>
                                    {isCustomOrder && (
                                      <span className="badge ml-2" style={{ backgroundColor: "#ff8c00", color: "#fff", fontSize: "10px", verticalAlign: "middle" }}>
                                        Custom Order
                                      </span>
                                    )}
                                    {product?.estimatedDelivery && (
                                      <small className="d-block text-muted">Est. Delivery: {product.estimatedDelivery} days</small>
                                    )}
                                  </div>
                              </div>
                            </td>
                          <td>{qty}</td>
                          <td>
                            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })
                              .format(price)
                              .replace(/\.00$/, "")}
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })
                              .format(price * qty)
                              .replace(/\.00$/, "")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Order Total */}
              <div className="d-flex justify-content-end mt-3 pt-3" style={{ borderTop: "2px solid #eee" }}>
                <div style={{ minWidth: "200px" }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Subtotal:</span>
                    <span style={{ fontWeight: 600 }}>
                      {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })
                        .format(order.totalAmount || order.finalPrice || items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0))
                        .replace(/\.00$/, "")}
                    </span>
                  </div>
                  {order.IsFramed && (
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Framing:</span>
                      <span style={{ fontWeight: 600 }}>Included</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between pt-2" style={{ borderTop: "1px solid #dee2e6" }}>
                    <strong>Total:</strong>
                    <strong style={{ fontSize: "16px", color: "#28a745" }}>
                      {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })
                        .format(order.totalAmount || order.finalPrice || items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0))
                        .replace(/\.00$/, "")}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel / Refund Modal */}
      {showCancelModal && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={() => setShowCancelModal(false)}
        >
          <div
            style={{
              backgroundColor: "#fff", borderRadius: "12px", padding: "24px",
              width: "100%", maxWidth: "480px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 style={{ fontWeight: 700, marginBottom: "16px" }}>
              <i className="fa fa-exclamation-triangle text-danger mr-2"></i>
              Cancel & Refund Order
            </h5>
            <p className="text-muted" style={{ fontSize: "13px" }}>
              {order.sellerPaid
                ? "Payout was already done. Cancelling will reverse the seller payout and admin commission, and refund the full amount to buyer's wallet."
                : "Cancelling will refund the full amount to buyer's wallet."}
            </p>
            <div className="form-group">
              <label style={{ fontWeight: 600 }}>Reason for Cancellation <span className="text-danger">*</span></label>
              <select
                className="form-control"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="">-- Select Reason --</option>
                <option value="Buyer requested cancellation">Buyer requested cancellation</option>
                <option value="Out of stock">Out of stock</option>
                <option value="Product damaged">Product damaged</option>
                <option value="Delivery issue">Delivery issue</option>
                <option value="Pricing error">Pricing error</option>
                <option value="Fraudulent order">Fraudulent order</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontWeight: 600 }}>Additional Comments</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Any additional details..."
                value={cancelComment}
                onChange={(e) => setCancelComment(e.target.value)}
              ></textarea>
            </div>
            <div className="d-flex justify-content-end" style={{ gap: "10px" }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
              >
                Close
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleCancelOrder}
                disabled={cancelling}
                style={{ fontWeight: 600 }}
              >
                {cancelling ? (
                  <><i className="fa fa-spinner fa-spin mr-1"></i> Processing...</>
                ) : (
                  <><i className="fa fa-times-circle mr-1"></i> Confirm Cancel & Refund</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistOrderView;

/* Skeleton loader */
const OrderViewSkeleton = () => (
  <div className="container-fluid" style={{ opacity: 0.6 }}>
    <div className="block-header">
      <div className="row">
        <div className="col-6">
          <div style={{ height: "24px", width: "200px", backgroundColor: "#e9ecef", borderRadius: "4px", marginBottom: "8px" }}></div>
          <div style={{ height: "16px", width: "300px", backgroundColor: "#e9ecef", borderRadius: "4px" }}></div>
        </div>
      </div>
    </div>
    <div className="card">
      <div className="body">
        <div style={{ height: "80px", backgroundColor: "#f1f1f1", borderRadius: "8px" }}></div>
      </div>
    </div>
    <div className="card">
      <div className="body">
        <div style={{ height: "60px", backgroundColor: "#f1f1f1", borderRadius: "8px" }}></div>
      </div>
    </div>
    <div className="row">
      <div className="col-6">
        <div className="card">
          <div className="body">
            <div style={{ height: "120px", backgroundColor: "#f1f1f1", borderRadius: "8px" }}></div>
          </div>
        </div>
      </div>
      <div className="col-6">
        <div className="card">
          <div className="body">
            <div style={{ height: "120px", backgroundColor: "#f1f1f1", borderRadius: "8px" }}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
