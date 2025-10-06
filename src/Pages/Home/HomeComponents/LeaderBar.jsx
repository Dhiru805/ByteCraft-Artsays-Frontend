import React from "react";

const LeaderBar = () => {
  return (
    <div className="mw-full bg-base mx-auto ">
      <div className="max-w-[1440px] min-h-[408px] flex  gap-[18px] flex-row items-center justify-evenly mx-auto p-[80px] mb-[40px]">
        <div className=" flex-col flex gap-4">
          <h2 className="text-[40px] text-orange-200 font-bold ">Leaders in Investment Technology</h2>
          <h4 className="text-[16px] text-black font-normal">Innovating the Future of Investment with Cutting-Edge Technology and Data-Driven Solutions.</h4>
          <button className="border-2 h-[48px]   w-[176px] px-1.5 py-1 font-semibold  bg-orange-200  text-center  text-base text-[18px] rounded-[10px] ">
            Explore More
          </button>
        </div>
        <div className="flex h-[256px] flex-col items-center justify-center gap-[20px] py-[42px] px-[30px] text-center shadow-md rounded-md ">
          <h2 className="text-[30px] text-orange-200 font-bold font-oswald ">Our Business Productions</h2>
          <h4 className="text-[16px] text-black font-normal">Use this paragraph to describe what you do. Add information that visitors may find interesting..</h4>
          <button className="border-2 font-semibold h-[38px]   w-[176px] px-1.5 py-1 border-orange-200  text-center  text-black-900  text-base text-[16px] rounded-[25px] ">
            Buy
          </button>
        </div>
        <div className="flex h-[256px] flex-col items-center justify-center gap-[20px] text-center py-[42px] px-[30px] shadow-md rounded-md ">
          <h2 className="text-[30px] text-orange-200 font-bold text-center  font-oswald">Our approach in Investment</h2>
          <h4 className="text-[16px] text-black font-normal">Use this paragraph to describe what you do. Add information that visitors may find interesting.</h4>
          <button className="border-2 h-[48px]   w-[176px] px-1.5 py-1 font-semibold   border-orange-200  text-center  text-black-900 text-[16px] rounded-[25px]">
            Resell
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderBar;
