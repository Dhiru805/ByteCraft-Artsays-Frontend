import React from "react";

const HomeChallengesSkeleton = () => {
  return (
    <div className="animate-pulse w-full bg-gray-50 font-[poppins] py-12 px-4 md:px-6">
      <div className="max-w-[1440px] mx-auto">
        {/* Header Skeleton */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="w-20 h-1.5 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          </div>
        </div>

        {/* Challenge Item Skeleton */}
        <div className="space-y-6">
          {[...Array(1)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-8 items-center"
            >
              {/* Image Skeleton */}
              <div className="w-full lg:w-2/5 aspect-[4/3] bg-gray-200 rounded-2xl"></div>

              {/* Text Skeleton */}
              <div className="w-full lg:w-3/5 space-y-4">
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                  <div className="h-6 bg-gray-100 rounded-full w-24"></div>
                </div>
                
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded w-16"></div>
                  <div className="h-6 bg-gray-100 rounded w-20"></div>
                  <div className="h-6 bg-gray-100 rounded w-14"></div>
                </div>

                {/* Prize Box */}
                <div className="h-20 bg-amber-50 rounded-2xl border border-amber-100 w-full max-w-sm"></div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="h-12 w-40 bg-gray-200 rounded-2xl"></div>
                  <div className="h-12 w-40 border-2 border-gray-200 rounded-2xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeChallengesSkeleton;
