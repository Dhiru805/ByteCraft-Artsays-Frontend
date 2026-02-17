import React, { useState } from "react";

const GiftWrappingSection = ({
  formData,
  isSubmitting,
  handleInputChange,
  setFormData,
  readOnly = false
}) => {
  const [showGiftWrapOptions, setShowGiftWrapOptions] = useState(formData.giftWrapping || false);
  const [showGiftWrapCost, setShowGiftWrapCost] = useState(formData.giftWrappingCost || false);

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
      <h5 className="mt-4 mb-3">Gift Wrapping</h5>
      <div className="form-group form-check">
        <input
          type="checkbox"
          id="giftWrapping"
          name="giftWrapping"
          className="form-check-input"
          checked={formData.giftWrapping || false}
          onChange={readOnly ? undefined : handleGiftWrapToggle}
          disabled={isSubmitting || readOnly}
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
              placeholder={readOnly ? "No custom message" : "Enter custom message for gift wrapping"}
              value={formData.giftWrappingCustomMessage || ''}
              onChange={readOnly ? undefined : handleInputChange}
              disabled={isSubmitting || readOnly}
              rows={3}
              style={readOnly ? { backgroundColor: '#e9ecef', opacity: 0.7 } : undefined}
            />
          </div>

          <div className="form-group form-check">
            <input
              type="checkbox"
              id="giftWrappingCost"
              name="giftWrappingCost"
              className="form-check-input"
              checked={formData.giftWrappingCost || false}
              onChange={readOnly ? undefined : handleGiftWrapCostToggle}
              disabled={isSubmitting || readOnly}
            />
            <label className="form-check-label" htmlFor="giftWrappingCost">
              Extra cost for wrapping
            </label>
          </div>

          {showGiftWrapCost && (
            <div className="form-group">
              <label htmlFor="giftWrappingCostAmount">
                Wrapping cost amount ({"\u20B9"})<span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                id="giftWrappingCostAmount"
                name="giftWrappingCostAmount"
                className="form-control"
                placeholder={readOnly ? "No cost set" : "Enter wrapping cost amount"}
                min="0"
                step="0.01"
                value={formData.giftWrappingCostAmount || ''}
                onChange={readOnly ? undefined : handleInputChange}
                disabled={isSubmitting || readOnly}
                style={readOnly ? { backgroundColor: '#e9ecef', opacity: 0.7 } : undefined}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default GiftWrappingSection;
