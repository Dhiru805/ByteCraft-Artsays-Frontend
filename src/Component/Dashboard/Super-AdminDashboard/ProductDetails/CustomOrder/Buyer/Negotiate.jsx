import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import putAPI from "../../../../../../api/putAPI";

const NegotiateModal = ({ request, onClose, onSubmit }) => {
  const [buyerName] = useState(
    request ? `${request.Buyer.id.name} ${request.Buyer.id.lastName}` : ""
  );
  const [requestDate] = useState(
    new Date(request?.createdAt).toLocaleDateString() || ""
  );
  const [maxBudget, setMaxBudget] = useState(request?.MaxBudget || "");
  const [minBudget, setMinBudget] = useState(request?.MinBudget || "");
  const [notes, setNotes] = useState(request?.BuyerNotes || "");
  const [negotiateBudget, setNegotiateBudget] = useState(request?.NegotiatedBudget || "");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await putAPI(
        `${process.env.REACT_APP_API_URL}/api/update-negiotaite-Buyer-budget/${request._id}`,
        {
          ProductName: request?.ProductName || "",
          Description: request?.Description || "",
          MaxBudget: maxBudget,
          MinBudget: minBudget,
          NegiotaiteBudget: negotiateBudget,
          BuyerNotes: notes,
        }
      );

      if (response && response.data) {
        toast.success(response.data.successMessage || "Buyer request updated successfully");
        onSubmit(response.data.updatedRequest);
      } else {
        toast.error(response?.message || "Failed to update buyer request");
      }
    } catch (error) {
      console.error("Error updating buyer request:", error);
      toast.error(error.response?.data?.message || "Error updating buyer request");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status, comment = "") => {
    setLoading(true);
    try {
      const response = await putAPI(
        `${process.env.REACT_APP_API_URL}/api/update-negiotaite-Buyer-budget/${request._id}`,
        {
          rejectedcomment: comment,
          BuyerStatus: status
        }
      );

      if (response && response.data) {
        toast.success(`Buyer request ${status.toLowerCase()} successfully`);
        onSubmit(response.data.updatedRequest);
        onClose();
      } else {
        toast.error(response?.message || `Failed to update buyer request status`);
      }
    } catch (error) {
      console.error("Error updating buyer request status:", error);
      toast.error(error.response?.data?.message || "Error updating buyer request status");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all duration-200";
  const readOnlyStyle = "w-full px-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-500 cursor-not-allowed font-medium";
  const labelStyle = "block text-sm font-semibold text-zinc-700 mb-1.5 ml-1";

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 1050,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{
            maxWidth: "600px",
            width: "90%",
            margin: "0",
          }}
        >
          <div
            className="modal-content border-0 shadow-2xl"
            style={{
              maxHeight: "90vh",
              borderRadius: "24px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
              <h5 className="text-xl font-bold text-zinc-900 tracking-tight">Negotiate Request</h5>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-all duration-200 text-2xl leading-none"
                onClick={onClose}
                disabled={loading}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden bg-white">
              <div
                className="modal-body px-8 py-6 overflow-y-auto custom-scrollbar"
                style={{
                  maxHeight: "calc(90vh - 160px)",
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className={labelStyle}>Buyer Name</label>
                    <input type="text" className={readOnlyStyle} value={buyerName} readOnly />
                  </div>

                  <div className="space-y-1">
                    <label className={labelStyle}>Request Date</label>
                    <input type="text" className={readOnlyStyle} value={requestDate} readOnly />
                  </div>

                  <div className="space-y-1">
                    <label className={labelStyle}>Min Budget</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">$</span>
                      <input 
                        type="number" 
                        className={`${inputStyle} pl-8 bg-white`} 
                        value={minBudget} 
                        onChange={(e) => setMinBudget(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelStyle}>Max Budget</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">$</span>
                      <input 
                        type="number" 
                        className={`${inputStyle} pl-8 bg-white`} 
                        value={maxBudget} 
                        onChange={(e) => setMaxBudget(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-1">
                  <label className={labelStyle}>Negotiated Budget (Read-only)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">$</span>
                    <input type="number" className={`${readOnlyStyle} pl-8`} value={negotiateBudget} readOnly />
                  </div>
                </div>

                <div className="mt-6 space-y-1">
                  <label className={labelStyle}>Message / Notes</label>
                  <textarea
                    className={`${inputStyle} min-h-[120px] resize-none bg-white`}
                    placeholder="Buyer's negotiation notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-100 bg-zinc-50 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-xl text-zinc-600 font-bold hover:bg-zinc-200 transition-all duration-200"
                  onClick={onClose}
                  disabled={loading}
                >
                  Close
                </button>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-bold hover:bg-white transition-all duration-200"
                    disabled={loading}
                  >
                    Save Changes
                  </button>

                  {request?.BuyerStatus !== "Approved" && (
                    <button
                      type="button"
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-100"
                      onClick={() => handleStatusUpdate("Approved")}
                      disabled={loading}
                    >
                      Approve
                    </button>
                  )}

                  {request?.BuyerStatus !== "Rejected" && (
                    <button
                      type="button"
                      className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all duration-200 shadow-lg shadow-rose-100"
                      onClick={() => setShowRejectModal(true)}
                      disabled={loading}
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {showRejectModal && (
          <div
            className="modal fade show"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 1100,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "450px", width: "90%" }}>
              <div className="modal-content border-0 shadow-2xl rounded-[24px] overflow-hidden bg-white">
                <div className="px-8 py-6 border-b border-gray-100">
                  <h5 className="text-xl font-bold text-zinc-900">Reject Request</h5>
                </div>
                <div className="px-8 py-6 space-y-4">
                  <div className="space-y-1">
                    <label className={labelStyle}>Rejection Comment <span className="text-rose-500">*</span></label>
                    <textarea
                      className={`${inputStyle} min-h-[100px] resize-none`}
                      placeholder="Please provide a reason for rejection..."
                      value={rejectComment}
                      onChange={(e) => setRejectComment(e.target.value)}
                    />
                  </div>
                </div>
                <div className="px-8 py-6 border-t border-gray-100 bg-zinc-50 flex items-center justify-end gap-3">
                  <button
                    className="px-6 py-2.5 rounded-xl text-zinc-600 font-bold hover:bg-zinc-200 transition-all duration-200"
                    onClick={() => setShowRejectModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-8 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-all duration-200 shadow-lg shadow-rose-100"
                    onClick={() => {
                      if (!rejectComment.trim()) {
                        toast.error("Please enter a rejection comment.");
                        return;
                      }
                      handleStatusUpdate("Rejected", rejectComment);
                    }}
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4d4d8;
        }
      `}</style>
    </>
  );
};

export default NegotiateModal;