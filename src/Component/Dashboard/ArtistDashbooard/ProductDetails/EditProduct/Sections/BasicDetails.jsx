// src/components/productUpload/sections/BasicDetails.js
import React from "react";

const BasicDetails = ({
  formData,
  tags,
  inputTag,
  isSubmitting,
  handleInputChange,
  handleTagKeyDown,
  removeTag,
  setInputTag,

  categoryData,
  productTypeOptions,
  getCategoriesByMainCategory,
  getSubCategoriesByCategory,
  handleSelectChange
}) => {

  const isNFTArtSelected = formData.category?.label === "NFT Art" || 
                         formData.subCategory?.label === "NFT Art";

  const filteredProductTypeOptions = isNFTArtSelected
    ? productTypeOptions 
    : productTypeOptions.filter(opt => opt.value !== 'nft'); 


  React.useEffect(() => {
    if (isNFTArtSelected && formData.productType?.value !== 'nft') {
      const nftOption = productTypeOptions.find(opt => opt.value === 'nft');
      if (nftOption) {
        handleSelectChange('productType', nftOption);
      }
    }
  }, [isNFTArtSelected, formData.productType, productTypeOptions, handleSelectChange]);

  return (
    <>
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
        <label htmlFor="mainCategory">Main Category *</label>
        <select
          id="mainCategory"
          name="mainCategory"
          className="form-control"
          value={formData.mainCategory?.value || ''}
          onChange={(e) => {
            const selected = categoryData.mainCategories.find(
              cat => cat.value === e.target.value
            );
            handleSelectChange('mainCategory', selected);
            handleSelectChange('category', null);
            handleSelectChange('subCategory', null);
          }}
          disabled={isSubmitting}
          required
        >
          <option value="">Select Main Category</option>
          {categoryData.mainCategories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          name="category"
          className="form-control"
          value={formData.category?.value || ''}
          onChange={(e) => {
            const selected = getCategoriesByMainCategory(formData.mainCategory?.value)
              .find(cat => cat.value === e.target.value);
            handleSelectChange('category', selected);
            handleSelectChange('subCategory', null);
          }}
          disabled={!formData.mainCategory || isSubmitting}
          required
        >
          <option value="">
            {formData.mainCategory ? "Select Category" : "Select Main Category first"}
          </option>
          {formData.mainCategory && 
            getCategoriesByMainCategory(formData.mainCategory.value).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          }
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="subCategory">Subcategory *</label>
        <select
          id="subCategory"
          name="subCategory"
          className="form-control"
          value={formData.subCategory?.value || ''}
          onChange={(e) => {
            const selected = getSubCategoriesByCategory(formData.category?.value)
              .find(subCat => subCat.value === e.target.value);
            handleSelectChange('subCategory', selected);
          }}
          disabled={!formData.category || isSubmitting}
          required
        >
          <option value="">
            {formData.category ? "Select Subcategory" : "Select Category first"}
          </option>
          {formData.category && 
            getSubCategoriesByCategory(formData.category.value).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          }
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="productType">Product Type *</label>
        <select
          id="productType"
          name="productType"
          className="form-control"
          value={formData.productType?.value || ''}
          onChange={(e) => {
            const selected = filteredProductTypeOptions.find(
              opt => opt.value === e.target.value
            );
            handleSelectChange('productType', selected);
            if (selected?.value !== 'limited') {
              handleInputChange({ target: { name: 'editionNumber', value: '' } });
            }
          }}
          disabled={isSubmitting || isNFTArtSelected}
          required
        >
          <option value="">Select Product Type</option>
          {filteredProductTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {isNFTArtSelected && (
          <small className="text-muted">NFT product type is automatically selected for NFT Art</small>
        )}
      </div>

      {formData.productType?.value === 'limited' && (
        <div className="form-group">
          <label htmlFor="editionNumber">Limited Edition Number *</label>
          <input
            type="number"
            id="editionNumber"
            name="editionNumber"
            className="form-control"
            placeholder="Enter edition number"
            value={formData.editionNumber}
            onChange={handleInputChange}
            required={formData.productType?.value === 'limited'}
            disabled={isSubmitting}
            min="1"
          />
        </div>
      )}

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
    </>
  );
};

export default BasicDetails;