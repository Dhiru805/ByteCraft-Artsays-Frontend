import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PreviewReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state?.report;

  if (!report) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <p className="text-muted mb-3">No report data found.</p>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Report Preview</h4>
          <small className="text-muted">
            Reported User: @{report.reportedUser?.username}
          </small>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* Report Card */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="mb-3">
            <strong>Reporter:</strong>{" "}
            {report.reporter?.username || "Unknown"}
          </div>
          <div className="mb-3">
            <strong>Reason:</strong> {report.reason}
          </div>
          <div className="mb-4">
            <strong>Description:</strong>{" "}
            {report.description || (
              <span className="text-muted">No description provided</span>
            )}
          </div>

          {/* Post Preview */}
          {report.post && (
            <div className="border-top pt-3 mt-3">
              <h5 className="fw-semibold mb-2">Reported Post</h5>
              <p className="text-muted small">
                {report.post.caption || "(No caption)"}
              </p>
              {report.post.images?.length > 0 ? (
                <div className="d-flex flex-wrap gap-3">
                  {report.post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${img}`}
                      alt="Post"
                      className="rounded border"
                      style={{
                        width: "130px",
                        height: "130px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        window.open(
                          `${process.env.REACT_APP_API_URL_FOR_IMAGE}${img}`,
                          "_blank"
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted small">No images available</p>
              )}
            </div>
          )}

          {/* Comment Preview */}
          {report.commentId && (
            <div className="border-top pt-3 mt-3">
              <h5 className="fw-semibold mb-2">Reported Comment</h5>
              <div className="bg-light rounded p-3 text-dark small">
                <em>Reported comment content (to be fetched from backend)</em>
              </div>
            </div>
          )}

          {/* Footer Info */}
          <p className="text-muted small mt-4 mb-0 border-top pt-2">
            Reported on:{" "}
            {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewReport;
