// ;

// import { useState } from "react";

// const CampaignTypeSelection = ({ onSelectCampaignType }) => {
//   const [selectedType, setSelectedType] = useState(null);

//   const handleContinue = () => {
//     if (selectedType) {
//       onSelectCampaignType(selectedType);
//     }
//   };

//   const campaignTypes = [
//     {
//       id: "sponsored-products",
//       title: "Sponsored Products",
//       image: "/placeholder.svg?height=150&width=250",
//       description:
//         "Sponsored Products can help promote products to shoppers actively searching with related keywords or viewing similar products on Artsyas.",
//       exploreLink: "#",
//       type: "product",
//     },
//     {
//       id: "sponsored-profile",
//       title: "Sponsored Profile",
//       image: "/placeholder.svg?height=150&width=250",
//       description:
//         "Sponsored Profile can help customers discover your brand and products with creative ads that appear in relevant Artsyas shopping results.",
//       exploreLink: "#",
//       type: "profile",
//     },
//   ];

//   return (
//     <div className="card p-3 mb-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h2 className="mb-0">Choose your campaign type</h2>
//         <button className="btn btn-outline-secondary btn-sm">View drafts</button>
//       </div>
//       <hr />

//       <div className="row">
//         {campaignTypes.map((campaign) => (
//           <div key={campaign.id} className="col-md-6 mb-4">
//             <div
//               className={`card h-100 ${selectedType === campaign.type ? "border-primary shadow-sm" : ""}`}
//               style={{ cursor: "pointer" }}
//               onClick={() => setSelectedType(campaign.type)}
//             >
//               <div className="card-body d-flex flex-column">
//                 <h5 className="card-title mb-3">{campaign.title}</h5>
//                 <div className="text-center mb-3">
//                   <img src={campaign.image || "/placeholder.svg"} alt={campaign.title} className="img-fluid" />
//                 </div>
//                 <p className="card-text" style={{ fontSize: "14px" }}>
//                   {campaign.description}
//                 </p>
//                 <div className="mt-auto">
//                   <a href={campaign.exploreLink} className="btn btn-link p-0 mb-2" style={{ fontSize: "14px" }}>
//                     <i className="fa fa-info-circle me-1"></i>
//                     Explore {campaign.title}
//                   </a>
//                   <button
//                     onClick={handleContinue}
//                     className="btn btn-primary w-100"
//                     // disabled={selectedType !== campaign.type}
//                   >
//                     Continue
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CampaignTypeSelection;



import { useState } from "react"

const CampaignTypeSelection = ({ onSelectCampaignType }) => {
  const [selectedType, setSelectedType] = useState(null)

  const handleContinue = () => {
    if (selectedType) {
      onSelectCampaignType(selectedType)
    }
  }

  const campaignTypes = [
    {
      id: "sponsored-products",
      title: "Sponsored Products",
      image: "/placeholder.svg?height=150&width=250",
      description:
        "Sponsored Products can help promote products to shoppers actively searching with related keywords or viewing similar products on Artsyas.",
      exploreLink: "#",
      type: "product",
    },
    {
      id: "sponsored-profile",
      title: "Sponsored Profile",
      image: "/placeholder.svg?height=150&width=250",
      description:
        "Sponsored Profile can help customers discover your brand and products with creative ads that appear in relevant Artsyas shopping results.",
      exploreLink: "#",
      type: "profile",
    },
  ]

  return (
    <div className="card p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Choose your campaign type</h2>
        <button className="btn btn-outline-secondary btn-sm">View drafts</button>
      </div>
      <hr />

      <div className="row">
        {campaignTypes.map((campaign) => (
          <div key={campaign.id} className="col-md-6 mb-4">
            <div
              className={`card h-100 ${selectedType === campaign.type ? "border-primary shadow-sm" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedType(campaign.type)}
            >
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-3">{campaign.title}</h5>
                <div className="text-center mb-3">
                  <img src={campaign.image || "/placeholder.svg"} alt={campaign.title} className="img-fluid" />
                </div>
                <p className="card-text" style={{ fontSize: "14px" }}>
                  {campaign.description}
                </p>
                <div className="mt-auto">
                  <a href={campaign.exploreLink} className="btn btn-link p-0 mb-2" style={{ fontSize: "14px" }}>
                    <i className="fa fa-info-circle me-1"></i>
                    Explore {campaign.title}
                  </a>
                  <button
                    onClick={handleContinue}
                    className="btn btn-primary w-100"
                    // disabled={selectedType !== campaign.type}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CampaignTypeSelection
