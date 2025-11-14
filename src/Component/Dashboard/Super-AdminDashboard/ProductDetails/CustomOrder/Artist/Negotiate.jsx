import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import putAPI from '../../../../../../api/putAPI';

const UpdateModal = ({ request, onClose, onSubmit }) => {
  const [buyerName] = useState(
    request ? `${request.Buyer.id.name} ${request.Buyer.id.lastName}` : ""
  );
  const [requestDate] = useState(
    new Date(request?.createdAt).toLocaleDateString() || ""
  );
  const [maxBudget, setMaxBudget] = useState(request?.MaxBudget || "");
  const [minBudget, setMinBudget] = useState(request?.MinBudget || "");
  const [notes, setNotes] = useState(request?.Notes || "");
  const [negotiateBudget, setNegotiateBudget] = useState(request?.NegotiatedBudget|| "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await putAPI(
        `${process.env.REACT_APP_API_URL}/api/update-negiotaite-budget/${request._id}`,
        {
          ProductName: request?.ProductName || "",
          Description: request?.Description || "",
          MaxBudget: maxBudget, 
          MinBudget: minBudget,
          NegotiatedBudget: negotiateBudget, 
          Notes: notes,
        }
      )

      if (response && response.data) {
        toast.success(response.data.successMessage || "Buyer request updated successfully");
        onSubmit(response.data.updatedRequest);
      } else {
        toast.error(response?.message || "Failed to update buyer request");
      }
    } catch (error) {
      console.error("Error updating buyer request:", error);
      toast.error(error.response?.data?.message || "Error updating buyer request");
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
              style={{
                border: "none",
                background: "transparent",
                fontSize: "1.0rem",
              }}
            >
              &#x2715;
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="buyerName" className="form-label">
                  Buyer Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="buyerName"
                  name="buyerName"
                  value={buyerName}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="requestDate" className="form-label">
                  Request Date
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="requestDate"
                  name="requestDate"
                  value={requestDate}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="maxBudget" className="form-label">
                  Max Budget
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="maxBudget"
                  name="maxBudget"
                  placeholder="Enter Max Budget"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  required
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="minBudget" className="form-label">
                  Min Budget
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="minBudget"
                  name="minBudget"
                  placeholder="Enter Min Budget"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  required
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="negotiateBudget" className="form-label">
                  Negotiated Budget
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="negotiateBudget"
                  name="negotiateBudget"
                  placeholder="Enter Negotiated Budget"
                  value={negotiateBudget}
                  onChange={(e) => setNegotiateBudget(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  rows="4"
                  placeholder="Enter additional notes or negotiation terms"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
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
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
