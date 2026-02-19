import React from "react";
import { useNavigate } from "react-router-dom";

export default function FailedPayments({ failedTransactions = [], loading }) {
  const navigate = useNavigate();
  if (!loading && failedTransactions.length === 0) return null;

  return (
    <div className="row clearfix">
      <div className="col-lg-12">
        <div className="card">
          <div className="header d-flex justify-content-between">
            <h2>
              <i className="fa fa-exclamation-circle text-danger mr-2"></i>
              Failed Payments
            </h2>
            <div className="d-none d-md-block align-content-center text-right">
              <button className="btn btn-secondary btn-sm" onClick={() => navigate("/super-admin/wallet")}>
                View Wallet <i className="fa fa-arrow-right ml-1"></i>
              </button>
            </div>
          </div>
          <div className="body" style={{ paddingTop: 0 }}>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Purpose</th>
                    <th>Source</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-3 text-muted">Loading...</td></tr>
                  ) : (
                      failedTransactions.map((t, i) => {
                        const userName = t.userId ? `${t.userId.name || ""} ${t.userId.lastName || ""}`.trim() : (t.userName || "—");
                        const userType = t.userId?.userType || t.userType || "—";
                        return (
                          <tr key={t._id || i}>
                            <td><h6 className="mb-0">{i + 1}</h6></td>
                            <td className="font-weight-bold">{userName}</td>
                            <td>
                              <span className={`badge badge-${userType === "Buyer" ? "info" : "primary"}`}>
                                {userType}
                              </span>
                            </td>
                            <td className="text-danger font-weight-bold">₹{(t.amount || 0).toLocaleString("en-IN")}</td>
                            <td>{t.purpose || t.description || "—"}</td>
                            <td><span className="badge badge-secondary">{t.source || "—"}</span></td>
                            <td>
                              <button className="btn btn-default btn-sm" onClick={() => navigate("/super-admin/wallet")}>
                                <i className="fa fa-eye"></i>
                              </button>
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
    </div>
  );
}
