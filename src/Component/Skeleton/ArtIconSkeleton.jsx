import React from 'react';

/**
 * Skeleton Loader component for the Celebrity/Artist Section.
 * Mimics the header and the responsive 3-column grid of styled cards.
 */
const ArtlconSkeleton = ({ cardCount = 3 }) => {
  const cardSkeletons = [...Array(cardCount).keys()];

  // Individual Card Skeleton component
  const CardSkeleton = () => (
    <div className="w-full mx-auto rounded-[2rem] overflow-hidden flex flex-col border-2 border-gray-400 bg-gray-100 h-[400px]">
      
      {/* Name Placeholder */}
      <div className="px-2 py-4 text-center">
        <div className="h-6 w-3/4 bg-gray-400 rounded-lg mx-auto"></div>
      </div>

      {/* Image Area Placeholder */}
      <div className="w-full h-40 sm:h-64 rounded-[2rem] border-t-2 border-gray-400 overflow-hidden flex items-center justify-center">
        {/* Main image block */}
        <div className="w-full h-full bg-gray-300"></div>
      </div>

      {/* Button Area Placeholder (Hidden on mobile) */}
      <div className="relative h-16 hidden md:block">
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          {/* Button Placeholder */}
          <div className="h-10 w-40 bg-gray-200/70 backdrop-blur-md rounded-full shadow-md"></div>
        </div>
      </div>
    </div>
  );

  return (
    // 1. Main Container (Mimics background color, max-width, and padding)
    <div className="bg-[#F8F8F8] animate-pulse">
      <div className="max-w-[1440px] mx-auto py-4 px-3">
        
        {/* 2. Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3 items-center">
          {/* Title Placeholder */}
          <div className="md:col-span-3 h-8 md:h-10 bg-gray-300 rounded-lg w-3/4 px-3"></div>
          
          {/* Button Placeholder (Hidden on mobile) */}
          <div className="hidden md:inline-flex items-center justify-center">
            <div className="h-10 w-32 bg-red-400 rounded-full shadow-md"></div>
          </div>
        </div>

        {/* Separator Line Placeholder */}
        <hr className="my-3 border-gray-300" />

        {/* Description Paragraph Placeholder */}
        <p className="mt-3 px-3">
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        </p>

        {/* 3. Card Grid Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {cardSkeletons.map((idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtlconSkeleton;