// src/components/productUpload/sections/PayoutDetails.js
import React, { useState } from "react";

const PayoutDetails = ({
  formData,
  isSubmitting,
  handleInputChange,
  setFormData
}) => {
  const [showGiftWrapOptions, setShowGiftWrapOptions] = useState(formData.giftWrapping);
  const [showGiftWrapCost, setShowGiftWrapCost] = useState(formData.giftWrappingCost);

  const handleGiftWrapToggle = (e) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      giftWrapping: isChecked,
      giftWrappingCustomMessage: isChecked ? prev.giftWrappingCustomMessage : '',
      giftWrappingCost: isChecked ? prev.giftWrappingCost : false,
      giftWrappingCostAmount: isChecked ? prev.giftWrappingCostAmount : ''
    }));
    setShowGiftWrapOptions(isChecked);
    if (!isChecked) setShowGiftWrapCost(false);
  };

  const handleGiftWrapCostToggle = (e) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      giftWrappingCost: isChecked,
      giftWrappingCostAmount: isChecked ? prev.giftWrappingCostAmount : ''
    }));
    setShowGiftWrapCost(isChecked);
  };



  return (
    <>
      <h4 className="mb-3">Payout Details</h4>
      <div className="form-group form-check">
        <input
          type="checkbox"
          id="autoCancelOrder"
          name="autoCancelOrder"
          className="form-check-input"
          checked={formData.autoCancelOrder}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
        <label className="form-check-label" htmlFor="autoCancelOrder">
          Auto order cancellation
        </label>
      </div>

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="giftWrapping"
          name="giftWrapping"
          className="form-check-input"
          checked={formData.giftWrapping}
          onChange={handleGiftWrapToggle}
          disabled={isSubmitting}
        />
        <label className="form-check-label" htmlFor="giftWrapping">
          Gift wrapping
        </label>
      </div>

      {showGiftWrapOptions && (
        <>
          <div className="form-group">
            <label htmlFor="giftWrappingCustomMessage">Custom message for gift wrapping</label>
            <textarea
              id="giftWrappingCustomMessage"
              name="giftWrappingCustomMessage"
              className="form-control"
              placeholder="Enter custom message for gift wrapping"
              value={formData.giftWrappingCustomMessage}
              onChange={handleInputChange}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div className="form-group form-check">
            <input
              type="checkbox"
              id="giftWrappingCost"
              name="giftWrappingCost"
              className="form-check-input"
              checked={formData.giftWrappingCost}
              onChange={handleGiftWrapCostToggle}
              disabled={isSubmitting}
            />
            <label className="form-check-label" htmlFor="giftWrappingCost">
              Extra cost for wrapping
            </label>
          </div>

          {showGiftWrapCost && (
            <div className="form-group">
              <label htmlFor="giftWrappingCostAmount">Wrapping cost amount (₹)</label>
              <input
                type="number"
                id="giftWrappingCostAmount"
                name="giftWrappingCostAmount"
                className="form-control"
                placeholder="Enter wrapping cost amount"
                min="0"
                step="0.01"
                value={formData.giftWrappingCostAmount}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
          )}
        </>
      )}
      <hr className="my-4" />
    </>
  );
};

export default PayoutDetails;