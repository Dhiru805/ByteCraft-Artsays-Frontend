import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ViewReports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userReports = location.state?.userReports || [];
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  useEffect(() => {
    if (userReports.length === 0) {
      toast.error("No reports data found!");
      navigate("/super-admin/community-cms/reports");
    }
  }, [userReports, navigate]);

  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = userReports.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(userReports.length / reportsPerPage);

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold">
            Reports for @{userReports[0]?.reportedUser?.username}
          </h4>
          <small className="text-muted">
            User ID: {userReports[0]?.reportedUser?._id}
          </small>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary btn-sm"
        >
          ← Back
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Reporter</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentReports.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No reports found.
                    </td>
                  </tr>
                ) : (
                  currentReports.map((report, i) => (
                    <tr key={report._id}>
                      <td>{indexOfFirst + i + 1}</td>
                      <td>{report.reporter?.username || "Unknown"}</td>
                      <td>
                        {report.commentId
                          ? "Comment"
                          : report.post
                          ? "Post"
                          : "Profile"}
                      </td>
                      <td>{report.reason}</td>
                      <td>{report.description || "-"}</td>
                      <td>
                        {new Date(report.createdAt).toLocaleDateString()}{" "}
                        {new Date(report.createdAt).toLocaleTimeString()}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-info btn-sm"
                          onClick={() =>
                            navigate(
                              "/super-admin/community-cms/reports/view/preview",
                              {
                                state: { report },
                              }
                            )
                          }
                        >
                          Preview
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Prev
              </button>
              <span className="fw-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReports;
