import React from 'react';

/**
 * Skeleton Loader component for the Challenges Section.
 * Mimics the header and the alternating image/content layout for multiple challenge entries.
 */
const HomeChallengesSkeleton = ({ challengeCount = 2 }) => {
  const challengeSkeletons = [...Array(challengeCount).keys()];

  // Individual Challenge Item Skeleton
  const ChallengeItemSkeleton = ({ index }) => (
    // Mimics the alternating grid structure
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 py-6 px-3 sm:px-6 my-3`}
    >
      
      {/* Left/Right Column: Content Placeholder */}
      <div
        className={`md:p-4 content-center order-2 
          ${(index + 1) % 2 === 0 ? "md:!order-2" : "md:!order-1"}
        `}
      >
        {/* Days Left Tag Placeholder */}
        <div className="h-6 w-32 bg-gray-500 rounded-full my-3"></div>

        {/* Title Placeholder */}
        <div className="h-8 md:h-12 bg-gray-400 rounded-lg w-full mb-3"></div>
        <div className="h-8 md:h-12 bg-gray-400 rounded-lg w-5/6 mb-3"></div>
        
        {/* Separator */}
        <hr className="my-3 border-gray-300" />

        {/* Description Placeholder */}
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-11/12 mb-4"></div>

        {/* Tags Placeholder */}
        <div className="flex flex-wrap gap-2 pt-4 mb-4">
          <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Prize Box Placeholder */}
        <div className="flex items-center gap-4 py-4 rounded-xl max-w-md">
          <div className="w-12 h-12 rounded-full bg-gray-500"></div>
          <div>
            <div className="h-3 w-16 bg-gray-300 rounded mb-1"></div>
            <div className="h-4 w-40 bg-gray-400 rounded"></div>
          </div>
        </div>

        {/* Action Buttons Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-4">
          <div className="h-10 w-full bg-gray-500 rounded-full"></div>
          <div className="h-10 w-full border-2 border-gray-500 rounded-full bg-white"></div>
        </div>
      </div>

      {/* Right/Left Column: Image Placeholder */}
      <aside
        className={`${(index + 1) % 2 === 0 ? "md:!order-1" : "md:!order-2"} 
          order-1 rounded-2xl content-center justify-items-center bg-gray-200 h-60 sm:h-[400px] lg:h-[700px]
        `}
      >
        {/* Image area */}
        <div className="w-full h-full bg-gray-300 rounded-2xl"></div>
      </aside>
    </div>
  );

  return (
    // 1. Main Container
    <div className="max-w-[1440px] mx-auto py-4 px-3 animate-pulse">
      
      {/* 2. Header Section */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
          {/* Title Placeholder */}
          <div className="md:col-span-3 h-8 md:h-10 bg-gray-300 rounded-lg w-3/4 px-3"></div>
        </div>

        {/* Separator Line Placeholder */}
        <hr className="my-3 border-gray-300" />

        {/* Description Paragraph Placeholder */}
        <p className="mt-3 px-3">
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        </p>
      </div>

      {/* 3. Repeating Challenge Items */}
      {challengeSkeletons.map((idx) => (
        <ChallengeItemSkeleton key={idx} index={idx} />
      ))}
      
    </div>
  );
};

export default HomeChallengesSkeleton;