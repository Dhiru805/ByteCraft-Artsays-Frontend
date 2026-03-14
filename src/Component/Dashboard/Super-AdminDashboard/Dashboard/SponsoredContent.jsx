import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const POST_STATUS_META = {
  pending:   { label: "Pending",   cls: "badge-warning"   },
  active:    { label: "Active",    cls: "badge-success"   },
  completed: { label: "Completed", cls: "badge-secondary" },
};

const PROD_STATUS_META = {
  published:          { label: "Active",  cls: "badge-success" },
  paused_low_wallet:  { label: "Paused",  cls: "badge-danger"  },
  paused_daily_limit: { label: "Paused",  cls: "badge-danger"  },
  draft:              { label: "Draft",   cls: "badge-warning" },
  closed:             { label: "Closed",  cls: "badge-secondary"},
};

const PAYMENT_META = {
  Paid:    { label: "Paid",    cls: "badge-success" },
  Pending: { label: "Pending", cls: "badge-warning" },
  Failed:  { label: "Failed",  cls: "badge-danger"  },
};

function fmt(n) {
  if (!n) return "₹0";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function fmtNum(n) {
  if (!n || n === 0) return "—";
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

export default function SponsoredContent({ sponsoredContent = {}, loading }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("posts"); // "posts" | "products"
  const [search, setSearch] = useState("");

  const { boostedPosts = [], productPromotions = [] } = sponsoredContent;

  const filteredPosts = boostedPosts.filter(
    (p) =>
      !search ||
      p.creator?.toLowerCase().includes(search.toLowerCase()) ||
      p.preview?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = productPromotions.filter(
    (p) =>
      !search ||
      p.creator?.toLowerCase().includes(search.toLowerCase()) ||
      p.campaignName?.toLowerCase().includes(search.toLowerCase()) ||
      p.productName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = boostedPosts.length + productPromotions.length;

  return (
    <div className="row clearfix">
      <div className="col-lg-12">
        <div className="card">
          <div className="header d-flex align-items-center justify-content-between flex-wrap" style={{ gap: 8 }}>
            <div>
              <h2>
                Sponsored Content &amp; Boosted Posts
                <small className="ml-2">
                  {totalItems} active promotion{totalItems !== 1 ? "s" : ""}
                </small>
              </h2>
            </div>
            <div className="d-flex" style={{ gap: 8 }}>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => navigate("/super-admin/community-management")}
              >
                <i className="fa fa-users mr-1" />
                Community Posts
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => navigate("/super-admin/advertise")}
              >
                <i className="fa fa-product-hunt mr-1" />
                Product Campaigns
              </button>
            </div>
          </div>

          <div className="body" style={{ paddingTop: 0 }}>
            {/* Tabs */}
            <div className="d-flex align-items-center justify-content-between flex-wrap mb-3" style={{ gap: 8 }}>
              <ul className="nav nav-tabs" style={{ borderBottom: "none", gap: 4 }}>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-sm ${tab === "posts" ? "btn-primary active" : "btn-outline-secondary"}`}
                    onClick={() => { setTab("posts"); setSearch(""); }}
                    style={{ borderRadius: 6 }}
                  >
                    <i className="fa fa-image mr-1" />
                    Boosted Posts
                    {boostedPosts.length > 0 && (
                      <span className="badge badge-light ml-1">{boostedPosts.length}</span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-sm ${tab === "products" ? "btn-primary active" : "btn-outline-secondary"}`}
                    onClick={() => { setTab("products"); setSearch(""); }}
                    style={{ borderRadius: 6 }}
                  >
                    <i className="fa fa-shopping-bag mr-1" />
                    Product Promotions
                    {productPromotions.length > 0 && (
                      <span className="badge badge-light ml-1">{productPromotions.length}</span>
                    )}
                  </button>
                </li>
              </ul>

              <input
                type="text"
                className="form-control form-control-sm"
                placeholder={tab === "posts" ? "Search creator or caption..." : "Search creator or campaign..."}
                style={{ maxWidth: 240 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* ── Boosted Posts Tab ── */}
            {tab === "posts" && (
              loading ? (
                <div className="text-center py-4">
                  <i className="fa fa-spinner fa-spin fa-2x text-muted" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fa fa-image fa-2x mb-2 d-block" />
                  No boosted posts found
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-striped mb-0" style={{ fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th>Content Type</th>
                        <th>Creator</th>
                        <th>Caption Preview</th>
                        <th>Spend</th>
                        <th>Est. Reach</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map((p) => {
                        const sm = POST_STATUS_META[p.status] || { label: p.status, cls: "badge-secondary" };
                        const pm = PAYMENT_META[p.paymentStatus] || { label: p.paymentStatus, cls: "badge-secondary" };
                        return (
                          <tr key={p._id}>
                            <td>
                              <span className="badge badge-info" style={{ fontSize: 11 }}>
                                <i className="fa fa-image mr-1" />
                                Post
                              </span>
                            </td>
                            <td>
                              <span>{p.creator}</span>
                              <br />
                              <small className="text-muted">{p.creatorType}</small>
                            </td>
                            <td
                              style={{
                                maxWidth: 180,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: "#666",
                              }}
                              title={p.preview}
                            >
                              {p.preview || <span className="text-muted">—</span>}
                            </td>
                            <td>{fmt(p.spend)}</td>
                            <td>{p.reach || "—"}</td>
                            <td>
                              <span className={`badge ${pm.cls}`} style={{ fontSize: 11 }}>
                                {pm.label}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${sm.cls}`} style={{ fontSize: 11 }}>
                                {sm.label}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-xs btn-outline-primary"
                                onClick={() => navigate("/super-admin/community-management")}
                                title="View Post"
                              >
                                <i className="fa fa-eye" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {/* ── Product Promotions Tab ── */}
            {tab === "products" && (
              loading ? (
                <div className="text-center py-4">
                  <i className="fa fa-spinner fa-spin fa-2x text-muted" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fa fa-shopping-bag fa-2x mb-2 d-block" />
                  No product promotions found
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-striped mb-0" style={{ fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th>Content Type</th>
                        <th>Creator</th>
                        <th>Campaign / Product</th>
                        <th>Daily Budget</th>
                        <th>Total Spent</th>
                        <th>Impressions</th>
                        <th>Clicks</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => {
                        const sm = PROD_STATUS_META[p.status] || { label: p.status, cls: "badge-secondary" };
                        return (
                          <tr key={p._id}>
                            <td>
                              <span className="badge badge-primary" style={{ fontSize: 11 }}>
                                <i className="fa fa-shopping-bag mr-1" />
                                Product
                              </span>
                            </td>
                            <td>
                              <span>{p.creator}</span>
                              <br />
                              <small className="text-muted">{p.creatorType}</small>
                            </td>
                            <td>
                              <div style={{ maxWidth: 160 }}>
                                <div
                                  style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                  title={p.campaignName}
                                >
                                  {p.campaignName}
                                </div>
                                <small
                                  className="text-muted"
                                  style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}
                                  title={p.productName}
                                >
                                  {p.productName}
                                </small>
                              </div>
                            </td>
                            <td>{fmt(p.budget)}</td>
                            <td>{fmt(p.spend)}</td>
                            <td>{fmtNum(p.impressions)}</td>
                            <td>{fmtNum(p.clicks)}</td>
                            <td>
                              <span className={`badge ${sm.cls}`} style={{ fontSize: 11 }}>
                                {sm.label}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-xs btn-outline-primary"
                                onClick={() => navigate("/super-admin/advertise")}
                                title="View Campaign"
                              >
                                <i className="fa fa-eye" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
