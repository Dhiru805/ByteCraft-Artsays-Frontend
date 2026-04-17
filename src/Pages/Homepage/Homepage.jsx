

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../api/axiosConfig";
import getAPI from "../../api/getAPI";

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
import SponsoredProducts from "../../Component/Common/SponsoredProducts";
import { getImageUrl } from "../../utils/getImageUrl";

const Homepage = () => {
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    metaAuthor: "",
    metaImage: "",
  });
  const [homepageId, setHomepageId] = useState(null);
  const [heroReady, setHeroReady] = useState(false);
  const handleHeroReady = () => {
    // Defer by two frames so browser paints Hero content before BrowseCategories mounts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setHeroReady(true);
      });
    });
  };

  // Fallback: if Hero never calls onReady (e.g. network error), unblock BrowseCategories after 8s
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Fetch the published homepage ID once and share it with child sections
    getAPI("/api/homepage/published")
      .then((res) => {
        const id = res?.data?.data?._id;
        // If id found, pass it down. If not, set to undefined so children
        // know the fetch is done and stop waiting (null = still loading).
        setHomepageId(id || undefined);
      })
      .catch(() => {
        // Fetch failed — signal children to stop waiting
        setHomepageId(undefined);
      });
  }, []);

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
          ? getImageUrl(meta.metaImage)
          : "/default-meta-image.jpg",
      });
    } catch (error) {
      console.error("Error fetching Homepage SEO metadata:", error);
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

      <Hero homepageId={homepageId} onReady={handleHeroReady} />
      {heroReady && <BrowseCategories homepageId={homepageId} />}
      <SponsoredProducts placement="homepage" title="Promoted Products" layout="row" />
      <WhyFromArtsays />
      <BiddingArena />
      <SponsoredProducts placement="homepage" title="Promoted Products" layout="row" />
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
