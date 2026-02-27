// src/components/productUpload/ProductUpload.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserType from '../../urlconfig';
import { toast } from 'react-toastify';
import postAPI from "../../../../../api/postAPI";

import BasicDetails from "./Sections/BasicDetails";
import ImagesMedia from "./Sections/ImagesMedia";
import ArtworkDetails from "./Sections/ArtworkDetails";
import PricingOffers from "./Sections/PricingOffers";
import useProductForm from "./hooks/useProductForm";
import ShippingDelivery from "./Sections/ShippingDelivery";
import PayoutDetails from "./Sections/PayoutDetails";
import LegalCompliance from "./Sections/LegalCompliance";
import NFTDetails from "./Sections/NFTDetails";
import AntiqueVintageDetails from "./Sections/AntiqueVintageDetails";

function ProductUpload() {
  const userType = useUserType();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');


  const {
    formData,
    pricingData,
    tags,
    inputTag,
    images,
    fileInputRef,
    isSubmitting,
    userId,
    finalPrice,
    handleInputChange,
    handlePricingChange,
    handleInstallmentDurationChange,
    handleSelectChange,
    handleMultiSelectChange,
    handleOffersChange,
    handleTagKeyDown,
    removeTag,
    setInputTag,
    handleImageUpload,
    handleRemoveImage,
    handleReplaceImage,
    handleMoveImage,
    setIsSubmitting,
    deliveryOptions,
    packagingOptions,
    //ARtwork
    mediumOptions,
    materialOptions,
    editionOptions,
    framingOptions,
    yearOptions,
    //price
    offerOptions,
    //Artwork
    surfaceTypeOptions,
    conditionOptions,
    //payoutdetails
    setFormData,

    //Basic details
    categoryData,
    productTypeOptions,
    getCategoriesByMainCategory,
    getSubCategoriesByCategory,

    profileData

  } = useProductForm();

  const validateAntiqueFields = (formData) => {
    const errors = {};
    if (!formData.originRegion) {
      errors.originRegion = 'Origin/Region is required';
      toast.error('Origin/Region is required');
  }
  if (!formData.periodEra) {
      errors.periodEra = 'Period/Era is required';
      toast.error('Period/Era is required');
  }
  if (!formData.antiqueCondition) {
      errors.antiqueCondition = 'Condition is required';
      toast.error('Condition is required');
  }
  if (!formData.originalReproduction) {
      errors.originalReproduction = 'Original vs. Reproduction is required';
      toast.error('Original vs. Reproduction is required');
  }
  if (formData.isHandmade === undefined || formData.isHandmade === null) {
      errors.isHandmade = 'Please specify if handmade';
      toast.error('Please specify if handmade');
  }
    return Object.keys(errors).length > 0 ? errors : null;
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

    if (!formData.mainCategory || !formData.category || !formData.subCategory || !formData.productType) {
      toast.error("Please fill all category fields");
      setIsSubmitting(false);
      return;
    }

    if (formData.productType.value === 'limited' && !formData.editionNumber) {
      toast.error("Please enter edition number for limited edition products");
      setIsSubmitting(false);
      return;
    }

    if (formData.partOfCollection && (!formData.editionSize )) {
      toast.error("Please fill all required collection details");
      setIsSubmitting(false);
      return;
    }

    

  if (isAntiqueVintageSelected) {
    const antiqueErrors = validateAntiqueFields(formData);
    if (antiqueErrors) {
        setIsSubmitting(false);
        toast.error("Please fill all required Antique & Vintage fields");
        setActiveTab('antique'); // Switch to antique tab to show errors
        return;
    }
}
    try {
      const formDataToSend = new FormData();

      // Product details
      formDataToSend.append('userId', userId);
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('mainCategory', formData.mainCategory.value);
      formDataToSend.append('category', formData.category.value);
      formDataToSend.append('subCategory', formData.subCategory.value);
      formDataToSend.append('productType', formData.productType.value);
      if (formData.productType.value === 'limited') {
        formDataToSend.append('editionNumber', parseInt(formData.editionNumber));
      }
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
      
      if (pricingData.allowInstallments && pricingData.installmentDuration) {
      formDataToSend.append('installmentDuration', pricingData.installmentDuration.value);}
      formDataToSend.append('shippingCharges', parseFloat(formData.shippingCharges));
      formDataToSend.append('estimatedDelivery', formData.estimatedDelivery.value || formData.estimatedDelivery.label);
      formDataToSend.append('packagingType', formData.packagingType.value);
      formDataToSend.append('insuranceCoverage', formData.insuranceCoverage);
      formDataToSend.append('selfShipping', formData.selfShipping);

      formDataToSend.append('quantity', parseInt(formData.quantity));
      if (formData.hsnCode) {
        formDataToSend.append('hsnCode', formData.hsnCode);
      }
      if (formData.surfaceType) {
        formDataToSend.append('surfaceType', formData.surfaceType?.value || formData.surfaceType?.label);
      }
      formDataToSend.append('isSigned', formData.isSigned);
      formDataToSend.append('condition', formData.condition?.value);
      if (formData.provenance) {
        formDataToSend.append('provenance', formData.provenance);
      }

      formDataToSend.append('autoCancelOrder', formData.autoCancelOrder);
      formDataToSend.append('giftWrapping', formData.giftWrapping);
      if (formData.giftWrapping) {
        formDataToSend.append('giftWrappingCustomMessage', formData.giftWrappingCustomMessage);
        formDataToSend.append('giftWrappingCost', formData.giftWrappingCost);
        if (formData.giftWrappingCost) {
          formDataToSend.append('giftWrappingCostAmount', parseFloat(formData.giftWrappingCostAmount));
        }
      }

      // Legal & Compliance
      formDataToSend.append('ownershipConfirmation', formData.ownershipConfirmation);
      formDataToSend.append('copyrightRights', formData.copyrightRights?.value || formData.copyrightRights?.label);
      formDataToSend.append('prohibitedItems', formData.prohibitedItems);
      formDataToSend.append('artistSignature', formData.artistSignature);
      formDataToSend.append('signatureType', formData.signatureType);
      formDataToSend.append('coaAvailable', formData.coaAvailable);
      formDataToSend.append('certificateFormat', formData.certificateFormat || 'digital'); // Add this line

      // Add certificate file if exists
      if (formData.certificateFile) {
        formDataToSend.append('certificateFile', formData.certificateFile);
      }

      if (formData.coaAvailable) {
        formDataToSend.append('certificateType', formData.certificateType?.value || formData.certificateType?.label);
        formDataToSend.append('issuerName', formData.issuerName);
        formDataToSend.append('verificationNumber', formData.verificationNumber);
        if (formData.coaFile) {
          formDataToSend.append('coaFile', formData.coaFile);
        }
      }

      // NFT Details (only append if they exist)
      if (formData.blockchainNetwork) {
        formDataToSend.append('blockchainNetwork', formData.blockchainNetwork.value);
      }
      formDataToSend.append('smartContractAddress', formData.smartContractAddress);
      if (formData.tokenStandard) {
        formDataToSend.append('tokenStandard', formData.tokenStandard.value);
      }
      formDataToSend.append('tokenId', formData.tokenId);
      formDataToSend.append('walletAddress', formData.walletAddress);
      formDataToSend.append('royaltyPercentage', formData.royaltyPercentage);
      if (formData.mintingType) {
        formDataToSend.append('mintingType', formData.mintingType.value);
      }
      if (formData.licenseType) {
        formDataToSend.append('licenseType', formData.licenseType.value);
      }
      formDataToSend.append('ipfsStorage', formData.ipfsStorage);
      formDataToSend.append('unlockableContent', formData.unlockableContent);
      formDataToSend.append('partOfCollection', formData.partOfCollection);
      formDataToSend.append('collectionName', formData.collectionName);
      if (formData.partOfCollection) {
        formDataToSend.append('editionSize', parseInt(formData.editionSize));
      }
      if (formData.rarityType) {
        formDataToSend.append('rarityType', formData.rarityType.value);
      }
      formDataToSend.append('traits', formData.traits);
      if (formData.originRegion) {
        formDataToSend.append('originRegion', formData.originRegion.value);
      }
      if (formData.periodEra) {
        formDataToSend.append('periodEra', formData.periodEra.value);
      }
      if (formData.antiqueCondition) {
        formDataToSend.append('antiqueCondition', formData.antiqueCondition.value);
      }
      formDataToSend.append('restorationHistory', formData.restorationHistory || '');
      formDataToSend.append('provenanceHistory', formData.provenanceHistory || '');
      formDataToSend.append('engravingMarkings', formData.engravingMarkings || '');
      formDataToSend.append('patinaWear', formData.patinaWear || '');
      formDataToSend.append('isHandmade', formData.isHandmade);
      if (formData.originalReproduction) {
        formDataToSend.append('originalReproduction', formData.originalReproduction.value);
      }
      formDataToSend.append('museumExhibitionHistory', formData.museumExhibitionHistory || '');
      formDataToSend.append('customEngravingAvailable', formData.customEngravingAvailable);
      formDataToSend.append('addressLine1', formData.addressLine1 || profileData.address?.line1 || '');
      formDataToSend.append('addressLine2', formData.addressLine2 || profileData.address?.line2 || '');
      formDataToSend.append('landmark', formData.landmark || profileData.address?.landmark || '');
      formDataToSend.append('city', formData.city || profileData.address?.city || '');
      formDataToSend.append('state', formData.state || profileData.address?.state || '');
      formDataToSend.append('country', formData.country || profileData.address?.country || '');
      formDataToSend.append('pincode', formData.pincode || profileData.address?.pincode || '');
 
      const response = await postAPI('/api/cropImage', formDataToSend, {}, true);
      toast.success('Product created successfully!');
      navigate(`/${userType}/Dashboard/allproduct`);
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create product';


      if (error.response?.data?.details) {
        error.response.data.details.forEach(detail => {
          toast.error(detail);
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isNFTArtSelected = formData.category?.label === "NFT Art" ||
    formData.subCategory?.label === "NFT Art";

  const isAntiqueVintageSelected = formData.mainCategory?.label === "Antiques & Vintage";

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <BasicDetails
            formData={formData}
            tags={tags}
            inputTag={inputTag}
            isSubmitting={isSubmitting}
            handleInputChange={handleInputChange}
            handleTagKeyDown={handleTagKeyDown}
            removeTag={removeTag}
            setInputTag={setInputTag}

            categoryData={categoryData}
            productTypeOptions={productTypeOptions}
            getCategoriesByMainCategory={getCategoriesByMainCategory}
            getSubCategoriesByCategory={getSubCategoriesByCategory}
            handleSelectChange={handleSelectChange}
          />
        );
      case 'nft':
        return (
          <NFTDetails
            formData={formData}
            isSubmitting={isSubmitting}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            userId={userId}
            profileData={profileData}
          />
        );
      case 'antique':
        return (
          <AntiqueVintageDetails
            formData={formData}
            isSubmitting={isSubmitting}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            userId={userId}
            profileData={profileData}
          />
        );
      case 'images':
        return (
          <ImagesMedia
            images={images}
            fileInputRef={fileInputRef}
            formData={formData}
            isSubmitting={isSubmitting}
            handleImageUpload={handleImageUpload}
            handleRemoveImage={handleRemoveImage}
            handleReplaceImage={handleReplaceImage}
            handleMoveImage={handleMoveImage}
            handleInputChange={handleInputChange}
          />
        );
      case 'artwork':
        return (
          <ArtworkDetails
            formData={formData}
            isSubmitting={isSubmitting}
            mediumOptions={mediumOptions}
            materialOptions={materialOptions}
            editionOptions={editionOptions}
            framingOptions={framingOptions}
            yearOptions={yearOptions}
            surfaceTypeOptions={surfaceTypeOptions}
            conditionOptions={conditionOptions}
            handleSelectChange={handleSelectChange}
            handleMultiSelectChange={handleMultiSelectChange}
            handleInputChange={handleInputChange}
          />
        );
      case 'pricing':
        return (
          <PricingOffers
            pricingData={pricingData}
            finalPrice={finalPrice}
            isSubmitting={isSubmitting}
            handlePricingChange={handlePricingChange}
            handleOffersChange={handleOffersChange}
            handleInstallmentDurationChange={handleInstallmentDurationChange}
            offerOptions={offerOptions}
          />
        );
      case 'shipping':
        return (
          <ShippingDelivery
            formData={formData}
            isSubmitting={isSubmitting}
            deliveryOptions={deliveryOptions}
            packagingOptions={packagingOptions}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
        );
      case 'payoutDetails':
        return (
          <PayoutDetails
            formData={formData}
            isSubmitting={isSubmitting}
            handleInputChange={handleInputChange}
            setFormData={setFormData}
          />
        );
      case 'legal':
        return (
          <LegalCompliance
            formData={formData}
            isSubmitting={isSubmitting}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            setFormData={setFormData}
          />
        );
      default:
        return null;
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
              {/* Tabs Navigation */}
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
                    onClick={() => setActiveTab('basic')}
                  >
                    Basic Details
                  </button>
                </li>
                {isNFTArtSelected && (
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${activeTab === 'nft' ? 'active' : ''}`}
                      onClick={() => setActiveTab('nft')}
                    >
                      NFT Details
                    </button>
                  </li>
                )}
                {isAntiqueVintageSelected && (
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${activeTab === 'antique' ? 'active' : ''}`}
                      onClick={() => setActiveTab('antique')}
                    >
                      Antique
                    </button>
                  </li>
                )}

                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'images' ? 'active' : ''}`}
                    onClick={() => setActiveTab('images')}
                  >
                    Images & Media
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'artwork' ? 'active' : ''}`}
                    onClick={() => setActiveTab('artwork')}
                  >
                    Artwork Details
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pricing')}
                  >
                    Pricing & Offers
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'shipping' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shipping')}
                  >
                    Shipping & Delivery
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'payoutDetails' ? 'active' : ''}`}
                    onClick={() => setActiveTab('payoutDetails')}
                  >
                    Payout Details
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'legal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('legal')}
                  >
                    Legal & Compliance
                  </button>
                </li>
              </ul>

              {/* Tab Content */}
              {renderTabContent()}

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt-4">
                {activeTab !== 'basic' && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      const tabs = ['basic', ...(isNFTArtSelected ? ['nft'] : []), ...(isAntiqueVintageSelected ? ['antique'] : []), 'images', 'artwork', 'pricing', 'shipping', 'payoutDetails', 'legal'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex - 1]);
                    }}
                    disabled={isSubmitting}
                  >
                    Previous
                  </button>
                )}
                {activeTab !== 'legal' ? (
                  <button
                    type="button"
                    className="btn btn-primary ms-auto"
                    onClick={() => {
                      const tabs = ['basic', ...(isNFTArtSelected ? ['nft'] : []), ...(isAntiqueVintageSelected ? ['antique'] : []), 'images', 'artwork', 'pricing', 'shipping', 'payoutDetails', 'legal'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex + 1]);
                    }}
                    disabled={isSubmitting}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary ms-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductUpload;