

// // import { useState } from "react"

// // const CampaignSettingsSection = ({ onNext }) => {
// //   const [campaignName, setCampaignName] = useState("")
// //   const [startDate, setStartDate] = useState("2025-03-17")
// //   const [endDate, setEndDate] = useState("")
// //   const [hasEndDate, setHasEndDate] = useState(false)
// //   const [country, setCountry] = useState("India")
// //   const [dailyBudget, setDailyBudget] = useState("")
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

// //   const handleNext = () => {
// //     if (campaignName && dailyBudget && Number.parseFloat(dailyBudget) >= 300) {
// //       onNext()
// //     }
// //   }

// //   const isFormValid = () => {
// //     return campaignName.trim() !== "" && dailyBudget !== "" && Number.parseFloat(dailyBudget) >= 300
// //   }

// //   return (
// //     <div className="card p-3 mb-4">
// //       <div className="d-flex justify-content-between align-items-center mb-3">
// //         <div className="d-flex align-items-center">
// //           <h2 className="mb-0">Campaign</h2>
// //         </div>
// //         <button className="btn btn-link text-primary p-0" style={{ fontSize: "14px", textDecoration: "none" }}>
// //           <i className="fa fa-info-circle me-1"></i>
// //           How to set up your campaign
// //         </button>
// //       </div>
// //       <hr />

// //       <div className="row">
// //         <div className="col-md-8">
// //           {/* Campaign Name */}
// //           <div className="mb-4">
// //             <label className="form-label d-flex align-items-center">
// //               <span style={{ fontWeight: "600" }}>Campaign name</span>
// //               <InfoIcon tooltip="Choose a descriptive name for your campaign" />
// //             </label>
// //             <input
// //               type="text"
// //               value={campaignName}
// //               onChange={(e) => setCampaignName(e.target.value)}
// //               className="form-control"
// //               placeholder="c type cable"
// //               style={{ maxWidth: "400px" }}
// //             />
// //           </div>

// //           {/* Start and End Date */}
// //           <div className="row mb-4">
// //             <div className="col-md-6">
// //               <label className="form-label d-flex align-items-center">
// //                 <span style={{ fontWeight: "600" }}>Start</span>
// //                 <InfoIcon tooltip="When your campaign will begin running" />
// //               </label>
// //               <div className="position-relative">
// //                 <input
// //                   type="date"
// //                   value={startDate}
// //                   onChange={(e) => setStartDate(e.target.value)}
// //                   className="form-control"
// //                   style={{ paddingRight: "40px" }}
// //                 />
// //                 <i
// //                   className="fa fa-calendar position-absolute"
// //                   style={{
// //                     right: "12px",
// //                     top: "50%",
// //                     transform: "translateY(-50%)",
// //                     color: "#6c757d",
// //                     pointerEvents: "none",
// //                   }}
// //                 ></i>
// //               </div>
// //             </div>
// //             <div className="col-md-6">
// //               <label className="form-label d-flex align-items-center">
// //                 <span style={{ fontWeight: "600" }}>End</span>
// //                 <InfoIcon tooltip="When your campaign will stop running" />
// //               </label>
// //               <div className="position-relative">
// //                 {!hasEndDate ? (
// //                   <div
// //                     className="form-control d-flex align-items-center justify-content-between"
// //                     style={{
// //                       backgroundColor: "#e3f2fd",
// //                       border: "2px solid #2196f3",
// //                       cursor: "pointer",
// //                       color: "#1976d2",
// //                     }}
// //                     onClick={() => setHasEndDate(true)}
// //                   >
// //                     <span>No end date</span>
// //                     <i className="fa fa-calendar" style={{ color: "#1976d2" }}></i>
// //                   </div>
// //                 ) : (
// //                   <div className="d-flex align-items-center" style={{ gap: "8px" }}>
// //                     <input
// //                       type="date"
// //                       value={endDate}
// //                       onChange={(e) => setEndDate(e.target.value)}
// //                       className="form-control"
// //                       style={{ paddingRight: "40px" }}
// //                     />
// //                     <button
// //                       onClick={() => {
// //                         setHasEndDate(false)
// //                         setEndDate("")
// //                       }}
// //                       className="btn btn-link text-primary p-0"
// //                       style={{ fontSize: "12px" }}
// //                     >
// //                       Remove
// //                     </button>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Country */}
// //           <div className="mb-4">
// //             <label className="form-label d-flex align-items-center">
// //               <span style={{ fontWeight: "600" }}>Country</span>
// //               <InfoIcon tooltip="The country where your ads will be shown" />
// //             </label>
// //             <select
// //               value={country}
// //               onChange={(e) => setCountry(e.target.value)}
// //               className="form-select"
// //               style={{ maxWidth: "200px" }}
// //             >
// //               <option value="India">India</option>
// //               <option value="United States">United States</option>
// //               <option value="United Kingdom">United Kingdom</option>
// //               <option value="Canada">Canada</option>
// //               <option value="Australia">Australia</option>
// //             </select>
// //           </div>

