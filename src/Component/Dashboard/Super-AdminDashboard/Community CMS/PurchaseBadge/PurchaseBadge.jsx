import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import { toast } from "react-toastify";

const PurchaseBadge = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBadgeUsers = async () => {
      try {
        const res = await getAPI("/api/admin/badges", {}, true);
        if (res.data.success) {
          setUsers(res.data.users || []);
        } else {
          toast.error(res.data.message || "Failed to fetch badge users");
        }
      } catch (error) {
        console.error("Error fetching badge users:", error);
        toast.error("Error loading badge users");
      } finally {
        setLoading(false);
      }
    };
    fetchBadgeUsers();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h5>Loading badge users...</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Users Who Purchased Badges</h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {users.length === 0 ? (
            <p className="text-center text-muted">No users found with badges.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">User</th>
                    <th scope="col">Badges Purchased</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${user.profilePhoto || "/default-avatar.png"}`}
                            alt="Profile"
                            className="rounded-circle me-3"
                            width="45"
                            height="45"
                            style={{ objectFit: "cover" }}
                          />
                          <div>
                            <p className="mb-0 fw-semibold">{user.username}</p>
                            <small className="text-muted">{user.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {user.verified?.length || 0}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            navigate("/super-admin/community-cms/purchase-badge/show", {
                              state: { user },
                            })
                          }
                        >
                          <i className="fa fa-eye"></i>
                        </button>
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

export default PurchaseBadge;
