import React, { useEffect, useState } from "react";
import HeroImgHowToResell from "./hero-img/hero-img";
import HowToResellContent from "./HowToResellContent/HowToResellContent";
import { Helmet } from "react-helmet-async";
import { ChevronRight } from "lucide-react";
import axiosInstance from "../../api/axiosConfig";
import SponsoredProducts from "../../Component/Common/SponsoredProducts";
import Testimonials from "../AboutUs/Testimonials/Testimonials";
import { getImageUrl } from "../../utils/getImageUrl";

const HowToResell = () => {
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaAuthor: "",
    metaImage: "",
  });

  const fetchSEOMetadata = async () => {
    try {
      const response = await axiosInstance.get("/api/how-to-resell/getSEO");
      const meta = response.data?.data || {};

      setSeoData({
        metaTitle: meta.metaTitle || "How to Resell - Artsays",
        metaDescription:
          meta.metaDescription ||
          "Learn how to resell art and digital works through Artsays’ simple guide.",
        metaKeywords:
          Array.isArray(meta.metaKeywords)
            ? meta.metaKeywords.join(", ")
            : meta.metaKeywords || "resell art, digital resale, art trading",
        metaAuthor: meta.metaAuthor || "Artsays",
        metaImage: meta.metaImage
          ? getImageUrl(meta.metaImage)
          : "/default-meta-image.jpg",
      });
    } catch (error) {
      console.error("Error fetching SEO metadata for HowToResell:", error);
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

        {/* Open Graph Tags */}
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
          {JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://artsays.in/" }, { "@type": "ListItem", "position": 2, "name": "How to Resell", "item": "https://artsays.in/how-to-resell" }] })}
        </script>
      </Helmet>

      <div className="w-full font-[poppins]">
        <nav aria-label="breadcrumb" className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center gap-2 text-sm text-gray-500 py-3">
          <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
          <ChevronRight size={14} />
          <span className="text-[#6F4D34] font-semibold" aria-current="page">How to Resell</span>
        </nav>
        <HeroImgHowToResell />
        <HowToResellContent />
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <Testimonials />
        </div>
        <div className="max-w-[1440px] mx-auto px-4 md:!px-0 py-8">
          <SponsoredProducts placement="otherPublicPages" title="Promoted Products" layout="row" />
        </div>
      </div>
    </>
  );
};

export default HowToResell;
