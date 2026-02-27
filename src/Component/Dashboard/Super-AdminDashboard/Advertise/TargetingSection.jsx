

// // import { useState, useEffect } from "react"
// // import getAPI from "../../../../api/getAPI"

// // const TargetingSection = ({ selectedProducts }) => {
// //   const [targetingType, setTargetingType] = useState("automatic")
// //   const [showAutomaticTargeting, setShowAutomaticTargeting] = useState(true)
// //   const [automaticBidType, setAutomaticBidType] = useState("default")
// //   const [defaultBid, setDefaultBid] = useState("0.00")
// //   const [showBidPricingHelp, setShowBidPricingHelp] = useState(false)
// //   const [showTargetingHelp, setShowTargetingHelp] = useState(false)
// //   const [validationErrors, setValidationErrors] = useState({})

// //   // Manual targeting states
// //   const [manualTargetingType, setManualTargetingType] = useState("keyword")
// //   const [selectedKeywords, setSelectedKeywords] = useState([])
// //   const [keywordFilters, setKeywordFilters] = useState({
// //     broad: true,
// //     phrase: true,
// //     exact: true,
// //   })
// //   const [keywordSortBy, setKeywordSortBy] = useState("orders")
// //   const [suggestedKeywords, setSuggestedKeywords] = useState([])
// //   const [loadingKeywords, setLoadingKeywords] = useState(false)

// //   const [bidRanges, setBidRanges] = useState({
// //     default: { min: 0, max: 0 },
// //     closeMatch: { min: 0, max: 0 },
// //     looseMatch: { min: 0, max: 0 },
// //     substitutes: { min: 0, max: 0 },
// //     complements: { min: 0, max: 0 },
// //   })

// //   const [targetingGroups, setTargetingGroups] = useState({
// //     closeMatch: { enabled: true, bid: "0.00" },
// //     looseMatch: { enabled: true, bid: "0.00" },
// //     substitutes: { enabled: true, bid: "0.00" },
// //     complements: { enabled: true, bid: "0.00" },
// //   })

// //   const [loadingBids, setLoadingBids] = useState(true)


// //   useEffect(() => {
// //     const fetchTargetingSettings = async () => {
// //       if (selectedProducts && selectedProducts.length > 0) {
// //         const subCategoryIds = [...new Set(selectedProducts.map((product) => product.subCategory))]
// //         try {
// //           setLoadingBids(true)
// //           const result = await getAPI(`/api/targeting-settings/average/${subCategoryIds}`, true)
// //           if (result && result.data && result.data.data) {
// //             const { defaultBid: fetchedDefaultBid, targetingGroups: fetchedGroups } = result.data.data
// //             setDefaultBid(fetchedDefaultBid.bid.toFixed(2))
// //             setBidRanges({
// //               default: {
// //                 min: fetchedDefaultBid.range.min,
// //                 max: fetchedDefaultBid.range.max,
// //               },
// //               closeMatch: {
// //                 min: fetchedGroups.closeMatch.range.minRange,
// //                 max: fetchedGroups.closeMatch.range.maxRange,
// //               },
// //               looseMatch: {
// //                 min: fetchedGroups.looseMatch.range.minRange,
// //                 max: fetchedGroups.looseMatch.range.maxRange,
// //               },
// //               substitutes: {
// //                 min: fetchedGroups.substitutes.range.minRange,
// //                 max: fetchedGroups.substitutes.range.maxRange,
// //               },
// //               complements: {
// //                 min: fetchedGroups.complements.range.minRange,
// //                 max: fetchedGroups.complements.range.maxRange,
// //               },
// //             })
// //             setTargetingGroups({
// //               closeMatch: {
// //                 enabled: true,
// //                 bid: fetchedGroups.closeMatch.bid.toFixed(2),
// //               },
// //               looseMatch: {
// //                 enabled: true,
// //                 bid: fetchedGroups.looseMatch.bid.toFixed(2),
// //               },
// //               substitutes: {
// //                 enabled: true,
// //                 bid: fetchedGroups.substitutes.bid.toFixed(2),
// //               },
// //               complements: {
// //                 enabled: true,
// //                 bid: fetchedGroups.complements.bid.toFixed(2),
// //               },
// //             })
// //           }
// //         } catch (error) {
// //           console.error("Error fetching targeting settings:", error)
// //         } finally {
// //           setLoadingBids(false)
// //         }
// //       } else {
// //         setLoadingBids(false)
// //       }
// //     }

// //     fetchTargetingSettings()
// //   }, [selectedProducts])

// //   useEffect(() => {
// //     const fetchKeywordTargeting = async () => {
// //       if (selectedProducts && selectedProducts.length > 0) {
// //         const subCategoryIds = [...new Set(selectedProducts.map((p) => p.subCategory))]
// //         try {
// //           setLoadingKeywords(true)
// //           const result = await getAPI(`/api/Keyword-targeting/average/${subCategoryIds}`, true)
// //           if (result?.data?.data?.keywordTargeting) {
// //             const keywordData = result.data.data.keywordTargeting

// //             // Transform API data to match our component structure
// //             const transformedKeywords = []
// //             Object.entries(keywordData).forEach(([keyword, matchTypes]) => {
// //               Object.entries(matchTypes).forEach(([matchType, data]) => {
// //                 transformedKeywords.push({
// //                   keyword: keyword,
// //                   matchType: matchType.charAt(0).toUpperCase() + matchType.slice(1),
// //                   suggestedBid: data.bid,
// //                   impressions: 0, 
// //                 })
// //               })
// //             })

// //             setSuggestedKeywords(transformedKeywords)
// //           }
// //         } catch (error) {
// //           console.error("Error fetching keyword targeting:", error)
// //         } finally {
// //           setLoadingKeywords(false)
// //         }
// //       } else {
// //         setLoadingKeywords(false)
// //       }
// //     }

// //     if (targetingType === "manual") {
// //       fetchKeywordTargeting()
// //     }
// //   }, [selectedProducts, targetingType, manualTargetingType])

// //   const handleTargetingChange = (type) => {
// //     setTargetingType(type)
// //     setShowAutomaticTargeting(type === "automatic")
// //   }

// //   const validateBid = (value, type) => {
// //     const numValue = Number.parseFloat(value)
// //     const range = bidRanges[type]
// //     if (isNaN(numValue)) {
// //       return "Please enter a valid number"
// //     }
// //     if (numValue < range.min) {
// //       return `Bid should be at least ₹${range.min}`
// //     }
// //     if (numValue > range.max) {
// //       return `Bid should not exceed ₹${range.max}`
// //     }
// //     return ""
// //   }

// //   const handleDefaultBidChange = (value) => {
// //     setDefaultBid(value)
// //     const error = validateBid(value, "default")
// //     setValidationErrors((prev) => ({ ...prev, default: error }))
// //   }

// //   const updateTargetingGroup = (group, field, value) => {
// //     setTargetingGroups((prev) => ({
// //       ...prev,
// //       [group]: {
// //         ...prev[group],
// //         [field]: value,
// //       },
// //     }))
// //     if (field === "bid") {
// //       const error = validateBid(value, group)
// //       setValidationErrors((prev) => ({ ...prev, [group]: error }))
// //     }
// //   }

// //   const handleKeywordFilterChange = (filterType) => {
// //     setKeywordFilters((prev) => ({
// //       ...prev,
// //       [filterType]: !prev[filterType],
// //     }))
// //   }

// //   const addKeyword = (keyword) => {
// //     const keywordWithBid = {
// //       ...keyword,
// //       bid: keyword.suggestedBid.toFixed(2),
// //       id: `${keyword.keyword}-${keyword.matchType}-${Date.now()}`,
// //     }
// //     setSelectedKeywords((prev) => [...prev, keywordWithBid])
// //   }

// //   const removeKeyword = (keywordId) => {
// //     setSelectedKeywords((prev) => prev.filter((k) => k.id !== keywordId))
// //   }

// //   const removeAllKeywords = () => {
// //     setSelectedKeywords([])
// //   }

// //   const getFilteredKeywords = () => {
// //     return suggestedKeywords
// //       .filter((keyword) => {
// //         const matchType = keyword.matchType.toLowerCase()
// //         return keywordFilters[matchType]
// //       })
// //       .sort((a, b) => {
// //         if (keywordSortBy === "orders") {
// //           return b.impressions - a.impressions
// //         }
// //         return a.keyword.localeCompare(b.keyword)
// //       })
// //   }

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

// //   const BidPricingPopover = () => (
// //     <div className="position-relative">
// //       {showBidPricingHelp && (
// //         <div
// //           className="position-fixed bg-white border rounded shadow-lg p-4"
// //           style={{
// //             right: "16px",
// //             top: "50%",
// //             transform: "translateY(-50%)",
// //             width: "480px",
// //             zIndex: 1000,
// //             maxHeight: "80vh",
// //             overflowY: "auto",
// //           }}
// //         >
// //           <div className="d-flex justify-content-between align-items-center mb-3">
// //             <div className="d-flex align-items-center" style={{ gap: "8px" }}>
// //               <i className="fa fa-chart-line text-primary"></i>
// //               <h6 className="font-weight-bold text-dark mb-0">How to Set Bid Pricing</h6>
// //             </div>
// //             <button
// //               onClick={() => setShowBidPricingHelp(false)}
// //               className="btn btn-link text-muted p-0"
// //               style={{ fontSize: "18px" }}
// //             >
// //               ×
// //             </button>
// //           </div>
// //           <div className="mb-4">
// //             <h6 className="font-weight-bold mb-3">
// //               <i className="fa fa-bullseye text-primary me-2"></i>
// //               Understanding Bid Types
// //             </h6>
// //             <div className="p-3 bg-primary bg-opacity-10 rounded mb-3">
// //               <h6 className="text-primary font-weight-bold mb-2">Default Bid</h6>
// //               <p className="small mb-0 text-muted">
// //                 Sets a single bid amount for all targeting. Simple but less control over performance.
// //               </p>
// //             </div>
// //             <div className="p-3 bg-success bg-opacity-10 rounded">
// //               <h6 className="text-success font-weight-bold mb-2">Targeting Group Bids</h6>
// //               <p className="small mb-0 text-muted">
// //                 Allows different bids for each match type. More control and better optimization potential.
// //               </p>
// //             </div>
// //           </div>
// //           <div className="alert alert-warning">
// //             <div className="d-flex align-items-start" style={{ gap: "8px" }}>
// //               <i className="fa fa-exclamation-triangle text-warning mt-1"></i>
// //               <div>
// //                 <strong>Important:</strong> Bids outside suggested ranges may result in poor performance or limited
// //                 visibility. The system will prevent you from setting bids beyond recommended limits.
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )

// //   const TargetingStrategyPopover = () => (
// //     <div className="position-relative">
// //       <button
// //         onClick={() => setShowTargetingHelp(!showTargetingHelp)}
// //         className="btn btn-link text-primary p-0 d-flex align-items-center"
// //         style={{ fontSize: "14px", gap: "4px", textDecoration: "none" }}
// //       >
// //         <i className="fa fa-info-circle"></i>
// //         How to choose a targeting strategy
// //       </button>
// //       {showTargetingHelp && (
// //         <div
// //           className="position-absolute bg-white border rounded shadow-lg p-4"
// //           style={{
// //             right: "0",
// //             top: "32px",
// //             width: "400px",
// //             zIndex: 10,
// //           }}
// //         >
// //           <div className="d-flex justify-content-between align-items-center mb-3">
// //             <div className="d-flex align-items-center" style={{ gap: "8px" }}>
// //               <i className="fa fa-bullseye text-primary"></i>
// //               <h6 className="font-weight-bold text-dark mb-0">How to Choose a Targeting Strategy</h6>
// //             </div>
// //             <button
// //               onClick={() => setShowTargetingHelp(false)}
// //               className="btn btn-link text-muted p-0"
// //               style={{ fontSize: "18px" }}
// //             >
// //               ×
// //             </button>
// //           </div>
// //           <div className="mb-4">
// //             <div className="p-3 bg-primary bg-opacity-10 rounded mb-3">
// //               <h6 className="text-primary font-weight-bold d-flex align-items-center mb-2">
// //                 <i className="fa fa-bolt me-2"></i>
// //                 Automatic Targeting
// //               </h6>
// //               <p className="small mb-2">
// //                 <strong>Best for:</strong> New campaigns, testing, or when you want Artsyas to find relevant traffic for
// //                 you.
// //               </p>
// //               <ul className="small mb-0 ps-3">
// //                 <li>Artsyas automatically targets relevant keywords and products</li>
// //                 <li>Great for discovering new opportunities</li>
// //                 <li>Less time-intensive to set up</li>
// //                 <li>Good for broad reach and discovery</li>
// //               </ul>
// //             </div>
// //             <div className="p-3 bg-success bg-opacity-10 rounded">
// //               <h6 className="text-success font-weight-bold d-flex align-items-center mb-2">
// //                 <i className="fa fa-bullseye me-2"></i>
// //                 Manual Targeting
// //               </h6>
// //               <p className="small mb-2">
// //                 <strong>Best for:</strong> Experienced advertisers who want full control over their targeting.
// //               </p>
// //               <ul className="small mb-0 ps-3">
// //                 <li>You choose specific keywords and products to target</li>
// //                 <li>More precise control over your advertising</li>
// //                 <li>Better for optimized campaigns with known performers</li>
// //                 <li>Requires more research and management</li>
// //               </ul>
// //             </div>
// //           </div>
// //           <div className="border-top pt-3">
// //             <h6 className="font-weight-bold mb-2">Recommendation</h6>
// //             <p className="small text-muted mb-0">
// //               Start with <strong>Automatic Targeting</strong> to gather data about what works, then use those insights
// //               to create more targeted Manual campaigns. Many successful advertisers run both types simultaneously.
// //             </p>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )

