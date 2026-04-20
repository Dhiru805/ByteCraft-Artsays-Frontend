import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../../api/getAPI";
import putAPI from "../../../../../api/putAPI";
import postAPI from "../../../../../api/postAPI";

const CATEGORY_LABELS = {
  auth: "Authentication",
  orders: "Orders",
  bidding: "Bidding",
  wallet: "Wallet",
  career: "Career",
  challenge: "Challenge",
  custom_art: "Custom Art",
  social: "Social",
  admin: "Admin",
  other: "Other",
};

const categoryOrder = [
  "orders", "auth", "bidding", "wallet", "social",
  "custom_art", "career", "challenge", "admin", "other",
];

function groupByCategory(templates) {
  const map = {};
  for (const tpl of templates) {
    const cat = tpl.category || "other";
    if (!map[cat]) map[cat] = [];
    map[cat].push(tpl);
  }
  return map;
}

const NotificationTemplatesMain = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState("");

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAPI("/api/notification-templates");
      if (res.data?.success) {
        setTemplates(res.data.data || []);
      } else {
        toast.error("Failed to load notification templates.");
      }
    } catch (err) {
      toast.error("Error loading templates: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleToggleEnabled = async (tpl) => {
    const newEnabled = !tpl.enabled;
    setTemplates((prev) =>
      prev.map((t) => (t._id === tpl._id ? { ...t, enabled: newEnabled } : t))
    );
    try {
      const res = await putAPI(`/api/notification-templates/${tpl.key}`, { enabled: newEnabled });
      if (!res.data?.success) {
        setTemplates((prev) =>
          prev.map((t) => (t._id === tpl._id ? { ...t, enabled: tpl.enabled } : t))
        );
        toast.error("Failed to update template status.");
      } else {
        toast.success(`Template ${newEnabled ? "enabled" : "disabled"}.`);
      }
    } catch {
      setTemplates((prev) =>
        prev.map((t) => (t._id === tpl._id ? { ...t, enabled: tpl.enabled } : t))
      );
      toast.error("Failed to update template status.");
    }
  };

  const handleSeedAll = async () => {
    setSeeding(true);
    try {
      const res = await postAPI("/api/notification-templates/seed", {});
      if (res.data?.success) {
        toast.success(`${res.data.count || "All"} templates seeded successfully.`);
        setTemplates(res.data.data || []);
      } else {
        toast.error("Failed to seed templates.");
      }
    } catch {
      toast.error("Failed to seed templates.");
    } finally {
      setSeeding(false);
    }
  };

  const filtered = search.trim()
    ? templates.filter(
        (t) =>
          t.name?.toLowerCase().includes(search.toLowerCase()) ||
          t.key?.toLowerCase().includes(search.toLowerCase()) ||
          t.category?.toLowerCase().includes(search.toLowerCase())
      )
    : templates;

  const grouped = groupByCategory(filtered);
  const sortedCategories = [
    ...categoryOrder.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <div id="notification-templates">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap" style={{ gap: 8 }}>
          <h5 className="mb-0">Notification Email Templates</h5>
          <div className="d-flex align-items-center" style={{ gap: 8 }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200 }}
            />
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleSeedAll}
              disabled={seeding}
              title="Add any missing default templates without overwriting customized ones"
            >
              {seeding ? "Seeding..." : "Seed Defaults"}
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 text-center text-muted">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-muted">No templates found.</p>
              <button className="btn btn-primary btn-sm" onClick={handleSeedAll} disabled={seeding}>
                {seeding ? "Seeding..." : "Seed Default Templates"}
              </button>
            </div>
          ) : (
            <>
              {sortedCategories.map((cat) => (
                <div key={cat}>
                  <div
                    className="px-4 py-2 font-weight-bold text-uppercase"
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.08em",
                      background: "#f8f9fa",
                      borderTop: "1px solid #dee2e6",
                      borderBottom: "1px solid #dee2e6",
                      color: "#6c757d",
                    }}
                  >
                    {CATEGORY_LABELS[cat] || cat}
                    <span className="badge badge-light ml-2" style={{ fontWeight: 400 }}>
                      {grouped[cat].length}
                    </span>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="thead-light" style={{ display: "none" }}>
                        <tr>
                          <th>Name</th>
                          <th>Subject</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grouped[cat].map((tpl) => (
                          <tr
                            key={tpl._id}
                            style={{ opacity: tpl.enabled ? 1 : 0.55, cursor: "default" }}
                          >
                            <td style={{ width: "28%", verticalAlign: "middle" }}>
                              <div className="font-weight-semibold" style={{ fontSize: "0.9rem" }}>
                                {tpl.name}
                              </div>
                              <small className="text-muted">
                                <code style={{ fontSize: "0.75em" }}>{tpl.key}</code>
                              </small>
                            </td>
                            <td style={{ verticalAlign: "middle", fontSize: "0.875rem" }}>
                              <span className="text-truncate d-block" style={{ maxWidth: 320 }}>
                                {tpl.subject}
                              </span>
                            </td>
                            <td style={{ width: 110, verticalAlign: "middle", textAlign: "center" }}>
                              <div className="form-check form-switch d-inline-flex align-items-center">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={!!tpl.enabled}
                                  onChange={() => handleToggleEnabled(tpl)}
                                  id={`toggle-${tpl._id}`}
                                  style={{ cursor: "pointer" }}
                                />
                                <label
                                  className="form-check-label ml-1"
                                  htmlFor={`toggle-${tpl._id}`}
                                  style={{ fontSize: "0.8rem", cursor: "pointer", userSelect: "none" }}
                                >
                                  {tpl.enabled ? "On" : "Off"}
                                </label>
                              </div>
                            </td>
                            <td style={{ width: 100, verticalAlign: "middle", textAlign: "right" }}>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() =>
                                  navigate(
                                    `/super-admin/settings/notification-templates/${tpl.key}`
                                  )
                                }
                              >
                                <i className="fa fa-pencil mr-1" />
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="card-footer text-muted small">
          {templates.length} template{templates.length !== 1 ? "s" : ""} total
          &nbsp;&bull;&nbsp;
          {templates.filter((t) => t.enabled).length} enabled
          &nbsp;&bull;&nbsp;
          {templates.filter((t) => !t.enabled).length} disabled
        </div>
      </div>
    </div>
  );
};

export default NotificationTemplatesMain;