// //           {/* Daily Budget */}
// //           <div className="mb-4">
// //             <label className="form-label d-flex align-items-center">
// //               <span style={{ fontWeight: "600" }}>Daily budget</span>
// //               <InfoIcon tooltip="The maximum amount you want to spend per day" />
// //             </label>
// //             <div className="position-relative" style={{ maxWidth: "200px" }}>
// //               <span
// //                 style={{
// //                   position: "absolute",
// //                   left: "12px",
// //                   top: "50%",
// //                   transform: "translateY(-50%)",
// //                   color: "#6c757d",
// //                   zIndex: 1,
// //                 }}
// //               >
// //                 ₹
// //               </span>
// //               <input
// //                 type="number"
// //                 value={dailyBudget}
// //                 onChange={(e) => setDailyBudget(e.target.value)}
// //                 className={`form-control ${dailyBudget && Number.parseFloat(dailyBudget) < 300 ? "border-danger" : ""}`}
// //                 style={{ paddingLeft: "28px" }}
// //                 placeholder="300.00"
// //                 min="300"
// //                 step="0.01"
// //               />
// //             </div>
// //             <div className="mt-2">
// //               <small className="text-muted">Most advertisers start with a daily budget of at least ₹300.00.</small>
// //               {dailyBudget && Number.parseFloat(dailyBudget) < 300 && (
// //                 <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
// //                   <i className="fa fa-exclamation-triangle me-1"></i>
// //                   Daily budget should be at least ₹300.00
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Campaign Type Info */}
// //           <div className="alert alert-info" style={{ backgroundColor: "#e3f2fd", border: "1px solid #bbdefb" }}>
// //             <div className="d-flex align-items-start">
// //               <i className="fa fa-info-circle text-primary me-2 mt-1"></i>
// //               <div>
// //                 <small>
// //                   <strong>Sponsored Products campaigns</strong> help promote individual product listings on Artsyas.
// //                   Your ads will appear in search results and on product pages to help customers discover your products.
// //                 </small>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default CampaignSettingsSection


// 

// import { useState, useEffect } from "react"

// const CampaignSettingsSection = ({
//   initialCampaignName = "",
//   initialStartDate = "2025-03-17",
//   initialEndDate = "",
//   initialHasEndDate = false,
//   initialCountry = "India",
//   initialDailyBudget = "",
//   onUpdateCampaignSettings,
// }) => {
//   const [campaignName, setCampaignName] = useState(initialCampaignName)
//   const [startDate, setStartDate] = useState(initialStartDate)
//   const [endDate, setEndDate] = useState(initialEndDate)
//   const [hasEndDate, setHasEndDate] = useState(initialHasEndDate)
//   const [country, setCountry] = useState(initialCountry)
//   const [dailyBudget, setDailyBudget] = useState(initialDailyBudget)
//   const [showHelp, setShowHelp] = useState(false)

//   useEffect(() => {
//     onUpdateCampaignSettings({
//       campaignName,
//       startDate,
//       endDate: hasEndDate ? endDate : null,
//       hasEndDate,
//       country,
//       dailyBudget: Number.parseFloat(dailyBudget),
//     })
//   }, [campaignName, startDate, endDate, hasEndDate, country, dailyBudget, onUpdateCampaignSettings])

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