// //   const addAllKeywords = () => {
// //     const filteredKeywords = getFilteredKeywords()
// //     const keywordsToAdd = filteredKeywords.filter(
// //       (keyword) => !selectedKeywords.some((k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType),
// //     )

// //     const keywordsWithBids = keywordsToAdd.map((keyword) => ({
// //       ...keyword,
// //       bid: keyword.suggestedBid.toFixed(2),
// //       id: `${keyword.keyword}-${keyword.matchType}-${Date.now()}-${Math.random()}`,
// //     }))

// //     setSelectedKeywords((prev) => [...prev, ...keywordsWithBids])
// //   }

// //   return (
// //     <>
// //       <div className="card p-3 mb-4">
// //         <div className="d-flex justify-content-between align-items-center mb-3">
// //           <div className="d-flex align-items-center">
// //             <h2 className="mb-0">Targeting</h2>
// //           </div>
// //           <TargetingStrategyPopover />
// //         </div>
// //         <hr />
// //         {loadingBids ? (
// //           <div className="text-center py-5">
// //             <div className="spinner-border text-primary" role="status">
// //               <span className="sr-only">Loading...</span>
// //             </div>
// //             <p className="text-muted mt-2">Loading bid settings...</p>
// //           </div>
// //         ) : (
// //           <div>
// //             <div className="form-check mb-2">
// //               <input
// //                 type="radio"
// //                 id="automaticTargeting"
// //                 name="targeting"
// //                 className="form-check-input"
// //                 checked={targetingType === "automatic"}
// //                 onChange={() => handleTargetingChange("automatic")}
// //               />
// //               <label htmlFor="automaticTargeting" className="form-check-label">
// //                 <div className="d-flex align-items-center">
// //                   <span style={{ fontWeight: "600", color: "#0073aa" }}>Automatic targeting</span>
// //                   <InfoIcon tooltip="Artsyas automatically finds relevant keywords and products for your ads" />
// //                 </div>
// //                 <br />
// //                 <span className="text-muted" style={{ fontSize: "14px" }}>
// //                   Artsyas will target keywords and products that are similar to the product in your ad.
// //                 </span>
// //               </label>
// //             </div>
// //             <div className="form-check">
// //               <input
// //                 type="radio"
// //                 id="manualTargeting"
// //                 name="targeting"
// //                 className="form-check-input"
// //                 checked={targetingType === "manual"}
// //                 onChange={() => handleTargetingChange("manual")}
// //               />
// //               <label htmlFor="manualTargeting" className="form-check-label">
// //                 <div className="d-flex align-items-center">
// //                   <span style={{ fontWeight: "600" }}>Manual targeting</span>
// //                   <InfoIcon tooltip="You manually select specific keywords and products to target" />
// //                 </div>
// //                 <br />
// //                 <span className="text-muted" style={{ fontSize: "14px" }}>
// //                   Choose keywords or products to target shopper searches and set custom bids.
// //                 </span>
// //               </label>
// //             </div>

// //             {/* Automatic Targeting Section */}
// //             {showAutomaticTargeting && (
// //               <div className="mt-3">
// //                 <div className="d-flex align-items-center mb-3">
// //                   <h3 className="mb-0">Automatic Targeting</h3>
// //                   <button
// //                     onClick={() => setShowBidPricingHelp(!showBidPricingHelp)}
// //                     className="btn btn-link text-primary p-0 ms-auto"
// //                     style={{ fontSize: "14px", textDecoration: "none" }}
// //                   >
// //                     <i className="fa fa-info-circle me-1"></i>
// //                     How to set bid pricing
// //                   </button>
// //                 </div>
// //                 <hr />
// //                 <div className="form-check mb-2">
// //                   <input
// //                     type="radio"
// //                     id="setDefaultBid"
// //                     name="automaticTargeting"
// //                     className="form-check-input"
// //                     checked={automaticBidType === "default"}
// //                     onChange={() => setAutomaticBidType("default")}
// //                   />
// //                   <label htmlFor="setDefaultBid" className="form-check-label">
// //                     <div className="d-flex align-items-center">
// //                       <span style={{ fontWeight: "600", color: "#0073aa" }}>Set default bid</span>
// //                       <InfoIcon tooltip="Use one bid amount for all targeting types. Simple setup but less optimization control." />
// //                     </div>
// //                     <br />
// //                     {automaticBidType === "default" && (
// //                       <div className="mt-2 ms-4">
// //                         <div className="d-flex justify-content-between align-items-start" style={{ maxWidth: "600px" }}>
// //                           <div className="text-muted" style={{ fontSize: "14px" }}>
// //                             <div>Suggested bid for regular days</div>
// //                             <div className="fw-bold text-dark">₹{defaultBid}</div>
// //                             <div className="text-muted">
// //                               (₹{bidRanges.default.min}-₹{bidRanges.default.max})
// //                             </div>
// //                           </div>
// //                           <div className="ms-5">
// //                             <label className="form-label text-muted" style={{ fontSize: "14px" }}>
// //                               Default bid
// //                             </label>
// //                             <div style={{ position: "relative", width: "150px" }}>
// //                               <span
// //                                 style={{
// //                                   position: "absolute",
// //                                   left: "12px",
// //                                   top: "50%",
// //                                   transform: "translateY(-50%)",
// //                                   color: "#6c757d",
// //                                   zIndex: 1,
// //                                 }}
// //                               >
// //                                 ₹
// //                               </span>
// //                               <input
// //                                 type="text"
// //                                 value={defaultBid}
// //                                 onChange={(e) => handleDefaultBidChange(e.target.value)}
// //                                 className={`form-control ${validationErrors.default ? "border-danger" : ""}`}
// //                                 style={{ paddingLeft: "28px", width: "150px" }}
// //                                 placeholder="0.00"
// //                               />
// //                             </div>
// //                             {validationErrors.default && (
// //                               <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
// //                                 <i className="fa fa-exclamation-triangle me-1"></i>
// //                                 {validationErrors.default}
// //                               </div>
// //                             )}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </label>
// //                 </div>
// //                 <div className="form-check mb-3">
// //                   <input
// //                     type="radio"
// //                     id="setBidsByTargetingGroup"
// //                     name="automaticTargeting"
// //                     className="form-check-input"
// //                     checked={automaticBidType === "targeting"}
// //                     onChange={() => setAutomaticBidType("targeting")}
// //                   />
// //                   <label htmlFor="setBidsByTargetingGroup" className="form-check-label">
// //                     <div className="d-flex align-items-center">
// //                       <span style={{ fontWeight: "600" }}>Set bids by targeting group</span>
// //                       <InfoIcon tooltip="Set different bids for each match type. Provides better control and optimization opportunities." />
// //                     </div>
// //                   </label>
// //                 </div>
// //                 {automaticBidType === "targeting" && (
// //                   <div className="mt-3 ms-4">
// //                     <div className="d-flex justify-content-between align-items-center mb-3">
// //                       <div className="d-flex align-items-center">
// //                         <span style={{ fontSize: "14px", fontWeight: "600", color: "#6c757d" }}>TARGETING GROUPS</span>
// //                         <InfoIcon tooltip="Different match types help you reach customers at various stages of their shopping journey" />
// //                       </div>
// //                       <span style={{ fontSize: "14px", color: "#6c757d" }}>Suggested bid for regular days</span>
// //                       <div className="d-flex align-items-center">
// //                         <span style={{ fontSize: "14px", fontWeight: "600", color: "#6c757d" }}>BID</span>
// //                         <InfoIcon tooltip="Your maximum bid amount for each targeting group. Stay within suggested ranges for best results." />
// //                       </div>
// //                     </div>
// //                     {Object.entries(targetingGroups).map(([groupKey, group]) => (
// //                       <div
// //                         key={groupKey}
// //                         className="d-flex justify-content-between align-items-center py-2 border-bottom"
// //                       >
// //                         <div className="d-flex align-items-center">
// //                           <div className="form-check">
// //                             <input
// //                               type="checkbox"
// //                               id={`${groupKey}Check`}
// //                               className="form-check-input"
// //                               checked={group.enabled}
// //                               onChange={(e) => updateTargetingGroup(groupKey, "enabled", e.target.checked)}
// //                             />
// //                           </div>
// //                           <div className="d-flex align-items-center ms-2">
// //                             <span style={{ fontWeight: "500" }}>
// //                               {groupKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
// //                             </span>
// //                             <InfoIcon tooltip={`Targeting for ${groupKey} match type`} />
// //                           </div>
// //                         </div>
// //                         <div style={{ fontSize: "14px" }}>
// //                           <div style={{ fontWeight: "500" }}>₹{group.bid}</div>
// //                           <div className="text-muted">
// //                             (₹{bidRanges[groupKey]?.min}-₹{bidRanges[groupKey]?.max})
// //                           </div>
// //                         </div>
// //                         <div>
// //                           <div style={{ position: "relative", width: "80px" }}>
// //                             <span
// //                               style={{
// //                                 position: "absolute",
// //                                 left: "8px",
// //                                 top: "50%",
// //                                 transform: "translateY(-50%)",
// //                                 color: "#6c757d",
// //                                 zIndex: 1,
// //                               }}
// //                             >
// //                               ₹
// //                             </span>
// //                             <input
// //                               value={group.bid}
// //                               onChange={(e) => updateTargetingGroup(groupKey, "bid", e.target.value)}
// //                               className={`form-control ${validationErrors[groupKey] ? "border-danger" : ""}`}
// //                               style={{ paddingLeft: "24px", width: "80px", fontSize: "12px" }}
// //                               disabled={!group.enabled}
// //                             />
// //                           </div>
// //                           {validationErrors[groupKey] && (
// //                             <div className="text-danger mt-1" style={{ fontSize: "10px", width: "80px" }}>
// //                               {validationErrors[groupKey]}
// //                             </div>
// //                           )}
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //                 <BidPricingPopover />
// //               </div>
// //             )}

// //             {/* Manual Targeting Section */}
// //             {targetingType === "manual" && (
// //               <div className="mt-3">
// //                 <div className="d-flex align-items-center mb-3">
// //                   <h3 className="mb-0">Manual Targeting</h3>
// //                          <button
// //                             className="btn btn-link text-primary p-0 ms-2"
// //                             style={{ fontSize: "14px", textDecoration: "none" }}
// //                           >
// //                             <i className="fa fa-info-circle me-1"></i>
// //                             How to choose keywords for targeting
// //                           </button>
// //                 </div>
// //                 <hr />

// //                 <div className="row">
// //                   <div className="col-md-7">
// //                     <div className="border rounded p-3">
// //                       <div className="d-flex justify-content-between align-items-center mb-3">
// //                         <div className="d-flex align-items-center">


// //                         </div>
// //                       </div>



