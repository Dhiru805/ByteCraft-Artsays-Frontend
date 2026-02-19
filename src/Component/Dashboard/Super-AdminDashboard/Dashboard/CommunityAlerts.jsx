import React from "react";
import { useNavigate } from "react-router-dom";

export default function CommunityAlerts({ reports = [], loading }) {
  const navigate = useNavigate();
  const pending = reports.filter(r => (r.status || "").toLowerCase() === "pending").length;

  return (
    <div className="row clearfix">
      <div className="col-lg-12">
        <div className="card">
          <div className="header d-flex justify-content-between">
            <h2>
              Community Reports
            </h2>
            <div className="d-none d-md-block text-right">
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/super-admin/community-management")}>
                View All Reports
              </button>
            </div>
          </div>
          <div className="body">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Reported By</th>
                      <th>Reported User</th>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-3 text-muted">Loading...</td></tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-muted">
                        <i className="fa fa-check-circle text-success mr-2"></i>No community reports
                      </td>
                    </tr>
                  ) : (
                      reports.slice(0, 10).map((r, i) => {
                        const reporterName = r.reporter ? `${r.reporter.name || ""} ${r.reporter.lastName || ""}`.trim() : (r.reporterName || "—");
                        const reportedUser = r.reportedUser ? `${r.reportedUser.name || ""} ${r.reportedUser.lastName || ""}`.trim() : "—";
                        return (
                          <tr key={r._id || i}>
                            <td>{i + 1}</td>
                            <td>{reporterName}</td>
                            <td>{reportedUser}</td>
                            <td><span className="badge badge-secondary">{r.reportType || r.type || "—"}</span></td>
                            <td>{r.reason || "—"}</td>
                            <td>
                              <span className={`badge badge-${(r.status||"").toLowerCase() === "resolved" ? "success" : (r.status||"").toLowerCase() === "pending" ? "warning" : "secondary"}`}>
                                {r.status || "pending"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