//   const isFormValid = () => {
//     return campaignName.trim() !== "" && dailyBudget !== "" && Number.parseFloat(dailyBudget) >= 300
//   }

//   return (
//     <div className="card p-3 mb-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div className="d-flex align-items-center">
//           <h2 className="mb-0">Campaign</h2>
//         </div>
//         <button className="btn btn-link text-primary p-0" style={{ fontSize: "14px", textDecoration: "none" }}>
//           <i className="fa fa-info-circle me-1"></i>
//           How to set up your campaign
//         </button>
//       </div>
//       <hr />

//       <div className="row">
//         <div className="col-md-8">
//           {/* Campaign Name */}
//           <div className="mb-4">
//             <label className="form-label d-flex align-items-center">
//               <span style={{ fontWeight: "600" }}>Campaign name</span>
//               <InfoIcon tooltip="Choose a descriptive name for your campaign" />
//             </label>
//             <input
//               type="text"
//               value={campaignName}
//               onChange={(e) => setCampaignName(e.target.value)}
//               className="form-control"
//               placeholder="c type cable"
//               style={{ maxWidth: "400px" }}
//             />
//           </div>

//           {/* Start and End Date */}
//           <div className="row mb-4">
//             <div className="col-md-6">
//               <label className="form-label d-flex align-items-center">
//                 <span style={{ fontWeight: "600" }}>Start</span>
//                 <InfoIcon tooltip="When your campaign will begin running" />
//               </label>
//               <div className="position-relative">
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="form-control"
//                   style={{ paddingRight: "40px" }}
//                 />
//                 <i
//                   className="fa fa-calendar position-absolute"
//                   style={{
//                     right: "12px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     color: "#6c757d",
//                     pointerEvents: "none",
//                   }}
//                 ></i>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <label className="form-label d-flex align-items-center">
//                 <span style={{ fontWeight: "600" }}>End</span>
//                 <InfoIcon tooltip="When your campaign will stop running" />
//               </label>
//               <div className="position-relative">
//                 {!hasEndDate ? (
//                   <div
//                     className="form-control d-flex align-items-center justify-content-between"
//                     style={{
//                       backgroundColor: "#e3f2fd",
//                       border: "2px solid #2196f3",
//                       cursor: "pointer",
//                       color: "#1976d2",
//                     }}
//                     onClick={() => setHasEndDate(true)}
//                   >
//                     <span>No end date</span>
//                     <i className="fa fa-calendar" style={{ color: "#1976d2" }}></i>
//                   </div>
//                 ) : (
//                   <div className="d-flex align-items-center" style={{ gap: "8px" }}>
//                     <input
//                       type="date"
//                       value={endDate}
//                       onChange={(e) => setEndDate(e.target.value)}
//                       className="form-control"
//                       style={{ paddingRight: "40px" }}
//                     />
//                     <button
//                       onClick={() => {
//                         setHasEndDate(false)
//                         setEndDate("")
//                       }}
//                       className="btn btn-link text-primary p-0"
//                       style={{ fontSize: "12px" }}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Country */}
//           <div className="mb-4">
//             <label className="form-label d-flex align-items-center">
//               <span style={{ fontWeight: "600" }}>Country</span>
//               <InfoIcon tooltip="The country where your ads will be shown" />
//             </label>
//             <select
//               value={country}
//               onChange={(e) => setCountry(e.target.value)}
//               className="form-select"
//               style={{ maxWidth: "200px" }}
//             >
//               <option value="India">India</option>
//               <option value="United States">United States</option>
//               <option value="United Kingdom">United Kingdom</option>
//               <option value="Canada">Canada</option>
//               <option value="Australia">Australia</option>
//             </select>
//           </div>

