import React from 'react';

const BrowserCategorySkeleton = () => {
  const categoriesCount = 6; 

  return (
    // 1. Main Container (Mimics max-width and padding)
    <div className="max-w-[1440px] mx-auto py-4 px-3 animate-pulse">
      
      {/* 2. Header Grid (Title and Button) */}
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

      {/* 3. Description Paragraph Placeholder */}
      <div className="mt-3 px-3">
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-11/12 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* 4. Scrollable Categories Placeholder */}
      <div
        className="flex gap-3 overflow-x-hidden p-6"
      >
        {[...Array(categoriesCount)].map((_, index) => (
          <div
            key={index}
            // Mimics the size and shape of the category button
            className="flex-shrink-0 relative h-14 w-40 bg-gray-300 border-2 border-gray-400 rounded-full transition-all duration-500 ease-in-out"
          >
            {/* The hover effect (letter 'A') area is represented by a darker block */}
            <div className="absolute right-0 top-0 bottom-0 w-14 bg-gray-400 rounded-full transition-all duration-500 ease-in-out"></div>
          </div>
        ))}
      </div>
      
      {/* Fallback for the hidden scrollbar styles (Not functionally needed for skeleton, but good for completeness) */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default BrowserCategorySkeleton;