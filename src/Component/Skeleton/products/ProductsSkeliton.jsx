import React from "react";

const ProductsSkeliton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* SIDEBAR SKELETON */}
        <aside className="w-full lg:w-[300px] shrink-0 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="h-7 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
          </div>

          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* MAIN CONTENT SKELETON */}
        <main className="flex-grow">
          {/* Search Bar Skeleton */}
          <div className="h-14 bg-white border border-gray-200 rounded-2xl shadow-sm mb-3"></div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100/50 flex flex-col h-full"
              >
                {/* Image Area */}
                <div className="aspect-[5/5] bg-gray-200 relative">
                  <div className="absolute top-4 left-4 w-20 h-6 bg-gray-300 rounded-full"></div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-gray-300 rounded-full"></div>
                </div>

                {/* Content Area */}
                <div className="p-3 space-y-3 flex flex-col flex-grow">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>

                  <div className="grid grid-cols-5 gap-2 pt-2">
                    <div className="col-span-1 h-12 bg-gray-100 rounded-2xl"></div>
                    <div className="col-span-4 h-12 bg-gray-200 rounded-2xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 p-1 bg-white border border-gray-200 rounded-2xl shadow-sm h-14 w-64"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductsSkeliton;
