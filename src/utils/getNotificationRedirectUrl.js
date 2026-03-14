/**
 * Returns the URL to navigate to when a seller/artist notification is clicked.
 *
 * @param {object} notification  - The notification object from the API
 * @param {string} role          - "Seller" | "Artist" (determines base path)
 * @returns {string|null}        - A route string, or null if no redirect is needed
 */
  const getNotificationRedirectUrl = (notification, role = "Seller") => {
    const { type, meta = {} } = notification;
    let base = "/seller";
    if (role === "Artist") base = "/artist";
    else if (role === "Buyer") base = "/buyer";

  switch (type) {
    // ── Auth / Account ──────────────────────────────────────────────────────
    case "registration_successful":
    case "account_approved":
    case "account_rejected":
    case "account_locked":
    case "password_changed":
    case "password_reset_requested":
    case "email_verification_sent":
    case "email_verified":
    case "login_successful":
    case "unauthorized_access_attempt":
    case "profile_incomplete":
    case "verification_submitted":
    case "verification_update_required":
    case "suspicious_login_detected":
    case "account_action_required":
      return `${base}/profile`;

    // ── Products / Artworks ─────────────────────────────────────────────────
    case "product_uploaded":
    case "product_submitted_for_review":
    case "product_updated":
    case "product_deleted":
    case "no_products_listed":
    case "products_live_no_sales":
    case "high_views_low_conversion":
      return role === "Artist" ? "/artist/product" : "/seller/product-details";

    case "product_approved":
    case "product_rejected":
    case "product_out_of_stock":
    case "low_stock_warning":
    case "product_viewed_milestone":
      if (meta?.productId)
        return role === "Artist"
          ? `/artist/product-fetch-view-artist/${meta.productId}`
          : `/seller/product-fetch-view-seller/${meta.productId}`;
      return role === "Artist" ? "/artist/product" : "/seller/product-details";

    // ── Orders ──────────────────────────────────────────────────────────────
    case "new_order_received":
    case "order_payment_confirmed":
    case "order_status_reminder":
    case "order_packed":
    case "order_shipped":
    case "order_delivered":
    case "order_cancelled_by_buyer":
    case "order_auto_cancelled":
    case "refund_initiated":
    case "refund_completed":
      if (meta?.orderId)
        return `${base}/order-view/${meta.orderId}`;
      return role === "Artist" ? "/artist/product-purchase" : "/seller/purchased-product";

    // ── Wallet ──────────────────────────────────────────────────────────────
    case "wallet_credited":
    case "wallet_debited":
    case "transaction_recorded":
    case "wallet_topup_successful":
    case "wallet_topup_failed":
    case "withdrawal_request_submitted":
    case "withdrawal_approved":
    case "withdrawal_paid":
    case "withdrawal_rejected":
    case "withdrawal_limit_reached":
    case "low_wallet_balance":
    case "pending_withdrawals":
      return `${base}/wallet`;

    // ── Bidding ─────────────────────────────────────────────────────────────
    case "product_added_to_bidding":
    case "bidding_product_updated":
    case "auction_approved":
    case "auction_ending_soon":
    case "auction_restarted":
      return `${base}/bidding-products-table`;

    case "first_bid_received":
    case "new_highest_bid":
    case "auction_won":
    case "auction_completed":
      if (meta?.biddingProductId)
        return `${base}/bidded-products-table`;
      return `${base}/bidding-products-table`;

    case "bidding_pass_purchased":
    case "bidding_pass_upgraded":
    case "bidding_pass_assigned":
    case "bidding_pass_expired":
      return `${base}/bidding-pass-table`;

    // ── Ads ─────────────────────────────────────────────────────────────────
    case "ad_campaign_created":
    case "ad_campaign_approved":
    case "ad_campaign_rejected":
    case "ad_campaign_live":
    case "ad_campaign_paused":
    case "ad_campaign_ended":
    case "sponsored_product_alert":
    case "promotion_performance_alert":
      return `${base}/advertise`;

    // ── Certification ────────────────────────────────────────────────────────
    case "certification_request_submitted":
    case "certification_payment_successful":
    case "certification_payment_failed":
    case "certification_approved":
    case "certification_rejected":
    case "certification_expiring_soon":
    case "certification_recommended":
      return `${base}/certification`;

    // ── Insurance ────────────────────────────────────────────────────────────
    case "insurance_purchased":
    case "insurance_approved":
    case "insurance_expiring_soon":
    case "insurance_claim_eligible":
    case "insurance_recommended":
      return `${base}/insurance`;

    // ── Exhibition ───────────────────────────────────────────────────────────
    case "exhibition_application_submitted":
    case "exhibition_approved":
    case "exhibition_rejected":
    case "exhibition_starting_soon":
    case "exhibition_completed":
    case "exhibition_invite":
      return `${base}/exhibition`;

    // ── Badges / Membership ──────────────────────────────────────────────────
    case "premium_badge_purchased":
    case "premium_badge_activated":
    case "premium_badge_expiring_soon":
    case "membership_purchased":
    case "membership_expired":
    case "featured_seller_announcement":
    case "featured_artist_announcement":
      return `${base}/premium-badges`;

    // ── Custom Orders ────────────────────────────────────────────────────────
    case "new_custom_order_request":
    case "custom_order_price_sent":
    case "buyer_accepted_custom_price":
    case "buyer_rejected_custom_price":
    case "custom_order_payment_received":
    case "custom_order_deadline_reminder":
    case "custom_order_marked_complete":
    case "custom_order_delivered":
      return `${base}/custom-order/view-request`;

    // ── Packaging ────────────────────────────────────────────────────────────
    case "packaging_order_placed":
    case "packaging_payment_successful":
    case "packaging_order_updated":
    case "packaging_order_delivered":
      if (meta?.packagingOrderId)
        return `${base}/packaging-material/view/${meta.packagingOrderId}`;
      return `${base}/packaging-material`;

    // ── Coupons ──────────────────────────────────────────────────────────────
    case "coupon_created":
    case "coupon_updated":
    case "coupon_expired":
    case "coupon_usage_milestone":
      return role === "Artist"
        ? "/artist/product-coupon-codes"
        : "/seller/products-settings/product-coupon-code";

    // ── Blogs (Artist only) ──────────────────────────────────────────────────
    case "blog_submitted_for_review":
    case "blog_approved":
    case "blog_rejected":
    case "blog_published":
    case "blog_performance_milestone":
      return "/artist/bloglist";

    // ── Social / Community ───────────────────────────────────────────────────
    case "new_follower":
    case "post_liked":
    case "post_commented":
    case "post_promoted":
    case "community_reach_milestone":
      return `${base}/profile`;

    // ── System ───────────────────────────────────────────────────────────────
    case "platform_announcement":
    case "policy_update":
    case "maintenance_alert":
      return null; // no specific page, just mark as read

    // ── Support Tickets ──────────────────────────────────────────────────────
    case "ticket_created":
    case "ticket_status_changed":
    case "ticket_admin_reply":
    case "ticket_escalated":
    case "ticket_resolved":
      if (meta?.ticketId) {
        return `${base}/support/${meta.ticketId}`;
      }
      return `${base}/support`;

    default:
      return `${base}/dashboard`;
  }
};

export default getNotificationRedirectUrl;