// //                       {/* Filters and Controls */}
// //                       <div className="mb-3">
// //                         <div className="row align-items-center">
// //                           <div className="col-md-6">
// //                             <div className="d-flex align-items-center" style={{ gap: "12px" }}>
// //                               <span style={{ fontSize: "14px", fontWeight: "600" }}>Filter by</span>
// //                               <InfoIcon tooltip="Filter keywords by match type" />
// //                               <div className="d-flex" style={{ gap: "8px" }}>
// //                                 <div className="form-check form-check-inline">
// //                                   <input
// //                                     type="checkbox"
// //                                     id="broadFilter"
// //                                     className="form-check-input"
// //                                     checked={keywordFilters.broad}
// //                                     onChange={() => handleKeywordFilterChange("broad")}
// //                                   />
// //                                   <label
// //                                     htmlFor="broadFilter"
// //                                     className="form-check-label"
// //                                     style={{ fontSize: "14px" }}
// //                                   >
// //                                     Broad
// //                                   </label>
// //                                 </div>
// //                                 <div className="form-check form-check-inline">
// //                                   <input
// //                                     type="checkbox"
// //                                     id="phraseFilter"
// //                                     className="form-check-input"
// //                                     checked={keywordFilters.phrase}
// //                                     onChange={() => handleKeywordFilterChange("phrase")}
// //                                   />
// //                                   <label
// //                                     htmlFor="phraseFilter"
// //                                     className="form-check-label"
// //                                     style={{ fontSize: "14px" }}
// //                                   >
// //                                     Phrase
// //                                   </label>
// //                                 </div>
// //                                 <div className="form-check form-check-inline">
// //                                   <input
// //                                     type="checkbox"
// //                                     id="exactFilter"
// //                                     className="form-check-input"
// //                                     checked={keywordFilters.exact}
// //                                     onChange={() => handleKeywordFilterChange("exact")}
// //                                   />
// //                                   <label
// //                                     htmlFor="exactFilter"
// //                                     className="form-check-label"
// //                                     style={{ fontSize: "14px" }}
// //                                   >
// //                                     Exact
// //                                   </label>
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           </div>
// //                           <div className="col-md-6">
// //                             <div className="d-flex align-items-center justify-content-end" style={{ gap: "8px" }}>
// //                               <span style={{ fontSize: "14px", fontWeight: "600" }}>Sort By</span>
// //                               <InfoIcon tooltip="Sort keywords by different criteria" />
// //                               <select
// //                                 value={keywordSortBy}
// //                                 onChange={(e) => setKeywordSortBy(e.target.value)}
// //                                 className="form-select form-select-sm"
// //                                 style={{ width: "120px" }}
// //                               >
// //                                 <option value="orders">Orders</option>
// //                                 <option value="alphabetical">A-Z</option>
// //                                 <option value="bid">Bid Amount</option>
// //                               </select>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>

// //                       {/* Keywords Table Header */}
// //                       <div
// //                         className="row mb-2 text-muted border-bottom pb-2"
// //                         style={{ fontSize: "12px", fontWeight: "600" }}
// //                       >
// //                         <div className="col-4">KEYWORD</div>
// //                         <div className="col-2">MATCH TYPE</div>
// //                         <div className="col-2">
// //                           SUGG. BID
// //                           <InfoIcon tooltip="Suggested bid amount" />
// //                         </div>
// //                         <div className="col-2">
// //                           <button
// //                             onClick={addAllKeywords}
// //                             className="btn btn-link text-primary p-0"
// //                             style={{ fontSize: "12px", fontWeight: "600" }}
// //                             disabled={getFilteredKeywords().every((keyword) =>
// //                               selectedKeywords.some(
// //                                 (k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType,
// //                               ),
// //                             )}
// //                           >
// //                             {getFilteredKeywords().every((keyword) =>
// //                               selectedKeywords.some(
// //                                 (k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType,
// //                               ),
// //                             )
// //                               ? "All Added"
// //                               : "Add All"}
// //                           </button>
// //                         </div>
// //                       </div>

// //                       {/* Keywords Table */}
// //                       {loadingKeywords ? (
// //                         <div className="text-center py-4">
// //                           <div className="spinner-border spinner-border-sm text-primary" role="status">
// //                             <span className="sr-only">Loading...</span>
// //                           </div>
// //                           <p className="text-muted mt-2 mb-0">Loading suggested keywords...</p>
// //                         </div>
// //                       ) : (
// //                         <div style={{ maxHeight: "400px", overflowY: "auto" }}>
// //                           {/* Group keywords by keyword name */}
// //                           {Object.entries(
// //                             getFilteredKeywords().reduce((acc, keyword) => {
// //                               if (!acc[keyword.keyword]) {
// //                                 acc[keyword.keyword] = []
// //                               }
// //                               acc[keyword.keyword].push(keyword)
// //                               return acc
// //                             }, {}),
// //                           ).map(([keywordName, matchTypes]) => (
// //                             <div key={keywordName} className="mb-2">
// //                               {matchTypes.map((keyword, index) => (
// //                                 <div
// //                                   key={`${keyword.keyword}-${keyword.matchType}-${index}`}
// //                                   className="row align-items-center py-1"
// //                                   style={{
// //                                     backgroundColor: index === 0 ? "#f8f9fa" : "transparent",
// //                                     borderLeft: index === 0 ? "3px solid #dee2e6" : "3px solid transparent",
// //                                   }}
// //                                 >
// //                                   <div className="col-4">
// //                                     {index === 0 ? (
// //                                       <div>
// //                                         <div style={{ fontWeight: "500", fontSize: "14px" }}>{keyword.keyword}</div>
// //                                       </div>
// //                                     ) : (
// //                                       <div style={{ paddingLeft: "20px" }}></div>
// //                                     )}
// //                                   </div>
// //                                   <div className="col-2">
// //                                     <small>{keyword.matchType}</small>
// //                                   </div>
// //                                   <div className="col-2">
// //                                     <small>₹{keyword.suggestedBid.toFixed(2)}</small>
// //                                   </div>
// //                                   <div className="col-2">
// //                                     <button
// //                                       onClick={() => addKeyword(keyword)}
// //                                       className="btn btn-link text-primary p-0"
// //                                       style={{ fontSize: "14px" }}
// //                                       disabled={selectedKeywords.some(
// //                                         (k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType,
// //                                       )}
// //                                     >
// //                                       {selectedKeywords.some(
// //                                         (k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType,
// //                                       )
// //                                         ? "Added"
// //                                         : "Add"}
// //                                     </button>
// //                                   </div>
// //                                 </div>
// //                               ))}
// //                             </div>
// //                           ))}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>

// //                   {/* Right Side - Selected Keywords */}
// //                   <div className="col-md-5">
// //                     <div className="border rounded p-3">
// //                       <div className="d-flex justify-content-between align-items-center mb-3">
// //                         <h5 className="mb-0">{selectedKeywords.length} added</h5>
// //                         {selectedKeywords.length > 0 && (
// //                           <button
// //                             onClick={removeAllKeywords}
// //                             className="btn btn-link text-danger p-0"
// //                             style={{ fontSize: "14px" }}
// //                           >
// //                             Remove all
// //                           </button>
// //                         )}
// //                       </div>

// //                       {selectedKeywords.length === 0 ? (
// //                         <div className="text-center py-4 text-muted">
// //                           <i className="fa fa-search mb-2" style={{ fontSize: "24px" }}></i>
// //                           <p>No keywords added yet</p>
// //                           <small>Add keywords from the suggestions on the left</small>
// //                         </div>
// //                       ) : (
// //                         <div>
// //                           {/* Header for added keywords */}
// //                           <div
// //                             className="row mb-2 text-muted border-bottom pb-2"
// //                             style={{ fontSize: "12px", fontWeight: "600" }}
// //                           >
// //                             <div className="col-4">KEYWORD</div>
// //                             <div className="col-2">
// //                               MATCH TYPE
// //                               <InfoIcon tooltip="Match type for targeting" />
// //                             </div>
// //                             <div className="col-3">
// //                               SUGG. BID
// //                               <InfoIcon tooltip="Suggested bid amount" />
// //                               <br />
// //                               <button className="btn btn-link text-primary p-0" style={{ fontSize: "10px" }}>
// //                                 Apply all
// //                               </button>
// //                             </div>
// //                             <div className="col-2">
// //                               BID
// //                               <InfoIcon tooltip="Your bid amount" />
// //                             </div>
// //                             <div className="col-1"></div>
// //                           </div>

// //                           {/* Group selected keywords by keyword name */}
// //                           {Object.entries(
// //                             selectedKeywords.reduce((acc, keyword) => {
// //                               if (!acc[keyword.keyword]) {
// //                                 acc[keyword.keyword] = []
// //                               }
// //                               acc[keyword.keyword].push(keyword)
// //                               return acc
// //                             }, {}),
// //                           ).map(([keywordName, matchTypes]) => (
// //                             <div key={keywordName} className="mb-2">
// //                               {matchTypes.map((keyword, index) => (
// //                                 <div
// //                                   key={keyword.id}
// //                                   className="row align-items-center py-1"
// //                                   style={{
// //                                     backgroundColor: index === 0 ? "#f8f9fa" : "transparent",
// //                                     borderLeft: index === 0 ? "3px solid #dee2e6" : "3px solid transparent",
// //                                   }}
// //                                 >
// //                                   <div className="col-4">
// //                                     {index === 0 ? (
// //                                       <div>
// //                                         <div style={{ fontWeight: "500", fontSize: "14px" }}>{keyword.keyword}</div>
// //                                       </div>
// //                                     ) : (
// //                                       <div style={{ paddingLeft: "20px" }}>{/* Empty div for spacing */}</div>
// //                                     )}
// //                                   </div>
// //                                   <div className="col-2">
// //                                     <small className="text-muted">{keyword.matchType}</small>
// //                                   </div>
// //                                   <div className="col-3">
// //                                     <small>₹{keyword.suggestedBid.toFixed(2)}</small>
// //                                   </div>
// //                                   <div className="col-2">
// //                                     <small>₹{keyword.bid}</small>
// //                                   </div>
// //                                   <div className="col-1">
// //                                     <button
// //                                       onClick={() => removeKeyword(keyword.id)}
// //                                       className="btn btn-link text-danger p-0"
// //                                       style={{ fontSize: "10px" }}
// //                                       title="Remove"
// //                                     >
// //                                       ×
// //                                     </button>
// //                                   </div>
// //                                 </div>
// //                               ))}
// //                             </div>
// //                           ))}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </>
// //   )
// // }

// // export default TargetingSection


// 

// import { useState, useEffect } from "react"
// import getAPI from "../../../../api/getAPI"

// const TargetingSection = ({
//   selectedProducts,
//   targetingType: initialTargetingType,
//   automaticBidType: initialAutomaticBidType,
//   defaultBid: initialDefaultBid,
//   targetingGroups: initialTargetingGroups,
//   selectedKeywords: initialSelectedKeywords,
//   onUpdateTargetingSettings,
// }) => {
//   const [targetingType, setTargetingType] = useState(initialTargetingType || "automatic")
//   const [showAutomaticTargeting, setShowAutomaticTargeting] = useState(targetingType === "automatic")
//   const [automaticBidType, setAutomaticBidType] = useState(initialAutomaticBidType || "default")
//   const [defaultBid, setDefaultBid] = useState(initialDefaultBid || "0.00")
//   const [showBidPricingHelp, setShowBidPricingHelp] = useState(false)
//   const [showTargetingHelp, setShowTargetingHelp] = useState(false)
//   const [validationErrors, setValidationErrors] = useState({})

//   // Manual targeting states
//   const [manualTargetingType, setManualTargetingType] = useState("keyword")
//   const [selectedKeywords, setSelectedKeywords] = useState(initialSelectedKeywords || [])
//   const [keywordFilters, setKeywordFilters] = useState({
//     broad: true,
//     phrase: true,
//     exact: true,
//   })
//   const [keywordSortBy, setKeywordSortBy] = useState("orders")
//   const [suggestedKeywords, setSuggestedKeywords] = useState([])
//   const [loadingKeywords, setLoadingKeywords] = useState(false)

//   const [bidRanges, setBidRanges] = useState({
//     default: { min: 0, max: 0 },
//     closeMatch: { min: 0, max: 0 },
//     looseMatch: { min: 0, max: 0 },
//     substitutes: { min: 0, max: 0 },
//     complements: { min: 0, max: 0 },
//   })