//           {/* Daily Budget */}
//           <div className="mb-4">
//             <label className="form-label d-flex align-items-center">
//               <span style={{ fontWeight: "600" }}>Daily budget</span>
//               <InfoIcon tooltip="The maximum amount you want to spend per day" />
//             </label>
//             <div className="position-relative" style={{ maxWidth: "200px" }}>
//               <span
//                 style={{
//                   position: "absolute",
//                   left: "12px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   color: "#6c757d",
//                   zIndex: 1,
//                 }}
//               >
//                 ₹
//               </span>
//               <input
//                 type="number"
//                 value={dailyBudget}
//                 onChange={(e) => setDailyBudget(e.target.value)}
//                 className={`form-control ${dailyBudget && Number.parseFloat(dailyBudget) < 300 ? "border-danger" : ""}`}
//                 style={{ paddingLeft: "28px" }}
//                 placeholder="300.00"
//                 min="300"
//                 step="0.01"
//               />
//             </div>
//             <div className="mt-2">
//               <small className="text-muted">Most advertisers start with a daily budget of at least ₹300.00.</small>
//               {dailyBudget && Number.parseFloat(dailyBudget) < 300 && (
//                 <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
//                   <i className="fa fa-exclamation-triangle me-1"></i>
//                   Daily budget should be at least ₹300.00
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Campaign Type Info */}
//           <div className="alert alert-info" style={{ backgroundColor: "#e3f2fd", border: "1px solid #bbdefb" }}>
//             <div className="d-flex align-items-start">
//               <i className="fa fa-info-circle text-primary me-2 mt-1"></i>
//               <div>
//                 <small>
//                   <strong>Sponsored Products campaigns</strong> help promote individual product listings on Artsyas.
//                   Your ads will appear in search results and on product pages to help customers discover your products.
//                 </small>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CampaignSettingsSection




import { useState, useEffect, useRef } from "react"

