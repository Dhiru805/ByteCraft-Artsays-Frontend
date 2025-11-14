import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewPolicy = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const policy = state?.policy;

  if (!policy) {
    return (
      <div className="container-fluid mt-5">
        <div className="alert alert-danger">
          No policy data provided. Please go back.
        </div>
        <button
          className="btn btn-secondary mt-2"
          onClick={() => navigate("/super-admin/community-cms/policies")}
        >
          Back to Policies
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-5">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Policy Details</h4>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate("/super-admin/community-cms/policies")}
          >
            Back
          </button>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <h6 className="text-muted">Question</h6>
            <p className="mb-0">{policy.question}</p>
          </div>

          <div className="mb-3">
            <h6 className="text-muted">Description</h6>
            <p className="mb-0">{policy.description}</p>
          </div>

          <div className="mb-3">
            <h6 className="text-muted">Status</h6>
            <span
              className={`badge ${
                policy.status === "published" ? "badge-success" : "badge-warning"
              }`}
            >
              {policy.status}
            </span>
          </div>

          <div>
            <h6 className="text-muted">Created At</h6>
            <p className="mb-0">
              {new Date(policy.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPolicy;
