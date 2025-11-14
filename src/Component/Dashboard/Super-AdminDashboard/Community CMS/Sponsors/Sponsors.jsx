import React, { useEffect, useState } from "react";
import getAPI from "../../../../../api/getAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await getAPI("/api/admin/sponsored-posts", {}, true);
        if (response.data?.success) {
          setSponsors(response.data.sponsoredPosts || []);
        } else {
          toast.error(response.data?.message || "Failed to load sponsored posts");
        }
      } catch (error) {
        console.error("Error fetching sponsors:", error);
        toast.error("Server error while fetching sponsored posts");
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h5>Loading sponsored posts...</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Sponsored Posts</h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {sponsors.length === 0 ? (
            <p className="text-center text-muted">No sponsored posts found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Promoted By</th>
                    <th>Post Caption</th>
                    <th>Category</th>
                    <th>Budget</th>
                    <th>Duration</th>
                    <th>Reach</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((s, index) => (
                    <tr key={s.postId}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={`${process.env.REACT_APP_API_URL_FOR_IMAGE}${s.promotedBy?.profilePhoto || "/default-avatar.png"}`}
                            alt="Profile"
                            className="rounded-circle me-2"
                            width="40"
                            height="40"
                            style={{ objectFit: "cover" }}
                          />
                          <div>
                            <p className="mb-0 fw-semibold">{s.promotedBy?.username}</p>
                            <small className="text-muted">{s.promotedBy?.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{s.caption || "-"}</td>
                      <td>{s.promotionDetails?.categoryName || "N/A"}</td>
                      <td>₹{s.promotionDetails?.totalBudget || 0}</td>
                      <td>{s.promotionDetails?.durationDays} days</td>
                      <td>{s.promotionDetails?.estimatedReach}</td>
                      <td>
                        <span
                          className={`badge ${
                            s.promotionDetails.status === "active"
                              ? "bg-success"
                              : s.promotionDetails.status === "pending"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {s.promotionDetails.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            navigate("/super-admin/community-cms/sponsors/view", {
                              state: { sponsor: s },
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

export default Sponsors;
