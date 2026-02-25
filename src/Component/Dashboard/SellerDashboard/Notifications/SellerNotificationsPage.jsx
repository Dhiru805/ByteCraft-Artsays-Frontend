import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../api/getAPI";
import putAPI from "../../../../api/putAPI";
import deleteAPI from "../../../../api/deleteAPI";
import getNotificationRedirectUrl from "../../../../utils/getNotificationRedirectUrl";

// ─── Category tabs ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "all",           label: "All" },
  { key: "orders",        label: "Orders" },
  { key: "wallet",        label: "Wallet" },
  { key: "products",      label: "Products" },
  { key: "bidding",       label: "Bidding" },
  { key: "ads",           label: "Ads" },
  { key: "certification", label: "Certification" },
  { key: "insurance",     label: "Insurance" },
  { key: "exhibition",    label: "Exhibition" },
  { key: "badges",        label: "Badges" },
  { key: "custom",        label: "Custom Orders" },
  { key: "packaging",     label: "Packaging" },
  { key: "coupons",       label: "Coupons" },
  { key: "social",        label: "Social" },
  { key: "auth",          label: "Account" },
  { key: "dashboard",     label: "Alerts" },
  { key: "system",        label: "System" },
];

// ─── Type → icon map ─────────────────────────────────────────────────────────
const TYPE_ICON = {
  registration_successful: "🎉", email_verification_sent: "📧", email_verified: "✅",
  login_successful: "🔓", account_locked: "🔒", account_approved: "✅",
  account_rejected: "❌", password_reset_requested: "🔑", password_changed: "🔑",
  no_products_listed: "📦", products_live_no_sales: "📊", low_wallet_balance: "💰",
  pending_withdrawals: "⏳", certification_recommended: "🏅", insurance_recommended: "🛡️",
  exhibition_invite: "🖼️", featured_seller_announcement: "⭐",
  product_uploaded: "📤", product_submitted_for_review: "🔍", product_approved: "✅",
  product_rejected: "❌", product_updated: "✏️", product_deleted: "🗑️",
  product_out_of_stock: "⚠️", low_stock_warning: "⚠️", product_viewed_milestone: "👁️",
  new_order_received: "🛒", order_payment_confirmed: "💳", order_packed: "📦",
  order_shipped: "🚚", order_delivered: "✅", order_cancelled_by_buyer: "❌",
  order_auto_cancelled: "❌", refund_initiated: "↩️", refund_completed: "✅",
  wallet_credited: "💚", wallet_debited: "🔴", transaction_recorded: "📋",
  wallet_topup_successful: "💳", wallet_topup_failed: "❌",
  withdrawal_request_submitted: "📤", withdrawal_approved: "✅", withdrawal_paid: "💵",
  withdrawal_rejected: "❌", withdrawal_limit_reached: "🚫",
  product_added_to_bidding: "🔨", bidding_product_updated: "✏️", first_bid_received: "🎯",
  new_highest_bid: "📈", auction_ending_soon: "⏰", auction_completed: "🏆",
  auction_restarted: "🔄", bidding_pass_purchased: "🎟️", bidding_pass_upgraded: "⬆️",
  bidding_pass_expired: "⏳",
  ad_campaign_created: "📣", ad_campaign_approved: "✅", ad_campaign_rejected: "❌",
  ad_campaign_live: "🟢", ad_campaign_paused: "⏸️", ad_campaign_ended: "🏁",
  sponsored_product_alert: "📊",
  certification_request_submitted: "📋", certification_payment_successful: "💳",
  certification_payment_failed: "❌", certification_approved: "🏅",
  certification_rejected: "❌", certification_expiring_soon: "⏳",
  insurance_purchased: "🛡️", insurance_approved: "✅", insurance_expiring_soon: "⏳",
  insurance_claim_eligible: "📋",
  exhibition_application_submitted: "🖼️", exhibition_approved: "✅",
  exhibition_rejected: "❌", exhibition_starting_soon: "⏰", exhibition_completed: "🏁",
  premium_badge_purchased: "⭐", premium_badge_activated: "✅",
  premium_badge_expiring_soon: "⏳", membership_purchased: "👑", membership_expired: "⏳",
  new_custom_order_request: "🎨", custom_order_price_sent: "💬",
  buyer_accepted_custom_price: "✅", buyer_rejected_custom_price: "❌",
  custom_order_payment_received: "💳", custom_order_marked_complete: "✅",
  custom_order_delivered: "🚚",
  packaging_order_placed: "📦", packaging_payment_successful: "💳",
  packaging_order_updated: "✏️", packaging_order_delivered: "✅",
  coupon_created: "🏷️", coupon_updated: "✏️", coupon_expired: "⏳",
  coupon_usage_milestone: "🎯",
  new_follower: "👤", post_liked: "❤️", post_commented: "💬",
  post_promoted: "📣", community_reach_milestone: "🌟",
  platform_announcement: "📢", policy_update: "📜",
  maintenance_alert: "🔧", unauthorized_access_attempt: "🚨",
};

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

const SellerNotificationsPage = () => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role") || "Seller";
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState("all"); // all | unread
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchNotifications = useCallback(async (pg = 1, cat = category, f = filter) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getAPI(
        `/api/seller-notifications/${userId}?page=${pg}&limit=${LIMIT}&category=${cat}&filter=${f}`
      );
      if (res?.data?.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unreadCount || 0);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (_) {}
    setLoading(false);
  }, [userId, category, filter]);

  useEffect(() => {
    setPage(1);
    fetchNotifications(1, category, filter);
  }, [category, filter]); // eslint-disable-line

  useEffect(() => {
    fetchNotifications(page, category, filter);
  }, [page]); // eslint-disable-line

    const handleMarkRead = async (notifId) => {
      try {
        await putAPI(`/api/seller-notifications/${userId}/mark-read`, { notificationId: notifId });
        setNotifications((prev) => prev.map((n) => n._id === notifId ? { ...n, isRead: true } : n));
        setUnreadCount((c) => Math.max(0, c - 1));
        window.dispatchEvent(new CustomEvent("sellerNotifUpdated", { detail: { notificationId: notifId } }));
      } catch (_) {}
    };

  const handleMarkAllRead = async () => {
    try {
      await putAPI(`/api/seller-notifications/${userId}/mark-read`, { all: true });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      window.dispatchEvent(new CustomEvent("sellerNotifUpdated", { detail: { all: true } }));
    } catch (_) {}
  };

  const handleDelete = async (notifId) => {
    setDeletingId(notifId);
    try {
      await deleteAPI(`/api/seller-notifications/${userId}/${notifId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
      setTotal((t) => Math.max(0, t - 1));
    } catch (_) {}
    setDeletingId(null);
  };

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      try {
        await putAPI(`/api/seller-notifications/${userId}/mark-read`, { notificationId: n._id });
        setNotifications((prev) => prev.map((item) => item._id === n._id ? { ...item, isRead: true } : item));
        setUnreadCount((c) => Math.max(0, c - 1));
        window.dispatchEvent(new CustomEvent("sellerNotifUpdated", { detail: { notificationId: n._id } }));
      } catch (_) {}
    }
    const url = getNotificationRedirectUrl(n, role);
    if (url) navigate(url);
  };

  // ─── Styles ───────────────────────────────────────────────────────────────
  const styles = {
    page: { padding: "24px", background: "#f5f6fa", minHeight: "100vh" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" },
    title: { fontSize: "22px", fontWeight: 700, color: "#222", margin: 0 },
    badge: { background: "#e74c3c", color: "#fff", borderRadius: "12px", fontSize: "12px", padding: "2px 8px", marginLeft: "8px" },
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
    tabsRow: { display: "flex", gap: "8px", marginBottom: "16px", overflowX: "auto", scrollbarWidth: "none" },
    tab: (active) => ({
      padding: "6px 14px", borderRadius: "20px", border: "1px solid #ddd",
      background: active ? "#343a40" : "#fff", color: active ? "#fff" : "#555",
      cursor: "pointer", fontSize: "12px", fontWeight: active ? 600 : 400,
      whiteSpace: "nowrap",
    }),
      card: (isRead) => ({
        background: isRead ? "#fff" : "#f0f7ff",
        border: isRead ? "1px solid #eee" : "1px solid #c8e0ff",
        borderRadius: "8px", padding: "14px 16px", marginBottom: "10px",
        display: "flex", gap: "12px", alignItems: "flex-start",
        transition: "box-shadow 0.2s, background 0.15s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        cursor: "pointer",
      }),
    icon: { fontSize: "24px", lineHeight: 1, flexShrink: 0, marginTop: "2px" },
    body: { flex: 1, minWidth: 0 },
    notifTitle: (isRead) => ({
      fontSize: "14px", fontWeight: isRead ? 500 : 700,
      color: "#222", marginBottom: "3px",
    }),
    notifMsg: { fontSize: "13px", color: "#555", marginBottom: "4px" },
    meta: { fontSize: "11px", color: "#aaa", display: "flex", gap: "12px", flexWrap: "wrap" },
    actions: { display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end", flexShrink: 0 },
    unreadDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#007bff" },
    actionBtn: (color) => ({
      background: "none", border: "none", color, cursor: "pointer",
      fontSize: "12px", padding: "2px 6px", borderRadius: "4px",
    }),
    emptyState: { textAlign: "center", padding: "60px 20px", color: "#999" },
    pagination: { display: "flex", gap: "8px", justifyContent: "center", marginTop: "24px", flexWrap: "wrap" },
    pageBtn: (active, disabled) => ({
      padding: "6px 12px", borderRadius: "6px",
      border: "1px solid #ddd",
      background: active ? "#007bff" : disabled ? "#f5f5f5" : "#fff",
      color: active ? "#fff" : disabled ? "#ccc" : "#555",
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: "13px",
    }),
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
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
        {end < totalPages && <button style={styles.pageBtn(false, false)} onClick={() => setPage(totalPages)}>{totalPages}</button>}
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
          <button style={styles.filterBtn(filter === "all")} onClick={() => setFilter("all")}>All</button>
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
          notifications.map((n) => (
            <div key={n._id} style={styles.card(n.isRead)} onClick={() => handleNotificationClick(n)}>
              <span style={styles.icon}>{TYPE_ICON[n.type] || "🔔"}</span>
              <div style={styles.body}>
                <div style={styles.notifTitle(n.isRead)}>{n.title}</div>
                <div style={styles.notifMsg}>{n.message}</div>
                <div style={styles.meta}>
                  <span>{timeAgo(n.createdAt)}</span>
                  <span style={{ background: "#f0f0f0", padding: "1px 6px", borderRadius: "4px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {n.type.replace(/_/g, " ")}
                  </span>
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
                  onClick={(e) => { e.stopPropagation(); handleDelete(n._id); }}
                  disabled={deletingId === n._id}
                  title="Delete"
                >
                  {deletingId === n._id ? "…" : "✕ Delete"}
                </button>
              </div>
            </div>
          ))
      )}

      {renderPagination()}
    </div>
  );
};

export default SellerNotificationsPage;
