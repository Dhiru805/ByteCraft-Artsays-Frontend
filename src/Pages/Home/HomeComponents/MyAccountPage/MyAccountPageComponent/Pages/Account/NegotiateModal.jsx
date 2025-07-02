// import React, { useState } from "react";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import putAPI from "../../../../../../../api/putAPI";

// const NegotiateModalforBuyer = ({ request, onClose, onSubmit }) => {
//   const [buyerName] = useState(
//     request?.Buyer?.id?.name && request?.Buyer?.id?.lastName
//       ? `${request.Buyer.id.name} ${request.Buyer.id.lastName}`
//       : "Unknown Buyer"
//   );
//   const [requestDate] = useState(
//     request?.createdAt && !isNaN(new Date(request.createdAt))
//       ? new Date(request.createdAt).toLocaleDateString()
//       : "Unknown Date"
//   );
//   const [maxBudget] = useState(request?.MaxBudget || "");
//   const [minBudget] = useState(request?.MinBudget || "");
//   const [notes, setNotes] = useState(request?.BuyerNotes || "");
//   const [negotiatedBudgets, setNegotiatedBudgets] = useState(request?.NegotiatedBudget || []);
//   const [currentBudget, setCurrentBudget] = useState("");
//   const [isUpdated] = useState(request?.isUpdated || 0);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectComment, setRejectComment] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (isUpdated >= 2) {
//       toast.error("Cannot update anymore: Maximum 2 negotiations reached");
//       return;
//     }

//     if (!currentBudget) {
//       toast.error("Please enter a negotiated budget");
//       return;
//     }

//     setLoading(true);
//     try {
//       const updatedBudgets = [...negotiatedBudgets, parseFloat(currentBudget)];
//       setNegotiatedBudgets(updatedBudgets);
//       const response = await putAPI(
//         `/api/update-negiotaite-Buyer-budget/${request._id}`,
//         {
//           ProductName: request?.ProductName || "",
//           Description: request?.Description || "",
//           MaxBudget: maxBudget ? parseFloat(maxBudget) : "",
//           MinBudget: minBudget ? parseFloat(minBudget) : "",
//           NegotiatedBudget: updatedBudgets,
//           BuyerNotes: notes,
//           isUpdated: isUpdated + 1,
//         }
//       );

//       if (response && response.data) {
//         toast.success(response.data.successMessage || "Buyer request updated successfully");
//         onSubmit(response.data.updatedRequest);
//         setCurrentBudget("");
//         onClose();
//       } else {
//         toast.error(response?.message || "Failed to update buyer request");
//       }
//     } catch (error) {
//       console.error("Error updating buyer request:", error);
//       toast.error(error.response?.data?.message || "Error updating buyer request");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (status, comment = "") => {
//     setLoading(true);
//     try {
//       const response = await putAPI(
//         `/api/update-negiotaite-Buyer-budget/${request._id}`,
//         {
//           rejectedcomment: comment,
//           BuyerStatus: status,
//         }
//       );

