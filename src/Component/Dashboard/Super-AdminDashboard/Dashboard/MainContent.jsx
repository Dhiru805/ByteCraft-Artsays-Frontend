import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../api/getAPI";

import SystemStats           from "./SystemStats";
import GrowthSnapshot        from "./GrowthSnapshot";
import AdminTasks            from "./AdminTasks";
import RiskAlerts            from "./RiskAlerts";
import FailedPayments        from "./FailedPayments";
import PendingApprovalsTable from "./PendingApprovalsTable";
import RecentOrders          from "./RecentOrders";
import WalletSummary         from "./WalletSummary";
import BiddingOverview       from "./BiddingOverview";
import CommunityAlerts       from "./CommunityAlerts";
import ContentOverview       from "./ContentOverview";
import SystemActivityLog     from "./SystemActivityLog";
import WebTraffic            from "./WebTraffic";
import AdsOverview           from "./AdsOverview";
import SponsoredContent      from "./SponsoredContent";

const REFRESH_INTERVAL = 60 * 1000;

export default function MainContent() {
  const navigate = useNavigate();
  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [pageViews,     setPageViews]     = useState({});
  const [totalViews,    setTotalViews]    = useState(0);
  const [pvLoading,     setPvLoading]     = useState(true);
  const [pvFilter,      setPvFilter]      = useState("all");

  const fetchStats = useCallback(async () => {
    try {
      const res = await getAPI("/api/superadmin/stats");
      if (res?.data?.success) { setData(res.data); setLastUpdated(new Date()); }
    } catch (err) { console.error("Dashboard stats error:", err); }
    finally { setLoading(false); }
  }, []);

  const fetchPageViews = useCallback(async ({ filter = "all", from, to } = {}) => {
    setPvLoading(true);
    try {
      let url = `/api/superadmin/pageviews?filter=${filter}`;
      if (filter === "custom" && from && to) url += `&from=${from}&to=${to}`;
      const res = await getAPI(url);
      if (res?.data?.success) {
        setPageViews(res.data.pageViews || {});
        setTotalViews(res.data.totalViews || 0);
      }
    } catch (err) { console.error("Page views error:", err); }
    finally { setPvLoading(false); }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    fetchStats();
    fetchPageViews();
    const interval = setInterval(() => { fetchStats(); fetchPageViews(); }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStats, fetchPageViews]);

  const stats            = data?.stats             || {};
  const growth           = data?.growth            || {};
  const pendingApprovals = data?.pendingApprovals   || [];
  const recentOrders     = data?.recentOrders       || [];
  const walletSummary    = data?.walletSummary      || {};
  const failedTx         = data?.failedTransactions || [];
  const liveBiddings     = data?.liveBiddings       || [];
  const communityReports = data?.communityReports   || [];
  const contentSnapshot  = data?.contentSnapshot    || {};
  const activityLog      = data?.activityLog        || [];
  const riskAlerts       = data?.riskAlerts         || [];
  const adsOverview      = data?.adsOverview        || {};
  const sponsoredContent = data?.sponsoredContent   || {};

  return (
    <div className="container-fluid">

      {/* ── Block Header ── */}
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Super Admin Dashboard</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate("/super-admin/dashboard")} style={{ cursor: "pointer" }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Dashboard</li>
              <li className="breadcrumb-item active">Overview</li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-none d-md-flex flex-row-reverse align-items-center">
              {lastUpdated && (
                <small className="text-muted ml-3">
                  <i className="fa fa-clock-o mr-1"></i>
                  {lastUpdated.toLocaleTimeString()}
                </small>
              )}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setLoading(true); fetchStats(); fetchPageViews(); }}
                disabled={loading}
              >
                <i className={`fa fa-refresh mr-1${loading ? " fa-spin" : ""}`}></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 1 – PLATFORM STAT CARDS
      ══════════════════════════════════════════════════════════ */}
      <SystemStats stats={stats} loading={loading} />

      {/* ══════════════════════════════════════════════════════════
          ZONE 2 – QUICK LINKS
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="header">
              <h2>Quick Actions <small>Jump straight to what matters</small></h2>
            </div>
            <div className="body" style={{ paddingTop: 0 }}>
              <div className="d-flex flex-wrap" style={{ gap: "10px" }}>
                {[
                  { icon: "fa-user-plus",   label: "Artist Requests",  route: "/super-admin/artist-management",                cls: "btn-primary"   },
                  { icon: "fa-image",       label: "Product Approvals", route: "/super-admin/artist-management/product-request", cls: "btn-warning"   },
                  { icon: "fa-gavel",       label: "Live Biddings",     route: "/super-admin/bidding/allproduct",                cls: "btn-danger"    },
                  { icon: "fa-shopping-bag",label: "All Orders",        route: "/super-admin/product-management/purchasetable",  cls: "btn-secondary" },
                  { icon: "fa-inr",         label: "Wallet",            route: "/super-admin/wallet",                           cls: "btn-info"      },
                  { icon: "fa-flag",        label: "Reports",           route: "/super-admin/community-management",             cls: "btn-default"   },
                ].map(({ icon, label, route, cls }) => (
                  <button
                    key={label}
                    className={`btn ${cls} flex-fill d-flex align-items-center justify-content-center`}
                    onClick={() => navigate(route)}
                  >
                    <i className={`fa ${icon} mr-2`}></i>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 3 – GROWTH THIS WEEK
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="header">
              <h2>Growth This Week <small>Platform activity in the last 7 days</small></h2>
            </div>
            <div className="body" style={{ paddingBottom: 0, paddingTop: 0 }}>
              <GrowthSnapshot growth={growth} loading={loading} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 4 – RECENT ORDERS + WALLET
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix row-deck">
        <div className="col-lg-7 col-md-12">
          <RecentOrders orders={recentOrders} loading={loading} />
        </div>
        <div className="col-lg-5 col-md-12">
          <WalletSummary walletSummary={walletSummary} loading={loading} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 5 – ACTION REQUIRED + RISK ALERTS
      ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix row-deck">
        <div className="col-lg-6 col-md-12">
          <AdminTasks stats={stats} pendingApprovals={pendingApprovals} communityReports={communityReports} />
        </div>
        <div className="col-lg-6 col-md-12">
          <RiskAlerts riskAlerts={riskAlerts} stats={stats} pendingApprovals={pendingApprovals} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 6 – FAILED PAYMENTS (only if any)
      ══════════════════════════════════════════════════════════ */}
      <FailedPayments failedTransactions={failedTx} loading={loading} />

      {/* ══════════════════════════════════════════════════════════
          ZONE 7 – PENDING APPROVALS TABLE
      ══════════════════════════════════════════════════════════ */}
      <PendingApprovalsTable data={pendingApprovals} loading={loading} />

      {/* ══════════════════════════════════════════════════════════
          ZONE 8 – LIVE BIDDINGS
      ══════════════════════════════════════════════════════════ */}
      <BiddingOverview biddings={liveBiddings} loading={loading} />

      {/* ══════════════════════════════════════════════════════════
          ZONE 9 – COMMUNITY REPORTS
      ══════════════════════════════════════════════════════════ */}
      <CommunityAlerts reports={communityReports} loading={loading} />

        {/* ══════════════════════════════════════════════════════════
            ZONE 10 – CONTENT SNAPSHOT
        ══════════════════════════════════════════════════════════ */}
        <ContentOverview contentSnapshot={contentSnapshot} loading={loading} />

        {/* ══════════════════════════════════════════════════════════
            ZONE 11 – ADS & PROMOTIONS OVERVIEW
        ══════════════════════════════════════════════════════════ */}
        <AdsOverview adsOverview={adsOverview} loading={loading} />

        {/* ══════════════════════════════════════════════════════════
            ZONE 12 – SPONSORED CONTENT & BOOSTED POSTS
        ══════════════════════════════════════════════════════════ */}
        <SponsoredContent sponsoredContent={sponsoredContent} loading={loading} />

        {/* ══════════════════════════════════════════════════════════
            ZONE 13 – ACTIVITY LOG + PAGE TRAFFIC
        ══════════════════════════════════════════════════════════ */}
      <div className="row clearfix row-deck">
        <div className="col-lg-7 col-md-12">
          <SystemActivityLog activityLog={activityLog} loading={loading} />
        </div>
        <div className="col-lg-5 col-md-12">
          <WebTraffic
            pageViews={pageViews}
            totalViews={totalViews}
            loading={pvLoading}
            onFilterChange={(params) => { setPvFilter(params.filter); fetchPageViews(params); }}
          />
        </div>
      </div>

    </div>
  );
}
