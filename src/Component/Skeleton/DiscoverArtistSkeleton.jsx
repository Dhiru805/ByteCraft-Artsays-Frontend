import React from 'react';

/**
 * Skeleton Loader component for a simple section header 
 * that includes a title, a search bar, and a description.
 */
const DiscoverArtistSkeleton = () => {
  return (
    // 1. Main Container (Mimics max-width and padding)
    <div className="max-w-[1440px] mx-auto py-4 px-3 animate-pulse">
      
      {/* 2. Header Grid (Title and Search) */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
          
          {/* Title Placeholder */}
          <div className="md:col-span-3 h-8 md:h-10 bg-gray-300 rounded-lg w-3/4 px-3"></div>
          
          {/* Search Bar Placeholder (Hidden on mobile) */}
          <div className="hidden lg:block justify-self-end w-full sm:w-64">
            <div className="w-full pl-10 pr-4 py-2 h-10 border border-gray-300 rounded-xl bg-white relative">
              {/* Mock search icon placeholder */}
              <div className="w-5 h-5 absolute left-3 top-2.5 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Separator Line Placeholder */}
        <hr className="my-3 border-gray-300" />

        {/* Description Paragraph Placeholder */}
        <div className="mt-3 px-3">
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverArtistSkeleton;