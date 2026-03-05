import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../api/getAPI";
import putAPI from "../../../../api/putAPI";
import deleteAPI from "../../../../api/deleteAPI";

// ─── SuperAdmin Notification Types ──────────────────────────────────────────
const TYPE_META = {
  // Approvals
  artist_registration: { icon: "🎨", color: "#8b5cf6", bg: "#ede9fe", label: "Artist Reg." },
  seller_registration: { icon: "🏪", color: "#3b82f6", bg: "#dbeafe", label: "Seller Reg." },
  celebrity_request: { icon: "🌟", color: "#f59e0b", bg: "#fef3c7", label: "Celebrity Req." },
  verification_request: { icon: "🔍", color: "#6366f1", bg: "#e0e7ff", label: "Verification" },
  kyc_submitted: { icon: "📋", color: "#10b981", bg: "#d1fae5", label: "KYC Sub." },
  product_upload: { icon: "📤", color: "#f59e0b", bg: "#fef3c7", label: "Prod. Upload" },
  blog_submitted: { icon: "📝", color: "#8b5cf6", bg: "#ede9fe", label: "Blog Sub." },
  exhibition_request: { icon: "🖼️", color: "#3b82f6", bg: "#dbeafe", label: "Exhib. Req." },
  challenge_entry: { icon: "🏆", color: "#f59e0b", bg: "#fef3c7", label: "Challenge" },
  certification_request: { icon: "🏅", color: "#10b981", bg: "#d1fae5", label: "Cert. Req." },
  resale_submitted: { icon: "♻️", color: "#6366f1", bg: "#e0e7ff", label: "Resale Req." },
  blue_tick_request: { icon: "✅", color: "#10b981", bg: "#d1fae5", label: "Blue Tick" },

  // Orders
  order_placed: { icon: "🛒", color: "#10b981", bg: "#d1fae5", label: "New Order" },
  high_value_order: { icon: "💎", color: "#ef4444", bg: "#fee2e2", label: "VIP Order" },
  custom_order_created: { icon: "🎨", color: "#8b5cf6", bg: "#ede9fe", label: "Custom Ord." },
  order_dispute_raised: { icon: "🚨", color: "#ef4444", bg: "#fee2e2", label: "Dispute" },

  // Financial
  withdrawal_submitted: { icon: "🏦", color: "#6366f1", bg: "#e0e7ff", label: "Withdrawal" },
  payment_failed: { icon: "❌", color: "#ef4444", bg: "#fee2e2", label: "Pay. Failed" },
  refund_initiated: { icon: "🔄", color: "#f59e0b", bg: "#fef3c7", label: "Refund Init." },
  payout_pending: { icon: "⏳", color: "#6b7280", bg: "#f3f4f6", label: "Payout Pend." },

  // Support
  ticket_created: { icon: "🎫", color: "#3b82f6", bg: "#dbeafe", label: "Support" },
  ticket_escalated: { icon: "🚨", color: "#ef4444", bg: "#fee2e2", label: "Escalated" },
  enquiry_received: { icon: "📧", color: "#6b7280", bg: "#f3f4f6", label: "Enquiry" },

  // System
  security_alert: { icon: "🔒", color: "#ef4444", bg: "#fee2e2", label: "Security" },
  gateway_disconnected: { icon: "🔌", color: "#ef4444", bg: "#fee2e2", label: "Gateway" },
  fraud_detected: { icon: "🚨", color: "#ef4444", bg: "#fee2e2", label: "Fraud" },
};

const getStyle = (type) => TYPE_META[type] || { icon: "🔔", color: "#6b7280", bg: "#f3f4f6", label: "Notification" };

const CATEGORY_LABELS = {
  all: "All",
  approvals: "Approvals",
  orders: "Orders",
  financial: "Financial",
  support_tickets: "Support",
  user_activity: "User Activity",
  marketing: "Marketing",
  system_alerts: "System Alerts",
};

const PRIORITY_COLORS = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#3b82f6",
  low: "#9ca3af",
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const LIMIT = 20;

const SuperAdminNotifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: "all",
    isRead: undefined,
    priority: undefined,
  });

  const fetchNotifications = useCallback(async (pg = 1, currentFilter = filter) => {
    try {
      if (pg === 1) setLoading(true);
      let query = `?page=${pg}&limit=${limit}`;
      if (currentFilter.category !== "all") query += `&category=${currentFilter.category}`;
      if (currentFilter.isRead !== undefined) query += `&isRead=${currentFilter.isRead}`;
      if (currentFilter.priority) query += `&priority=${currentFilter.priority}`;

      const res = await getAPI(`/api/super-admin/notifications${query}`, {}, false, true);
      if (res?.data?.success) {
        const incoming = res.data.notifications || [];
        setNotifications((prev) => (pg === 1 ? incoming : [...prev, ...incoming]));
        setUnreadCount(res.data.unreadCount || 0);
        setTotal(res.data.total || 0);
        setPage(pg);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [filter, limit]);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await putAPI(`/api/super-admin/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await putAPI(`/api/super-admin/notifications/mark-all-read`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteAPI(`/api/super-admin/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await handleMarkRead(notif._id);
    }

    // Redirect mapping
    const category = notif.category;
    let url = null;
    if (category === "approvals") {
      if (notif.type.includes("artist")) url = "/super-admin/artist/management";
      else if (notif.type.includes("seller")) url = "/super-admin/seller/management";
      else if (notif.type.includes("product")) url = "/super-admin/artist/artistproductrequest";
      else if (notif.type.includes("blog")) url = "/super-admin/artist/blogrequest";
    } else if (category === "orders") {
      url = "/super-admin/purchasetable";
    } else if (category === "financial") {
      url = "/super-admin/wallet-management";
    } else if (category === "support_tickets") {
      url = "/super-admin/support";
    }

    if (url) navigate(url);
  };

  const loadMore = () => {
    fetchNotifications(page + 1);
  };

  return (
    <div className="container-fluid p-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold">Notification Center</h2>
          <p className="text-muted small">Manage and track system-wide alerts</p>
        </div>
        <div className="d-flex gap-2">
          {unreadCount > 0 && (
            <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={handleMarkAllRead}>
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Categories</h6>
              <div className="d-flex flex-column gap-1">
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    className={`btn btn-sm text-start rounded-3 px-3 py-2 ${
                      filter.category === key ? "btn-primary shadow-sm" : "btn-light"
                    }`}
                    onClick={() => setFilter({ ...filter, category: key })}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <hr className="my-4 text-muted opacity-25" />

              <h6 className="fw-bold mb-3">Status</h6>
              <div className="d-flex flex-column gap-1">
                <button
                  className={`btn btn-sm text-start rounded-3 px-3 py-2 ${
                    filter.isRead === undefined ? "btn-primary shadow-sm" : "btn-light"
                  }`}
                  onClick={() => setFilter({ ...filter, isRead: undefined })}
                >
                  All Status
                </button>
                <button
                  className={`btn btn-sm text-start rounded-3 px-3 py-2 ${
                    filter.isRead === false ? "btn-primary shadow-sm" : "btn-light"
                  }`}
                  onClick={() => setFilter({ ...filter, isRead: false })}
                >
                  Unread Only
                </button>
              </div>

              <hr className="my-4 text-muted opacity-25" />

              <h6 className="fw-bold mb-3">Priority</h6>
              <div className="d-flex flex-column gap-1">
                <button
                  className={`btn btn-sm text-start rounded-3 px-3 py-2 ${
                    filter.priority === undefined ? "btn-primary shadow-sm" : "btn-light"
                  }`}
                  onClick={() => setFilter({ ...filter, priority: undefined })}
                >
                  All Priority
                </button>
                {["critical", "high", "medium", "low"].map((p) => (
                  <button
                    key={p}
                    className={`btn btn-sm text-start rounded-3 px-3 py-2 ${
                      filter.priority === p ? "btn-primary shadow-sm" : "btn-light"
                    }`}
                    onClick={() => setFilter({ ...filter, priority: p })}
                  >
                    <span
                      className="d-inline-block rounded-circle me-2"
                      style={{ width: 8, height: 8, background: PRIORITY_COLORS[p] }}
                    />
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-0">
              {loading && page === 1 ? (
                <div className="p-5 text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  <div className="display-4 mb-3">🔔</div>
                  <h5>No notifications found</h5>
                  <p className="small">Try adjusting your filters or check back later.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {notifications.map((notif) => {
                    const style = getStyle(notif.type);
                    return (
                      <div
                        key={notif._id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`list-group-item list-group-item-action p-4 border-0 border-bottom d-flex gap-4 align-items-start ${
                          !notif.isRead ? "bg-light-primary" : ""
                        }`}
                        style={{
                          backgroundColor: !notif.isRead ? "rgba(59, 130, 246, 0.04)" : "white",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          className="rounded-4 d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 56, height: 56, background: style.bg, fontSize: "24px" }}
                        >
                          {style.icon}
                        </div>
                        <div className="flex-grow-1 min-width-0">
                          <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                            <h6 className={`mb-0 ${!notif.isRead ? "fw-bold" : "fw-semibold"}`}>
                              {notif.title || style.label}
                            </h6>
                            <div className="d-flex align-items-center gap-3">
                              <span className="text-muted small whitespace-nowrap">
                                {timeAgo(notif.createdAt)}
                              </span>
                              {!notif.isRead && (
                                <span className="rounded-circle bg-primary" style={{ width: 8, height: 8 }} />
                              )}
                              <button
                                className="btn btn-link btn-sm p-0 text-muted hover-danger"
                                onClick={(e) => handleDelete(notif._id, e)}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </div>
                          </div>
                          <p className="text-muted small mb-3">{notif.message}</p>
                          <div className="d-flex gap-2">
                            <span
                              className="badge rounded-pill text-uppercase px-3 py-1.5"
                              style={{ background: style.bg, color: style.color, fontSize: "10px" }}
                            >
                              {notif.category}
                            </span>
                            <span
                              className="badge rounded-pill text-uppercase px-3 py-1.5 text-white"
                              style={{
                                background: PRIORITY_COLORS[notif.priority] || "#9ca3af",
                                fontSize: "10px",
                              }}
                            >
                              {notif.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {notifications.length > 0 && notifications.length < total && (
              <div className="card-footer bg-white border-0 text-center p-4">
                <button className="btn btn-outline-primary px-5 rounded-pill" onClick={loadMore}>
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .bg-light-primary { background-color: rgba(59, 130, 246, 0.05); }
        .hover-danger:hover { color: #ef4444 !important; }
      `}</style>
    </div>
  );
};

export default SuperAdminNotifications;
