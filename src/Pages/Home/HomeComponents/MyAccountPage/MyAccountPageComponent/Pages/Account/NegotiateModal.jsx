import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import putAPI from "../../../../../../../api/putAPI";

const NegotiateModal = ({ request, onClose, onSubmit }) => {
  const isBuyer = true;

  const [buyerName] = useState(
    request ? `${request.Buyer.id.name} ${request.Buyer.id.lastName}` : ""
  );
  const [requestDate] = useState(
    new Date(request?.createdAt).toLocaleDateString() || ""
  );
  const [maxBudget, setMaxBudget] = useState(request?.MaxBudget || "");
  const [minBudget, setMinBudget] = useState(request?.MinBudget || "");
  const [notes, setNotes] = useState(request?.BuyerNotes || "");
  const [negotiatedBudgets, setNegotiatedBudgets] = useState(
    request?.NegotiatedBudget || []
  );
  const [newBudget, setNewBudget] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericBudget = parseFloat(newBudget);

    if (numericBudget < minBudget || numericBudget > maxBudget) {
      toast.error("Negotiated Budget must be within the allowed range.");
      return;
    }

    const updatedBudgets = [
      ...negotiatedBudgets,
      { amount: numericBudget, updatedBy: isBuyer ? "buyer" : "artist" },
    ];

    try {
      const response = await putAPI(
        `/api/update-negiotaite-Buyer-budget/${request._id}`,
        {
          ProductName: request?.ProductName || "",
          Description: request?.Description || "",
          MaxBudget: maxBudget,
          MinBudget: minBudget,
          NegotiatedBudget: updatedBudgets,
          BuyerNotes: notes,
        }
      );

      if (response && response.data) {
        toast.success(
          response.data.successMessage || "Buyer request updated successfully"
        );
        onSubmit(response.data.updatedRequest);
      } else {
        toast.error(response?.message || "Failed to update buyer request");
      }
    } catch (error) {
      console.error("Error updating buyer request:", error);
      toast.error(
        error.response?.data?.message || "Error updating buyer request"
      );
    }
  };

  const handleStatusUpdate = async (status, comment = "") => {
    try {
      const response = await putAPI(
        `/api/update-negiotaite-Buyer-budget/${request._id}`,
        {
          rejectedcomment: comment,
          BuyerStatus: status,
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
      toast.error(
        error.response?.data?.message || "Error updating buyer request status"
      );
    }
  };

  return (
    <div
      className="modal"
      style={{
        display: "block",
        paddingLeft: "0px",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1040,
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Negotiate Request</h5>
            <button
              className="btn"
              onClick={onClose}
              style={{ border: "none", background: "transparent", fontSize: "1.0rem" }}
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Buyer Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={buyerName}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Request Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={requestDate}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Max Budget</label>
                <input
                  type="number"
                  className="form-control"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Min Budget</label>
                <input
                  type="number"
                  className="form-control"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  readOnly
                />
              </div>

              {negotiatedBudgets.map((budget, index) => (
                <div className="mb-3" key={index}>
                  <label className="form-label">
                    Negotiated Budget {index + 1} ({budget.updatedBy})
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={budget.amount}
                    readOnly
                  />
                </div>
              ))}

              {negotiatedBudgets.length < 2 && (
                <div className="mb-3">
                  <label className="form-label">
                    Negotiated Budget {negotiatedBudgets.length + 1}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="Enter Negotiated Budget"
                    required
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              {negotiatedBudgets.length < 2 && (
                <button
                  type="submit"
                  className="text-[16px] py-1 px-3 text-zinc-900 border-[1.6px] rounded-lg border-zinc-600"
                >
                  Save changes
                </button>
              )}
              {request?.BuyerStatus !== "Approved" && (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleStatusUpdate("Approved")}
                >
                  Accepted
                </button>
              )}
              {request?.BuyerStatus !== "Rejected" && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setShowRejectModal(true)}
                >
                  Rejected
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {showRejectModal && (
        <div
          className="modal"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Request</h5>
                <button
                  className="btn"
                  onClick={() => setShowRejectModal(false)}
                  style={{ border: "none", background: "transparent", fontSize: "1.0rem" }}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <label className="form-label">Rejection Comment</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRejectModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    if (!rejectComment.trim()) {
                      toast.error("Please enter a rejection comment before saving.");
                      return;
                    }
                    handleStatusUpdate("Rejected", rejectComment);
                  }}
                >
                  Save Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NegotiateModal;