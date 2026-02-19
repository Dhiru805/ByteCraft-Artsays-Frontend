import React from "react";
import { useNavigate } from "react-router-dom";

const SECTIONS = [
  { key: "blogs",       title: "Blog Posts",  icon: "fa-pencil",   route: "/super-admin/blogs",                nameKey: "blogName",    statusKey: "blogStatus" },
  { key: "challenges",  title: "Challenges",  icon: "fa-trophy",   route: "/super-admin/challenges",            nameKey: "title",       statusKey: "status",    fallbackKey: "challengeName" },
  { key: "exhibitions", title: "Exhibitions", icon: "fa-building", route: "/super-admin/exhibition-management", nameKey: "title",       statusKey: "status" },
];

function statusBadge(status) {
  if (!status) return "badge-secondary";
  if (["Published", "Active", "Approved"].includes(status)) return "badge-success";
  if (["Pending", "Review"].includes(status)) return "badge-warning";
  return "badge-secondary";
}

export default function ContentOverview({ contentSnapshot = {}, loading }) {
  const navigate = useNavigate();
  return (
    <div className="row clearfix">
      {SECTIONS.map((sec) => {
        const items = contentSnapshot[sec.key] || [];
        return (
          <div key={sec.key} className="col-lg-4 col-md-12">
            <div className="card">
              <div className="header d-flex justify-content-between">
                <h2>
                  <i className={`fa ${sec.icon} mr-2`}></i>
                  {sec.title}
                </h2>
                <div className="d-none d-md-block text-right">
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate(sec.route)}>
                    View All
                  </button>
                </div>
              </div>
              <div className="body" style={{ paddingTop: 0 }}>
                {loading ? (
                  <p className="text-muted text-center py-3">Loading...</p>
                ) : items.length === 0 ? (
                  <p className="text-muted text-center py-3">No records found</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {items.slice(0, 5).map((item, i) => (
                      <li
                        key={item._id || i}
                        className="list-group-item d-flex justify-content-between align-items-center px-0"
                      >
                          <span className="text-truncate" style={{ maxWidth: "70%", fontSize: 13 }}>
                            {item[sec.nameKey] || (sec.fallbackKey && item[sec.fallbackKey]) || "(Untitled)"}
                          </span>
                        <span className={`badge ${statusBadge(item[sec.statusKey])}`}>
                          {item[sec.statusKey] || "—"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
