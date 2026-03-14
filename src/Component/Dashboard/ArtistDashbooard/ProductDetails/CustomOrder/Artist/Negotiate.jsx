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
    request?.createdAt
      ? new Date(request.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Unknown Date"
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
      ? request.BuyerEstimatedCreationDaysHistory[
          request.BuyerEstimatedCreationDaysHistory.length - 1
        ]
      : request?.ExpectedDeadline || "";

  const canArtistUpdate = () => {
    const totalUpdates =
      artistNegotiatedBudgets.length + buyerNegotiatedBudgets.length;
    return (
      artistNegotiatedBudgets.length < 3 &&
      ((artistNegotiatedBudgets.length === 0 && totalUpdates === 0) ||
        (artistNegotiatedBudgets.length === 1 && totalUpdates === 2) ||
        (artistNegotiatedBudgets.length === 2 && totalUpdates === 4))
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

  const totalRounds = Math.max(
    artistNegotiatedBudgets.length,
    buyerNegotiatedBudgets.length
  );

  const roundLabel = ["1st", "2nd", "3rd"];

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 15, 25, 0.55)",
          backdropFilter: "blur(6px)",
          zIndex: 1050,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
        onClick={onClose}
      >
        {/* Modal panel */}
        <div
          style={{
            width: "100%",
            maxWidth: "660px",
            maxHeight: "92vh",
            borderRadius: "20px",
            background: "#fff",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ─── Header ─── */}
          <div
            style={{
              padding: "22px 28px 20px",
              borderBottom: "1px solid #f0f0f4",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              background: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17 8C17 5.24 14.76 3 12 3C9.24 3 7 5.24 7 8C7 10.76 9.24 13 12 13C14.76 13 17 10.76 17 8Z"
                    fill="white"
                    opacity="0.85"
                  />
                  <path
                    d="M3 21C3 17.13 7.03 14 12 14C16.97 14 21 17.13 21 21"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </div>
              <div>
                <h5
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#111",
                    letterSpacing: "-0.3px",
                  }}
                >
                  Negotiate Custom Order
                </h5>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#9ca3af",
                    marginTop: "1px",
                  }}
                >
                  {buyerName} &middot; {requestDate}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "none",
                background: "#f4f4f8",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                fontSize: "18px",
                lineHeight: 1,
                transition: "background 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#e9e9ef")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#f4f4f8")
              }
            >
              &times;
            </button>
          </div>

          {/* ─── Scrollable body ─── */}
          <div
            className="negotiate-scroll"
            style={{
              overflowY: "auto",
              flex: 1,
              padding: "24px 28px",
            }}
          >
            {/* Budget range pill row */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Min Budget", value: `₹${minBudget}` },
                { label: "Max Budget", value: `₹${maxBudget}` },
                {
                  label: "Expected Deadline",
                  value: `${request?.ExpectedDeadline || "—"} days`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    flex: "1 1 140px",
                    background: "#f7f7fb",
                    border: "1px solid #eeeef4",
                    borderRadius: "12px",
                    padding: "12px 16px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "4px",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* ─── Negotiation Thread ─── */}
            {totalRounds > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    margin: "0 0 14px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                  }}
                >
                  Negotiation History
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {Array.from({ length: totalRounds }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        borderRadius: "14px",
                        border: "1px solid #eeeef4",
                        overflow: "hidden",
                      }}
                    >
                      {/* Round header */}
                      <div
                        style={{
                          padding: "8px 16px",
                          background: "#f7f7fb",
                          borderBottom: "1px solid #eeeef4",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: "#1a1a2e",
                            color: "#fff",
                            fontSize: "10px",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#374151",
                          }}
                        >
                          {roundLabel[i] || `${i + 1}th`} Round
                        </span>
                      </div>

                      {/* Bids row */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                        }}
                      >
                        {/* Artist side */}
                        <div
                          style={{
                            padding: "14px 16px",
                            borderRight: "1px solid #eeeef4",
                          }}
                        >
                          <p
                            style={{
                              margin: "0 0 10px",
                              fontSize: "10px",
                              fontWeight: 700,
                              color: "#6366f1",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Your Bid
                          </p>
                          {artistNegotiatedBudgets[i] !== undefined ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              <div
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  background: "#eef2ff",
                                  borderRadius: "8px",
                                  padding: "7px 12px",
                                  width: "fit-content",
                                }}
                              >
                                <span style={{ fontSize: "13px", color: "#6366f1", fontWeight: 600 }}>₹</span>
                                <span style={{ fontSize: "15px", fontWeight: 700, color: "#4338ca" }}>
                                  {artistNegotiatedBudgets[i]}
                                </span>
                              </div>
                              {request?.ArtistEstimatedCreationDaysHistory?.[i] !== undefined && (
                                <div
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    background: "#f0fdf4",
                                    borderRadius: "8px",
                                    padding: "5px 10px",
                                    width: "fit-content",
                                  }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="#16a34a" strokeWidth="2" />
                                    <path d="M12 7v5l3 3" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
                                  </svg>
                                  <span style={{ fontSize: "12px", color: "#15803d", fontWeight: 600 }}>
                                    {request.ArtistEstimatedCreationDaysHistory[i]} days
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ fontSize: "12px", color: "#d1d5db" }}>—</span>
                          )}
                        </div>

                        {/* Buyer side */}
                        <div style={{ padding: "14px 16px" }}>
                          <p
                            style={{
                              margin: "0 0 10px",
                              fontSize: "10px",
                              fontWeight: 700,
                              color: "#f59e0b",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Buyer's Bid
                          </p>
                          {buyerNegotiatedBudgets[i] !== undefined ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              <div
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  background: "#fffbeb",
                                  borderRadius: "8px",
                                  padding: "7px 12px",
                                  width: "fit-content",
                                }}
                              >
                                <span style={{ fontSize: "13px", color: "#d97706", fontWeight: 600 }}>₹</span>
                                <span style={{ fontSize: "15px", fontWeight: 700, color: "#b45309" }}>
                                  {buyerNegotiatedBudgets[i]}
                                </span>
                              </div>
                              {request?.BuyerEstimatedCreationDaysHistory?.[i] !== undefined && (
                                <div
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    background: "#fefce8",
                                    borderRadius: "8px",
                                    padding: "5px 10px",
                                    width: "fit-content",
                                  }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="#ca8a04" strokeWidth="2" />
                                    <path d="M12 7v5l3 3" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
                                  </svg>
                                  <span style={{ fontSize: "12px", color: "#a16207", fontWeight: 600 }}>
                                    {request.BuyerEstimatedCreationDaysHistory[i]} days
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ fontSize: "12px", color: "#d1d5db" }}>Awaiting buyer</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Active Negotiation Form ─── */}
            <form onSubmit={handleSubmit}>
              {canArtistUpdate() && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #f0f0ff 0%, #f7f7fb 100%)",
                    border: "1.5px solid #c7d2fe",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 16px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#6366f1",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="#6366f1"
                      />
                    </svg>
                    Your Counter Offer
                  </p>

                  {/* Budget input */}
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      Counter Budget <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#6366f1",
                          pointerEvents: "none",
                        }}
                      >
                        ₹
                      </span>
                      <input
                        type="number"
                        value={newBudget}
                        onChange={(e) => setNewBudget(e.target.value)}
                        required
                        min={minBudget}
                        placeholder="0"
                        style={{
                          width: "100%",
                          paddingLeft: "34px",
                          paddingRight: "14px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          border: "1.5px solid #c7d2fe",
                          borderRadius: "10px",
                          background: "#fff",
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "#1e1b4b",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#6366f1")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "#c7d2fe")
                        }
                      />
                    </div>
                  </div>

                  {/* Creation days toggle */}
                  <div
                    style={{
                      background: "#fff",
                      border: "1.5px solid #e0e0f0",
                      borderRadius: "12px",
                      padding: "14px 16px",
                      marginBottom: "14px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 12px",
                        fontSize: "13px",
                        color: "#374151",
                        lineHeight: "1.5",
                      }}
                    >
                      Buyer estimates{" "}
                      <strong style={{ color: "#111" }}>
                        {latestBuyerDays || "N/A"} days
                      </strong>{" "}
                      for creation. Do you agree?
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {["Agree", "Suggest New"].map((label) => {
                        const isActive =
                          label === "Agree"
                            ? !isCustomCreationDays
                            : isCustomCreationDays;
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() =>
                              setIsCustomCreationDays(label === "Suggest New")
                            }
                            style={{
                              flex: 1,
                              padding: "8px 0",
                              borderRadius: "8px",
                              border: isActive
                                ? "2px solid #6366f1"
                                : "2px solid #e5e7eb",
                              background: isActive ? "#6366f1" : "#fff",
                              color: isActive ? "#fff" : "#6b7280",
                              fontSize: "13px",
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "all 0.15s",
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Creation days input */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: "6px",
                      }}
                    >
                      {isCustomCreationDays
                        ? "Your Proposed Creation Days"
                        : "Confirmed Creation Days"}{" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={
                        isCustomCreationDays
                          ? customCreationDays
                          : latestBuyerDays || ""
                      }
                      placeholder="e.g. 7"
                      disabled={!isCustomCreationDays}
                      onChange={(e) => setCustomCreationDays(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        border: "1.5px solid",
                        borderColor: isCustomCreationDays ? "#c7d2fe" : "#e9e9f0",
                        borderRadius: "10px",
                        background: isCustomCreationDays ? "#fff" : "#f7f7fb",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: isCustomCreationDays ? "#1e1b4b" : "#6b7280",
                        outline: "none",
                        boxSizing: "border-box",
                        cursor: isCustomCreationDays ? "text" : "not-allowed",
                      }}
                      onFocus={(e) =>
                        isCustomCreationDays &&
                        (e.target.style.borderColor = "#6366f1")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = isCustomCreationDays
                          ? "#c7d2fe"
                          : "#e9e9f0")
                      }
                    />
                  </div>
                </div>
              )}

              {/* Notes */}
              <div style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Message / Notes{" "}
                  <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                  placeholder="Describe your terms or reason for this negotiation…"
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "10px",
                    background: "#fafafa",
                    fontSize: "13px",
                    color: "#374151",
                    resize: "vertical",
                    outline: "none",
                    lineHeight: "1.6",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              {/* ─── Footer actions ─── */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  paddingTop: "16px",
                  borderTop: "1px solid #f0f0f4",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    border: "1.5px solid #e5e7eb",
                    background: "#fff",
                    color: "#374151",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f4f4f8")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || !canArtistUpdate()}
                  style={{
                    padding: "10px 28px",
                    borderRadius: "10px",
                    border: "none",
                    background:
                      loading || !canArtistUpdate()
                        ? "#c7d2fe"
                        : "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor:
                      loading || !canArtistUpdate()
                        ? "not-allowed"
                        : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow:
                      loading || !canArtistUpdate()
                        ? "none"
                        : "0 4px 14px rgba(99,102,241,0.35)",
                    transition: "all 0.15s",
                  }}
                >
                  {loading ? (
                    <>
                      <svg
                        className="spin-icon"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="3"
                        />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Submitting…
                    </>
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
        .negotiate-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .negotiate-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .negotiate-scroll::-webkit-scrollbar-thumb {
          background: #e0e0eb;
          border-radius: 10px;
        }
        .negotiate-scroll::-webkit-scrollbar-thumb:hover {
          background: #c7c7d8;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin-icon {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </>
  );
};

export default NegotiateModalforartist;
