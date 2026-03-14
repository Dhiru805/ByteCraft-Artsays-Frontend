import React from "react";
import { useNavigate } from "react-router-dom";

function fmt(n) {
  const v = Math.abs(n || 0);
  // Cap display at 999Cr for sanity (corrupted test data guard)
  const MAX = 99900000000; // 999Cr
  const display = Math.min(v, MAX);
  if (display >= 10000000) return `₹${(display / 10000000).toFixed(1)}Cr`;
  if (display >= 100000)   return `₹${(display / 100000).toFixed(1)}L`;
  if (display >= 1000)     return `₹${(display / 1000).toFixed(1)}K`;
  return `₹${Math.round(display).toLocaleString("en-IN")}`;
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function WalletSummary({ walletSummary = {}, loading }) {
  const navigate = useNavigate();
  const transactions = walletSummary.recentTransactions || [];

  return (
    <div className="card">
      <div className="header">
        <h2>Wallet &amp; Payments <small>Platform earnings overview</small></h2>
      </div>
      <div className="body" style={{ paddingTop: 0 }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <p className="mb-0 text-muted font-12 text-uppercase">Total Balance</p>
              <h3 className="mb-0 mt-1" style={{ color: "#f59e0b", fontWeight: 800 }}>
                {loading ? "—" : fmt(walletSummary.totalBalance)}
              </h3>
              {(walletSummary.pendingSettlements || 0) > 0 && (
                <small className="text-muted">{fmt(walletSummary.pendingSettlements)} pending settlement</small>
              )}
            </div>
            <div className="text-right">
              <p className="mb-0 font-12 text-muted">Total Debited</p>
              <h5 className="mb-0 text-success">{loading ? "—" : fmt(walletSummary.totalDebited)}</h5>
            </div>
          </div>

          {/* Summary rows */}
          <div className="d-block d-md-flex row clearfix mb-3" style={{ placeItems: "center" }}>
            {[
              { label: "Total Balance",       value: walletSummary.totalBalance,          badge: "badge-success" },
              { label: "Total Debited",        value: walletSummary.totalDebited,          badge: "badge-primary" },
              { label: "Pending Withdrawal",  value: walletSummary.totalPendingWithdrawal, badge: "badge-warning" },
            ].map(({ label, value, badge }) => (
              <div key={label} className="col-12 col-md-4 text-center mb-2" style={{ placeItems: "center" }}>
                <h5 className="d-flex mb-0 font-weight-bold">{loading ? "—" : fmt(value)}</h5>
                <span className={`badge mt-2 ${badge}`} style={{ fontSize: 10 }}>{label}</span>
              </div>
            ))}
          </div>

        <p className="font-12 text-uppercase text-muted mb-1"><strong>Recent Transactions</strong></p>
        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-muted font-12">No recent transactions</p>
        ) : (
            transactions.slice(0, 5).map((t, i) => {
              const name = t.userId ? `${t.userId.name || ""} ${t.userId.lastName || ""}`.trim() : (t.userName || "Transaction");
              return (
              <div
                key={t._id || i}
                className="d-flex justify-content-between align-items-center"
                style={{ padding: "6px 0", borderBottom: i < 3 ? "1px solid #f1f5f9" : "none", fontSize: 13 }}
              >
                <div>
                  <span style={{ fontWeight: 500 }}>{(name || "Transaction").substring(0, 22)}</span>
                  <span className="text-muted font-12"> · {timeAgo(t.createdAt)}</span>
                </div>
                <span style={{ fontWeight: 700, color: t.type === "credit" ? "#10b981" : "#ef4444" }}>
                  {t.type === "credit" ? "+" : "-"}{fmt(t.amount)}
                </span>
              </div>
              );
            })
        )}

        <div className="d-flex flex-column mt-3" style={{ gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm justify-content-center"
            onClick={() => navigate("/super-admin/wallet")}
          >
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
}
