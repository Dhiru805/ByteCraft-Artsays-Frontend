import React, { useState } from "react";
import NavBar from "./HomeComponents/NavBar";
import Footer from "./HomeComponents/Footer";
import MegaMenu from "./HomeComponents/MegaMenu";
import FeaturedProducts from "./HomeComponents/FeaturedProducts";
import HowItWorks from "./HomeComponents/HowItWorks";
import Deals from "./HomeComponents/Deals";
import Traction from "./HomeComponents/Traction";
import LeaderBar from "./HomeComponents/LeaderBar";
import FAQS from "./HomeComponents/FAQS";
import { AnimatePresence, motion } from "framer-motion";
import HeroSection from "./HomeComponents/HeroSection";

const deals = [
  {
    title: "Bidding Deals",
    description:
      "Explore our most sought-after artworks and exclusive artifacts.",
  },
  {
    title: "Daily Deals",
    description:
      "Explore our most sought-after artworks and exclusive artifacts.",
  },
];
const Home = () => {
  const [showMegamenu, setShowMegamenu] = useState(false);
  return (
    <div className="w-full     mx-auto h-screen  bg-base ">
      <div className="  border-b-[0.6px] border-orange-200">
        <NavBar setShowMegamenu={setShowMegamenu} />
      </div>
     
        {showMegamenu && (
           <AnimatePresence>
          <motion.div
            className={"relative mx-auto"}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className=" w-[95%] absolute top-0 left-0  z-[9999] ">
              <MegaMenu />
            </div>
          </motion.div>
               </AnimatePresence>
        )}
 

      <HeroSection />
      
      <div className="w-full bg-base">
        <FeaturedProducts />
      </div>

      <div className="w-full bg-base">
        <HowItWorks />
      </div>
      <div className="w-full bg-base flex flex-col gap-8 ">
        {deals.map((deal) => {
          return <Deals deal={deal} key={deal.title} />;
        })}
      </div>

      <Traction />
      <LeaderBar />
      <FAQS />
      <Footer />
    </div>
  );
};

export default Home;
