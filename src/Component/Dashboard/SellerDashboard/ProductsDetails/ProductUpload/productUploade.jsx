// src/components/productUpload/ProductUpload.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserType from '../../../urlconfig';
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
import AddressModal from "../ShippingAddressModal";
import SuccessModal from "../SuccessModal";

function ProductUpload() {
  const userType = useUserType();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [createdProductId, setCreatedProductId] = useState(null);


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
    handleMultiSelecttoolChange,
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
    mediumOptions,
    materialOptions,
    editionOptions,
    framingOptions,
    yearOptions,
    offerOptions,
    surfaceTypeOptions,
    conditionOptions,
    setFormData,
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

  const prepareFormData = (status = 'Pending') => {
    const formDataToSend = new FormData();

    // Add status first
    formDataToSend.append('status', status);

    //----------------------------------------------------- Basic details--------------------------------//
    formDataToSend.append('userId', userId);
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('mainCategory', formData.mainCategory?.value || '');
    formDataToSend.append('category', formData.category?.value || '');
    formDataToSend.append('subCategory', formData.subCategory?.value || '');
    formDataToSend.append('productType', formData.productType?.value || '');
    if (formData.productType?.value === 'Limited Edition') {
      formDataToSend.append('editionNumber', parseInt(formData.editionNumber));
    }
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('targetedAudience', formData.targetedAudience || '');
    formDataToSend.append('inspirationSource', formData.inspirationSource || '');
    tags.forEach(tag => formDataToSend.append('tags', tag));

    //-----------------------------------------------Artwork details-----------------------------------------//
    formDataToSend.append('medium', formData.medium?.value || formData.medium?.label || '');
    if (formData.materials) {
      formData.materials.forEach((m) =>
        formDataToSend.append('materials', m.value || m.label)
      );
    }
    formDataToSend.append('width', formData.width || '');
    formDataToSend.append('height', formData.height || '');
    formDataToSend.append('depth', formData.depth || '');
    if (formData.weight) {
      formDataToSend.append('weight', parseFloat(formData.weight));
    }
    // if (formData.printResolution && (formData.medium?.value?.toLowerCase() === 'print' || formData.medium?.value?.toLowerCase() === 'poster' || formData.medium?.value?.toLowerCase() === 'print and poster')) {
    //   formDataToSend.append('printResolution', formData.printResolution);
    // }
    formDataToSend.append('printResolution', formData.printResolution || "");
    formDataToSend.append('year', formData.year?.value || '');
    formDataToSend.append('editionType', formData.editionType?.value || '');
    formDataToSend.append('framing', formData.framing?.value || '');
    formDataToSend.append('quantity', parseInt(formData.quantity) || 1);
    if (formData.hsnCode) {
      formDataToSend.append('hsnCode', formData.hsnCode);
    }
    if (formData.surfaceType) {
      formDataToSend.append('surfaceType', formData.surfaceType?.value || formData.surfaceType?.label);
    }
    if (formData.culturalRegion) {
      formDataToSend.append('culturalRegion', formData.culturalRegion?.value || formData.culturalRegion?.label);
    }
    if (formData.biologicalMaterial) {
      formDataToSend.append('biologicalMaterial', formData.biologicalMaterial);
    }
    formDataToSend.append('functionalUse', formData.functionalUse?.value || '');
    if (formData.materialSource) {
      formDataToSend.append('materialSource', formData.materialSource);
    }
    if (formData.craftTechnique) {
      formDataToSend.append('craftTechnique', formData.craftTechnique);
    }
    if (formData.toolUsage) {
      formData.toolUsage.forEach((t) =>
        formDataToSend.append('toolUsage', t.value || t.label)
      );
    }
    formDataToSend.append('handmade', formData.handmade?.value || '');
    formDataToSend.append('isSigned', formData.isSigned || false);
    formDataToSend.append('isResinCovered', formData.isResinCovered || false);
    formDataToSend.append('condition', formData.condition?.value || '');
    if (formData.condition?.value?.toLowerCase() === 'resale' && formData.provenance) {
      formDataToSend.append('provenance', formData.provenance);
    }

    //-----------------------------------------------Image And Media-----------------------------------------//
    if (formData.iframeLink) {
      formDataToSend.append('iframeLink', formData.iframeLink);
    }
    images.forEach((image, index) => {
      formDataToSend.append('images', image.file);
    });

    // ---------------------------------Pricing details------------------------------------//
    formDataToSend.append('sellingPrice', parseFloat(pricingData.sellingPrice) || 0);
    if (pricingData.marketPrice) {
      formDataToSend.append('marketPrice', parseFloat(pricingData.marketPrice));
    }
    if (pricingData.discount) {
      formDataToSend.append('discount', parseFloat(pricingData.discount));
    }
    formDataToSend.append('finalPrice', finalPrice || 0);
    formDataToSend.append('allowInstallments', pricingData.allowInstallments || false);
    if (pricingData.allowInstallments && pricingData.installmentDuration) {
      formDataToSend.append('installmentDuration', pricingData.installmentDuration.value);
    }
    formDataToSend.append('includeGst', pricingData.includeGst || false);
    formDataToSend.append('gstPercentage', parseFloat(pricingData.gstPercentage) || 0);

    //--------------------------------------------Shipping & Delivery------------------------------//
    formDataToSend.append('shippingCharges', parseFloat(formData.shippingCharges) || 0);
    formDataToSend.append('estimatedDelivery', formData.estimatedDelivery?.value || formData.estimatedDelivery?.label || '');
    formDataToSend.append('packagingType', formData.packagingType?.value || '');
    formDataToSend.append('insuranceCoverage', formData.insuranceCoverage || false);
    formDataToSend.append('selfShipping', formData.selfShipping || false);
    formDataToSend.append('returnPolicy', formData.returnPolicy?.value || '');
    formDataToSend.append('handlingTime', formData.handlingTime?.value || formData.handlingTime?.label || '');
    formDataToSend.append('exportRestriction', formData.exportRestriction || false);

    // ---------------------------------Payout details------------------------------------//
    formDataToSend.append('autoCancelOrder', formData.autoCancelOrder || false);
    formDataToSend.append('giftWrapping', formData.giftWrapping || false);
    if (formData.giftWrapping) {
      formDataToSend.append('giftWrappingCustomMessage', formData.giftWrappingCustomMessage || '');
      formDataToSend.append('giftWrappingCost', formData.giftWrappingCost || false);
      if (formData.giftWrappingCost) {
        formDataToSend.append('giftWrappingCostAmount', parseFloat(formData.giftWrappingCostAmount) || 0);
      }
    }

    // ---------------------------------------------Legal & Compliance---------------------------------------------
    formDataToSend.append('ownershipConfirmation', formData.ownershipConfirmation || false);
    formDataToSend.append('copyrightRights', formData.copyrightRights?.value || formData.copyrightRights?.label || '');
    formDataToSend.append('prohibitedItems', formData.prohibitedItems);
    formDataToSend.append('artistSignature', !!formData.artistSignature);
    formDataToSend.append('signatureType', formData.signatureType || '');
    formDataToSend.append('coaAvailable', !!formData.coaAvailable);
    formDataToSend.append('certificateFormat', formData.certificateFormat || 'digital');

    // File uploads
    if (formData.certificateFile) {
      formDataToSend.append('certificateFile', formData.certificateFile);
    }

    // COA metadata (only if COA is available)
    if (formData.coaAvailable) {
      formDataToSend.append('certificateType', formData.certificateType?.value || formData.certificateType?.label || '');
      formDataToSend.append('issuerName', formData.issuerName || '');
      formDataToSend.append('verificationNumber', formData.verificationNumber || '');
      if (formData.coaFile) {
        formDataToSend.append('coaFile', formData.coaFile);
      }
    }

    // License & Usage Rights
    formDataToSend.append('commercialUse', formData.commercialUse?.value || formData.commercialUse?.label || '');
    formDataToSend.append('royaltyTerms', formData.royaltyTerms || '');
    formDataToSend.append('ethicalSourcing', !!formData.ethicalSourcing);

    // -----------------------------------NFT Details---------------------------------------------------//
    if (formData.blockchainNetwork) {
      formDataToSend.append('blockchainNetwork', formData.blockchainNetwork.value);
    }
    formDataToSend.append('smartContractAddress', formData.smartContractAddress || '');
    if (formData.tokenStandard) {
      formDataToSend.append('tokenStandard', formData.tokenStandard.value);
    }
    formDataToSend.append('tokenId', formData.tokenId || '');
    formDataToSend.append('walletAddress', formData.walletAddress || '');
    formDataToSend.append('royaltyPercentage', formData.royaltyPercentage || 0);
    if (formData.mintingType) {
      formDataToSend.append('mintingType', formData.mintingType.value);
    }
    if (formData.licenseType) {
      formDataToSend.append('licenseType', formData.licenseType.value);
    }
    formDataToSend.append('ipfsStorage', formData.ipfsStorage || false);
    if (formData.ipfsStorage) {
      formDataToSend.append('ipfsLink', formData.ipfsLink?.trim() || '');
      formDataToSend.append('softwareVersion', formData.softwareVersion?.trim() || '');
      formDataToSend.append('fileFormat', formData.fileFormat?.trim() || '');
    }
    formDataToSend.append('unlockableContent', formData.unlockableContent || false);
    if (formData.unlockableContent) {
      formDataToSend.append('unlockableContentLink', formData.unlockableContentLink?.trim() || '');
    }
    formDataToSend.append('partOfCollection', formData.partOfCollection || false);
    formDataToSend.append('collectionName', formData.collectionName || '');
    if (formData.partOfCollection) {
      formDataToSend.append('editionSize', parseInt(formData.editionSize) || 1);
    }
    if (formData.rarityType) {
      formDataToSend.append('rarityType', formData.rarityType.value);
    }
    formDataToSend.append('traits', formData.traits || '');

    //-------------------------------------------Antique & Vintage Details---------------------------------------//
    if (formData.originRegion) {
      formDataToSend.append('originRegion', formData.originRegion.value);
    }
    if (formData.periodEra) {
      formDataToSend.append('periodEra', formData.periodEra.value);
    }
    if (formData.antiqueCondition) {
      formDataToSend.append('antiqueCondition', formData.antiqueCondition.value);
    }
    if (formData.conservationStatus) {
      formDataToSend.append('conservationStatus', formData.conservationStatus.value);
    }
    formDataToSend.append('restorationHistory', formData.restorationHistory || '');
    if (formData.restorationDocumentation) {
      formDataToSend.append('restorationDocumentation', formData.restorationDocumentation);
    }
    formDataToSend.append('provenanceHistory', formData.provenanceHistory || '');
    formDataToSend.append('culturalSignificance', formData.culturalSignificance || '');
    formDataToSend.append('appraisalDetails', formData.appraisalDetails || '');
    formDataToSend.append('engravingMarkings', formData.engravingMarkings || '');
    formDataToSend.append('patinaWear', formData.patinaWear || '');
    formDataToSend.append('isHandmade', formData.isHandmade || false);
    if (formData.originalReproduction) {
      formDataToSend.append('originalReproduction', formData.originalReproduction.value);
    }
    formDataToSend.append('museumExhibitionHistory', formData.museumExhibitionHistory || '');
    if (formData.maintenanceRequired) {
      formDataToSend.append('maintenanceRequired', formData.maintenanceRequired.value);
    }
    formDataToSend.append('customEngravingAvailable', formData.customEngravingAvailable || false);
    if (formData.certification) {
      formDataToSend.append('certification', formData.certification);
    }
    formDataToSend.append('addressLine1', formData.addressLine1 || profileData.address?.line1 || '');
    formDataToSend.append('addressLine2', formData.addressLine2 || profileData.address?.line2 || '');
    formDataToSend.append('landmark', formData.landmark || profileData.address?.landmark || '');
    formDataToSend.append('city', formData.city || profileData.address?.city || '');
    formDataToSend.append('state', formData.state || profileData.address?.state || '');
    formDataToSend.append('country', formData.country || profileData.address?.country || '');
    formDataToSend.append('pincode', formData.pincode || profileData.address?.pincode || '');

    return formDataToSend;
  };

  const handleSaveDraft = async () => {
    if (!userId) {
      toast.error("User authentication required");
      return;
    }

    // Basic validation for draft - only check if product name exists
    if (!formData.productName) {
      toast.error("Product name is required to save as draft");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = prepareFormData('Drafted');

      const response = await postAPI('/api/cropImage', formDataToSend, {}, true);
      toast.success('Product saved as draft successfully!');
      navigate(`/seller/product`);
    } catch (error) {
      console.error('Error saving draft:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save draft';

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

    if (formData.productType.value === 'Limited Edition' && !formData.editionNumber) {
      toast.error("Please enter edition number for limited edition products");
      setIsSubmitting(false);
      return;
    }

    if (formData.partOfCollection && (!formData.editionSize)) {
      toast.error("Please fill all required collection details");
      setIsSubmitting(false);
      return;
    }

    if (isAntiqueVintageSelected) {
      const antiqueErrors = validateAntiqueFields(formData);
      if (antiqueErrors) {
        setIsSubmitting(false);
        toast.error("Please fill all required Antique & Vintage fields");
        setActiveTab('antique'); 
        return;
      }
    }

   try {
      const formDataToSend = prepareFormData('Pending');
      const response = await postAPI('/api/cropImage', formDataToSend, {}, true);
      
    console.log("response data:--",response)
      if (response.data) {
        const productId =response.data.data._id ;
        setCreatedProductId(productId);
      }
      
      setShowSuccessModal(true);
      
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
            setFormData={setFormData}
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
            handleMultiSelecttoolChange={handleMultiSelecttoolChange}
            handleInputChange={handleInputChange}
            mainCategoryId={formData.mainCategory?.value}

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
            mainCategoryId={formData.mainCategory?.value}
            subCategoryId={formData.subCategory?.value}
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
  const tabOrder = ['basic', ...(isNFTArtSelected ? ['nft'] : []), ...(isAntiqueVintageSelected ? ['antique'] : []), 'images', 'artwork', 'pricing', 'shipping', 'payoutDetails', 'legal'];

  const tabValidators = {
    basic: () => {
      const missingFields = [];

      if (!formData.productName) missingFields.push("Product Name");
      if (!formData.mainCategory) missingFields.push("Main Category");
      if (!formData.category) missingFields.push("Category");
      if (!formData.subCategory) missingFields.push("Subcategory");
      if (!formData.productType) missingFields.push("Product Type");
      if (!formData.description) missingFields.push("Description");
      if (!formData.targetedAudience) missingFields.push("Targeted Audience");
      if (!formData.inspirationSource) missingFields.push("Inspiration Source");
      if (!tags || tags.length === 0) missingFields.push("Tags");

      if (formData.productType?.value === 'Limited Edition' && !formData.editionNumber) {
        missingFields.push("Limited Edition Number");
      }

      if (missingFields.length > 0) {
        toast.error(`Please fill the following required fields: ${missingFields.join(", ")}.`);
        return false;
      }

      return true;
    },


    images: () => {
      if (images.length < 3) {
        toast.error("Please upload at least 3 images.");
        return false;
      }
      if (images.length > 8) {
        toast.error("You can upload a maximum of 8 images.");
        return false;
      }
      return true;
    },


    artwork: () => {
      const {
        medium,
        materials,
        width,
        height,
        depth,
        year,
        editionType,
        framing,
        quantity,
        condition,
        isSigned,
        printResolution,
        functionalUse,
        handmade
      } = formData;

      if (!medium) {
        toast.error("Medium is required.");
        return false;
      }
      if (!materials || materials.length === 0) {
        toast.error("At least one material is required.");
        return false;
      }

      if (!width || width <= 0) {
        toast.error("Width must be a positive number.");
        return false;
      }

      if (!height || height <= 0) {
        toast.error("Height must be a positive number.");
        return false;
      }

      if (!depth || depth < 0) {
        toast.error("Depth must be a non-negative number.");
        return false;
      }

      if (!year) {
        toast.error("Year of creation is required.");
        return false;
      }
      if (!editionType) {
        toast.error("Edition type is required.");
        return false;
      }
      if (!framing) {
        toast.error("Framing details are required.");
        return false;
      }
      if (!quantity || quantity < 1) {
        toast.error("Quantity must be at least 1.");
        return false;
      }
      if (!condition) {
        toast.error("Condition is required.");
        return false;
      }
      if (!isSigned) {
        toast.error("Please confirm that the artwork is signed by the artist.");
        return false;
      }

      if (
        (medium?.value?.toLowerCase() === 'print' || medium?.value?.toLowerCase() === 'poster') &&
        (!printResolution || printResolution.trim() === '')
      ) {
        toast.error("Print resolution is required for prints or posters.");
        return false;
      }

      if (!functionalUse) {
        toast.error("Functional use is required.");
        return false;
      }

      if (!handmade) {
        toast.error("Please specify if the artwork is handmade.");
        return false;
      }

      return true;
    },

    pricing: () => {
      const {
        sellingPrice,
        marketPrice,
        discount,
        installmentDuration,
        allowInstallments,
        includeGst,
        gstPercentage,
        offers
      } = pricingData;
      const final = finalPrice;

      if (!sellingPrice || sellingPrice <= 0) {
        toast.error("Selling price must be greater than 0.");
        return false;
      }

      if (marketPrice && Number(marketPrice) <= Number(sellingPrice)) {
        toast.error("Market price must be greater than selling price.");
        return false;
      }

      if (discount < 0 || discount > 100) {
        toast.error("Discount must be between 0% and 100%.");
        return false;
      }

      if (final <= 0) {
        toast.error("Final price must be greater than 0.");
        return false;
      }

      if (includeGst && (!gstPercentage || gstPercentage <= 0 || gstPercentage > 100)) {
        toast.error("GST percentage must be between 1% and 100%.");
        return false;
      }

      if (allowInstallments && !installmentDuration) {
        toast.error("Please select an  installment duration.");
        return false;
      }

      if (offers && Array.isArray(offers) && offers.length > 5) {
        toast.error("You cannot apply more than 5 offers at once.");
        return false;
      }

      return true;
    },

    shipping: () => {
      const { shippingCharges, handlingTime, estimatedDelivery, packagingType, returnPolicy } = formData;


      if (shippingCharges === '' || shippingCharges === null || isNaN(shippingCharges) || parseFloat(shippingCharges) < 0) {
        toast.error("Shipping Charges are required and must be 0 or more.");
        return false;
      }


      if (!handlingTime || !handlingTime.label || handlingTime.label.trim() === '') {
        toast.error("Estimated Handling Time is required.");
        return false;
      }


      if (!estimatedDelivery || !estimatedDelivery.label || estimatedDelivery.label.trim() === '') {
        toast.error("Estimated Delivery Time is required.");
        return false;
      }

      if (!packagingType || !packagingType.value) {
        toast.error("Packaging Type is required.");
        return false;
      }


      if (!returnPolicy || !returnPolicy.value) {
        toast.error("Return Policy is required.");
        return false;
      }


      return true;
    },
    payoutDetails: () => {
      const { giftWrappingCost, giftWrappingCostAmount } = formData;
      if (giftWrappingCost) {
        if (!giftWrappingCostAmount || isNaN(giftWrappingCostAmount) || Number(giftWrappingCostAmount) <= 0) {
          toast.error("Please enter a valid wrapping cost amount.");
          return false;
        }
      }
      return true;
    },


    antique: () => {
      const missingFields = [];

      if (!formData.originRegion) missingFields.push("Origin / Region");
      if (!formData.periodEra) missingFields.push("Period / Era");
      if (!formData.antiqueCondition) missingFields.push("Condition");
      if (!formData.originalReproduction) missingFields.push("Original vs. Reproduction");
      if (formData.isHandmade === undefined || formData.isHandmade === null) {
        missingFields.push("Specify if handmade");
      }

      if (formData.conservationStatus?.value === "restored") {
        if (!formData.restorationHistory) missingFields.push("Restoration History");
        if (!formData.restorationDocumentation)
          missingFields.push("Restoration Documentation");
      }

      if (!formData.conservationStatus) missingFields.push("Conservation Status");
      if (!formData.certification) missingFields.push("Certification Document");
      if (!formData.maintenanceRequired) missingFields.push("Maintenance Required");

      const hasAnyAddressField = [
        formData.addressLine1,
        formData.city,
        formData.state,
        formData.country,
        formData.pincode,
      ].some(Boolean);

      if (hasAnyAddressField) {
        if (!formData.addressLine1) missingFields.push("Address Line 1");
        if (!formData.city) missingFields.push("City");
        if (!formData.state) missingFields.push("State");
        if (!formData.country) missingFields.push("Country");
        if (!formData.pincode) missingFields.push("Pincode");
      }

      if (missingFields.length > 0) {
        toast.error(`Please fill Required Details: ${missingFields.join(", ")}.`);
        return false;
      }

      return true;
    },

    nft: () => {
      const missingFields = [];

      if (!formData.blockchainNetwork) missingFields.push("Blockchain Network");
      if (!formData.smartContractAddress) missingFields.push("Smart Contract Address");
      if (!formData.tokenStandard) missingFields.push("Token Standard");
      if (!formData.tokenId) missingFields.push("Token ID");
      if (!formData.walletAddress) missingFields.push("Wallet Address of Creator");
      if (!formData.royaltyPercentage && formData.royaltyPercentage !== 0)
        missingFields.push("Royalty Percentage");
      if (!formData.mintingType) missingFields.push("Minting Type");
      if (!formData.licenseType) missingFields.push("License Type");

      if (formData.ipfsStorage) {
        if (!formData.ipfsLink) missingFields.push("IPFS Link");
      }

      if (formData.unlockableContent) {
        if (!formData.unlockableContentLink)
          missingFields.push("Unlockable Content Link");
      }

      if (formData.partOfCollection) {
        if (!formData.collectionName) missingFields.push("Collection Name");
        if (!formData.editionSize) missingFields.push("Edition Size");

        const hasAnyAddressField = [
          formData.addressLine1,
          formData.city,
          formData.state,
          formData.country,
          formData.pincode,
        ].some(Boolean);

        if (hasAnyAddressField) {
          if (!formData.addressLine1) missingFields.push("Address Line 1");
          if (!formData.city) missingFields.push("City");
          if (!formData.state) missingFields.push("State");
          if (!formData.country) missingFields.push("Country");
          if (!formData.pincode) missingFields.push("Pincode");
        }
      }

      if (!formData.rarityType) missingFields.push("Rarity Type");
      if (!formData.traits) missingFields.push("Traits & Attributes");

      if (missingFields.length > 0) {
        toast.error(`Please fill Required Details: ${missingFields.join(", ")}.`);
        return false;
      }

      return true;
    },




  };

  const handleTabClick = (targetTab) => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const targetIndex = tabOrder.indexOf(targetTab);

    if (targetIndex <= currentIndex) {
      setActiveTab(targetTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    for (let i = currentIndex; i < targetIndex; i++) {
      const tabKey = tabOrder[i];
      const validator = tabValidators[tabKey];
      if (validator && !validator()) {
        return;
      }
    }

    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const currentTabKey = tabOrder[currentIndex];
    const validator = tabValidators[currentTabKey];
    if (validator && !validator()) return;
    const nextTab = tabOrder[currentIndex + 1];
    if (nextTab) {
      setActiveTab(nextTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

    const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setCreatedProductId(null);
    navigate(`/seller/product`);
  };

  const handleSetShippingAddress = () => {
    setShowSuccessModal(false);
    setShowAddressModal(true);
  };

  const handleAddressModalClose = () => {
    setShowAddressModal(false);
    setCreatedProductId(null);
    navigate(`/seller/product`);
  };

  const handleAddressSaved = () => {
    setShowAddressModal(false);
    setCreatedProductId(null);
    toast.success("Shipping address set successfully! Your product is now eligible for approval.");
    navigate(`/seller/product`);
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>Create Product</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <span onClick={() => navigate('/seller/dashboard')} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-dashboard"></i>
                </span>
              </li>
              <li className="breadcrumb-item active">
                <span onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
                  All Product
                </span>
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
                    onClick={() => handleTabClick('basic')}
                  >
                    Basic Details
                  </button>
                </li>
                {isNFTArtSelected && (
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${activeTab === 'nft' ? 'active' : ''}`}
                      onClick={() => handleTabClick('nft')}
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
                      onClick={() => handleTabClick('antique')}
                    >
                      Antique
                    </button>
                  </li>
                )}

                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'images' ? 'active' : ''}`}
                    onClick={() => handleTabClick('images')}
                  >
                    Images & Media
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'artwork' ? 'active' : ''}`}
                    onClick={() => handleTabClick('artwork')}
                  >
                    Artwork Details
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`}
                    onClick={() => handleTabClick('pricing')}
                  >
                    Pricing & Offers
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'shipping' ? 'active' : ''}`}
                    onClick={() => handleTabClick('shipping')}
                  >
                    Shipping & Delivery
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'payoutDetails' ? 'active' : ''}`}
                    onClick={() => handleTabClick('payoutDetails')}
                  >
                    Payout Details
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'legal' ? 'active' : ''}`}
                    onClick={() => handleTabClick('legal')}
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

                <div className="ms-auto">
                  {/* Save as Draft Button - Shows on every tab */}
                  <button
                    type="button"
                    className="btn btn-primary me-2 mx-2"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting || !formData.productName}
                  >
                    {isSubmitting ? 'Saving...' : 'Save as Draft'}
                  </button>

                  {activeTab !== 'legal' ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNextTab}
                      disabled={isSubmitting}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Product'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
         <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        onSetShippingAddress={handleSetShippingAddress}
      />

      {showAddressModal && (
        <AddressModal
          isOpen={showAddressModal}
          onClose={handleAddressModalClose}
          onSave={handleAddressSaved}
          productId={createdProductId}
          userId={userId}
        />
      )}
    </div>
  );
}

export default ProductUpload;