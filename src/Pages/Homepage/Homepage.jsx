// import Hero from './Hero/Hero'
// import BrowseCategories from './BrowseCategories/BrowseCategories'
// import WhyFromArtsays from './WhyFromArtsays/WhyFromArtsays'
// import BiddingArena from './BiddingArena/BiddingArena'
// import HowToBuy from './HowToBuy/HowToBuy'
// import DiscoverArtist from './DiscoverArtist/DiscoverArtist'
// import WhyArtsaysDifferent from './WhyArtsaysDifferent/WhyArtsaysDifferent.jsx'
// import HomeChallenges from './HomeChallenges/HomeChallenges'
// import ArtIcon from './ArtIcon/ArtIcon'
// import HowToSell from './HowToSell/HowToSell'

// const Homepage = () => {
//   return (
//     <div className="font-[poppins] !bg-[#ffffff]">
//         <Hero/>
//         <BrowseCategories/>
//         <WhyFromArtsays/>
//         <BiddingArena/>
//         <HowToBuy/>
//         <DiscoverArtist/>
//         <WhyArtsaysDifferent/>
//         <HomeChallenges/>
//         <ArtIcon/>
//         <HowToSell/>
//     </div>
//   );
// };

// export default Homepage;



import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosConfig";
import NavBar from "../Home/HomeComponents/NavBar";

import Hero from "./Hero/Hero";
import BrowseCategories from "./BrowseCategories/BrowseCategories";
import WhyFromArtsays from "./WhyFromArtsays/WhyFromArtsays";
import BiddingArena from "./BiddingArena/BiddingArena";
import HowToBuy from "./HowToBuy/HowToBuy";
import DiscoverArtist from "./DiscoverArtist/DiscoverArtist";
import WhyArtsaysDifferent from "./WhyArtsaysDifferent/WhyArtsaysDifferent.jsx";
import HomeChallenges from "./HomeChallenges/HomeChallenges";
import ArtIcon from "./ArtIcon/ArtIcon";
import HowToSell from "./HowToSell/HowToSell";

const Homepage = () => {
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaAuthor: "",
    metaImage: "",
  });

  const fetchSEOMetadata = async () => {
    try {
      const response = await axiosInstance.get("/api/homepage/getSEO");
      const meta = response.data?.data || {};

      setSeoData({
        metaTitle: meta.metaTitle || "Artsays - Buy, Sell, and Discover Art",
        metaDescription:
          meta.metaDescription ||
          "Explore Artsays, the ultimate art marketplace where you can buy, sell, and bid on unique art pieces from talented artists worldwide.",
        metaKeywords:
          Array.isArray(meta.metaKeywords)
            ? meta.metaKeywords.join(", ")
            : meta.metaKeywords ||
              "art marketplace, buy art, sell art, online art auctions, discover artists",
        metaAuthor: meta.metaAuthor || "Artsays",
        metaImage: meta.metaImage
          ? `${process.env.REACT_APP_API_URL_FOR_IMAGE}${meta.metaImage}`
          : "/default-meta-image.jpg",
      });
    } catch (error) {
      console.error("Error fetching Homepage SEO metadata:", error);
      toast.error("Failed to load SEO metadata");
    }
  };

  useEffect(() => {
    fetchSEOMetadata();
  }, []);

  return (
    <div className="font-[poppins] !bg-[#ffffff]">
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
        {/* <NavBar /> */}

      <Hero />
      <BrowseCategories />
      <WhyFromArtsays />
      <BiddingArena />
      <HowToBuy />
      <DiscoverArtist />
      <WhyArtsaysDifferent />
      <HomeChallenges />
      <ArtIcon />
      <HowToSell />
    </div>
  );
};

export default Homepage;
