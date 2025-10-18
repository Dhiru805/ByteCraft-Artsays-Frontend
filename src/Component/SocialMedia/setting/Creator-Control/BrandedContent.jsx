import React, { useState } from "react";

const BrandedContent = () => {
  const [commentToggle, setCommentToggle] = useState(false);
  return (
    <div className="w-full h-full flex flex-col gap-3 py-3">
      <h1 className="text-[26px] text-[#000000] font-bold px-4">
        Branded Contents
      </h1>
      <div className="px-4 flex flex-col gap-3">
        <h2 className="text-[19px] text-[#000000] font-semibold">Status</h2>
        <div className="flex flex-col  gap-3 px-3">
          <div className="flex justify-between items-center">
            <h2 className="text-[19px] text-[#000000] font-semibold">
              Eligible
            </h2>
            <i class="ri-checkbox-circle-fill text-lg"></i>
            <div className="hidden lg:flex"></div>
          </div>
          <p className="text-[16px] text-[#000000] font-medium">
            You can use the paid partnership label.
          </p>
        </div>
      </div>
      <hr className="w-full h-[1px] bg-[#000000] my-4" />

      <div className="px-4 flex flex-col gap-6">
        <h2 className="text-[21px] text-[#000000] font-semibold">
          Paid partnership label
        </h2>
        <div className="flex flex-col gap-4 px-3">
          <div className="flex items-center justify-between">
            <p className="text-[19px] text-[#000000] font-semibold">
              Request approval from brand partners
            </p>
            <i class="ri-arrow-right-s-line text-[19px] text-[#000000] font-semibold"></i>
          </div>
          <div className="flex flex-col  gap-1">
            <div className="flex items-center justify-between">
              <p className="text-[19px] text-[#000000] font-semibold">
                Manually approve content creators
              </p>
              <label className="inline-flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={commentToggle}
                    onChange={() => setCommentToggle((s) => !s)}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-5 rounded-full transition ${
                      commentToggle ? "bg-[#4f3823]" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${
                      commentToggle ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
            <p className="text-[16px] font-medium text-[#000000]">
              Approve which content creators can add you to their branded
              content.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[19px] text-[#000000] font-semibold">
              Approve content creators
            </p>
            <i class="ri-arrow-right-s-line text-[19px] text-[#000000] font-semibold"></i>
          </div>
        </div>
      </div>

      <hr className="w-full h-[1px] bg-[#000000] my-4" />
      <div className="px-4 flex flex-col gap-4">
        <h2 className="text-[21px] text-[#000000] font-semibold">Support</h2>
        <div className="flex items-center px-3 justify-between">
          <p className="text-[17px] text-[#000000] font-semibold ">
            Learn more
          </p>
          <i class="ri-arrow-right-s-line text-[19px] text-[#000000] font-semibold"></i>
        </div>
      </div>
    </div>
  );
};

export default BrandedContent;
