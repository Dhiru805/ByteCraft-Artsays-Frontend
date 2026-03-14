import React from "react";

const HowItWorks = () => {
  return (
    <div className="p-[80px] max-w-[1440px] mx-auto  bg-white ">
      <div className="flex flex-col gap-[24px] text-center  ">
        <h2 className="text-center text-[40px]  font-bold text-orange-200 ">
          HOW IT WORKS
        </h2>
        <h3 className="text-[24px] font-normal text-black-900 ">
        
          Buy, Sell, or Bid on Verified Art with Ease
        </h3>
      </div>

      <div className="flex flex-row justify-between mt-[24px]">
        <div className="flex flex-col w-[276px] gap-[30px] items-center">
            <img className="w-[70px] h-[70px]" src="/assets/home/heart.svg" alt="Heart Icon" width="70" height="70" />
            <h4 className="text-black-700 text-[28px] text-center">Discover Original Art You Love</h4>
            <p className="text-black-900 text-wrap text-center text-[16px]">Find the perfect piece by browsing our carefully curated collection.</p>
        </div>
        <div className="flex flex-col gap-[30px] w-[276px] items-center">
            <img className="w-[70px] h-[70px]" src="/assets/home/tick.svg" alt="Tick Icon" width="70" height="70" />
            <h4 className="text-black-700 text-[28px] text-center">Easily Place Your Order Online</h4>
            <p className="text-black-900 text-wrap text-center text-[16px]">Check out smoothly. Once we receive your order, we ship your artwork securely and are here to help every step of the way.</p>
        </div>
        <div className="flex flex-col gap-[30px] w-[276px] items-center">
            <img className="w-[70px] h-[70px]" src="/assets/home/happy.svg" alt="Happy Icon" width="70" height="70" />
            <h4 className="text-black-700 text-[28px] text-center">Open Your New Artwork and Enjoy</h4>
            <p className="text-black-900 text-wrap text-center text-[16px]">Love at first sight. If not, simply return it within 14 days.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
