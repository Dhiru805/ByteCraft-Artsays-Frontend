import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "../Pages/Home/HomeComponents/NavBar";
import Footer from "../Pages/Home/HomeComponents/Footer";
import RecentlyViewedProducts from "../Component/Common/RecentlyViewedProducts";
import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import HeroSectionSkeleton from "../Component/Skeleton/HeroSectionSkeleton";
import BrowserCategorySkeleton from "../Component/Skeleton/BrowserCategorySkeleton";
import WhyFromSkeleton from "../Component/Skeleton/WhyFromSkeleton";
import BiddingArenaSkeleton from "../Component/Skeleton/BiddingArenaSkeleton";
import HowToBuySkeleton from "../Component/Skeleton/HowToBuySkeleton";
import DiscoverArtistSkeleton from "../Component/Skeleton/DiscoverArtistSkeleton";
import WhyArtsaysDiffSkeleton from "../Component/Skeleton/WhyArtsaysDiffSkeleton";
import HomeChallengesSkeleton from "../Component/Skeleton/HomeChallengesSkeleton";
import ArtlconSkeleton from "../Component/Skeleton/ArtIconSkeleton";
import HowToSellSkeleton from "../Component/Skeleton/HowToSellSkeleton";
import HeaderSkeleton from "../Component/Skeleton/Home/HeaderSkeleton";

const WebsiteLayout = () => {
  const [cssReady, setCssReady] = useState(false);
  const location = useLocation();

  // Track public page views for super-admin dashboard
  useEffect(() => {
    try {
      axiosInstance.post("/api/superadmin/pageview", { page: location.pathname }).catch(() => {});
    } catch (_) {}
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;
    import("../index.css").then(() => {
      if (mounted) setCssReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!cssReady) {
    if (location.pathname === "/") {
      return (
        <div>
          <HeaderSkeleton />
          <HeroSectionSkeleton />
          <BrowserCategorySkeleton />
          <WhyFromSkeleton />
          <BiddingArenaSkeleton />
          <HowToBuySkeleton />
          <DiscoverArtistSkeleton />
          <WhyArtsaysDiffSkeleton />
          <HomeChallengesSkeleton />
          <ArtlconSkeleton />
          <HowToSellSkeleton />
        </div>
      );
    }
    return (
      <div>
        <HeaderSkeleton />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <NavBar />
      <Outlet />
      <RecentlyViewedProducts />
      <Footer />
    </div>
  );
};

export default WebsiteLayout;
