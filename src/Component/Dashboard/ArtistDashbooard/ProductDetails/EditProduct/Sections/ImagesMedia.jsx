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
        <label>Upload Images (3-8 images) *</label>
        <div className="flex-wrap d-flex" style={{ columnGap: "20px", rowGap: "40px" }}>
          {images.map((image, index) => (
            <div
              key={index}
              className="m-2 position-relative"
              style={{ width: '150px', height: '150px' }}
            >
              <img
                src={image.preview}
                alt={`Preview ${index}`}
                className="img-thumbnail w-100 h-100 object-fit-cover"
                style={{
                  border: index === 0 ? '3px solid #007bff' : '1px solid #dee2e6',
                  opacity: index === 0 ? 1 : 0.7,
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedImage(image.preview)}
              />

              <div className="top-0 p-1 position-absolute end-0">
              </div>
              <div className="bottom-0 p-1 position-absolute start-0 w-100 d-flex justify-content-center" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                <button
                  type="button"
                  className="px-2 py-1 mx-1 btn btn-outline-danger"
                  onClick={() => handleRemoveImage(index)}
                  disabled={isSubmitting}
                  title="Delete image"
                >
                  <i className="fa fa-trash"></i>
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs btn btn-sm btn-outline-secondary"
                  onClick={() => handleMoveImage(index, 'left')}
                  disabled={isSubmitting || index === 0}
                  title="Move left"
                >
                  <i className="fa fa-arrow-left"></i>
                </button>
                <button
                  type="button"
                  className="px-2 py-1 mx-1 btn btn-sm btn-outline-secondary"
                  onClick={() => handleMoveImage(index, 'right')}
                  disabled={isSubmitting || index === images.length - 1}
                  title="Move right"
                >
                  <i className="fa fa-arrow-right"></i>
                </button>
                <button
                  type="button"
                  className="px-2 py-1 mx-1 btn btn-sm btn-outline-warning"
                  onClick={() => handleReplaceImage(index)}
                 
                  title="Replace image"
                >
                  <i className="fa fa-exchange"></i>
                </button>
              </div>
            </div>
          ))}

          {images.length < 8 && (
            <div
              className="m-2 border rounded d-flex flex-column align-items-center justify-content-center"
              style={{ width: '150px', height: '150px', cursor: 'pointer', borderStyle: 'dashed' }}
              onClick={() => fileInputRef.current.click()}
            >
              <div className="mb-0 h3">+</div>
              <div>Add Image</div>
              <small className="text-muted">{images.length}/8</small>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          multiple
          accept="image/*"
          style={{ display: 'none' }}
        />
        <small className="mt-5 text-muted d-block">
          First image is the main display image. Minimum 3 images required, maximum 8. Click on an image to view full size.
        </small>
      </div>
      <div className="mt-4 form-group">
        <label htmlFor="iframeLink">360° View or Video Embed (Optional)</label>
        <input
          type="url"
          id="iframeLink"
          name="iframeLink"
          className="form-control"
          placeholder="Enter iframe embed link (e.g., from YouTube, Vimeo, or 360° viewer)"
          value={formData.iframeLink || ''}
          onChange={handleInputChange}
        
        />
      </div>

      {/* Image Popup Modal */}
      {selectedImage && createPortal(
        <div 
          className="top-0 position-fixed start-0 w-100 h-100 d-flex align-items-center justify-content-center"
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
            className="p-2 bg-white rounded shadow-lg position-relative d-flex align-items-center justify-content-center" 
            style={{ 
              maxWidth: '95%', 
              maxHeight: '95%',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="top-0 m-2 btn btn-dark position-absolute end-0"
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
              className="rounded img-fluid" 
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