//       if (response && response.data) {
//         toast.success(`Buyer request ${status.toLowerCase()} successfully`);
//         onSubmit(response.data.updatedRequest);
//         onClose();
//       } else {
//         toast.error(response?.message || `Failed to update buyer request status`);
//       }
//     } catch (error) {
//       console.error("Error updating buyer request status:", error);
//       toast.error(error.response?.data?.message || "Error updating buyer request status");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div
//         className="modal fade show"
//         style={{
//           display: "block",
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//           zIndex: 1040,
//         }}
//       >
//         <div
//           className="modal-dialog modal-dialog-scrollable"
//           style={{
//             maxWidth: "600px", // Adjustable max width
//             margin: "1.75rem auto", // Center the modal
//           }}
//         >
//           <div
//             className="modal-content"
//             style={{
//               maxHeight: "80vh", // Limit modal height to 80% of viewport
//             }}
//           >
//             <div className="modal-header">
//               <h5 className="modal-title">Negotiate Request</h5>
//               <button
//                 className="btn-close"
//                 onClick={onClose}
//                 disabled={loading}
//                 aria-label="Close"
//               >
//                 Close
//               </button>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div
//                 className="modal-body"
//                 style={{
//                   overflowY: "auto", // Enable scrolling
//                   maxHeight: "60vh", // Limit body height
//                 }}
//               >
//                 <div className="mb-3">
//                   <label htmlFor="buyerName" className="form-label">
//                     Buyer Name
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="buyerName"
//                     name="buyerName"
//                     value={buyerName}
//                     readOnly
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="requestDate" className="form-label">
//                     Request Date
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="requestDate"
//                     name="requestDate"
//                     value={requestDate}
//                     readOnly
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="maxBudget" className="form-label">
//                     Max Budget
//                   </label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     id="maxBudget"
//                     name="maxBudget"
//                     value={maxBudget}
//                     readOnly
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="minBudget" className="form-label">
//                     Min Budget
//                   </label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     id="minBudget"
//                     name="minBudget"
//                     value={minBudget}
//                     readOnly
//                   />
//                 </div>

//                 {negotiatedBudgets.map((budget, index) => (
//                   <div key={index} className="mb-3">
//                     <label
//                       htmlFor={`negotiatedBudget${index}`}
//                       className="form-label"
//                     >
//                       {`Negotiated Budget ${index + 1}`}
//                     </label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       id={`negotiatedBudget${index}`}
//                       name={`negotiatedBudget${index}`}
//                       value={budget}
//                       readOnly
//                     />
//                   </div>
//                 ))}

//                 {isUpdated < 2 && negotiatedBudgets.length < 2 && (
//                   <div className="mb-3">
//                     <label
//                       htmlFor={`negotiatedBudget${negotiatedBudgets.length}`}
//                       className="form-label"
//                     >
//                       {`Negotiated Budget ${negotiatedBudgets.length + 1}`}
//                     </label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       id={`negotiatedBudget${negotiatedBudgets.length}`}
//                       name={`negotiatedBudget${negotiatedBudgets.length}`}
//                       placeholder={`Enter Negotiated Budget ${negotiatedBudgets.length + 1}`}
//                       value={currentBudget}
//                       onChange={(e) => setCurrentBudget(e.target.value)}
//                       required
//                       min={minBudget}
//                     />
//                   </div>
//                 )}

