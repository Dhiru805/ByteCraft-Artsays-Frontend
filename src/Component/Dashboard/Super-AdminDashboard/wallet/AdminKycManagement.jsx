import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminKycManagement = () => {
  const [pendingKyc, setPendingKyc] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchPendingKyc = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/wallet/admin/kyc/pending`);
      setPendingKyc(res.data);
    } catch (err) {
      toast.error("Failed to fetch KYC requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingKyc();
  }, []);

  const handleVerify = async (userId) => {
    try {
      await axios.post(`${API_URL}/api/wallet/admin/kyc/${userId}/verify`);
      toast.success("KYC verified successfully");
      fetchPendingKyc();
      setSelectedKyc(null);
    } catch (err) {
      toast.error("Failed to verify KYC");
    }
  };

  const handleReject = async (userId) => {
    if (!rejectReason) {
      return toast.error("Please provide a rejection reason");
    }
    try {
      await axios.post(`${API_URL}/api/wallet/admin/kyc/${userId}/reject`, { reason: rejectReason });
      toast.success("KYC rejected");
      fetchPendingKyc();
      setSelectedKyc(null);
      setRejectReason("");
    } catch (err) {
      toast.error("Failed to reject KYC");
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header mb-4">
        <h2>KYC Management</h2>
      </div>

      <div className="row clearfix">
        <div className="col-12">
          <div className="card">
            <div className="header">
              <h2>Pending KYC Requests ({pendingKyc.length})</h2>
            </div>
            <div className="body table-responsive">
              {isLoading ? (
                <div className="text-center p-4">Loading...</div>
              ) : (
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>ID Type</th>
                      <th>ID Number</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingKyc.map((kyc, idx) => (
                      <tr key={kyc.walletId}>
                        <td>{idx + 1}</td>
                        <td>{kyc.name}</td>
                        <td>{kyc.email}</td>
                        <td>{kyc.kycDocuments?.idType?.toUpperCase()}</td>
                        <td>
                          <code>{kyc.kycDocuments?.idNumber}</code>
                        </td>
                        <td>{new Date(kyc.submittedAt).toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-success mr-1"
                            onClick={() => handleVerify(kyc.userId)}
                          >
                            <i className="fa fa-check"></i> Verify
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setSelectedKyc(kyc)}
                            data-toggle="modal"
                            data-target="#rejectModal"
                          >
                            <i className="fa fa-times"></i> Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                    {pendingKyc.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center">No pending KYC requests</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedKyc && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject KYC - {selectedKyc.name}</h5>
                <button type="button" className="close" onClick={() => setSelectedKyc(null)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Rejection Reason</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedKyc(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleReject(selectedKyc.userId)}>
                  Reject KYC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKycManagement;
