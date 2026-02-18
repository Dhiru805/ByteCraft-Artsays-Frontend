import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../../Constants/index";

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(1)}Cr`
    : n >= 100000
      ? `₹${(n / 100000).toFixed(1)}L`
      : n >= 1000
        ? `₹${(n / 1000).toFixed(1)}K`
        : `₹${Math.round(n || 0).toLocaleString("en-IN")}`;

const num = (n) =>
  n >= 1000000
    ? `${(n / 1000000).toFixed(1)}M`
    : n >= 1000
      ? `${(n / 1000).toFixed(1)}K`
      : `${Math.round(n || 0)}`;

const pct = (val, total) =>
  total > 0 ? Math.round((val / total) * 100) : 0;

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ─── SVG Donut ───────────────────────────────────────────────────────────────
const Donut = ({ segments = [], size = 90, stroke = 18 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const gap = circ - dash;
        const el = (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function SellerDashboard() {
  const userId = localStorage.getItem("userId");
  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";

  // ── state ──
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [soldOrders, setSoldOrders] = useState([]);
  const [biddingProducts, setBiddingProducts] = useState([]);
  const [socialProfile, setSocialProfile] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [errors, setErrors] = useState({});

  // ── fetch helpers ──
  const safe = useCallback(async (key, fn) => {
    try {
      await fn();
    } catch (e) {
      setErrors((prev) => ({ ...prev, [key]: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("token");
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const load = async () => {
      setLoading(true);

      await Promise.allSettled([
        // 1. Wallet
        safe("wallet", async () => {
          const res = await axios.post(`${API_URL}/api/wallet/ensure/${userId}`, {}, { headers: authHeaders });
          setWallet(res.data || null);
        }),

        // 2. Transactions
        safe("transactions", async () => {
          try {
            const res = await axios.get(`${API_URL}/api/wallet/user-all-transactions/${userId}`, { headers: authHeaders });
            const d = res.data;
            setTransactions(Array.isArray(d?.transactions) ? d.transactions : Array.isArray(d) ? d : []);
          } catch {
            const res2 = await axios.get(`${API_URL}/api/wallet/transactions/${userId}`, { headers: authHeaders });
            setTransactions(Array.isArray(res2.data) ? res2.data : []);
          }
        }),

        // 3. Seller's own products
        safe("products", async () => {
          const res = await axios.get(`${API_URL}/api/getsellerproductbyid/${userId}`, { headers: authHeaders });
          const d = res.data;
          setProducts(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
        }),

          // 4. Seller's sold orders
          safe("soldOrders", async () => {
            const res = await axios.get(`${API_URL}/api/seller-purchased-products/${userId}`, { headers: authHeaders });
            const d = res.data;
            const arr = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
            setSoldOrders(arr);
          }),

        // 5. Bidding products
        safe("biddingProducts", async () => {
          const res = await axios.get(`${API_URL}/api/bidding/products/user/${userId}`, { headers: authHeaders });
          const d = res.data;
          setBiddingProducts(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
        }),

        // 6. Social / community profile
        safe("socialProfile", async () => {
          const res = await axios.get(`${API_URL}/api/social-media/profile/${userId}`);
          const d = res.data;
          setSocialProfile(d?.profile || d?.data || d || null);
        }),

          // 7. Certifications
          safe("certifications", async () => {
            const res = await axios.get(`${API_URL}/api/get-certificationbyId/${userId}`, { headers: authHeaders });
            const d = res.data;
            setCertifications(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
          }),

          // 8. User profile (for purchased badges)
          safe("userProfile", async () => {
            const res = await axios.get(`${API_URL}/auth/userid/${userId}`, { headers: authHeaders });
            setUserProfile(res.data?.user || null);
          }),
      ]);

      setLoading(false);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ── derived values ──
  const walletBalance = wallet?.balance || 0;
  const pendingSettlement = wallet?.pendingWithdrawal || 0;
  const totalEarnings = wallet?.totalCredited || 0;

  const activeListings = products.filter(
    (p) => p.status === "Approved" || p.status === "approved" || p.status === "Active" || p.status === "active"
  ).length;
  const totalProducts = products.length;
  const totalSold = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);

  const followers = Array.isArray(socialProfile?.followers)
    ? socialProfile.followers.length
    : (socialProfile?.followersCount || 0);
  const following = Array.isArray(socialProfile?.following)
    ? socialProfile.following.length
    : (socialProfile?.followingCount || 0);
  const posts = Array.isArray(socialProfile?.posts)
    ? socialProfile.posts.length
    : (socialProfile?.postsCount || 0);

  const certifiedCount = certifications.length;
  const purchasedBadges = Array.isArray(userProfile?.verified) ? userProfile.verified : [];
  const isVerified = purchasedBadges.length > 0;
  const verificationStatus = isVerified
    ? purchasedBadges.map((b) => b.badgeName || b.name || "Badge").join(", ")
    : "Not Verified";

  const recentOrders = [...soldOrders]
    .filter((o) => o.orderStatus === "Ordered")
    .sort((a, b) => new Date(b.purchaseDate || b.createdAt || 0) - new Date(a.purchaseDate || a.createdAt || 0))
    .slice(0, 6);

  const liveBids = biddingProducts.filter(
    (b) => b.status === "active" || b.status === "Active" || b.biddingStatus === "active" || b.isLive === true
  ).length;

  const topProducts = [...products]
    .sort((a, b) => {
      const dateDiff = new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (dateDiff !== 0) return dateDiff;
      return (b.viewCount || 0) - (a.viewCount || 0);
    })
    .slice(0, 4);

  const tipTotal = transactions
    .filter((t) => t.type === "credit" && (t.purpose || "").toLowerCase().includes("tip"))
    .reduce((s, t) => s + (t.amount || 0), 0);
  const membershipTotal = transactions
    .filter((t) => t.type === "credit" && (t.purpose || "").toLowerCase().includes("member"))
    .reduce((s, t) => s + (t.amount || 0), 0);
  const marketplaceTotal = Math.max(0, totalEarnings - tipTotal - membershipTotal);

  const donutSegments = [
    { color: "#6366f1", value: marketplaceTotal || 1, label: "Marketplace" },
    { color: "#10b981", value: membershipTotal, label: "Memberships" },
    { color: "#f59e0b", value: tipTotal, label: "Tips" },
  ];

  // ── render ──
  return (
    <div className="container-fluid">

      {/* ── Block Header ── */}
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Seller Dashboard</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/seller/dashboard"><i className="fa fa-dashboard"></i></a>
              </li>
              <li className="breadcrumb-item">Dashboard</li>
              <li className="breadcrumb-item active">Overview</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-none d-md-flex flex-row-reverse">
              <div className="page_action">
                <Link to="/seller/product/product-upload" className="btn btn-primary mx-2">
                  <i className="fa fa-plus"></i> Add Product
                </Link>
                <Link to="/seller/purchased-product" className="btn btn-secondary">
                  <i className="fa fa-shopping-basket"></i> Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 1 – TOP WIDGET METRIC CARDS
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix row-deck">

        {/* Total Earnings */}
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget primary-bg">
            <div className="body">
              <div className="icon bg-light"><i className="fa fa-inr"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Total Earnings</div>
                <h4 className="number mb-0">
                  {loading ? "—" : fmt(totalEarnings)}
                </h4>
                <small>Wallet: {loading ? "—" : fmt(walletBalance)}</small>
              </div>
            </div>
          </div>
        </div>

        {/* Products Sold */}
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget secondary-bg">
            <div className="body">
              <div className="icon bg-light"><i className="fa fa-shopping-basket"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Products Sold</div>
                <h4 className="number mb-0">
                  {loading ? "—" : num(totalSold)}
                </h4>
                <small>{totalProducts} total listings</small>
              </div>
            </div>
          </div>
        </div>

        {/* Active Listings */}
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget bg-dark">
            <div className="body">
              <div className="icon bg-light"><i className="fa fa-tag"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Active Listings</div>
                <h4 className="number mb-0">
                  {loading ? "—" : num(activeListings)}
                </h4>
                <small>{totalProducts} total products</small>
              </div>
            </div>
          </div>
        </div>

        {/* Community Reach */}
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="card top_widget bg-info">
            <div className="body">
              <div className="icon bg-light"><i className="fa fa-users"></i></div>
              <div className="content text-light">
                <div className="text mb-2 text-uppercase">Community Reach</div>
                <h4 className="number mb-0">
                  {loading ? "—" : num(followers)}
                </h4>
                <small>{num(following)} following · {num(posts)} posts</small>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 2 – QUICK ACTIONS
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="header">
              <h2>Quick Actions <small>Jump straight to what matters</small></h2>
            </div>
            <div className="body">
              <div className="d-flex flex-wrap" style={{ gap: "10px" }}>
                {[
                  { icon: "fa-plus", label: "Add Product", to: "/seller/product/product-upload", cls: "btn-primary" },
                  { icon: "fa-shopping-basket", label: "View Orders", to: "/seller/purchased-product", cls: "btn-secondary" },
                  { icon: "fa-image", label: "Create Post", to: "/artsays-community/create-post", cls: "btn-info" },
                  {
                    icon: "fa-bullhorn",
                    label: "Promote Post",
                    to: `/artsays-community/profile/${socialProfile?.username || socialProfile?.handle
                      ? socialProfile.username || socialProfile.handle
                      : `${firstName}_${lastName}_${userId}`
                      }`,
                    cls: "btn-warning"
                  },
                  { icon: "fa-gavel", label: "Bidding", to: "/seller/bidding-products-table", cls: "btn-default" },
                  { icon: "fa-circle", label: "Go Live", to: "/artsays-community/create-live", cls: "btn-danger" },
                ].map(({ icon, label, to, cls }) => (
                  <Link
                    key={label}
                    to={to}
                    className={`btn ${cls} flex-fill d-flex align-items-center justify-content-center`}
                  >
                    <i className={`fa ${icon} me-2`}></i>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 3 – NEW ORDERS + WALLET
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix row-deck">

        {/* New Orders Table */}
        <div className="col-lg-7 col-md-12">
          <div className="card">
            <div className="header d-flex justify-content-between">
              <h2>New Orders <small>Freshly placed orders needing your attention</small></h2>
              <div className="d-none d-md-block mt-3 text-right">
                <Link to="/seller/purchased-product" className="btn btn-primary btn-sm">
                  View All Orders
                </Link>
              </div>
            </div>
            <div className="body">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Buyer</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [1, 2, 3, 4, 5].map((i) => (
                        <tr key={i}>
                          {[1, 2, 3, 4, 5].map((j) => (
                            <td key={j}><span className="shimmer-cell" style={{ display: "inline-block", width: "80%", height: 14, background: "#e9ecef", borderRadius: 3 }}></span></td>
                          ))}
                        </tr>
                      ))
                    ) : recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted" style={{ padding: "24px 0" }}>
                          No new orders yet
                        </td>
                      </tr>
                    ) : (
                        recentOrders.map((order, i) => {
                          const productName = order.productName || "Product";
                          const buyerName = order.buyerName || "—";
                          const amount = order.subtotal || 0;
                          const status = order.orderStatus || "Ordered";
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>
                                {productName}
                              </td>
                              <td>{buyerName}</td>
                              <td className="text-success font-weight-bold">{fmt(amount)}</td>
                                  <td>
                                    <span className="badge badge-info">New Order Placed</span>
                                  </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet */}
        <div className="col-lg-5 col-md-12">
          <div className="card">
            <div className="header">
              <h2>Wallet & Payments <small>Your earnings overview</small></h2>
              <ul className="header-dropdown">
                <li>
                  <Link to="/seller/wallet" title="View Wallet">
                    <i className="fa fa-external-link"></i>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <p className="mb-0 text-muted font-12 text-uppercase">Wallet Balance</p>
                  <h3 className="mb-0" style={{ color: "#f59e0b", fontWeight: 800 }}>
                    {loading ? "—" : fmt(walletBalance)}
                  </h3>
                  {pendingSettlement > 0 && (
                    <small className="text-muted">{fmt(pendingSettlement)} pending settlement</small>
                  )}
                </div>
                <Donut segments={donutSegments} size={76} stroke={13} />
              </div>

              {/* Legend */}
              <div className="d-flex mb-3" style={{ gap: 14 }}>
                {donutSegments.map((s) => (
                  <div key={s.label} className="d-flex align-items-center" style={{ gap: 5, fontSize: 11 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, display: "inline-block" }}></span>
                    <span className="text-muted">{s.label}</span>
                  </div>
                ))}
              </div>

              <p className="font-12 text-uppercase text-muted mb-1"><strong>Recent Transactions</strong></p>
              {loading ? (
                <p className="text-muted">Loading...</p>
              ) : transactions.length === 0 ? (
                <p className="text-muted font-12">No transactions yet</p>
              ) : (
                transactions.slice(0, 3).map((t, i) => (
                  <div
                    key={i}
                    className="d-flex justify-content-between align-items-center"
                    style={{ padding: "6px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none", fontSize: 13 }}
                  >
                    <div>
                      <span style={{ fontWeight: 500 }}>{(t.purpose || "Transaction").substring(0, 28)}</span>
                      <span className="text-muted font-12"> · {timeAgo(t.createdAt)}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: t.type === "credit" ? "#10b981" : "#ef4444" }}>
                      {t.type === "credit" ? "+" : "-"}{fmt(t.amount)}
                    </span>
                  </div>
                ))
              )}

              <div className="d-flex flex-column mt-3" style={{ gap: 10 }}>
                <Link to="/seller/wallet" className="btn btn-secondary btn-sm flex-fill text-center justify-content-center">View Wallet</Link>
                <Link to="/seller/wallet" className="btn btn-primary btn-sm flex-fill text-center justify-content-center">Withdraw</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Summary */}
      <div className="row clearfix row-deck">
        <div className="col-lg-12 col-md-12">
          <div className="card">
            <div className="header">
              <h2>Membership Summary <small>Credits and earnings breakdown</small></h2>
            </div>
            <div className="body">
              <div className="row clearfix">
                {[
                  { label: "Subscribers", value: loading ? "—" : num(socialProfile?.membershipsCount || 0), badge: "badge-info" },
                  { label: "Tips Received", value: loading ? "—" : fmt(tipTotal), badge: "badge-warning" },
                  { label: "Marketplace", value: loading ? "—" : fmt(marketplaceTotal), badge: "badge-success" },
                  { label: "Other Credits", value: loading ? "—" : fmt(membershipTotal), badge: "badge-primary" },
                ].map(({ label, value, badge }) => (
                  <div key={label} className="col-6 col-lg-3 text-center mb-3">
                    <h3 className="mb-0 font-weight-bold">{value}</h3>
                    <span className={`badge ${badge}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 4 – COMMUNITY INSIGHTS + SMART ALERTS
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix row-deck">

        {/* Community Insights */}
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="header">
              <h2>Community Insights <small>Your social presence</small></h2>
              <ul className="header-dropdown">
                <li>
                  <Link to="/community/profile" title="View Profile">
                    <i className="fa fa-external-link"></i>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="body">
              <div className="row clearfix">
                {[
                  { label: "Total Followers", value: loading ? "—" : num(followers), icon: "fa-users", color: "#8b5cf6" },
                  { label: "Following", value: loading ? "—" : num(following), icon: "fa-user-plus", color: "#6366f1" },
                  { label: "Total Posts", value: loading ? "—" : num(posts), icon: "fa-image", color: "#10b981" },
                  { label: "Profile Views", value: loading ? "—" : num(socialProfile?.profileViews || 0), icon: "fa-eye", color: "#f59e0b" },
                ].map(({ label, value, icon, color }) => (
                  <div key={label} className="col-6 mb-3">
                    <div className="d-flex align-items-center" style={{ gap: 10 }}>
                      <div
                        style={{
                          width: 38, height: 38, borderRadius: 8,
                          background: `${color}18`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color, fontSize: 16,
                        }}
                      >
                        <i className={`fa ${icon}`}></i>
                      </div>
                      <div>
                        <h5 className="mb-0" style={{ fontWeight: 800, color }}>{value}</h5>
                        <small className="text-muted">{label}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Profile row */}
              {!loading && socialProfile && (
                <div className="d-flex align-items-center mb-3" style={{ gap: 12, padding: "10px 12px", background: "#f8faff", borderRadius: 8 }}>
                  {socialProfile.profilePicture || socialProfile.profileImage ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL_FOR_IMAGE || ""}${socialProfile.profilePicture || socialProfile.profileImage}`}
                      alt="profile"
                      style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 38, height: 38, borderRadius: "50%", background: "#8b5cf6",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 700, fontSize: 15,
                      }}
                    >
                      {firstName?.[0]?.toUpperCase() || "S"}
                    </div>
                  )}
                  <div>
                    <strong style={{ fontSize: 13 }}>@{socialProfile.username || socialProfile.handle || firstName.toLowerCase()}</strong>
                    <p className="mb-0 text-muted font-12">
                      {socialProfile.bio ? socialProfile.bio.substring(0, 50) : "Seller profile"}
                    </p>
                  </div>
                </div>
              )}

              <div className="d-flex flex-column mt-3" style={{ gap: 10 }}>
                <Link
                  to={`/artsays-community/profile/${socialProfile?.username || socialProfile?.handle
                    ? (socialProfile.username || socialProfile.handle)
                    : `${firstName}_${lastName}_${userId}`
                    }`}
                  className="btn btn-secondary btn-sm flex-fill text-center d-flex justify-content-center"
                >
                  View Profile
                </Link>
                <Link to="/artsays-community/create-post" className="btn btn-primary btn-sm flex-fill text-center justify-content-center">Create Post</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements + Smart Alerts */}
        <div className="col-lg-3 col-md-12 col-sm-12">
          <div className="card">
            <div className="header">
              <h2>Announcements</h2>
            </div>
            <div className="body">
              <ul className="list-group list-group-flush">
                {[
                  { text: "New Exhibition invites available", badge: "badge-primary", link: "/seller/exhibition" },
                  { text: "Featured Seller Program is open", badge: "badge-success", link: "/seller/profile" },
                  { text: "Platform update: New analytics tools", badge: "badge-warning", link: "/seller/advertise" },
                ].map((a, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <Link to={a.link} style={{ color: "#1e293b", textDecoration: "none", fontSize: 13 }}>
                      {a.text}
                    </Link>
                    <span className={`badge ${a.badge}`}>New</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Smart Alerts */}
        <div className="col-lg-3 col-md-12">
          <div className="card">
            <div className="header">
              <h2>Smart Alerts <small>Action recommendations</small></h2>
            </div>
            <div className="body">
              {[
                !loading && activeListings === 0 && {
                  icon: "fa-tag",
                  text: "Upload your first product to start selling",
                  badge: "badge-primary",
                  link: "/seller/product/product-upload",
                  cta: "Add Product",
                },
                !loading && totalSold === 0 && activeListings > 0 && {
                  icon: "fa-lightbulb-o",
                  text: "No sales yet — check your pricing strategy",
                  badge: "badge-warning",
                  link: "/seller/product/product-upload",
                  cta: "Edit Listings",
                },
                !loading && !socialProfile && {
                  icon: "fa-user",
                  text: "Create your community profile to grow followers",
                  badge: "badge-info",
                  link: "/community/create-profile",
                  cta: "Create Profile",
                },
                !loading && certifiedCount === 0 && {
                  icon: "fa-certificate",
                  text: "Get certified to boost buyer trust",
                  badge: "badge-success",
                  link: "/seller/certification",
                  cta: "Get Certified",
                },
                !loading && liveBids === 0 && totalProducts > 0 && {
                  icon: "fa-gavel",
                  text: "Add products to bidding for higher prices",
                  badge: "badge-warning",
                  link: "/seller/bidding-products-table",
                  cta: "Start Bidding",
                },
              ]
                .filter(Boolean)
                .slice(0, 5)
                .map((alert, i) => (
                  <div key={i} className="alert alert-default d-flex align-items-start mb-2" style={{ padding: "10px 12px", borderRadius: 8 }}>
                    <i className={`fa ${alert.icon} mr-2 mt-1`} style={{ fontSize: 16 }}></i>
                    <div style={{ flex: 1 }}>
                      <p className="mb-1" style={{ fontSize: 12 }}>{alert.text}</p>
                      <Link to={alert.link} className={`badge ${alert.badge}`} style={{ textDecoration: "none" }}>
                        {alert.cta} →
                      </Link>
                    </div>
                  </div>
                ))}

              {!loading && activeListings > 0 && totalSold > 0 && socialProfile && certifiedCount > 0 && (
                <div className="text-center text-success" style={{ padding: "20px 0", fontSize: 13, fontWeight: 600 }}>
                  <i className="fa fa-check-circle mr-1"></i> Everything looks great! Keep selling.
                </div>
              )}

              {loading && (
                <p className="text-muted text-center">Loading alerts...</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 5 – ANALYTICS & INSIGHTS
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix row-deck">

        {/* Revenue Breakdown */}
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="header">
              <h2>Revenue Breakdown <small>Earnings by source</small></h2>
            </div>
            <div className="body">
              <div className="d-flex justify-content-start mb-4" style={{ gap: 24 }}>
                <div>
                  <p className="mb-0 font-12 text-uppercase text-muted">Wallet Balance</p>
                  <h4>{loading ? "—" : fmt(walletBalance)}</h4>
                </div>
                <div>
                  <p className="mb-0 font-12 text-uppercase text-muted">Total Credited</p>
                  <h4>{loading ? "—" : fmt(totalEarnings)}</h4>
                </div>
                <div>
                  <p className="mb-0 font-12 text-uppercase text-muted">Pending Payout</p>
                  <h4>{loading ? "—" : fmt(pendingSettlement)}</h4>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4" style={{ gap: 20 }}>
                <Donut segments={donutSegments} size={90} stroke={15} />
                <div style={{ flex: 1 }}>
                  {donutSegments.map((s) => (
                    <div key={s.label} className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center" style={{ gap: 8 }}>
                        <span style={{ width: 12, height: 12, borderRadius: 2, background: s.color, display: "inline-block" }}></span>
                        <span style={{ fontSize: 13 }}>{s.label}</span>
                      </div>
                      <strong style={{ color: s.color }}>{pct(s.value, totalEarnings || 1)}%</strong>
                    </div>
                  ))}
                </div>
              </div>

              <hr />
              <div className="row clearfix mt-4">
                {[
                  { label: "Marketplace", value: fmt(marketplaceTotal), color: "#6366f1" },
                  { label: "Memberships", value: fmt(membershipTotal), color: "#10b981" },
                  { label: "Tips Received", value: fmt(tipTotal), color: "#f59e0b" },
                  { label: "Total Sold", value: `${totalSold} items`, color: "#8b5cf6" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="col-6 mb-2">
                    <p className="mb-0 font-12 text-muted">{label}</p>
                    <h5 style={{ color, fontWeight: 800 }}>{loading ? "—" : value}</h5>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Activity */}
        <div className="col-lg-6 col-md-12">
          <div className="card">
            <div className="header d-flex justify-content-between">
              <h2>Engagement Activity <small>Wallet credit history</small></h2>
              <div className="d-none d-md-block text-right">
                <Link to="/community/notifications" className="btn btn-primary btn-sm">
                  View All Activity
                </Link>
              </div>
            </div>
            <div className="body">
              {loading ? (
                <p className="text-muted">Loading...</p>
              ) : transactions.filter((t) => t.type === "credit").length === 0 ? (
                <p className="text-center text-muted" style={{ padding: "24px 0" }}>
                  No activity yet. Start selling to see credits!
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Time</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions
                        .filter((t) => t.type === "credit")
                        .slice(0, 6)
                        .map((t, i) => {
                          const isTip = (t.purpose || "").toLowerCase().includes("tip");
                          const isSale = (t.purpose || "").toLowerCase().includes("sale") || (t.purpose || "").toLowerCase().includes("order");
                          return (
                            <tr key={i}>
                              <td>
                                <span className={`badge ${isTip ? "badge-warning" : isSale ? "badge-success" : "badge-info"}`}>
                                  {isTip ? "Tip" : isSale ? "Sale" : "Credit"}
                                </span>
                              </td>
                              <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {(t.purpose || "Credit").substring(0, 35)}
                              </td>
                              <td className="text-muted">{timeAgo(t.createdAt)}</td>
                              <td className="text-right text-success font-weight-bold">+{fmt(t.amount)}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 6 – BIDDING, TRUST & PRODUCT VIEWS
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix row-deck">

        {/* Bidding Overview */}
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card">
            <div className="header">
              <h2>Bidding Overview</h2>
              <ul className="header-dropdown">
                <li>
                  <Link to="/seller/bidding-products-table" title="View All">
                    <i className="fa fa-external-link"></i>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="body">
              <table className="table table-hover mb-3">
                <tbody>
                  {[
                    { label: "Products in Bidding", value: biddingProducts.length, badge: "badge-primary" },
                    { label: "Live / Active Bids", value: liveBids, badge: "badge-success" },
                    { label: "Completed Auctions", value: biddingProducts.filter((b) => b.status === "closed" || b.status === "Closed").length, badge: "badge-default" },
                    { label: "Highest Bid", value: fmt(biddingProducts.reduce((max, b) => Math.max(max, b.currentBid || b.highestBid || b.startingBid || 0), 0)), badge: "badge-warning" },
                  ].map(({ label, value, badge }) => (
                    <tr key={label}>
                      <td className="text-muted">{label}</td>
                      <td className="text-right">
                        {loading ? (
                          <span className="text-muted">—</span>
                        ) : (
                          <span className={`badge ${badge}`}>{value}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link to="/seller/bidding-products-table" className="btn btn-secondary btn-sm btn-block text-center justify-content-center">
                View Bidding Products
              </Link>
            </div>
          </div>
        </div>

        {/* Trust & Credibility */}
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card">
            <div className="header">
              <h2>Trust & Credibility</h2>
            </div>
            <div className="body">
              <table className="table table-hover mb-3">
                <tbody>
                  {[
                    { icon: "fa-check-circle", label: "Certification Status", value: `${certifiedCount} Certified`, badge: "badge-success" },
                    { icon: "fa-shield", label: "Verification Badge", value: verificationStatus, badge: isVerified ? "badge-success" : "badge-default" },
                    { icon: "fa-cube", label: "Products Uploaded", value: `${totalProducts} Products`, badge: "badge-primary" },
                    { icon: "fa-check", label: "Active Listings", value: `${activeListings} Active`, badge: "badge-warning" },
                  ].map(({ icon, label, value, badge }) => (
                    <tr key={label}>
                      <td>
                        <i className={`fa ${icon} mr-2 text-muted`}></i>
                        <span className="text-muted">{label}</span>
                      </td>
                      <td className="text-right">
                        {loading ? (
                          <span className="text-muted">—</span>
                        ) : (
                          <span className={`badge ${badge}`}>{value}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex" style={{ gap: 8 }}>
                <Link to="/seller/certification" className="btn btn-success btn-sm flex-fill text-center justify-content-center">Certification</Link>
                <Link to="/seller/insurance" className="btn btn-primary btn-sm flex-fill text-center justify-content-center">Insurance</Link>
                <Link to="/artsays-community/setting" state={{ tab: "verified" }} className="btn btn-warning btn-sm flex-fill text-center justify-content-center">Badge</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Views & Stock */}
        <div className="col-lg-4 col-md-12">
          <div className="card">
            <div className="header">
              <h2>Product Views & Stock <small>Top products by views</small></h2>
            </div>
            <div className="body">
              {loading ? (
                <p className="text-muted">Loading...</p>
              ) : topProducts.length === 0 ? (
                <p className="text-center text-muted">Upload products to see insights</p>
              ) : (
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Views</th>
                      <th className="text-center">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((p, i) => (
                      <tr key={i}>
                        <td style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>
                          {p.productName || p.title || "Product"}
                        </td>
                        <td className="text-center">
                          <span className="badge badge-info">{num(p.viewCount || 0)}</span>
                        </td>
                        <td className="text-center">
                          <span className={`badge ${(p.quantity || 0) > 0 ? "badge-success" : "badge-danger"}`}>
                            {p.quantity || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
