import React from "react";
import NFTPage from "./sub/NFTPage";
import CommissionBanner from "./sub/CommissionBanner";
import ServiceFeatures from "./sub/ServiceFeature";
// import ServiceCard from "./sub/ServiceCard";
import ServiceList from "./sub/ServiceList";
import SupportPage from "./sub/SupportPage"
const ArtistSupport = () => {
    return (
      <>
        <div id="pageWrapper">
          <main>
            <NFTPage/>
            <CommissionBanner/>
            <ServiceFeatures/>
            <ServiceList/>
            <SupportPage/>
          </main>
        </div>
      </>
    );
  };

  export default ArtistSupport;