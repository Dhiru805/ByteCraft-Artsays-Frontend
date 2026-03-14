import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const STATUS_META = {
  published:          { label: "Active",   cls: "badge-success"  },
  draft:              { label: "Pending",  cls: "badge-warning"  },
  closed:             { label: "Expired",  cls: "badge-secondary"},
  paused_low_wallet:  { label: "Paused",   cls: "badge-danger"   },
  paused_daily_limit: { label: "Paused",   cls: "badge-danger"   },
};

function KPICard({ icon, label, value, color, loading }) {
  return (
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="card">
        <div className="body">
          <div className="d-flex align-items-center">
            <div
              className="d-flex align-items-center justify-content-center mr-3"
              style={{
                width: 48, height: 48, borderRadius: 8,
                background: color + "22",
                flexShrink: 0,
              }}
            >
              <i className={`fa fa-${icon}`} style={{ color, fontSize: 20 }} />
            </div>
            <div>
              <p className="mb-0 text-muted" style={{ fontSize: 12 }}>{label}</p>
              {loading ? (
                <div className="shimmer" style={{ width: 60, height: 22, borderRadius: 4, marginTop: 2 }} />
              ) : (
                <h4 className="mb-0 font-weight-bold">{value}</h4>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdsOverview({ adsOverview = {}, loading }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const {
    activeAds = 0,
      pendingAds = 0,
      expiredAds = 0,
      adRevenue = 0,
      promotePostRevenue = 0,
      recentCampaigns = [],
  } = adsOverview;

  const fmt = (n) =>
    n >= 1e7
      ? `₹${(n / 1e7).toFixed(2)}Cr`
      : n >= 1e5
      ? `₹${(n / 1e5).toFixed(1)}L`
      : `₹${Number(n).toLocaleString("en-IN")}`;

  const filtered = recentCampaigns.filter((c) =>
    !search ||
    c.campaignName?.toLowerCase().includes(search.toLowerCase()) ||
    c.advertiser?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="row clearfix">
      <div className="col-lg-12">
        <div className="card">
          <div className="header d-flex align-items-center justify-content-between flex-wrap" style={{ gap: 8 }}>
            <div>
              <h2>
                Ads &amp; Promotions Overview
                <small className="ml-2">All artist ad campaigns</small>
              </h2>
            </div>
            <div className="d-flex" style={{ gap: 8 }}>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => navigate("/super-admin/advertise")}
              >
                <i className="fa fa-eye mr-1" />
                All Campaigns
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => navigate("/super-admin/settings/marketing")}
              >
                <i className="fa fa-cog mr-1" />
                Marketing Settings
              </button>
            </div>
          </div>

          {/* KPI Row */}
          <div className="body" style={{ paddingBottom: 0, paddingTop: 0 }}>
            <div className="row">
              <KPICard
                icon="play-circle"
                label="Active Ads"
                value={activeAds}
                color="#4CAF50"
                loading={loading}
              />
               <KPICard
                  icon="bullhorn"
                  label="Promote Post Revenue"
                  value={fmt(promotePostRevenue)}
                  color="#9C27B0"
                  loading={loading}
                />
              <KPICard
                icon="inr"
                label="Ad Revenue"
                value={fmt(adRevenue)}
                color="#2196F3"
                loading={loading}
              />
              <KPICard
                icon="times-circle"
                label="Expired Ads"
                value={expiredAds}
                color="#9E9E9E"
                loading={loading}
              />
            </div>
          </div>

          {/* Campaign Table */}
          <div className="body" style={{ paddingTop: 0 }}>
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap" style={{ gap: 8 }}>
              <h6 className="mb-0 font-weight-bold">Recent Ad Campaigns</h6>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search campaign or advertiser..."
                style={{ maxWidth: 240 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="text-center py-4">
                <i className="fa fa-spinner fa-spin fa-2x text-muted" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="fa fa-bullhorn fa-2x mb-2 d-block" />
                No campaigns found
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th>Campaign Type</th>
                      <th>Campaign Name</th>
                      <th>Advertiser</th>
                      <th>Placement</th>
                      <th>Daily Budget</th>
                      <th>Spent</th>
                      <th>Impressions</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => {
                      const statusMeta = STATUS_META[c.status] || { label: c.status, cls: "badge-secondary" };
                      return (
                        <tr key={c._id}>
                          <td>
                            <span className="badge badge-info" style={{ fontSize: 11 }}>
                              {c.campaignType}
                            </span>
                          </td>
                          <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {c.campaignName}
                          </td>
                          <td>
                            <span>{c.advertiser}</span>
                            <br />
                            <small className="text-muted">{c.advertiserType}</small>
                          </td>
                          <td>
                            <span className="badge badge-light" style={{ fontSize: 11 }}>
                              {c.placement}
                            </span>
                          </td>
                          <td>{fmt(c.budget)}</td>
                          <td>{fmt(c.totalSpent)}</td>
                          <td>
                            {c.impressions > 0
                              ? c.impressions >= 1000
                                ? `${(c.impressions / 1000).toFixed(1)}K`
                                : c.impressions
                              : "—"}
                          </td>
                          <td>
                            <span className={`badge ${statusMeta.cls}`} style={{ fontSize: 11 }}>
                              {statusMeta.label}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
