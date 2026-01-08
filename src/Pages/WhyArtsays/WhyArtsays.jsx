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
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../api/axiosConfig";
import { toast } from "react-toastify";
import Testimonials from "../AboutUs/Testimonials/Testimonials";
import WhyArtsaysPageSkeleton from "../../Component/Skeleton/WhyArtsaysPageSkeleton";

const WhyArtsays = () => {
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [seoData, setSeoData] = useState({
    metaTitle: "Why ArtSays",
    metaDescription: "",
    metaKeywords: "",
    metaAuthor: "",
    metaImage: null,
  });

    const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch SEO and Page data in parallel
      const [seoRes, pageRes] = await Promise.allSettled([
        axiosInstance.get("/api/whyartsays/getSEO"),
        axiosInstance.get("/api/whyartsays/published")
      ]);

      // Handle SEO Data
      if (seoRes.status === "fulfilled" && seoRes.value.data?.success) {
        const meta = seoRes.value.data.data || {};
        setSeoData({
          metaTitle: meta.metaTitle || "Why ArtSays",
          metaDescription: meta.metaDescription || "",
          metaKeywords: Array.isArray(meta.metaKeywords) ? meta.metaKeywords.join(", ") : (meta.metaKeywords || ""),
          metaAuthor: meta.metaAuthor || "",
          metaImage: meta.metaImage || null,
        });
      } else {
        console.warn("SEO data fetch failed or returned no data:", seoRes.reason || "No data");
      }

      // Handle Page Content
      if (pageRes.status === "fulfilled" && pageRes.value.data.success && pageRes.value.data.data) {
        setPageData(pageRes.value.data.data);
      } else {
        // If the main content fails, we should throw to the catch block
        throw new Error("Main content fetch failed");
      }
    } catch (error) {
      console.error("Error fetching WhyArtsays data:", error);
      toast.error("Failed to load page content");
    } finally {
      // Adding a small delay for smoother transition
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <WhyArtsaysPageSkeleton />;
  }

  return (
    <div className="w-full font-[poppins]">
     
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
      <WhyArtsaysContent initialData={pageData} />
      <Testimonials />
    </div>
  );
};

export default WhyArtsays;
