// // import { useState } from "react";

// // const BidAdjustmentsSection = ({ onNext, onBack }) => {
// //   const [bidAdjustments, setBidAdjustments] = useState({
// //     homepage: 0,
// //     topOfSearch: 0,
// //     restOfSearch: 0,
// //     topOfBrowse: 0,
// //     restOfBrowse: 0,
// //     productPage: 0,
// //   });
// //   const [showBusinessBoost, setShowBusinessBoost] = useState(true);
// //   const [enableBusinessBoost, setEnableBusinessBoost] = useState(false);

// //   const handleBidAdjustmentChange = (placement, value) => {
// //     setBidAdjustments((prev) => ({
// //       ...prev,
// //       [placement]: Number.parseFloat(value) || 0,
// //     }));
// //   };

// //   const InfoIcon = ({ tooltip }) => (
// //     <span
// //       className="text-muted ms-1"
// //       style={{ cursor: "pointer" }}
// //       title={tooltip}
// //       data-bs-toggle="tooltip"
// //       data-bs-placement="top"
// //     >
// //       <i className="fa fa-info-circle" style={{ fontSize: "12px" }}></i>
// //     </span>
// //   );

// //   const placementLabels = {
// //     homepage: "Homepage",
// //     topOfSearch: "Top of search page",
// //     restOfSearch: "Rest of search page",
// //     topOfBrowse: "Top of browse page",
// //     restOfBrowse: "Rest of browse page",
// //     productPage: "Product page",
// //   };

// //   return (
// //     <div className="card p-3 mb-4">
// //       <div className="d-flex justify-content-between align-items-center mb-3">
// //         <div className="d-flex align-items-center">
// //           <h2 className="mb-0">Bid adjustments</h2>
// //         </div>
// //       </div>
// //       <div className="text-muted mb-4" style={{ fontSize: "14px" }}>
// //         By raising your bids, you will be more likely to appear in specific placements and in front of specific
// //         audiences.
// //       </div>
// //       <hr />

// //       {/* Business Boost Banner */}
// //       {showBusinessBoost && (
// //         <div className="alert mb-4" style={{ backgroundColor: "#00897b", color: "white", border: "none" }}>
// //           <div className="d-flex justify-content-between align-items-start">
// //             <div>
// //               <h6 className="text-white mb-2">
// //                 <strong>Boost bids for Artsyas Business placements</strong>
// //               </h6>
// //               <p className="mb-2" style={{ fontSize: "14px" }}>
// //                 Reach more business shoppers, who convert more and buy products in larger quantities than consumers on
// //                 the Artsyas store. Performance data is available in the Bid adjustments tab and sponsored ads reports.{" "}
// //                 <a href="#" className="text-white" style={{ textDecoration: "underline" }}>
// //                   Learn about Artsyas Business
// //                 </a>
// //               </p>
// //             </div>
// //             <button
// //               onClick={() => setShowBusinessBoost(false)}
// //               className="btn btn-link text-white p-0"
// //               style={{ fontSize: "20px", lineHeight: 1 }}
// //             >
// //               ×
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       <div className="mb-4">
// //         <div className="d-flex align-items-center mb-3">
// //           <span style={{ fontSize: "16px", fontWeight: "600" }}>
// //             Increase your bid for specific Artsyas placements.
// //           </span>
// //           <InfoIcon tooltip="Adjust bids for different placement locations to optimize performance" />
// //         </div>

// //         {/* Placement Adjustments */}
// //         <div className="row">
// //           {Object.entries(placementLabels).map(([key, label]) => (
// //             <div key={key} className="col-md-6 mb-3">
// //               <div className="d-flex justify-content-between align-items-center">
// //                 <label className="form-label mb-0" style={{ fontSize: "14px", fontWeight: "500" }}>
// //                   {label}
// //                 </label>
// //                 <div className="d-flex align-items-center" style={{ gap: "8px" }}>
// //                   <input
// //                     type="number"
// //                     value={bidAdjustments[key] > 0 ? bidAdjustments[key] : ""}
// //                     onChange={(e) => handleBidAdjustmentChange(key, e.target.value)}
// //                     className="form-control text-center no-spinner"
// //                     style={{ width: "80px" }}
// //                     min="0"
// //                     max="900"
// //                   />

