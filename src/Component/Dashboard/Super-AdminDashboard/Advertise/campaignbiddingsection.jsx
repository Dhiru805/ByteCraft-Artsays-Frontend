
// // import { useState } from "react"

// // const CampaignBiddingSection = ({ onNext }) => {
// //   const [biddingStrategy, setBiddingStrategy] = useState("dynamic-up-down")
// //   const [showHelp, setShowHelp] = useState(false)

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
// //   )

// //   return (
// //     <div className="card p-3 mb-4">
// //       <div className="d-flex justify-content-between align-items-center mb-3">
// //         <div className="d-flex align-items-center">
// //           <h2 className="mb-0">Campaign bidding strategy</h2>
// //         </div>
// //          <button className="btn btn-link text-primary p-0" style={{ fontSize: "14px", textDecoration: "none" }}>
// //             <i className="fa fa-info-circle me-1 mx-2"></i>
// //             How to set your bid strategy
// //           </button>
// //       </div>
// //       <hr />

// //       <div className="mb-4">
// //         <div className="d-flex justify-content-between align-items-center mb-3">


// //         </div>


// //         <div className="alert alert-info mb-4" style={{ backgroundColor: "#e3f2fd", border: "1px solid #bbdefb" }}>
// //           <div className="d-flex align-items-start">
// //             <i className="fa fa-star text-primary me-2 mt-1"></i>
// //             <div>
// //               <small>
// //                 Campaigns using "Dynamic bids - up and down" delivered 2x more sales, at a 5% lower ROAS compared to
// //                 campaigns using "Dynamic bids - down only" (Artsyas internal data, 2022).
// //               </small>
// //             </div>
// //           </div>
// //         </div>


// //         <div className="mb-3">
// //           <div className="form-check mb-3">
// //             <input
// //               type="radio"
// //               id="dynamicUpDown"
// //               name="biddingStrategy"
// //               className="form-check-input"
// //               checked={biddingStrategy === "dynamic-up-down"}
// //               onChange={() => setBiddingStrategy("dynamic-up-down")}
// //             />
// //             <label htmlFor="dynamicUpDown" className="form-check-label">
// //               <div className="d-flex align-items-center">
// //                 <span style={{ fontWeight: "600", color: "#0073aa" }}>Dynamic bids – up and down</span>
// //                 <InfoIcon tooltip="Artsyas will adjust your bids in real time based on likelihood of conversion" />
// //               </div>
// //               <div className="text-muted mt-1" style={{ fontSize: "14px" }}>
// //                 Artsyas will increase your bids (by a maximum of 100%) in real time when your ad is more likely to
// //                 convert to a sale, and lower your bids when less likely to convert to a sale.
// //               </div>
// //             </label>
// //           </div>

// //           <div className="form-check mb-3">
// //             <input
// //               type="radio"
// //               id="dynamicDownOnly"
// //               name="biddingStrategy"
// //               className="form-check-input"
// //               checked={biddingStrategy === "dynamic-down-only"}
// //               onChange={() => setBiddingStrategy("dynamic-down-only")}
// //             />
// //             <label htmlFor="dynamicDownOnly" className="form-check-label">
// //               <div className="d-flex align-items-center">
// //                 <span style={{ fontWeight: "600" }}>Dynamic bids - down only</span>
// //                 <InfoIcon tooltip="Artsyas will only lower your bids when less likely to convert" />
// //               </div>
// //               <div className="text-muted mt-1" style={{ fontSize: "14px" }}>
// //                 Artsyas will lower your bids in real time when your ad is less likely to convert to a sale. Any
// //                 campaigns created before 1 August, 2018 used this setting.
// //               </div>
// //             </label>
// //           </div>

// //           <div className="form-check mb-3">
// //             <input
// //               type="radio"
// //               id="fixedBids"
// //               name="biddingStrategy"
// //               className="form-check-input"
// //               checked={biddingStrategy === "fixed"}
// //               onChange={() => setBiddingStrategy("fixed")}
// //             />
// //             <label htmlFor="fixedBids" className="form-check-label">
// //               <div className="d-flex align-items-center">
// //                 <span style={{ fontWeight: "600" }}>Fixed bids</span>
// //                 <InfoIcon tooltip="Use your exact bid amounts without automatic adjustments" />
// //               </div>
// //               <div className="text-muted mt-1" style={{ fontSize: "14px" }}>
// //                 Set fixed bids and bid increases by placements. Artsyas will use your exact bid and any manual
// //                 adjustments you set, and will not make adjustments to your bids based on likelihood of a sale.
// //               </div>
// //             </label>
// //           </div>
// //         </div>


