import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../api/getAPI";
import putAPI from "../../api/putAPI";
import getNotificationRedirectUrl from "../../utils/getNotificationRedirectUrl";

// Type → icon + label mapping
const TYPE_META = {
  // Auth
  registration_successful:          { icon: "🎉", label: "Welcome!" },
  email_verification_sent:          { icon: "📧", label: "Verify Email" },
  email_verified:                   { icon: "✅", label: "Email Verified" },
  login_successful:                 { icon: "🔓", label: "Login" },
  account_locked:                   { icon: "🔒", label: "Account Locked" },
  account_approved:                 { icon: "✅", label: "Account Approved" },
  account_rejected:                 { icon: "❌", label: "Account Rejected" },
  password_reset_requested:         { icon: "🔑", label: "Password Reset" },
  password_changed:                 { icon: "🔑", label: "Password Changed" },
  // Dashboard
  no_products_listed:               { icon: "📦", label: "Add Products" },
  products_live_no_sales:           { icon: "📊", label: "No Sales Yet" },
  low_wallet_balance:               { icon: "💰", label: "Low Balance" },
  pending_withdrawals:              { icon: "⏳", label: "Pending Withdrawal" },
  certification_recommended:        { icon: "🏅", label: "Get Certified" },
  insurance_recommended:            { icon: "🛡️", label: "Get Insurance" },
  exhibition_invite:                { icon: "🖼️", label: "Exhibition Invite" },
  featured_seller_announcement:     { icon: "⭐", label: "Featured Seller" },
  // Products
  product_uploaded:                 { icon: "📤", label: "Product Uploaded" },
  product_submitted_for_review:     { icon: "🔍", label: "Under Review" },
  product_approved:                 { icon: "✅", label: "Product Approved" },
  product_rejected:                 { icon: "❌", label: "Product Rejected" },
  product_updated:                  { icon: "✏️", label: "Product Updated" },
  product_deleted:                  { icon: "🗑️", label: "Product Deleted" },
  product_out_of_stock:             { icon: "⚠️", label: "Out of Stock" },
  low_stock_warning:                { icon: "⚠️", label: "Low Stock" },
  product_viewed_milestone:         { icon: "👁️", label: "View Milestone" },
  // Orders
  new_order_received:               { icon: "🛒", label: "New Order" },
  order_payment_confirmed:          { icon: "💳", label: "Payment Confirmed" },
  order_packed:                     { icon: "📦", label: "Order Packed" },
  order_shipped:                    { icon: "🚚", label: "Order Shipped" },
  order_delivered:                  { icon: "✅", label: "Delivered" },
  order_cancelled_by_buyer:         { icon: "❌", label: "Order Cancelled" },
  order_auto_cancelled:             { icon: "❌", label: "Auto Cancelled" },
  refund_initiated:                 { icon: "↩️", label: "Refund Initiated" },
  refund_completed:                 { icon: "✅", label: "Refund Completed" },
  // Wallet
  wallet_credited:                  { icon: "💚", label: "Wallet Credited" },
  wallet_debited:                   { icon: "🔴", label: "Wallet Debited" },
  transaction_recorded:             { icon: "📋", label: "Transaction" },
  wallet_topup_successful:          { icon: "💳", label: "Top-Up Success" },
  wallet_topup_failed:              { icon: "❌", label: "Top-Up Failed" },
  withdrawal_request_submitted:     { icon: "📤", label: "Withdrawal Submitted" },
  withdrawal_approved:              { icon: "✅", label: "Withdrawal Approved" },
  withdrawal_paid:                  { icon: "💵", label: "Withdrawal Paid" },
  withdrawal_rejected:              { icon: "❌", label: "Withdrawal Rejected" },
  withdrawal_limit_reached:         { icon: "🚫", label: "Limit Reached" },
  // Bidding
  product_added_to_bidding:         { icon: "🔨", label: "Added to Bidding" },
  bidding_product_updated:          { icon: "✏️", label: "Bidding Updated" },
  first_bid_received:               { icon: "🎯", label: "First Bid!" },
  new_highest_bid:                  { icon: "📈", label: "New Highest Bid" },
  auction_ending_soon:              { icon: "⏰", label: "Ending Soon" },
  auction_completed:                { icon: "🏆", label: "Auction Completed" },
  auction_restarted:                { icon: "🔄", label: "Auction Restarted" },
  bidding_pass_purchased:           { icon: "🎟️", label: "Pass Purchased" },
  bidding_pass_upgraded:            { icon: "⬆️", label: "Pass Upgraded" },
  bidding_pass_expired:             { icon: "⏳", label: "Pass Expired" },
  // Ads
  ad_campaign_created:              { icon: "📣", label: "Campaign Created" },
  ad_campaign_approved:             { icon: "✅", label: "Campaign Approved" },
  ad_campaign_rejected:             { icon: "❌", label: "Campaign Rejected" },
  ad_campaign_live:                 { icon: "🟢", label: "Campaign Live" },
  ad_campaign_paused:               { icon: "⏸️", label: "Campaign Paused" },
  ad_campaign_ended:                { icon: "🏁", label: "Campaign Ended" },
  sponsored_product_alert:          { icon: "📊", label: "Sponsored Alert" },
  // Certification
  certification_request_submitted:  { icon: "📋", label: "Cert. Submitted" },
  certification_payment_successful: { icon: "💳", label: "Cert. Payment OK" },
  certification_payment_failed:     { icon: "❌", label: "Cert. Payment Failed" },
  certification_approved:           { icon: "🏅", label: "Certified!" },
  certification_rejected:           { icon: "❌", label: "Cert. Rejected" },
  certification_expiring_soon:      { icon: "⏳", label: "Cert. Expiring" },
  // Insurance
  insurance_purchased:              { icon: "🛡️", label: "Insurance Purchased" },
  insurance_approved:               { icon: "✅", label: "Insurance Approved" },
  insurance_expiring_soon:          { icon: "⏳", label: "Insurance Expiring" },
  insurance_claim_eligible:         { icon: "📋", label: "Claim Eligible" },
  // Exhibition
  exhibition_application_submitted: { icon: "🖼️", label: "Application Sent" },
  exhibition_approved:              { icon: "✅", label: "Exhibition Approved" },
  exhibition_rejected:              { icon: "❌", label: "Exhibition Rejected" },
  exhibition_starting_soon:         { icon: "⏰", label: "Starting Soon" },
  exhibition_completed:             { icon: "🏁", label: "Exhibition Done" },
  // Badges & Membership
  premium_badge_purchased:          { icon: "⭐", label: "Badge Purchased" },
  premium_badge_activated:          { icon: "✅", label: "Badge Active" },
  premium_badge_expiring_soon:      { icon: "⏳", label: "Badge Expiring" },
  membership_purchased:             { icon: "👑", label: "Membership Active" },
  membership_expired:               { icon: "⏳", label: "Membership Expired" },
  // Custom Orders
  new_custom_order_request:         { icon: "🎨", label: "Custom Request" },
  custom_order_price_sent:          { icon: "💬", label: "Price Sent" },
  buyer_accepted_custom_price:      { icon: "✅", label: "Price Accepted" },
  buyer_rejected_custom_price:      { icon: "❌", label: "Price Rejected" },
  custom_order_payment_received:    { icon: "💳", label: "Payment Received" },
  custom_order_marked_complete:     { icon: "✅", label: "Order Complete" },
  custom_order_delivered:           { icon: "🚚", label: "Order Delivered" },
  // Packaging
  packaging_order_placed:           { icon: "📦", label: "Packaging Ordered" },
  packaging_payment_successful:     { icon: "💳", label: "Packaging Paid" },
  packaging_order_updated:          { icon: "✏️", label: "Packaging Updated" },
  packaging_order_delivered:        { icon: "✅", label: "Packaging Delivered" },
  // Coupons
  coupon_created:                   { icon: "🏷️", label: "Coupon Created" },
  coupon_updated:                   { icon: "✏️", label: "Coupon Updated" },
  coupon_expired:                   { icon: "⏳", label: "Coupon Expired" },
  coupon_usage_milestone:           { icon: "🎯", label: "Coupon Milestone" },
  // Social
  new_follower:                     { icon: "👤", label: "New Follower" },
  post_liked:                       { icon: "❤️", label: "Post Liked" },
  post_commented:                   { icon: "💬", label: "New Comment" },
  post_promoted:                    { icon: "📣", label: "Post Promoted" },
  community_reach_milestone:        { icon: "🌟", label: "Reach Milestone" },
  // System
  platform_announcement:            { icon: "📢", label: "Announcement" },
  policy_update:                    { icon: "📜", label: "Policy Update" },
  maintenance_alert:                { icon: "🔧", label: "Maintenance" },
  unauthorized_access_attempt:      { icon: "🚨", label: "Security Alert" },
  // Artist-specific extra types
  profile_incomplete:               { icon: "📝", label: "Profile Incomplete" },
  verification_submitted:           { icon: "🔍", label: "Verification Submitted" },
  verification_update_required:     { icon: "⚠️", label: "Update Required" },
  high_views_low_conversion:        { icon: "👁️", label: "Low Conversion" },
  featured_artist_announcement:     { icon: "⭐", label: "Featured Artist" },
  order_status_reminder:            { icon: "⏰", label: "Order Reminder" },
  custom_order_deadline_reminder:   { icon: "⏰", label: "Deadline Reminder" },
  auction_approved:                 { icon: "✅", label: "Auction Approved" },
  auction_won:                      { icon: "🏆", label: "Auction Won" },
  bidding_pass_assigned:            { icon: "🔗", label: "Pass Assigned" },
  blog_submitted_for_review:        { icon: "📝", label: "Blog Submitted" },
  blog_approved:                    { icon: "✅", label: "Blog Approved" },
  blog_rejected:                    { icon: "❌", label: "Blog Rejected" },
  blog_published:                   { icon: "🌐", label: "Blog Published" },
  blog_performance_milestone:       { icon: "📈", label: "Blog Milestone" },
  promotion_performance_alert:      { icon: "📈", label: "Promo Alert" },
  suspicious_login_detected:        { icon: "🚨", label: "Suspicious Login" },
    account_action_required:          { icon: "⚠️", label: "Action Required" },
    // Support Tickets
    ticket_created:                   { icon: "🎫", label: "Ticket Raised" },
    ticket_status_changed:            { icon: "🔄", label: "Ticket Status" },
    ticket_admin_reply:               { icon: "💬", label: "Support Reply" },
    ticket_escalated:                 { icon: "🚨", label: "Ticket Escalated" },
    ticket_resolved:                  { icon: "✅", label: "Ticket Resolved" },
  };

