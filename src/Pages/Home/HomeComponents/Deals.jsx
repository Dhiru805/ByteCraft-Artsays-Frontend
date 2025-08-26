import React from "react";
import { bidItem } from "./FeaturedProducts";
import { Product } from "./FeaturedProducts";
const Deals = ({ deal }) => {
  return (
    // <div className="w-full bg-gray-100">
      <div className="px-[80px] py-[20px] pb-[80px]  max-w-[1440px] mx-auto">
        <h4 className="text-orange-200 font-semibold text-[40px] ">
         {deal.title}
        </h4>
        <div className="flex flex-row justify-between items-center mb-[24px]">
          <span className="text-[24px] font-normal text-black-900">
            {deal.description}
          </span>
          <button className="border-2  w-[153px] px-1.5 py-1 font-semibold  border-orange-200  text-center  text-[18px] rounded-[10px] ">
            Shop All
          </button>
        </div>

        <div className="flex flex-wrap flex-row justify-start  gap-[26px]">
          <Product product={bidItem} />
          <Product product={bidItem} />
          <Product product={bidItem} />
          <Product product={bidItem} />
       
        </div>
      </div>
    // </div>
  );
};

export default Deals;