// //       </div>
// //     </div>
// //   )
// // }

// // export default CampaignBiddingSection

// 

// import { useState, useEffect } from "react"

// const CampaignBiddingSection = ({ initialBiddingStrategy, onUpdateBiddingStrategy }) => {
//   const [biddingStrategy, setBiddingStrategy] = useState(initialBiddingStrategy)

//   useEffect(() => {
//     onUpdateBiddingStrategy(biddingStrategy)
//   }, [biddingStrategy, onUpdateBiddingStrategy])

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

//   return (
//     <div className="card p-3 mb-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div className="d-flex align-items-center">
//           <h2 className="mb-0">Campaign bidding strategy</h2>
//         </div>
//         <button className="btn btn-link text-primary p-0" style={{ fontSize: "14px", textDecoration: "none" }}>
//           <i className="fa fa-info-circle me-1 mx-2"></i>
//           How to set your bid strategy
//         </button>
//       </div>
//       <hr />

//       <div className="mb-4">
//         <div className="d-flex justify-content-between align-items-center mb-3"></div>

//         <div className="alert alert-info mb-4" style={{ backgroundColor: "#e3f2fd", border: "1px solid #bbdefb" }}>
//           <div className="d-flex align-items-start">
//             <i className="fa fa-star text-primary me-2 mt-1"></i>
//             <div>
//               <small>
//                 Campaigns using "Dynamic bids - up and down" delivered 2x more sales, at a 5% lower ROAS compared to
//                 campaigns using "Dynamic bids - down only" (Artsyas internal data, 2022).
//               </small>
//             </div>
//           </div>
//         </div>

//         <div className="mb-3">
//           <div className="form-check mb-3">
//             <input
//               type="radio"
//               id="dynamicUpDown"
//               name="biddingStrategy"
//               className="form-check-input"
//               checked={biddingStrategy === "dynamic-up-down"}
//               onChange={() => setBiddingStrategy("dynamic-up-down")}
//             />
//             <label htmlFor="dynamicUpDown" className="form-check-label">
//               <div className="d-flex align-items-center">
//                 <span style={{ fontWeight: "600", color: "#0073aa" }}>Dynamic bids – up and down</span>
//                 <InfoIcon tooltip="Artsyas will adjust your bids in real time based on likelihood of conversion" />
//               </div>
//               <div className="text-muted mt-1" style={{ fontSize: "14px" }}>
//                 Artsyas will increase your bids (by a maximum of 100%) in real time when your ad is more likely to
//                 convert to a sale, and lower your bids when less likely to convert to a sale.
//               </div>
//             </label>
//           </div>

//           <div className="form-check mb-3">
//             <input
//               type="radio"
//               id="dynamicDownOnly"
//               name="biddingStrategy"
//               className="form-check-input"
//               checked={biddingStrategy === "dynamic-down-only"}
//               onChange={() => setBiddingStrategy("dynamic-down-only")}
//             />
//             <label htmlFor="dynamicDownOnly" className="form-check-label">
//               <div className="d-flex align-items-center">
//                 <span style={{ fontWeight: "600" }}>Dynamic bids - down only</span>
//                 <InfoIcon tooltip="Artsyas will only lower your bids when less likely to convert" />
//               </div>
//               <div className="text-muted mt-1" style={{ fontSize: "14px" }}>
//                 Artsyas will lower your bids in real time when your ad is less likely to convert to a sale. Any
//                 campaigns created before 1 August, 2018 used this setting.
//               </div>
//             </label>
//           </div>