//   const [targetingGroups, setTargetingGroups] = useState(
//     initialTargetingGroups || {
//       closeMatch: { enabled: true, bid: "0.00" },
//       looseMatch: { enabled: true, bid: "0.00" },
//       substitutes: { enabled: true, bid: "0.00" },
//       complements: { enabled: true, bid: "0.00" },
//     },
//   )

//   const [loadingBids, setLoadingBids] = useState(true)

//   useEffect(() => {
//     setShowAutomaticTargeting(targetingType === "automatic")
//   }, [targetingType])

//   useEffect(() => {
//     if (onUpdateTargetingSettings) {
//       onUpdateTargetingSettings({
//         targetingType,
//         automaticBidType,
//         defaultBid: Number(defaultBid),
//         targetingGroups: {
//           closeMatch: { ...targetingGroups.closeMatch, bid: Number(targetingGroups.closeMatch.bid) },
//           looseMatch: { ...targetingGroups.looseMatch, bid: Number(targetingGroups.looseMatch.bid) },
//           substitutes: { ...targetingGroups.substitutes, bid: Number(targetingGroups.substitutes.bid) },
//           complements: { ...targetingGroups.complements, bid: Number(targetingGroups.complements.bid) },
//         },
//         selectedKeywords: selectedKeywords.map((keyword) => ({ ...keyword, bid: Number(keyword.bid) })),
//       })
//     }
//   }, [targetingType, automaticBidType, defaultBid, targetingGroups, selectedKeywords, onUpdateTargetingSettings])

//   useEffect(() => {
//     const fetchTargetingSettings = async () => {
//       if (selectedProducts && selectedProducts.length > 0) {
//         const subCategoryIds = [...new Set(selectedProducts.map((product) => product.subCategory))]
//         try {
//           setLoadingBids(true)
//           const result = await getAPI(`/api/targeting-settings/average/${subCategoryIds}`, true)
//           if (result && result.data && result.data.data) {
//             const { defaultBid: fetchedDefaultBid, targetingGroups: fetchedGroups } = result.data.data
//             setDefaultBid(fetchedDefaultBid.bid.toFixed(2))
//             setBidRanges({
//               default: {
//                 min: fetchedDefaultBid.range.min,
//                 max: fetchedDefaultBid.range.max,
//               },
//               closeMatch: {
//                 min: fetchedGroups.closeMatch.range.minRange,
//                 max: fetchedGroups.closeMatch.range.maxRange,
//               },
//               looseMatch: {
//                 min: fetchedGroups.looseMatch.range.minRange,
//                 max: fetchedGroups.looseMatch.range.maxRange,
//               },
//               substitutes: {
//                 min: fetchedGroups.substitutes.range.minRange,
//                 max: fetchedGroups.substitutes.range.maxRange,
//               },
//               complements: {
//                 min: fetchedGroups.complements.range.minRange,
//                 max: fetchedGroups.complements.range.maxRange,
//               },
//             })
//             setTargetingGroups({
//               closeMatch: {
//                 enabled: true,
//                 bid: fetchedGroups.closeMatch.bid.toFixed(2),
//               },
//               looseMatch: {
//                 enabled: true,
//                 bid: fetchedGroups.looseMatch.bid.toFixed(2),
//               },
//               substitutes: {
//                 enabled: true,
//                 bid: fetchedGroups.substitutes.bid.toFixed(2),
//               },
//               complements: {
//                 enabled: true,
//                 bid: fetchedGroups.complements.bid.toFixed(2),
//               },
//             })
//           }
//         } catch (error) {
//           console.error("Error fetching targeting settings:", error)
//         } finally {
//           setLoadingBids(false)
//         }
//       } else {
//         setLoadingBids(false)
//       }
//     }

//     fetchTargetingSettings()
//   }, [selectedProducts])

//   useEffect(() => {
//     const fetchKeywordTargeting = async () => {
//       if (selectedProducts && selectedProducts.length > 0) {
//         const subCategoryIds = [...new Set(selectedProducts.map((p) => p.subCategory))]
//         try {
//           setLoadingKeywords(true)
//           const result = await getAPI(`/api/Keyword-targeting/average/${subCategoryIds}`, true)
//           if (result?.data?.data?.keywordTargeting) {
//             const keywordData = result.data.data.keywordTargeting

//             // Transform API data to match our component structure
//             const transformedKeywords = []
//             Object.entries(keywordData).forEach(([keyword, matchTypes]) => {
//               Object.entries(matchTypes).forEach(([matchType, data]) => {
//                 transformedKeywords.push({
//                   keyword: keyword,
//                   matchType: matchType.charAt(0).toUpperCase() + matchType.slice(1),
//                   suggestedBid: data.bid,
//                   impressions: 0,
//                 })
//               })
//             })

//             setSuggestedKeywords(transformedKeywords)
//           }
//         } catch (error) {
//           console.error("Error fetching keyword targeting:", error)
//         } finally {
//           setLoadingKeywords(false)
//         }
//       } else {
//         setLoadingKeywords(false)
//       }
//     }

//     if (targetingType === "manual") {
//       fetchKeywordTargeting()
//     }
//   }, [selectedProducts, targetingType, manualTargetingType])

//   const handleTargetingChange = (type) => {
//     setTargetingType(type)
//     setShowAutomaticTargeting(type === "automatic")
//   }

//   const validateBid = (value, type) => {
//     const numValue = Number.parseFloat(value)
//     const range = bidRanges[type]
//     if (isNaN(numValue)) {
//       return "Please enter a valid number"
//     }
//     if (numValue < range.min) {
//       return `Bid should be at least ₹${range.min}`
//     }
//     if (numValue > range.max) {
//       return `Bid should not exceed ₹${range.max}`
//     }
//     return ""
//   }

//   const handleDefaultBidChange = (value) => {
//     setDefaultBid(value)
//     const error = validateBid(value, "default")
//     setValidationErrors((prev) => ({ ...prev, default: error }))
//   }

//   const updateTargetingGroup = (group, field, value) => {
//     setTargetingGroups((prev) => ({
//       ...prev,
//       [group]: {
//         ...prev[group],
//         [field]: value,
//       },
//     }))
//     if (field === "bid") {
//       const error = validateBid(value, group)
//       setValidationErrors((prev) => ({ ...prev, [group]: error }))
//     }
//   }

//   const handleKeywordFilterChange = (filterType) => {
//     setKeywordFilters((prev) => ({
//       ...prev,
//       [filterType]: !prev[filterType],
//     }))
//   }

//   const addKeyword = (keyword) => {
//     const keywordWithBid = {
//       ...keyword,
//       bid: keyword.suggestedBid.toFixed(2),
//       id: `${keyword.keyword}-${keyword.matchType}-${Date.now()}`,
//     }
//     setSelectedKeywords((prev) => [...prev, keywordWithBid])
//   }

//   const removeKeyword = (keywordId) => {
//     setSelectedKeywords((prev) => prev.filter((k) => k.id !== keywordId))
//   }

//   const removeAllKeywords = () => {
//     setSelectedKeywords([])
//   }

//   const getFilteredKeywords = () => {
//     return suggestedKeywords
//       .filter((keyword) => {
//         const matchType = keyword.matchType.toLowerCase()
//         return keywordFilters[matchType]
//       })
//       .sort((a, b) => {
//         if (keywordSortBy === "orders") {
//           return b.impressions - a.impressions
//         }
//         return a.keyword.localeCompare(b.keyword)
//       })
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

//   const BidPricingPopover = () => (
//     <div className="position-relative">
//       {showBidPricingHelp && (
//         <div
//           className="position-fixed bg-white border rounded shadow-lg p-4"
//           style={{
//             right: "16px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             width: "480px",
//             zIndex: 1000,
//             maxHeight: "80vh",
//             overflowY: "auto",
//           }}
//         >
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <div className="d-flex align-items-center" style={{ gap: "8px" }}>
//               <i className="fa fa-chart-line text-primary"></i>
//               <h6 className="font-weight-bold text-dark mb-0">How to Set Bid Pricing</h6>
//             </div>
//             <button
//               onClick={() => setShowBidPricingHelp(false)}
//               className="btn btn-link text-muted p-0"
//               style={{ fontSize: "18px" }}
//             >
//               ×
//             </button>
//           </div>
//           <div className="mb-4">
//             <h6 className="font-weight-bold mb-3">
//               <i className="fa fa-bullseye text-primary me-2"></i>
//               Understanding Bid Types
//             </h6>
//             <div className="p-3 bg-primary bg-opacity-10 rounded mb-3">
//               <h6 className="text-primary font-weight-bold mb-2">Default Bid</h6>
//               <p className="small mb-0 text-muted">
//                 Sets a single bid amount for all targeting. Simple but less control over performance.
//               </p>
//             </div>
//             <div className="p-3 bg-success bg-opacity-10 rounded">
//               <h6 className="text-success font-weight-bold mb-2">Targeting Group Bids</h6>
//               <p className="small mb-0 text-muted">
//                 Allows different bids for each match type. More control and better optimization potential.
//               </p>
//             </div>
//           </div>
//           <div className="alert alert-warning">
//             <div className="d-flex align-items-start" style={{ gap: "8px" }}>
//               <i className="fa fa-exclamation-triangle text-warning mt-1"></i>
//               <div>
//                 <strong>Important:</strong> Bids outside suggested ranges may result in poor performance or limited
//                 visibility. The system will prevent you from setting bids beyond recommended limits.
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )

//   const TargetingStrategyPopover = () => (
//     <div className="position-relative">
//       <button
//         onClick={() => setShowTargetingHelp(!showTargetingHelp)}
//         className="btn btn-link text-primary p-0 d-flex align-items-center"
//         style={{ fontSize: "14px", gap: "4px", textDecoration: "none" }}
//       >
//         <i className="fa fa-info-circle"></i>
//         How to choose a targeting strategy
//       </button>
//       {showTargetingHelp && (
//         <div
//           className="position-absolute bg-white border rounded shadow-lg p-4"
//           style={{
//             right: "0",
//             top: "32px",
//             width: "400px",
//             zIndex: 10,
//           }}
//         >
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <div className="d-flex align-items-center" style={{ gap: "8px" }}>
//               <i className="fa fa-bullseye text-primary"></i>
//               <h6 className="font-weight-bold text-dark mb-0">How to Choose a Targeting Strategy</h6>
//             </div>
//             <button
//               onClick={() => setShowTargetingHelp(false)}
//               className="btn btn-link text-muted p-0"
//               style={{ fontSize: "18px" }}
//             >
//               ×
//             </button>
//           </div>
//           <div className="mb-4">
//             <div className="p-3 bg-primary bg-opacity-10 rounded mb-3">
//               <h6 className="text-primary font-weight-bold d-flex align-items-center mb-2">
//                 <i className="fa fa-bolt me-2"></i>
//                 Automatic Targeting
//               </h6>
//               <p className="small mb-2">
//                 <strong>Best for:</strong> New campaigns, testing, or when you want Artsyas to find relevant traffic for
//                 you.
//               </p>
//               <ul className="small mb-0 ps-3">
//                 <li>Artsyas automatically targets relevant keywords and products</li>
//                 <li>Great for discovering new opportunities</li>
//                 <li>Less time-intensive to set up</li>
//                 <li>Good for broad reach and discovery</li>
//               </ul>
//             </div>
//             <div className="p-3 bg-success bg-opacity-10 rounded">
//               <h6 className="text-success font-weight-bold d-flex align-items-center mb-2">
//                 <i className="fa fa-bullseye me-2"></i>
//                 Manual Targeting
//               </h6>
//               <p className="small mb-2">
//                 <strong>Best for:</strong> Experienced advertisers who want full control over their targeting.
//               </p>
//               <ul className="small mb-0 ps-3">
//                 <li>You choose specific keywords and products to target</li>
//                 <li>More precise control over your advertising</li>
//                 <li>Better for optimized campaigns with known performers</li>
//                 <li>Requires more research and management</li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-top pt-3">
//             <h6 className="font-weight-bold mb-2">Recommendation</h6>
//             <p className="small text-muted mb-0">
//               Start with <strong>Automatic Targeting</strong> to gather data about what works, then use those insights
//               to create more targeted Manual campaigns. Many successful advertisers run both types simultaneously.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   )

//   const addAllKeywords = () => {
//     const filteredKeywords = getFilteredKeywords()
//     const keywordsToAdd = filteredKeywords.filter(
//       (keyword) => !selectedKeywords.some((k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType),
//     )

