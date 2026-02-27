// import { useState, useEffect } from "react";
// import getAPI from "../../../../api/getAPI";
// import ProductSection from "./ProductSection";
// import TargetingSection from "./TargetingSection";
// import CampaignBidding from "./campaignbiddingsection";
// import BidAdjustment from "./bidadjustmentssection";
// import CampaignSettingsSection from "./campaignsettingssection";
// import CampaignTypeSelection from "./campaigntypeselection";
// import postAPI from "../../../../api/postAPI";
// import { toast } from 'react-toastify';

// function Sponser() {
//     const [activeTab, setActiveTab] = useState("search");
//   const [products, setProducts] = useState([]);
//   const [availableProducts, setAvailableProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("newest");
//   const [loading, setLoading] = useState(true);
//   const [showHelp, setShowHelp] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showTargetingSection, setShowTargetingSection] = useState(false);
//   const [showCampaignBidding, setShowCampaignBidding] = useState(false);
//   const [showBidAdjustment, setShowBidAdjustment] = useState(false);
//   const [selectedCampaignType, setSelectedCampaignType] = useState(null);
//   const [showCampaignTypeSelection, setShowCampaignTypeSelection] = useState(true);
//   const [campaignData, setCampaignData] = useState({});



//   const productsPerPage = 5;
//   const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE || "";

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const userId = localStorage.getItem("userId");
//       try {
//         setLoading(true);
//         const result = await getAPI(`/api/getproductbyartist/${userId}`, {}, true, false);
//         if (result && result.data && Array.isArray(result.data.data)) {
//           setProducts(result.data.data);
//           setAvailableProducts(result.data.data);
//         } else {
//           setProducts([]);
//           setAvailableProducts([]);
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setProducts([]);
//         setAvailableProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);


//   const handleCampaignTypeSelect = (type) => {
//     setSelectedCampaignType(type);
//     setShowCampaignTypeSelection(false);
//   };

//   const handleBack = () => {
//     setSelectedCampaignType(null);
//     setShowCampaignTypeSelection(true);
//   };


//   const handleSave = async () => {
//    try {
//     const response = await postAPI('/api/campaigns/create', campaignData);
//     console.log("Save Response:", response);

//     if (response.hasError) {
//       toast.error(response.message); 
//     } else {
//       toast.success('Campaign saved successfully!'); 
//     }
//   } catch (error) {
//     console.error("Error saving campaign:", error);
//     const errMsg = error.response?.data?.message || 'Failed to save campaign.';
//     toast.error(errMsg);
//   }
//   };


//   return (
//     <div className="container-fluid">
//       <div className="block-header">
//         <div className="row">
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <h2>{selectedCampaignType === "profile" ? "Sponsored Profile" : "Products"}</h2>
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <a href="/">
//                   <i className="fa fa-dashboard"></i>
//                 </a>
//               </li>
//               <li className="breadcrumb-item">Advertise</li>
//               <li className="breadcrumb-item active">
//                 {selectedCampaignType === "profile" ? "Sponsored Profile" : "Products"}
//               </li>
//             </ul>
//           </div>
//           <div className="col-lg-6 col-md-6 col-sm-12">
//             <div className="d-flex flex-row-reverse"></div>
//           </div>
//         </div>
//       </div>

//       <div className="row clearfix">
//         <div className="col-lg-12">
//           {showCampaignTypeSelection && (
//             <CampaignTypeSelection onSelectCampaignType={handleCampaignTypeSelect} />
//           )}
//           {selectedCampaignType === "product" && (
//             <>
//               <CampaignSettingsSection />
//               <ProductSection
//                 activeTab={activeTab}
//                 setActiveTab={setActiveTab}
//                 products={products}
//                 availableProducts={availableProducts}
//                 setAvailableProducts={setAvailableProducts}
//                 selectedProducts={selectedProducts}
//                 setSelectedProducts={setSelectedProducts}
//                 searchQuery={searchQuery}
//                 setSearchQuery={setSearchQuery}
//                 sortBy={sortBy}
//                 setSortBy={setSortBy}
//                 loading={loading}
//                 showHelp={showHelp}
//                 setShowHelp={setShowHelp}
//                 currentPage={currentPage}
//                 setCurrentPage={setCurrentPage}
//                 productsPerPage={productsPerPage}
//                 BASE_URL={BASE_URL}
//                 setShowTargetingSection={setShowTargetingSection}
//                 setShowCampaignBidding={setShowCampaignBidding}
//                 setShowBidAdjustment={setShowBidAdjustment}
//               />
//               {showTargetingSection && <TargetingSection selectedProducts={selectedProducts} />}
//               {showCampaignBidding && <CampaignBidding selectedProducts={selectedProducts} />}
//               {showBidAdjustment && <BidAdjustment selectedProducts={selectedProducts} />}
//             </>
//           )}
//           {selectedCampaignType === "profile" && (
//             <div className="card p-3 mb-4">
//               <h3>Sponsored Profile - Coming Soon</h3>
//               <p>This feature is currently under development and will be available soon.</p>
//               <button className="btn btn-outline-secondary mt-3" onClick={handleBack}>
//                 Back
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Sponser;








