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

const statusColor = (s = "") => {
  const map = {
    delivered: "#10b981",
    completed: "#10b981",
    "in progress": "#f59e0b",
    processing: "#f59e0b",
    pending: "#6366f1",
    cancelled: "#ef4444",
    rejected: "#ef4444",
    accepted: "#3b82f6",
    negotiation: "#8b5cf6",
    paid: "#10b981",
  };
  return map[s.toLowerCase()] || "#6b7280";
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ─── Mini Sparkline Bar ──────────────────────────────────────────────────────
const SparkBar = ({ data = [], color = "#6366f1", height = 36 }) => {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${Math.max(4, (v / max) * height)}px`,
            background: color,
            borderRadius: "2px 2px 0 0",
            opacity: i === data.length - 1 ? 1 : 0.45,
          }}
        />
      ))}
    </div>
  );
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

// ─── Inline bar comparing two values ────────────────────────────────────────
const DualBar = ({ a, b, colorA = "#6366f1", colorB = "#10b981" }) => {
  const max = Math.max(a, b, 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 4 }}>
      <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3 }}>
        <div style={{ width: `${pct(a, max)}%`, height: "100%", background: colorA, borderRadius: 3 }} />
      </div>
      <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3 }}>
        <div style={{ width: `${pct(b, max)}%`, height: "100%", background: colorB, borderRadius: 3 }} />
      </div>
    </div>
  );
};

// ─── Card wrapper ────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div
    className="card mb-0"
    style={{
      borderRadius: 14,
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      ...style,
    }}
  >
    <div className="body" style={{ padding: "18px 20px" }}>
      {children}
    </div>
  </div>
);

// ─── Section heading ─────────────────────────────────────────────────────────
const SH = ({ icon, title, sub, color = "#6366f1" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: `${color}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{title}</div>
      {sub && <div style={{ fontSize: 12, color: "#94a3b8" }}>{sub}</div>}
    </div>
  </div>
);

// ─── Stat tile ───────────────────────────────────────────────────────────────
const StatTile = ({ label, value, color = "#6366f1" }) => (
  <div
    style={{
      background: `${color}0d`,
      borderRadius: 10,
      padding: "10px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <div style={{ fontSize: 11, color: "#64748b" }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
  </div>
);

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const Skeleton = ({ h = 20, w = "100%", r = 6 }) => (
  <div
    style={{
      height: h,
      width: w,
      background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      borderRadius: r,
    }}
  />
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function ArtistDashboard() {
  const userId = localStorage.getItem("userId");
  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";

  // ── state ──
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [soldOrders, setSoldOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [biddingProducts, setBiddingProducts] = useState([]);
  const [socialProfile, setSocialProfile] = useState(null);
  const [certifications, setCertifications] = useState([]);
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
        // 1. Wallet — POST /api/wallet/ensure/:userId (finds or creates wallet)
        safe("wallet", async () => {
          const res = await axios.post(`${API_URL}/api/wallet/ensure/${userId}`, {}, { headers: authHeaders });
          setWallet(res.data || null);
        }),

        // 2. Transactions — user-all-transactions with fallback
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

        // 3. Artist's own products
        safe("products", async () => {
          const res = await axios.get(`${API_URL}/api/getproductbyartist/${userId}`, { headers: authHeaders });
          const d = res.data;
          setProducts(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
        }),

        // 4. Sold products list
        safe("soldProducts", async () => {
          const res = await axios.get(`${API_URL}/api/getartistsoldproductbyid/${userId}`, { headers: authHeaders });
          const d = res.data;
          setSoldProducts(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
        }),

          // 5. Artist's sold orders
          safe("soldOrders", async () => {
            const res = await axios.get(`${API_URL}/api/artist-purchases/${userId}`, { headers: authHeaders });
            const d = res.data;
            const arr = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
            setAllOrders(arr);
            // table shows only newly placed orders (status = "Ordered")
            setSoldOrders(arr.filter((o) => o.orderStatus === "Ordered"));
          }),

          // 6. Custom order requests for this artist — /api/get-buyer-request-data
          safe("customRequests", async () => {
            try {
              const res = await axios.get(`${API_URL}/api/get-buyer-request-data`, { headers: authHeaders });
              const d = res.data;
              const arr = Array.isArray(d?.buyerRequests) ? d.buyerRequests : Array.isArray(d) ? d : [];
              setCustomRequests(arr);
            } catch (err) {
              if (err.response?.status === 404) setCustomRequests([]);
              else throw err;
            }
          }),

        // 7. Bidding products added by this artist
        safe("biddingProducts", async () => {
          const res = await axios.get(`${API_URL}/api/bidding/products/user/${userId}`, { headers: authHeaders });
          const d = res.data;
          setBiddingProducts(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
        }),

        // 8. Social / community profile
        safe("socialProfile", async () => {
          const res = await axios.get(`${API_URL}/api/social-media/profile/${userId}`);
          const d = res.data;
          setSocialProfile(d?.profile || d?.data || d || null);
        }),

        // 9. Certifications
        safe("certifications", async () => {
          const res = await axios.get(`${API_URL}/api/get-certificationbyId/${userId}`, { headers: authHeaders });
          const d = res.data;
          setCertifications(Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : []);
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

  // earnings = total credited from escrow (sale earnings) in wallet txns
  const totalEarnings = wallet?.totalCredited || 0;

  // products stats
  const activeListings = products.filter(
    (p) => p.status === "Approved" || p.status === "approved" || p.status === "Active" || p.status === "active"
  ).length;
  const totalProducts = products.length;

    // sold stats — sum soldCount across all products (units sold per product)
    const totalSold = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);

  // social stats — profile.followers / following / posts are arrays
  const followers = Array.isArray(socialProfile?.followers)
    ? socialProfile.followers.length
    : (socialProfile?.followersCount || 0);
  const following = Array.isArray(socialProfile?.following)
    ? socialProfile.following.length
    : (socialProfile?.followingCount || 0);
  const posts = Array.isArray(socialProfile?.posts)
    ? socialProfile.posts.length
    : (socialProfile?.postsCount || 0);

    // custom orders grouped by status (fields from Buyercustomrequest model)
    // New Requests: artist hasn't responded yet
    const crNew = customRequests.filter(
      (r) => r.RequestStatus === "Pending"
    ).length;
    // In Discussion: artist approved but buyer hasn't approved yet (negotiation stage)
    const crDiscussion = customRequests.filter(
      (r) => r.RequestStatus === "Approved" && r.BuyerStatus !== "Approved"
    ).length;
    // Ordered: both artist & buyer approved AND buyer placed the order (OrderStatus = "Ordered")
    const crOrdered = customRequests.filter(
      (r) =>
        r.RequestStatus === "Approved" &&
        r.BuyerStatus === "Approved" &&
        r.OrderStatus === "Ordered"
    ).length;
    // Completed: order has been delivered
    const crCompleted = customRequests.filter(
      (r) => r.OrderStatus === "Delivered"
    ).length;

  // certifications
  const certifiedCount = certifications.length;
  // verified = array of badge objects on the social profile
  const isVerified = Array.isArray(socialProfile?.verified)
    ? socialProfile.verified.length > 0
    : !!socialProfile?.verificationBadge;
  const verificationStatus = isVerified ? "Verified Artist" : "Not Verified";

  // recent orders — sorted latest first, only "Ordered" status (already filtered in fetch)
  const recentOrders = [...soldOrders]
    .sort((a, b) => new Date(b.purchaseDate || b.createdAt || 0) - new Date(a.purchaseDate || a.createdAt || 0))
    .slice(0, 10);

  // bidding stats — status field from AddtoBidProd model
  const liveBids = biddingProducts.filter(
    (b) => b.status === "active" || b.status === "Active" || b.biddingStatus === "active" || b.isLive === true
  ).length;

  // monthly earnings breakdown from transactions
  const monthlyEarnings = (() => {
    const months = Array(12).fill(0);
    const now = new Date();
    transactions.forEach((t) => {
      if (t.type === "credit") {
        const d = new Date(t.createdAt);
        const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
        if (monthsAgo >= 0 && monthsAgo < 12) {
          months[11 - monthsAgo] += t.amount || 0;
        }
      }
    });
    return months;
  })();

  // top products — latest first, then by viewCount
  const topProducts = [...products]
    .sort((a, b) => {
      const dateDiff = new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (dateDiff !== 0) return dateDiff;
      return (b.viewCount || 0) - (a.viewCount || 0);
    })
    .slice(0, 4);

  // revenue source split (rough estimate)
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
    <div
      className="container-fluid"
      style={{ padding: "24px 20px", background: "#f7f8fc", minHeight: "100vh", fontFamily: "Poppins, sans-serif" }}
    >
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .dash-link { text-decoration: none; color: inherit; }
        .quick-action-btn {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 6px; padding: 14px 10px; border-radius: 12px; border: 1px solid #e5e7eb;
          background: #fff; text-decoration: none; color: #1e293b; font-size: 12px;
          font-weight: 600; transition: all 0.18s; cursor: pointer; min-width: 90px;
        }
        .quick-action-btn:hover { background: #6366f1; color: #fff; border-color: #6366f1; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99,102,241,0.25); }
        .quick-action-btn .qa-icon { font-size: 22px; }
        .order-row:hover { background: #f8faff; }
        .alert-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
        .alert-row:last-child { border-bottom: none; }
        .progress-bar-track { height: 6px; background: #e5e7eb; border-radius: 3px; flex: 1; }
        .progress-bar-fill { height: 100%; border-radius: 3px; }
        .badge-pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
      `}</style>

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, color: "#1e293b", fontSize: 22 }}>
            Artist Dashboard
          </h4>
          <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
            Welcome back, {firstName} {lastName}! Here's your art business at a glance.
          </p>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "6px 14px",
            fontSize: 12,
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 1 – HERO METRICS
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix mb-4">
        {[
          {
            label: "Total Earnings",
            value: loading ? null : fmt(totalEarnings),
            sub: `Wallet: ${fmt(walletBalance)} · Pending: ${fmt(pendingSettlement)}`,
            icon: "₹",
            color: "#6366f1",
            spark: monthlyEarnings.slice(-12),
          },
          {
            label: "Products Sold",
            value: loading ? null : num(totalSold),
            sub: `${totalProducts} total listings`,
            icon: "🛒",
            color: "#10b981",
            spark: Array(12).fill(0).map(() => Math.floor(Math.random() * totalSold / 4 + 1)),
          },
          {
            label: "Active Listings",
            value: loading ? null : num(activeListings),
            sub: `${totalProducts} products · ${customRequests.length} custom`,
            icon: "🖼",
            color: "#f59e0b",
            spark: Array(12).fill(activeListings).map((v, i) => v - i),
          },
          {
            label: "Community Reach",
            value: loading ? null : num(followers),
            sub: `${num(following)} following · ${num(posts)} posts`,
            icon: "👥",
            color: "#8b5cf6",
            spark: Array(12).fill(0).map((_, i) => Math.floor(followers * (i + 1) / 15)),
          },
        ].map(({ label, value, sub, icon, color, spark }) => (
          <div key={label} className="col-lg-3 col-md-6 col-sm-6 mb-3">
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginBottom: 4 }}>{label}</div>
                  {loading ? (
                    <Skeleton h={28} w="70%" />
                  ) : (
                    <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
                  )}
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{sub}</div>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <SparkBar data={spark} color={color} height={32} />
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 2 – QUICK ACTIONS
      ══════════════════════════════════════════════════════════ */}
      <Card style={{ marginBottom: 24 }}>
        <SH icon="🚀" title="Quick Actions" sub="Jump straight to what matters" color="#6366f1" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { icon: "➕", label: "Add Product", to: "/artist/product" },
            { icon: "✍️", label: "Write a Blog", to: "/artist/bloglist" },
            { icon: "🎨", label: "Create Post", to: "/community/create-post" },
            { icon: "📢", label: "Promote Post", to: "/community/promote-post" },
            { icon: "🔨", label: "Custom Orders", to: "/artist/custom-order" },
            { icon: "🔴", label: "Go Live", to: "/community/live" },
          ].map(({ icon, label, to }) => (
            <Link key={label} to={to} className="quick-action-btn">
              <span className="qa-icon">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* ══════════════════════════════════════════════════════════
          ZONE 3 – SALES & BUSINESS
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix mb-4">
        {/* Recent Orders */}
        <div className="col-lg-7 col-md-12 mb-3">
          <Card style={{ height: "100%" }}>
            <SH icon="🛒" title="New Orders" sub="Freshly placed orders needing your attention" color="#10b981" />
            <div className="table-responsive">
              <table
                className="table table-hover mb-0"
                style={{ fontSize: 13 }}
              >
                <thead>
                  <tr style={{ color: "#94a3b8", fontSize: 11 }}>
                    <th>PRODUCT</th>
                    <th>BUYER</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <tr key={i}>
                        {[1, 2, 3, 4].map((j) => (
                          <td key={j}>
                            <Skeleton h={14} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", color: "#94a3b8", padding: "24px 0" }}>
                        No new orders yet
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order, i) => {
                        const productName =
                          order.productName ||
                          order.product?.productName ||
                          order.items?.[0]?.name ||
                          "Artwork";
                        const buyerName =
                          order.buyerName ||
                          order.userId?.name ||
                          order.Buyer?.name ||
                          order.buyer?.name ||
                          "—";
                        const amount = order.subtotal || order.totalAmount || order.amount || order.price || 0;
                          return (
                          <tr key={i} className="order-row">
                            <td style={{ fontWeight: 600, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {productName}
                            </td>
                            <td style={{ color: "#64748b" }}>{buyerName}</td>
                            <td style={{ fontWeight: 600, color: "#10b981" }}>{fmt(amount)}</td>
                            <td>
                              <span
                                className="badge-pill"
                                style={{
                                  background: "#17a2b818",
                                  color: "#17a2b8",
                                }}
                              >
                                New Order Received
                              </span>
                            </td>
                          </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 14, textAlign: "right" }}>
              <Link
                to="/artist/product-purchase"
                style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, textDecoration: "none" }}
              >
                View All Orders →
              </Link>
            </div>
          </Card>
        </div>

        {/* Wallet + Custom Orders */}
        <div className="col-lg-5 col-md-12 mb-3" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Wallet */}
          <Card>
            <SH icon="💰" title="Wallet & Payments" color="#f59e0b" />
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Wallet Balance</div>
                {loading ? (
                  <Skeleton h={28} w="60%" />
                ) : (
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#f59e0b" }}>
                    {fmt(walletBalance)}
                  </div>
                )}
                {pendingSettlement > 0 && (
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    {fmt(pendingSettlement)} pending settlement
                  </div>
                )}
              </div>
              <Donut
                segments={donutSegments}
                size={80}
                stroke={14}
              />
            </div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>
              Recent Transactions
            </div>
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <Skeleton h={14} />
                </div>
              ))
            ) : transactions.length === 0 ? (
              <div style={{ color: "#94a3b8", fontSize: 12 }}>No transactions yet</div>
            ) : (
              transactions.slice(0, 3).map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    borderBottom: i < 2 ? "1px solid #f1f5f9" : "none",
                    fontSize: 13,
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 500 }}>
                      {(t.purpose || "Transaction").substring(0, 28)}
                    </span>
                    <span style={{ color: "#94a3b8", fontSize: 11 }}>
                      {" "}· {timeAgo(t.createdAt)}
                    </span>
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: t.type === "credit" ? "#10b981" : "#ef4444",
                    }}
                  >
                    {t.type === "credit" ? "+" : "-"}{fmt(t.amount)}
                  </div>
                </div>
              ))
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <Link
                to="/artist/wallet"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px 0",
                  background: "#f8faff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#6366f1",
                  textDecoration: "none",
                }}
              >
                View Wallet
              </Link>
              <Link
                to="/artist/wallet"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px 0",
                  background: "#6366f1",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                Withdraw
              </Link>
            </div>
          </Card>

          {/* Custom Orders */}
          <Card>
            <SH icon="🎨" title="Custom Orders" color="#8b5cf6" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                {[
                  { label: "New Requests", value: crNew, color: "#6366f1" },
                  { label: "In Discussion", value: crDiscussion, color: "#f59e0b" },
                  { label: "Ordered", value: crOrdered, color: "#3b82f6" },
                  { label: "Completed", value: crCompleted, color: "#10b981" },
                ].map(({ label, value, color }) => (
                <div
                  key={label}
                  style={{
                    textAlign: "center",
                    padding: "12px 8px",
                    background: `${color}0d`,
                    borderRadius: 10,
                  }}
                >
                  {loading ? (
                    <Skeleton h={24} w="50%" style={{ margin: "0 auto" }} />
                  ) : (
                    <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
                  )}
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>
            <Link
              to="/artist/custom-order"
              style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, textDecoration: "none" }}
            >
              Manage Custom Orders →
            </Link>
          </Card>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 4 – COMMUNITY & GROWTH HUB
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix mb-4">
        {/* Community Insights */}
        <div className="col-lg-6 col-md-12 mb-3">
          <Card style={{ height: "100%" }}>
            <SH icon="🌐" title="Community Insights" sub="Your social presence" color="#8b5cf6" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {[
                {
                  label: "Total Followers",
                  value: loading ? null : num(followers),
                  color: "#8b5cf6",
                },
                {
                  label: "Following",
                  value: loading ? null : num(following),
                  color: "#6366f1",
                },
                {
                  label: "Total Posts",
                  value: loading ? null : num(posts),
                  color: "#10b981",
                },
                {
                  label: "Profile Views",
                  value: loading ? null : num(socialProfile?.profileViews || 0),
                  color: "#f59e0b",
                },
              ].map(({ label, value, color }) => (
                <StatTile key={label} label={label} value={loading ? "—" : value} color={color} />
              ))}
            </div>

            {/* Profile avatar + name */}
            {!loading && socialProfile && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  background: "#f8faff",
                  borderRadius: 10,
                  marginBottom: 14,
                }}
              >
                {socialProfile.profilePicture || socialProfile.profileImage ? (
                  <img
                    src={
                      `${process.env.REACT_APP_API_URL_FOR_IMAGE || ""}${socialProfile.profilePicture || socialProfile.profileImage}`
                    }
                    alt="profile"
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#8b5cf6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    {firstName?.[0]?.toUpperCase() || "A"}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>
                    @{socialProfile.username || socialProfile.handle || `${firstName.toLowerCase()}`}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    {socialProfile.bio ? socialProfile.bio.substring(0, 50) : "Artist profile"}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <Link
                to="/community/profile"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px 0",
                  background: "#f8faff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#8b5cf6",
                  textDecoration: "none",
                }}
              >
                View Profile
              </Link>
              <Link
                to="/community/create-post"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px 0",
                  background: "#8b5cf6",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                Create Post
              </Link>
            </div>
          </Card>
        </div>

        {/* Engagement Alerts */}
        <div className="col-lg-6 col-md-12 mb-3">
          <Card style={{ height: "100%" }}>
            <SH icon="🔔" title="Engagement Activity" sub="Tip & wallet credit history" color="#f59e0b" />
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <Skeleton h={16} />
                </div>
              ))
            ) : transactions.filter((t) => t.type === "credit").length === 0 ? (
              <div style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "24px 0" }}>
                No activity yet. Start engaging with your community!
              </div>
            ) : (
              transactions
                .filter((t) => t.type === "credit")
                .slice(0, 6)
                .map((t, i) => {
                  const isTip = (t.purpose || "").toLowerCase().includes("tip");
                  const isSale = (t.purpose || "").toLowerCase().includes("sale") || (t.purpose || "").toLowerCase().includes("order");
                  const icon = isTip ? "💰" : isSale ? "🛒" : "✅";
                  return (
                    <div key={i} className="alert-row">
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          background: "#f8faff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      >
                        {icon}
                      </div>
                      <div style={{ flex: 1, fontSize: 13 }}>
                        <span style={{ fontWeight: 500 }}>
                          {(t.purpose || "Credit").substring(0, 40)}
                        </span>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{timeAgo(t.createdAt)}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: "#10b981", fontSize: 14 }}>
                        +{fmt(t.amount)}
                      </div>
                    </div>
                  );
                })
            )}
            <Link
              to="/community/notifications"
              style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, textDecoration: "none", display: "block", marginTop: 8 }}
            >
              View All Activity →
            </Link>
          </Card>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 5 – BIDDING, TRUST & EXPANSION
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix mb-4">
        {/* Bidding Overview */}
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
          <Card style={{ height: "100%" }}>
            <SH icon="🔨" title="Bidding Overview" color="#f59e0b" />
            {[
              { label: "Products in Bidding", value: biddingProducts.length, color: "#6366f1" },
              { label: "Live / Active Bids", value: liveBids, color: "#10b981" },
              { label: "Completed Auctions", value: biddingProducts.filter((b) => b.status === "closed" || b.status === "Closed").length, color: "#f59e0b" },
              { label: "Highest Bid", value: fmt(biddingProducts.reduce((max, b) => Math.max(max, b.currentBid || b.highestBid || b.startingBid || 0), 0)), color: "#8b5cf6" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 0",
                  borderBottom: "1px solid #f1f5f9",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#64748b" }}>{label}</span>
                {loading ? (
                  <Skeleton h={14} w="20%" />
                ) : (
                  <span style={{ fontWeight: 700, color }}>{value}</span>
                )}
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <Link
                to="/artist/bidding-products-table"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "8px 0",
                  background: "#f8faff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#6366f1",
                  textDecoration: "none",
                }}
              >
                View Bidding Products
              </Link>
            </div>
          </Card>
        </div>

        {/* Trust & Credibility */}
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
          <Card style={{ height: "100%" }}>
            <SH icon="🛡" title="Trust & Credibility" color="#10b981" />
            {[
              {
                icon: "✅",
                label: "Certification Status",
                value: loading ? "—" : `${certifiedCount} Certified`,
                color: "#10b981",
              },
              {
                icon: "🛡",
                label: "Verification Badge",
                  value: loading ? "—" : verificationStatus,
                  color: isVerified ? "#10b981" : "#94a3b8",
              },
              {
                icon: "📦",
                label: "Products Uploaded",
                value: loading ? "—" : `${totalProducts} Products`,
                color: "#6366f1",
              },
              {
                icon: "🏅",
                label: "Active Listings",
                value: loading ? "—" : `${activeListings} Active`,
                color: "#f59e0b",
              },
            ].map(({ icon, label, value, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 0",
                  borderBottom: "1px solid #f1f5f9",
                  fontSize: 13,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#64748b" }}>
                  {icon} {label}
                </div>
                <span style={{ fontWeight: 700, color, fontSize: 12 }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              <Link
                to="/artist/certification"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "7px 0",
                  background: "#10b98118",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#10b981",
                  textDecoration: "none",
                }}
              >
                Certification
              </Link>
              <Link
                to="/artist/insurance"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "7px 0",
                  background: "#6366f118",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6366f1",
                  textDecoration: "none",
                }}
              >
                Insurance
              </Link>
              <Link
                to="/community/badge"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "7px 0",
                  background: "#f59e0b18",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#f59e0b",
                  textDecoration: "none",
                }}
              >
                Buy Badge
              </Link>
            </div>
          </Card>
        </div>

        {/* Achievements + Announcements */}
        <div className="col-lg-4 col-md-12 col-sm-12 mb-3" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <SH icon="🏆" title="Achievements" color="#f59e0b" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                isVerified && { icon: "🏅", label: "Verified Artist", color: "#6366f1" },
                totalSold >= 10 && { icon: "⭐", label: "Top Seller", color: "#f59e0b" },
                followers >= 100 && { icon: "✨", label: "Community Star", color: "#8b5cf6" },
                certifiedCount > 0 && { icon: "🖼", label: "Exhibited Artist", color: "#10b981" },
              ]
                .filter(Boolean)
                .map((badge) => (
                  <span
                    key={badge.label}
                    className="badge-pill"
                    style={{ background: `${badge.color}18`, color: badge.color }}
                  >
                    {badge.icon} {badge.label}
                  </span>
                ))}
              {!loading &&
                !isVerified &&
                totalSold < 10 &&
                followers < 100 &&
                certifiedCount === 0 && (
                  <span style={{ color: "#94a3b8", fontSize: 12 }}>
                    Complete milestones to earn badges!
                  </span>
                )}
            </div>
          </Card>

          <Card>
            <SH icon="📣" title="Announcements" color="#6366f1" />
            {[
              { text: "New Exhibition invites available", color: "#6366f1", link: "/artist/exhibition" },
              { text: "Featured Artist Program is open", color: "#10b981", link: "/artist/profile" },
              { text: "Platform update: New analytics tools", color: "#f59e0b", link: "/artist/analytics" },
            ].map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 0",
                  borderBottom: i < 2 ? "1px solid #f1f5f9" : "none",
                  fontSize: 12,
                }}
              >
                <div
                  style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0 }}
                />
                <Link to={a.link} style={{ color: "#1e293b", textDecoration: "none", fontWeight: 500 }}>
                  {a.text}
                </Link>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 6 – ANALYTICS & INSIGHTS
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix mb-4">
        {/* Earnings Trend */}
        <div className="col-lg-5 col-md-12 mb-3">
          <Card style={{ height: "100%" }}>
            <SH icon="📊" title="Earnings Trend" sub="Credits to your wallet (last 12 months)" color="#6366f1" />
            <div style={{ marginBottom: 8 }}>
              <SparkBar data={monthlyEarnings} color="#6366f1" height={64} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "#94a3b8",
                marginBottom: 16,
              }}
            >
              {["12m ago", "9m", "6m", "3m", "Now"].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <StatTile label="Wallet Balance" value={fmt(walletBalance)} color="#6366f1" />
              <StatTile label="Total Credited" value={fmt(totalEarnings)} color="#10b981" />
              <StatTile label="Pending Payout" value={fmt(pendingSettlement)} color="#f59e0b" />
              <StatTile label="Total Sold" value={`${totalSold} items`} color="#8b5cf6" />
            </div>

            {/* Revenue Source Donut */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Donut segments={donutSegments} size={80} stroke={14} />
              <div style={{ flex: 1 }}>
                {donutSegments.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12,
                      marginBottom: 5,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
                      <span>{s.label}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: s.color }}>
                      {pct(s.value, totalEarnings || 1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Product Views vs Sales */}
        <div className="col-lg-4 col-md-12 mb-3" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
              <SH icon="👁" title="Product Views & Stock" color="#8b5cf6" />
            {loading ? (
              [1, 2, 3, 4].map((i) => <Skeleton key={i} h={40} style={{ marginBottom: 10 }} />)
            ) : topProducts.length === 0 ? (
              <div style={{ color: "#94a3b8", fontSize: 12, textAlign: "center", padding: "16px 0" }}>
                Upload products to see insights
              </div>
            ) : (
              topProducts.map((p, i) => {
                  const views = p.viewCount || 0;
                  const qty = p.quantity || 0;
                  const maxV = Math.max(...topProducts.map((x) => x.viewCount || 1), 1);
                  const maxQ = Math.max(...topProducts.map((x) => x.quantity || 1), 1);
                  return (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 12,
                          marginBottom: 3,
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "#1e293b", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.productName || p.title || "Artwork"}
                        </span>
                          <span style={{ color: "#94a3b8" }}>
                            {num(views)} views · {qty} qty
                          </span>
                      </div>
                      <DualBar a={pct(views, maxV)} b={pct(qty, maxQ)} colorA="#8b5cf6" colorB="#10b981" />
                    </div>
                  );
                })
            )}
          </Card>

          <Card>
            <SH icon="👑" title="Membership Summary" color="#8b5cf6" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Subscribers", value: loading ? "—" : num(socialProfile?.membershipsCount || 0), color: "#8b5cf6" },
                { label: "Tips Received", value: loading ? "—" : fmt(tipTotal), color: "#f59e0b" },
                { label: "Marketplace Earnings", value: loading ? "—" : fmt(marketplaceTotal), color: "#10b981" },
                { label: "Other Credits", value: loading ? "—" : fmt(membershipTotal), color: "#6366f1" },
              ].map(({ label, value, color }) => (
                <StatTile key={label} label={label} value={value} color={color} />
              ))}
            </div>
          </Card>
        </div>

        {/* Smart Alerts */}
        <div className="col-lg-3 col-md-12 mb-3">
          <Card style={{ height: "100%" }}>
            <SH icon="⚡" title="Smart Alerts" sub="Action recommendations" color="#ef4444" />
            {[
              !loading && activeListings === 0 && {
                icon: "🖼",
                text: "Upload your first product to start selling",
                color: "#6366f1",
                link: "/artist/product",
                cta: "Add Product",
              },
              !loading && totalSold === 0 && activeListings > 0 && {
                icon: "💡",
                text: "No sales yet — check your pricing strategy",
                color: "#f59e0b",
                link: "/artist/product",
                cta: "Edit Listings",
              },
              !loading && !socialProfile && {
                icon: "👤",
                text: "Create your community profile to grow followers",
                color: "#8b5cf6",
                link: "/community/create-profile",
                cta: "Create Profile",
              },
              !loading && crNew > 0 && {
                icon: "📨",
                text: `${crNew} new custom order request${crNew > 1 ? "s" : ""} waiting`,
                color: "#ef4444",
                link: "/artist/custom-order",
                cta: "Review Now",
              },
              !loading && certifiedCount === 0 && {
                icon: "🏅",
                text: "Get certified to boost buyer trust",
                color: "#10b981",
                link: "/artist/certification",
                cta: "Get Certified",
              },
              !loading && liveBids === 0 && totalProducts > 0 && {
                icon: "🔨",
                text: "Add products to bidding for higher prices",
                color: "#f59e0b",
                link: "/artist/bidding-products-table",
                cta: "Start Bidding",
              },
            ]
              .filter(Boolean)
              .slice(0, 5)
              .map((alert, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 12px",
                    background: `${alert.color}0d`,
                    border: `1px solid ${alert.color}25`,
                    borderRadius: 10,
                    marginBottom: 10,
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                    <span>{alert.icon}</span>
                    <span style={{ color: "#1e293b", fontWeight: 500, lineHeight: 1.4 }}>{alert.text}</span>
                  </div>
                  <Link
                    to={alert.link}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: alert.color,
                      textDecoration: "none",
                    }}
                  >
                    {alert.cta} →
                  </Link>
                </div>
              ))}
            {!loading &&
              activeListings > 0 &&
              totalSold > 0 &&
              socialProfile &&
              crNew === 0 &&
              certifiedCount > 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px 0",
                    color: "#10b981",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  ✅ Everything looks great! Keep creating.
                </div>
              )}
            {loading &&
              [1, 2, 3].map((i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <Skeleton h={60} r={10} />
                </div>
              ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
