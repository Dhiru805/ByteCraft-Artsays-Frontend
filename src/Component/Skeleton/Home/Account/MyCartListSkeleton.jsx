import React from "react";

const MyCartListSkeleton = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8 animate-pulse">
      {/* Title Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-7 w-20 bg-gray-100 rounded-full"></div>
        </div>
        <div className="h-6 w-32 bg-gray-100 rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section - Items */}
        <div className="lg:col-span-8 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                {/* Image Skeleton */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-3xl"></div>
                
                {/* Content Skeleton */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="h-6 w-3/4 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 w-1/4 bg-gray-100 rounded-md"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
                      <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-8 md:gap-12">
                    <div className="space-y-2">
                      <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
                      <div className="h-4 w-16 bg-gray-100 rounded ml-auto"></div>
                    </div>
                    <div className="h-10 w-28 bg-gray-100 rounded-2xl"></div>
                    <div className="flex gap-2">
                      <div className="w-11 h-11 bg-gray-100 rounded-2xl"></div>
                      <div className="w-11 h-11 bg-gray-100 rounded-2xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section - Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="h-8 w-48 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-28 bg-gray-100 rounded"></div>
                  <div className="h-4 w-20 bg-gray-100 rounded"></div>
                </div>
              ))}
              <div className="h-px bg-gray-100 my-6"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="h-8 w-28 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-14 w-full bg-gray-200 rounded-2xl mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 w-full bg-gray-50 rounded-xl"></div>
              <div className="h-12 w-full bg-gray-50 rounded-xl"></div>
            </div>
          </div>
          <div className="h-32 w-full bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default MyCartListSkeleton;
