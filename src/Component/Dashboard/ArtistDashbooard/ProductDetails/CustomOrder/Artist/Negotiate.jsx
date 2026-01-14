import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import putAPI from "../../../../../../api/putAPI";

const NegotiateModalforartist = ({ request, onClose, onSubmit }) => {
  const [buyerName] = useState(
    request?.Buyer?.id?.name && request?.Buyer?.id?.lastName
      ? `${request.Buyer.id.name} ${request.Buyer.id.lastName}`
      : "Unknown Buyer"
  );
  const [requestDate] = useState(
    request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : "Unknown Date"
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

  const latestBuyerDays =
    request?.BuyerEstimatedCreationDaysHistory?.length > 0
      ? request.BuyerEstimatedCreationDaysHistory[request.BuyerEstimatedCreationDaysHistory.length - 1]
      : request?.ExpectedDeadline || "";

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

    if (!notes || !notes.trim()) {
      toast.error("Notes is required");
      return;
    }

    const parsedBudget = parseFloat(newBudget);
    if (isNaN(parsedBudget)) {
      toast.error("Please enter a valid number for the budget");
      return;
    }

    if (!canArtistUpdate()) {
      toast.error(
        "Cannot update now. Please wait for buyer's response or you have reached the maximum updates."
      );
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
          EstimatedCreationDays: isCustomCreationDays
            ? customCreationDays
            : request?.ExpectedDeadline,
        }
      );

      if (response && response.data) {
        toast.success(
          response.data.successMessage || "Buyer request updated successfully"
        );
        onSubmit?.();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(response?.message || "Failed to update buyer request");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating buyer request"
      );
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
            maxWidth: "640px",
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
                      <input type="number" className={`${readOnlyStyle} pl-8`} value={minBudget} readOnly />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={labelStyle}>Max Budget</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">$</span>
                      <input type="number" className={`${readOnlyStyle} pl-8`} value={maxBudget} readOnly />
                    </div>
                  </div>
                </div>

                {/* Historical Negotiations */}
                {(artistNegotiatedBudgets.length > 0 || buyerNegotiatedBudgets.length > 0) && (
                  <div className="mt-8 pt-8 border-t border-gray-100 space-y-6">
                    <h6 className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Negotiation History</h6>
                    {[...Array(Math.max(artistNegotiatedBudgets.length, buyerNegotiatedBudgets.length))].map((_, index) => (
                      <div key={index} className="bg-zinc-50/50 p-5 rounded-2xl border border-zinc-100/50 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {artistNegotiatedBudgets[index] && (
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Your Bid {index + 1}</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                                <input type="number" className="w-full pl-7 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-600 font-semibold" value={artistNegotiatedBudgets[index]} readOnly />
                              </div>
                            </div>
                          )}
                          {request?.ArtistEstimatedCreationDaysHistory?.[index] && (
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Your Est. Days</label>
                              <input type="number" className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-600 font-semibold" value={request?.ArtistEstimatedCreationDaysHistory?.[index]} readOnly />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {buyerNegotiatedBudgets[index] && (
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Buyer Bid {index + 1}</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                                <input type="number" className="w-full pl-7 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-600 font-semibold" value={buyerNegotiatedBudgets[index]} readOnly />
                              </div>
                            </div>
                          )}
                          {request?.BuyerEstimatedCreationDaysHistory?.[index] && (
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-500 uppercase ml-1">Buyer Est. Days</label>
                              <input type="number" className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-600 font-semibold" value={request?.BuyerEstimatedCreationDaysHistory?.[index]} readOnly />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Active Negotiation Section */}
                {canArtistUpdate() && (
                  <div className="mt-8 pt-8 border-t border-gray-100 space-y-6">
                    <h6 className="text-xs font-bold uppercase tracking-wider text-indigo-500 ml-1">Active Negotiation</h6>
                    
                    <div className="space-y-1">
                      <label className={labelStyle}>
                        Your Counter Offer <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold transition-colors group-focus-within:text-zinc-900">$</span>
                        <input
                          type="number"
                          className={`${inputStyle} pl-8 bg-white border-zinc-300 font-semibold text-lg`}
                          placeholder="0.00"
                          value={newBudget}
                          onChange={(e) => setNewBudget(e.target.value)}
                          required
                          min={minBudget}
                        />
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-4">
                      <label className="block text-sm font-medium text-zinc-700 leading-relaxed">
                        The buyer estimated <span className="font-bold text-zinc-900">{latestBuyerDays || "N/A"} days</span> for creation. Do you agree?
                      </label>
                      
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className={`flex-1 py-2.5 rounded-xl font-bold transition-all duration-200 border-2 ${
                            !isCustomCreationDays 
                              ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-200" 
                              : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
                          }`}
                          onClick={() => setIsCustomCreationDays(false)}
                        >
                          Agree
                        </button>
                        <button
                          type="button"
                          className={`flex-1 py-2.5 rounded-xl font-bold transition-all duration-200 border-2 ${
                            isCustomCreationDays 
                              ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-200" 
                              : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
                          }`}
                          onClick={() => setIsCustomCreationDays(true)}
                        >
                          Suggest New
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 transition-all duration-300">
                      <label className={labelStyle}>
                        {isCustomCreationDays ? "Your Proposed Creation Days" : "Confirmed Creation Days"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        className={`${isCustomCreationDays ? inputStyle : readOnlyStyle} bg-white`}
                        value={isCustomCreationDays ? customCreationDays : latestBuyerDays || ""}
                        placeholder="e.g. 7"
                        disabled={!isCustomCreationDays}
                        onChange={(e) => setCustomCreationDays(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="mt-8 pt-8 border-t border-gray-100 space-y-1">
                  <label className={labelStyle}>
                    Message / Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`${inputStyle} min-h-[120px] resize-none bg-white`}
                    placeholder="Describe your terms or reason for this negotiation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-100 bg-zinc-50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-xl text-zinc-600 font-bold hover:bg-zinc-200 transition-all duration-200"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-10 py-2.5 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-all duration-200 shadow-xl shadow-zinc-200 disabled:opacity-50"
                  disabled={loading || !canArtistUpdate()}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Negotiation"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
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

export default NegotiateModalforartist;