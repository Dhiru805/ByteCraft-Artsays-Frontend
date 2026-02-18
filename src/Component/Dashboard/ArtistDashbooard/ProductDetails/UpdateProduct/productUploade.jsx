  // src/components/productUpload/ProductUpload.js
  import React, { useState,useEffect } from "react";
  import { Link, useNavigate, useLocation } from "react-router-dom";
  import useUserType from "../../../urlconfig";
  import { toast } from "react-toastify";
  import putAPI from "../../../../../api/putAPI";
  import BasicDetails from "./Sections/BasicDetails";
  import ImagesMedia from "./Sections/ImagesMedia";
  import ArtworkDetails from "./Sections/ArtworkDetails";
  import PricingOffers from "./Sections/PricingOffers";
  import ShippingDelivery from "./Sections/ShippingDelivery";
  
  import LegalCompliance from "./Sections/LegalCompliance";
  import NFTDetails from "./Sections/NFTDetails";
  import AntiqueVintageDetails from "./Sections/AntiqueVintageDetails";
  import useProductForm from "./hooks/useProductForm";
  import AddressModal from "../ShippingAddressModal";
  import getAPI from "../../../../../api/getAPI";

  function ProductUpload() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("basic");
    const { state } = useLocation();
    const product = state?.productData;

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
      profileData,
    } = useProductForm(product);
      const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [hasDefaultAddress, setHasDefaultAddress] = useState(false);
  const [isCheckingAddress, setIsCheckingAddress] = useState(false);

 useEffect(() => {
    if (product?._id) {
      checkDefaultShippingAddress();
    }
  }, [product?._id]);


  const checkDefaultShippingAddress = async () => {
    if (!product?._id) return false;
    
    setIsCheckingAddress(true);
    try {
      const response = await getAPI(
        `/api/get-default-shipping-address/${product._id}`,
        {},
        true,
        false
      );
      
        
      
  
      if (!response.hasError && response.data.data && response.data.data.isDefault === true) {
        setHasDefaultAddress(true);
        return true;
      } else {
        setHasDefaultAddress(false);
        return false;
      }
    } catch (err) {
      console.error("Error checking default address:", err);
      setHasDefaultAddress(false);
      return false;
    } finally {
      setIsCheckingAddress(false);
    }
  };


    const validateAntiqueFields = (data) => {
      const errors = {};
      if (!data.originRegion) errors.originRegion = "Origin/Region is required";
      if (!data.periodEra) errors.periodEra = "Period/Era is required";
      if (!data.antiqueCondition) errors.antiqueCondition = "Condition is required";
      if (!data.originalReproduction) errors.originalReproduction = "Original vs. Reproduction is required";
      if (data.isHandmade === undefined) errors.isHandmade = "Please specify if handmade";
      return Object.keys(errors).length > 0 ? errors : null;
    };

    const prepareFormData = (status = "Pending") => {
      const fd = new FormData();
      fd.append("status", status);
      fd.append("userId", userId);

      // Basic
      fd.append("productName", formData.productName);
      fd.append("mainCategory", formData.mainCategory?.value || "");
      fd.append("category", formData.category?.value || "");
      fd.append("subCategory", formData.subCategory?.value || "");
      fd.append("productType", formData.productType?.value || "");
      if (formData.productType?.value === "Limited Edition") {
        fd.append("editionNumber", parseInt(formData.editionNumber));
      }
      fd.append("description", formData.description || "");
      fd.append("targetedAudience", formData.targetedAudience || "");
      fd.append("inspirationSource", formData.inspirationSource || "");
      tags.forEach((t) => fd.append("tags", t));

      // Artwork
      fd.append("medium", formData.medium?.value || "");
      formData.materials.forEach((m) => fd.append("materials", m.value || m.label));
      fd.append("width", formData.width || "");
      fd.append("height", formData.height || "");
      fd.append("depth", formData.depth || "");
      if (formData.weight) fd.append("weight", parseFloat(formData.weight));

      fd.append('printResolution', formData.printResolution ||"");
    
      fd.append("year", formData.year?.value || "");
      fd.append("editionType", formData.editionType?.value || "");
      fd.append("framing", formData.framing?.value || "");
      fd.append("quantity", parseInt(formData.quantity) || 1);
      if (formData.hsnCode) fd.append("hsnCode", formData.hsnCode);
      if (formData.surfaceType) fd.append("surfaceType", formData.surfaceType?.value || "");
      if (formData.culturalRegion) fd.append("culturalRegion", formData.culturalRegion?.value || "");
      if (formData.biologicalMaterial) fd.append("biologicalMaterial", formData.biologicalMaterial);
      fd.append("functionalUse", formData.functionalUse?.value || "");
      if (formData.materialSource) fd.append("materialSource", formData.materialSource);
      if (formData.craftTechnique) fd.append("craftTechnique", formData.craftTechnique);
       if (formData.toolUsage) {
      formData.toolUsage.forEach((t) =>
        fd.append('toolUsage', t.value || t.label)
      );
    }
      fd.append("handmade", formData.handmade?.value || "");
      fd.append("isSigned", formData.isSigned || false);
      fd.append("isResinCovered", formData.isResinCovered || false);
      fd.append("condition", formData.condition?.value || "");
      if (formData.condition?.value?.toLowerCase() === "resale" && formData.provenance) {
        fd.append("provenance", formData.provenance);
      }

      // Images
      if (formData.iframeLink) fd.append("iframeLink", formData.iframeLink);
      images.forEach((img) => {
        if (img.file) fd.append("images", img.file);  
        else if (img.isExisting) fd.append("existingImages", img.preview); 
      });

//       images.forEach((img) => {
//   if (img.file) formData.append("images", img.file);
//   else if (img.isExisting) formData.append("existingImages[]", img.preview);
// });


      // Pricing
      fd.append("sellingPrice", parseFloat(pricingData.sellingPrice) || 0);
      if (pricingData.marketPrice) fd.append("marketPrice", parseFloat(pricingData.marketPrice));
      if (pricingData.discount) fd.append("discount", parseFloat(pricingData.discount));
       fd.append("finalPrice", parseFloat(pricingData.finalPrice) || parseFloat(finalPrice) || 0);
      fd.append("allowInstallments", pricingData.allowInstallments || false);
      if (pricingData.allowInstallments && pricingData.installmentDuration) {
        fd.append("installmentDuration", pricingData.installmentDuration.value);
      }
      fd.append("includeGst", pricingData.includeGst || false);
      fd.append("gstPercentage", parseFloat(pricingData.gstPercentage) || 0);

      // Shipping
      fd.append("shippingCharges", parseFloat(formData.shippingCharges) || 0);
      fd.append("estimatedDelivery", formData.estimatedDelivery?.value || "");
      fd.append("packagingType", formData.packagingType?.value || "");
      fd.append("insuranceCoverage", formData.insuranceCoverage || false);
      fd.append("selfShipping", formData.selfShipping || false);
      fd.append("returnPolicy", formData.returnPolicy?.value || "");
      fd.append("handlingTime", formData.handlingTime?.value || "");
      fd.append("exportRestriction", formData.exportRestriction || false);

    // Gift Wrapping
    fd.append("giftWrapping", formData.giftWrapping || false);
    if (formData.giftWrapping) {
      fd.append("giftWrappingCustomMessage", formData.giftWrappingCustomMessage || "");
      fd.append("giftWrappingCost", formData.giftWrappingCost || false);
      if (formData.giftWrappingCost) {
        fd.append("giftWrappingCostAmount", parseFloat(formData.giftWrappingCostAmount) || 0);
      }
    }

           // ---------------------------------------------Legal & Compliance---------------------------------------------
      fd.append("ownershipConfirmation", !!formData.ownershipConfirmation);
      fd.append("copyrightRights", formData.copyrightRights?.value || "");
      fd.append("prohibitedItems", !!formData.prohibitedItems);
      fd.append("artistSignature", !!formData.artistSignature);
      fd.append("signatureType", formData.signatureType || "");
      fd.append("coaAvailable", !!formData.coaAvailable);
      fd.append("certificateFormat", formData.certificateFormat || "digital");

    // fd.append('ownershipConfirmation', formData.ownershipConfirmation);
    // fd.append('copyrightRights', formData.copyrightRights?.value || formData.copyrightRights?.label || '');
    // fd.append('prohibitedItems', formData.prohibitedItems);
    // fd.append('artistSignature', formData.artistSignature);
    // fd.append('signatureType', formData.signatureType || '');
    // fd.append('coaAvailable', formData.coaAvailable);
    // fd.append('certificateFormat', formData.certificateFormat || 'digital');

      // File uploads
      if (formData.certificateFile) {
      fd.append('certificateFile', formData.certificateFile);
      }

      // COA metadata (only if COA is available)
      if (formData.coaAvailable) {
      fd.append('certificateType', formData.certificateType?.value || formData.certificateType?.label || '');
      fd.append('issuerName', formData.issuerName || '');
      fd.append('verificationNumber', formData.verificationNumber || '');
        if (formData.coaFile) {
        fd.append('coaFile', formData.coaFile);
        }
      }

      // License & Usage Rights
    fd.append('commercialUse', formData.commercialUse?.value || formData.commercialUse?.label || '');
    fd.append('royaltyTerms', formData.royaltyTerms || '');
    fd.append('ethicalSourcing', !!formData.ethicalSourcing);

      // NFT
      if (formData.blockchainNetwork) fd.append("blockchainNetwork", formData.blockchainNetwork.value);
      fd.append("smartContractAddress", formData.smartContractAddress || "");
      if (formData.tokenStandard) fd.append("tokenStandard", formData.tokenStandard.value);
      fd.append("tokenId", formData.tokenId || "");
      fd.append("walletAddress", formData.walletAddress || "");
      fd.append("royaltyPercentage", formData.royaltyPercentage || 0);
      if (formData.mintingType) fd.append("mintingType", formData.mintingType.value);
      if (formData.licenseType) fd.append("licenseType", formData.licenseType.value);
     fd.append('ipfsStorage', formData.ipfsStorage || false);
    if (formData.ipfsStorage) {
      fd.append('ipfsLink', formData.ipfsLink?.trim() || '');
      fd.append('softwareVersion', formData.softwareVersion?.trim() || '');
      fd.append('fileFormat', formData.fileFormat?.trim() || '');
    }
    fd.append('unlockableContent', formData.unlockableContent || false);
    if (formData.unlockableContent) {
      fd.append('unlockableContentLink', formData.unlockableContentLink?.trim() || '');
    }
      fd.append("partOfCollection", formData.partOfCollection || false);
      fd.append("collectionName", formData.collectionName || "");
      if (formData.partOfCollection) fd.append("editionSize", parseInt(formData.editionSize) || 1);
      if (formData.rarityType) fd.append("rarityType", formData.rarityType.value);
      fd.append("traits", formData.traits || "");

      // Antique
      if (formData.originRegion) fd.append("originRegion", formData.originRegion.value);
      if (formData.periodEra) fd.append("periodEra", formData.periodEra.value);
      if (formData.antiqueCondition) fd.append("antiqueCondition", formData.antiqueCondition.value);
      if (formData.conservationStatus) fd.append("conservationStatus", formData.conservationStatus.value);
      fd.append("restorationHistory", formData.restorationHistory || "");
       if (formData.restorationDocumentation) {
      fd.append('restorationDocumentation', formData.restorationDocumentation);
    }
      fd.append("provenanceHistory", formData.provenanceHistory || "");
      fd.append("culturalSignificance", formData.culturalSignificance || "");
      fd.append("appraisalDetails", formData.appraisalDetails || "");
      fd.append("engravingMarkings", formData.engravingMarkings || "");
      fd.append("patinaWear", formData.patinaWear || "");
      fd.append("isHandmade", formData.isHandmade || false);
      if (formData.originalReproduction) fd.append("originalReproduction", formData.originalReproduction.value);
      fd.append("museumExhibitionHistory", formData.museumExhibitionHistory || "");
      if (formData.maintenanceRequired) fd.append("maintenanceRequired", formData.maintenanceRequired.value);
      fd.append("customEngravingAvailable", formData.customEngravingAvailable || false);
      if (formData.certification) {
      fd.append('certification', formData.certification);
    }

      // Address
      fd.append("addressLine1", formData.addressLine1 || profileData.address?.line1 || "");
      fd.append("addressLine2", formData.addressLine2 || profileData.address?.line2 || "");
      fd.append("landmark", formData.landmark || profileData.address?.landmark || "");
      fd.append("city", formData.city || profileData.address?.city || "");
      fd.append("state", formData.state || profileData.address?.state || "");
      fd.append("country", formData.country || profileData.address?.country || "");
      fd.append("pincode", formData.pincode || profileData.address?.pincode || "");

      return fd;
    };

    const handleSaveDraft = async () => {
      if (!userId) return toast.error("User not authenticated");
      if (!formData.productName) return toast.error("Product name is required");

      setIsSubmitting(true);
      try {
        const fd = prepareFormData("Drafted");
        await putAPI(`/api/update-products/${product._id}`, fd, {}, true);
        toast.success("Saved as draft");
        navigate("/artist/product");
      } catch (err) {
        toast.error(err.response?.data?.message || "Save failed");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

         const hasDefaultAddr = await checkDefaultShippingAddress();
    if (!hasDefaultAddr) {
      toast.error("Please set a default shipping address first");
      setIsAddressModalOpen(true);
      setIsSubmitting(false);
      return;
    }

      if (!userId) {
        toast.error("User not authenticated");
        setIsSubmitting(false);
        return;
      }
      if (!pricingData.sellingPrice) {
        toast.error("Selling price required");
        setIsSubmitting(false);
        return;
      }
      if (!formData.mainCategory || !formData.category || !formData.subCategory || !formData.productType) {
        toast.error("All category fields required");
        setIsSubmitting(false);
        return;
      }
      if (formData.productType?.value === "Limited Edition" && !formData.editionNumber) {
        toast.error("Edition number required");
        setIsSubmitting(false);
        return;
      }
      if (formData.partOfCollection && !formData.editionSize) {
        toast.error("Edition size required");
        setIsSubmitting(false);
        return;
      }
      if (isAntiqueVintageSelected) {
        const err = validateAntiqueFields(formData);
        if (err) {
          toast.error("Fill all Antique fields");
          setActiveTab("antique");
          setIsSubmitting(false);
          return;
        }
      }

      try {
        const fd = prepareFormData("Pending");
        await putAPI(`/api/update-products/${product._id}`, fd, {}, true);
        toast.success("Product updated!");
        navigate("/artist/product");
      } catch (err) {
        toast.error(err.response?.data?.message || "Update failed");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleAddressModalClose = async () => {
    setIsAddressModalOpen(false);
    // Re-check if default address is now set
    await checkDefaultShippingAddress();
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
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
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
    const tabOrder = ['basic', ...(isNFTArtSelected ? ['nft'] : []), ...(isAntiqueVintageSelected ? ['antique'] : []), 'images', 'artwork', 'pricing', 'shipping', 'legal'];
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

        // Gift wrapping validation
        if (formData.giftWrappingCost) {
          if (!formData.giftWrappingCostAmount || isNaN(formData.giftWrappingCostAmount) || Number(formData.giftWrappingCostAmount) <= 0) {
            toast.error("Please enter a valid wrapping cost amount.");
            return false;
          }
        }

        return true;
      },

    shipping: () => {
      const { shippingCharges, handlingTime, estimatedDelivery, packagingType, returnPolicy } = formData;

      if (formData.selfShipping) {
        if (shippingCharges === '' || shippingCharges === null || isNaN(shippingCharges) || parseFloat(shippingCharges) < 0) {
          toast.error("Shipping Charges are required and must be 0 or more.");
          return false;
        }

        if (!estimatedDelivery || !estimatedDelivery.label || estimatedDelivery.label.trim() === '') {
          toast.error("Estimated Delivery Time is required.");
          return false;
        }
      }

      if (!handlingTime || !handlingTime.label || handlingTime.label.trim() === '') {
        toast.error("Estimated Handling Time is required.");
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


    legal: () => {
      const missingFields = [];

      if (!formData.ownershipConfirmation) missingFields.push("Ownership Confirmation");
      if (!formData.copyrightRights) missingFields.push("Copyright & Reproduction Rights");
      if (!formData.commercialUse) missingFields.push("Commercial Use");
      if (!formData.prohibitedItems) missingFields.push("Prohibited Items Confirmation");

      if (missingFields.length > 0) {
        toast.error(`Please fill the following required fields: ${missingFields.join(", ")}.`);
        return false;
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

    return (
      <div className="container-fluid">
        <div className="block-header">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h2>Update Product</h2>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <span onClick={() => navigate('/artist/dashboard')} style={{ cursor: 'pointer' }}>
                    <i className="fa fa-dashboard"></i>
                  </span>
                </li>
                <li className="breadcrumb-item active">
                  <span onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
                    All Product
                  </span>
                </li>
                <li className="breadcrumb-item">Update Product</li>
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
                        const tabs = ['basic', ...(isNFTArtSelected ? ['nft'] : []), ...(isAntiqueVintageSelected ? ['antique'] : []), 'images', 'artwork', 'pricing', 'shipping', 'legal'];
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
                        key="next-btn"
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNextTab}
                        disabled={isSubmitting}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        key="submit-btn"
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || isCheckingAddress}
                      >
                        {isSubmitting ? 'Updating...' : 'Update'}
                      </button>
                    )}
                  </div>
                  </div>
              </form>
            </div>
          </div>
        </div>
         <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleAddressModalClose}
        productId={product?._id}
      />
      </div>
    );
  }

  export default ProductUpload;