import { useState, useEffect } from "react"
import getAPI from "../../../../api/getAPI"
import ProductSection from "./ProductSection"
import TargetingSection from "./TargetingSection"
import CampaignBidding from "./campaignbiddingsection"
import BidAdjustment from "./bidadjustmentssection"
import CampaignSettingsSection from "./campaignsettingssection"
import CampaignTypeSelection from "./campaigntypeselection"
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
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      setUserId(storedUserId)
    }
  }, [])

 useEffect(() => {
    if (campaignFromState) {
      setCampaignData(campaignFromState)

      if (
        campaignFromState.selectedProductsDetails &&
        campaignFromState.selectedProductsDetails.length > 0
      ) {
        setSelectedProducts(campaignFromState.selectedProductsDetails)
        setSelectedCampaignType("product")
      } else {
        setSelectedCampaignType("profile")
      }

      setShowCampaignTypeSelection(false)
    }
  }, [campaignFromState])

  useEffect(() => {
    if (!campaignFromState && campaignId) {
      getAPI(`/api/campaign/${campaignId}`)
        .then((data) => {
          setCampaignData(data)

          if (data.selectedProductsDetails && data.selectedProductsDetails.length > 0) {
            setSelectedProducts(data.selectedProductsDetails)
            setSelectedCampaignType("product")
          } else {
            setSelectedCampaignType("profile")
          }

          setShowCampaignTypeSelection(false)
        })
        .catch((err) => console.error("Error fetching campaign:", err))
    }
  }, [campaignId, campaignFromState])

  const handleCampaignSettingsUpdate = (settings) => {
    setCampaignData((prev) => ({ ...prev, ...settings }))
  }

  const handleProductSelectionUpdate = (products) => {
    setSelectedProducts(products)
    setCampaignData((prev) => ({
      ...prev,
      selectedProductsDetails: products,
    }))
  }

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
    defaultBid: 0.0,
    targetingGroups: {
      closeMatch: { enabled: true, bid: 0.0 },
      looseMatch: { enabled: true, bid: 0.0 },
      substitutes: { enabled: true, bid: 0.0 },
      complements: { enabled: true, bid: 0.0 },
    },
    selectedKeywords: [],
    bidAdjustments: {
      homepage: 0,
      topOfSearch: 0,
      restOfSearch: 0,
      topOfBrowse: 0,
      restOfBrowse: 0,
      productPage: 0,
    },
  })

  const productsPerPage = 5
  const BASE_URL = process.env.REACT_APP_API_URL_FOR_IMAGE || ""

  useEffect(() => {
    const fetchProducts = async () => {
      const userId = localStorage.getItem("userId")
      try {
        setLoading(true)
        const result = await getAPI(`/api/get-productfor-campagine/${userId}`, {}, true, false)

        if (result && result.data && Array.isArray(result.data.data)) {
          setProducts(result.data.data)
          setAvailableProducts(result.data.data)
        } else {
          setProducts([])
          setAvailableProducts([])
        }
      } catch (error) {
        setProducts([])
        setAvailableProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleCampaignTypeSelect = (type) => {
    setSelectedCampaignType(type)
    setShowCampaignTypeSelection(false)
  }

  const handleBack = () => {
    setSelectedCampaignType(null)
    setShowCampaignTypeSelection(true)
  }

  const handleUpdateCampaignSettings = (settings) => {
    setCampaignData((prev) => ({ ...prev, ...settings }))
  }

  const handleUpdateSelectedProducts = (productIds) => {
    setCampaignData((prev) => ({ ...prev, selectedProductIds: productIds }))
  }

  const handleUpdateTargetingSettings = (targetingSettings) => {
    setCampaignData((prev) => ({ ...prev, ...targetingSettings }))
  }

  const handleUpdateBiddingStrategy = (strategy) => {
    setCampaignData((prev) => ({ ...prev, biddingStrategy: strategy }))
  }

  const handleUpdateBidAdjustments = (adjustments) => {
    setCampaignData((prev) => ({ ...prev, bidAdjustments: adjustments }))
  }

  useEffect(() => {
    if (!campaignFromState && campaignId) {
      fetch(`/api/campaign/${campaignId}`)
        .then(res => res.json())
        .then(data => setCampaignData(data))
        .catch(err => console.error("Error fetching campaign:", err));
    }
  }, [campaignId, campaignFromState]);

  const handleSave = async () => {
    if (!isBidAdjustmentValid) {
      toast.error("Bid adjustments must total exactly 100%.");
      return;
    }
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
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
        toast.success("Campaign saved successfully!");
        navigate("/artist/advertise")
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
        navigate("/artist/advertise")
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to save draft.";
      toast.error(errMsg);
    }
  };

  // console.log("Received campaign data:", campaignData);
  if(loading) return <AdvertiseSkeleton/>
  return (
    <div className="container-fluid">
      <div className="block-header">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h2>{selectedCampaignType === "profile" ? "Sponsored Profile" : "Products"}</h2>
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">
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
                initialCampaignName={campaignData.campaignName}
                initialStartDate={campaignData.startDate}
                initialEndDate={campaignData.endDate}
                initialHasEndDate={campaignData.hasEndDate}
                initialCountry={campaignData.country}
                initialDailyBudget={campaignData.dailyBudget}
                onUpdateCampaignSettings={handleUpdateCampaignSettings}
              />
               {selectedCampaignType === "product" && (
              <ProductSection
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
                loading={loading}
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
              />)}
              {showTargetingSection && (
                <TargetingSection
                  selectedProducts={selectedProducts}
                  targetingType={campaignData.targetingType}
                  automaticBidType={campaignData.automaticBidType}
                  defaultBid={campaignData.defaultBid}
                  targetingGroups={campaignData.targetingGroups}
                  selectedKeywords={campaignData.selectedKeywords}
                  onUpdateTargetingSettings={handleUpdateTargetingSettings}
                />
              )}
              {showCampaignBidding && (
                <CampaignBidding
                  initialBiddingStrategy={campaignData.biddingStrategy}
                  onUpdateBiddingStrategy={handleUpdateBiddingStrategy}
                />
              )}
              {showBidAdjustment && (
                <BidAdjustment
                  initialBidAdjustments={campaignData.bidAdjustments}
                  onUpdateBidAdjustments={handleUpdateBidAdjustments}
                  setIsBidAdjustmentValid={setIsBidAdjustmentValid}
                />
              )}

              {(showTargetingSection || showCampaignBidding || showBidAdjustment) && (
                <div className="card p-3 ">
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-secondary w-100 mr-2" onClick={handleSaveDraft} >
                      Save as Draft
                    </button>
                    <button className="btn btn-primary w-100" onClick={handleSave}>
                      Save Campaign
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


const AdvertiseSkeleton = () => {
  return (
    <div className="container-fluid animate-pulse p-4">
      
      {/* Header */}
      <div className="mb-6">
        <div className="h-7 w-60 bg-gray-300 rounded mb-3"></div>

        <div className="flex gap-2">
          <div className="h-4 w-5 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Campaign Type Selector Skeleton */}
      <div className="card p-4 mb-4 bg-white shadow rounded">
        <div className="h-5 w-40 bg-gray-300 rounded mb-4"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Campaign Settings Skeleton */}
      <div className="card p-4 mb-4 bg-white shadow rounded">
        <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Product Section Skeleton */}
      <div className="card p-4 mb-4 bg-white shadow rounded">
        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <div className="h-8 w-24 bg-gray-300 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Search + Sort */}
        <div className="flex justify-between mb-4">
          <div className="h-10 w-40 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>

        {/* Product List Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded">
              <div className="h-32 bg-gray-300 rounded mb-3"></div>
              <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 w-full bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-between mt-6">
          <div className="h-4 w-56 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-300 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 rounded"></div>
            <div className="h-8 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      {/* Targeting Skeleton */}
      <div className="card p-4 mb-4 bg-white shadow rounded">
        <div className="h-6 w-60 bg-gray-300 rounded mb-4"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>

        <div className="h-32 bg-gray-100 rounded mt-4"></div>
      </div>

      {/* Campaign Bidding Skeleton */}
      <div className="card p-4 mb-4 bg-white shadow rounded">
        <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Bid Adjustment Skeleton */}
      <div className="card p-4 mb-4 bg-white shadow rounded">
        <div className="h-6 w-52 bg-gray-300 rounded mb-4"></div>

        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 mb-3">
            <div className="h-10 w-full bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Save Buttons */}
      <div className="card p-4 bg-white shadow rounded">
        <div className="flex gap-4">
          <div className="h-10 w-full bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};