//     const keywordsWithBids = keywordsToAdd.map((keyword) => ({
//       ...keyword,
//       bid: keyword.suggestedBid.toFixed(2),
//       id: `${keyword.keyword}-${keyword.matchType}-${Date.now()}-${Math.random()}`,
//     }))

//     setSelectedKeywords((prev) => [...prev, ...keywordsWithBids])
//   }

//   return (
//     <>
//       <div className="card p-3 mb-4">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <div className="d-flex align-items-center">
//             <h2 className="mb-0">Targeting</h2>
//           </div>
//           <TargetingStrategyPopover />
//         </div>
//         <hr />
//         {loadingBids ? (
//           <div className="text-center py-5">
//             <div className="spinner-border text-primary" role="status">
//               <span className="sr-only">Loading...</span>
//             </div>
//             <p className="text-muted mt-2">Loading bid settings...</p>
//           </div>
//         ) : (
//           <div>
//             <div className="form-check mb-2">
//               <input
//                 type="radio"
//                 id="automaticTargeting"
//                 name="targeting"
//                 className="form-check-input"
//                 checked={targetingType === "automatic"}
//                 onChange={() => handleTargetingChange("automatic")}
//               />
//               <label htmlFor="automaticTargeting" className="form-check-label">
//                 <div className="d-flex align-items-center">
//                   <span style={{ fontWeight: "600", color: "#0073aa" }}>Automatic targeting</span>
//                   <InfoIcon tooltip="Artsyas automatically finds relevant keywords and products for your ads" />
//                 </div>
//                 <br />
//                 <span className="text-muted" style={{ fontSize: "14px" }}>
//                   Artsyas will target keywords and products that are similar to the product in your ad.
//                 </span>
//               </label>
//             </div>
//             <div className="form-check">
//               <input
//                 type="radio"
//                 id="manualTargeting"
//                 name="targeting"
//                 className="form-check-input"
//                 checked={targetingType === "manual"}
//                 onChange={() => handleTargetingChange("manual")}
//               />
//               <label htmlFor="manualTargeting" className="form-check-label">
//                 <div className="d-flex align-items-center">
//                   <span style={{ fontWeight: "600" }}>Manual targeting</span>
//                   <InfoIcon tooltip="You manually select specific keywords and products to target" />
//                 </div>
//                 <br />
//                 <span className="text-muted" style={{ fontSize: "14px" }}>
//                   Choose keywords or products to target shopper searches and set custom bids.
//                 </span>
//               </label>
//             </div>

//             {/* Automatic Targeting Section */}
//             {showAutomaticTargeting && (
//               <div className="mt-3">
//                 <div className="d-flex align-items-center mb-3">
//                   <h3 className="mb-0">Automatic Targeting</h3>
//                   <button
//                     onClick={() => setShowBidPricingHelp(!showBidPricingHelp)}
//                     className="btn btn-link text-primary p-0 ms-auto"
//                     style={{ fontSize: "14px", textDecoration: "none" }}
//                   >
//                     <i className="fa fa-info-circle me-1"></i>
//                     How to set bid pricing
//                   </button>
//                 </div>
//                 <hr />
//                 <div className="form-check mb-2">
//                   <input
//                     type="radio"
//                     id="setDefaultBid"
//                     name="automaticTargeting"
//                     className="form-check-input"
//                     checked={automaticBidType === "default"}
//                     onChange={() => setAutomaticBidType("default")}
//                   />
//                   <label htmlFor="setDefaultBid" className="form-check-label">
//                     <div className="d-flex align-items-center">
//                       <span style={{ fontWeight: "600", color: "#0073aa" }}>Set default bid</span>
//                       <InfoIcon tooltip="Use one bid amount for all targeting types. Simple setup but less optimization control." />
//                     </div>
//                     <br />
//                     {automaticBidType === "default" && (
//                       <div className="mt-2 ms-4">
//                         <div className="d-flex justify-content-between align-items-start" style={{ maxWidth: "600px" }}>
//                           <div className="text-muted" style={{ fontSize: "14px" }}>
//                             <div>Suggested bid for regular days</div>
//                             <div className="fw-bold text-dark">₹{defaultBid}</div>
//                             <div className="text-muted">
//                               (₹{bidRanges.default.min}-₹{bidRanges.default.max})
//                             </div>
//                           </div>
//                           <div className="ms-5">
//                             <label className="form-label text-muted" style={{ fontSize: "14px" }}>
//                               Default bid
//                             </label>
//                             <div style={{ position: "relative", width: "150px" }}>
//                               <span
//                                 style={{
//                                   position: "absolute",
//                                   left: "12px",
//                                   top: "50%",
//                                   transform: "translateY(-50%)",
//                                   color: "#6c757d",
//                                   zIndex: 1,
//                                 }}
//                               >
//                                 ₹
//                               </span>
//                               <input
//                                 type="text"
//                                 value={defaultBid}
//                                 onChange={(e) => handleDefaultBidChange(e.target.value)}
//                                 className={`form-control ${validationErrors.default ? "border-danger" : ""}`}
//                                 style={{ paddingLeft: "28px", width: "150px" }}
//                                 placeholder="0.00"
//                               />
//                             </div>
//                             {validationErrors.default && (
//                               <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
//                                 <i className="fa fa-exclamation-triangle me-1"></i>
//                                 {validationErrors.default}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </label>
//                 </div>
//                 <div className="form-check mb-3">
//                   <input
//                     type="radio"
//                     id="setBidsByTargetingGroup"
//                     name="automaticTargeting"
//                     className="form-check-input"
//                     checked={automaticBidType === "targeting"}
//                     onChange={() => setAutomaticBidType("targeting")}
//                   />
//                   <label htmlFor="setBidsByTargetingGroup" className="form-check-label">
//                     <div className="d-flex align-items-center">
//                       <span style={{ fontWeight: "600" }}>Set bids by targeting group</span>
//                       <InfoIcon tooltip="Set different bids for each match type. Provides better control and optimization opportunities." />
//                     </div>
//                   </label>
//                 </div>
//                 {automaticBidType === "targeting" && (
//                   <div className="mt-3 ms-4">
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                       <div className="d-flex align-items-center">
//                         <span style={{ fontSize: "14px", fontWeight: "600", color: "#6c757d" }}>TARGETING GROUPS</span>
//                         <InfoIcon tooltip="Different match types help you reach customers at various stages of their shopping journey" />
//                       </div>
//                       <span style={{ fontSize: "14px", color: "#6c757d" }}>Suggested bid for regular days</span>
//                       <div className="d-flex align-items-center">
//                         <span style={{ fontSize: "14px", fontWeight: "600", color: "#6c757d" }}>BID</span>
//                         <InfoIcon tooltip="Your maximum bid amount for each targeting group. Stay within suggested ranges for best results." />
//                       </div>
//                     </div>
//                     {Object.entries(targetingGroups).map(([groupKey, group]) => (
//                       <div
//                         key={groupKey}
//                         className="d-flex justify-content-between align-items-center py-2 border-bottom"
//                       >
//                         <div className="d-flex align-items-center">
//                           <div className="form-check">
//                             <input
//                               type="checkbox"
//                               id={`${groupKey}Check`}
//                               className="form-check-input"
//                               checked={group.enabled}
//                               onChange={(e) => updateTargetingGroup(groupKey, "enabled", e.target.checked)}
//                             />
//                           </div>
//                           <div className="d-flex align-items-center ms-2">
//                             <span style={{ fontWeight: "500" }}>
//                               {groupKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
//                             </span>
//                             <InfoIcon tooltip={`Targeting for ${groupKey} match type`} />
//                           </div>
//                         </div>
//                         <div style={{ fontSize: "14px" }}>
//                           <div style={{ fontWeight: "500" }}>₹{group.bid}</div>
//                           <div className="text-muted">
//                             (₹{bidRanges[groupKey]?.min}-₹{bidRanges[groupKey]?.max})
//                           </div>
//                         </div>
//                         <div>
//                           <div style={{ position: "relative", width: "80px" }}>
//                             <span
//                               style={{
//                                 position: "absolute",
//                                 left: "8px",
//                                 top: "50%",
//                                 transform: "translateY(-50%)",
//                                 color: "#6c757d",
//                                 zIndex: 1,
//                               }}
//                             >
//                               ₹
//                             </span>
//                             <input
//                               value={group.bid}
//                               onChange={(e) => updateTargetingGroup(groupKey, "bid", e.target.value)}
//                               className={`form-control ${validationErrors[groupKey] ? "border-danger" : ""}`}
//                               style={{ paddingLeft: "24px", width: "80px", fontSize: "12px" }}
//                               disabled={!group.enabled}
//                             />
//                           </div>
//                           {validationErrors[groupKey] && (
//                             <div className="text-danger mt-1" style={{ fontSize: "10px", width: "80px" }}>
//                               {validationErrors[groupKey]}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <BidPricingPopover />
//               </div>
//             )}

//             {/* Manual Targeting Section */}
//             {targetingType === "manual" && (
//               <div className="mt-3">
//                 <div className="d-flex align-items-center mb-3">
//                   <h3 className="mb-0">Manual Targeting</h3>
//                   <button
//                     className="btn btn-link text-primary p-0 ms-2"
//                     style={{ fontSize: "14px", textDecoration: "none" }}
//                   >
//                     <i className="fa fa-info-circle me-1"></i>
//                     How to choose keywords for targeting
//                   </button>
//                 </div>
//                 <hr />

//                 <div className="row">
//                   <div className="col-md-7">
//                     <div className="border rounded p-3">
//                       <div className="d-flex justify-content-between align-items-center mb-3">
//                         <div className="d-flex align-items-center"></div>
//                       </div>

//                       {/* Filters and Controls */}
//                       <div className="mb-3">
//                         <div className="row align-items-center">
//                           <div className="col-md-6">
//                             <div className="d-flex align-items-center" style={{ gap: "12px" }}>
//                               <span style={{ fontSize: "14px", fontWeight: "600" }}>Filter by</span>
//                               <InfoIcon tooltip="Filter keywords by match type" />
//                               <div className="d-flex" style={{ gap: "8px" }}>
//                                 <div className="form-check form-check-inline">
//                                   <input
//                                     type="checkbox"
//                                     id="broadFilter"
//                                     className="form-check-input"
//                                     checked={keywordFilters.broad}
//                                     onChange={() => handleKeywordFilterChange("broad")}
//                                   />
//                                   <label
//                                     htmlFor="broadFilter"
//                                     className="form-check-label"
//                                     style={{ fontSize: "14px" }}
//                                   >
//                                     Broad
//                                   </label>
//                                 </div>
//                                 <div className="form-check form-check-inline">
//                                   <input
//                                     type="checkbox"
//                                     id="phraseFilter"
//                                     className="form-check-input"
//                                     checked={keywordFilters.phrase}
//                                     onChange={() => handleKeywordFilterChange("phrase")}
//                                   />
//                                   <label
//                                     htmlFor="phraseFilter"
//                                     className="form-check-label"
//                                     style={{ fontSize: "14px" }}
//                                   >
//                                     Phrase
//                                   </label>
//                                 </div>
//                                 <div className="form-check form-check-inline">
//                                   <input
//                                     type="checkbox"
//                                     id="exactFilter"
//                                     className="form-check-input"
//                                     checked={keywordFilters.exact}
//                                     onChange={() => handleKeywordFilterChange("exact")}
//                                   />
//                                   <label
//                                     htmlFor="exactFilter"
//                                     className="form-check-label"
//                                     style={{ fontSize: "14px" }}
//                                   >
//                                     Exact
//                                   </label>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="col-md-6">
//                             <div className="d-flex align-items-center justify-content-end" style={{ gap: "8px" }}>
//                               <span style={{ fontSize: "14px", fontWeight: "600" }}>Sort By</span>
//                               <InfoIcon tooltip="Sort keywords by different criteria" />
//                               <select
//                                 value={keywordSortBy}
//                                 onChange={(e) => setKeywordSortBy(e.target.value)}
//                                 className="form-select form-select-sm"
//                                 style={{ width: "120px" }}
//                               >
//                                 <option value="orders">Orders</option>
//                                 <option value="alphabetical">A-Z</option>
//                                 <option value="bid">Bid Amount</option>
//                               </select>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Keywords Table Header */}
//                       <div
//                         className="row mb-2 text-muted border-bottom pb-2"
//                         style={{ fontSize: "12px", fontWeight: "600" }}
//                       >
//                         <div className="col-4">KEYWORD</div>
//                         <div className="col-2">MATCH TYPE</div>
//                         <div className="col-2">
//                           SUGG. BID
//                           <InfoIcon tooltip="Suggested bid amount" />
//                         </div>
//                         <div className="col-2">
//                           <button
//                             onClick={addAllKeywords}
//                             className="btn btn-link text-primary p-0"
//                             style={{ fontSize: "12px", fontWeight: "600" }}
//                             disabled={getFilteredKeywords().every((keyword) =>
//                               selectedKeywords.some(
//                                 (k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType,
//                               ),
//                             )}
//                           >
//                             {getFilteredKeywords().every((keyword) =>
//                               selectedKeywords.some(
//                                 (k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType,
//                               ),
//                             )
//                               ? "All Added"
//                               : "Add All"}
//                           </button>
//                         </div>
//                       </div>

