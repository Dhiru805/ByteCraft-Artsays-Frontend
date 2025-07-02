// src/components/productUpload/sections/BasicDetails.js
import React from "react";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';


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
    ? productTypeOptions // Show all options including NFT
    : productTypeOptions.filter(opt => opt.value !== 'nft'); 


  React.useEffect(() => {
    if (isNFTArtSelected && formData.productType?.value !== 'nft') {
      const nftOption = productTypeOptions.find(opt => opt.value === 'nft');
      if (nftOption) {
        handleSelectChange('productType', nftOption);
      }
    }
  }, [isNFTArtSelected, formData.productType, productTypeOptions, handleSelectChange]);

// Inside BasicDetails.jsx
const searchableCategories = React.useMemo(() => {
  const main = categoryData.mainCategories.map(cat => ({
    ...cat,
    type: 'mainCategory',
    fullLabel: cat.label
  }));

  const categories = categoryData.categories.map(cat => {
    const mainLabel = categoryData.mainCategories.find(main => main.value === cat.mainCategoryId)?.label;
    return {
      ...cat,
      type: 'category',
      fullLabel: `${mainLabel} - ${cat.label}`,
      mainCategoryId: cat.mainCategoryId
    };
  });

  const sub = categoryData.subCategories.map(sub => {
    const cat = categoryData.categories.find(c => c.value === sub.categoryId);
    const mainLabel = categoryData.mainCategories.find(main => main.value === cat?.mainCategoryId)?.label;
    return {
      ...sub,
      type: 'subCategory',
      fullLabel: `${mainLabel} - ${cat?.label} - ${sub.label}`,
      categoryId: sub.categoryId,
      mainCategoryId: cat?.mainCategoryId
    };
  });

return [...main, ...categories, ...sub].sort((a, b) => a.fullLabel.localeCompare(b.fullLabel));
}, [categoryData]);


  return (
    <>
      <h4 className="mb-3">Basic Product Details</h4>

      <div className="form-group">
        <label htmlFor="productName">Product Name <span style={{ color: 'red' }}>*</span></label>
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
        <label>Search Category</label>
        <Select
          options={searchableCategories}
          getOptionLabel={e => e.fullLabel}
          getOptionValue={e => e.value}
          placeholder="Search for any category..."
          isClearable
          onChange={(selectedOption) => {
            if (!selectedOption) return;

            const selected = selectedOption;

            let mainCat = null, cat = null, subCat = null;

         
            if (selected.type === 'mainCategory') {
              mainCat = categoryData.mainCategories.find(m => m.value === selected.value); 
            }

            if (selected.type === 'category') {
              cat = categoryData.categories.find(c => c.value === selected.value); 
              mainCat = categoryData.mainCategories.find(m => m.value === cat?.mainCategoryId); 
            }

            if (selected.type === 'subCategory') {
              subCat = categoryData.subCategories.find(s => s.value === selected.value); 
              cat = categoryData.categories.find(c => c.value === subCat?.categoryId); 
              mainCat = categoryData.mainCategories.find(m => m.value === cat?.mainCategoryId); 
            }

            handleSelectChange('mainCategory', mainCat || null); 
            handleSelectChange('category', cat || null);         
            handleSelectChange('subCategory', subCat || null);   
          }}
          isDisabled={isSubmitting}
        />
      </div>      
      <div className="form-group">
        <label htmlFor="mainCategory">Main Category <span style={{ color: 'red' }}>*</span></label>
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
        <label htmlFor="category">Category <span style={{ color: 'red' }}>*</span></label>
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
        <label htmlFor="subCategory">Subcategory <span style={{ color: 'red' }}>*</span></label>
<CreatableSelect
          id="subCategory"
          name="subCategory"
          className="basic-single"
          classNamePrefix="select"
          options={getSubCategoriesByCategory(formData.category?.value)}
          value={formData.subCategory}
          onChange={(selectedOption) => handleSelectChange('subCategory', selectedOption)}
          onCreateOption={(inputValue) => {
            const customOption = { label: inputValue, value: inputValue };
            handleSelectChange('subCategory', customOption);
          }}
          isDisabled={!formData.category || isSubmitting}
          isClearable
          isSearchable
          placeholder="Select or enter subcategory"
        />
      </div>
      
<div className="form-group">
  <label htmlFor="productType">Product Type <span style={{ color: 'red' }}>*</span></label>
  <select
    id="productType"
    name="productType"
    className="form-control"
    value={formData.productType?.value || ''}
    onChange={(e) => {
      const selected = productTypeOptions.find(
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
    {productTypeOptions.map((option) => (
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
          <label htmlFor="editionNumber">Limited Edition Number <span style={{ color: 'red' }}>*</span></label>
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
        <label htmlFor="description">Description <span style={{ color: 'red' }}>*</span></label>
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