// src/components/common/SuccessModal.js
import React from 'react';

const SuccessModal = ({ isOpen, onClose, onSetShippingAddress, title = "Product Created Successfully!", message = "Your product has been created but cannot be approved until you set a default shipping address." }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show" 
      style={{ 
        display: 'block', 
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1050
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              <i className="fa fa-check-circle me-2"></i>
              {title}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-warning">
              <strong>Important:</strong> {message}
            </div>
            <p className="mb-3">
              Please set your default shipping address to complete the product setup process and make your product eligible for approval.
            </p>
            <div className="text-center">
              <i className="fa fa-truck fa-3x text-primary mb-3"></i>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              I'll do it later
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSetShippingAddress}
            >
              <i className="fa fa-map-marker me-2"></i>
              Set Shipping Address Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;