//                       {/* Keywords Table */}
//                       {loadingKeywords ? (
//                         <div className="text-center py-4">
//                           <div className="spinner-border spinner-border-sm text-primary" role="status">
//                             <span className="sr-only">Loading...</span>
//                           </div>
//                           <p className="text-muted mt-2 mb-0">Loading suggested keywords...</p>
//                         </div>
//                       ) : (
//                         <div style={{ maxHeight: "400px", overflowY: "auto" }}>
//                           {/* Group keywords by keyword name */}
//                           {Object.entries(
//                             getFilteredKeywords().reduce((acc, keyword) => {
//                               if (!acc[keyword.keyword]) {
//                                 acc[keyword.keyword] = []
//                               }
//                               acc[keyword.keyword].push(keyword)
//                               return acc
//                             }, {}),
//                           ).map(([keywordName, matchTypes]) => (
//                             <div key={keywordName} className="mb-2">
//                               {matchTypes.map((keyword, index) => (
//                                 <div
//                                   key={`${keyword.keyword}-${keyword.matchType}-${index}`}
//                                   className="row align-items-center py-1"
//                                   style={{
//                                     backgroundColor: index === 0 ? "#f8f9fa" : "transparent",
//                                     borderLeft: index === 0 ? "3px solid #dee2e6" : "3px solid transparent",
//                                   }}
//                                 >
//                                   <div className="col-4">
//                                     {index === 0 ? (
//                                       <div>
//                                         <div style={{ fontWeight: "500", fontSize: "14px" }}>{keyword.keyword}</div>
//                                       </div>
//                                     ) : (
//                                       <div style={{ paddingLeft: "20px" }}></div>
//                                     )}
//                                   </div>
//                                   <div className="col-2">
//                                     <small>{keyword.matchType}</small>
//                                   </div>
//                                   <div className="col-2">
//                                     <small>₹{keyword.suggestedBid.toFixed(2)}</small>
//                                   </div>
//                                   <div className="col-2">
//                                     <button
//                                       onClick={() => addKeyword(keyword)}
//                                       className="btn btn-link text-primary p-0"
//                                       style={{ fontSize: "14px" }}
//                                       disabled={selectedKeywords.some(
//                                         (k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType,
//                                       )}
//                                     >
//                                       {selectedKeywords.some(
//                                         (k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType,
//                                       )
//                                         ? "Added"
//                                         : "Add"}
//                                     </button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Right Side - Selected Keywords */}
//                   <div className="col-md-5">
//                     <div className="border rounded p-3">
//                       <div className="d-flex justify-content-between align-items-center mb-3">
//                         <h5 className="mb-0">{selectedKeywords.length} added</h5>
//                         {selectedKeywords.length > 0 && (
//                           <button
//                             onClick={removeAllKeywords}
//                             className="btn btn-link text-danger p-0"
//                             style={{ fontSize: "14px" }}
//                           >
//                             Remove all
//                           </button>
//                         )}
//                       </div>

//                       {selectedKeywords.length === 0 ? (
//                         <div className="text-center py-4 text-muted">
//                           <i className="fa fa-search mb-2" style={{ fontSize: "24px" }}></i>
//                           <p>No keywords added yet</p>
//                           <small>Add keywords from the suggestions on the left</small>
//                         </div>
//                       ) : (
//                         <div>
//                           {/* Header for added keywords */}
//                           <div
//                             className="row mb-2 text-muted border-bottom pb-2"
//                             style={{ fontSize: "12px", fontWeight: "600" }}
//                           >
//                             <div className="col-4">KEYWORD</div>
//                             <div className="col-2">
//                               MATCH TYPE
//                               <InfoIcon tooltip="Match type for targeting" />
//                             </div>
//                             <div className="col-3">
//                               SUGG. BID
//                               <InfoIcon tooltip="Suggested bid amount" />
//                               <br />
//                               <button className="btn btn-link text-primary p-0" style={{ fontSize: "10px" }}>
//                                 Apply all
//                               </button>
//                             </div>
//                             <div className="col-2">
//                               BID
//                               <InfoIcon tooltip="Your bid amount" />
//                             </div>
//                             <div className="col-1"></div>
//                           </div>

//                           {/* Group selected keywords by keyword name */}
//                           {Object.entries(
//                             selectedKeywords.reduce((acc, keyword) => {
//                               if (!acc[keyword.keyword]) {
//                                 acc[keyword.keyword] = []
//                               }
//                               acc[keyword.keyword].push(keyword)
//                               return acc
//                             }, {}),
//                           ).map(([keywordName, matchTypes]) => (
//                             <div key={keywordName} className="mb-2">
//                               {matchTypes.map((keyword, index) => (
//                                 <div
//                                   key={keyword.id}
//                                   className="row align-items-center py-1"
//                                   style={{
//                                     backgroundColor: index === 0 ? "#f8f9fa" : "transparent",
//                                     borderLeft: index === 0 ? "3px solid #dee2e6" : "3px solid transparent",
//                                   }}
//                                 >
//                                   <div className="col-4">
//                                     {index === 0 ? (
//                                       <div>
//                                         <div style={{ fontWeight: "500", fontSize: "14px" }}>{keyword.keyword}</div>
//                                       </div>
//                                     ) : (
//                                       <div style={{ paddingLeft: "20px" }}>{/* Empty div for spacing */}</div>
//                                     )}
//                                   </div>
//                                   <div className="col-2">
//                                     <small className="text-muted">{keyword.matchType}</small>
//                                   </div>
//                                   <div className="col-3">
//                                     <small>₹{keyword.suggestedBid.toFixed(2)}</small>
//                                   </div>
//                                   <div className="col-2">
//                                     <small>₹{keyword.bid}</small>
//                                   </div>
//                                   <div className="col-1">
//                                     <button
//                                       onClick={() => removeKeyword(keyword.id)}
//                                       className="btn btn-link text-danger p-0"
//                                       style={{ fontSize: "10px" }}
//                                       title="Remove"
//                                     >
//                                       ×
//                                     </button>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   )
// }

// export default TargetingSection




import { useState, useEffect } from "react"
import getAPI from "../../../../api/getAPI"

