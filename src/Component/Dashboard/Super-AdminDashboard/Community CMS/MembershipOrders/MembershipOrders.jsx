import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import { toast } from "react-toastify";
import ProductRequestSkeleton from "../../../../Skeleton/artist/ProductRequestSkeleton";

const MembershipOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAPI("/api/admin/membership-orders", {}, true);
        if (res.data.success) {
          setOrders(res.data.orders || []);
        } else {
          toast.error(res.data.message || "Failed to fetch membership orders");
        }
      } catch (error) {
        console.error("Error fetching membership orders:", error);
        toast.error("Error loading membership orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.userId?.firstName || order.userId?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.userId?.email || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.creatorId?.firstName || order.creatorId?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.easebuzzTxnId || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const effectiveStatus =
      order.status === "Paid" && order.expiresAt && new Date(order.expiresAt) < new Date()
        ? "Expired"
        : order.status;

    const matchesStatus =
      statusFilter === "All" || effectiveStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (order) => {
    let status = order.status;
    if (status === "Paid" && order.expiresAt && new Date(order.expiresAt) < new Date()) {
      status = "Expired";
    }
    const colors = {
      Paid: "badge-success",
      Pending: "badge-warning text-dark",
      Failed: "badge-danger",
      Expired: "badge-secondary",
    };
    return <span className={`badge ${colors[status] || "badge-info"}`}>{status}</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getRemainingDays = (expiresAt) => {
    if (!expiresAt) return null;
    const now = new Date();
    const exp = new Date(expiresAt);
    const diff = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return <span className="text-danger fw-bold">Expired</span>;
    return <span className="text-success">{diff} days left</span>;
  };

  if (loading) {
    return <ProductRequestSkeleton />;
  }

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Membership Orders</h2>
        <span className="badge fs-6">{filteredOrders.length} Orders</span>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Search by buyer name, email, creator name, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          {filteredOrders.length === 0 ? (
            <p className="text-center text-muted">No membership orders found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Buyer</th>
                    <th scope="col">Creator</th>
                    <th scope="col">Membership</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Purchased</th>
                    <th scope="col">Expires</th>
                    <th scope="col">Txn ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div>
                          <p className="mb-0 fw-semibold">
                            {order.userId?.firstName || order.userId?.name || "N/A"}
                          </p>
                          <small className="text-muted">{order.userId?.email || ""}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="mb-0 fw-semibold">
                            {order.creatorId?.firstName || order.creatorId?.name || "N/A"}
                          </p>
                          <small className="text-muted">{order.creatorId?.email || ""}</small>
                        </div>
                      </td>
                      <td>
                        <span className="fw-semibold">
                          {order.membershipId?.title || "Deleted"}
                        </span>
                        {order.membershipId?.unit && (
                          <small className="d-block text-muted">
                            {order.membershipId.unit}
                          </small>
                        )}
                      </td>
                      <td className="fw-bold">
                        {"\u20B9"}{order.amount}
                      </td>
                      <td>{getStatusBadge(order)}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <div>
                          {formatDate(order.expiresAt)}
                          {order.status === "Paid" && order.expiresAt && (
                            <small className="d-block">
                              {getRemainingDays(order.expiresAt)}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          {order.easebuzzTxnId || "-"}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipOrders;
