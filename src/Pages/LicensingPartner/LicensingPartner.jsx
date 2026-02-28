// import React from 'react';
// import HeroImgLicensingPartner from './hero-img/hero-img';
// import LicensingPartnerContent from "./LicensingPartnerContent/LicensingPartnerContent"

// const LicensingPartner = () => {
//   return (
//     <div className="max-w-[1440px] mx-auto font-[poppins]">
//         <HeroImgLicensingPartner/>
//         <LicensingPartnerContent/>
//     </div>
//   );
// };

// export default LicensingPartner;



import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../api/axiosConfig";
import SponsoredProducts from "../../Component/Common/SponsoredProducts";

import HeroImgLicensingPartner from "./hero-img/hero-img";
import LicensingPartnerContent from "./LicensingPartnerContent/LicensingPartnerContent";

const LicensingPartner = () => {
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaAuthor: "",
    metaImage: "",
  });

  const fetchSEOMetadata = async () => {
    try {
      const response = await axiosInstance.get("/api/licensing/getSEO");
      const meta = response.data?.data;

      if (meta) {
        setSeoData({
          metaTitle: meta.metaTitle || "Licensing Partner - ArtSays",
          metaDescription: meta.metaDescription || "",
          metaKeywords: Array.isArray(meta.metaKeywords)
            ? meta.metaKeywords.join(", ")
            : meta.metaKeywords || "",
          metaAuthor: meta.metaAuthor || "ArtSays",
          metaImage: meta.metaImage
            ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${meta.metaImage}`
            : "",
        });
      }
    } catch (error) {
      console.error("Error fetching SEO metadata:", error);
    }
  };

  useEffect(() => {
    fetchSEOMetadata();
  }, []);

  return (
    <div className="w-full font-[poppins]">

      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="title" content={seoData.metaTitle} />
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <meta name="author" content={seoData.metaAuthor} />
        <meta property="og:description" content={seoData.metaDescription} />
        {seoData.metaImage && <meta property="og:image" content={seoData.metaImage} />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter */}
        <meta name="twitter:title" content={seoData.metaTitle} />
        <meta name="twitter:description" content={seoData.metaDescription} />
        {seoData.metaImage && <meta name="twitter:image" content={seoData.metaImage} />}
      </Helmet>

      <HeroImgLicensingPartner />
      <LicensingPartnerContent />
      <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
        <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
      </div>
    </div>
  );
};

export default LicensingPartner;
