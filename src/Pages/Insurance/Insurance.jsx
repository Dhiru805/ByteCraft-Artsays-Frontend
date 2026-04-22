import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronRight } from "lucide-react";
// import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosConfig";
import SponsoredProducts from "../../Component/Common/SponsoredProducts";

import HeroImgInsurance from './hero-img/hero-img';
import InsuranceContent from './InsuranceContent';
import { getImageUrl } from "../../utils/getImageUrl";

const Insurance = () => {
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaAuthor: "",
    metaImage: "",
  });

  const fetchSEOMetadata = async () => {
    try {
      const response = await axiosInstance.get("/api/insurance/getSEO");
      const meta = response.data?.data || {};

      setSeoData({
        metaTitle: meta.metaTitle || "Insurance - Artsays",
        metaDescription:
          meta.metaDescription ||
          "Protect your valuable artworks with Artsays insurance. We offer comprehensive coverage for artists and collectors.",
        metaKeywords:
          Array.isArray(meta.metaKeywords)
            ? meta.metaKeywords.join(", ")
            : meta.metaKeywords ||
              "art insurance, protect artwork, artsays insurance, artwork coverage",
        metaAuthor: meta.metaAuthor || "Artsays",
        metaImage: meta.metaImage
          ? getImageUrl(meta.metaImage)
          : "/default-meta-image.jpg",
      });
    } catch (error) {
      console.error("Error fetching Insurance SEO metadata:", error);
      // toast.error("Failed to load SEO metadata");
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
        <script type="application/ld+json">
          {JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://artsays.in/" }, { "@type": "ListItem", "position": 2, "name": "Insurance", "item": "https://artsays.in/insurance" }] })}
        </script>
      </Helmet>
      <nav aria-label="breadcrumb" className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center gap-2 text-sm text-gray-500 py-3">
        <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
        <ChevronRight size={14} />
        <span className="text-[#6F4D34] font-semibold" aria-current="page">Insurance</span>
      </nav>
           <HeroImgInsurance />
           <InsuranceContent />
      <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
        <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
      </div>
    </div>
  );
};

export default Insurance;
