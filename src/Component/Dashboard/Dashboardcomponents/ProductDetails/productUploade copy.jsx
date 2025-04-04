import React, { useState, useEffect, useRef, useMemo } from "react";
import useUserType from '../urlconfig';
import { Link, useNavigate } from "react-router-dom";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import postAPI from "../../../../api/postAPI";
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

function ProductUpload() {
  const userType = useUserType();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    medium: null,
    materials: [],
    dimensions: '',
    weight: '',
    year: null,
    editionType: null,
    framing: null,
    iframeLink: ''
  });

  const [pricingData, setPricingData] = useState({
    sellingPrice: '',
    marketPrice: '',
    discount: '',
    offers: [],
    allowInstallments: false
  });

  const [userId, setUserId] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.userId) {
          setUserId(decodedToken.userId);
        } else {
          console.error("User ID not found in token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.warn("No token found in localStorage");
    }
  }, []);

  const mediumOptions = [
    { value: 'oil', label: 'Oil' },
    { value: 'acrylic', label: 'Acrylic' },
    { value: 'watercolor', label: 'Watercolor' },
    { value: 'clay', label: 'Clay' },
    { value: 'bronze', label: 'Bronze' },
    { value: 'wood', label: 'Wood' },
    { value: 'digital', label: 'Digital' }
  ];

  const materialOptions = [
    { value: 'canvas', label: 'Canvas' },
    { value: 'charcoal', label: 'Charcoal' },
    { value: 'ink', label: 'Ink' },
    { value: 'resin', label: 'Resin' },
    { value: 'metal', label: 'Metal' },
    { value: 'paper', label: 'Paper' },
    { value: 'stone', label: 'Stone' },
    { value: 'glass', label: 'Glass' }
  ];

  const editionOptions = [
    { value: 'original', label: 'Original' },
    { value: 'limited', label: 'Limited Edition' },
    { value: 'open', label: 'Open Edition' }
  ];

  const framingOptions = [
    { value: 'framed', label: 'Framed' },
    { value: 'unframed', label: 'Unframed' },
    { value: 'rolled', label: 'Rolled Canvas' }
  ];

  const offerOptions = [
    { value: 'festival', label: 'Festival Offer' },
    { value: 'new_customer', label: 'New Customer Discount' },
    { value: 'bulk_purchase', label: 'Bulk Purchase Discount' },
    { value: 'artist_special', label: 'Artist Special' }
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));

  const finalPrice = useMemo(() => {
    if (!pricingData.sellingPrice) return 0;
    const sellingPrice = parseFloat(pricingData.sellingPrice);
    const discount = pricingData.discount ? parseFloat(pricingData.discount) : 0;
    return sellingPrice - (sellingPrice * discount / 100);
  }, [pricingData.sellingPrice, pricingData.discount]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 8) {
      toast.error('Maximum 8 images allowed');
      return;
    }

    const validFiles = files.filter(file =>
      file.type.startsWith('image/') &&
      file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      toast.error('Some files were invalid (must be images under 5MB)');
    }

    if (validFiles.length > 0) {
      const newImages = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setImages(prev => [...prev, ...newImages]);
    }

    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    if (images.length <= 3) {
      toast.error('Minimum 3 images required');
      return;
    }

    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleReplaceImage = (index) => {
    fileInputRef.current.click();
    fileInputRef.current.onchange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages[index] = {
          file,
          preview: URL.createObjectURL(file)
        };
        setImages(newImages);
      } else {
        toast.error('Please select a valid image file under 5MB');
      }
      e.target.value = '';
    };
  };

  const handleMoveImage = (index, direction) => {
    const newImages = [...images];
    const newIndex = direction === 'left' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < images.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      setImages(newImages);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePricingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPricingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption
    }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      materials: selectedOptions
    }));
  };

  const handleOffersChange = (selectedOptions) => {
    setPricingData(prev => ({
      ...prev,
      offers: selectedOptions
    }));
  };

  const handleTagKeyDown = (e) => {
    if (['Enter', ','].includes(e.key) && inputTag.trim()) {
      e.preventDefault();
      setTags(prev => [...prev, inputTag.trim()]);
      setInputTag('');
    }
  };

  const removeTag = (index) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!userId) {
      toast.error("User authentication required");
      setIsSubmitting(false);
      return;
    }
  
    if (images.length < 3) {
      toast.error("Minimum 3 images required");
      setIsSubmitting(false);
      return;
    }

    if (!pricingData.sellingPrice) {
      toast.error("Selling price is required");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      
      // Product details
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('userId', userId);
      formDataToSend.append('description', formData.description);
      tags.forEach(tag => formDataToSend.append('tags', tag));
      formDataToSend.append('medium', formData.medium?.value || formData.medium?.label);
      formData.materials.forEach(m => 
        formDataToSend.append('materials', m.value || m.label)
      );
      formDataToSend.append('dimensions', formData.dimensions);
      if (formData.weight) {
        formDataToSend.append('weight', parseFloat(formData.weight));
      }
      formDataToSend.append('year', formData.year?.value);
      formDataToSend.append('editionType', formData.editionType?.value);
      formDataToSend.append('framing', formData.framing?.value);
      if (formData.iframeLink) {
        formDataToSend.append('iframeLink', formData.iframeLink);
      }
      images.forEach((image, index) => {
        formDataToSend.append('images', image.file);
      });

      // Pricing details
      formDataToSend.append('sellingPrice', parseFloat(pricingData.sellingPrice));
      if (pricingData.marketPrice) {
        formDataToSend.append('marketPrice', parseFloat(pricingData.marketPrice));
      }
      if (pricingData.discount) {
        formDataToSend.append('discount', parseFloat(pricingData.discount));
      }
      formDataToSend.append('finalPrice', finalPrice);
      pricingData.offers.forEach(offer => 
        formDataToSend.append('offers', offer.value)
      );
      formDataToSend.append('allowInstallments', pricingData.allowInstallments);

      const response = await postAPI('/api/cropImage', formDataToSend, {}, true);
  
      toast.success('Product created successfully!');
      navigate(`/${userType}/Dashboard/allproduct`);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Create Product</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item active">
                <Link to={`/${userType}/Dashboard/allproduct`}>All Product</Link>
              </li>
              <li className="breadcrumb-item">Create Product</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded">
              <h4 className="mb-3">Basic Product Details</h4>

              <div className="form-group">
                <label htmlFor="productName">Product Name *</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  className="form-control"
                  placeholder="Enter Product Name"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  placeholder="Enter product description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <div
                  className="d-flex flex-wrap align-items-center form-control p-2"
                  style={{ minHeight: '44px' }}
                >
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center bg-light rounded px-2 py-1 m-1"
                    >
                      <span className="mr-1">#{tag}</span>
                      <span
                        className="ml-1 text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={() => !isSubmitting && removeTag(index)}
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                  <input
                    type="text"
                    id="tags"
                    className="border-0 flex-grow-1 px-2"
                    style={{ outline: 'none', minWidth: '100px' }}
                    placeholder="Type tags and press enter or comma"
                    value={inputTag}
                    onChange={(e) => setInputTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <hr className="my-4" />
              <h4 className="mb-3">Images and Media</h4>

              <div className="form-group">
                <label>Upload Images (3-8 images) *</label>
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
                          disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <hr className="my-4" />
              <h4 className="mb-3">Artwork/Artifact Details</h4>

              <div className="form-group">
                <label>Medium *</label>
                <CreatableSelect
                  options={mediumOptions}
                  value={formData.medium}
                  onChange={(selected) => handleSelectChange('medium', selected)}
                  placeholder="Select or create medium"
                  isSearchable
                  formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                  required
                  isDisabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label>Materials Used *</label>
                <CreatableSelect
                  options={materialOptions}
                  value={formData.materials}
                  onChange={handleMultiSelectChange}
                  placeholder="Select or create materials"
                  isMulti
                  isSearchable
                  formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                  required
                  isDisabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dimensions">Dimensions *</label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  className="form-control"
                  placeholder="e.g., 24 x 36 inches or 60 x 90 cm"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
                <small className="text-muted">Mention in inches/cm (e.g., 24 x 36 inches)</small>
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  className="form-control"
                  placeholder="Enter weight in kilograms"
                  step="0.01"
                  value={formData.weight}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label>Year of Creation *</label>
                <Select
                  options={yearOptions}
                  value={formData.year}
                  onChange={(selected) => handleSelectChange('year', selected)}
                  placeholder="Select Year"
                  isSearchable
                  required
                  isDisabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label>Edition Type *</label>
                <Select
                  options={editionOptions}
                  value={formData.editionType}
                  onChange={(selected) => handleSelectChange('editionType', selected)}
                  placeholder="Select Edition Type"
                  isSearchable
                  required
                  isDisabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label>Framing Details *</label>
                <Select
                  options={framingOptions}
                  value={formData.framing}
                  onChange={(selected) => handleSelectChange('framing', selected)}
                  placeholder="Select Framing Option"
                  isSearchable
                  required
                  isDisabled={isSubmitting}
                />
              </div>

              <hr className="my-4" />
              <h4 className="mb-3">Pricing & Offers</h4>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="sellingPrice">Selling Price (₹) *</label>
                    <input
                      type="number"
                      id="sellingPrice"
                      name="sellingPrice"
                      className="form-control"
                      placeholder="Enter selling price"
                      min="0"
                      step="0.01"
                      value={pricingData.sellingPrice}
                      onChange={handlePricingChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="marketPrice">Market Price (₹)</label>
                    <input
                      type="number"
                      id="marketPrice"
                      name="marketPrice"
                      className="form-control"
                      placeholder="Enter market price"
                      min="0"
                      step="0.01"
                      value={pricingData.marketPrice}
                      onChange={handlePricingChange}
                      disabled={isSubmitting}
                    />
                    <small className="text-muted">Original price for comparison</small>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="discount">Discount (%)</label>
                    <input
                      type="number"
                      id="discount"
                      name="discount"
                      className="form-control"
                      placeholder="Enter discount percentage"
                      min="0"
                      max="100"
                      step="0.1"
                      value={pricingData.discount}
                      onChange={handlePricingChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Final Price After Discount (₹) *</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={`₹${finalPrice.toFixed(2)}`}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Offers & Coupons</label>
                <Select
                  options={offerOptions}
                  value={pricingData.offers}
                  onChange={handleOffersChange}
                  placeholder="Select applicable offers"
                  isMulti
                  isSearchable
                  isDisabled={isSubmitting}
                />
              </div>

              <div className="form-group form-check">
                <input
                  type="checkbox"
                  id="allowInstallments"
                  name="allowInstallments"
                  className="form-check-input"
                  checked={pricingData.allowInstallments}
                  onChange={handlePricingChange}
                  disabled={isSubmitting}
                />
                <label className="form-check-label" htmlFor="allowInstallments">
                  Allow payment in installments (EMI)
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-block btn-primary mt-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductUpload;