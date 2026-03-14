import React from "react";
import { useNavigate } from "react-router-dom";

export default function RecentOrders({ orders = [], loading }) {
  const navigate = useNavigate();
  return (
    <div className="card">
      <div className="header d-flex justify-content-between">
        <h2>Recent Orders <small>Latest platform orders</small></h2>
        <div className="d-none d-md-block align-content-center">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/super-admin/product-management/purchasetable")}
          >
            View All Orders
          </button>
        </div>
      </div>
      <div className="body" style={{ paddingTop: 0 }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Buyer</th>
                  <th>Product</th>
                  <th>Artist</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
            <tbody>
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i}>
                    {[1,2,3,4,5,6].map(j => (
                      <td key={j}><span style={{ display:"inline-block", width:"80%", height:14, background:"#e9ecef", borderRadius:3 }}></span></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted" style={{ padding: "24px 0" }}>
                    No recent orders
                  </td>
                </tr>
              ) : (
                      orders.map((o, i) => {
                        const buyerName = o.Buyer?.name || (o.transactionId ? `TXN: ${o.transactionId.slice(-6)}` : "Guest");
                        const productName = o.items?.[0]?.name || "—";
                        const artistName = o.Artist?.name || "—";
                        const amount = o.finalPrice || o.totalAmount || 0;
                    return (
                      <tr key={o._id || i}>
                        <td>{i + 1}</td>
                        <td>{buyerName}</td>
                        <td style={{ maxWidth: 140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:600 }}>
                          {productName}
                        </td>
                        <td style={{ maxWidth: 120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {artistName}
                        </td>
                        <td className="text-success font-weight-bold">
                          ₹{amount.toLocaleString("en-IN")}
                        </td>
                        <td><small>{o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "—"}</small></td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
