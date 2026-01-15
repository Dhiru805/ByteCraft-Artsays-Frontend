import React from "react";

const CelebrityCardskeliton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-pulse">

      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="w-full mx-auto rounded-[2rem] overflow-hidden flex flex-col border-2 border-[#d4d4d4] bg-[#f3f3f3]"
        >
          {/* Name Skeleton */}
          <div className="px-2 py-4 text-center">
            <div className="h-5 md:h-8 w-24 md:w-40 mx-auto bg-gray-300 rounded"></div>
            <div className="mt-3 h-3 md:h-4 w-32 md:w-52 mx-auto bg-gray-200 rounded"></div>
          </div>

          {/* Image Skeleton */}
          <div className="w-full h-40 sm:h-64 rounded-[2rem] border-t-2 border-gray-300 overflow-hidden">
            <div className="w-full h-full bg-gray-300"></div>
          </div>

          {/* Button Skeleton (Desktop Only) */}
          <div className="relative hidden md:block">
            <div className="absolute bottom-6 left-1/3 transform -translate-x-1/2">
              <div className="bg-gray-300/60 backdrop-blur-md h-10 w-36 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
};

export default CelebrityCardskeliton;