const TargetingSection = ({
  selectedProducts,
  targetingType: initialTargetingType,
  automaticBidType: initialAutomaticBidType,
  defaultBid: initialDefaultBid,
  targetingGroups: initialTargetingGroups,
  selectedKeywords: initialSelectedKeywords,
  onUpdateTargetingSettings,
}) => {
  const [targetingType, setTargetingType] = useState(initialTargetingType || "automatic")
  const [showAutomaticTargeting, setShowAutomaticTargeting] = useState(targetingType === "automatic")
  const [automaticBidType, setAutomaticBidType] = useState(initialAutomaticBidType || "default")
  const [defaultBid, setDefaultBid] = useState(initialDefaultBid || "0.00")
  const [showBidPricingHelp, setShowBidPricingHelp] = useState(false)
  const [showTargetingHelp, setShowTargetingHelp] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})


  const [manualTargetingType, setManualTargetingType] = useState("keyword")
  const [selectedKeywords, setSelectedKeywords] = useState(initialSelectedKeywords || [])
  const [keywordFilters, setKeywordFilters] = useState({
    broad: true,
    phrase: true,
    exact: true,
  })
  const [keywordSortBy, setKeywordSortBy] = useState("orders")
  const [suggestedKeywords, setSuggestedKeywords] = useState([])
  const [loadingKeywords, setLoadingKeywords] = useState(false)

  const [bidRanges, setBidRanges] = useState({
    default: { min: 0, max: 0 },
    closeMatch: { min: 0, max: 0 },
    looseMatch: { min: 0, max: 0 },
    substitutes: { min: 0, max: 0 },
    complements: { min: 0, max: 0 },
  })

  const [targetingGroups, setTargetingGroups] = useState(
    initialTargetingGroups || {
      closeMatch: { enabled: false, bid: "0.00" },
      looseMatch: { enabled: false, bid: "0.00" },
      substitutes: { enabled: false, bid: "0.00" },
      complements: { enabled: false, bid: "0.00" },
    },
  )

  const [loadingBids, setLoadingBids] = useState(true)

  useEffect(() => {
    setShowAutomaticTargeting(targetingType === "automatic")
  }, [targetingType])

  useEffect(() => {
    if (onUpdateTargetingSettings) {
      const filteredGroups = Object.entries(targetingGroups)
        .filter(([_, group]) => group.enabled)
        .reduce((acc, [key, group]) => {
          acc[key] = { ...group, bid: Number(group.bid) }
          return acc
        }, {})

      onUpdateTargetingSettings({
        targetingType,
        automaticBidType,
        defaultBid: Number(defaultBid),
        targetingGroups: filteredGroups,
        selectedKeywords: selectedKeywords.map((keyword) => ({ ...keyword, bid: Number(keyword.bid) })),
      })
    }
  }, [targetingType, automaticBidType, defaultBid, targetingGroups, selectedKeywords])

  useEffect(() => {
    const fetchTargetingSettings = async () => {
      if (selectedProducts && selectedProducts.length > 0) {
        const subCategoryIds = [...new Set(selectedProducts.map((product) => product.subCategory))]
        try {
          setLoadingBids(true)
          const result = await getAPI(`/api/targeting-settings/average/${subCategoryIds}`, true)
          if (result && result.data && result.data.data) {
            const { defaultBid: fetchedDefaultBid, targetingGroups: fetchedGroups } = result.data.data
            setDefaultBid(fetchedDefaultBid.bid.toFixed(2))
            setBidRanges({
              default: {
                min: fetchedDefaultBid.range.min,
                max: fetchedDefaultBid.range.max,
              },
              closeMatch: {
                min: fetchedGroups.closeMatch.range.minRange,
                max: fetchedGroups.closeMatch.range.maxRange,
              },
              looseMatch: {
                min: fetchedGroups.looseMatch.range.minRange,
                max: fetchedGroups.looseMatch.range.maxRange,
              },
              substitutes: {
                min: fetchedGroups.substitutes.range.minRange,
                max: fetchedGroups.substitutes.range.maxRange,
              },
              complements: {
                min: fetchedGroups.complements.range.minRange,
                max: fetchedGroups.complements.range.maxRange,
              },
            })
            setTargetingGroups({
              closeMatch: {
                enabled: false,
                bid: fetchedGroups.closeMatch.bid.toFixed(2),
              },
              looseMatch: {
                enabled: false,
                bid: fetchedGroups.looseMatch.bid.toFixed(2),
              },
              substitutes: {
                enabled: false,
                bid: fetchedGroups.substitutes.bid.toFixed(2),
              },
              complements: {
                enabled: false,
                bid: fetchedGroups.complements.bid.toFixed(2),
              },
            })
          }
        } catch (error) {
          console.error("Error fetching targeting settings:", error)
        } finally {
          setLoadingBids(false)
        }
      } else {
        setLoadingBids(false)
      }
    }

    fetchTargetingSettings()
  }, [selectedProducts])

  useEffect(() => {
    const fetchKeywordTargeting = async () => {
      if (selectedProducts && selectedProducts.length > 0) {
        const subCategoryIds = [...new Set(selectedProducts.map((p) => p.subCategory))]
        try {
          setLoadingKeywords(true)
          const result = await getAPI(`/api/Keyword-targeting/average/${subCategoryIds}`, true)
          if (result?.data?.data?.keywordTargeting) {
            const keywordData = result.data.data.keywordTargeting

            // Transform API data to match our component structure
            const transformedKeywords = []
            Object.entries(keywordData).forEach(([keyword, matchTypes]) => {
              Object.entries(matchTypes).forEach(([matchType, data]) => {
                transformedKeywords.push({
                  keyword: keyword,
                  matchType: matchType.charAt(0).toUpperCase() + matchType.slice(1),
                  suggestedBid: data.bid,
                  impressions: 0,
                })
              })
            })

            setSuggestedKeywords(transformedKeywords)
          }
        } catch (error) {
          console.error("Error fetching keyword targeting:", error)
        } finally {
          setLoadingKeywords(false)
        }
      } else {
        setLoadingKeywords(false)
      }
    }

    if (targetingType === "manual") {
      fetchKeywordTargeting()
    }
  }, [selectedProducts, targetingType, manualTargetingType])

  const handleTargetingChange = (type) => {
    setTargetingType(type)
    setShowAutomaticTargeting(type === "automatic")
  }

  const validateBid = (value, type) => {
    const numValue = Number.parseFloat(value)
    const range = bidRanges[type]
    if (isNaN(numValue)) {
      return "Please enter a valid number"
    }
    if (numValue < range.min) {
      return `Bid should be at least ₹${range.min}`
    }
    if (numValue > range.max) {
      return `Bid should not exceed ₹${range.max}`
    }
    return ""
  }

  const handleDefaultBidChange = (value) => {
    setDefaultBid(value)
    const error = validateBid(value, "default")
    setValidationErrors((prev) => ({ ...prev, default: error }))
  }

  const updateTargetingGroup = (group, field, value) => {
    setTargetingGroups((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value,
      },
    }))
    if (field === "bid") {
      const error = validateBid(value, group)
      setValidationErrors((prev) => ({ ...prev, [group]: error }))
    }
  }

  const handleKeywordFilterChange = (filterType) => {
    setKeywordFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }))
  }

  const addKeyword = (keyword) => {
    const keywordWithBid = {
      ...keyword,
      bid: keyword.suggestedBid.toFixed(2),
      id: `${keyword.keyword}-${keyword.matchType}-${Date.now()}`,
    }
    setSelectedKeywords((prev) => [...prev, keywordWithBid])
  }

  const removeKeyword = (keywordId) => {
    setSelectedKeywords((prev) => prev.filter((k) => k.id !== keywordId))
  }

  const removeAllKeywords = () => {
    setSelectedKeywords([])
  }

  const getFilteredKeywords = () => {
    return suggestedKeywords
      .filter((keyword) => {
        const matchType = keyword.matchType.toLowerCase()
        return keywordFilters[matchType]
      })
      .sort((a, b) => {
        if (keywordSortBy === "orders") {
          return b.impressions - a.impressions
        }
        return a.keyword.localeCompare(b.keyword)
      })
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

  const BidPricingPopover = () => (
    <div className="position-relative">
      {showBidPricingHelp && (
        <div
          className="position-fixed bg-white border rounded shadow-lg p-4"
          style={{
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "480px",
            zIndex: 1000,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center" style={{ gap: "8px" }}>
              <i className="fa fa-chart-line text-primary"></i>
              <h6 className="font-weight-bold text-dark mb-0">How to Set Bid Pricing</h6>
            </div>
            <button
              onClick={() => setShowBidPricingHelp(false)}
              className="btn btn-link text-muted p-0"
              style={{ fontSize: "18px" }}
            >
              ×
            </button>
          </div>
          <div className="mb-4">
            <h6 className="font-weight-bold mb-3">
              <i className="fa fa-bullseye text-primary me-2"></i>
              Understanding Bid Types
            </h6>
            <div className="p-3 bg-primary bg-opacity-10 rounded mb-3">
              <h6 className="text-primary font-weight-bold mb-2">Default Bid</h6>
              <p className="small mb-0 text-muted">
                Sets a single bid amount for all targeting. Simple but less control over performance.
              </p>
            </div>
            <div className="p-3 bg-success bg-opacity-10 rounded">
              <h6 className="text-success font-weight-bold mb-2">Targeting Group Bids</h6>
              <p className="small mb-0 text-muted">
                Allows different bids for each match type. More control and better optimization potential.
              </p>
            </div>
          </div>
          <div className="alert alert-warning">
            <div className="d-flex align-items-start" style={{ gap: "8px" }}>
              <i className="fa fa-exclamation-triangle text-warning mt-1"></i>
              <div>
                <strong>Important:</strong> Bids outside suggested ranges may result in poor performance or limited
                visibility. The system will prevent you from setting bids beyond recommended limits.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const TargetingStrategyPopover = () => (
    <div className="position-relative">
      <button
        onClick={() => setShowTargetingHelp(!showTargetingHelp)}
        className="btn btn-link text-primary p-0 d-flex align-items-center"
        style={{ fontSize: "14px", gap: "4px", textDecoration: "none" }}
      >
        <i className="fa fa-info-circle"></i>
        How to choose a targeting strategy
      </button>
      {showTargetingHelp && (
        <div
          className="position-absolute bg-white border rounded shadow-lg p-4"
          style={{
            right: "0",
            top: "32px",
            width: "400px",
            zIndex: 10,
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center" style={{ gap: "8px" }}>
              <i className="fa fa-bullseye text-primary"></i>
              <h6 className="font-weight-bold text-dark mb-0">How to Choose a Targeting Strategy</h6>
            </div>
            <button
              onClick={() => setShowTargetingHelp(false)}
              className="btn btn-link text-muted p-0"
              style={{ fontSize: "18px" }}
            >
              ×
            </button>
          </div>
          <div className="mb-4">
            <div className="p-3 bg-primary bg-opacity-10 rounded mb-3">
              <h6 className="text-primary font-weight-bold d-flex align-items-center mb-2">
                <i className="fa fa-bolt me-2"></i>
                Automatic Targeting
              </h6>
              <p className="small mb-2">
                <strong>Best for:</strong> New campaigns, testing, or when you want Artsyas to find relevant traffic for
                you.
              </p>
              <ul className="small mb-0 ps-3">
                <li>Artsyas automatically targets relevant keywords and products</li>
                <li>Great for discovering new opportunities</li>
                <li>Less time-intensive to set up</li>
                <li>Good for broad reach and discovery</li>
              </ul>
            </div>
            <div className="p-3 bg-success bg-opacity-10 rounded">
              <h6 className="text-success font-weight-bold d-flex align-items-center mb-2">
                <i className="fa fa-bullseye me-2"></i>
                Manual Targeting
              </h6>
              <p className="small mb-2">
                <strong>Best for:</strong> Experienced advertisers who want full control over their targeting.
              </p>
              <ul className="small mb-0 ps-3">
                <li>You choose specific keywords and products to target</li>
                <li>More precise control over your advertising</li>
                <li>Better for optimized campaigns with known performers</li>
                <li>Requires more research and management</li>
              </ul>
            </div>
          </div>
          <div className="border-top pt-3">
            <h6 className="font-weight-bold mb-2">Recommendation</h6>
            <p className="small text-muted mb-0">
              Start with <strong>Automatic Targeting</strong> to gather data about what works, then use those insights
              to create more targeted Manual campaigns. Many successful advertisers run both types simultaneously.
            </p>
          </div>
        </div>
      )}
    </div>
  )

  const addAllKeywords = () => {
    const filteredKeywords = getFilteredKeywords()
    const keywordsToAdd = filteredKeywords.filter(
      (keyword) => !selectedKeywords.some((k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType),
    )

    const keywordsWithBids = keywordsToAdd.map((keyword) => ({
      ...keyword,
      bid: keyword.suggestedBid.toFixed(2),
      id: `${keyword.keyword}-${keyword.matchType}-${Date.now()}-${Math.random()}`,
    }))

    setSelectedKeywords((prev) => [...prev, ...keywordsWithBids])
  }

  return (
    <>
      <div className="card p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <h2 className="mb-0">Targeting</h2>
          </div>
          <TargetingStrategyPopover />
        </div>
        <hr />
        {loadingBids ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="text-muted mt-2">Loading bid settings...</p>
          </div>
        ) : (
          <div>
            <div className="form-check mb-2">
              <input
                type="radio"
                id="automaticTargeting"
                name="targeting"
                className="form-check-input"
                checked={targetingType === "automatic"}
                onChange={() => handleTargetingChange("automatic")}
              />
              <label htmlFor="automaticTargeting" className="form-check-label">
                <div className="d-flex align-items-center">
                  <span style={{ fontWeight: "600", color: "#0073aa", marginRight: "10px" }}>Automatic targeting</span>
                  <InfoIcon tooltip="Artsyas automatically finds relevant keywords and products for your ads" />
                </div>
                <br />
                <span className="text-muted" style={{ fontSize: "14px" }}>
                  Artsyas will target keywords and products that are similar to the product in your ad.
                </span>
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="manualTargeting"
                name="targeting"
                className="form-check-input"
                checked={targetingType === "manual"}
                onChange={() => handleTargetingChange("manual")}
              />
              <label htmlFor="manualTargeting" className="form-check-label">
                <div className="d-flex align-items-center">
                  <span style={{ fontWeight: "600", marginRight: "10px" }}>Manual targeting</span>
                  <InfoIcon tooltip="You manually select specific keywords and products to target" />
                </div>
                <br />
                <span className="text-muted" style={{ fontSize: "14px" }}>
                  Choose keywords or products to target shopper searches and set custom bids.
                </span>
              </label>
            </div>

            {/* Automatic Targeting Section */}
            {showAutomaticTargeting && (
              <div className="mt-3">
                <div className="d-flex align-items-center mb-3">
                  <h3 className="mb-0 mr-2">Automatic Targeting</h3>
                  <button
                    onClick={() => setShowBidPricingHelp(!showBidPricingHelp)}
                    className="btn btn-link text-primary p-0 ms-auto"
                    style={{ fontSize: "14px", textDecoration: "none" }}
                  >
                    <i className="fa fa-info-circle me-1 mr-2"></i>
                    How to set bid pricing
                  </button>
                </div>
                <hr />
                <div className="form-check mb-2">
                  <input
                    type="radio"
                    id="setDefaultBid"
                    name="automaticTargeting"
                    className="form-check-input"
                    checked={automaticBidType === "default"}
                    onChange={() => setAutomaticBidType("default")}
                  />
                  <label htmlFor="setDefaultBid" className="form-check-label">
                    <div className="d-flex align-items-center">
                      <span style={{ fontWeight: "600", color: "#0073aa", marginRight: "10px" }}>Set default bid</span>
                      <InfoIcon tooltip="Use one bid amount for all targeting types. Simple setup but less optimization control." />
                    </div>
                    <br />
                    {automaticBidType === "default" && (
                      <div className="mt-2 ms-4">
                        <div className="d-flex justify-content-between align-items-start" style={{ maxWidth: "600px" }}>
                          <div className="text-muted" style={{ fontSize: "14px" }}>
                            <div>Suggested bid for regular days</div>
                            <div className="fw-bold text-dark">₹{defaultBid}</div>
                            <div className="text-muted">
                              (₹{bidRanges.default.min}-₹{bidRanges.default.max})
                            </div>
                          </div>
                          <div className="ms-5">
                            <label className="form-label text-muted" style={{ fontSize: "14px" }}>
                              Default bid
                            </label>
                            <div style={{ position: "relative", width: "150px" }}>
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
                                type="text"
                                value={defaultBid}
                                onChange={(e) => handleDefaultBidChange(e.target.value)}
                                className={`form-control ${validationErrors.default ? "border-danger" : ""}`}
                                style={{ paddingLeft: "28px", width: "150px" }}
                                placeholder="0.00"
                              />
                            </div>
                            {validationErrors.default && (
                              <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
                                <i className="fa fa-exclamation-triangle me-1"></i>
                                {validationErrors.default}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                <div className="form-check mb-3">
                  <input
                    type="radio"
                    id="setBidsByTargetingGroup"
                    name="automaticTargeting"
                    className="form-check-input"
                    checked={automaticBidType === "targeting"}
                    onChange={() => setAutomaticBidType("targeting")}
                  />
                  <label htmlFor="setBidsByTargetingGroup" className="form-check-label">
                    <div className="d-flex align-items-center">
                      <span style={{ fontWeight: "600", marginRight: "10px" }}>Set bids by targeting group</span>
                      <InfoIcon tooltip="Set different bids for each match type. Provides better control and optimization opportunities." />
                    </div>
                  </label>
                </div>
                {automaticBidType === "targeting" && (
                  <div className="mt-3 ms-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#6c757d", marginRight: "10px" }}>TARGETING GROUPS</span>
                        <InfoIcon tooltip="Different match types help you reach customers at various stages of their shopping journey" />
                      </div>
                      <span style={{ fontSize: "14px", color: "#6c757d" }}>Suggested bid for regular days</span>
                      <div className="d-flex align-items-center">
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#6c757d", marginRight: "10px" }}>BID</span>
                        <InfoIcon tooltip="Your maximum bid amount for each targeting group. Stay within suggested ranges for best results." />
                      </div>
                    </div>
                    {Object.entries(targetingGroups).map(([groupKey, group]) => (
                      <div
                        key={groupKey}
                        className="d-flex justify-content-between align-items-center py-2 border-bottom"
                      >
                        <div className="d-flex align-items-center">
                          {/* <div className="form-check">
                            <input
                              type="checkbox"
                              id={`${groupKey}Check`}
                              className="form-check-input"
                              checked={group.enabled}
                              onChange={(e) => updateTargetingGroup(groupKey, "enabled", e.target.checked)}
                            />
                          </div> */}
                          <label className="custom-toggle-switch" htmlFor={`${groupKey}Toggle`}>
                            <input
                              type="checkbox"
                              id={`${groupKey}Toggle`}
                              checked={group.enabled}
                              onChange={(e) => updateTargetingGroup(groupKey, "enabled", e.target.checked)}
                            />
                            <span className="custom-slider"></span>
                          </label>

                          <div className="d-flex align-items-center ms-2">
                            <span style={{ fontWeight: "500", marginRight: "10px" }}>
                              {groupKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                            </span>
                            <InfoIcon tooltip={`Targeting for ${groupKey} match type`} />
                          </div>
                        </div>
                        <div style={{ fontSize: "14px" }}>
                          <div style={{ fontWeight: "500" }}>₹{group.bid}</div>
                          <div className="text-muted">
                            (₹{bidRanges[groupKey]?.min}-₹{bidRanges[groupKey]?.max})
                          </div>
                        </div>
                        <div>
                          <div style={{ position: "relative", width: "80px" }}>
                            <span
                              style={{
                                position: "absolute",
                                left: "8px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#6c757d",
                                zIndex: 1,
                              }}
                            >
                              ₹
                            </span>
                            <input
                              value={group.bid}
                              onChange={(e) => updateTargetingGroup(groupKey, "bid", e.target.value)}
                              className={`form-control ${validationErrors[groupKey] ? "border-danger" : ""}`}
                              style={{ paddingLeft: "24px", width: "80px", fontSize: "12px" }}
                              disabled={!group.enabled}
                            />
                          </div>
                          {validationErrors[groupKey] && (
                            <div className="text-danger mt-1" style={{ fontSize: "10px", width: "80px" }}>
                              {validationErrors[groupKey]}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <BidPricingPopover />
              </div>
            )}

            {/* Manual Targeting Section */}
            {targetingType === "manual" && (
              <div className="mt-3">
                <div className="d-flex align-items-center mb-3">
                  <h3 className="mb-0">Manual Targeting</h3>
                  <button
                    className="btn btn-link text-primary p-0 ms-2"
                    style={{ fontSize: "14px", textDecoration: "none" }}
                  >
                    <i className="fa fa-info-circle me-1"></i>
                    How to choose keywords for targeting
                  </button>
                </div>
                <hr />

                <div className="row">
                  <div className="col-md-7">
                    <div className="border rounded p-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center"></div>
                      </div>

                      {/* Filters and Controls */}
                      <div className="mb-3">
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <div className="d-flex align-items-center" style={{ gap: "12px" }}>
                              <span style={{ fontSize: "14px", fontWeight: "600" }}>Filter by</span>
                              <InfoIcon tooltip="Filter keywords by match type" />
                              <div className="d-flex" style={{ gap: "8px" }}>
                                <div className="form-check form-check-inline">
                                  <input
                                    type="checkbox"
                                    id="broadFilter"
                                    className="form-check-input"
                                    checked={keywordFilters.broad}
                                    onChange={() => handleKeywordFilterChange("broad")}
                                  />
                                  <label
                                    htmlFor="broadFilter"
                                    className="form-check-label"
                                    style={{ fontSize: "14px" }}
                                  >
                                    Broad
                                  </label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input
                                    type="checkbox"
                                    id="phraseFilter"
                                    className="form-check-input"
                                    checked={keywordFilters.phrase}
                                    onChange={() => handleKeywordFilterChange("phrase")}
                                  />
                                  <label
                                    htmlFor="phraseFilter"
                                    className="form-check-label"
                                    style={{ fontSize: "14px" }}
                                  >
                                    Phrase
                                  </label>
                                </div>
                                <div className="form-check form-check-inline">
                                  <input
                                    type="checkbox"
                                    id="exactFilter"
                                    className="form-check-input"
                                    checked={keywordFilters.exact}
                                    onChange={() => handleKeywordFilterChange("exact")}
                                  />
                                  <label
                                    htmlFor="exactFilter"
                                    className="form-check-label"
                                    style={{ fontSize: "14px" }}
                                  >
                                    Exact
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex align-items-center justify-content-end" style={{ gap: "8px" }}>
                              <span style={{ fontSize: "14px", fontWeight: "600" }}>Sort By</span>
                              <InfoIcon tooltip="Sort keywords by different criteria" />
                              <select
                                value={keywordSortBy}
                                onChange={(e) => setKeywordSortBy(e.target.value)}
                                className="form-select form-select-sm"
                                style={{ width: "120px" }}
                              >
                                <option value="orders">Orders</option>
                                <option value="alphabetical">A-Z</option>
                                <option value="bid">Bid Amount</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Keywords Table Header */}
                      <div
                        className="row mb-2 text-muted border-bottom pb-2"
                        style={{ fontSize: "12px", fontWeight: "600" }}
                      >
                        <div className="col-4">KEYWORD</div>
                        <div className="col-2">MATCH TYPE</div>
                        <div className="col-2">
                          SUGG. BID
                          <InfoIcon tooltip="Suggested bid amount" />
                        </div>
                        <div className="col-2">
                          <button
                            onClick={addAllKeywords}
                            className="btn btn-link text-primary p-0"
                            style={{ fontSize: "12px", fontWeight: "600" }}
                            disabled={getFilteredKeywords().every((keyword) =>
                              selectedKeywords.some(
                                (k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType,
                              ),
                            )}
                          >
                            {getFilteredKeywords().every((keyword) =>
                              selectedKeywords.some(
                                (k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType,
                              ),
                            )
                              ? "All Added"
                              : "Add All"}
                          </button>
                        </div>
                      </div>

                      {/* Keywords Table */}
                      {loadingKeywords ? (
                        <div className="text-center py-4">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                          <p className="text-muted mt-2 mb-0">Loading suggested keywords...</p>
                        </div>
                      ) : (
                        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                          {/* Group keywords by keyword name */}
                          {Object.entries(
                            getFilteredKeywords().reduce((acc, keyword) => {
                              if (!acc[keyword.keyword]) {
                                acc[keyword.keyword] = []
                              }
                              acc[keyword.keyword].push(keyword)
                              return acc
                            }, {}),
                          ).map(([keywordName, matchTypes]) => (
                            <div key={keywordName} className="mb-2">
                              {matchTypes.map((keyword, index) => (
                                <div
                                  key={`${keyword.keyword}-${keyword.matchType}-${index}`}
                                  className="row align-items-center py-1"
                                  style={{
                                    backgroundColor: index === 0 ? "#f8f9fa" : "transparent",
                                    borderLeft: index === 0 ? "3px solid #dee2e6" : "3px solid transparent",
                                  }}
                                >
                                  <div className="col-4">
                                    {index === 0 ? (
                                      <div>
                                        <div style={{ fontWeight: "500", fontSize: "14px" }}>{keyword.keyword}</div>
                                      </div>
                                    ) : (
                                      <div style={{ paddingLeft: "20px" }}></div>
                                    )}
                                  </div>
                                  <div className="col-2">
                                    <small>{keyword.matchType}</small>
                                  </div>
                                  <div className="col-2">
                                    <small>₹{keyword.suggestedBid.toFixed(2)}</small>
                                  </div>
                                  <div className="col-2">
                                    <button
                                      onClick={() => addKeyword(keyword)}
                                      className="btn btn-link text-primary p-0"
                                      style={{ fontSize: "14px" }}
                                      disabled={selectedKeywords.some(
                                        (k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType,
                                      )}
                                    >
                                      {selectedKeywords.some(
                                        (k) => k.keyword === keyword.keyword && k.matchType === keyword.matchType,
                                      )
                                        ? "Added"
                                        : "Add"}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Selected Keywords */}
                  <div className="col-md-5">
                    <div className="border rounded p-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">{selectedKeywords.length} added</h5>
                        {selectedKeywords.length > 0 && (
                          <button
                            onClick={removeAllKeywords}
                            className="btn btn-link text-danger p-0"
                            style={{ fontSize: "14px" }}
                          >
                            Remove all
                          </button>
                        )}
                      </div>

                      {selectedKeywords.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                          <i className="fa fa-search mb-2" style={{ fontSize: "24px" }}></i>
                          <p>No keywords added yet</p>
                          <small>Add keywords from the suggestions on the left</small>
                        </div>
                      ) : (
                        <div>
                          {/* Header for added keywords */}
                          <div
                            className="row mb-2 text-muted border-bottom pb-2"
                            style={{ fontSize: "12px", fontWeight: "600" }}
                          >
                            <div className="col-4">KEYWORD</div>
                            <div className="col-2">
                              MATCH TYPE
                              <InfoIcon tooltip="Match type for targeting" />
                            </div>
                            <div className="col-3">
                              SUGG. BID
                              <InfoIcon tooltip="Suggested bid amount" />
                              <br />
                              <button className="btn btn-link text-primary p-0" style={{ fontSize: "10px" }}>
                                Apply all
                              </button>
                            </div>
                            <div className="col-2">
                              BID
                              <InfoIcon tooltip="Your bid amount" />
                            </div>
                            <div className="col-1"></div>
                          </div>

                          {/* Group selected keywords by keyword name */}
                          {Object.entries(
                            selectedKeywords.reduce((acc, keyword) => {
                              if (!acc[keyword.keyword]) {
                                acc[keyword.keyword] = []
                              }
                              acc[keyword.keyword].push(keyword)
                              return acc
                            }, {}),
                          ).map(([keywordName, matchTypes]) => (
                            <div key={keywordName} className="mb-2">
                              {matchTypes.map((keyword, index) => (
                                <div
                                  key={keyword.id}
                                  className="row align-items-center py-1"
                                  style={{
                                    backgroundColor: index === 0 ? "#f8f9fa" : "transparent",
                                    borderLeft: index === 0 ? "3px solid #dee2e6" : "3px solid transparent",
                                  }}
                                >
                                  <div className="col-4">
                                    {index === 0 ? (
                                      <div>
                                        <div style={{ fontWeight: "500", fontSize: "14px" }}>{keyword.keyword}</div>
                                      </div>
                                    ) : (
                                      <div style={{ paddingLeft: "20px" }}>{/* Empty div for spacing */}</div>
                                    )}
                                  </div>
                                  <div className="col-2">
                                    <small className="text-muted">{keyword.matchType}</small>
                                  </div>
                                  <div className="col-3">
                                    <small>₹{keyword.suggestedBid.toFixed(2)}</small>
                                  </div>
                                  <div className="col-2">
                                    <small>₹{keyword.bid}</small>
                                  </div>
                                  <div className="col-1">
                                    <button
                                      onClick={() => removeKeyword(keyword.id)}
                                      className="btn btn-link text-danger p-0"
                                      style={{ fontSize: "10px" }}
                                      title="Remove"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        )}
      </div>
      <style>
        {`
.custom-toggle-switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 15px;
}
.custom-toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.custom-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 15px;
  transition: 0.4s;
}
.custom-slider:before {
  position: absolute;
  content: "";
  height: 11px;
  width: 11px;
  left: 2px;
  top: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}
.custom-toggle-switch input:checked + .custom-slider {
  background-color: #007bff;
}
.custom-toggle-switch input:checked + .custom-slider:before {
  transform: translateX(15px);
}
`}
      </style>

    </>
  )
}

export default TargetingSection
