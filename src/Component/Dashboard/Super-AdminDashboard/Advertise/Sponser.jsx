import { useState, useEffect } from "react"
import getAPI from "../../../../api/getAPI"
import ProductSection from "./ProductSection"

import BidAdjustment from "./bidadjustmentssection"
import CampaignSettingsSection from "./campaignsettingssection"
import CampaignTypeSelection from "./campaigntypeselection"
import TargetingSection from "./TargetingSection"
import CampaignBiddingSection from "./campaignbiddingsection"
import postAPI from "../../../../api/postAPI"
import { toast } from "react-toastify"
import { useNavigate, useLocation } from "react-router-dom";


function Sponser() {
  const [activeTab, setActiveTab] = useState("search")
  const [products, setProducts] = useState([])
  const [availableProducts, setAvailableProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [showHelp, setShowHelp] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showTargetingSection, setShowTargetingSection] = useState(false)
  const [showCampaignBidding, setShowCampaignBidding] = useState(false)
  const [showBidAdjustment, setShowBidAdjustment] = useState(false)
  const [selectedCampaignType, setSelectedCampaignType] = useState(null)
  const [showCampaignTypeSelection, setShowCampaignTypeSelection] = useState(true)
  const [isBidAdjustmentValid, setIsBidAdjustmentValid] = useState(true)
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null)
  const location = useLocation();
  const campaignId = location.state?.campaignId || null;
  const campaignFromState = location.state?.campaign || null;
  const isEditMode = !!(campaignFromState || campaignId);

  const [campaignData, setCampaignData] = useState({
    campaignName: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: null,
    hasEndDate: false,
    country: "India",
    dailyBudget: 300,
    selectedProductIds: [],
      biddingStrategy: "dynamic-up-down",
      targetingType: "automatic",
      automaticBidType: "default",
      defaultBid: 0,
      targetingGroups: {},
      selectedKeywords: [],
      bidAdjustments: {
        homepage: 0,
        topOfSearch: 0,
        productPage: 0,
        blogPage: 0,
        communityFeed: 0,
        communitySidebar: 0,
      },
    })

  // Pre-fill from campaign state (edit mode)
  useEffect(() => {
    const data = campaignFromState;
    if (!data) return;

    setCampaignData(data);
    setUserId(data.userId?._id || data.userId || null);

    if (data.selectedProductsDetails && data.selectedProductsDetails.length > 0) {
      setSelectedProducts(data.selectedProductsDetails);
      setSelectedCampaignType("product");
    } else {
      setSelectedCampaignType("profile");
    }

    setShowCampaignTypeSelection(false);
    // In edit mode, show all sections
    setShowTargetingSection(true);
    setShowCampaignBidding(true);
    setShowBidAdjustment(true);
  }, [campaignFromState]);

  // Fetch by campaignId if no inline state
  useEffect(() => {
    if (!campaignFromState && campaignId) {
      getAPI(`/api/campaign/${campaignId}`)
        .then((res) => {
          const data = res.data?.data || res.data || res;
          setCampaignData(data);
          setUserId(data.userId?._id || data.userId || null);

          if (data.selectedProductsDetails && data.selectedProductsDetails.length > 0) {
            setSelectedProducts(data.selectedProductsDetails);
            setSelectedCampaignType("product");
          } else {
            setSelectedCampaignType("profile");
          }

          setShowCampaignTypeSelection(false);
          setShowTargetingSection(true);
          setShowCampaignBidding(true);
          setShowBidAdjustment(true);
        })
        .catch((err) => console.error("Error fetching campaign:", err));
    }
  }, [campaignId, campaignFromState]);

  const handleCampaignSettingsUpdate = (settings) => {
    if (settings.userId) {
      setUserId(settings.userId);
    }
    setCampaignData((prev) => ({ ...prev, ...settings }))
  }

  const handleProductSelectionUpdate = (products) => {
    setSelectedProducts(products)
    setCampaignData((prev) => ({
      ...prev,
      selectedProductsDetails: products,
    }))
  }

  const productsPerPage = 5
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";

  const handleCampaignTypeSelect = (type) => {
    setSelectedCampaignType(type)
    setShowCampaignTypeSelection(false)
  }

  const handleBack = () => {
    setSelectedCampaignType(null)
    setShowCampaignTypeSelection(true)
  }

  const handleUpdateSelectedProducts = (productIds) => {
    setCampaignData((prev) => ({ ...prev, selectedProductIds: productIds }))
  }

  const handleUpdateBidAdjustments = (adjustments) => {
    setCampaignData((prev) => ({ ...prev, bidAdjustments: adjustments }))
  }

  const handleUpdateTargetingSettings = (settings) => {
    setCampaignData((prev) => ({ ...prev, ...settings }))
  }

  const handleUpdateBiddingStrategy = (strategy) => {
    setCampaignData((prev) => ({ ...prev, biddingStrategy: strategy }))
  }

  const handleSave = async () => {
    if (!isBidAdjustmentValid) {
      toast.error("Bid adjustments must total exactly 100%.");
      return;
    }
    if (!userId) {
      toast.error("User ID not found. Please select a user.");
      return;
    }

    try {
      const payload = {
        ...campaignData,
        userId: userId,
        selectedProductsDetails: selectedProducts,
        selectedProductIds: selectedProducts.map((p) => p._id),
      };
      const response = await postAPI("/api/create-campaign", payload)

      if (response.hasError) {
        toast.error(response.message)
      } else {
        toast.success(isEditMode ? "Campaign updated successfully!" : "Campaign saved successfully!");
        navigate("/super-admin/advertise")
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to save campaign."
      toast.error(errMsg)
    }
  }

  const handleSaveDraft = async () => {
    if (!campaignData.campaignName || campaignData.campaignName.trim() === "") {
      toast.error("Campaign title is required to save as draft.");
      return;
    }
    try {
      const draftPayload = {
        ...campaignData,
        _id: campaignData._id || campaignId,
        isDraft: true,
        userId: userId,
        selectedProductsDetails: selectedProducts,
        selectedProductIds: selectedProducts.map((p) => p._id),
      };

      const response = await postAPI("/api/create-campaign", draftPayload);
      if (response.hasError) {
        toast.error(response.message);
      } else {
        toast.success("Campaign saved as draft!");
        navigate("/super-admin/advertise")
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to save draft.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>{selectedCampaignType === "profile" ? "Sponsored Profile" : "Products"}</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/super-admin/dashboard">
                  <i className="fa fa-dashboard"></i>
                </a>
              </li>
              <li className="breadcrumb-item">Advertise</li>
              <li className="breadcrumb-item active">
                {selectedCampaignType === "profile" ? "Sponsored Profile" : "Products"}
              </li>
            </ul>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex flex-row-reverse"></div>
          </div>
        </div>
      </div>

      <div className="row clearfix">
        <div className="col-lg-12">
          {showCampaignTypeSelection && (
            <CampaignTypeSelection onSelectCampaignType={handleCampaignTypeSelect} />
          )}
          {selectedCampaignType === "product" && (
            <>
              <CampaignSettingsSection
                initialUserType={campaignData.userType || ""}
                initialUserId={typeof campaignData.userId === 'object' ? (campaignData.userId?._id || "") : (campaignData.userId || "")}
                initialCampaignName={campaignData.campaignName}
                initialStartDate={campaignData.startDate}
                initialEndDate={campaignData.endDate}
                initialHasEndDate={campaignData.hasEndDate}
                initialCountry={campaignData.country}
                initialDailyBudget={campaignData.dailyBudget}
                onUpdateCampaignSettings={handleCampaignSettingsUpdate}
              />
              {!userId ? (
                <div className="card p-3 mb-4">
                  <h5>Please select a user to load products.</h5>
                </div>
              ) : (<ProductSection
                userId={userId}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                products={products}
                availableProducts={availableProducts}
                setAvailableProducts={setAvailableProducts}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                showHelp={showHelp}
                setShowHelp={setShowHelp}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                productsPerPage={productsPerPage}
                BASE_URL={BASE_URL}
                setShowTargetingSection={setShowTargetingSection}
                setShowCampaignBidding={setShowCampaignBidding}
                setShowBidAdjustment={setShowBidAdjustment}
                initialSelectedProducts={selectedProducts}
                  onUpdateSelectedProducts={handleUpdateSelectedProducts}
                  isEditMode={isEditMode}
                />)}
              {showTargetingSection && (
                  <TargetingSection
                      selectedProducts={selectedProducts}
                      defaultBid={campaignData.defaultBid}
                      onUpdateTargetingSettings={handleUpdateTargetingSettings}
                    />
                )}
                {showCampaignBidding && (
                  <CampaignBiddingSection
                    initialBiddingStrategy={campaignData.biddingStrategy}
                    onUpdateBiddingStrategy={handleUpdateBiddingStrategy}
                  />
                )}
                {showTargetingSection && (
                  <BidAdjustment
                  initialBidAdjustments={campaignData.bidAdjustments}
                  onUpdateBidAdjustments={handleUpdateBidAdjustments}
                  setIsBidAdjustmentValid={setIsBidAdjustmentValid}
                />
              )}

              {showTargetingSection && (
                <div className="card p-3 ">
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-secondary w-100 mr-2" onClick={handleSaveDraft} >
                      Save as Draft
                    </button>
                    <button className="btn btn-primary w-100" onClick={handleSave}>
                      {isEditMode ? "Update Campaign" : "Save Campaign"}
                    </button>
                  </div>
                </div>
              )}

            </>
          )}
          {selectedCampaignType === "profile" && (
            <div className="card p-3 mb-4">
              <h3>Sponsored Profile - Coming Soon</h3>
              <p>This feature is currently under development and will be available soon.</p>
              <button className="btn btn-outline-secondary mt-3" onClick={handleBack}>
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sponser
