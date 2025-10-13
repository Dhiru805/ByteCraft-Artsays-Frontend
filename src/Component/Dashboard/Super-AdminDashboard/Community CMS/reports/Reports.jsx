import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import { toast } from "react-toastify";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suspensionDays, setSuspensionDays] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: "",
    userId: null,
    username: "",
  });
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      const response = await getAPI("/api/admin/reports", {}, true);
      if (response.data?.success) {
        setReports(response.data.reports || []);
      } else {
        toast.error(response.data?.message || "Failed to fetch reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const groupedReports = reports.reduce((groups, report) => {
    const userId = report.reportedUser?._id || "unknown";
    if (!groups[userId]) groups[userId] = [];
    groups[userId].push(report);
    return groups;
  }, {});

  const handleSuspendUser = async (userId, permanent = false) => {
    const days = suspensionDays[userId] || 3;
    try {
      const response = await postAPI(
        `/api/admin/suspend/${userId}`,
        permanent ? { permanent: true } : { days },
        true,
        true
      );

      if (response.data.success) {
        toast.success(response.data.message);
        if (!permanent) {
          setReports((prevReports) =>
            prevReports.filter((r) => r.reportedUser?._id !== userId)
          );
        } else {
          setReports((prevReports) =>
            prevReports.map((r) =>
              r.reportedUser?._id === userId
                ? {
                    ...r,
                    reportedUser: {
                      ...r.reportedUser,
                      isSuspended: true,
                      suspension: { permanent: true },
                    },
                  }
                : r
            )
          );
        }
      } else toast.error(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to suspend user");
    } finally {
      setConfirmModal({ show: false, type: "", userId: null, username: "" });
    }
  };

  const handleUnsuspendUser = async (userId) => {
    try {
      const response = await postAPI(`/api/admin/unsuspend/${userId}`, {}, true, true);
      if (response.data.success) {
        toast.success(response.data.message);
        setReports((prevReports) =>
          prevReports.filter((r) => r.reportedUser?._id !== userId)
        );
      } else toast.error(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to unsuspend user");
    } finally {
      setConfirmModal({ show: false, type: "", userId: null, username: "" });
    }
  };

  const ConfirmDialog = () => {
    if (!confirmModal.show) return null;

    const { type, username, userId } = confirmModal;

    const action =
      type === "permanent"
        ? () => handleSuspendUser(userId, true)
        : () => handleUnsuspendUser(userId);

    const title =
      type === "permanent"
        ? "Confirm Permanent Suspension"
        : "Confirm Unsuspension";

    const description =
      type === "permanent"
        ? `Are you sure you want to permanently suspend @${username}? This will restrict their account indefinitely.`
        : `Are you sure you want to unsuspend @${username}? This will re-enable their account and remove reports on them.`;

    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
        <div className="bg-white rounded-3 shadow-lg p-4" style={{ width: 400 }}>
          <h5 className="fw-bold mb-2">{title}</h5>
          <p className="text-muted small mb-4">{description}</p>
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() =>
                setConfirmModal({ show: false, type: "", userId: null, username: "" })
              }
            >
              Cancel
            </button>
            <button
              className={`btn btn-sm ${
                type === "permanent" ? "btn-danger" : "btn-success"
              }`}
              onClick={action}
            >
              {type === "permanent" ? "Suspend" : "Unsuspend"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h5>Loading reports...</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <ConfirmDialog />
      <div className="mb-4">
        <h2 className="fw-bold">User Reports Summary</h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {Object.keys(groupedReports).length === 0 ? (
            <p className="text-center text-muted">No reports found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Reports Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedReports).map(([userId, userReports], index) => {
                    const user = userReports[0].reportedUser;
                    const isPermanentSuspended =
                      user?.isSuspended && user?.suspension?.permanent;

                    return (
                      <tr key={userId}>
                        <td>{index + 1}</td>
                        <td>
                          <div>
                            <p className="fw-semibold mb-0">{user?.username}</p>
                            <small className="text-muted">ID: {user?._id}</small>
                          </div>
                        </td>
                        <td>
                          <span className="fw-semibold">{userReports.length}</span>
                        </td>
                        <td>
                          {isPermanentSuspended ? (
                            <>
                              <span className="badge bg-dark me-2">
                                Permanently Suspended
                              </span>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  setConfirmModal({
                                    show: true,
                                    type: "unsuspend",
                                    userId: user._id,
                                    username: user.username,
                                  })
                                }
                              >
                                Unsuspend
                              </button>
                            </>
                          ) : (
                            <>
                              <input
                                type="number"
                                min="1"
                                placeholder="Days"
                                value={suspensionDays[userId] || ""}
                                onChange={(e) =>
                                  setSuspensionDays((prev) => ({
                                    ...prev,
                                    [userId]: e.target.value,
                                  }))
                                }
                                className="form-control d-inline-block w-auto me-2"
                                style={{ width: "70px" }}
                              />
                              <button
                                className="btn btn-danger btn-sm me-2"
                                onClick={() => handleSuspendUser(userId, false)}
                              >
                                Suspend
                              </button>
                              <button
                                className="btn btn-dark btn-sm me-2"
                                onClick={() =>
                                  setConfirmModal({
                                    show: true,
                                    type: "permanent",
                                    userId: user._id,
                                    username: user.username,
                                  })
                                }
                              >
                                Permanent Suspend
                              </button>
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>
                                  navigate(
                                    "/super-admin/community-cms/reports/view",
                                    { state: { userReports } }
                                  )
                                }
                              >
                                 <i className="fa fa-eye"></i>
                              </button>
                            </>
                          )}
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
  );
}

export default Reports;
