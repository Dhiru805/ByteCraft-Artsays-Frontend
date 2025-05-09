import React from "react";

const HowItWorks = () => {
  return (
    <div className="p-[80px] max-w-[1440px] mx-auto  bg-white ">
      <div className="flex flex-col gap-[24px] text-center  ">
        <h3 className="text-center text-[40px]  font-bold text-orange-200 ">
          HOW IT WORKS
        </h3>
        <h4 className="text-[24px] font-normal text-black-900 ">
        
          Buy, Sell, or Bid on Verified Art with Ease
        </h4>
      </div>

      <div className="flex flex-row justify-between mt-[24px]">
        <div className="flex flex-col w-[276px] gap-[30px] items-center">
            <img className="w-[70px] h-[70px]" src="/assets/home/heart.svg" alt="" />
            <h3 className="text-black-700 text-[28px] text-center">Discover Original Art You Love</h3>
            <h5 className="text-black-900 text-wrap text-center text-[16px]">Find the perfect piece by browsing our carefully curated collection.</h5>
        </div>
        <div className="flex flex-col gap-[30px] w-[276px] items-center">
            <img className="w-[70px] h-[70px]" src="/assets/home/tick.svg" alt="" />
            <h3 className="text-black-700 text-[28px] text-center">Easily Place Your Order Online</h3>
            <h5 className="text-black-900 text-wrap text-center text-[16px]">Check out smoothly. Once we receive your order, we ship your artwork securely and are here to help every step of the way.</h5>
        </div>
        <div className="flex flex-col gap-[30px] w-[276px] items-center">
            <img className="w-[70px] h-[70px]" src="/assets/home/happy.svg" alt="" />
            <h3 className="text-black-700 text-[28px] text-center">Open Your New Artwork and Enjoy</h3>
            <h5 className="text-black-900 text-wrap text-center text-[16px]">Love at first sight. If not, simply return it within 14 days.</h5>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
