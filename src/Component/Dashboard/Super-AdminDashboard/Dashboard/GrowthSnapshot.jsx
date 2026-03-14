import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ITEMS = [
  { key: "newArtists7d",  label: "New Artists",  icon: "fa-users",        bg: "primary-bg",  route: "artist-management" },
  { key: "newBuyers7d",   label: "New Buyers",   icon: "fa-user",         bg: "secondary-bg",route: "buyer-management" },
  { key: "newProducts7d", label: "New Products", icon: "fa-image",        bg: "bg-dark",     route: "product-management/table" },
  { key: "orders7d",      label: "New Orders",   icon: "fa-shopping-bag", bg: "bg-info",     route: "product-management/purchasetable" },
  { key: "revenue7d",     label: "Revenue (7d)", icon: "fa-inr",          bg: "primary-bg",  route: "wallet", isRevenue: true, hasBreakdown: true },
];

const BREAKDOWN_LABELS = [
  { key: "orderCommission",     label: "Order Commission" },
  { key: "adCampaigns",         label: "Ad Campaigns" },
  { key: "promotePosts",        label: "Promote Posts" },
  { key: "certifications",      label: "Certifications" },
  { key: "insurance",           label: "Insurance" },
  { key: "biddingPass",         label: "Bidding Pass" },
  { key: "memberships",         label: "Memberships" },
  { key: "challenges",          label: "Challenges" },
  { key: "exhibitionPromotion", label: "Exhibition Promotion" },
  { key: "tips",                label: "Tips" },
];

function fmt(val, isRevenue) {
  const n = val || 0;
  if (isRevenue) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toLocaleString("en-IN")}`;
  }
  return `+${n.toLocaleString("en-IN")}`;
}

function fmtRaw(val) {
  const n = val || 0;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function GrowthSnapshot({ growth = {}, loading }) {
  const navigate = useNavigate();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const breakdown7d = growth.revenueBreakdown7d || {};

  return (
    <>
      <div className="row clearfix row-deck">
        {ITEMS.map((item) => (
          <div key={item.key} className="col-lg col-md-4 col-sm-6">
            <div
              className={`card top_widget ${item.bg}`}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/super-admin/${item.route}`)}
            >
              <div className="body">
                <div className="icon bg-light">
                  <i className={`fa ${item.icon}`}></i>
                </div>
                <div className="content text-light">
                  <div className="text mb-2 text-uppercase">{item.label}</div>
                  <h4 className="number mb-0">
                    {loading ? "—" : fmt(growth[item.key], item.isRevenue)}
                  </h4>
                  <small>Last 7 days</small>
                  {item.hasBreakdown && !loading && (
                    <small
                      style={{ display: "block", marginTop: 4, opacity: 0.85, fontSize: "11px", textDecoration: "underline dotted" }}
                      onClick={(e) => { e.stopPropagation(); setShowBreakdown(true); }}
                    >
                      View breakdown
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 7d Revenue Breakdown Modal ── */}
      {showBreakdown && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)", zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={() => setShowBreakdown(false)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 10, padding: "28px 32px",
              minWidth: 360, maxWidth: 480, boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <h5 style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>
                <i className="fa fa-inr mr-2" style={{ color: "#6c5ce7" }}></i>
                Revenue Breakdown — Last 7 Days
              </h5>
              <button
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888", lineHeight: 1 }}
                onClick={() => setShowBreakdown(false)}
              >
                &times;
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ textAlign: "left", paddingBottom: 8, color: "#555", fontWeight: 600 }}>Source</th>
                  <th style={{ textAlign: "right", paddingBottom: 8, color: "#555", fontWeight: 600 }}>Amount</th>
                  <th style={{ textAlign: "right", paddingBottom: 8, color: "#555", fontWeight: 600 }}>%</th>
                </tr>
              </thead>
              <tbody>
                {BREAKDOWN_LABELS.map(({ key, label }) => {
                  const val = breakdown7d[key] || 0;
                  const pct = growth.revenue7d > 0 ? ((val / growth.revenue7d) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={key} style={{ borderBottom: "1px solid #f7f7f7" }}>
                      <td style={{ padding: "7px 0", color: "#444" }}>{label}</td>
                      <td style={{ textAlign: "right", padding: "7px 0", fontWeight: val > 0 ? 600 : 400, color: val > 0 ? "#2d3436" : "#aaa" }}>
                        {fmtRaw(val)}
                      </td>
                      <td style={{ textAlign: "right", padding: "7px 0", color: "#888", fontSize: 12 }}>
                        {pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid #f0f0f0" }}>
                  <td style={{ paddingTop: 10, fontWeight: 700, fontSize: 15 }}>Total</td>
                  <td style={{ textAlign: "right", paddingTop: 10, fontWeight: 700, fontSize: 15, color: "#6c5ce7" }}>
                    {fmt(growth.revenue7d, true)}
                  </td>
                  <td style={{ textAlign: "right", paddingTop: 10, fontWeight: 700, color: "#888", fontSize: 12 }}>100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
