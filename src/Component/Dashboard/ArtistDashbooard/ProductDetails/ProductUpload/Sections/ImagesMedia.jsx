// src/components/productUpload/sections/ImagesMedia.js
import React from "react";

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
}) => (
  <>
    <h4 className="mb-3">Images and Media</h4>

    <div className="form-group">
      <label>Upload Images (3-8 images) <span style={{ color: 'red' }}>*</span></label>
      <div className="d-flex flex-wrap">
        {images.map((image, index) => (
          <div
            key={index}
            className="position-relative m-2"
            style={{ width: '150px', height: '150px' }}
          >
            <img
              src={image.preview}
              alt={`Preview ${index}`}
              className="img-thumbnail w-100 h-100 object-fit-cover"
              style={{
                border: index === 0 ? '3px solid #007bff' : '1px solid #dee2e6',
                opacity: index === 0 ? 1 : 0.7
              }}
            />

            <div className="position-absolute top-0 end-0 p-1">
            </div>
            <div className="position-absolute bottom-0 start-0 w-100 d-flex justify-content-center p-1">
              <button
                type="button"
                className="btn btn-outline-danger px-2 py-1 mx-1"
                onClick={() => handleRemoveImage(index)}
                disabled={isSubmitting}
                title="Delete image"
              >
                <i className="fa fa-trash"></i>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary text-xs px-2 py-1"
                onClick={() => handleMoveImage(index, 'left')}
                disabled={isSubmitting || index === 0}
                title="Move left"
              >
                <i className="fa fa-arrow-left"></i>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary px-2 py-1 mx-1"
                onClick={() => handleMoveImage(index, 'right')}
                disabled={isSubmitting || index === images.length - 1}
                title="Move right"
              >
                <i className="fa fa-arrow-right"></i>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-warning px-2 py-1 mx-1"
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
            className="d-flex flex-column align-items-center justify-content-center border rounded m-2"
            style={{ width: '150px', height: '150px', cursor: 'pointer' }}
            onClick={() => fileInputRef.current.click()}
          >
            <div>+ Add Image</div>
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
      <small className="text-muted d-block mt-5">
        First image is the main display image. Minimum 3 images required, maximum 8.
      </small>
    </div>
    <div className="form-group mt-4">
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

    <hr className="my-4" />
  </>
);

export default ImagesMedia;