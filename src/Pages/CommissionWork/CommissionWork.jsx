// import React from 'react';
// import HeroImgCommission from './hero-img/hero-img';
// import CommissionContent from './commissionContent/commissionContent'

// const Commission = () => {
//   return (
//     <div className="max-w-[1440px] mx-auto font-[poppins]">
//         <HeroImgCommission/>
//         <CommissionContent/>
//     </div>
//   );
// };

// export default Commission;


import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosConfig";

import HeroImgCommission from "./hero-img/hero-img";
import CommissionContent from "./commissionContent/commissionContent";

const Commission = () => {
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaAuthor: "",
    metaImage: "",
  });

  const fetchSEOMetadata = async () => {
    try {
      const response = await axiosInstance.get("/api/commission/getSEO");
      const meta = response.data?.data || {};

      setSeoData({
        metaTitle: meta.metaTitle || "Commission Art - Artsays",
        metaDescription:
          meta.metaDescription ||
          "Commission unique, custom artworks directly from talented artists on Artsays. Turn your creative vision into reality.",
        metaKeywords:
          Array.isArray(meta.metaKeywords)
            ? meta.metaKeywords.join(", ")
            : meta.metaKeywords ||
              "commission art, custom artwork, hire artist, artsays commission",
        metaAuthor: meta.metaAuthor || "Artsays",
        metaImage: meta.metaImage
          ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${meta.metaImage}`
          : "/default-meta-image.jpg",
      });
    } catch (error) {
      console.error("Error fetching Commission SEO metadata:", error);
      toast.error("Failed to load SEO metadata");
    }
  };

  useEffect(() => {
    fetchSEOMetadata();
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto font-[poppins]">

      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="title" content={seoData.metaTitle} />
        
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <meta name="keywords" content={seoData.metaKeywords} />
        <meta name="author" content={seoData.metaAuthor} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.metaTitle} />
        <meta property="og:description" content={seoData.metaDescription} />
        <meta property="og:image" content={seoData.metaImage} />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.metaTitle} />
        <meta name="twitter:description" content={seoData.metaDescription} />
        <meta name="twitter:image" content={seoData.metaImage} />
      </Helmet>

      <HeroImgCommission />
      <CommissionContent />
    </div>
  );
};

export default Commission;
