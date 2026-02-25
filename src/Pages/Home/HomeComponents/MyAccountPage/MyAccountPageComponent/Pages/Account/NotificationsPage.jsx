import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import getAPI from "../../../../../../../api/getAPI";
import putAPI from "../../../../../../../api/putAPI";
import deleteAPI from "../../../../../../../api/deleteAPI";

// ─── Icon + style map for all notification types ──────────────────────────────
const TYPE_ICON = {
  // Social
  follow:             { icon: "👤", color: "#8b5cf6", bg: "#ede9fe" },
  like:               { icon: "❤️", color: "#ef4444", bg: "#fee2e2" },
  comment:            { icon: "💬", color: "#3b82f6", bg: "#dbeafe" },
  comment_like:       { icon: "❤️", color: "#ef4444", bg: "#fee2e2" },
  comment_reply:      { icon: "↩️", color: "#6366f1", bg: "#e0e7ff" },
  mention:            { icon: "📣", color: "#f59e0b", bg: "#fef3c7" },
  post_save:          { icon: "🔖", color: "#10b981", bg: "#d1fae5" },
  collab:             { icon: "🤝", color: "#8b5cf6", bg: "#ede9fe" },
  trending_post:      { icon: "🔥", color: "#ef4444", bg: "#fee2e2" },
  post_milestone:     { icon: "🏅", color: "#f59e0b", bg: "#fef3c7" },
  // Live
  live_started:       { icon: "🔴", color: "#ef4444", bg: "#fee2e2" },
  live_reminder:      { icon: "⏰", color: "#f59e0b", bg: "#fef3c7" },
  live_viewer_joined: { icon: "👥", color: "#10b981", bg: "#d1fae5" },
  live_tip:           { icon: "💰", color: "#10b981", bg: "#d1fae5" },
  live_ended:         { icon: "🎬", color: "#6b7280", bg: "#f3f4f6" },
  // Membership
  membership_purchase_success:  { icon: "✅", color: "#10b981", bg: "#d1fae5" },
  membership_renewal_reminder:  { icon: "⏰", color: "#f59e0b", bg: "#fef3c7" },
  membership_expired:           { icon: "❌", color: "#ef4444", bg: "#fee2e2" },
  new_membership_subscriber:    { icon: "⭐", color: "#f59e0b", bg: "#fef3c7" },
  membership_renewal:           { icon: "🔄", color: "#10b981", bg: "#d1fae5" },
  membership_cancelled:         { icon: "❌", color: "#ef4444", bg: "#fee2e2" },
  membership_tier_updated:      { icon: "📈", color: "#6366f1", bg: "#e0e7ff" },
  // Tips & Promotions
  tip_received:       { icon: "💰", color: "#10b981", bg: "#d1fae5" },
  promotion_approved: { icon: "✅", color: "#10b981", bg: "#d1fae5" },
  promotion_rejected: { icon: "❌", color: "#ef4444", bg: "#fee2e2" },
  promotion_ended:    { icon: "🎬", color: "#6b7280", bg: "#f3f4f6" },
  // Badges
  badge_purchased:    { icon: "🏆", color: "#f59e0b", bg: "#fef3c7" },
  badge_unlocked:     { icon: "🏅", color: "#10b981", bg: "#d1fae5" },
  badge_revoked:      { icon: "❌", color: "#ef4444", bg: "#fee2e2" },
  // Commerce (seller)
  product_linked:       { icon: "🔗", color: "#6366f1", bg: "#e0e7ff" },
  product_purchased:    { icon: "🛍️", color: "#10b981", bg: "#d1fae5" },
  product_out_of_stock: { icon: "📦", color: "#f59e0b", bg: "#fef3c7" },
  sales_milestone:      { icon: "🏆", color: "#f59e0b", bg: "#fef3c7" },
  low_stock:            { icon: "⚠️", color: "#f59e0b", bg: "#fef3c7" },
  // Account / System
  profile_updated:  { icon: "👤", color: "#6366f1", bg: "#e0e7ff" },
  settings_changed: { icon: "⚙️", color: "#6b7280", bg: "#f3f4f6" },
  security_alert:   { icon: "🔒", color: "#ef4444", bg: "#fee2e2" },
  // Authentication
  registration_successful: { icon: "🎉", color: "#10b981", bg: "#d1fae5" },
  email_verification_sent: { icon: "📧", color: "#3b82f6", bg: "#dbeafe" },
  email_verified:          { icon: "✅", color: "#10b981", bg: "#d1fae5" },
  login_alert:             { icon: "🔒", color: "#ef4444", bg: "#fee2e2" },
  // Referral
  referral_applied:        { icon: "🎁", color: "#8b5cf6", bg: "#ede9fe" },
  referral_reward_credited:{ icon: "💎", color: "#f59e0b", bg: "#fef3c7" },
  friend_signed_up:        { icon: "👥", color: "#10b981", bg: "#d1fae5" },
  signup_bonus_credited:   { icon: "🎁", color: "#10b981", bg: "#d1fae5" },
  // Wishlist / Browsing
  wishlist_price_drop:    { icon: "🏷️", color: "#ef4444", bg: "#fee2e2" },
  wishlist_back_in_stock: { icon: "📦", color: "#10b981", bg: "#d1fae5" },
  cart_low_stock:         { icon: "⚠️", color: "#f59e0b", bg: "#fef3c7" },
  // Cart
  item_added_to_cart:     { icon: "🛒", color: "#10b981", bg: "#d1fae5" },
  item_removed_from_cart: { icon: "🛒", color: "#ef4444", bg: "#fee2e2" },
  abandoned_cart:         { icon: "🛒", color: "#f59e0b", bg: "#fef3c7" },
  coupon_applied:         { icon: "🎟️", color: "#10b981", bg: "#d1fae5" },
  coupon_invalid:         { icon: "🎟️", color: "#ef4444", bg: "#fee2e2" },
  // Payments
  payment_initiated:  { icon: "💳", color: "#6366f1", bg: "#e0e7ff" },
  payment_successful: { icon: "✅", color: "#10b981", bg: "#d1fae5" },
  payment_failed:     { icon: "❌", color: "#ef4444", bg: "#fee2e2" },
  retry_payment:      { icon: "🔄", color: "#f59e0b", bg: "#fef3c7" },
  wallet_debited:     { icon: "💸", color: "#ef4444", bg: "#fee2e2" },
  wallet_credited:    { icon: "💰", color: "#10b981", bg: "#d1fae5" },
  artcoins_used:      { icon: "🪙", color: "#f59e0b", bg: "#fef3c7" },
  // Orders
  order_placed:    { icon: "📦", color: "#10b981", bg: "#d1fae5" },
  order_packed:    { icon: "📦", color: "#6366f1", bg: "#e0e7ff" },
  order_shipped:   { icon: "🚚", color: "#3b82f6", bg: "#dbeafe" },
  order_delivered: { icon: "✅", color: "#10b981", bg: "#d1fae5" },
  order_cancelled: { icon: "❌", color: "#ef4444", bg: "#fee2e2" },
  refund_initiated:{ icon: "🔄", color: "#f59e0b", bg: "#fef3c7" },
  refund_credited: { icon: "💰", color: "#10b981", bg: "#d1fae5" },
  invoice_available:{ icon: "🧾", color: "#6366f1", bg: "#e0e7ff" },
  // Bidding & Auction
  bidding_pass_required:    { icon: "🎫", color: "#f59e0b", bg: "#fef3c7" },
  bidding_pass_purchased:   { icon: "🎫", color: "#10b981", bg: "#d1fae5" },
  bidding_pass_expired:     { icon: "🎫", color: "#ef4444", bg: "#fee2e2" },
  bid_placed:               { icon: "🔨", color: "#6366f1", bg: "#e0e7ff" },
  outbid:                   { icon: "🔨", color: "#ef4444", bg: "#fee2e2" },
  auction_ending_soon:      { icon: "⏰", color: "#f59e0b", bg: "#fef3c7" },
  auction_won:              { icon: "🏆", color: "#10b981", bg: "#d1fae5" },
  auction_lost:             { icon: "😔", color: "#6b7280", bg: "#f3f4f6" },
  carry_forward_winner:     { icon: "🏆", color: "#f59e0b", bg: "#fef3c7" },
  winning_item_added_to_cart:{ icon: "🛒", color: "#10b981", bg: "#d1fae5" },
  // Commission
  commission_submitted:        { icon: "🎨", color: "#8b5cf6", bg: "#ede9fe" },
  commission_counter_offer:    { icon: "🎨", color: "#f59e0b", bg: "#fef3c7" },
  commission_accepted:         { icon: "🎨", color: "#10b981", bg: "#d1fae5" },
  commission_rejected:         { icon: "🎨", color: "#ef4444", bg: "#fee2e2" },
  commission_payment_successful:{ icon: "✅", color: "#10b981", bg: "#d1fae5" },
  custom_artwork_completed:    { icon: "🖼️", color: "#10b981", bg: "#d1fae5" },
  custom_artwork_delivered:    { icon: "🖼️", color: "#8b5cf6", bg: "#ede9fe" },
  // Resell
  resale_submitted:        { icon: "♻️", color: "#6366f1", bg: "#e0e7ff" },
  resale_approved:         { icon: "♻️", color: "#10b981", bg: "#d1fae5" },
  resale_rejected:         { icon: "♻️", color: "#ef4444", bg: "#fee2e2" },
  resale_sold:             { icon: "♻️", color: "#f59e0b", bg: "#fef3c7" },
  resale_earnings_credited:{ icon: "💰", color: "#10b981", bg: "#d1fae5" },
  // Wallet & Withdrawals
  money_added_to_wallet:      { icon: "💰", color: "#10b981", bg: "#d1fae5" },
  wallet_transaction_recorded:{ icon: "📋", color: "#6b7280", bg: "#f3f4f6" },
  artcoins_earned:            { icon: "🪙", color: "#f59e0b", bg: "#fef3c7" },
  withdrawal_submitted:       { icon: "🏦", color: "#6366f1", bg: "#e0e7ff" },
  withdrawal_approved:        { icon: "🏦", color: "#10b981", bg: "#d1fae5" },
  withdrawal_paid:            { icon: "🏦", color: "#10b981", bg: "#d1fae5" },
  withdrawal_rejected:        { icon: "🏦", color: "#ef4444", bg: "#fee2e2" },
  withdrawal_limit_reached:   { icon: "🏦", color: "#f59e0b", bg: "#fef3c7" },
  // KYC
  kyc_submitted: { icon: "📋", color: "#6366f1", bg: "#e0e7ff" },
  kyc_approved:  { icon: "✅", color: "#10b981", bg: "#d1fae5" },
  kyc_rejected:  { icon: "❌", color: "#ef4444", bg: "#fee2e2" },
  // Platform
  art_challenge_launched: { icon: "🎨", color: "#8b5cf6", bg: "#ede9fe" },
  challenge_ending_soon:  { icon: "⏰", color: "#f59e0b", bg: "#fef3c7" },
  blog_published:         { icon: "📰", color: "#3b82f6", bg: "#dbeafe" },
  newsletter_subscribed:  { icon: "📧", color: "#10b981", bg: "#d1fae5" },
  newsletter_unsubscribed:{ icon: "📧", color: "#6b7280", bg: "#f3f4f6" },
  platform_announcement:  { icon: "📢", color: "#8b5cf6", bg: "#ede9fe" },
  policy_update:          { icon: "📜", color: "#6b7280", bg: "#f3f4f6" },
};

const getStyle = (type) => TYPE_ICON[type] || { icon: "🔔", color: "#6b7280", bg: "#f3f4f6" };

// Human-readable label per type
const TYPE_LABEL = {
  follow: "New Follower", like: "Post Liked", comment: "New Comment",
  comment_like: "Comment Liked", comment_reply: "Comment Reply",
  mention: "Mentioned You", post_save: "Post Saved", collab: "Collaboration Invite",
  trending_post: "Trending Post", post_milestone: "Post Milestone",
  live_started: "Live Started", live_reminder: "Live Reminder",
  live_viewer_joined: "Viewer Joined", live_tip: "Live Tip", live_ended: "Live Ended",
  membership_purchase_success: "Membership Purchased", membership_renewal_reminder: "Renewal Reminder",
  membership_expired: "Membership Expired", new_membership_subscriber: "New Subscriber",
  membership_renewal: "Subscription Renewed", membership_cancelled: "Subscription Cancelled",
  membership_tier_updated: "Tier Updated", tip_received: "Tip Received",
  promotion_approved: "Promotion Approved", promotion_rejected: "Promotion Rejected",
  promotion_ended: "Promotion Ended", badge_purchased: "Badge Purchased",
  badge_unlocked: "Badge Unlocked", badge_revoked: "Badge Revoked",
  product_linked: "Product Linked", product_purchased: "Product Purchased",
  product_out_of_stock: "Out of Stock", sales_milestone: "Sales Milestone",
  low_stock: "Low Stock Alert", profile_updated: "Profile Updated",
  settings_changed: "Settings Changed", security_alert: "Security Alert",
  // Auth
  registration_successful: "Welcome to Artsays", email_verification_sent: "Verify Your Email",
  email_verified: "Email Verified", login_alert: "New Login Detected",
  // Referral
  referral_applied: "Referral Applied", referral_reward_credited: "Referral Reward",
  friend_signed_up: "Friend Joined", signup_bonus_credited: "Signup Bonus",
  // Wishlist
  wishlist_price_drop: "Price Drop", wishlist_back_in_stock: "Back in Stock",
  cart_low_stock: "Low Stock Warning",
  // Cart
  item_added_to_cart: "Added to Cart", item_removed_from_cart: "Removed from Cart",
  abandoned_cart: "Abandoned Cart", coupon_applied: "Coupon Applied",
  coupon_invalid: "Coupon Invalid",
  // Payments
  payment_initiated: "Payment Initiated", payment_successful: "Payment Successful",
  payment_failed: "Payment Failed", retry_payment: "Retry Payment",
  wallet_debited: "Wallet Debited", wallet_credited: "Wallet Credited",
  artcoins_used: "ArtCoins Used",
  // Orders
  order_placed: "Order Placed", order_packed: "Order Packed",
  order_shipped: "Order Shipped", order_delivered: "Order Delivered",
  order_cancelled: "Order Cancelled", refund_initiated: "Refund Initiated",
  refund_credited: "Refund Credited", invoice_available: "Invoice Ready",
  // Bidding
  bidding_pass_required: "Pass Required", bidding_pass_purchased: "Pass Purchased",
  bidding_pass_expired: "Pass Expired", bid_placed: "Bid Placed",
  outbid: "You've Been Outbid", auction_ending_soon: "Auction Ending Soon",
  auction_won: "Auction Won!", auction_lost: "Auction Ended",
  carry_forward_winner: "Carry-Forward Winner", winning_item_added_to_cart: "Winning Item in Cart",
  // Commission
  commission_submitted: "Commission Submitted", commission_counter_offer: "Counter Offer",
  commission_accepted: "Commission Accepted", commission_rejected: "Commission Rejected",
  commission_payment_successful: "Commission Paid", custom_artwork_completed: "Artwork Completed",
  custom_artwork_delivered: "Artwork Delivered",
  // Resell
  resale_submitted: "Resale Submitted", resale_approved: "Resale Approved",
  resale_rejected: "Resale Rejected", resale_sold: "Resale Sold",
  resale_earnings_credited: "Resale Earnings",
  // Wallet & Withdrawals
  money_added_to_wallet: "Money Added", wallet_transaction_recorded: "Transaction Recorded",
  artcoins_earned: "ArtCoins Earned", withdrawal_submitted: "Withdrawal Submitted",
  withdrawal_approved: "Withdrawal Approved", withdrawal_paid: "Withdrawal Paid",
  withdrawal_rejected: "Withdrawal Rejected", withdrawal_limit_reached: "Limit Reached",
  // KYC
  kyc_submitted: "KYC Submitted", kyc_approved: "KYC Approved", kyc_rejected: "KYC Rejected",
  // Platform
  art_challenge_launched: "New Challenge", challenge_ending_soon: "Challenge Ending",
  blog_published: "New Blog Post", newsletter_subscribed: "Subscribed",
  newsletter_unsubscribed: "Unsubscribed", platform_announcement: "Announcement",
  policy_update: "Policy Update",
};

function buildTitle(notif) {
  return notif.title || notif.message || TYPE_LABEL[notif.type] || "Notification";
}

// Category filter labels + type lists
const CATEGORY_LABELS = {
  all:          "All",
  live:         "Live",
  orders:       "Orders",
  payments:     "Payments",
  auctions:     "Auctions",
  commissions:  "Commissions",
  resell:       "Resell",
  wallet:       "Wallet",
  monetization: "Monetization",
  platform:     "Platform",
  system:       "System",
};

const CATEGORY_TYPES = {
  social:      ["follow", "like", "comment", "comment_like", "comment_reply", "mention", "post_save", "collab", "trending_post", "post_milestone"],
  live:        ["live_started", "live_reminder", "live_viewer_joined", "live_tip", "live_ended"],
  orders:      ["order_placed", "order_packed", "order_shipped", "order_delivered", "order_cancelled", "refund_initiated", "refund_credited", "invoice_available"],
  payments:    ["payment_initiated", "payment_successful", "payment_failed", "retry_payment", "wallet_debited", "wallet_credited", "artcoins_used", "item_added_to_cart", "item_removed_from_cart", "abandoned_cart", "coupon_applied", "coupon_invalid", "wishlist_price_drop", "wishlist_back_in_stock", "cart_low_stock"],
  auctions:    ["bidding_pass_required", "bidding_pass_purchased", "bidding_pass_expired", "bid_placed", "outbid", "auction_ending_soon", "auction_won", "auction_lost", "carry_forward_winner", "winning_item_added_to_cart"],
  commissions: ["commission_submitted", "commission_counter_offer", "commission_accepted", "commission_rejected", "commission_payment_successful", "custom_artwork_completed", "custom_artwork_delivered"],
  resell:      ["resale_submitted", "resale_approved", "resale_rejected", "resale_sold", "resale_earnings_credited"],
  wallet:      ["money_added_to_wallet", "wallet_transaction_recorded", "artcoins_earned", "artcoins_used", "withdrawal_submitted", "withdrawal_approved", "withdrawal_paid", "withdrawal_rejected", "withdrawal_limit_reached"],
  monetization:["tip_received", "membership_purchase_success", "membership_renewal_reminder", "membership_expired", "new_membership_subscriber", "membership_renewal", "membership_cancelled", "membership_tier_updated", "promotion_approved", "promotion_rejected", "promotion_ended", "product_purchased", "sales_milestone", "low_stock", "product_out_of_stock", "badge_purchased", "badge_unlocked", "badge_revoked"],
  platform:    ["art_challenge_launched", "challenge_ending_soon", "blog_published", "newsletter_subscribed", "newsletter_unsubscribed", "platform_announcement", "policy_update", "registration_successful", "email_verification_sent", "email_verified", "login_alert", "referral_applied", "referral_reward_credited", "friend_signed_up", "signup_bonus_credited", "kyc_submitted", "kyc_approved", "kyc_rejected"],
  system:      ["profile_updated", "settings_changed", "security_alert", "product_linked"],
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)     return "just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const LIMIT = 20;
// Exclude all artsays-community / social feed notifications
const EXCLUDED_TYPES = [
  "new_post", "follow", "like", "comment", "comment_like",
  "comment_reply", "mention", "post_save", "collab",
  "trending_post", "post_milestone",
];

