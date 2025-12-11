import React from 'react';

/**
 * Skeleton Loader component for a section featuring a header and a 
 * 3-column grid of cards with overlapping, distinct circular icons.
 */
const WhyArtsaysDiffSkeleton = ({ cardCount = 3 }) => {
  const cardSkeletons = [...Array(cardCount).keys()];

  // Individual Card Skeleton component
  const CardSkeleton = () => (
    <div className="flex flex-col items-center relative h-[300px]"> 
        {/* Container to mimic the absolute positioning and z-index for the icon */}
        <div className="relative mb-0 z-[90] flex flex-col items-center -mt-6">
            
            {/* The absolute, rotated square background piece (optional detail) */}
            <div className="absolute bottom-[-10px] z-1 left-1/2 transform -translate-x-1/2 rotate-45 w-12 h-12 bg-gray-400"></div>

            {/* Circular Icon Container Placeholder */}
            <div className="relative w-24 h-24 rounded-full bg-gray-500 shadow-lg z-10">
                {/* Image Icon Placeholder (inner part) */}
                <div className="absolute inset-4 bg-gray-300 rounded-full"></div> 
            </div>
        </div>

        {/* Main Card Body Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full h-[200px] pt-10 text-center relative z-10 -mt-10">
            {/* Title Placeholder */}
            <div className="h-6 w-3/4 bg-gray-500 rounded mx-auto mb-3"></div>
            
            {/* Description Placeholder */}
            <div className="text-gray-600 text-sm mt-2">
                <div className="h-4 w-11/12 bg-gray-200 rounded mb-1 mx-auto"></div>
                <div className="h-4 w-full bg-gray-200 rounded mx-auto"></div>
                <div className="h-4 w-10/12 bg-gray-200 rounded mx-auto"></div>
            </div>
        </div>
    </div>
  );

  return (
    // 1. Main Container (Mimics background color, max-width, and padding)
    <div className="bg-[#F8F8F8] animate-pulse">
      <div className="max-w-[1440px] mx-auto py-4 px-3">
        
        {/* 2. Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
          {/* Title Placeholder */}
          <div className="md:col-span-3 h-8 md:h-10 bg-gray-300 rounded-lg w-3/4 px-3"></div>
          
          {/* Button Placeholder (Hidden on mobile) */}
          <div className="hidden md:block flex-1">
            <div className="h-10 w-32 bg-red-400 rounded-full shadow mx-auto md:mx-0"></div>
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
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {cardSkeletons.map((idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default WhyArtsaysDiffSkeleton;