// //                   <span style={{ fontSize: "14px", color: "#6c757d" }}>%</span>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Dynamic Bid Calculation Info */}
// //         <div className="mt-4 p-3 bg-light rounded">
// //           <small className="text-muted">
// //             With dynamic bids - up and down, a ₹19.37 bid could be increased up to ₹38.74 for homepage, ₹29.05 for top
// //             of search page, and ₹29.05 for product pages.
// //           </small>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default BidAdjustmentsSection;

// 

// import { useState, useEffect } from "react"

// const BidAdjustmentsSection = ({ initialBidAdjustments, onUpdateBidAdjustments }) => {
//   const [bidAdjustments, setBidAdjustments] = useState(initialBidAdjustments)
//   const [showBusinessBoost, setShowBusinessBoost] = useState(true)
//   const [enableBusinessBoost, setEnableBusinessBoost] = useState(false)

//   useEffect(() => {
//     onUpdateBidAdjustments(bidAdjustments)
//   }, [bidAdjustments, onUpdateBidAdjustments])

//   const handleBidAdjustmentChange = (placement, value) => {
//     setBidAdjustments((prev) => ({
//       ...prev,
//       [placement]: Number.parseFloat(value) || 0,
//     }))
//   }

//   const InfoIcon = ({ tooltip }) => (
//     <span
//       className="text-muted ms-1"
//       style={{ cursor: "pointer" }}
//       title={tooltip}
//       data-bs-toggle="tooltip"
//       data-bs-placement="top"
//     >
//       <i className="fa fa-info-circle" style={{ fontSize: "12px" }}></i>
//     </span>
//   )

//   const placementLabels = {
//     homepage: "Homepage",
//     topOfSearch: "Top of search page",
//     restOfSearch: "Rest of search page",
//     topOfBrowse: "Top of browse page",
//     restOfBrowse: "Rest of browse page",
//     productPage: "Product page",
//   }

//   return (
//     <div className="card p-3 mb-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div className="d-flex align-items-center">
//           <h2 className="mb-0">Bid adjustments</h2>
//         </div>
//       </div>
//       <div className="text-muted mb-4" style={{ fontSize: "14px" }}>
//         By raising your bids, you will be more likely to appear in specific placements and in front of specific
//         audiences.
//       </div>
//       <hr />

//       {/* Business Boost Banner */}
//       {showBusinessBoost && (
//         <div className="alert mb-4" style={{ backgroundColor: "#00897b", color: "white", border: "none" }}>
//           <div className="d-flex justify-content-between align-items-start">
//             <div>
//               <h6 className="text-white mb-2">
//                 <strong>Boost bids for Artsyas Business placements</strong>
//               </h6>
//               <p className="mb-2" style={{ fontSize: "14px" }}>
//                 Reach more business shoppers, who convert more and buy products in larger quantities than consumers on
//                 the Artsyas store. Performance data is available in the Bid adjustments tab and sponsored ads reports.{" "}
//                 <a href="#" className="text-white" style={{ textDecoration: "underline" }}>
//                   Learn about Artsyas Business
//                 </a>
//               </p>
//             </div>
//             <button
//               onClick={() => setShowBusinessBoost(false)}
//               className="btn btn-link text-white p-0"
//               style={{ fontSize: "20px", lineHeight: 1 }}
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="mb-4">
//         <div className="d-flex align-items-center mb-3">
//           <span style={{ fontSize: "16px", fontWeight: "600" }}>
//             Increase your bid for specific Artsyas placements.
//           </span>
//           <InfoIcon tooltip="Adjust bids for different placement locations to optimize performance" />
//         </div>

