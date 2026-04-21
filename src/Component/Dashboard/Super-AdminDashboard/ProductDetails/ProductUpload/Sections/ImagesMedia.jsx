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
                opacity: index === 0 ? 1 : 0.7
              }}
            />

            <div className="top-0 p-1 position-absolute end-0">
            </div>
            <div className="bottom-0 p-1 position-absolute start-0 w-100 d-flex justify-content-center">
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
      <small className="mt-5 text-muted d-block">
        First image is the main display image. Minimum 3 images required, maximum 8.
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

    <hr className="my-4" />
  </>
);

export default ImagesMedia;