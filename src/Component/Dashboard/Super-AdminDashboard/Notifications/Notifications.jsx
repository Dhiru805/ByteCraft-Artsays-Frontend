import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../api/getAPI";
import putAPI from "../../../../api/putAPI";
import deleteAPI from "../../../../api/deleteAPI";

// ─── Category tabs ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "all",            label: "All" },
  { key: "approvals",      label: "Approvals" },
  { key: "orders",         label: "Orders" },
  { key: "financial",      label: "Financial" },
  { key: "support_tickets",label: "Support" },
  { key: "user_activity",  label: "User Activity" },
  { key: "marketing",      label: "Marketing" },
  { key: "system_alerts",  label: "System Alerts" },
];

// ─── Type → icon + color map ──────────────────────────────────────────────────
const TYPE_META = {
  artist_registration:   { icon: "🎨", color: "#8b5cf6" },
  seller_registration:   { icon: "🏪", color: "#3b82f6" },
  celebrity_request:     { icon: "🌟", color: "#f59e0b" },
  verification_request:  { icon: "🔍", color: "#6366f1" },
  kyc_submitted:         { icon: "📋", color: "#10b981" },
  product_upload:        { icon: "📤", color: "#f59e0b" },
  blog_submitted:        { icon: "📝", color: "#8b5cf6" },
  exhibition_request:    { icon: "🖼️", color: "#3b82f6" },
  challenge_entry:       { icon: "🏆", color: "#f59e0b" },
  certification_request: { icon: "🏅", color: "#10b981" },
  resale_submitted:      { icon: "♻️", color: "#6366f1" },
  blue_tick_request:     { icon: "✅", color: "#10b981" },
  order_placed:          { icon: "🛒", color: "#10b981" },
  high_value_order:      { icon: "💎", color: "#ef4444" },
  custom_order_created:  { icon: "🎨", color: "#8b5cf6" },
  order_dispute_raised:  { icon: "🚨", color: "#ef4444" },
  withdrawal_submitted:  { icon: "🏦", color: "#6366f1" },
  payment_failed:        { icon: "❌", color: "#ef4444" },
  refund_initiated:      { icon: "🔄", color: "#f59e0b" },
  payout_pending:        { icon: "⏳", color: "#6b7280" },
  ticket_created:        { icon: "🎫", color: "#3b82f6" },
  ticket_escalated:      { icon: "🚨", color: "#ef4444" },
  enquiry_received:      { icon: "📧", color: "#6b7280" },
  security_alert:        { icon: "🔒", color: "#ef4444" },
  gateway_disconnected:  { icon: "🔌", color: "#ef4444" },
  fraud_detected:        { icon: "🚨", color: "#ef4444" },
};

const PRIORITY_COLORS = {
  critical: "#ef4444",
  high:     "#f97316",
  medium:   "#3b82f6",
  low:      "#9ca3af",
};

const getMeta = (type) => TYPE_META[type] || { icon: "🔔", color: "#6b7280" };

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const LIMIT = 15;

const SuperAdminNotifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [total,         setTotal]         = useState(0);
  const [totalPages,    setTotalPages]    = useState(1);
  const [page,          setPage]          = useState(1);
  const [category,      setCategory]      = useState("all");
  const [filter,        setFilter]        = useState("all"); // all | unread
  const [priority,      setPriority]      = useState("");    // "" | critical | high | medium | low
  const [loading,       setLoading]       = useState(false);
  const [deletingId,    setDeletingId]    = useState(null);

  const fetchNotifications = useCallback(async (pg = 1, cat = category, f = filter, pri = priority) => {
    setLoading(true);
    try {
      let query = `?page=${pg}&limit=${LIMIT}`;
      if (cat !== "all")  query += `&category=${cat}`;
      if (f === "unread") query += `&isRead=false`;
      if (pri)            query += `&priority=${pri}`;

      const res = await getAPI(`/api/super-admin/notifications${query}`, {}, false, true);
      if (res?.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || Math.ceil((res.data.total || 0) / LIMIT) || 1);
      }
    } catch (_) {}
    setLoading(false);
  }, [category, filter, priority]);

  useEffect(() => {
    setPage(1);
    fetchNotifications(1, category, filter, priority);
  }, [category, filter, priority]); // eslint-disable-line

  useEffect(() => {
    fetchNotifications(page, category, filter, priority);
  }, [page]); // eslint-disable-line

  const handleMarkRead = async (notifId) => {
    try {
      await putAPI(`/api/super-admin/notifications/${notifId}/read`);
      setNotifications((prev) => prev.map((n) => n._id === notifId ? { ...n, isRead: true } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
      window.dispatchEvent(new CustomEvent("superAdminNotifUpdated", { detail: { notificationId: notifId } }));
    } catch (_) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await putAPI(`/api/super-admin/notifications/mark-all-read`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      window.dispatchEvent(new CustomEvent("superAdminNotifUpdated", { detail: { all: true } }));
    } catch (_) {}
  };

  const handleDelete = async (notifId, e) => {
    e.stopPropagation();
    setDeletingId(notifId);
    try {
      await deleteAPI(`/api/super-admin/notifications/${notifId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
      setTotal((t) => Math.max(0, t - 1));
    } catch (_) {}
    setDeletingId(null);
  };

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      try {
        await putAPI(`/api/super-admin/notifications/${n._id}/read`);
        setNotifications((prev) => prev.map((item) => item._id === n._id ? { ...item, isRead: true } : item));
        setUnreadCount((c) => Math.max(0, c - 1));
        window.dispatchEvent(new CustomEvent("superAdminNotifUpdated", { detail: { notificationId: n._id } }));
      } catch (_) {}
    }
    const cat = n.category;
    let url = null;
    if (cat === "approvals") {
      if (n.type?.includes("artist"))  url = "/super-admin/artist/management";
      else if (n.type?.includes("seller")) url = "/super-admin/seller/management";
      else if (n.type?.includes("product")) url = "/super-admin/artist/artistproductrequest";
      else if (n.type?.includes("blog")) url = "/super-admin/artist/blogrequest";
    } else if (cat === "orders") {
      url = "/super-admin/purchasetable";
    } else if (cat === "financial") {
      url = "/super-admin/wallet-management";
    } else if (cat === "support_tickets") {
      url = "/super-admin/support";
    }
    if (url) navigate(url);
  };

  // ─── Styles ──────────────────────────────────────────────────────────────────
  const styles = {
    page:        { padding: "24px", background: "#f5f6fa", minHeight: "100vh" },
    header:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" },
    title:       { fontSize: "22px", fontWeight: 700, color: "#222", margin: 0 },
    badge:       { background: "#e74c3c", color: "#fff", borderRadius: "12px", fontSize: "12px", padding: "2px 8px", marginLeft: "8px" },
    headerActions: { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" },
    filterBtn: (active) => ({
      padding: "6px 14px", borderRadius: "20px", border: "1px solid #ddd",
      background: active ? "#007bff" : "#fff", color: active ? "#fff" : "#555",
      cursor: "pointer", fontSize: "13px", fontWeight: active ? 600 : 400,
    }),
    markAllBtn: {
      padding: "6px 14px", borderRadius: "6px", border: "1px solid #007bff",
      background: "#fff", color: "#007bff", cursor: "pointer", fontSize: "13px",
    },
    tabsRow: { display: "flex", gap: "8px", marginBottom: "12px", overflowX: "auto", scrollbarWidth: "none" },
    tab: (active) => ({
      padding: "6px 14px", borderRadius: "20px", border: "1px solid #ddd",
      background: active ? "#343a40" : "#fff", color: active ? "#fff" : "#555",
      cursor: "pointer", fontSize: "12px", fontWeight: active ? 600 : 400,
      whiteSpace: "nowrap",
    }),
    priorityRow: { display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto", scrollbarWidth: "none" },
    priorityBtn: (active, color) => ({
      padding: "4px 12px", borderRadius: "20px", border: `1px solid ${color}`,
      background: active ? color : "#fff", color: active ? "#fff" : color,
      cursor: "pointer", fontSize: "12px", fontWeight: active ? 600 : 400,
      whiteSpace: "nowrap",
    }),
    card: (isRead) => ({
      background: isRead ? "#fff" : "#f0f7ff",
      border:     isRead ? "1px solid #eee" : "1px solid #c8e0ff",
      borderRadius: "8px", padding: "14px 16px", marginBottom: "10px",
      display: "flex", gap: "12px", alignItems: "flex-start",
      transition: "box-shadow 0.2s, background 0.15s",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      cursor: "pointer",
    }),
    iconWrap: (color) => ({
      fontSize: "22px", lineHeight: 1, flexShrink: 0, marginTop: "2px",
      width: "40px", height: "40px", borderRadius: "10px",
      background: color + "18",
      display: "flex", alignItems: "center", justifyContent: "center",
    }),
    body: { flex: 1, minWidth: 0 },
    notifTitle: (isRead) => ({
      fontSize: "14px", fontWeight: isRead ? 500 : 700, color: "#222", marginBottom: "3px",
    }),
    notifMsg:  { fontSize: "13px", color: "#555", marginBottom: "6px" },
    meta:      { fontSize: "11px", color: "#aaa", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" },
    catBadge: (color) => ({
      background: color + "18", color, padding: "1px 7px", borderRadius: "4px",
      fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600,
    }),
    prioBadge: (color) => ({
      background: color, color: "#fff", padding: "1px 7px", borderRadius: "4px",
      fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600,
    }),
    actions:   { display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end", flexShrink: 0 },
    unreadDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#007bff" },
    actionBtn: (color) => ({
      background: "none", border: "none", color, cursor: "pointer",
      fontSize: "12px", padding: "2px 6px", borderRadius: "4px",
    }),
    emptyState: { textAlign: "center", padding: "60px 20px", color: "#999" },
    pagination: { display: "flex", gap: "8px", justifyContent: "center", marginTop: "24px", flexWrap: "wrap" },
    pageBtn: (active, disabled) => ({
      padding: "6px 12px", borderRadius: "6px", border: "1px solid #ddd",
      background: active ? "#007bff" : disabled ? "#f5f5f5" : "#fff",
      color:      active ? "#fff"    : disabled ? "#ccc"    : "#555",
      cursor: disabled ? "not-allowed" : "pointer", fontSize: "13px",
    }),
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const start = Math.max(1, page - 2);
    const end   = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return (
      <div style={styles.pagination}>
        <button style={styles.pageBtn(false, page === 1)} disabled={page === 1} onClick={() => setPage(page - 1)}>
          ‹ Prev
        </button>
        {start > 1 && <button style={styles.pageBtn(false, false)} onClick={() => setPage(1)}>1</button>}
        {start > 2 && <span style={{ padding: "6px 4px", color: "#aaa" }}>…</span>}
        {pages.map((p) => (
          <button key={p} style={styles.pageBtn(p === page, false)} onClick={() => setPage(p)}>{p}</button>
        ))}
        {end < totalPages - 1 && <span style={{ padding: "6px 4px", color: "#aaa" }}>…</span>}
        {end < totalPages && (
          <button style={styles.pageBtn(false, false)} onClick={() => setPage(totalPages)}>{totalPages}</button>
        )}
        <button style={styles.pageBtn(false, page === totalPages)} disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next ›
        </button>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          Notifications
          {unreadCount > 0 && <span style={styles.badge}>{unreadCount} unread</span>}
        </h2>
        <div style={styles.headerActions}>
          <button style={styles.filterBtn(filter === "all")}    onClick={() => setFilter("all")}>All</button>
          <button style={styles.filterBtn(filter === "unread")} onClick={() => setFilter("unread")}>Unread</button>
          {unreadCount > 0 && (
            <button style={styles.markAllBtn} onClick={handleMarkAllRead}>
              ✓ Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div style={styles.tabsRow}>
        {CATEGORIES.map((c) => (
          <button key={c.key} style={styles.tab(category === c.key)} onClick={() => setCategory(c.key)}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Priority filter */}
      <div style={styles.priorityRow}>
        <button style={styles.priorityBtn(!priority, "#6b7280")} onClick={() => setPriority("")}>All Priority</button>
        {[
          { key: "critical", color: "#ef4444" },
          { key: "high",     color: "#f97316" },
          { key: "medium",   color: "#3b82f6" },
          { key: "low",      color: "#9ca3af" },
        ].map(({ key, color }) => (
          <button key={key} style={styles.priorityBtn(priority === key, color)} onClick={() => setPriority(priority === key ? "" : key)}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary */}
      {!loading && (
        <p style={{ fontSize: "13px", color: "#888", marginBottom: "14px" }}>
          Showing {notifications.length} of {total} notification{total !== 1 ? "s" : ""}
        </p>
      )}

      {/* List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
          <div style={{ fontSize: "28px", marginBottom: "10px" }}>⏳</div>
          Loading notifications…
        </div>
      ) : notifications.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔔</div>
          <h4 style={{ margin: "0 0 6px", color: "#666" }}>No notifications</h4>
          <p style={{ margin: 0, fontSize: "14px" }}>
            {filter === "unread" ? "You're all caught up!" : "You'll see notifications here when there's activity."}
          </p>
        </div>
      ) : (
        notifications.map((n) => {
          const meta = getMeta(n.type);
          return (
            <div key={n._id} style={styles.card(n.isRead)} onClick={() => handleNotificationClick(n)}>
              <span style={styles.iconWrap(meta.color)}>{meta.icon}</span>
              <div style={styles.body}>
                <div style={styles.notifTitle(n.isRead)}>{n.title}</div>
                <div style={styles.notifMsg}>{n.message}</div>
                <div style={styles.meta}>
                  <span>{timeAgo(n.createdAt)}</span>
                  {n.category && (
                    <span style={styles.catBadge(meta.color)}>
                      {n.category.replace(/_/g, " ")}
                    </span>
                  )}
                  {n.priority && (
                    <span style={styles.prioBadge(PRIORITY_COLORS[n.priority] || "#9ca3af")}>
                      {n.priority}
                    </span>
                  )}
                </div>
              </div>
              <div style={styles.actions}>
                {!n.isRead && (
                  <>
                    <span style={styles.unreadDot} title="Unread" />
                    <button
                      style={styles.actionBtn("#007bff")}
                      onClick={(e) => { e.stopPropagation(); handleMarkRead(n._id); }}
                      title="Mark as read"
                    >
                      ✓ Read
                    </button>
                  </>
                )}
                <button
                  style={styles.actionBtn("#e74c3c")}
                  onClick={(e) => handleDelete(n._id, e)}
                  disabled={deletingId === n._id}
                  title="Delete"
                >
                  {deletingId === n._id ? "…" : "✕ Delete"}
                </button>
              </div>
            </div>
          );
        })
      )}

      {renderPagination()}
    </div>
  );
};

export default SuperAdminNotifications;
