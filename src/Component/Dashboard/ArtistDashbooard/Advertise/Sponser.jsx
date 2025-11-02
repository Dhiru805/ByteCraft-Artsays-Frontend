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
          console.log("Fetched products:", result.data.data)
          setProducts(result.data.data)
          setAvailableProducts(result.data.data)
          console.log("Initial products set:", result.data.data.length, "products")
        } else {
          setProducts([])
          setAvailableProducts([])
          console.log("No products found or invalid data format.")
        }
      } catch (error) {
        console.error("Error fetching products:", error)
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

  const handleSave = async () => {
    try {
      console.log("Attempting to save campaign with data:", campaignData)
      const response = await postAPI("/api/create-campaign", campaignData)
      console.log("Save Response:", response)

      if (response.hasError) {
        toast.error(response.message)
      } else {
        toast.success("Campaign saved successfully!")
      }
    } catch (error) {
      console.error("Error saving campaign:", error)
      const errMsg = error.response?.data?.message || "Failed to save campaign."
      toast.error(errMsg)
    }
  }

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
          {showCampaignTypeSelection && <CampaignTypeSelection onSelectCampaignType={handleCampaignTypeSelect} />}
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
                onUpdateSelectedProducts={handleUpdateSelectedProducts}
              />
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
                />
              )}

              {(showTargetingSection || showCampaignBidding || showBidAdjustment) && (
                <div className="card p-3 mt-4">
                  <button className="btn btn-primary btn-block" onClick={handleSave}>
                    Save Campaign
                  </button>
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
