import React from 'react';

/**
 * Skeleton Loader component for a standalone section featuring a header and a 
 * responsive 3-column grid of information/feature cards.
 */
const HowToSellSkeleton = ({ cardCount = 3 }) => {
  const cardSkeletons = [...Array(cardCount).keys()];

  // Individual Card Skeleton component
  const CardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center h-full">
      
      {/* Image Placeholder */}
      <div className="mx-auto mb-4 w-full max-w-[200px] h-32 bg-gray-300 rounded-lg"></div>

      {/* Title Placeholder */}
      <div className="h-6 w-3/4 bg-gray-400 rounded mx-auto mb-3"></div>
      
      {/* Description Placeholder */}
      <div className="text-gray-600 mt-2 text-sm">
        <div className="h-4 w-full bg-gray-200 rounded mb-1 mx-auto"></div>
        <div className="h-4 w-11/12 bg-gray-200 rounded mx-auto"></div>
      </div>

      {/* Icons Placeholder */}
      <div className="flex justify-center gap-3 mt-4">
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );

  return (
    // 1. Main Container (Mimics max-width and padding)
    <div className="max-w-[1440px] mx-auto py-4 px-3 animate-pulse">
      
      {/* 2. Header Section */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
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
      </div>

      {/* 3. Card Grid Section */}
      <section className="w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {cardSkeletons.map((idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HowToSellSkeleton;