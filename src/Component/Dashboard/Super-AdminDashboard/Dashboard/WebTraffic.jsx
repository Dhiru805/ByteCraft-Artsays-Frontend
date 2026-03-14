import React, { useState } from "react";

const BAR_COLORS = ["bg-blue","bg-green","bg-orange","bg-red","bg-cyan","bg-purple","bg-blush","bg-yellow","bg-blue","bg-green"];

const FILTERS = [
  { value: "all",    label: "All Time" },
  { value: "today",  label: "Today" },
  { value: "7days",  label: "Last 7 Days" },
  { value: "month",  label: "Last Month" },
  { value: "custom", label: "Custom" },
];

function pathToName(path) {
  const clean = path.replace(/\/$/, "");
  const segments = clean.split("/").filter(Boolean);
  if (segments.length === 0) return "Home";
  return segments
    .map(s => s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()))
    .join(" › ");
}

export default function WebTraffic({ pageViews = {}, totalViews = 0, loading, onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo]     = useState("");

  const handleFilter = (val) => {
    setActiveFilter(val);
    if (val !== "custom") {
      setFrom("");
      setTo("");
      if (onFilterChange) onFilterChange({ filter: val });
    }
  };

  const handleApplyCustom = () => {
    if (!from || !to) return;
    if (onFilterChange) onFilterChange({ filter: "custom", from, to });
  };

  const entries = Object.entries(pageViews)
    .filter(([path]) => !path.toLowerCase().includes("community"))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const maxVal = entries.length > 0 ? entries[0][1] : 1;

  return (
    <div className="card" style={{ height: "100%" }}>
      <div className="header d-flex justify-content-between align-items-center flex-wrap" style={{ gap: 8 }}>
        <h2>Page Traffic <small>Top visited pages</small></h2>
        <div className="d-flex flex-column align-items-center flex-wrap" style={{ gap: 6 }}>
          {totalViews > 0 && (
            <small className="text-muted ml-auto">
              <i className="fa fa-eye mr-1"></i>
              {totalViews.toLocaleString("en-IN")}
            </small>
          )}
          <div className="btn-group btn-group-sm">
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`btn ${activeFilter === f.value ? "btn-primary" : "btn-outline-secondary"}`}
                style={{ fontSize: 11, padding: "2px 8px" }}
                onClick={() => handleFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {activeFilter === "custom" && (
            <div className="d-flex align-items-center flex-wrap" style={{ gap: 4 }}>
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ fontSize: 11, width: 130 }}
                value={from}
                max={to || undefined}
                onChange={e => setFrom(e.target.value)}
              />
              <span style={{ fontSize: 11 }}>to</span>
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ fontSize: 11, width: 130 }}
                value={to}
                min={from || undefined}
                onChange={e => setTo(e.target.value)}
              />
              <button
                className="btn btn-sm btn-success"
                style={{ fontSize: 11, padding: "2px 10px" }}
                disabled={!from || !to}
                onClick={handleApplyCustom}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="body" style={{ maxHeight: 380, overflowY: "auto" }}>
        {loading ? (
          <p className="text-muted text-center py-4">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-muted text-center py-4">No traffic data yet</p>
        ) : (
          <ul className="list-unstyled mb-0">
            {entries.map(([path, count], i) => (
              <li key={i} className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small className="font-weight-bold text-truncate" style={{ maxWidth: "75%", fontSize: 12 }} title={path}>
                    {pathToName(path)}
                  </small>
                  <small className="text-muted">{count.toLocaleString("en-IN")}</small>
                </div>
                <div className="progress" style={{ height: 6, borderRadius: 3, background: "#f0f0f0" }}>
                  <div
                    className={`progress-bar ${BAR_COLORS[i % BAR_COLORS.length]}`}
                    style={{ width: `${Math.round((count / maxVal) * 100)}%`, borderRadius: 3 }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
