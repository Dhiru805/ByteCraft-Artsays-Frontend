// src/components/productUpload/sections/PricingOffers.js
import React from "react";
import Select from 'react-select';

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
  handleInstallmentDurationChange
}) => (
  <>
    <h4 className="mb-3">Pricing & Offers</h4>

    <div className="row">
      <div className="col-md-6">
        <div className="form-group">
          <label htmlFor="sellingPrice">Selling Price (₹) *</label>
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
          <label htmlFor="marketPrice">Market Price (₹)</label>
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

    <hr className="my-4" />
  </>
);
    </div>
        <hr className="my-4" />
  </>
);

export default PricingOffers;