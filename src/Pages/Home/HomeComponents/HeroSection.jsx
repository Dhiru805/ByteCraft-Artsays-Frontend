import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp } from "lucide-react";
const heroStats = [
  "CurioCanvas design",
  "Arthive design",
  "ArtLoom design",
  "Artisphere design",
  "GalleryGenius design",
];

const treands = [
  "Fine Art Ceramics",
  "Sculpture",
  "Glass Art",
  "4+ More trends",
];
const Input = memo(() => {
  return (
    <div className="flex z-[100] flex-row justify-between w-[60%] bg-base px-2 py-1 h-[70px] rounded-xl">
      <input
        type="text"
        className="w-[90%] text-[20px] h-full border-3  bg-[#FFFFFF] text-orange-200 px-2 roumded-xl focus:outline-none outline-none"
        placeholder="Search here..."
      />
      <button className="bg-[#FB5934] p-[18px] rounded-[10px] flex items-center justify-center">
        <Search size={30} color="white" />
      </button>
    </div>
  );
});

const AnimatedText = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroStats.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  return (
    <AnimatePresence className="" mode="wait">
      <motion.h2
        key={heroStats[currentIndex]}
        initial={{ y: 80, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -90, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-[90px] z-[2] text-left will-change-transform font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent whitespace-nowrap overflow-visible w-fit"
      >
        {heroStats[currentIndex]}
      </motion.h2>
    </AnimatePresence>
  );
});

const HeroSection = () => {
  useEffect(()=>{
  console.log("hero render here ")
  },[])
  return (
    <div className="w-full min-h-[740px]  bg-gray-100 ">
      <div className="max-w-[1440px] w-full h-full  px-[80px] mx-auto   flex flex-row relative pb-8">
        <img
          src="/assets/home/mesh1.svg"
          alt=""
          className="absolute top-0 left-0 z-0 pointer-events-none"
        />
        <img
          src="/assets/home/mesh.svg"
          alt=""
          className="absolute top-0 right-0 z-0 pointer-events-none"
        />

        <div className="w-[70%]  ml-8 mt-8">
          <h2 className="text-black-900 text-[90px] font-bold ">
            Find yours
          </h2>
          <div className="min-h-[110px] z-[40]  h-auto w-full overflow-hidden  whitespace-nowrap  text-left flex items-center justify-start">
            <AnimatedText />
          </div>

          <p className=" w-[60%] text-[16px] text-wrap text-black-900 my-[40px]">
            A Marketplace for Unique Art & Artifacts, Connecting Artists with
            Collectors for Seamless Buying, Selling, and Showcasing.
          </p>
          <Input />

          <div className="w-[40%]  py-6">
            <div className="flex flex-row items-center gap-4  mb-6">
              <TrendingUp color="green" size={30} />
              <span className="text-[18px] font-semibold text-black-900">
                TREND NOW
              </span>
            </div>
            <div className="flex flex-row justify-between text-[#FB5934] font-semibold">
              {treands.map((trend) => {
                return (
                  <>
                    <button className="focus:outline-none border-none ">
                      {trend}
                    </button>
                  </>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-[50%] h-[740px] absolute right-0 top-0  ml-auto flex flex-row z-[1]  overflow-visible  ">
          <div className=" w-auto    h-full  mt-auto ">
            <div className="w-12 h-[40%] "></div>
            <img src="/assets/hero/th3.svg" className="z-0 mb-4" alt="hey" />
            <img src="/assets/hero/o2.svg" alt="" className="z-0 " />
          </div>
          <div className="mx-8 h-full my-auto  ">
            <div className="w-24 h-[40%] "></div>
            <img src="/assets/hero/tw1.svg" alt="" className="z-0 mt-auto" />
            <img src="/assets/hero/tw2.svg" alt="" className="z-0 my-6" />
            <img src="/assets/hero/tw3.svg" alt="" className="z-0" />
          </div>
          <div className=" h-full my-auto   ">
            <div className="w-24 h-[10%] "></div>
            <img src="/assets/hero/th1.svg" alt="" className="z-0 mt-auto " />
            <img src="/assets/hero/th2.svg" alt="" className="z-0 my-6" />
            <img src="/assets/hero/th3.svg" alt="" className="z-0" />
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default HeroSection;
