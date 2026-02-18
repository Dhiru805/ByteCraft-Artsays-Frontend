import React from "react";
import { RiAccountPinBoxLine } from "react-icons/ri";

const MonetizationStatus = () => {
  return (
    <div className="w-full h-full ">
      <h1 className="pl-4 text-[26px] text-[#000000] font-bold mb-4">
        Monetisation status
      </h1>

      <div className="pl-10 pr-4 w-full flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-[21px] text-[#000000] font-bold">
            You're able to monetise
          </h2>
          <p className="text-[17px] text-[#000000] font-medium">
            You're currently following all policies and guidelines related to
            your monetisation tools.
          </p>
        </div>
        <div className="w-full flex items-center jsutify-between ">
          <div className="w-full flex items-center ">
            <RiAccountPinBoxLine className="text-[21px] text-[#000000]" />
            <h2 className="text-[20px] text-[#000000] font-semibold">
              Branded content
            </h2>
          </div>
          <i class="ri-checkbox-circle-fill text-[20px]"></i>
        </div>
      </div>
      <hr className="w-full h-[1px] bg-[#000000] my-5" />

      <div className="pl-4 flex flex-col gap-4">
        <h2 className="text-[21px] text-[#000000] font-bold">
          Current policy violations
        </h2>
        <div className="px-4 flex flex-col gap-1">
          <div className="flex items-center justify-between ">
            <p className="text-[19px] text-[#000000] font-semibold">
              Partner Monetisation Policies
            </p>

            <i class="ri-arrow-right-s-line text-[20px] text-[#000000] font-semibold"></i>
          </div>
          <div className="flex items-center justify-between ">
            <p className="text-[19px] text-[#000000] font-semibold">
              Content Monetisation Policies
            </p>

            <i class="ri-arrow-right-s-line text-[20px] text-[#000000] font-semibold"></i>
          </div>
          <div className="flex items-center justify-between ">
            <p className="text-[19px] text-[#000000] font-semibold">
              Community Standards
            </p>

            <i class="ri-arrow-right-s-line text-[20px] text-[#000000] font-semibold"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonetizationStatus;
