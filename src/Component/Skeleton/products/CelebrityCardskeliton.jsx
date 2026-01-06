import React from "react";

const CelebrityCardskeliton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 animate-pulse">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full"
        >
          {/* Name Skeleton */}
          <div className="p-6 text-center">
            <div className="h-7 w-3/4 mx-auto bg-gray-200 rounded-lg"></div>
          </div>

          {/* Image Skeleton */}
          <div className="relative aspect-square bg-gray-100 border-y border-gray-100">
            <div className="w-full h-full bg-gray-200"></div>
          </div>

          {/* Stats and Button Skeleton */}
          <div className="p-6 mt-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-5 w-16 bg-gray-100 rounded-full"></div>
            </div>
            
            <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CelebrityCardskeliton;