const CampaignSettingsSection = ({
  initialCampaignName = "",
  initialStartDate = "2025-03-17",
  initialEndDate = "",
  initialHasEndDate = false,
  initialCountry = "India",
  initialDailyBudget = "",
  onUpdateCampaignSettings,
}) => {
  const [campaignName, setCampaignName] = useState(initialCampaignName)
  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialEndDate)
  const [hasEndDate, setHasEndDate] = useState(initialHasEndDate)
  const [country, setCountry] = useState(initialCountry)
  const [dailyBudget, setDailyBudget] = useState(initialDailyBudget)
  const [showHelp, setShowHelp] = useState(false)
  useEffect(() => {
    setCampaignName(initialCampaignName);
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setHasEndDate(initialHasEndDate);
    setCountry(initialCountry);
    setDailyBudget(initialDailyBudget);
  }, [initialCampaignName, initialStartDate, initialEndDate, initialHasEndDate, initialCountry, initialDailyBudget]);

  useEffect(() => {
    onUpdateCampaignSettings({
      campaignName,
      startDate,
      endDate: hasEndDate ? endDate : null,
      hasEndDate,
      country,
      dailyBudget: Number.parseFloat(dailyBudget),
    })
  }, [campaignName, startDate, endDate, hasEndDate, country, dailyBudget])

  const InfoIcon = ({ tooltip }) => (
    <span
      className="text-muted ms-1"
      style={{ cursor: "pointer", marginLeft: "5px" }}
      title={tooltip}
      data-bs-toggle="tooltip"
      data-bs-placement="top"
    >
      <i className="fa fa-info-circle" style={{ fontSize: "12px" }}></i>
    </span>
  )

  const isFormValid = () => {
    return campaignName.trim() !== "" && dailyBudget !== "" && Number.parseFloat(dailyBudget) >= 300
  }

  return (
    <div className="card p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <h2 className="mb-0">Campaign</h2>
        </div>
        <button className="btn btn-link text-primary p-0" style={{ fontSize: "14px", textDecoration: "none" }}>
          <i className="fa fa-info-circle me-1"></i>
          How to set up your campaign
        </button>
      </div>
      <hr />

      <div className="row">
        <div className="col-md-8">
          {/* Campaign Name */}
          <div className="mb-4">
            <label className="form-label d-flex align-items-center ">
              <span style={{ fontWeight: "600" }}>Campaign name <span className="text-danger ms-1 ">*</span></span>
              <InfoIcon tooltip="Choose a descriptive name for your campaign" />
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="form-control"
              placeholder="c type cable"
              style={{ maxWidth: "400px" }}
            />
          </div>

          {/* Start and End Date */}
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label d-flex align-items-center">
                <span style={{ fontWeight: "600" }}>Start <span className="text-danger ms-1 ">*</span></span>
                <InfoIcon tooltip="When your campaign will begin running" />
              </label>
              <div className="position-relative">
                <input
                  type="date"
                  value={startDate}
                  //  ref={startDateRef} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-control"
                  style={{ paddingRight: "40px" }}
                />
                {/* <i
                  className="fa fa-calendar position-absolute"
                  style={{
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6c757d",
                    pointerEvents: "none",
                  }}
                  onClick={() => startDateRef.current?.showPicker()}
                ></i> */}
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label d-flex align-items-center">
                <span style={{ fontWeight: "600" }}>End</span>
                <InfoIcon tooltip="When your campaign will stop running" />
              </label>
              <div className="position-relative">
                {!hasEndDate ? (
                  <div
                    className="form-control d-flex align-items-center justify-content-between"
                    style={{
                      backgroundColor: "#e3f2fd",
                      border: "2px solid #2196f3",
                      cursor: "pointer",
                      color: "#1976d2",
                    }}
                    onClick={() => setHasEndDate(true)}
                  >
                    <span>No end date</span>
                    {/* <i className="fa fa-calendar" style={{ color: "#1976d2" }}></i> */}
                  </div>
                ) : (
                  <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="form-control"
                      style={{ paddingRight: "40px" }}
                    />
                    <button
                      onClick={() => {
                        setHasEndDate(false)
                        setEndDate("")
                      }}
                      className="btn btn-link text-primary p-0"
                      style={{ fontSize: "12px" }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Country */}
          <div className="mb-4">
            <label className="form-label d-flex align-items-center">
              <span style={{ fontWeight: "600" }}>Country <span className="text-danger ms-1 ">*</span></span>
              <InfoIcon tooltip="The country where your ads will be shown" />
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="form-select"
              style={{ maxWidth: "200px" }}
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          {/* Daily Budget */}
          <div className="mb-4">
            <label className="form-label d-flex align-items-center">
              <span style={{ fontWeight: "600" }}>Daily budget <span className="text-danger ms-1 ">*</span></span>
              <InfoIcon tooltip="The maximum amount you want to spend per day" />
            </label>
            <div className="position-relative" style={{ maxWidth: "200px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                  zIndex: 1,
                }}
              >
                ₹
              </span>
              <input
                type="number"
                inputMode="numeric"
                pattern="\d*"
                value={dailyBudget}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === "" || /^\d+$/.test(value)) {
                    setDailyBudget(value)
                  }
                }}
                onBlur={() => {
                  const budget = parseInt(dailyBudget)
                  if (isNaN(budget) || budget < 300) {
                    setDailyBudget("300")
                  }
                }}
                onKeyDown={(e) => {
                  const invalidKeys = ["e", "E", "+", "-", "."];
                  if (invalidKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className={`form-control ${dailyBudget && Number.parseFloat(dailyBudget) < 300 ? "border-danger" : ""}`}
                style={{ paddingLeft: "28px" }}
                // placeholder="300"
                min="300"
                step="1"
              />
            </div>
            <div className="mt-2">
              <small className="text-muted">Most advertisers start with a daily budget of at least ₹300.00.</small>
              {dailyBudget && Number.parseFloat(dailyBudget) < 300 && (
                <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
                  <i className="fa fa-exclamation-triangle me-1"></i>
                  Daily budget should be at least ₹300.00
                </div>
              )}
            </div>
          </div>

          {/* Campaign Type Info */}
          <div className="alert alert-info" style={{ backgroundColor: "#e3f2fd", border: "1px solid #bbdefb" }}>
            <div className="d-flex align-items-start">
              <i className="fa fa-info-circle text-primary me-2 mt-1"></i>
              <div>
                <small>
                  <strong>Sponsored Products campaigns</strong> help promote individual product listings on Artsyas.
                  Your ads will appear in search results and on product pages to help customers discover your products.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignSettingsSection
