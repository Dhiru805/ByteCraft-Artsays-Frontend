import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../api/getAPI";
import putAPI from "../../api/putAPI";

// ─── SuperAdmin Notification Types ──────────────────────────────────────────
const TYPE_META = {
  // Approvals
  artist_registration: { icon: "🎨", label: "Artist Reg." },
  seller_registration: { icon: "🏪", label: "Seller Reg." },
  celebrity_request: { icon: "🌟", label: "Celebrity Req." },
  verification_request: { icon: "🔍", label: "Verification" },
  kyc_submitted: { icon: "📋", label: "KYC Sub." },
  product_upload: { icon: "📤", label: "Prod. Upload" },
  blog_submitted: { icon: "📝", label: "Blog Sub." },
  exhibition_request: { icon: "🖼️", label: "Exhib. Req." },
  challenge_entry: { icon: "🏆", label: "Challenge" },
  certification_request: { icon: "🏅", label: "Cert. Req." },
  resale_submitted: { icon: "♻️", label: "Resale Req." },
  blue_tick_request: { icon: "✅", label: "Blue Tick" },

  // Orders
  order_placed: { icon: "🛒", label: "New Order" },
  high_value_order: { icon: "💎", label: "VIP Order" },
  custom_order_created: { icon: "🎨", label: "Custom Ord." },
  order_dispute_raised: { icon: "🚨", label: "Dispute" },

  // Financial
  withdrawal_submitted: { icon: "🏦", label: "Withdrawal" },
  payment_failed: { icon: "❌", label: "Pay. Failed" },
  refund_initiated: { icon: "🔄", label: "Refund Init." },
  payout_pending: { icon: "⏳", label: "Payout Pend." },

  // Support
  ticket_created: { icon: "🎫", label: "Support" },
  ticket_escalated: { icon: "🚨", label: "Escalated" },
  enquiry_received: { icon: "📧", label: "Enquiry" },

  // System
  security_alert: { icon: "🔒", label: "Security" },
  gateway_disconnected: { icon: "🔌", label: "Gateway" },
  fraud_detected: { icon: "🚨", label: "Fraud" },
};

const getIcon = (type) => TYPE_META[type]?.icon || "🔔";
const getLabel = (type) => TYPE_META[type]?.label || "Notification";

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

const DROPDOWN_LIMIT = 6;

const SuperAdminNotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAPI(
        `/api/super-admin/notifications?limit=${DROPDOWN_LIMIT}&page=1`,
        {},
        false,
        true
      );
      if (res?.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNotificationClick = async (notif, e) => {
    e.stopPropagation();
    setOpen(false);
    if (!notif.isRead) {
      try {
        await putAPI(`/api/super-admin/notifications/${notif._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (_) {}
    }
    
    // Default redirect mapping for SuperAdmin
    const category = notif.category;
    let url = "/super-admin/notifications";
    
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
    
    navigate(url);
  };

  const handleMarkAll = async (e) => {
    e.stopPropagation();
    try {
      await putAPI(`/api/super-admin/notifications/mark-all-read`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (_) {}
  };

  const goToAll = () => {
    setOpen(false);
    navigate("/super-admin/notifications");
  };

  const NotifItem = ({ notif }) => (
    <div
      onClick={(e) => handleNotificationClick(notif, e)}
      style={{
        display: "flex",
        gap: "12px",
        padding: "12px 18px",
        background: notif.isRead ? "transparent" : "rgba(92,64,51,0.04)",
        borderBottom: "1px solid #faf7f5",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#faf7f5")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = notif.isRead
          ? "transparent"
          : "rgba(92,64,51,0.04)")
      }
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "#f5f0ee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          flexShrink: 0,
        }}
      >
        {getIcon(notif.type)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
          <p
            style={{
              fontSize: "13px",
              fontWeight: notif.isRead ? 500 : 700,
              color: "#1a1a1a",
              margin: 0,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {notif.title || getLabel(notif.type)}
          </p>
          {!notif.isRead && (
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#5C4033",
                flexShrink: 0,
                marginTop: 4,
              }}
            />
          )}
        </div>
        {notif.message && (
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              margin: "2px 0 0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {notif.message}
          </p>
        )}
        <p style={{ fontSize: "11px", color: "#9ca3af", margin: "3px 0 0" }}>
          {timeAgo(notif.createdAt)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative" ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Super Admin Notifications"
        style={{
          position: "relative",
          background: "none",
          border: "1.5px solid #e2d9d4",
          color: "#48372d",
          borderRadius: "10px",
          padding: "7px 9px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          transition: "background 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f5ede8";
          e.currentTarget.style.borderColor = "#c4a898";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "none";
          e.currentTarget.style.borderColor = "#e2d9d4";
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              minWidth: "18px",
              height: "18px",
              background: "#ef4444",
              color: "#fff",
              borderRadius: "9999px",
              fontSize: "10px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              lineHeight: 1,
              border: "2px solid #fff",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={window.innerWidth <= 768 ? {
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            top: "70px",
            width: "calc(100vw - 32px)",
            maxWidth: "360px",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            border: "1px solid #f0ebe7",
            zIndex: 9999,
            overflow: "hidden",
          } : {
            position: "absolute",
            right: 0,
            top: "calc(100% + 10px)",
            width: "360px",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            border: "1px solid #f0ebe7",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px 12px",
              borderBottom: "1px solid #f5f0ee",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>🔔</span>
              <span
                style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a" }}
              >
                Admin Panel
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: "#fee2e2",
                    color: "#ef4444",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "1px 8px",
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#5C4033",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "24px" }}>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", gap: "12px", marginBottom: "16px" }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: "#f3f4f6",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          height: 12,
                          background: "#f3f4f6",
                          borderRadius: 6,
                          marginBottom: 6,
                          width: "70%",
                        }}
                      />
                      <div
                        style={{
                          height: 10,
                          background: "#f3f4f6",
                          borderRadius: 6,
                          width: "100%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div
                style={{
                  padding: "32px 20px",
                  textAlign: "center",
                  color: "#9ca3af",
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>🔔</div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 4,
                  }}
                >
                  All clear!
                </p>
                <p style={{ fontSize: "12px" }}>
                  No new super-admin alerts at the moment.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <NotifItem key={notif._id} notif={notif} />
              ))
            )}
          </div>

          <div style={{ borderTop: "1px solid #f5f0ee", padding: "12px 18px" }}>
            <button
              onClick={goToAll}
              style={{
                width: "100%",
                padding: "10px",
                background: "#5C4033",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#4b3327")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#5C4033")
              }
            >
              Open Notification Center
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminNotificationDropdown;
