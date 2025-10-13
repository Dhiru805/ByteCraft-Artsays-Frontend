
import React, { useState, useEffect } from "react";
import Select from 'react-select';
import getAPI from "../../../../../../api/getAPI";

const installmentOptions = [
  { value: 'yearly', label: "1 Year" },
  { value: 'lifetime', label: "Lifetime" }
];

const PricingOffers = ({
  pricingData,
  finalPrice,
  isSubmitting,
  offerOptions,
  handlePricingChange,
  handleOffersChange,
  handleInstallmentDurationChange,
  mainCategoryId 
}) => {
  const [subGSTSettings, setSubGSTSettings] = useState([]);
  const [gstPercentage, setGstPercentage] = useState(pricingData.gstPercentage || 0);
  const [isLoadingGST, setIsLoadingGST] = useState(false);
  const [gstError, setGstError] = useState(null);
  const [marketPriceError, setMarketPriceError] = useState("");

  const fetchSubGSTData = async () => {
    if (!mainCategoryId) {
      console.warn("mainCategoryId is not provided, skipping API call");
      if (!pricingData.includeGst) {
        setGstPercentage(0);
        handlePricingChange({ target: { name: 'gstPercentage', value: 0 } });
      }
      return;
    }

    setIsLoadingGST(true);
    setGstError(null);
    console.log("Fetching GST data for mainCategoryId:", mainCategoryId);

    try {
      const response = await getAPI(`/api/get-gst-setting?mainCategoryId=${mainCategoryId}`, {}, true);
      console.log("API Response:", response);

      if (
        !response.hasError &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        const gstData = response.data.data.find(item => item.mainCategoryId._id === mainCategoryId);
        if (gstData && gstData.percentage) {
          console.log("Found GST percentage:", gstData.percentage);
          if (!pricingData.includeGst) {
            setGstPercentage(gstData.percentage);
            handlePricingChange({
              target: { name: 'gstPercentage', value: gstData.percentage }
            });
          }
        } else {
          console.warn("No GST data found for mainCategoryId:", mainCategoryId);
          if (!pricingData.includeGst) {
            setGstPercentage(0);
            handlePricingChange({ target: { name: 'gstPercentage', value: 0 } });
          }
        }
        setSubGSTSettings(response.data.data);
      } else {
        console.error("Invalid response format:", response);
        setGstError("Invalid response format from server");
        if (!pricingData.includeGst) {
          setGstPercentage(0);
          handlePricingChange({ target: { name: 'gstPercentage', value: 0 } });
        }
      }
    } catch (err) {
      console.error("Error fetching GST data:", err);
      setGstError("Failed to fetch GST settings");
      if (!pricingData.includeGst) {
        setGstPercentage(0);
        handlePricingChange({ target: { name: 'gstPercentage', value: 0 } });
      }
    } finally {
      setIsLoadingGST(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with mainCategoryId:", mainCategoryId);
    if (mainCategoryId) {
      fetchSubGSTData();
    }
  }, [mainCategoryId]);


  useEffect(() => {
    if (pricingData.includeGst) {
      setGstPercentage("");
      handlePricingChange({ target: { name: 'gstPercentage', value: 0 } });
    } else {
      fetchSubGSTData();
    }
  }, [pricingData.includeGst]);

  const validateMarketPrice = (marketPrice, sellingPrice) => {
    if (marketPrice && sellingPrice && Number(marketPrice) <= Number(sellingPrice)) {
      setMarketPriceError("Market price must be greater than selling price.");
    } else {
      setMarketPriceError("");
    }
  };

  const handleMarketPriceChange = (e) => {
    const value = e.target.value;
    handlePricingChange(e);
    validateMarketPrice(value, pricingData.sellingPrice);
  };

  const calculateFinalPriceWithGST = () => {
    let baseFinalPrice = finalPrice;
    if (!pricingData.includeGst && gstPercentage !== "" && !isNaN(gstPercentage) && gstPercentage > 0) {
      const gstAmount = (gstPercentage / 100) * baseFinalPrice;
      return baseFinalPrice + gstAmount;
    }
    return baseFinalPrice;
  };

  const finalPriceWithGST = calculateFinalPriceWithGST();
  const gstAmount = (!pricingData.includeGst && gstPercentage !== "" && !isNaN(gstPercentage) && gstPercentage > 0)
    ? (gstPercentage / 100) * finalPrice
    : 0;

  return (
    <>
      <h4 className="mb-3">Pricing & Offers</h4>

      {isLoadingGST && <div className="alert alert-info">Loading GST settings...</div>}
      {gstError && <div className="alert alert-danger">{gstError}</div>}

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="sellingPrice">Selling Price (₹) <span style={{ color: 'red' }}>*</span></label>
            <input
              type="number"
              id="sellingPrice"
              name="sellingPrice"
              className="form-control"
              placeholder="Enter selling price"
              min="0"
              step="0.01"
              value={pricingData.sellingPrice}
              onChange={(e) => {
                handlePricingChange(e);
                validateMarketPrice(pricingData.marketPrice, e.target.value);
              }}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="marketPrice">Market Price (₹)</label>
            <input
              type="number"
              id="marketPrice"
              name="marketPrice"
              className={`form-control ${marketPriceError ? 'is-invalid' : ''}`}
              placeholder="Enter market price"
              min="0"
              step="0.01"
              value={pricingData.marketPrice}
              onChange={handleMarketPriceChange}
              disabled={isSubmitting}
            />
            <small className="text-muted">Original price for comparison</small>
            {marketPriceError && (
              <div className="invalid-feedback">{marketPriceError}</div>
            )}
          </div>
        </div>
      </div>

          {!pricingData.includeGst && gstPercentage > 0 && (
        <div className="alert alert-info mt-2">
          <strong>GST Note:</strong> The final price includes a GST amount of ₹{gstAmount.toFixed(2)} 
          ({gstPercentage}% of ₹{finalPrice.toFixed(2)} base price), 
          resulting in ₹{finalPriceWithGST.toFixed(2)}.
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              className="form-control"
              placeholder="Enter discount percentage"
              min="0"
              max="100"
              step="0.1"
              value={pricingData.discount}
              onChange={handlePricingChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="form-group">
            <label>Final Price After Discount (₹) <span style={{ color: 'red' }}>*</span></label>
            <input
              type="text"
              className="form-control bg-light"
              value={`₹${finalPriceWithGST.toFixed(2)}`}
              readOnly
            />
            {!pricingData.includeGst && gstPercentage > 0 && (
              <small className="text-muted">
                Includes GST ({gstPercentage}%)
              </small>
            )}
          </div>
        </div>
      </div>

  

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="includeGst"
          name="includeGst"
          className="form-check-input"
          checked={pricingData.includeGst}
          onChange={handlePricingChange}
          disabled={isSubmitting}
        />
        <label className="form-check-label" htmlFor="includeGst">
          Include GST in Pricing
        </label>
      </div>

      <div className="form-group" style={{ paddingLeft: 0, marginLeft: 0 }}>
        <label htmlFor="gstPercentage">GST Percentage (%) <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          id="gstPercentage"
          name="gstPercentage"
          className="form-control"
          placeholder="GST percentage"
          min="0"
          max="100"
          step="0.1"
          value={gstPercentage}
          onChange={(e) => {
            const value = e.target.value;
            setGstPercentage(value);
            handlePricingChange({ target: { name: 'gstPercentage', value: value || 0 } });
          }}
          disabled={!pricingData.includeGst || isSubmitting}
          required
        />
        <small className="text-muted">
          {pricingData.includeGst
            ? "Enter the GST percentage ."
            : "GST percentage is automatically set based on the main category."}
        </small>
      </div>

      <div className="form-group">
        <label>Offers & Coupons</label>
        <Select
          options={offerOptions}
          value={pricingData.offers}
          onChange={handleOffersChange}
          placeholder="Select applicable offers"
          isMulti
          isSearchable
          isDisabled={isSubmitting}
        />
      </div>

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="allowInstallments"
          name="allowInstallments"
          className="form-check-input"
          checked={pricingData.allowInstallments}
          onChange={handlePricingChange}
          disabled={isSubmitting}
        />
        <label className="form-check-label" htmlFor="allowInstallments">
          Would you like to secure your product with insurance for lifetime or for a year?
        </label>
      </div>

      {pricingData.allowInstallments && (
        <div className="form-group" style={{ paddingLeft: 0, marginLeft: 0 }}>
          <label htmlFor="installmentDuration">Installment Option <span style={{ color: 'red' }}>*</span></label>
          <Select
            id="installmentDuration"
            options={installmentOptions}
            value={pricingData.installmentDuration}
            onChange={handleInstallmentDurationChange}
            placeholder="Choose EMI duration"
            isDisabled={isSubmitting}
          />
          <small>
            <a href="/installment-details" target="_blank" rel="noopener noreferrer">
              View Installment Details
            </a>
          </small>
        </div>
      )}

      <hr className="my-4" />
    </>
  );
};

export default PricingOffers;