// ─── Redirect map: type → frontend route ─────────────────────────────────────
function getRedirectUrl(notif) {
  const meta = notif.meta || {};
  const type = notif.type;

  // Orders — route is /my-account/my-orders/view?orderId=...
  if (["order_placed","order_packed","order_shipped","order_delivered","order_cancelled","refund_initiated","refund_credited","invoice_available"].includes(type)) {
    return meta.orderId ? `/my-account/my-orders/view?orderId=${meta.orderId}` : "/my-account/my-orders";
  }

  // Payments / Wallet
  if (["payment_initiated","payment_successful","payment_failed","retry_payment","wallet_debited","wallet_credited","money_added_to_wallet","wallet_transaction_recorded","artcoins_used","artcoins_earned"].includes(type)) {
    return "/my-account/buyer-wallet";
  }

  // Withdrawals
  if (["withdrawal_submitted","withdrawal_approved","withdrawal_paid","withdrawal_rejected","withdrawal_limit_reached"].includes(type)) {
    return "/my-account/bank-payment-details";
  }

  // Bidding / Auction — route is /bid-details/:bidSlug/:bidId
  if (["bid_placed","outbid","auction_ending_soon","auction_won","auction_lost","carry_forward_winner","winning_item_added_to_cart","winning_bid_rejected","bidding_pass_required","bidding_pass_purchased","bidding_pass_expired"].includes(type)) {
    return "/bid";
  }

  // Commission / Custom
  if (["commission_submitted","commission_counter_offer","commission_accepted","commission_rejected","commission_payment_successful","custom_artwork_completed","custom_artwork_delivered"].includes(type)) {
    return "/my-account/custom-request";
  }

  // Resell
  if (["resale_submitted","resale_approved","resale_rejected","resale_sold","resale_earnings_credited"].includes(type)) {
    return "/my-account/my-orders";
  }

  // KYC
  if (["kyc_submitted","kyc_approved","kyc_rejected"].includes(type)) {
    return "/my-account/account-verification";
  }

  // Social — follow → profile, post interactions → single-post
  if (type === "follow") {
    const fromId = meta.fromUserId || notif.from;
    return fromId ? `/artsays-community/profile/${fromId}` : "/artsays-community";
  }
  if (["like","comment","comment_like","comment_reply","mention","post_save","trending_post","post_milestone"].includes(type)) {
    const postId = meta.postId || notif.post;
    return postId ? `/artsays-community/single-post/${postId}` : "/artsays-community";
  }
  if (type === "collab") {
    return "/artsays-community";
  }

  // Live
  if (["live_started","live_reminder","live_viewer_joined","live_tip","live_ended"].includes(type)) {
    const streamKey = meta.streamKey || meta.liveId;
    return streamKey ? `/artsays-community/${streamKey}/${meta.username || ""}` : "/artsays-community";
  }

  // Membership
  if (["membership_purchase_success","membership_renewal_reminder","membership_expired","membership_renewal","membership_cancelled","membership_tier_updated","new_membership_subscriber"].includes(type)) {
    const creatorId = meta.creatorId;
    return creatorId ? `/artsays-community/profile/${creatorId}` : "/artsays-community";
  }

  // Cart
  if (["item_added_to_cart","abandoned_cart","coupon_applied","coupon_invalid"].includes(type)) {
    const cartUserId = localStorage.getItem("userId");
    return cartUserId ? `/my-account/my-cart/${cartUserId}` : "/my-account/my-cart";
  }
  if (["wishlist_price_drop","wishlist_back_in_stock","cart_low_stock"].includes(type)) {
    return meta.productId ? `/product-details/${meta.productId}` : "/store";
  }

  // Profile / Security
  if (["profile_updated","password_changed","bank_details_updated"].includes(type)) {
    return "/my-account/personal-info";
  }
  if (["security_alert","login_alert"].includes(type)) {
    return "/my-account/security-agreements";
  }

  // Platform
  if (type === "blog_published") {
    return meta.blogId ? `/blog/${meta.blogId}` : "/blogs";
  }
  if (["art_challenge_launched","challenge_ending_soon"].includes(type)) {
    return "/challenge";
  }
  if (type === "notification_preferences") {
    return "/my-account/notification-preferences";
  }

  return null; // no redirect
}

