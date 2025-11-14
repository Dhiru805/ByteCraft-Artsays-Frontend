import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import putAPI from "../../../../../../api/putAPI";

const NegotiateModalforartist = ({ request, onClose, onSubmit }) => {
  const [buyerName] = useState(
    request?.Buyer?.id?.name && request?.Buyer?.id?.lastName
      ? `${request.Buyer.id.name} ${request.Buyer.id.lastName}`
      : ""
  );
  const [requestDate] = useState(
    request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : ""
  );
  const [maxBudget] = useState(request?.MaxBudget || "");
  const [minBudget] = useState(request?.MinBudget || "");
  const [notes, setNotes] = useState(request?.Notes || "");
  const [loading, setLoading] = useState(false);

  const artistNegotiatedBudgets = Array.isArray(request?.ArtistNegotiatedBudgets)
    ? request.ArtistNegotiatedBudgets
    : [];
  const buyerNegotiatedBudgets = Array.isArray(request?.BuyerNegotiatedBudgets)
    ? request.BuyerNegotiatedBudgets
    : [];

  const [newBudget, setNewBudget] = useState("");
  const [customCreationDays, setCustomCreationDays] = useState(""); 
  const [isCustomCreationDays, setIsCustomCreationDays] = useState(false); 
  const [isYesClicked, setIsYesClicked] = useState(false); 
  const [showYesNoButtons, setShowYesNoButtons] = useState(true);


  const latestBuyerDays =
    request?.BuyerEstimatedCreationDaysHistory?.length > 0
      ? request.BuyerEstimatedCreationDaysHistory[request.BuyerEstimatedCreationDaysHistory.length - 1]
      : null;


  const canArtistUpdate = () => {
    const totalUpdates = artistNegotiatedBudgets.length + buyerNegotiatedBudgets.length;
    return (
      artistNegotiatedBudgets.length < 3 &&
      (
        (artistNegotiatedBudgets.length === 0 && totalUpdates === 0) ||
        (artistNegotiatedBudgets.length === 1 && totalUpdates === 2) ||
        (artistNegotiatedBudgets.length === 2 && totalUpdates === 4)
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedBudget = parseFloat(newBudget);
    if (isNaN(parsedBudget)) {
      toast.error("Please enter a valid number for the budget");
      return;
    }

    if (!canArtistUpdate()) {
      toast.error("Cannot update now. Please wait for buyer's response or you have reached the maximum updates.");
      return;
    }

    setLoading(true);
    try {
      const response = await putAPI(
        `/api/update-negiotaite-budget/${request._id}`,
        {
          ProductName: request?.ProductName || "",
          Description: request?.Description || "",
          MaxBudget: maxBudget,
          MinBudget: minBudget,
          NegotiatedBudget: parsedBudget,
          Notes: notes,
          EstimatedCreationDays: isCustomCreationDays ? customCreationDays : request?.ExpectedDeadline, // Send custom or default days
        }
      );

      if (response && response.data) {
        toast.success(response.data.successMessage || "Buyer request updated successfully");
        window.location.reload();
        setNewBudget("");
        onSubmit?.();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1040,
      }}
    >
      <div
        className="modal-dialog modal-dialog-scrollable"
        style={{
          maxWidth: "600px",
          margin: "1.75rem auto",
        }}
      >
        <div
          className="modal-content"
          style={{
            maxHeight: "80vh",
          }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Negotiate Request</h5>
            <button
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            >×</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div
              className="modal-body"
              style={{
                overflowY: "auto",
                maxHeight: "60vh",
              }}
            >
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
                <label className="form-label">Min Budget</label>
                <input
                  type="number"
                  className="form-control"
                  value={minBudget}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Max Budget</label>
                <input
                  type="number"
                  className="form-control"
                  value={maxBudget}
                  readOnly
                />
              </div>

              {artistNegotiatedBudgets.length > 0 || buyerNegotiatedBudgets.length > 0 ? (
                [...Array(Math.max(artistNegotiatedBudgets.length, buyerNegotiatedBudgets.length))].map((_, index) => (
                  <div key={index} className="mb-3">
                    <div className="row">

                      {artistNegotiatedBudgets[index] && (
                        <div className="col">
                          <label className="form-label">{`Artist Negotiation ${index + 1}`}</label>
                          <input
                            type="number"
                            className="form-control"
                            value={artistNegotiatedBudgets[index]}
                            readOnly
                          />
                        </div>
                      )}

                      {request?.ArtistEstimatedCreationDaysHistory?.[index] && (
                        <div className="col">
                          <label className="form-label">Estimated Creation Days</label>
                          <input
                            type="number"
                            className="form-control"
                            value={request?.ArtistEstimatedCreationDaysHistory?.[index] || ""}
                            readOnly
                          />
                        </div>
                      )}
                    </div>

                    <div className="row mt-3">
                      {buyerNegotiatedBudgets[index] && (
                        <div className="col">
                          <label className="form-label">{`Buyer Negotiation ${index + 1}`}</label>
                          <input
                            type="number"
                            className="form-control"
                            value={buyerNegotiatedBudgets[index]}
                            readOnly
                          />
                        </div>
                      )}

                      {request?.BuyerEstimatedCreationDaysHistory?.[index + 1] && (
                        <div className="col">
                          <label className="form-label">Estimated Creation Days</label>
                          <input
                            type="number"
                            className="form-control"
                            value={request?.BuyerEstimatedCreationDaysHistory?.[index + 1] || ""}
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              
              ) : (
                <div className="mb-3">{/* No artist or buyer budgets yet */}</div>
              )}

              {/* Custom Creation Days */}
              {canArtistUpdate() && (
                <div className="mb-3">
                  {/* Artist Budget Input */}
                  <div className="mb-3">
                    <label className="form-label">
                      Artist Negotiated Budget {artistNegotiatedBudgets.length + 1}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Negotiated Budget"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      required
                      min={minBudget}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-block">
                      Do you agree with the buyer’s estimated creation time of{" "}
                      <strong>{latestBuyerDays || "N/A"} days</strong>
                    </label>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className={`btn btn-outline-success btn-sm ${!isCustomCreationDays ? "active" : ""}`}
                        onClick={() => {
                          setIsCustomCreationDays(false);
                          setShowYesNoButtons(false);
                        }}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`btn btn-outline-danger ml-2 btn-sm ${isCustomCreationDays ? "active" : ""}`}
                        onClick={() => {
                          setIsCustomCreationDays(true);
                          setShowYesNoButtons(false);
                        }}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      {isCustomCreationDays ? "Enter Your Estimated Creation Days" : "Buyer’s Estimated Creation Days"}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={
                        isCustomCreationDays
                          ? customCreationDays
                          : latestBuyerDays || ""
                      }
                      placeholder="Enter custom days"
                      disabled={!isCustomCreationDays}
                      onChange={(e) => setCustomCreationDays(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Notes <span className="text-danger"> *</span></label>
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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !canArtistUpdate()}
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

export default NegotiateModalforartist;
