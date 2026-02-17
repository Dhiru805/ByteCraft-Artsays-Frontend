import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import useUserType from "../../../urlconfig";
import { toast } from "react-toastify";
import getAPI from "../../../../../api/getAPI";
import BasicDetails from "./Sections/BasicDetails";
import ImagesMedia from "./Sections/ImagesMedia";
import ArtworkDetails from "./Sections/ArtworkDetails";
import PricingOffers from "./Sections/PricingOffers";
import ShippingDelivery from "./Sections/ShippingDelivery";
import LegalCompliance from "./Sections/LegalCompliance";
import NFTDetails from "./Sections/NFTDetails";
import AntiqueVintageDetails from "./Sections/AntiqueVintageDetails";
import useProductForm from "./hooks/useProductForm";

function ProductViewSeller() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [activeTab, setActiveTab] = useState("basic");
  const { state } = useLocation();
  const [productData, setProductData] = useState(state?.productData);

  useEffect(() => {
    if (!productData && productId) {
      const fetchProduct = async () => {
        try {
          const res = await getAPI(`/api/product/details/${productId}`, {}, true, false);
          if (res?.data?.success) {
            setProductData(res.data.product);
          }
        } catch (err) {
          console.error("Error fetching product:", err);
          toast.error("Failed to load product details");
        }
      };
      fetchProduct();
    }
  }, [productId, productData]);

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
  } = useProductForm(productData);

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
            readOnly={true}
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
            readOnly={true}
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
            readOnly={true}
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
            readOnly={true}
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
            mainCategoryId={formData.mainCategory?.value}
            readOnly={true}
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
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
              readOnly={true}
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
            readOnly={true}
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
            readOnly={true}
          />
        );
      default:
        return null;
    }
  };
  const tabOrder = ['basic', ...(isNFTArtSelected ? ['nft'] : []), ...(isAntiqueVintageSelected ? ['antique'] : []), 'images', 'artwork', 'pricing', 'shipping', 'legal'];

  const handleTabClick = (targetTab) => {
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const nextTab = tabOrder[currentIndex + 1];
    if (nextTab) {
      setActiveTab(nextTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!productData) return <p className="text-center mt-4">Loading details...</p>;

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>View Product</h2>
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
              <li className="breadcrumb-item">View Product</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          <div className="card">
            <div className="bg-white p-4 rounded">
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
                  {activeTab !== 'legal' && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNextTab}
                      disabled={isSubmitting}
                    >
                      Next
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductViewSeller;
