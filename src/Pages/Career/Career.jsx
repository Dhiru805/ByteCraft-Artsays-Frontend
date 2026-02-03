import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronRight } from "lucide-react";
import axiosInstance from "../../api/axiosConfig";

import HeroImgCareer from "./hero-img/hero-img";
import JoinArtsays from "./JoinArtsays/JoinArtsays";
import OpenRoles from "./OpenRoles/OpenRoles";
import LifeAtArtsays from "./LifeAtArtsays/LifeAtArtsays";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Career = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [seoData, setSeoData] = useState({
    metaTitle: "Careers at Artsays",
    metaDescription: "Join the Artsays team and help shape the future of art and technology.",
    metaKeywords: "careers, jobs, artsays, hiring, art technology",
    metaAuthor: "Artsays",
    metaImage: "/default-meta-image.jpg",
  });

  const fetchSEOMetadata = async () => {
    try {
      const response = await axiosInstance.get("/api/career-CMS/getSEO");
      if (response.data?.success && response.data?.data) {
        const meta = response.data.data;
        setSeoData({
          metaTitle: meta.metaTitle || "Careers at Artsays",
          metaDescription: meta.metaDescription || "Join the Artsays team.",
          metaKeywords: Array.isArray(meta.metaKeywords) ? meta.metaKeywords.join(", ") : meta.metaKeywords || "careers, jobs",
          metaAuthor: meta.metaAuthor || "Artsays",
          metaImage: meta.metaImage ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${meta.metaImage}` : "/default-meta-image.jpg",
        });
      }
    } catch (error) {
      console.error("Error fetching Career SEO metadata:", error);
    }
  };

  useEffect(() => {
    fetchSEOMetadata();
  }, []);

  return (
    <div className="w-full bg-gray-50 min-h-screen font-[poppins] pb-12">
      <Helmet>
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <meta name="keywords" content={seoData.metaKeywords} />
        <meta name="author" content={seoData.metaAuthor} />
        <meta property="og:title" content={seoData.metaTitle} />
        <meta property="og:description" content={seoData.metaDescription} />
        <meta property="og:image" content={seoData.metaImage} />
        <meta name="twitter:title" content={seoData.metaTitle} />
        <meta name="twitter:description" content={seoData.metaDescription} />
        <meta name="twitter:image" content={seoData.metaImage} />
      </Helmet>

      <HeroImgCareer />

        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8 space-y-12">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-auto">
              <nav className="flex items-center text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm w-fit">
                <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
                <ChevronRight size={14} className="mx-2" />
                <span className="text-[#6F4D34] font-semibold">Careers</span>
              </nav>
            </div>
            
            <div className="relative group w-full md:w-1/2 lg:w-1/3">
              <input
                type="text"
                placeholder="Search for roles, categories, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-4 focus:ring-[#6F4D34]/5 focus:border-[#6F4D34] transition-all text-base placeholder:text-gray-400"
              />
            </div>
          </div>


        <JoinArtsays />
        <OpenRoles searchTerm={debouncedSearchTerm} />
        <LifeAtArtsays />
      </div>
    </div>
  );
};

export default Career;
