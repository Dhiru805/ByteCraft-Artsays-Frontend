import React from "react";

const MyCartListSkeleton = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 animate-pulse">
      {/* Title Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
        <div className="h-6 w-32 bg-gray-100 rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section - Items */}
        <div className="lg:col-span-8 space-y-4">
          {/* Desktop Header Skeleton */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 rounded-t-2xl">
            <div className="col-span-6 h-4 w-24 bg-gray-200 rounded"></div>
            <div className="col-span-2 h-4 w-12 bg-gray-200 rounded mx-auto"></div>
            <div className="col-span-2 h-4 w-16 bg-gray-200 rounded mx-auto"></div>
            <div className="col-span-2 h-4 w-16 bg-gray-200 rounded ml-auto"></div>
          </div>

          {/* Item Cards Skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-6 flex items-center gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-4 w-16 bg-gray-100 rounded"></div>
                      <div className="h-4 w-20 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 flex md:block justify-between">
                  <div className="md:hidden h-4 w-12 bg-gray-100 rounded"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded md:mx-auto"></div>
                </div>
                <div className="md:col-span-2 flex md:block justify-between">
                  <div className="md:hidden h-4 w-16 bg-gray-100 rounded"></div>
                  <div className="h-8 w-24 bg-gray-100 rounded md:mx-auto"></div>
                </div>
                <div className="md:col-span-2 flex md:block justify-between">
                  <div className="md:hidden h-4 w-16 bg-gray-100 rounded"></div>
                  <div className="h-7 w-20 bg-gray-200 rounded md:ml-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section - Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="h-7 w-40 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-100 rounded"></div>
                  <div className="h-4 w-16 bg-gray-100 rounded"></div>
                </div>
              ))}
              <div className="h-px bg-gray-100 my-4"></div>
              <div className="flex justify-between">
                <div className="h-8 w-28 bg-gray-200 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-14 w-full bg-gray-200 rounded-2xl"></div>
          </div>
          
          <div className="h-28 w-full bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default MyCartListSkeleton;
