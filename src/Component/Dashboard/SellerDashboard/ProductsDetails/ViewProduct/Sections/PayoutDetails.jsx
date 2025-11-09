// src/components/productUpload/sections/PayoutDetails.js
import React, { useState } from "react";

const PayoutDetails = ({
  formData,
  isSubmitting,
  handleInputChange,
  setFormData
}) => {
  // Preserve conditional rendering based on current formData
  const [showGiftWrapOptions] = useState(formData.giftWrapping);
  const [showGiftWrapCost] = useState(formData.giftWrappingCost);

  return (
    <>
      <h4 className="mb-3">Payout Details</h4>

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="autoCancelOrder"
          name="autoCancelOrder"
          className="form-check-input"
          checked={formData.autoCancelOrder || false}
          disabled={true}
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
          checked={formData.giftWrapping || false}
          disabled={true}
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
              placeholder="No custom message"
              value={formData.giftWrappingCustomMessage || ''}
              disabled={true}
              rows={3}
              style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
            />
          </div>

          <div className="form-group form-check">
            <input
              type="checkbox"
              id="giftWrappingCost"
              name="giftWrappingCost"
              className="form-check-input"
              checked={formData.giftWrappingCost || false}
              disabled={true}
            />
            <label className="form-check-label" htmlFor="giftWrappingCost">
              Extra cost for wrapping
            </label>
          </div>

          {showGiftWrapCost && (
            <div className="form-group">
              <label htmlFor="giftWrappingCostAmount">
                Wrapping cost amount (₹)<span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                id="giftWrappingCostAmount"
                name="giftWrappingCostAmount"
                className="form-control"
                placeholder="No cost set"
                min="0"
                step="0.01"
                value={formData.giftWrappingCostAmount || ''}
                disabled={true}
                style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
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