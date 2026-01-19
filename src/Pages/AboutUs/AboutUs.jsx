// import HeroImgAboutUs from './hero-img/hero-img';
// import WhoWeAre from './WhoWeAre/WhoWeAre'
// import WhatWeDo from './WhatWeDo/WhatWeDo'
// import MissionVision from './MissionVision/MissionVision'
// import OurValues from './OurValues/OurValues'
// import DeliveryProcess from './DeliveryProcess/DeliveryProcess'
// import MeetTeam from './MeetTeam/MeetTeam'
// import Testimonials from './Testimonials/Testimonials'

// const AboutUs = () => {
//   return (
//     <div className="font-[poppins]">
//         <HeroImgAboutUs/>
//         <WhoWeAre/>
//         <WhatWeDo/>
//         <MissionVision/>
//         <OurValues/>
//         <DeliveryProcess/>
//         <MeetTeam/>
//         <Testimonials/>
//     </div>
//   );
// };

// export default AboutUs;


import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronRight } from "lucide-react";
import axiosInstance from "../../api/axiosConfig";
import getAPI from "../../api/getAPI";

import HeroImgAboutUs from "./hero-img/hero-img";
import WhoWeAre from "./WhoWeAre/WhoWeAre";
import WhatWeDo from "./WhatWeDo/WhatWeDo";
import MissionVision from "./MissionVision/MissionVision";
import OurValues from "./OurValues/OurValues";
import DeliveryProcess from "./DeliveryProcess/DeliveryProcess";
import MeetTeam from "./MeetTeam/MeetTeam";
import Testimonials from "./Testimonials/Testimonials";

const AboutUs = () => {
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaAuthor: "",
    metaImage: "",
  });

  const [pageData, setPageData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSEOMetadata = async () => {
    try {
      const response = await axiosInstance.get("/api/about-us/getSEO");
      const meta = response.data?.data || {};

      setSeoData({
        metaTitle: meta.metaTitle || "About Us - Artsays",
        metaDescription:
          meta.metaDescription ||
          "Learn about Artsays – who we are, what we do, our mission and vision, and the creative minds driving our art marketplace forward.",
        metaKeywords:
          Array.isArray(meta.metaKeywords)
            ? meta.metaKeywords.join(", ")
            : meta.metaKeywords ||
            "about artsays, who we are, our mission, art marketplace team, art vision",
        metaAuthor: meta.metaAuthor || "Artsays",
        metaImage: meta.metaImage
          ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${meta.metaImage}`
          : "/default-meta-image.jpg",
      });
    } catch (error) {
      console.error("Error fetching About Us SEO metadata:", error);
    }
  };

  const fetchPageData = async () => {
    try {
      const res = await getAPI("/api/about-us/published");
      if (res.data.success && res.data.data) {
        setPageData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching About Us page data:", error);
    }
  };

  useEffect(() => {
    fetchSEOMetadata();
    fetchPageData();
  }, []);

  return (
    <div className="w-full font-[poppins] bg-gray-50 min-h-screen">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="title" content={seoData.metaTitle} />
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <meta name="keywords" content={seoData.metaKeywords} />
        <meta name="author" content={seoData.metaAuthor} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoData.metaTitle} />
        <meta property="og:description" content={seoData.metaDescription} />
        <meta property="og:image" content={seoData.metaImage} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.metaTitle} />
        <meta name="twitter:description" content={seoData.metaDescription} />
        <meta name="twitter:image" content={seoData.metaImage} />
      </Helmet>

      <HeroImgAboutUs />

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section matching Commission style */}
          <div className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search about us topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4D34]/10 focus:border-[#6F4D34] transition-all text-lg placeholder:text-gray-400"
              />
            </div>

            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <nav className="flex items-center text-sm text-gray-500 mb-4">
                  <a href="/" className="hover:text-[#6F4D34] transition-colors">Home</a>
                  <ChevronRight size={14} className="mx-2" />
                  <span className="text-[#6F4D34] font-medium">About Us</span>
                </nav>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  {pageData?.webpageHeading || "About Artsays"}
                </h1>
                <div className="w-24 h-1.5 bg-[#6F4D34] rounded-full mb-6" />
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl">
                  {pageData?.webpageDescription || "Empowering creators and connecting art lovers across the globe through a revolutionary marketplace."}
                </p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#6F4D34]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            <WhoWeAre />
            <WhatWeDo />
            <MissionVision />
            <OurValues />
            <DeliveryProcess />
            <MeetTeam />
            <Testimonials />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
