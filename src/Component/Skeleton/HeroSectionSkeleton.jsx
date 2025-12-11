import React from 'react';

const HeroSectionSkeleton = () => {
  return (
    // 1. Main Container (Mimics the background and fixed width)
    <div
      className="relative w-full overflow-hidden bg-cover bg-gray-100 animate-pulse"
      // Note: We intentionally omit the actual background image URL in the skeleton
      // but keep the structural classes.
    >
      <div className="relative max-w-[1440px] mx-auto py-3 z-10">
        
        {/* 2. Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-3 sm:px-6 my-3">
          
          {/* Left Column (Text, Search, Buttons) - col-span-2 on large screens */}
          <div className="col-span-2 flex flex-col items-center lg:items-start">
            
            {/* Title Line 1 */}
            <div className="h-10 w-3/4 md:h-12 lg:h-16 bg-gray-300 rounded-lg mb-2 mx-auto lg:mx-0"></div>
            <div className="h-10 w-5/6 md:h-12 lg:h-16 bg-gray-300 rounded-lg mb-4 mx-auto lg:mx-0"></div>

            {/* Title Line 2 (The animated text area) */}
            <div className="h-12 w-3/4 md:h-20 lg:h-28 bg-gray-400 rounded-lg mt-2 mb-4 mx-auto lg:mx-0"></div>
            
            {/* Search Bar / Dropdown Area */}
            <div className="relative w-full max-w-3xl mt-4">
              <div className="flex items-center justify-center w-full rounded-xl border border-gray-300 shadow-lg overflow-hidden bg-white">
                {/* Input Placeholder */}
                <div className="flex-1 px-4 py-4 h-12 bg-gray-200 rounded-l-xl"></div>
                {/* Search Button */}
                <div className="w-24 h-12 bg-[#f04a2f] text-white font-medium"></div>
              </div>

              {/* Mock Search Dropdown (Only if you want to show it actively open) 
              {open && ( 
              */}
                <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-2 z-50 p-4 border border-gray-200 hidden">
                  {/* Grid for Quick Picks */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-full h-16 bg-gray-200 rounded-md shadow"></div>
                        <div className="mt-2 h-4 w-3/4 bg-gray-300 rounded"></div>
                      </div>
                    ))}
                  </div>
                  {/* Tags */}
                  <ul className="flex flex-wrap gap-3 mb-4">
                    {[1, 2, 3].map((i) => (
                      <li key={i} className="h-6 w-24 bg-gray-200 rounded-full"></li>
                    ))}
                  </ul>
                  {/* Trending */}
                  <div className="border-t pt-3">
                    <div className="font-bold h-4 w-1/4 bg-gray-400 rounded mb-3"></div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="h-4 w-28 bg-gray-300 rounded"></div>
                      <div className="h-4 w-20 bg-gray-300 rounded"></div>
                      <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              {/* )} */}
            </div>

            {/* Description Text */}
            <div className="mt-4 max-w-2xl w-full mx-auto lg:mx-0">
              <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-4 justify-center lg:justify-start w-full">
              <div className="py-3 px-8 rounded-full font-bold h-12 w-32 bg-red-500 shadow"></div>
              <div className="py-3 px-8 rounded-full font-bold h-12 w-40 border-2 border-gray-300 bg-white"></div>
            </div>
          </div>

          {/* Right Column (Image/Slider) - Hidden on mobile, H:600px on large screen */}
          <div className="hidden lg:flex h-[600px] items-center justify-center relative overflow-hidden">
            <div className="w-full h-full bg-gray-300 rounded-lg shadow-xl">
              {/* Placeholder for the rotating image */}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Tag Section (Mimics the rounded bottom band) */}
      <div className="bg-white py-8 rounded-t-[2rem] lg:rounded-t-[6rem] shadow-[0_-10px_10px_rgba(0,0,0,0.15)] mt-4">
        <div className="max-w-[1440px] mx-auto flex flex-wrap justify-center gap-6">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400">
                {/* Placeholder for icon */}
              </div>
              <div className="h-6 w-24 bg-gray-300 rounded">
                {/* Placeholder for tag title */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionSkeleton;