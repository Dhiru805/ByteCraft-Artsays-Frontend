// src/components/productUpload/sections/ImagesMedia.js
import React, { useState } from "react";
import { createPortal } from "react-dom";

const ImagesMedia = ({
  images,
  fileInputRef,
  formData,
  isSubmitting,
  handleImageUpload,
  handleRemoveImage,
  handleReplaceImage,
  handleMoveImage,
  handleInputChange
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <h4 className="mb-3">Images and Media</h4>

      <div className="form-group">
        <label>Product Images</label>
        <div className="d-flex flex-wrap">
          {images.map((image, index) => (
            <div
              key={index}
              className="position-relative m-2"
              style={{ width: '150px', height: '150px', cursor: 'pointer' }}
              onClick={() => setSelectedImage(image.preview)}
            >
              <img
                src={image.preview}
                alt={`Preview ${index}`}
                className="img-thumbnail w-100 h-100 object-fit-cover"
                style={{
                  border: index === 0 ? '3px solid #007bff' : '1px solid #dee2e6',
                }}
              />
            </div>
          ))}

          {images.length === 0 && (
            <div className="text-muted p-3 border rounded w-100 text-center bg-light">
              No images uploaded for this product.
            </div>
          )}
        </div>

        <small className="text-muted d-block mt-2">
          Click on any image to view it in full size.
        </small>
      </div>

      <div className="form-group mt-4">
        <label htmlFor="iframeLink">360° View or Video Embed</label>
        <input
          type="url"
          id="iframeLink"
          name="iframeLink"
          className="form-control"
          placeholder="No link provided"
          value={formData.iframeLink || ''}
          onChange={handleInputChange}
          disabled={true}
          style={{ backgroundColor: '#f8f9fa', opacity: 0.8 }}
        />
      </div>

      {/* Image Popup Modal */}
      {selectedImage && createPortal(
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.85)', 
            zIndex: 99999,
            cursor: 'zoom-out',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="position-relative p-2 bg-white rounded shadow-lg d-flex align-items-center justify-content-center" 
            style={{ 
              maxWidth: '95%', 
              maxHeight: '95%',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="btn btn-dark position-absolute top-0 end-0 m-2"
              style={{ 
                borderRadius: '50%', 
                width: '40px', 
                height: '40px', 
                zIndex: 100000,
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
              onClick={() => setSelectedImage(null)}
            >
              <i className="fa fa-times"></i>
            </button>
            <img 
              src={selectedImage} 
              alt="Full size" 
              className="img-fluid rounded" 
              style={{ 
                maxHeight: '90vh', 
                maxWidth: '100%',
                objectFit: 'contain' 
              }}
            />
          </div>
        </div>,
        document.body
      )}

      <hr className="my-4" />
    </>
  );
};

export default ImagesMedia;