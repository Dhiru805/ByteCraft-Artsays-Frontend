import React from "react";

const ICON_MAP = {
  "user-plus":    { icon: "fa-user-plus",    color: "text-info"    },
  "check-circle": { icon: "fa-check-circle", color: "text-success" },
  "shopping-bag": { icon: "fa-shopping-bag", color: "text-warning"  },
  "cog":          { icon: "fa-cog",          color: "text-muted"   },
  "flag":         { icon: "fa-flag",         color: "text-danger"  },
  "image":        { icon: "fa-image",        color: "text-primary" },
  "gavel":        { icon: "fa-gavel",        color: "text-danger"  },
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function SystemActivityLog({ activityLog = [], loading }) {
  return (
    <div className="card" style={{ height: "100%" }}>
      <div className="header">
        <h2>Recent Activity <small>Platform-wide events</small></h2>
      </div>
      <div className="body" style={{ maxHeight: 380, overflowY: "auto" }}>
        {loading ? (
          <p className="text-muted text-center py-4">Loading...</p>
        ) : activityLog.length === 0 ? (
          <p className="text-muted text-center py-4">No recent activity</p>
        ) : (
            <ul className="list-group list-group-flush">
              {activityLog.map((log, i) => {
                const cfg = ICON_MAP[log.icon] || { icon: "fa-circle", color: "text-muted" };
                return (
                  <li key={log.reference || i} className="list-group-item d-flex align-items-start px-0">
                    <i className={`fa ${cfg.icon} ${cfg.color} mr-3 mt-1`}></i>
                    <div className="flex-grow-1">
                      <div style={{ fontSize: 13 }}>
                        {log.activity || "—"}
                        {log.refTitle && <span className="text-muted"> — {log.refTitle}</span>}
                      </div>
                      <small className="text-muted">
                        {log.user && <span>{log.user} · </span>}
                        {timeAgo(log.time)}
                      </small>
                    </div>
                  </li>
                );
              })}
            </ul>
        )}
      </div>
    </div>
  );
}
