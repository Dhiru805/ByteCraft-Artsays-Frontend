import React from "react";

const CheckOutSkeleton = () => {
  return (
    <div className="max-w-[1464px] animate-pulse">
      <div className="lg:flex gap-6 space-y-6 lg:space-y-0">
        {/* Left Column - Shipping Details */}
        <div className="lg:col-span-2 w-full space-y-8">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-xl relative overflow-hidden">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-64 bg-gray-100 rounded"></div>
              </div>
            </div>

            {/* Form Fields Skeleton */}
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-gray-100 rounded ml-1"></div>
                    <div className="h-12 w-full bg-gray-50 rounded-2xl"></div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-gray-100 rounded ml-1"></div>
                    <div className="h-12 w-full bg-gray-50 rounded-2xl"></div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-100 rounded ml-1"></div>
                <div className="h-12 w-full bg-gray-50 rounded-2xl"></div>
              </div>

              {/* Address Selection Skeleton */}
              <div className="space-y-3 pt-4">
                <div className="h-4 w-40 bg-gray-100 rounded ml-1"></div>
                <div className="grid gap-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 w-full bg-gray-50 rounded-xl border border-gray-100"></div>
                  ))}
                </div>
              </div>

              {/* Billing Address Section Skeleton */}
              <div className="pt-8 border-t border-gray-100">
                <div className="h-4 w-32 bg-gray-100 mb-4 rounded ml-1"></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 w-full bg-gray-50 rounded-2xl border border-gray-100"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-10 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl">
              <div className="h-8 w-40 bg-gray-200 rounded-lg mb-8"></div>
              
              {/* Summary Items Skeleton */}
              <div className="space-y-6 mb-8">
                {[1, 2].map((i) => (
                  <div key={i} className="flex justify-between items-start border-b border-gray-50 pb-4">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                      <div className="h-3 w-1/3 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-5 w-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>

              {/* Totals Skeleton */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-100 rounded"></div>
                  <div className="h-4 w-20 bg-gray-100 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-100 rounded"></div>
                  <div className="h-4 w-20 bg-gray-100 rounded"></div>
                </div>
                <div className="h-px border-t border-dashed border-gray-200 pt-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 w-28 bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Button Skeleton */}
              <div className="h-14 w-full bg-gray-200 rounded-2xl"></div>
            </div>

            {/* Protection Badge Skeleton */}
            <div className="h-28 w-full bg-gray-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutSkeleton;
