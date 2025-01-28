import React from "react";
import PartnerSection from "./Section/PartnerSection";
import Testimonial from "../../Component/Testinomial/Testimonial";
import FAQ from "../../Component/FAQ/FAQ";
import Counter from "../../Component/Counter/Counter";
import FeaturedProductSection from "./Section/FeaturedProductSection";
import ImgCollectionSlider from "./Section/ImgCollectionSlider";
import InvestmentSection from "./Section/InvestmentSection"
import BidingCarousal from "./Section/BidingCarousal"
import HowItWorks from "./Section/HowItWorks"
import MainSlider from "./Section/MainSlider"

const Home = () => {
  return (
    <div id="pageWrapper">
      <main>
        <MainSlider/>
        <FeaturedProductSection/>
        <HowItWorks/>
        <BidingCarousal/>
        <ImgCollectionSlider/>
        <PartnerSection />
        <Counter/>
        <InvestmentSection />
        <Testimonial/>
        <FAQ/>
    
      </main>
    </div>
  );
};

export default Home;
