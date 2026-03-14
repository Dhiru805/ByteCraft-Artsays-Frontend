import React from "react";

export default function RiskAlerts({ riskAlerts = [], stats = {}, pendingApprovals = [] }) {
  const alerts = [];

  const totalPending = pendingApprovals.length;
  if (totalPending > 10)
    alerts.push({ level: "medium", badge: "badge-warning", icon: "fa-exclamation-triangle", title: "Approval Backlog", desc: `${totalPending} items pending approval` });

  if ((stats.pendingProducts || 0) > 5)
    alerts.push({ level: "high", badge: "badge-danger", icon: "fa-exclamation-circle", title: "High Pending Products", desc: `${stats.pendingProducts} products awaiting approval` });

  const stuckCount = pendingApprovals.filter(a => a.createdAt && (Date.now() - new Date(a.createdAt)) > 3 * 86400000).length;
  if (stuckCount > 0)
    alerts.push({ level: "high", badge: "badge-danger", icon: "fa-clock-o", title: "Stuck Approvals", desc: `${stuckCount} request(s) pending 3+ days` });

  riskAlerts.forEach(r => alerts.push({
    ...r,
    badge: r.level === "high" ? "badge-danger" : r.level === "medium" ? "badge-warning" : "badge-info",
    icon:  r.level === "high" ? "fa-exclamation-circle" : "fa-exclamation-triangle",
  }));

  const criticalCount = alerts.filter(a => a.level === "high").length;

  return (
    <div className="card">
      <div className="header d-flex justify-content-between">
        <h2>
          Risk Alerts
        </h2>
        {criticalCount > 0 ? (
            <small className="ml-2 badge badge-danger">{criticalCount} critical</small>
          ) : alerts.length > 0 ? (
            <small className="ml-2 badge badge-warning">{alerts.length} warning</small>
          ) : (
            <small className="ml-2 badge badge-success">All Clear</small>
          )}
      </div>
      <div className="body">
        {alerts.length === 0 ? (
          <div className="text-center" style={{ padding: "30px 0" }}>
            <i className="fa fa-shield fa-3x text-success mb-3" style={{ display: "block" }}></i>
            <p className="text-muted mb-0">No risk alerts detected</p>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {alerts.map((a, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span style={{ fontSize: 13 }}>
                  <i className={`fa ${a.icon} mr-2 text-muted`}></i>
                  <strong>{a.title}</strong>
                  <span className="text-muted"> — {a.desc}</span>
                </span>
                <span className={`badge ${a.badge}`}>{a.level}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
