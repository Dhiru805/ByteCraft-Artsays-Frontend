import React, { useState } from "react";

const ViewCounts = () => {
  const [viewCountToggle, setViewCountToggle] = useState(false);
  return (
    <div className="w-full h-full py-2 flex flex-col gap-6 px-4">
      <h1 className=" text-[26px] text-[#000000] font-bold ">
        View counts on profile
      </h1>

      <label className="px-4 inline-flex items-center justify-between cursor-pointer ">
        <div className="text-[17px] font-medium text-[#000000]">
          When this is on, no one will see views counts on your products tab.
        </div>
        <div className="relative">
          <input
            type="checkbox"
            checked={viewCountToggle}
            onChange={() => setViewCountToggle((s) => !s)}
            className="sr-only"
          />
          <div
            className={`w-10 h-5 rounded-full transition ${
              viewCountToggle ? "bg-[#4f3823]" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-gray-100 shadow transform transition ${
              viewCountToggle ? "translate-x-5" : "translate-x-0"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default ViewCounts;
