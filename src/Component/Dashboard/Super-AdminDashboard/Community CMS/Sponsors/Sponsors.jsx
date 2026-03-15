import React, { useEffect, useState } from "react";
import { getImageUrl } from '../../../../../utils/getImageUrl';
import getAPI from "../../../../../api/getAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProductRequestSkeleton from "../../../../Skeleton/artist/ProductRequestSkeleton";
import { DEFAULT_PROFILE_IMAGE } from "../../../../../Constants/ConstantsVariables";

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch("/api/export-sponsors", { method: "GET" });
      if (!response.ok) throw new Error("Failed to export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Sponsored_Posts_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Sponsored posts exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export sponsored posts");
    } finally {
      setExporting(false);
    }
  };

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
      <ProductRequestSkeleton/>
    );
  }

  return (
    <div className="container-fluid mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Sponsored Posts</h2>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={handleExport}
            disabled={exporting}
          >
            <i className="fa fa-file-excel-o me-1"></i>
            {exporting ? "Exporting..." : "Export"}
          </button>
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
                              src={s.promotedBy?.profilePhoto ? getImageUrl(s.promotedBy.profilePhoto) : DEFAULT_PROFILE_IMAGE}
                              alt="Profile"
                              className="rounded-circle me-2"
                              width="40"
                              height="40"
                              style={{ objectFit: "cover" }}
                              onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_PROFILE_IMAGE; }}
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
