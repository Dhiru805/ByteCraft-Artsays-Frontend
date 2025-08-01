import { useState, useEffect } from "react";
import getAPI from "../../../../api/getAPI"; 

const TargetingSection = ({ selectedProducts }) => {
  const [targetingType, setTargetingType] = useState("automatic");
  const [showAutomaticTargeting, setShowAutomaticTargeting] = useState(true);
  const [automaticBidType, setAutomaticBidType] = useState("default");
  const [defaultBid, setDefaultBid] = useState("0.00");
  const [showBidPricingHelp, setShowBidPricingHelp] = useState(false);
  const [showTargetingHelp, setShowTargetingHelp] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [bidRanges, setBidRanges] = useState({
    default: { min: 0, max: 0 },
    closeMatch: { min: 0, max: 0 },
    looseMatch: { min: 0, max: 0 },
    substitutes: { min: 0, max: 0 },
    complements: { min: 0, max: 0 },
  });
  const [targetingGroups, setTargetingGroups] = useState({
    closeMatch: { enabled: true, bid: "0.00" },
    looseMatch: { enabled: true, bid: "0.00" },
    substitutes: { enabled: true, bid: "0.00" },
    complements: { enabled: true, bid: "0.00" },
  });
  const [loadingBids, setLoadingBids] = useState(true);

  useEffect(() => {
    const fetchTargetingSettings = async () => {
      if (selectedProducts && selectedProducts.length > 0) {
        const subCategoryIds = [...new Set(selectedProducts.map((product) => product.subCategory))];
        try {
          setLoadingBids(true);
          const result = await getAPI(
            `/api/targeting-settings/average/${subCategoryIds}`,
           true
          );
          if (result && result.data && result.data.data) {
            const { defaultBid: fetchedDefaultBid, targetingGroups: fetchedGroups } = result.data.data;
            setDefaultBid(fetchedDefaultBid.bid.toFixed(2));
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
            });

            setTargetingGroups({
              closeMatch: {
                enabled: true,
                bid: fetchedGroups.closeMatch.bid.toFixed(2),
              },
              looseMatch: {
                enabled: true,
                bid: fetchedGroups.looseMatch.bid.toFixed(2),
              },
              substitutes: {
                enabled: true,
                bid: fetchedGroups.substitutes.bid.toFixed(2),
              },
              complements: {
                enabled: true,
                bid: fetchedGroups.complements.bid.toFixed(2),
              },
            });
          }
        } catch (error) {
          console.error("Error fetching targeting settings:", error)
        } finally {
          setLoadingBids(false);
        }
      } else {
        setLoadingBids(false);
      }
    };

    fetchTargetingSettings();
  }, [selectedProducts]);

  const handleTargetingChange = (type) => {
    setTargetingType(type);
    setShowAutomaticTargeting(type === "automatic");
  };

  const validateBid = (value, type) => {
    const numValue = Number.parseFloat(value);
    const range = bidRanges[type];

    if (isNaN(numValue)) {
      return "Please enter a valid number";
    }

    if (numValue < range.min) {
      return `Bid should be at least ₹${range.min}`;
    }

    if (numValue > range.max) {
      return `Bid should not exceed ₹${range.max}`;
    }

    return "";
  };

  const handleDefaultBidChange = (value) => {
    setDefaultBid(value);
    const error = validateBid(value, "default");
    setValidationErrors((prev) => ({ ...prev, default: error }));
  };

  const updateTargetingGroup = (group, field, value) => {
    setTargetingGroups((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value,
      },
    }));

    if (field === "bid") {
      const error = validateBid(value, group);
      setValidationErrors((prev) => ({ ...prev, [group]: error }));
    }
  };

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
  );

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

          <div className="mb-4">
            <h6 className="font-weight-bold mb-3">
              <i className="fa fa-users text-primary me-2"></i>
              Match Types Explained
            </h6>

            <div className="mb-3">
              <div className="border rounded p-3">
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2">⚡</span>
                  <span className="font-weight-bold">Close Match</span>
                  <span className="badge badge-warning text-dark ms-2" style={{ fontSize: "10px" }}>
                    High Relevance
                  </span>
                </div>
                <p className="small text-muted mb-1">
                  Targets customers searching for products very similar to yours. Highest conversion potential.
                </p>
                <small className="text-muted">Suggested: ₹{bidRanges.closeMatch.min} - ₹{bidRanges.closeMatch.max}</small>
              </div>
            </div>

            <div className="mb-3">
              <div className="border rounded p-3">
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2">🎯</span>
                  <span className="font-weight-bold">Loose Match</span>
                  <span className="badge badge-primary ms-2" style={{ fontSize: "10px" }}>
                    Medium Relevance
                  </span>
                </div>
                <p className="small text-muted mb-1">
                  Broader targeting for related products. Good for discovery and expanding reach.
                </p>
                <small className="text-muted">Suggested: ₹{bidRanges.looseMatch.min} - ₹{bidRanges.looseMatch.max}</small>
              </div>
            </div>

            <div className="mb-3">
              <div className="border rounded p-3">
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2">👥</span>
                  <span className="font-weight-bold">Substitutes</span>
                  <span className="badge badge-secondary ms-2" style={{ fontSize: "10px" }}>
                    Alternative Products
                  </span>
                </div>
                <p className="small text-muted mb-1">
                  Products that can replace yours. Competitive but valuable for market share.
                </p>
                <small className="text-muted">Suggested: ₹{bidRanges.substitutes.min} - ₹{bidRanges.substitutes.max}</small>
              </div>
            </div>

            <div className="mb-3">
              <div className="border rounded p-3">
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2">✅</span>
                  <span className="font-weight-bold">Complements</span>
                  <span className="badge badge-success ms-2" style={{ fontSize: "10px" }}>
                    Add-on Products
                  </span>
                </div>
                <p className="small text-muted mb-1">
                  Products that work well with yours. Great for cross-selling opportunities.
                </p>
                <small className="text-muted">Suggested: ₹{bidRanges.complements.min} - ₹{bidRanges.complements.max}</small>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="font-weight-bold mb-2">Best Practices</h6>
            <div className="d-flex align-items-start mb-2" style={{ gap: "8px" }}>
              <i className="fa fa-check-circle text-success mt-1" style={{ fontSize: "12px" }}></i>
              <small className="text-muted">Start with suggested bid ranges for optimal performance</small>
            </div>
            <div className="d-flex align-items-start mb-2" style={{ gap: "8px" }}>
              <i className="fa fa-check-circle text-success mt-1" style={{ fontSize: "12px" }}></i>
              <small className="text-muted">Monitor performance and adjust bids based on conversion data</small>
            </div>
            <div className="d-flex align-items-start mb-2" style={{ gap: "8px" }}>
              <i className="fa fa-check-circle text-success mt-1" style={{ fontSize: "12px" }}></i>
              <small className="text-muted">Use higher bids for high-converting match types</small>
            </div>
            <div className="d-flex align-items-start" style={{ gap: "8px" }}>
              <i className="fa fa-check-circle text-success mt-1" style={{ fontSize: "12px" }}></i>
              <small className="text-muted">Consider your profit margins when setting maximum bids</small>
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
  );

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
  );

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
                  <span style={{ fontWeight: "600", color: "#0073aa" }}>Automatic targeting</span>
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
                  <span style={{ fontWeight: "600" }}>Manual targeting</span>
                  <InfoIcon tooltip="You manually select specific keywords and products to target" />
                </div>
                <br />
                <span className="text-muted" style={{ fontSize: "14px" }}>
                  Choose keywords or products to target shopper searches and set custom bids.
                </span>
              </label>
            </div>
            {showAutomaticTargeting && (
              <div className="mt-3">
                <div className="d-flex align-items-center mb-3">
                  <h3 className="mb-0">Automatic Targeting</h3>
                  <button
                    onClick={() => setShowBidPricingHelp(!showBidPricingHelp)}
                    className="btn btn-link text-primary p-0 ms-auto"
                    style={{ fontSize: "14px", textDecoration: "none" }}
                  >
                    <i className="fa fa-info-circle me-1"></i>
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
                      <span style={{ fontWeight: "600", color: "#0073aa" }}>Set default bid</span>
                      <InfoIcon tooltip="Use one bid amount for all targeting types. Simple setup but less optimization control." />
                    </div>
                    <br />
                    {automaticBidType === "default" && (
                      <div className="mt-2 ms-4">
                        <div className="d-flex justify-content-between align-items-start" style={{ maxWidth: "600px" }}>
                          <div className="text-muted" style={{ fontSize: "14px" }}>
                            <div>Suggested bid for regular days</div>
                            <div className="fw-bold text-dark">₹{defaultBid}</div>
                            <div className="text-muted">(₹{bidRanges.default.min}-₹{bidRanges.default.max})</div>
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
                      <span style={{ fontWeight: "600" }}>Set bids by targeting group</span>
                      <InfoIcon tooltip="Set different bids for each match type. Provides better control and optimization opportunities." />
                    </div>
                  </label>
                </div>

                {automaticBidType === "targeting" && (
                  <div className="mt-3 ms-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#6c757d" }}>TARGETING GROUPS</span>
                        <InfoIcon tooltip="Different match types help you reach customers at various stages of their shopping journey" />
                      </div>
                      <span style={{ fontSize: "14px", color: "#6c757d" }}>Suggested bid for regular days</span>
                      <div className="d-flex align-items-center">
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#6c757d" }}>BID</span>
                        <InfoIcon tooltip="Your maximum bid amount for each targeting group. Stay within suggested ranges for best results." />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div className="d-flex align-items-center">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            id="closeMatchCheck"
                            className="form-check-input"
                            checked={targetingGroups.closeMatch.enabled}
                            onChange={(e) => updateTargetingGroup("closeMatch", "enabled", e.target.checked)}
                          />
                        </div>
                        <div className="d-flex align-items-center ms-2">
                          <span style={{ fontWeight: "500" }}>Close match</span>
                          <InfoIcon tooltip="Targets customers searching for products very similar to yours. High conversion potential with lower competition." />
                        </div>
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        <div style={{ fontWeight: "500" }}>₹{targetingGroups.closeMatch.bid}</div>
                        <div className="text-muted">(₹{bidRanges.closeMatch.min}-₹{bidRanges.closeMatch.max})</div>
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
                            value={targetingGroups.closeMatch.bid}
                            onChange={(e) => updateTargetingGroup("closeMatch", "bid", e.target.value)}
                            className={`form-control ${validationErrors.closeMatch ? "border-danger" : ""}`}
                            style={{ paddingLeft: "24px", width: "80px", fontSize: "12px" }}
                            disabled={!targetingGroups.closeMatch.enabled}
                          />
                        </div>
                        {validationErrors.closeMatch && (
                          <div className="text-danger mt-1" style={{ fontSize: "10px", width: "80px" }}>
                            {validationErrors.closeMatch}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div className="d-flex align-items-center">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            id="looseMatchCheck"
                            className="form-check-input"
                            checked={targetingGroups.looseMatch.enabled}
                            onChange={(e) => updateTargetingGroup("looseMatch", "enabled", e.target.checked)}
                          />
                        </div>
                        <div className="d-flex align-items-center ms-2">
                          <span style={{ fontWeight: "500" }}>Loose match</span>
                          <InfoIcon tooltip="Broader targeting for related products and categories. Good for discovery and expanding reach." />
                        </div>
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        <div style={{ fontWeight: "500" }}>₹{targetingGroups.looseMatch.bid}</div>
                        <div className="text-muted">(₹{bidRanges.looseMatch.min}-₹{bidRanges.looseMatch.max})</div>
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
                            value={targetingGroups.looseMatch.bid}
                            onChange={(e) => updateTargetingGroup("looseMatch", "bid", e.target.value)}
                            className={`form-control ${validationErrors.looseMatch ? "border-danger" : ""}`}
                            style={{ paddingLeft: "24px", width: "80px", fontSize: "12px" }}
                            disabled={!targetingGroups.looseMatch.enabled}
                          />
                        </div>
                        {validationErrors.looseMatch && (
                          <div className="text-danger mt-1" style={{ fontSize: "10px", width: "80px" }}>
                            {validationErrors.looseMatch}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div className="d-flex align-items-center">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            id="substitutesCheck"
                            className="form-check-input"
                            checked={targetingGroups.substitutes.enabled}
                            onChange={(e) => updateTargetingGroup("substitutes", "enabled", e.target.checked)}
                          />
                        </div>
                        <div className="d-flex align-items-center ms-2">
                          <span style={{ fontWeight: "500" }}>Substitutes</span>
                          <InfoIcon tooltip="Products that can replace or substitute yours. Competitive targeting to capture market share." />
                        </div>
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        <div style={{ fontWeight: "500" }}>₹{targetingGroups.substitutes.bid}</div>
                        <div className="text-muted">(₹{bidRanges.substitutes.min}-₹{bidRanges.substitutes.max})</div>
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
                            value={targetingGroups.substitutes.bid}
                            onChange={(e) => updateTargetingGroup("substitutes", "bid", e.target.value)}
                            className={`form-control ${validationErrors.substitutes ? "border-danger" : ""}`}
                            style={{ paddingLeft: "24px", width: "80px", fontSize: "12px" }}
                            disabled={!targetingGroups.substitutes.enabled}
                          />
                        </div>
                        {validationErrors.substitutes && (
                          <div className="text-danger mt-1" style={{ fontSize: "10px", width: "80px" }}>
                            {validationErrors.substitutes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center py-2">
                      <div className="d-flex align-items-center">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            id="complementsCheck"
                            className="form-check-input"
                            checked={targetingGroups.complements.enabled}
                            onChange={(e) => updateTargetingGroup("complements", "enabled", e.target.checked)}
                          />
                        </div>
                        <div className="d-flex align-items-center ms-2">
                          <span style={{ fontWeight: "500" }}>Complements</span>
                          <InfoIcon tooltip="Products that work well together with yours. Great for cross-selling and upselling opportunities." />
                        </div>
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        <div style={{ fontWeight: "500" }}>₹{targetingGroups.complements.bid}</div>
                        <div className="text-muted">(₹{bidRanges.complements.min}-₹{bidRanges.complements.max})</div>
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
                            value={targetingGroups.complements.bid}
                            onChange={(e) => updateTargetingGroup("complements", "bid", e.target.value)}
                            className={`form-control ${validationErrors.complements ? "border-danger" : ""}`}
                            style={{ paddingLeft: "24px", width: "80px", fontSize: "12px" }}
                            disabled={!targetingGroups.complements.enabled}
                          />
                        </div>
                        {validationErrors.complements && (
                          <div className="text-danger mt-1" style={{ fontSize: "10px", width: "80px" }}>
                            {validationErrors.complements}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <BidPricingPopover />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TargetingSection;