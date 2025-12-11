import React from 'react';

const BiddingArenaSkeleton = ({ cardCount = 4 }) => {
  const cardSkeletons = [...Array(cardCount).keys()];

  const CardSkeleton = () => (
    <div className="mx-auto w-full max-w-sm rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-100 product-card relative">
      
      <div className="absolute top-3 left-3 h-5 w-16 bg-red-400 rounded-full shadow"></div>

      <div className="relative p-img">
        <div className="w-full h-40 sm:h-64 bg-gray-300 object-cover rounded-t-2xl product-img"></div>
        
        <div className="absolute bottom-3 right-3 p-2 w-8 h-8 bg-gray-500 rounded-full shadow"></div>
      </div>

      <div className="p-3 product-info">
        <div className="h-3 w-1/4 bg-gray-200 rounded mb-1"></div>
        
        <div className="h-5 w-3/4 bg-gray-400 rounded mt-1 mb-2"></div>
        
        <div className="h-4 w-1/3 bg-gray-300 rounded flex items-center mb-2"></div>
        
        <div className="grid items-center gap-1 mt-2">
          <div className="h-4 w-1/2 bg-red-400 rounded"></div>
          <div className="h-4 w-2/3 bg-red-400 rounded"></div> 
        </div>
      </div>

      {/* Action Buttons Placeholder (Hidden on mobile) */}
      <div className="p-3 product-button hidden md:block">
        <div className="flex justify-between gap-3">
          {/* Time Left Button */}
          <div className="flex-1 h-10 border border-gray-300 rounded-full bg-white"></div>
          {/* Bid Button */}
          <div className="flex-1 h-10 bg-gray-500 rounded-full shadow"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto py-4 px-3 animate-pulse">
      
      {/* 1. Header Section */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
          {/* Title Placeholder */}
          <div className="md:col-span-3 h-8 md:h-10 bg-gray-300 rounded-lg w-3/4 px-3"></div>
          
          {/* Button Placeholder (Hidden on mobile) */}
          <div className="hidden md:inline-flex items-center justify-center">
            <div className="h-10 w-32 bg-gray-400 rounded-full shadow"></div>
          </div>
        </div>

        {/* Separator Line Placeholder */}
        <hr className="my-3 border-gray-300" />

        {/* Description Paragraph Placeholder */}
        <div className="mt-3 px-3">
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-11/12 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>

      {/* 2. Card Grid Section */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-4">
        {cardSkeletons.map((idx) => (
          <CardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};

export default BiddingArenaSkeleton;