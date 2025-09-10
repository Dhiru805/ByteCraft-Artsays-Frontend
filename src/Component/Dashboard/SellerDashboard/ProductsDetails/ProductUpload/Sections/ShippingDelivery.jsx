import React, { useState } from "react";
import Select from 'react-select';

const ShippingDelivery = ({
  formData,
  isSubmitting,
  deliveryOptions,
  packagingOptions,
  handleInputChange,
  handleSelectChange
}) => {
  const [showCustomDeliveryInput, setShowCustomDeliveryInput] = useState(false);
  const [customDeliveryValue, setCustomDeliveryValue] = useState('');

  const handleDeliveryChange = (selectedOption) => {
    if (selectedOption.value === 'custom') {
      setShowCustomDeliveryInput(true);
      handleSelectChange('estimatedDelivery', { value: '', label: '' });
    } else {
      setShowCustomDeliveryInput(false);
      handleSelectChange('estimatedDelivery', selectedOption);
    }
  };

  const handleCustomDeliveryChange = (e) => {
    const value = e.target.value;
    setCustomDeliveryValue(value);
    handleSelectChange('estimatedDelivery', { 
      value: value, 
      label: value 
    });
  };

  const handleSelfShippingToggle = (e) => {
    handleInputChange({
      target: {
        name: 'selfShipping',
        value: e.target.checked
      }
    });
  };

  return (
    <>
      <h4 className="mb-3">Shipping & Delivery</h4>

      <div className="form-group">
        <label className="d-flex align-items-center">
          <span className="mr-2">Self-Shipping:</span>
          <div className="custom-control custom-switch">
            <input
              type="checkbox"
              id="selfShipping"
              name="selfShipping"
              className="custom-control-input"
              checked={formData.selfShipping || false}
              onChange={handleSelfShippingToggle}
              disabled={isSubmitting}
            />
            <label className="custom-control-label" htmlFor="selfShipping">
              {formData.selfShipping ? 'Yes' : 'No'}
            </label>
          </div>
        </label>
        {formData.selfShipping && (
          <div className="alert alert-info mt-2">
            <strong>Self-Shipping Note:</strong> You're responsible for all shipping arrangements. 
            Ensure you provide accurate delivery estimates and package items securely.
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="shippingCharges">Shipping Charges (₹) <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          id="shippingCharges"
          name="shippingCharges"
          className="form-control"
          placeholder="Enter shipping charges (0 for free shipping)"
          min="0"
          step="0.01"
          value={formData.shippingCharges}
          onChange={handleInputChange}
          required
          disabled={isSubmitting}
        />
        <small className="text-muted">Enter 0 for free shipping</small>
      </div>

      <div className="form-group">
        <label>Estimated Delivery Time <span style={{ color: 'red' }}>*</span></label>
        {!showCustomDeliveryInput ? (
          <Select
            options={[
              ...deliveryOptions,
              { value: 'custom', label: 'Custom delivery time...' }
            ]}
            value={formData.estimatedDelivery}
            onChange={handleDeliveryChange}
            placeholder="Select delivery time"
            isSearchable
            required
            isDisabled={isSubmitting}
          />
        ) : (
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter custom delivery time (e.g., '2-3 weeks')"
              value={customDeliveryValue}
              onChange={handleCustomDeliveryChange}
              required
              disabled={isSubmitting}
            />
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setShowCustomDeliveryInput(false);
                  setCustomDeliveryValue('');
                  handleSelectChange('estimatedDelivery', null);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Packaging Type <span style={{ color: 'red' }}>*</span></label>
        <Select
          options={packagingOptions}
          value={formData.packagingType}
          onChange={(selected) => handleSelectChange('packagingType', selected)}
          placeholder="Select packaging type"
          isSearchable
          required
          isDisabled={isSubmitting}
        />
      </div>

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="insuranceCoverage"
          name="insuranceCoverage"
          className="form-check-input"
          checked={formData.insuranceCoverage}
          onChange={handleInputChange}
          disabled={isSubmitting}
        />
        <label className="form-check-label" htmlFor="insuranceCoverage">
          Include insurance coverage
        </label>
        <small className="text-muted d-block">(Recommended for high-value items)</small>
      </div>

      <hr className="my-4" />
    </>
  );
};

export default ShippingDelivery;