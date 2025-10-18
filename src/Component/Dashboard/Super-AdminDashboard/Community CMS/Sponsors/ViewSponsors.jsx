import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewSponsors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sponsor = location.state?.sponsor;

  if (!sponsor) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <h5 className="text-muted mb-3">No sponsor data found.</h5>
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const { promotedBy, promotionDetails } = sponsor;

  return (
    <div className="container-fluid py-4 position-relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-light border position-absolute top-0 start-0 mt-3 ms-3"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="text-center mb-4">
        <h4 className="fw-bold">View Sponsored Post</h4>
        <p className="text-muted">Details of the promoted post and its campaign</p>
      </div>

      {/* Card */}
      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-body">
          {/* Promoter Info */}
          <div className="mb-4 border-bottom pb-3">
            <h5 className="fw-semibold mb-3">Promoter Information</h5>
            <div className="d-flex align-items-center">
              <img
                src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${promotedBy?.profilePhoto || "/default-avatar.png"}`}
                alt="User"
                className="rounded-circle border me-3"
                width="70"
                height="70"
                style={{ objectFit: "cover" }}
              />
              <div>
                <p className="mb-1"><strong>Name:</strong> {promotedBy.username}</p>
                <p className="mb-0"><strong>Email:</strong> {promotedBy.email}</p>
              </div>
            </div>
          </div>

          {/* Post Image & Caption */}
          <div className="mb-4 border-bottom pb-3">
            <h5 className="fw-semibold mb-3">Post Details</h5>
            <div className="text-center mb-3">
              {sponsor.images && sponsor.images.length > 0 ? (
                <img
                  src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${sponsor.images[0]}`}
                  alt="Sponsored Post"
                  className="img-fluid rounded border"
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              ) : (
                <p className="text-muted">No image available</p>
              )}
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Caption</label>
                <input
                  type="text"
                  className="form-control"
                  value={sponsor.caption || "No caption"}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  value={promotionDetails.categoryName || "N/A"}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Promotion Info */}
          <div className="mb-4 border-bottom pb-3">
            <h5 className="fw-semibold mb-3">Campaign Information</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Goal</label>
                <input
                  type="text"
                  className="form-control"
                  value={promotionDetails.goal || "N/A"}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Estimated Reach</label>
                <input
                  type="text"
                  className="form-control"
                  value={promotionDetails.estimatedReach || "N/A"}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Budget Info */}
          <div className="mb-4 border-bottom pb-3">
            <h5 className="fw-semibold mb-3">Budget & Payment</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Daily Budget (₹)</label>
                <input
                  type="text"
                  className="form-control"
                  value={promotionDetails.dailyBudget || 0}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Total Budget (₹)</label>
                <input
                  type="text"
                  className="form-control"
                  value={promotionDetails.totalBudget || 0}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">GST Amount (₹)</label>
                <input
                  type="text"
                  className="form-control"
                  value={promotionDetails.gstAmount || 0}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Payment Status</label>
                <input
                  type="text"
                  className={`form-control ${
                    promotionDetails.paymentStatus === "paid"
                      ? "text-success fw-semibold"
                      : "text-danger fw-semibold"
                  }`}
                  value={
                    promotionDetails.paymentStatus === "paid" ? "Paid" : "Unpaid"
                  }
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Campaign Status</label>
                <input
                  type="text"
                  className={`form-control ${
                    promotionDetails.status === "active"
                      ? "text-success fw-semibold"
                      : promotionDetails.status === "pending"
                      ? "text-warning fw-semibold"
                      : "text-secondary fw-semibold"
                  }`}
                  value={promotionDetails.status || "N/A"}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Duration Info */}
          <div>
            <h5 className="fw-semibold mb-3">Duration</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Duration (Days)</label>
                <input
                  type="text"
                  className="form-control"
                  value={promotionDetails.durationDays || 0}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Start Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    promotionDetails.startDate
                      ? new Date(promotionDetails.startDate).toLocaleDateString()
                      : "N/A"
                  }
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">End Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    promotionDetails.endDate
                      ? new Date(promotionDetails.endDate).toLocaleDateString()
                      : "N/A"
                  }
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-4 text-muted small">
        © {new Date().getFullYear()} Sponsored Campaign Management
      </div>
    </div>
  );
};

export default ViewSponsors;