const getIcon  = (type) => TYPE_META[type]?.icon  || "🔔";
const getLabel = (type) => TYPE_META[type]?.label || "Notification";

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)     return "just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

const DROPDOWN_LIMIT = 6;

const SellerNotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [open, setOpen]                   = useState(false);
  const [loading, setLoading]             = useState(false);
  const ref                               = useRef(null);
  const navigate                          = useNavigate();
  const userId   = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType") || "Seller";
  const isArtist = userType === "Artist";
  const notifBase = isArtist ? "artist-notifications" : "seller-notifications";

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getAPI(`/api/${notifBase}/${userId}?limit=${DROPDOWN_LIMIT}&page=1`, {}, false, true);
      if (res?.data?.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (_) {}
    setLoading(false);
  }, [userId, notifBase]);

  // Fetch on mount, poll every 30s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Listen for mark-as-read events from the notifications page
  useEffect(() => {
    const handler = (e) => {
      const { notificationId, all } = e.detail || {};
      if (all) {
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } else if (notificationId) {
        setUnreadCount((c) => Math.max(0, c - 1));
        setNotifications((prev) =>
          prev.map((n) => n._id === notificationId ? { ...n, isRead: true } : n)
        );
      }
    };
    const eventName = isArtist ? "artistNotifUpdated" : "sellerNotifUpdated";
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [isArtist]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Click a notification item: mark read + navigate
  const handleNotificationClick = async (notif, e) => {
    e.stopPropagation();
    setOpen(false);
    if (!notif.isRead) {
      try {
        await putAPI(`/api/${notifBase}/${userId}/mark-read`, { notificationId: notif._id });
        setNotifications((prev) =>
          prev.map((n) => n._id === notif._id ? { ...n, isRead: true } : n)
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (_) {}
    }
    const url = getNotificationRedirectUrl(notif, userType);
    if (url) navigate(url);
  };

  // Mark all read
  const handleMarkAll = async (e) => {
    e.stopPropagation();
    try {
      await putAPI(`/api/${notifBase}/${userId}/mark-read`, { all: true });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (_) {}
  };

  const goToAll = () => {
    setOpen(false);
    navigate(userType === "Artist" ? "/artist/notifications" : "/seller/notifications");
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
      onMouseLeave={(e) => (e.currentTarget.style.background = notif.isRead ? "transparent" : "rgba(92,64,51,0.04)")}
    >
      <div
        style={{
          width: 40, height: 40, borderRadius: 12, background: "#f5f0ee",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", flexShrink: 0,
        }}
      >
        {getIcon(notif.type)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
          <p style={{
            fontSize: "13px", fontWeight: notif.isRead ? 500 : 700,
            color: "#1a1a1a", margin: 0, flex: 1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {notif.title || getLabel(notif.type)}
          </p>
          {!notif.isRead && (
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5C4033", flexShrink: 0, marginTop: 4 }} />
          )}
        </div>
        {notif.message && (
          <p style={{
            fontSize: "12px", color: "#6b7280", margin: "2px 0 0",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
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

        {/* Bell button */}
        <button
          onClick={() => setOpen((v) => !v)}
          title="Notifications"
          aria-label="Notifications"
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
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f5ede8"; e.currentTarget.style.borderColor = "#c4a898"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "#e2d9d4"; }}
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: "-4px", right: "-4px",
            minWidth: "18px", height: "18px",
            background: "#ef4444", color: "#fff",
            borderRadius: "9999px", fontSize: "10px", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 4px", lineHeight: 1, border: "2px solid #fff",
          }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 10px)",
          width: "360px", background: "#fff",
          borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          border: "1px solid #f0ebe7", zIndex: 9999, overflow: "hidden",
        }}>

          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 18px 12px", borderBottom: "1px solid #f5f0ee",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>🔔</span>
              <span style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a" }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{
                  background: "#fee2e2", color: "#ef4444",
                  borderRadius: "999px", fontSize: "11px", fontWeight: 700, padding: "1px 8px",
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                style={{ fontSize: "11px", fontWeight: 600, color: "#5C4033", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "24px" }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f3f4f6", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 12, background: "#f3f4f6", borderRadius: 6, marginBottom: 6, width: "70%" }} />
                      <div style={{ height: 10, background: "#f3f4f6", borderRadius: 6, width: "100%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center", color: "#9ca3af" }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>🔔</div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>No notifications yet</p>
                <p style={{ fontSize: "12px" }}>Order updates, bids, and more will appear here.</p>
              </div>
            ) : (
              notifications.map((notif) => <NotifItem key={notif._id} notif={notif} />)
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid #f5f0ee", padding: "12px 18px" }}>
            <button
              onClick={goToAll}
              style={{
                width: "100%", padding: "10px",
                background: "#5C4033", color: "#fff",
                border: "none", borderRadius: "12px",
                fontSize: "13px", fontWeight: 700,
                cursor: "pointer", transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#4b3327")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#5C4033")}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerNotificationDropdown;
