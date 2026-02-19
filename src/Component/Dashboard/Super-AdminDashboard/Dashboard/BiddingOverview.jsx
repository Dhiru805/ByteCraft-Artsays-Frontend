import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BiddingOverview({ biddings = [], loading }) {
  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const countdown = (endDate) => {
    const diff = new Date(endDate) - now;
    if (diff <= 0) return "Ended";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="row clearfix">
      <div className="col-lg-12">
        <div className="card">
          <div className="header d-flex justify-content-between">
            <h2>
              Live Biddings
              {biddings.length > 0 && (
                <small className="ml-2 badge badge-danger">{biddings.length} live</small>
              )}
            </h2>
            <div className="d-none d-md-block text-right">
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/super-admin/bidding/allproduct")}>
                View All Biddings
              </button>
            </div>
          </div>
          <div className="body">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Artist</th>
                    <th>Start Price</th>
                    <th>Current Bid</th>
                    <th>Bids</th>
                    <th>Time Left</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-3 text-muted">Loading...</td></tr>
                  ) : biddings.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-4 text-muted">No active biddings</td></tr>
                  ) : (
                      biddings.map((b, i) => {
                        const productName = b.product?.productName || b.productName || "—";
                        const artistName = b.user ? `${b.user.name || ""} ${b.user.lastName || ""}`.trim() : (b.artistName || "—");
                        const startPrice = b.startingBid || b.startingPrice || 0;
                        const currentBid = b.currentBid || startPrice;
                        const endDate = b.bidEnd || b.endDate;
                        return (
                          <tr key={b._id || i}>
                            <td>{i + 1}</td>
                            <td className="font-weight-bold">{productName}</td>
                            <td>{artistName}</td>
                            <td>₹{startPrice.toLocaleString("en-IN")}</td>
                            <td className="text-success font-weight-bold">
                              ₹{currentBid.toLocaleString("en-IN")}
                            </td>
                            <td>{b.totalBids || 0}</td>
                            <td><span className="badge badge-danger">{countdown(endDate)}</span></td>
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
