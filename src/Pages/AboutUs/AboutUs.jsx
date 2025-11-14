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
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosConfig";

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
      toast.error("Failed to load SEO metadata");
    }
  };

  useEffect(() => {
    fetchSEOMetadata();
  }, []);

  return (
    <div className="font-[poppins]">
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

      <HeroImgAboutUs />
      <WhoWeAre />
      <WhatWeDo />
      <MissionVision />
      <OurValues />
      <DeliveryProcess />
      <MeetTeam />
      <Testimonials />
    </div>
  );
};

export default AboutUs;
