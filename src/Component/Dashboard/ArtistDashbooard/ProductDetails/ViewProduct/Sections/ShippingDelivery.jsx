import React from "react";
import Select from 'react-select';

const ShippingDelivery = ({
  formData,
  isSubmitting,
  deliveryOptions,
  packagingOptions,
  handleInputChange,
  handleSelectChange
}) => {
  // Preserve conditional rendering based on current formData
  const showCustomDeliveryInput = formData.estimatedDelivery?.value === 'custom';
  const showCustomHandlingInput = formData.handlingTime?.value === 'custom';

  const returnPolicyOptions = [
    { value: 'returnable', label: 'Returnable' },
    { value: 'non-returnable', label: 'Non-returnable' }
  ];

  const handlingTimeOptions = [
    { value: '1-2 days', label: '1-2  days' },
    { value: '3-5 days', label: '3-5  days' },
    { value: '5-7 days', label: '5-7  days' },
    { value: 'custom', label: 'Custom handling time...' }
  ];

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
              disabled={true}
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
        <label>Shipping Charges (₹) <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          className="form-control bg-light"
          value={formData.shippingCharges ? `₹${Number(formData.shippingCharges).toFixed(2)}` : 'Free Shipping'}
          readOnly
          style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
        />
        <small className="text-muted">Enter 0 for free shipping</small>
      </div>

      <div className="form-group">
        <label>Estimated Handling Time <span style={{ color: 'red' }}>*</span></label>
        {!showCustomHandlingInput ? (
          <Select
            options={handlingTimeOptions}
            value={formData.handlingTime}
            onChange={() => {}}
            placeholder="—"
            isSearchable={false}
            isDisabled={true}
            styles={{
              control: (base) => ({ ...base, backgroundColor: '#e9ecef', opacity: 0.7 }),
              singleValue: (base) => ({ ...base, color: '#495057' })
            }}
          />
        ) : (
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Custom handling time"
              value={formData.handlingTime?.label || formData.handlingTime || ''}
              readOnly
              style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
            />
          </div>
        )}
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
            onChange={() => {}}
            placeholder="—"
            isSearchable={false}
            isDisabled={true}
            styles={{
              control: (base) => ({ ...base, backgroundColor: '#e9ecef', opacity: 0.7 }),
              singleValue: (base) => ({ ...base, color: '#495057' })
            }}
          />
        ) : (
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Custom delivery time"
              value={formData.estimatedDelivery?.label || formData.estimatedDelivery || ''}
              readOnly
              style={{ backgroundColor: '#e9ecef', opacity: 0.7 }}
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Packaging Type <span style={{ color: 'red' }}>*</span></label>
        <Select
          options={packagingOptions}
          value={formData.packagingType}
          onChange={() => {}}
          placeholder="—"
          isSearchable={false}
          isDisabled={true}
          styles={{
            control: (base) => ({ ...base, backgroundColor: '#e9ecef', opacity: 0.7 }),
            singleValue: (base) => ({ ...base, color: '#495057' })
          }}
        />
      </div>

      <div className="form-group">
        <label>Return Policy <span style={{ color: 'red' }}>*</span></label>
        <Select
          options={returnPolicyOptions}
          value={formData.returnPolicy}
          onChange={() => {}}
          placeholder="—"
          isSearchable={false}
          isDisabled={true}
          styles={{
            control: (base) => ({ ...base, backgroundColor: '#e9ecef', opacity: 0.7 }),
            singleValue: (base) => ({ ...base, color: '#495057' })
          }}
        />
      </div>

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="insuranceCoverage"
          name="insuranceCoverage"
          className="form-check-input"
          checked={formData.insuranceCoverage || false}
          disabled={true}
        />
        <label className="form-check-label" htmlFor="insuranceCoverage">
          Include insurance coverage
        </label>
        <small className="text-muted d-block">(Recommended for high-value items)</small>
      </div>

      <div className="form-group form-check">
        <input
          type="checkbox"
          id="exportRestriction"
          name="exportRestriction"
          className="form-check-input"
          checked={formData.exportRestriction || false}
          disabled={true}
        />
        <label className="form-check-label" htmlFor="exportRestriction">
          Export Restrictions Apply
        </label>
        <small className="text-muted d-block">(Check if this item is subject to export controls or restrictions)</small>
      </div>

      <hr className="my-4" />
    </>
  );
};

export default ShippingDelivery;