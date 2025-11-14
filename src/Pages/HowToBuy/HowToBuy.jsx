// import React from 'react';
// import HeroImgHowToBuy from './hero-img/hero-img';
// import HowToBuyContent from './HowToBuyContent/HowToBuyContent'

// const HowToBuy = () => {
//   return (
//     <div className="max-w-[1440px] mx-auto font-[poppins]">
//         <HeroImgHowToBuy/>
//         <HowToBuyContent/>
//     </div>
//   );
// };

// export default HowToBuy;


import React, { useEffect, useState } from "react";
import HeroImgHowToBuy from "./hero-img/hero-img";
import HowToBuyContent from "./HowToBuyContent/HowToBuyContent";
import { Helmet } from "react-helmet";
import axiosInstance from "../../api/axiosConfig";

const HowToBuy = () => {
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaAuthor: "",
    metaImage: "",
  });

  const fetchSEOMetadata = async () => {
    try {
      const response = await axiosInstance.get("/api/howtobuy/getSEO");
      const meta = response.data?.data || {};

      setSeoData({
        metaTitle: meta.metaTitle || "How to Buy - Artsays",
        metaDescription:
          meta.metaDescription ||
          "Learn how to buy art and digital works easily through Artsays’ step-by-step guide.",
        metaKeywords:
          Array.isArray(meta.metaKeywords)
            ? meta.metaKeywords.join(", ")
            : meta.metaKeywords || "buy art, digital purchase, art buying guide",
        metaAuthor: meta.metaAuthor || "Artsays",
        metaImage: meta.metaImage
          ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${meta.metaImage}`
          : "/default-meta-image.jpg",
      });
    } catch (error) {
      console.error("Error fetching SEO metadata for HowToBuy:", error);
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

      <HeroImgHowToBuy />
      <HowToBuyContent />
    </div>
  );
};

export default HowToBuy;
