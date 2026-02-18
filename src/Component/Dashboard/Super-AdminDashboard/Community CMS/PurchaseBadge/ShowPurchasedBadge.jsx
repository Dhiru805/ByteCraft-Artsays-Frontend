import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ShowPurchasedBadge = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h5 className="text-muted">No badge data found.</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">
            {user.username}'s Purchased Badges
          </h3>
          <p className="text-muted mb-0">{user.email}</p>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {user.verified && user.verified.length > 0 ? (
        <div className="row g-4">
          {user.verified.map((badge, i) => (
            <div className="col-md-4 col-lg-3" key={i}>
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${badge.badgeImage}`}
                  className="card-img-top p-3"
                  alt={badge.badgeName}
                  style={{ height: "180px", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{badge.badgeName}</h5>
                  <p className="card-text text-muted small mb-2">
                    {badge.badgeDescription}
                  </p>
                  <p className="fw-semibold text-success">
                    ₹{badge.badgePrice}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted mt-5">
          This user has not purchased any badges yet.
        </p>
      )}
    </div>
  );
};

export default ShowPurchasedBadge;