const NotificationsPage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [total, setTotal]               = useState(0);
  const [unreadCount, setUnreadCount]   = useState(0);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [loading, setLoading]           = useState(true);
  const [readFilter, setReadFilter]     = useState("all");
  const [category, setCategory]         = useState("all");
  const [markingAll, setMarkingAll]     = useState(false);

  const fetchNotifications = useCallback(async (pg = 1) => {
    if (!userId) return;
    try {
      if (pg === 1) setLoading(true);
      const res = await getAPI(
        `/api/buyer-notifications/${userId}?page=${pg}&limit=${LIMIT}`,
        {}, false, true
      );
      if (res?.data?.success) {
        const incoming = res.data.data || [];
        setNotifications((prev) => pg === 1 ? incoming : [...prev, ...incoming]);
        setTotal(res.data.total || 0);
        setUnreadCount(res.data.unreadCount || 0);
        setTotalPages(res.data.totalPages || 1);
        setPage(pg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  // Client-side category + read filter
  const displayed = notifications
    .filter((n) => category === "all" || (CATEGORY_TYPES[category] || []).includes(n.type))
    .filter((n) => readFilter === "all" || !n.isRead);

  const handleMarkOne = async (notif) => {
    // Mark as read
    if (!notif.isRead) {
      try {
        await putAPI(`/api/buyer-notifications/${userId}/mark-read`, { notificationId: notif._id });
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (err) { console.error(err); }
    }
    // Redirect to relevant page
    const url = getRedirectUrl(notif);
    if (url) navigate(url);
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await putAPI(`/api/buyer-notifications/${userId}/mark-read`, { all: true });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (notifId, e) => {
    e.stopPropagation();
    try {
      await deleteAPI(`/api/buyer-notifications/${userId}/${notifId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
      setTotal((t) => Math.max(0, t - 1));
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const loadMore = () => {
    if (page < totalPages) fetchNotifications(page + 1);
  };

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-10 h-10 bg-[#5C4033]/10 rounded-2xl flex items-center justify-center text-lg">
              🔔
            </span>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              You have{" "}
              <span className="font-semibold text-[#5C4033]">{unreadCount} unread</span>{" "}
              notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={markingAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#5C4033] border border-[#5C4033]/30 rounded-xl hover:bg-[#5C4033]/5 transition-colors disabled:opacity-50"
          >
            {markingAll ? "Marking..." : "Mark all as read"}
          </button>
        )}
      </div>

      {/* Read-state Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "unread"].map((f) => (
          <button
            key={f}
            onClick={() => setReadFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              readFilter === f
                ? "bg-[#5C4033] text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#5C4033]/40"
            }`}
          >
            {f === "all" ? "All" : "Unread"}
            {f === "unread" && unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              category === cat
                ? "bg-[#5C4033] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col gap-3 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-lg w-full" />
                  <div className="h-3 bg-gray-100 rounded-lg w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No notifications yet</h3>
            <p className="text-gray-500 max-w-sm text-sm">
              {readFilter === "unread"
                ? "You're all caught up! No unread notifications."
                : category !== "all"
                ? `No ${CATEGORY_LABELS[category]} notifications yet.`
                : "When you place orders, bid on auctions, or get updates, your notifications will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
              {displayed.map((notif) => {
                  const style = getStyle(notif.type);
                  const title = buildTitle(notif);
                  const redirectUrl = getRedirectUrl(notif);
                  return (
                    <div
                      key={notif._id}
                      onClick={() => handleMarkOne(notif)}
                      className={`flex items-start gap-4 p-3 transition-colors hover:bg-gray-50/80 group ${
                        !notif.isRead ? "bg-[#EBEBEB]" : ""
                      } ${redirectUrl ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 mt-0.5"
                        style={{ background: style.bg }}
                      >
                        {style.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-snug ${!notif.isRead ? "font-bold text-gray-900" : "font-semibold text-gray-700"} ${redirectUrl ? "group-hover:text-[#5C4033] transition-colors" : ""}`}>
                            {title}
                          </p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[#5C4033] flex-shrink-0 mt-1" />
                            )}
                            <button
                              onClick={(e) => handleDelete(notif._id, e)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 text-xs px-1"
                              title="Delete"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        {notif.message && notif.title && (
                          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{notif.message}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: style.bg, color: style.color }}
                          >
                            {TYPE_LABEL[notif.type] || notif.type}
                          </span>
                          <span className="text-xs text-gray-400">{timeAgo(notif.createdAt)}</span>
                          {redirectUrl && (
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#5C4033] font-semibold flex items-center gap-0.5">
                              View →
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        )}

        {/* Load More */}
        {!loading && page < totalPages && (
          <div className="p-4 text-center border-t border-gray-50">
            <button
              onClick={loadMore}
              className="px-6 py-2.5 text-sm font-semibold text-[#5C4033] border border-[#5C4033]/30 rounded-xl hover:bg-[#5C4033]/5 transition-colors"
            >
              Load more notifications
            </button>
          </div>
        )}

        {/* Total count */}
        {!loading && displayed.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400 text-center">
            Showing {displayed.length} of {total} notification{total !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
