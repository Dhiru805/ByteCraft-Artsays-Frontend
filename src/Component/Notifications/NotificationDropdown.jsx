import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../api/getAPI";
import putAPI from "../../api/putAPI";

// ─── Icon + label map for all notification types ─────────────────────────────
const TYPE_META = {
  // Social
  follow:           { icon: "👤", label: "New Follower" },
  like:             { icon: "❤️", label: "Post Liked" },
  comment:          { icon: "💬", label: "New Comment" },
  comment_like:     { icon: "❤️", label: "Comment Liked" },
  comment_reply:    { icon: "↩️", label: "Comment Reply" },
  mention:          { icon: "📣", label: "You were mentioned" },
  post_save:        { icon: "🔖", label: "Post Saved" },
  collab:           { icon: "🤝", label: "Collaboration Invite" },
  trending_post:    { icon: "🔥", label: "Trending Post" },
  post_milestone:   { icon: "🏅", label: "Post Milestone" },
  // Live
  live_started:     { icon: "🔴", label: "Live Started" },
  live_reminder:    { icon: "⏰", label: "Live Reminder" },
  live_viewer_joined: { icon: "👥", label: "Viewer Joined" },
  live_tip:         { icon: "💰", label: "Live Tip" },
  live_ended:       { icon: "🎬", label: "Live Ended" },
  // Membership
  membership_purchase_success:  { icon: "✅", label: "Membership Purchased" },
  membership_renewal_reminder:  { icon: "⏰", label: "Renewal Reminder" },
  membership_expired:           { icon: "❌", label: "Membership Expired" },
  new_membership_subscriber:    { icon: "⭐", label: "New Subscriber" },
  membership_renewal:           { icon: "🔄", label: "Subscription Renewed" },
  membership_cancelled:         { icon: "❌", label: "Subscription Cancelled" },
  membership_tier_updated:      { icon: "📈", label: "Tier Updated" },
  // Tips & Promotions
  tip_received:       { icon: "💰", label: "Tip Received" },
  promotion_approved: { icon: "✅", label: "Promotion Approved" },
  promotion_rejected: { icon: "❌", label: "Promotion Rejected" },
  promotion_ended:    { icon: "🎬", label: "Promotion Ended" },
  // Badges
  badge_purchased:  { icon: "🏆", label: "Badge Purchased" },
  badge_unlocked:   { icon: "🏅", label: "Badge Unlocked" },
  badge_revoked:    { icon: "❌", label: "Badge Revoked" },
  // Commerce (seller)
  product_linked:       { icon: "🔗", label: "Product Linked" },
  product_purchased:    { icon: "🛍️", label: "Product Purchased" },
  product_out_of_stock: { icon: "📦", label: "Out of Stock" },
  sales_milestone:      { icon: "🏆", label: "Sales Milestone" },
  low_stock:            { icon: "⚠️", label: "Low Stock" },
  // Account / System
  profile_updated:  { icon: "👤", label: "Profile Updated" },
  settings_changed: { icon: "⚙️", label: "Settings Changed" },
  security_alert:   { icon: "🔒", label: "Security Alert" },
  // Authentication
  registration_successful: { icon: "🎉", label: "Welcome to Artsays" },
  email_verification_sent: { icon: "📧", label: "Verify Your Email" },
  email_verified:          { icon: "✅", label: "Email Verified" },
  login_alert:             { icon: "🔒", label: "New Login Detected" },
  // Referral
  referral_applied:         { icon: "🎁", label: "Referral Applied" },
  referral_reward_credited: { icon: "💎", label: "Referral Reward" },
  friend_signed_up:         { icon: "👥", label: "Friend Joined" },
  signup_bonus_credited:    { icon: "🎁", label: "Signup Bonus" },
  // Wishlist / Browsing
  wishlist_price_drop:    { icon: "🏷️", label: "Price Drop" },
  wishlist_back_in_stock: { icon: "📦", label: "Back in Stock" },
  cart_low_stock:         { icon: "⚠️", label: "Low Stock Warning" },
  // Cart
  item_added_to_cart:     { icon: "🛒", label: "Added to Cart" },
  item_removed_from_cart: { icon: "🛒", label: "Removed from Cart" },
  abandoned_cart:         { icon: "🛒", label: "Abandoned Cart" },
  coupon_applied:         { icon: "🎟️", label: "Coupon Applied" },
  coupon_invalid:         { icon: "🎟️", label: "Coupon Invalid" },
  // Payments
  payment_initiated:  { icon: "💳", label: "Payment Initiated" },
  payment_successful: { icon: "✅", label: "Payment Successful" },
  payment_failed:     { icon: "❌", label: "Payment Failed" },
  retry_payment:      { icon: "🔄", label: "Retry Payment" },
  wallet_debited:     { icon: "💸", label: "Wallet Debited" },
  wallet_credited:    { icon: "💰", label: "Wallet Credited" },
  artcoins_used:      { icon: "🪙", label: "ArtCoins Used" },
  // Orders
  order_placed:     { icon: "📦", label: "Order Placed" },
  order_packed:     { icon: "📦", label: "Order Packed" },
  order_shipped:    { icon: "🚚", label: "Order Shipped" },
  order_delivered:  { icon: "✅", label: "Order Delivered" },
  order_cancelled:  { icon: "❌", label: "Order Cancelled" },
  refund_initiated: { icon: "🔄", label: "Refund Initiated" },
  refund_credited:  { icon: "💰", label: "Refund Credited" },
  invoice_available:{ icon: "🧾", label: "Invoice Ready" },
  // Bidding & Auction
  bidding_pass_required:     { icon: "🎫", label: "Pass Required" },
  bidding_pass_purchased:    { icon: "🎫", label: "Pass Purchased" },
  bidding_pass_expired:      { icon: "🎫", label: "Pass Expired" },
  bid_placed:                { icon: "🔨", label: "Bid Placed" },
  outbid:                    { icon: "🔨", label: "You've Been Outbid" },
  auction_ending_soon:       { icon: "⏰", label: "Auction Ending Soon" },
  auction_won:               { icon: "🏆", label: "Auction Won!" },
  auction_lost:              { icon: "😔", label: "Auction Ended" },
  carry_forward_winner:      { icon: "🏆", label: "Carry-Forward Winner" },
  winning_item_added_to_cart:{ icon: "🛒", label: "Winning Item in Cart" },
  // Commission
  commission_submitted:         { icon: "🎨", label: "Commission Submitted" },
  commission_counter_offer:     { icon: "🎨", label: "Counter Offer" },
  commission_accepted:          { icon: "🎨", label: "Commission Accepted" },
  commission_rejected:          { icon: "🎨", label: "Commission Rejected" },
  commission_payment_successful:{ icon: "✅", label: "Commission Paid" },
  custom_artwork_completed:     { icon: "🖼️", label: "Artwork Completed" },
  custom_artwork_delivered:     { icon: "🖼️", label: "Artwork Delivered" },
  // Resell
  resale_submitted:         { icon: "♻️", label: "Resale Submitted" },
  resale_approved:          { icon: "♻️", label: "Resale Approved" },
  resale_rejected:          { icon: "♻️", label: "Resale Rejected" },
  resale_sold:              { icon: "♻️", label: "Resale Sold" },
  resale_earnings_credited: { icon: "💰", label: "Resale Earnings" },
  // Wallet & Withdrawals
  money_added_to_wallet:       { icon: "💰", label: "Money Added" },
  wallet_transaction_recorded: { icon: "📋", label: "Transaction Recorded" },
  artcoins_earned:             { icon: "🪙", label: "ArtCoins Earned" },
  withdrawal_submitted:        { icon: "🏦", label: "Withdrawal Submitted" },
  withdrawal_approved:         { icon: "🏦", label: "Withdrawal Approved" },
  withdrawal_paid:             { icon: "🏦", label: "Withdrawal Paid" },
  withdrawal_rejected:         { icon: "🏦", label: "Withdrawal Rejected" },
  withdrawal_limit_reached:    { icon: "🏦", label: "Limit Reached" },
  // KYC
  kyc_submitted: { icon: "📋", label: "KYC Submitted" },
  kyc_approved:  { icon: "✅", label: "KYC Approved" },
  kyc_rejected:  { icon: "❌", label: "KYC Rejected" },
  // Platform
  art_challenge_launched:  { icon: "🎨", label: "New Challenge" },
  challenge_ending_soon:   { icon: "⏰", label: "Challenge Ending" },
  blog_published:          { icon: "📰", label: "New Blog Post" },
  newsletter_subscribed:   { icon: "📧", label: "Subscribed" },
  newsletter_unsubscribed: { icon: "📧", label: "Unsubscribed" },
  platform_announcement:   { icon: "📢", label: "Announcement" },
  policy_update:           { icon: "📜", label: "Policy Update" },
  // Support Tickets
  ticket_created:          { icon: "🎫", label: "Ticket Raised" },
  ticket_status_changed:   { icon: "🔄", label: "Ticket Status" },
  ticket_admin_reply:      { icon: "💬", label: "Support Reply" },
  ticket_escalated:        { icon: "🚨", label: "Ticket Escalated" },
  ticket_resolved:         { icon: "✅", label: "Ticket Resolved" },
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

const DROPDOWN_LIMIT   = 50;
const GENERAL_DISPLAY  = 5;
const COMMUNITY_DISPLAY = 3;

const NotificationDropdown = ({ userId, onUnreadChange }) => {
  const [open, setOpen]                   = useState(false);
  const [general, setGeneral]             = useState([]);
  const [community, setCommunity]         = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);
  const [activeTab, setActiveTab]         = useState("all"); // "all" | "community"
  const ref                               = useRef(null);
  const navigate                          = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchDropdown = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Fetch both general (buyer) and social (community) notifications in parallel
      const [generalRes, communityRes] = await Promise.allSettled([
        getAPI(`/api/buyer-notifications/${userId}?page=1&limit=${DROPDOWN_LIMIT}`, {}, false, true),
        getAPI(`/api/notifications/${userId}?page=1&limit=10`, {}, false, true),
      ]);

       // General notifications
       let generalUnread = 0;
       if (generalRes.status === "fulfilled" && generalRes.value?.data?.success) {
         const all = generalRes.value.data.data || [];
         setGeneral(all.slice(0, GENERAL_DISPLAY));
         generalUnread = all.filter((n) => !n.isRead).length;
       }

       // Community (social) notifications — different model, uses `read` not `isRead`
       let communityUnread = 0;
       if (communityRes.status === "fulfilled" && communityRes.value?.data?.success) {
         const socialAll = communityRes.value.data.notifications || [];
         const normalised = socialAll.slice(0, COMMUNITY_DISPLAY).map((n) => ({
           ...n,
           isRead: n.read,
         }));
         setCommunity(normalised);
         communityUnread = socialAll.filter((n) => !n.read).length;
       }

       const total = generalUnread + communityUnread;
       setUnreadCount(total);
       if (onUnreadChange) onUnreadChange(total);
    } catch {}
    setLoading(false);
  }, [userId, onUnreadChange]);

  // Fetch on mount and poll every 30s
  useEffect(() => {
    fetchDropdown();
    const interval = setInterval(fetchDropdown, 30000);
    return () => clearInterval(interval);
  }, [fetchDropdown]);

  const handleOpen = () => {
    setOpen((v) => !v);
  };

  // Get redirect URL for a notification
  const getRedirectUrl = (notif) => {
    const meta = notif.meta || {};
    const type = notif.type;
    if (["order_placed","order_packed","order_shipped","order_delivered","order_cancelled","refund_initiated","refund_credited","invoice_available"].includes(type))
      return meta.orderId ? `/my-account/my-orders/view?orderId=${meta.orderId}` : "/my-account/my-orders";
    if (["payment_initiated","payment_successful","payment_failed","retry_payment","wallet_debited","wallet_credited","money_added_to_wallet","wallet_transaction_recorded","artcoins_used","artcoins_earned"].includes(type))
      return "/my-account/buyer-wallet";
    if (["withdrawal_submitted","withdrawal_approved","withdrawal_paid","withdrawal_rejected","withdrawal_limit_reached"].includes(type))
      return "/my-account/bank-payment-details";
    if (["bid_placed","outbid","auction_ending_soon","auction_won","auction_lost","carry_forward_winner","winning_item_added_to_cart","bidding_pass_required","bidding_pass_purchased","bidding_pass_expired"].includes(type))
      return "/bid";
    if (["commission_submitted","commission_counter_offer","commission_accepted","commission_rejected","commission_payment_successful","custom_artwork_completed","custom_artwork_delivered"].includes(type))
      return "/my-account/custom-request";
    if (["kyc_submitted","kyc_approved","kyc_rejected"].includes(type))
      return "/my-account/account-verification";
    if (type === "follow") {
      const fromId = meta.fromUserId || (notif.from?._id || notif.from);
      return fromId ? `/artsays-community/profile/${fromId}` : "/artsays-community";
    }
    if (["like","comment","comment_like","comment_reply","mention","post_save","trending_post","post_milestone"].includes(type)) {
      const postId = meta.postId || (notif.post?._id || notif.post);
      return postId ? `/artsays-community/single-post/${postId}` : "/artsays-community";
    }
    if (["live_started","live_reminder","live_viewer_joined","live_tip","live_ended"].includes(type))
      return "/artsays-community";
    if (["security_alert","login_alert"].includes(type))
      return "/my-account/security-agreements";
    if (type === "blog_published")
      return meta.blogId ? `/blog/${meta.blogId}` : "/blogs";
    if (["art_challenge_launched","challenge_ending_soon"].includes(type))
      return "/challenge";
    if (["ticket_created","ticket_status_changed","ticket_admin_reply","ticket_escalated","ticket_resolved"].includes(type))
      return meta.ticketId ? `/my-account/support/${meta.ticketId}` : "/my-account/support";
    return "/my-account/notifications";
  };

  // Mark single notification as read + navigate
  const handleMarkOne = async (notif, e) => {
    e.stopPropagation();
    setOpen(false);
    // Mark as read via correct API
    if (!notif.isRead) {
      try {
        const isCommunity = community.some((n) => n._id === notif._id);
        if (isCommunity) {
          await putAPI(`/api/notifications/${notif._id}/read`, {});
        } else {
          await putAPI(`/api/buyer-notifications/${userId}/mark-read`, { notificationId: notif._id });
        }
        const markRead = (list) => list.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n));
        setGeneral((prev) => markRead(prev));
        setCommunity((prev) => markRead(prev));
        setUnreadCount((c) => {
          const next = Math.max(0, c - 1);
          if (onUnreadChange) onUnreadChange(next);
          return next;
        });
      } catch {}
    }
    // Navigate
    const url = getRedirectUrl(notif);
    if (url) navigate(url);
  };

  // Mark all as read
  const handleMarkAll = async (e) => {
    e.stopPropagation();
    try {
      await putAPI(`/api/buyer-notifications/${userId}/mark-read`, { all: true });
      setGeneral((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setCommunity((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      if (onUnreadChange) onUnreadChange(0);
    } catch {}
  };

  const goToAll = (tab) => {
    setOpen(false);
    navigate(tab === "community" ? "/my-account/notifications?category=social" : "/my-account/notifications");
  };

  // Rendered list based on active tab
  const visibleList = activeTab === "community" ? community : general;

  const NotifItem = ({ notif }) => (
    <div
      key={notif._id}
      onClick={(e) => handleMarkOne(notif, e)}
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
          fontSize: "18px", flexShrink: 0, overflow: "hidden",
        }}
      >
        {notif.from?.profilePhoto ? (
          <img
            src={notif.from.profilePhoto}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          getIcon(notif.type)
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
          <p style={{ fontSize: "13px", fontWeight: notif.isRead ? 500 : 700, color: "#1a1a1a", margin: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {notif.title || getLabel(notif.type)}
          </p>
          {!notif.isRead && (
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5C4033", flexShrink: 0, marginTop: 4 }} />
          )}
        </div>
        {notif.message && (
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        className="nav-icon-btn relative"
        onClick={handleOpen}
        title="Notifications"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span style={{ position: "absolute", top: "-4px", right: "-4px", minWidth: "18px", height: "18px", background: "#ef4444", color: "#fff", borderRadius: "9999px", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", lineHeight: 1, border: "2px solid #fff" }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", width: "360px", background: "#fff", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "1px solid #f0ebe7", zIndex: 9999, overflow: "hidden" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px", borderBottom: "1px solid #f5f0ee" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>🔔</span>
              <span style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a" }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{ background: "#fee2e2", color: "#ef4444", borderRadius: "999px", fontSize: "11px", fontWeight: 700, padding: "1px 8px" }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={handleMarkAll} style={{ fontSize: "11px", fontWeight: 600, color: "#5C4033", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                Mark all read
              </button>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #f5f0ee", padding: "0 18px" }}>
            {[{ key: "all", label: "All" }, { key: "community", label: "Artsays Community" }].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "10px 14px",
                  fontSize: "12px",
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  color: activeTab === tab.key ? "#5C4033" : "#9ca3af",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab.key ? "2px solid #5C4033" : "2px solid transparent",
                  cursor: "pointer",
                  marginBottom: "-1px",
                  whiteSpace: "nowrap",
                  transition: "color 0.15s",
                }}
              >
                {tab.label}
              </button>
            ))}
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
            ) : visibleList.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center", color: "#9ca3af" }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>🔔</div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: 4 }}>No notifications yet</p>
                <p style={{ fontSize: "12px" }}>
                  {activeTab === "community" ? "Follows, likes, comments will appear here." : "Order updates, bids, and more will appear here."}
                </p>
              </div>
            ) : (
              visibleList.map((notif) => <NotifItem key={notif._id} notif={notif} />)
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: "1px solid #f5f0ee", padding: "12px 18px" }}>
            <button
              onClick={() => goToAll(activeTab)}
              style={{ width: "100%", padding: "10px", background: "#5C4033", color: "#fff", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#4b3327")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#5C4033")}
            >
              {activeTab === "community" ? "View all community notifications" : "View all notifications"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
