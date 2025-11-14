// import React from 'react';
// import HeroImgWhyArtsays from './hero-img/hero-img';
// import WhyArtsaysContent from './WhyArtsaysContent/WhyArtsaysContent'

// const WhyArtsays = () => {
//   return (
//     <div className="max-w-[1440px] mx-auto font-[poppins]">
//         <HeroImgWhyArtsays/>
//         <WhyArtsaysContent/>
//     </div>
//   );
// };

// export default WhyArtsays;


import React, { useEffect, useState } from "react";
import HeroImgWhyArtsays from "./hero-img/hero-img";
import WhyArtsaysContent from "./WhyArtsaysContent/WhyArtsaysContent";
import { Helmet } from "react-helmet";
import axiosInstance from "../../api/axiosConfig";
import { toast } from "react-toastify";

const WhyArtsays = () => {
  const [seoData, setSeoData] = useState({
    metaTitle: "Why ArtSays",
    metaDescription: "",
    metaKeywords: "",
    metaAuthor: "",
    metaImage: null,
  });

  const fetchSEOMetadata = async () => {
    try {
      const response = await axiosInstance.get("/api/whyartsays/getSEO");
      const meta = response.data?.data || {};
      setSeoData({
        metaTitle: meta.metaTitle || "Why ArtSays",
        metaDescription: meta.metaDescription || "",
        metaKeywords: (meta.metaKeywords || []).join(", "),
        metaAuthor: meta.metaAuthor || "",
        metaImage: meta.metaImage || null,
      });
    } catch (error) {
      console.error("Error fetching SEO metadata:", error);
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
        {seoData.metaImage && <meta property="og:image" content={seoData.metaImage} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.metaTitle} />
        <meta name="twitter:description" content={seoData.metaDescription} />
        {seoData.metaImage && <meta name="twitter:image" content={seoData.metaImage} />}
      </Helmet>

      <HeroImgWhyArtsays />
      <WhyArtsaysContent />
    </div>
  );
};

export default WhyArtsays;
