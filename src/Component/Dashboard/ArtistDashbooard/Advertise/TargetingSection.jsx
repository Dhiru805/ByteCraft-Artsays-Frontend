


import { useState, useEffect } from "react"
import getAPI from "../../../../api/getAPI"

const TargetingSection = ({
  selectedProducts,
  defaultBid: initialDefaultBid,
  onUpdateTargetingSettings,
}) => {
  const [defaultBid, setDefaultBid] = useState(initialDefaultBid || "0.00")
  const [validationErrors, setValidationErrors] = useState({})
  const [bidRanges, setBidRanges] = useState({
    default: { min: 0, max: 0 },
  })
  const [loadingBids, setLoadingBids] = useState(true)

  useEffect(() => {
    if (onUpdateTargetingSettings) {
      onUpdateTargetingSettings({
        defaultBid: Number(defaultBid),
      })
    }
  }, [defaultBid])

  useEffect(() => {
    const fetchTargetingSettings = async () => {
      if (selectedProducts && selectedProducts.length > 0) {
        const subCategoryIds = [...new Set(selectedProducts.map((product) => product.subCategory))]
        try {
          setLoadingBids(true)
          const result = await getAPI(`/api/targeting-settings/average/${subCategoryIds}`, true)
          if (result && result.data && result.data.data) {
            const { defaultBid: fetchedDefaultBid } = result.data.data
            setDefaultBid(fetchedDefaultBid.bid.toFixed(2))
            setBidRanges({
              default: {
                min: fetchedDefaultBid.range.min,
                max: fetchedDefaultBid.range.max,
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

  const handleDefaultBidChange = (value) => {
    setDefaultBid(value)
    const numValue = Number.parseFloat(value)
    const range = bidRanges.default
    let error = ""
    if (isNaN(numValue)) {
      error = "Please enter a valid number"
    } else if (numValue < range.min) {
      error = `Bid should be at least ₹${range.min}`
    } else if (numValue > range.max) {
      error = `Bid should not exceed ₹${range.max}`
    }
    setValidationErrors((prev) => ({ ...prev, default: error }))
  }

  return (
    <div className="card p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Targeting</h2>
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
          <div className="d-flex align-items-center mb-2">
            <span style={{ fontWeight: "600", color: "#0073aa", marginRight: "10px" }}>Set default bid</span>
            <span
              className="text-muted ms-1"
              style={{ cursor: "pointer" }}
              title="Use one bid amount for all targeting types."
            >
              <i className="fa fa-info-circle" style={{ fontSize: "12px" }}></i>
            </span>
          </div>
          <div className="mt-2">
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
        </div>
      )}
    </div>
  )
}

export default TargetingSection
