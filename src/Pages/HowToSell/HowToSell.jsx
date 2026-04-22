
import React, { useEffect, useState } from "react";
import HeroImgHowToSell from "./hero-img/hero-img";
import HowToSellContent from "./HowToSellContent/HowToSellContent";
import { Helmet } from "react-helmet-async";
import { ChevronRight } from "lucide-react";
import axiosInstance from "../../api/axiosConfig";
import SponsoredProducts from "../../Component/Common/SponsoredProducts";
import Testimonials from "../AboutUs/Testimonials/Testimonials";
import { getImageUrl } from "../../utils/getImageUrl";

const HowToSell = () => {
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaAuthor: "",
    metaImage: "",
  });

  const fetchSEOMetadata = async () => {
    try {
      const response = await axiosInstance.get("/api/howtosell/getSEO");
      const meta = response.data?.data || {};
      setSeoData({
        metaTitle: meta.metaTitle || "How To Sell - Artsays",
        metaDescription:
          meta.metaDescription ||
          "Learn how to sell your art with Artsays' easy-to-follow process.",
        metaKeywords:
          Array.isArray(meta.metaKeywords)
            ? meta.metaKeywords.join(", ")
            : meta.metaKeywords || "sell art, art guide, how to sell",
        metaAuthor: meta.metaAuthor || "Artsays",
        metaImage: meta.metaImage
          ? getImageUrl(meta.metaImage)
          : "/default-meta-image.jpg",
      });
    } catch (error) {
      console.error("Error fetching SEO metadata for HowToSell:", error);
    }
  };

  useEffect(() => {
    fetchSEOMetadata();
  }, []);

  return (
    <>
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
        <meta property="og:title" content={seoData.metaTitle} />
        <meta property="og:description" content={seoData.metaDescription} />
        <meta property="og:image" content={seoData.metaImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.metaTitle} />
        <meta name="twitter:description" content={seoData.metaDescription} />
        <meta name="twitter:image" content={seoData.metaImage} />
        <script type="application/ld+json">
          {JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://artsays.in/" }, { "@type": "ListItem", "position": 2, "name": "How to Sell", "item": "https://artsays.in/how-to-sell" }] })}
        </script>
      </Helmet>

      <div className="w-full font-[poppins]">
        <nav aria-label="breadcrumb" className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center gap-2 text-sm text-gray-500 py-3">
          <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
          <ChevronRight size={14} />
          <span className="text-[#6F4D34] font-semibold" aria-current="page">How to Sell</span>
        </nav>
        <HeroImgHowToSell />
        <HowToSellContent />
        <Testimonials />
        <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
          <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
        </div>
      </div>
    </>
  );
};

export default HowToSell;