//           <div className="form-check mb-3">
//             <input
//               type="radio"
//               id="fixedBids"
//               name="biddingStrategy"
//               className="form-check-input"
//               checked={biddingStrategy === "fixed"}
//               onChange={() => setBiddingStrategy("fixed")}
//             />
//             <label htmlFor="fixedBids" className="form-check-label">
//               <div className="d-flex align-items-center">
//                 <span style={{ fontWeight: "600" }}>Fixed bids</span>
//                 <InfoIcon tooltip="Use your exact bid amounts without automatic adjustments" />
//               </div>
//               <div className="text-muted mt-1" style={{ fontSize: "14px" }}>
//                 Set fixed bids and bid increases by placements. Artsyas will use your exact bid and any manual
//                 adjustments you set, and will not make adjustments to your bids based on likelihood of a sale.
//               </div>
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CampaignBiddingSection




import { useState, useEffect } from "react"

const CampaignBiddingSection = ({ initialBiddingStrategy, onUpdateBiddingStrategy }) => {
  const [biddingStrategy, setBiddingStrategy] = useState(initialBiddingStrategy)


useEffect(() => {
  setBiddingStrategy(initialBiddingStrategy);
}, [initialBiddingStrategy]);

  const handleChange = (newStrategy) => {
    setBiddingStrategy(newStrategy)
    onUpdateBiddingStrategy(newStrategy)
  }

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

  return (
    <div className="card p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <h2 className="mb-0">Campaign bidding strategy</h2>
        </div>
        <button className="btn btn-link text-primary p-0" style={{ fontSize: "14px", textDecoration: "none" }}>
          <i className="fa fa-info-circle me-1 mx-2"></i>
          How to set your bid strategy
        </button>
      </div>
      <hr />

      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3"></div>

        <div className="alert alert-info mb-4" style={{ backgroundColor: "#e3f2fd", border: "1px solid #bbdefb" }}>
          <div className="d-flex align-items-start">
            <i className="fa fa-star text-primary me-2 mt-1"></i>
            <div>
              <small>
                Campaigns using "Dynamic bids - up and down" delivered 2x more sales, at a 5% lower ROAS compared to
                campaigns using "Dynamic bids - down only" (Artsyas internal data, 2022).
              </small>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="form-check mb-3">
            <input
              type="radio"
              id="dynamicUpDown"
              name="biddingStrategy"
              className="form-check-input"
              checked={biddingStrategy === "dynamic-up-down"}
              onChange={() => handleChange("dynamic-up-down")} />
            <label htmlFor="dynamicUpDown" className="form-check-label">
              <div className="d-flex align-items-center">
                <span style={{ fontWeight: "600", color: "#0073aa", marginRight: "10px" }}>Dynamic bids – up and down</span>
                <InfoIcon tooltip="Artsyas will adjust your bids in real time based on likelihood of conversion" />
              </div>
              <div className="text-muted mt-1" style={{ fontSize: "14px" }}>
                Artsyas will increase your bids (by a maximum of 100%) in real time when your ad is more likely to
                convert to a sale, and lower your bids when less likely to convert to a sale.
              </div>
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              type="radio"
              id="dynamicDownOnly"
              name="biddingStrategy"
              className="form-check-input"
              checked={biddingStrategy === "dynamic-down-only"}
              onChange={() => handleChange("dynamic-down-only")}
            />
            <label htmlFor="dynamicDownOnly" className="form-check-label">
              <div className="d-flex align-items-center">
                <span style={{ fontWeight: "600", marginRight: "10px" }}>Dynamic bids - down only</span>
                <InfoIcon tooltip="Artsyas will only lower your bids when less likely to convert" />
              </div>
              <div className="text-muted mt-1" style={{ fontSize: "14px" }}>
                Artsyas will lower your bids in real time when your ad is less likely to convert to a sale. Any
                campaigns created before 1 August, 2018 used this setting.
              </div>
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              type="radio"
              id="fixedBids"
              name="biddingStrategy"
              className="form-check-input"
              checked={biddingStrategy === "fixed"}
              onChange={() => handleChange("fixed")}
            />
            <label htmlFor="fixedBids" className="form-check-label">
              <div className="d-flex align-items-center">
                <span style={{ fontWeight: "600", marginRight: "10px" }}>Fixed bids</span>
                <InfoIcon tooltip="Use your exact bid amounts without automatic adjustments" />
              </div>
              <div className="text-muted mt-1" style={{ fontSize: "14px" }}>
                Set fixed bids and bid increases by placements. Artsyas will use your exact bid and any manual
                adjustments you set, and will not make adjustments to your bids based on likelihood of a sale.
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignBiddingSection

