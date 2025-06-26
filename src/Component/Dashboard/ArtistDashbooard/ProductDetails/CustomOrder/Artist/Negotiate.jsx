import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import putAPI from "../../../../../../api/putAPI";

const UpdateModal = ({ request, onClose, onSubmit }) => {
  const [buyerName] = useState(
    request ? `${request.Buyer.id.name} ${request.Buyer.id.lastName}` : ""
  );
  const [requestDate] = useState(
    new Date(request?.createdAt).toLocaleDateString() || ""
  );
  const [maxBudget] = useState(request?.MaxBudget || "");
  const [minBudget] = useState(request?.MinBudget || "");
  const [notes, setNotes] = useState(request?.Notes || "");
  const [loading, setLoading] = useState(false);

  const existingNegotiatedBudgets = Array.isArray(request?.NegotiatedBudget)
    ? request.NegotiatedBudget
    : request?.NegotiatedBudget
      ? [request.NegotiatedBudget]
      : [];

  const [negotiatedBudgets, setNegotiatedBudgets] = useState(existingNegotiatedBudgets);
  const [newBudget, setNewBudget] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedBudget = parseFloat(newBudget);
    if (isNaN(parsedBudget)) {
      toast.error("Please enter a valid number");
      return;
    }

    if (parsedBudget >= maxBudget || parsedBudget <= minBudget) {
      toast.error(`Budget must be less than Max (${maxBudget}) and greater than Min (${minBudget})`);
      return;
    }

    setLoading(true);
    try {
      const updatedBudgets = [...negotiatedBudgets, parsedBudget];

      const response = await putAPI(
        `/api/update-negiotaite-budget/${request._id}`,
        {
          ProductName: request?.ProductName || "",
          Description: request?.Description || "",
          MaxBudget: maxBudget,
          MinBudget: minBudget,
          NegotiatedBudget: updatedBudgets,
          Notes: notes,
        }
      );

      if (response && response.data) {
        toast.success(response.data.successMessage || "Buyer request updated successfully");
        setNegotiatedBudgets(updatedBudgets);
        setNewBudget("");
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
                <label className="form-label">Buyer Name</label>
                <input type="text" className="form-control" value={buyerName} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label">Request Date</label>
                <input type="text" className="form-control" value={requestDate} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label">Max Budget</label>
                <input type="number" className="form-control" value={maxBudget} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label">Min Budget</label>
                <input type="number" className="form-control" value={minBudget} readOnly />
              </div>

              {negotiatedBudgets.map((budget, index) => (
                <div className="mb-3" key={index}>
                  <label className="form-label">{`Negotiated Budget ${index + 1}`}</label>
                  <input type="number" className="form-control" value={budget} readOnly />
                </div>
              ))}

              {negotiatedBudgets.length < 3 && (
                <div className="mb-3">
                  <label className="form-label">
                    Negotiated Budget {negotiatedBudgets.length + 1}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Negotiated Budget"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* {negfotiatedBudgets.filter((b) => b.updatedBy === 'artist').map((budget, index) => (
                <div className="mb-3" key={index}>
                  <label className="form-label">Artist Negotiated Budget {index + 1}</label>
                  <input type="number" className="form-control" value={budget.amount} readOnly />
                </div>
              ))}

              {negotiatedBudgets.length < 3 && (negotiatedBudgets.length % 2 === 0) && (
                <div className="mb-3">
                  <label className="form-label">
                    Artist Negotiated Budget {Math.floor(negotiatedBudgets.length / 2) + 1}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Negotiated Budget"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    required
                  />
                </div>
              )} */}


              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Enter additional notes or negotiation terms"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || negotiatedBudgets.length >= 3}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