//         {/* Placement Adjustments */}
//         <div className="row">
//           {Object.entries(placementLabels).map(([key, label]) => (
//             <div key={key} className="col-md-6 mb-3">
//               <div className="d-flex justify-content-between align-items-center">
//                 <label className="form-label mb-0" style={{ fontSize: "14px", fontWeight: "500" }}>
//                   {label}
//                 </label>
//                 <div className="d-flex align-items-center" style={{ gap: "8px" }}>
//                   <input
//                     type="number"
//                     value={bidAdjustments[key] > 0 ? bidAdjustments[key] : ""}
//                     onChange={(e) => handleBidAdjustmentChange(key, e.target.value)}
//                     className="form-control text-center no-spinner"
//                     style={{ width: "80px" }}
//                     min="0"
//                     max="900"
//                   />

//                   <span style={{ fontSize: "14px", color: "#6c757d" }}>%</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Dynamic Bid Calculation Info */}
//         <div className="mt-4 p-3 bg-light rounded">
//           <small className="text-muted">
//             With dynamic bids - up and down, a ₹19.37 bid could be increased up to ₹38.74 for homepage, ₹29.05 for top
//             of search page, and ₹29.05 for product pages.
//           </small>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BidAdjustmentsSection




import { useState, useEffect } from "react"