//                 <div className="mb-3">
//                   <label htmlFor="notes" className="form-label">
//                     Notes
//                   </label>
//                   <textarea
//                     className="form-control"
//                     id="notes"
//                     name="notes"
//                     rows="4"
//                     placeholder="Enter additional notes or negotiation terms"
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={onClose}
//                   disabled={loading}
//                 >
//                   Close
//                 </button>
//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   disabled={loading || isUpdated >= 2 || negotiatedBudgets.length >= 2}
//                 >
//                   {loading ? "Saving..." : "Save changes"}
//                 </button>
//                 {request?.BuyerStatus !== "Approved" &&
//                   request?.BuyerStatus !== "Rejected" && (
//                     <>
//                       <button
//                         type="button"
//                         className="btn btn-success"
//                         onClick={() => handleStatusUpdate("Approved")}
//                         disabled={loading}
//                       >
//                         Accepted
//                       </button>
//                       <button
//                         type="button"
//                         className="btn btn-danger"
//                         onClick={() => setShowRejectModal(true)}
//                         disabled={loading}
//                       >
//                         Rejected
//                       </button>
//                     </>
//                   )}
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {showRejectModal && (
//         <div
//           className="modal fade show"
//           style={{
//             display: "block",
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             zIndex: 1050, // Higher z-index for nested modal
//           }}
//         >
//           <div
//             className="modal-dialog modal-dialog-scrollable"
//             style={{
//               maxWidth: "500px",
//               margin: "1.75rem auto",
//             }}
//           >
//             <div
//               className="modal-content"
//               style={{
//                 maxHeight: "80vh",
//               }}
//             >
//               <div className="modal-header">
//                 <h5 className="modal-title">Reject Request</h5>
//                 <button
//                   className="btn-close"
//                   onClick={() => setShowRejectModal(false)}
//                   disabled={loading}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div
//                 className="modal-body"
//                 style={{
//                   overflowY: "auto",
//                   maxHeight: "60vh",
//                 }}
//               >
//                 <label htmlFor="rejectComment" className="form-label">
//                   Rejection Comment
//                 </label>
//                 <textarea
//                   className="form-control"
//                   id="rejectComment"
//                   name="rejectComment"
//                   rows="4"
//                   value={rejectComment}
//                   onChange={(e) => setRejectComment(e.target.value)}
//                   disabled={loading}
//                 />
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowRejectModal(false)}
//                   disabled={loading}
//                 >
//                   Close
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-danger"
//                   onClick={() => {
//                     if (!rejectComment.trim()) {
//                       toast.error("Please enter a rejection comment before saving.");
//                       return;
//                     }
//                     handleStatusUpdate("Rejected", rejectComment);
//                   }}
//                   disabled={loading}
//                 >
//                   Save Rejection
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default NegotiateModalforBuyer; 

import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import putAPI from "../../../../../../../api/putAPI";

const NegotiateModalforBuyer = ({ request, onClose, onSubmit }) => {
  const [buyerName] = useState(
    request?.Buyer?.id?.name && request?.Buyer?.id?.lastName
      ? `${request.Buyer.id.name} ${request.Buyer.id.lastName}`
      : "Unknown Buyer"
  );
  const [requestDate] = useState(
    request?.createdAt && !isNaN(new Date(request.createdAt))
      ? new Date(request.createdAt).toLocaleDateString()
      : "Unknown Date"
  );
  const [maxBudget] = useState(request?.MaxBudget || "");
  const [minBudget] = useState(request?.MinBudget || "");
  const [notes, setNotes] = useState(request?.BuyerNotes || "");
  const [currentBudget, setCurrentBudget] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [loading, setLoading] = useState(false);

  const buyerNegotiatedBudgets = Array.isArray(request?.BuyerNegotiatedBudgets)
    ? request.BuyerNegotiatedBudgets
    : [];
  const artistNegotiatedBudgets = Array.isArray(request?.ArtistNegotiatedBudgets)
    ? request.ArtistNegotiatedBudgets
    : [];

  const canBuyerUpdate = () => {
    const totalUpdates = buyerNegotiatedBudgets.length + artistNegotiatedBudgets.length;
    return (
      buyerNegotiatedBudgets.length < 2 &&
      (artistNegotiatedBudgets.length === 1 || artistNegotiatedBudgets.length === 2)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canBuyerUpdate()) {
      toast.error("Cannot update now. Please wait for artist's response or you have reached the maximum updates.");
      return;
    }

    const parsedBudget = parseFloat(currentBudget);
    if (isNaN(parsedBudget)) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    setLoading(true);
    try {
      const response = await putAPI(
        `/api/update-negiotaite-Buyer-budget/${request._id}`,
        {
          ProductName: request?.ProductName || "",
          Description: request?.Description || "",
          MaxBudget: maxBudget ? parseFloat(maxBudget) : "",
          MinBudget: minBudget ? parseFloat(minBudget) : "",
          NegotiatedBudget: parsedBudget,
          BuyerNotes: notes,
        }
      );

      if (response && response.data) {
        toast.success(response.data.successMessage || "Buyer request updated successfully");
        setCurrentBudget("");
        onSubmit(response.data.updatedRequest);
        onClose();
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
      toast.error(error.response?.data?.message || "Error updating buyer request status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                disabled={loading}
                aria-label="Close"
              >
                ×</button>
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
                    value={maxBudget}
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
                    value={minBudget}
                    readOnly
                  />
                </div>

                {artistNegotiatedBudgets.length > 0 ? (
                  artistNegotiatedBudgets.map((budget, index) => (
                    <div key={`artist-${index}`} className="mb-3">
                      <label
                        htmlFor={`artistNegotiatedBudget${index}`}
                        className="form-label"
                      >
                        {`Artist Negotiated Budget ${index + 1}`}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id={`artistNegotiatedBudget${index}`}
                        name={`artistNegotiatedBudget${index}`}
                        value={budget}
                        readOnly
                      />
                    </div>
                  ))
                ) : (
                  <div className="mb-3">
                    <label className="form-label">Artist Negotiated Budgets</label>
                    <p className="text-gray-500">No artist budgets submitted yet.</p>
                  </div>
                )}

                {buyerNegotiatedBudgets.length > 0 ? (
                  buyerNegotiatedBudgets.map((budget, index) => (
                    <div key={`buyer-${index}`} className="mb-3">
                      <label
                        htmlFor={`buyerNegotiatedBudget${index}`}
                        className="form-label"
                      >
                        {`Buyer Negotiated Budget ${index + 1}`}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id={`buyerNegotiatedBudget${index}`}
                        name={`buyerNegotiatedBudget${index}`}
                        value={budget}
                        readOnly
                      />
                    </div>
                  ))
                ) : (
                  <div className="mb-3">
                    <label className="form-label">Buyer Negotiated Budgets</label>
                    <p className="text-gray-500">No buyer budgets submitted yet.</p>
                  </div>
                )}

                {canBuyerUpdate() && (
                  <div className="mb-3">
                    <label
                      htmlFor={`buyerNegotiatedBudget${buyerNegotiatedBudgets.length}`}
                      className="form-label"
                    >
                      {`Buyer Negotiated Budget ${buyerNegotiatedBudgets.length + 1}`}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id={`buyerNegotiatedBudget${buyerNegotiatedBudgets.length}`}
                      name={`buyerNegotiatedBudget${buyerNegotiatedBudgets.length}`}
                      placeholder={`Enter Negotiated Budget ${buyerNegotiatedBudgets.length + 1}`}
                      value={currentBudget}
                      onChange={(e) => setCurrentBudget(e.target.value)}
                      required
                      min={minBudget}
                    />
                  </div>
                )}

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
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="text-[16px] py-1 px-3 text-zinc-900 border-[1.6px] rounded-lg border-zinc-600"
                  onClick={onClose}
                  disabled={loading}
                >
                  Close
                </button>
                {canBuyerUpdate() && (
                  <button
                    type="submit"
                    className="text-[16px] py-1 px-3 text-zinc-900 border-[1.6px] rounded-lg border-zinc-600"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                )}
                {/* {request?.BuyerStatus !== "Approved" &&
                  request?.BuyerStatus !== "Rejected" &&
                  buyerNegotiatedBudgets.length === 2 && (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => setShowRejectModal(true)}
                      >
                        Reject
                      </button>
                    </>
                  )} */}

              </div>
            </form>
          </div>
        </div>
      </div>

      {/* {showRejectModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog modal-dialog-scrollable"
            style={{
              maxWidth: "500px",
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
                <h5 className="modal-title">Reject Request</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowRejectModal(false)}
                  disabled={loading}
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body"
                style={{
                  overflowY: "auto",
                  maxHeight: "60vh",
                }}
              >
                <label htmlFor="rejectComment" className="form-label">
                  Rejection Comment
                </label>
                <textarea
                  className="form-control"
                  id="rejectComment"
                  name="rejectComment"
                  rows="4"
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="text-[16px] py-1 px-3 text-zinc-900 border-[1.6px] rounded-lg border-zinc-600"
                  onClick={() => setShowRejectModal(false)}
                  disabled={loading}
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
      )} */}
    </>
  );
};

export default NegotiateModalforBuyer;