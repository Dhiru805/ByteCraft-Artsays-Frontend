// src/components/productUpload/sections/PricingOffers.js
import React from "react";
import Select from 'react-select';
import GiftWrappingSection from "./GiftWrappingSection";

const installmentOptions = [
  { value: 3, label: "3 months" },
  { value: 6, label: "6 months" },
  { value: 9, label: "9 months" },
  { value: 12, label: "12 months" },
  { value: 24, label: "24 months" }
];

const PricingOffers = ({
  pricingData,
  finalPrice,
  isSubmitting,
  offerOptions,
  handlePricingChange,
  handleOffersChange,
  handleInstallmentDurationChange,
  formData,
  setFormData,
  handleInputChange
}) => (
  <>
    <style>{`
      .selling-price-info-icon:hover .selling-price-tooltip {
        visibility: visible !important;
        opacity: 1 !important;
      }
      .market-price-info-icon:hover .market-price-tooltip {
        visibility: visible !important;
        opacity: 1 !important;
      }
    `}</style>
    <h4 className="mb-3">Pricing & Offers</h4>

    <div className="row">
      <div className="col-md-6">
        <div className="form-group">
          <label htmlFor="sellingPrice">
            Selling Price (₹) *
            <span style={{ position: "relative", display: "inline-block", marginLeft: "6px", cursor: "pointer" }}
              className="selling-price-info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ verticalAlign: "middle", marginBottom: "2px" }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{
                visibility: "hidden",
                opacity: 0,
                width: "280px",
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: "6px",
                padding: "10px 12px",
                position: "absolute",
                zIndex: 9999,
                top: "125%",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "12px",
                lineHeight: "1.5",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                transition: "opacity 0.2s",
                pointerEvents: "none",
                whiteSpace: "normal"
              }} className="selling-price-tooltip">
                Selling Price is the amount a buyer will pay for your artwork. Set it based on the time, effort, materials, size, and skill involved. If you are new, keep the price slightly lower to attract buyers and build trust.<br /><br />
                <em>Example: If your artwork feels worth ₹10,000, starting at ₹8,000–₹9,000 is a smart choice.</em>
              </span>
            </span>
          </label>
          <input
            type="number"
            id="sellingPrice"
            name="sellingPrice"
            className="form-control"
            placeholder="Enter selling price"
            min="0"
            step="0.01"
            value={pricingData.sellingPrice}
            onChange={handlePricingChange}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="form-group">
          <label htmlFor="marketPrice">
            Market Price (₹)
            <span style={{ position: "relative", display: "inline-block", marginLeft: "6px", cursor: "pointer" }}
              className="market-price-info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ verticalAlign: "middle", marginBottom: "2px" }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{
                visibility: "hidden",
                opacity: 0,
                width: "280px",
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: "6px",
                padding: "10px 12px",
                position: "absolute",
                zIndex: 9999,
                top: "125%",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "12px",
                lineHeight: "1.5",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                transition: "opacity 0.2s",
                pointerEvents: "none",
                whiteSpace: "normal"
              }} className="market-price-tooltip">
                Market Price is the estimated value of your artwork in the general art market. It is based on your skill level, time spent, materials used, size of the artwork, and prices of similar artworks. This helps buyers understand the true worth of your art.<br /><br />
                <em>Example: If similar artworks are usually priced around ₹10,000, your market price should be close to that value.</em>
              </span>
            </span>
          </label>
          <input
            type="number"
            id="marketPrice"
            name="marketPrice"
            className="form-control"
            placeholder="Enter market price"
            min="0"
            step="0.01"
            value={pricingData.marketPrice}
            onChange={handlePricingChange}
            disabled={isSubmitting}
          />
          <small className="text-muted">Original price for comparison</small>
        </div>
      </div>
    </div>

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
          <label>Final Price After Discount (₹) *</label>
          <input
            type="text"
            className="form-control bg-light"
            value={`₹${finalPrice.toFixed(2)}`}
            readOnly
          />
        </div>
      </div>
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
        Allow payment in installments (EMI)
      </label>
    </div>

    {pricingData.allowInstallments && (
      <div className="form-group" style={{ paddingLeft: 0, marginLeft: 0 }}>
        <label htmlFor="installmentDuration">Select Installment Duration <span style={{ color: 'red' }}>*</span></label>
        <Select
          id="installmentDuration"
          options={installmentOptions}
          value={pricingData.installmentDuration}
          onChange={handleInstallmentDurationChange}
          placeholder="Choose EMI duration"
          isDisabled={isSubmitting}
        />
      </div>
    )}

    {formData && setFormData && (
      <GiftWrappingSection
        formData={formData}
        isSubmitting={isSubmitting}
        handleInputChange={handleInputChange}
        setFormData={setFormData}
      />
    )}

    <hr className="my-4" />
  </>
);

export default PricingOffers;
