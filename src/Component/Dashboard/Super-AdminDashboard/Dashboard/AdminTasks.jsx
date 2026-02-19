import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminTasks({ stats = {}, pendingApprovals = [], communityReports = [] }) {
  const navigate = useNavigate();

    const pendingBlogs       = pendingApprovals.filter(a => a.type === "Blog").length;
    const pendingExhibitions = pendingApprovals.filter(a => a.type === "Exhibition").length;
  const pendingProducts    = stats.pendingProducts || 0;
  const pendingReports = communityReports.filter(r => (r.status || "").toLowerCase() === "pending").length;

  const tasks = [
    { icon: "fa-image",    badge: "badge-warning", label: "Products pending approval",       count: pendingProducts,    route: "artist-management/product-request" },
    { icon: "fa-pencil",   badge: "badge-info",    label: "Blog requests need review",        count: pendingBlogs,       route: "blogs" },
    { icon: "fa-building", badge: "badge-primary", label: "Exhibitions awaiting decision",    count: pendingExhibitions, route: "exhibition-management" },
    { icon: "fa-flag",     badge: "badge-danger",  label: "Community reports need review",    count: pendingReports,     route: "community-management" },
  ].filter(t => t.count > 0);

  return (
    <div className="card">
      <div className="header d-flex justify-content-between">
        <h2>
          Action Required
        </h2>
        {tasks.length > 0 && (
            <small className="ml-2 badge badge-warning">{tasks.length} pending</small>
          )}
      </div>
      <div className="body">
        {tasks.length === 0 ? (
          <div className="text-center" style={{ padding: "30px 0" }}>
            <i className="fa fa-check-circle fa-3x text-success mb-3" style={{ display: "block" }}></i>
            <p className="text-muted mb-0">All clear — no pending actions</p>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {tasks.map((t, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center px-0"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/super-admin/${t.route}`)}
              >
                <span style={{ fontSize: 13 }}>
                  <i className={`fa ${t.icon} mr-2 text-muted`}></i>
                  {t.label}
                </span>
                <span className={`badge ${t.badge}`}>{t.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