const BidAdjustmentsSection = ({ initialBidAdjustments, onUpdateBidAdjustments, setIsBidAdjustmentValid }) => {
  const [bidAdjustments, setBidAdjustments] = useState(
    initialBidAdjustments || {
      homepage: 0,
      topOfSearch: 0,
      restOfSearch: 0,
      topOfBrowse: 0,
      restOfBrowse: 0,
      productPage: 0,
    },
  )
  const [showBusinessBoost, setShowBusinessBoost] = useState(true)
  const [enableBusinessBoost, setEnableBusinessBoost] = useState(false)
  const [errors, setErrors] = useState({});
  const [totalError, setTotalError] = useState(null);

useEffect(() => {
    if (initialBidAdjustments) {
      setBidAdjustments(initialBidAdjustments);
    }
  }, [initialBidAdjustments]);

useEffect(() => {
  if (initialBidAdjustments) {
    setBidAdjustments(initialBidAdjustments);
  }
}, [initialBidAdjustments]);

const handleBidAdjustmentChange = (placement, value) => {
  const intValue = parseInt(value) || 0;

  const updatedAdjustments = {
    ...bidAdjustments,
    [placement]: intValue,
  };

  setBidAdjustments(updatedAdjustments);
  validateTotalPercentage(updatedAdjustments);

  if (onUpdateBidAdjustments) {
    onUpdateBidAdjustments(updatedAdjustments);
  }
};

  const validateFieldOnBlur = (placement) => {
    const value = bidAdjustments[placement];

    if (value < 1 || value > 100) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [placement]: "Value should be between 1–100% only.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [placement]: null,
      }));
    }
  };

  const validateTotalPercentage = (updatedAdjustments) => {
    const total = Object.values(updatedAdjustments).reduce((sum, val) => sum + val, 0);

    if (total !== 100) {
      setTotalError(`Total must be exactly 100% (current: ${total}%)`);
      if (setIsBidAdjustmentValid) setIsBidAdjustmentValid(false);
    } else {
      setTotalError(null);
      if (setIsBidAdjustmentValid) setIsBidAdjustmentValid(true);
    }
  };
  const resetBidAdjustments = () => {
    const defaultAdjustments = {
      homepage: 0,
      topOfSearch: 0,
      restOfSearch: 0,
      topOfBrowse: 0,
      restOfBrowse: 0,
      productPage: 0,
    };
    setBidAdjustments(defaultAdjustments);
    setErrors({});
    setTotalError(null);
    if (setIsBidAdjustmentValid) setIsBidAdjustmentValid(false);
  };

  useEffect(() => {
    if (typeof onUpdateBidAdjustments === "function") {
      onUpdateBidAdjustments.resetBidAdjustments = resetBidAdjustments;
    }
  }, [onUpdateBidAdjustments]);

  const InfoIcon = ({ tooltip }) => (
    <span
      className="text-muted ms-1"
      style={{ cursor: "pointer" }}
      title={tooltip}
      data-bs-toggle="tooltip"
      data-bs-placement="top"
    >
      <i className="fa fa-info-circle" style={{ fontSize: "12px" }}></i>
    </span>
  )

  const placementLabels = {
    homepage: "Homepage",
    topOfSearch: "Top of search page",
    restOfSearch: "Rest of search page",
    topOfBrowse: "Top of browse page",
    restOfBrowse: "Rest of browse page",
    productPage: "Product page",
  }

  return (
    <div className="card p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <h2 className="mb-0">Bid adjustments</h2>
        </div>
      </div>
      <div className="text-muted mb-4" style={{ fontSize: "14px" }}>
        By raising your bids, you will be more likely to appear in specific placements and in front of specific
        audiences.
      </div>
      <hr />

      {/* Business Boost Banner */}
      {showBusinessBoost && (
        <div className="alert mb-4" style={{ backgroundColor: "#00897b", color: "white", border: "none" }}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="text-white mb-2">
                <strong>Boost bids for Artsyas Business placements</strong>
              </h6>
              <p className="mb-2" style={{ fontSize: "14px" }}>
                Reach more business shoppers, who convert more and buy products in larger quantities than consumers on
                the Artsyas store. Performance data is available in the Bid adjustments tab and sponsored ads reports.{" "}
                <a href="#" className="text-white" style={{ textDecoration: "underline" }}>
                  Learn about Artsyas Business
                </a>
              </p>
            </div>
            <button
              onClick={() => setShowBusinessBoost(false)}
              className="btn btn-link text-white p-0"
              style={{ fontSize: "20px", lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="d-flex align-items-center mb-3">
          <span style={{ fontSize: "16px", fontWeight: "600" }}>
            Increase your bid for specific Artsyas placements.
          </span>
          <InfoIcon tooltip="Adjust bids for different placement locations to optimize performance" />
        </div>

        {/* Placement Adjustments */}
        <div className="row">
          {Object.entries(placementLabels).map(([key, label]) => (
            <div key={key} className="col-md-6 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label mb-0" style={{ fontSize: "14px", fontWeight: "500" }}>
                  {label}<span className="text-danger ms-1 mr-2"> *</span>
                </label>
                <div style={{ width: "100px" }}>
                  <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                    <input
                      type="number"
                      inputMode="numeric"
                      step="1"
                      value={bidAdjustments[key] > 0 ? bidAdjustments[key] : ""}
                      onChange={(e) => handleBidAdjustmentChange(key, e.target.value)}
                      onBlur={() => validateFieldOnBlur(key)}
                      onKeyDown={(e) => {
                        if (e.key === "." || e.key === "e" || e.key === "+" || e.key === "-") {
                          e.preventDefault();
                        }
                      }}
                      className="form-control text-center no-spinner"
                      style={{ width: "80px" }}
                      min="1"
                      max="100"
                    />

                    <span style={{ fontSize: "14px", color: "#6c757d" }}>%</span>

                  </div>
                  {errors[key] && (
                    <div className="text-danger" style={{ fontSize: "12px" }}>
                      {errors[key]}
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
        {totalError && (
          <div className="text-danger text-end me-2" style={{ fontSize: "13px" }}>
            {totalError}
          </div>
        )}


        {/* Dynamic Bid Calculation Info */}
        <div className="mt-4 p-3 bg-light rounded">
          <small className="text-muted">
            With dynamic bids - up and down, a ₹19.37 bid could be increased up to ₹38.74 for homepage, ₹29.05 for top
            of search page, and ₹29.05 for product pages.
          </small>
        </div>
      </div>
    </div>
  )
}

export default BidAdjustmentsSection
