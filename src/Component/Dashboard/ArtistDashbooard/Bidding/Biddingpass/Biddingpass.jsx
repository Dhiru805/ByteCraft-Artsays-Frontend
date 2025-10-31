// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import getAPI from "../../../../../api/getAPI";
// import postAPI from "../../../../../api/postAPI";
// import putAPI from "../../../../../api/putAPI";
// import { toast } from "react-toastify";

// const BiddingPass = () => {
//   const navigate = useNavigate();
//   const [passes, setPasses] = useState([]);
//   const [hasActive, setHasActive] = useState(false);
//   const [selectedPass, setSelectedPass] = useState(null);
//   const userId = localStorage.getItem("userId");
//   const [upgradeMode, setUpgradeMode] = useState(false);
//   const [currentPassId, setCurrentPassId] = useState(null);
//   const [currentPassPrice, setCurrentPassPrice] = useState(null);
//   const [activeOrderId, setActiveOrderId] = useState(null);

//   const parsePrice = (value) => {
//     if (value == null) return null;
//     if (typeof value === "number") return value;
//     const num = String(value).replace(/[^0-9.]/g, "");
//     const parsed = parseFloat(num);
//     return isNaN(parsed) ? null : parsed;
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [p, o] = await Promise.all([
//           getAPI("/api/bidding/passes", {}, true),
//           getAPI(`/api/bidding/pass-orders/my?userId=${userId}`, {}, true),
//         ]);
//         const list = Array.isArray(p?.data?.data) ? p.data.data : [];
//         setPasses(list);
//         const orders = Array.isArray(o?.data?.data) ? o.data.data : [];
//         const activeOrder = orders.find((x) => x && x.active);
//         const activePassId =
//           activeOrder &&
//           (activeOrder.passId ||
//             activeOrder.pass ||
//             activeOrder.pass_id ||
//             activeOrder.passID);
//         const activePass = list.find(
//           (pp) => pp && (pp._id === activePassId || pp.id === activePassId)
//         );
//         const price = activePass ? parsePrice(activePass.pricing) : null;
//         setCurrentPassId(activePass ? activePass._id || activePass.id : null);
//         setCurrentPassPrice(price);
//         setActiveOrderId(
//           activeOrder ? activeOrder._id || activeOrder.id : null
//         );
//         setHasActive(!!activeOrder);
//       } catch {
//         setPasses([]);
//       }
//     };
//     load();
//   }, []);

//   // const purchase = async () => {
//   //   if (!selectedPass) { toast.info('Select a pass'); return; }
//   //   if (hasActive) { toast.info('You already have an active pass.'); return; }
//   //   try {
//   //     const res = await postAPI('/api/bidding/pass-orders', { passId: selectedPass, userId }, {}, true);
//   //     if (!res?.hasError) { toast.success('Pass purchased'); navigate('/artist/bidding-pass-table'); } else { toast.error(res?.message || 'Failed'); }
//   //   } catch { toast.error('Failed'); }
//   // };

//   const purchase = async () => {
//     if (!selectedPass) {
//       toast.info("Select a pass");
//       return;
//     }
//     if (hasActive && !upgradeMode) {
//       toast.info("You already have an active pass.");
//       return;
//     }
//     try {
//       const res = await postAPI(
//         "/api/bidding/pass-orders",
//         { passId: selectedPass, userId },
//         {},
//         true
//       );
//       if (!res?.hasError) {
//         toast.success("Pass purchased");
//         navigate("/artist/bidding-pass-table");
//       } else {
//         toast.error(res?.message || "Failed");
//       }
//     } catch {
//       toast.error("Failed");
//     }
//   };

//   return (
//     <div className="container-fluid mt-3">
//       <div className="block-header">
//         <div className="row">
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <h2>Choose Bidding Pass</h2>
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <span
//                   onClick={() => navigate("/artist/dashboard")}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <i className="fa fa-dashboard"></i>
//                 </span>
//               </li>
//               <li className="breadcrumb-item">Bidding Pass</li>
//             </ul>
//           </div>
//           <div className="col-lg-6 col-md-6 col-sm-12"></div>
//         </div>
//       </div>

//       <div className="row clearfix">
//         {(() => {
//           const visiblePasses =
//             upgradeMode && currentPassPrice != null
//               ? passes.filter((pp) => {
//                   const price = parsePrice(pp?.pricing);
//                   const id = pp?._id || pp?.id;
//                   return (
//                     price != null &&
//                     price > currentPassPrice &&
//                     id !== currentPassId
//                   );
//                 })
//               : passes;
//           return visiblePasses.map((pass, index) => {
//             const isActive = selectedPass === pass._id;
//             return (
//               <div
//                 key={pass._id || index}
//                 className="col-lg-4 col-md-6 col-sm-12 mb-4"
//               >
//                 <div
//                   className={`card position-relative ${
//                     isActive ? "border-primary" : ""
//                   }`}
//                   style={{ cursor: "pointer" }}
//                   onClick={() => setSelectedPass(pass._id)}
//                 >
//                   <div className="d-flex justify-content-between align-items-center px-4 pt-4 pb-2">
//                     <input
//                       type="radio"
//                       name="passPlan"
//                       checked={isActive}
//                       onChange={() => setSelectedPass(pass._id)}
//                       className="form-check-input"
//                       style={{
//                         width: "20px",
//                         height: "20px",
//                         marginLeft: "1px",
//                         cursor: "pointer",
//                       }}
//                     />
//                     <label
//                       className="form-check-label fw-bold mb-0"
//                       style={{
//                         fontSize: "2rem",
//                         marginLeft: "50px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       {pass.name}
//                     </label>
//                   </div>

//                   <ul className={`pricing body ${isActive ? "active" : ""}`}>
//                     <li>
//                       <strong>Validity:</strong> {pass.validityPeriod ? `${pass.validityPeriod} days` : "-"}
//                     </li>
//                     <li>
//                       <strong>Product Upload Limit:</strong>{" "}
//                       {pass.productUploadLimit || "-"}
//                     </li>
//                     <li>
//                       <strong>Base Price Range:</strong>{" "}
//                       {pass.basePriceRange
//                         ? (() => {
//                             const parts = String(pass.basePriceRange).split('-');
//                             if (parts.length === 2) {
//                               return `₹${parts[0].trim()} - ₹${parts[1].trim()}`;
//                             } else {
//                               return pass.basePriceRange;
//                             }
//                           })()
//                         : "-"}
//                     </li>
//                     <li>
//                       <strong>Bid Visibility:</strong>{" "}
//                       {pass.bidVisibility || "-"}
//                     </li>
//                     <li>
//                       <strong>Bidding Analytics:</strong>{" "}
//                       {pass.biddingAnalytics || "-"}
//                     </li>
//                     <li>
//                       <strong>Add-on Access:</strong>{" "}
//                       {pass.addonAccess && pass.addonAccess.length
//                         ? pass.addonAccess.join(", ")
//                         : "-"}
//                     </li>
//                     <li>
//                       <strong>Support Priority:</strong>{" "}
//                       {pass.supportPriority || "-"}
//                     </li>
//                     <li>
//                       <strong>Refund / Cancellation:</strong>{" "}
//                       {pass.refundPolicy || "-"}
//                     </li>
//                     <li>
//                       <strong>Early Renewal Bonus:</strong>{" "}
//                       {pass.earlyRenewalBonus || "-"}
//                     </li>
//                     <li>
//                       <strong>Custom Bid Time Control:</strong>{" "}
//                       {pass.customBidTimeControl || "-"}
//                     </li>
//                     <li>
//                       <strong>Exclusive Auctions Access:</strong>{" "}
//                       {pass.exclusiveAuctionsAccess ? "Yes" : "No"}
//                     </li>
//                     <li>
//                       <strong>Dashboard Features:</strong>{" "}
//                       {pass.dashboardFeatures || "-"}
//                     </li>
//                     <li className="mt-1">
//                       <div className="text-center">
//                         <strong>PRICE</strong>
//                         <div
//                           className="fw-bold text-primary"
//                           style={{ fontSize: "2rem", lineHeight: 1 }}
//                         >
//                           {pass.pricing ? `₹${pass.pricing}` : "-"}
//                         </div>
//                       </div>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             );
//           });
//         })()}
//       </div>

//       <div className="pt-2 pb-4">
//         <button
//           type="button"
//           className="btn btn-secondary"
//           disabled={hasActive || !selectedPass}
//           onClick={purchase}
//         >
//           <i className="bi-gem pr-1"></i>{" "}
//           {hasActive ? "Active pass in use" : "Purchase Pass"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BiddingPass;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAPI from "../../../../../api/getAPI";
import postAPI from "../../../../../api/postAPI";
import { toast } from "react-toastify";

const BiddingPass = () => {
  const navigate = useNavigate();
  const [passes, setPasses] = useState([]);
  const [hasActive, setHasActive] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);
  const [upgradeMode, setUpgradeMode] = useState(false);
  const [currentPassId, setCurrentPassId] = useState(null);
  const [currentPassPrice, setCurrentPassPrice] = useState(null);
  const userId = localStorage.getItem("userId");

  const parsePrice = (value) => {
    if (value == null) return null;
    if (typeof value === "number") return value;
    const num = String(value).replace(/[^0-9.]/g, "");
    const parsed = parseFloat(num);
    return isNaN(parsed) ? null : parsed;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [p, o] = await Promise.all([
          getAPI("/api/bidding/passes", {}, true),
          getAPI(`/api/bidding/pass-orders/my?userId=${userId}`, {}, true),
        ]);
        const list = Array.isArray(p?.data?.data) ? p.data.data : [];
        const sorted = list.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setPasses(sorted);

        const orders = Array.isArray(o?.data?.data) ? o.data.data : [];
        const activeOrder = orders.find((x) => x && x.active);

        const activePassId =
          activeOrder &&
          (activeOrder.passId ||
            activeOrder.pass ||
            activeOrder.pass_id ||
            activeOrder.passID);

        const activePass = list.find(
          (pp) => pp && (pp._id === activePassId || pp.id === activePassId)
        );
        const price = activePass ? parsePrice(activePass.pricing) : null;

        setCurrentPassId(activePass ? activePass._id || activePass.id : null);
        setCurrentPassPrice(price);
        setHasActive(!!activeOrder);
      } catch {
        setPasses([]);
      }
    };
    load();
  }, []);

  const purchase = async () => {
    if (!selectedPass) {
      toast.info("Select a pass");
      return;
    }
    if (hasActive && !upgradeMode) {
      toast.info("You already have an active pass.");
      return;
    }

    try {
      const res = await postAPI(
        "/api/bidding/pass-orders",
        { passId: selectedPass, userId },
        {},
        true
      );
      if (!res?.hasError) {
        toast.success("Pass purchased successfully!");
        navigate("/artist/bidding-pass-table");
      } else {
        toast.error(res?.message || "Failed to purchase pass");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const visiblePasses =
    upgradeMode && currentPassPrice != null
      ? passes.filter((pp) => {
          const price = parsePrice(pp?.pricing);
          const id = pp?._id || pp?.id;
          return (
            price != null && price > currentPassPrice && id !== currentPassId
          );
        })
      : passes;

  return (
    <div className="container-fluid mt-3">
      <div className="block-header mb-4">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Choose Bidding Pass</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span
                  onClick={() => navigate("/artist/dashboard")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item">Bidding Pass</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        {visiblePasses.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              No available passes.
            </div>
          </div>
        ) : (
          visiblePasses.map((pass, index) => {
            const isActive = selectedPass === pass._id;
            return (
              <div
                key={pass._id || index}
                className="col-lg-4 col-md-6 col-sm-12 mb-4"
              >
                <div
                  className={`card shadow-sm ${
                    isActive ? "border-primary" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    borderRadius: "10px",
                    transition: "0.2s",
                  }}
                  onClick={() => setSelectedPass(pass._id)}
                >
                  <div
                    className="d-flex justify-content-center align-items-center px-4 pt-4 pb-2"
                    style={{ gap: "10px" }}
                  >
                    <label
                      className="mb-0 text-center"
                      style={{
                        fontSize: "2rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {pass.name}
                      <input
                        type="radio"
                        name="passPlan"
                        checked={isActive}
                        onChange={() => setSelectedPass(pass._id)}
                        className="form-check-input"
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          accentColor: "#007bff",
                        }}
                      />
                    </label>
                  </div>

                  {/* <div className="card-body pt-2 pb-3">
                    <table className="table table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Validity:</strong>
                          </td>
                          <td>
                            {pass.validityPeriod
                              ? `${pass.validityPeriod} days`
                              : "-"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Product Upload Limit:</strong>
                          </td>
                          <td>{pass.productUploadLimit || "-"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Base Price Range:</strong>
                          </td>
                          <td>
                            {pass.basePriceRange
                              ? (() => {
                                  const parts = String(
                                    pass.basePriceRange
                                  ).split("-");
                                  if (parts.length === 2)
                                    return `₹${parts[0].trim()} - ₹${parts[1].trim()}`;
                                  return pass.basePriceRange;
                                })()
                              : "-"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Bid Visibility:</strong>
                          </td>
                          <td>{pass.bidVisibility || "-"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Bidding Analytics:</strong>
                          </td>
                          <td>{pass.biddingAnalytics || "-"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Add-on Access:</strong>
                          </td>
                          <td>
                            {pass.addonAccess?.length
                              ? pass.addonAccess.join(", ")
                              : "-"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Support Priority:</strong>
                          </td>
                          <td>{pass.supportPriority || "-"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Refund / Cancellation:</strong>
                          </td>
                          <td>{pass.refundPolicy || "-"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Early Renewal Bonus:</strong>
                          </td>
                          <td>{pass.earlyRenewalBonus || "-"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Custom Bid Time Control:</strong>
                          </td>
                          <td>{pass.customBidTimeControl || "-"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Exclusive Auctions:</strong>
                          </td>
                          <td>{pass.exclusiveAuctionsAccess ? "Yes" : "No"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Dashboard Features:</strong>
                          </td>
                          <td>{pass.dashboardFeatures || "-"}</td>
                        </tr>
                      </tbody>
                    </table> */}
                  <div className="card-body pt-2 pb-3">
                    <table
                      className="table table-borderless mb-0"
                      style={{
                        tableLayout: "fixed",
                        width: "100%",
                        wordWrap: "break-word",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              width: "45%",
                              fontWeight: "bold",
                              verticalAlign: "top",
                            }}
                          >
                            Validity:
                          </td>
                          <td
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {pass.validityPeriod
                              ? `${pass.validityPeriod} days`
                              : "-"}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{ fontWeight: "bold", verticalAlign: "top" }}
                          >
                            Product Upload Limit:
                          </td>
                          <td
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {pass.productUploadLimit || "-"}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{ fontWeight: "bold", verticalAlign: "top" }}
                          >
                            Base Price Range:
                          </td>
                          <td
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {pass.basePriceRange
                              ? (() => {
                                  const parts = String(
                                    pass.basePriceRange
                                  ).split("-");
                                  if (parts.length === 2)
                                    return `₹${parts[0].trim()} - ₹${parts[1].trim()}`;
                                  return pass.basePriceRange;
                                })()
                              : "-"}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{ fontWeight: "bold", verticalAlign: "top" }}
                          >
                            Bid Visibility:
                          </td>
                          <td
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {pass.bidVisibility || "-"}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{ fontWeight: "bold", verticalAlign: "top" }}
                          >
                            Bidding Analytics:
                          </td>
                          <td
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {pass.biddingAnalytics || "-"}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{ fontWeight: "bold", verticalAlign: "top" }}
                          >
                            Add-on Access:
                          </td>
                          <td
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {pass.addonAccess?.length
                              ? pass.addonAccess.join(", ")
                              : "-"}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{ fontWeight: "bold", verticalAlign: "top" }}
                          >
                            Support Priority:
                          </td>
                          <td
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {pass.supportPriority || "-"}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{ fontWeight: "bold", verticalAlign: "top" }}
                          >
                            Refund / Cancellation:
                          </td>
                          <td
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {pass.refundPolicy || "-"}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{ fontWeight: "bold", verticalAlign: "top" }}
                          >
                            Early Renewal Bonus:
                          </td>
                          <td
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {pass.earlyRenewalBonus || "-"}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{ fontWeight: "bold", verticalAlign: "top" }}
                          >
                            Custom Bid Time Control:
                          </td>
                          <td
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {pass.customBidTimeControl || "-"}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{ fontWeight: "bold", verticalAlign: "top" }}
                          >
                            Exclusive Auctions:
                          </td>
                          <td
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {pass.exclusiveAuctionsAccess ? "Yes" : "No"}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{ fontWeight: "bold", verticalAlign: "top" }}
                          >
                            Dashboard Features:
                          </td>
                          <td
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {pass.dashboardFeatures || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="text-center mt-3">
                      <div
                        className="text-primary"
                        style={{ fontSize: "1.8rem", fontWeight: "bold" }}
                      >
                        ₹{pass.pricing || "-"}
                      </div>
                      <small className="text-muted">Price</small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-2 pb-4 text-center">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!selectedPass}
          onClick={purchase}
        >
          <i className="bi-gem pr-1"></i> Confirm Purchase
        </button>
      </div>
    </div>
  );
};

export default BiddingPass;
